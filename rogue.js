/* Fruit Merge: Rogue mode rules and the player profile. Loaded before the main script in index.html.
   Nothing here touches the page. It uses rint and store from index.html, but only inside functions, so load order is fine. */
/* ---------- rogue mode: rules (charms, bosses, shop, scoring) ---------- */
const DEPTHS=8,SLOTS=5,RDROPS=24,TS0=2,TSLOTS=4,RV=9; /* RV = run save version. Bump it when the run object changes shape, older saved runs are dropped */
const RQ=[100,130,160]; /* depth 1 score targets: jar 1, jar 2, boss */
const RSC=[1,2.6,6,13,27,55,100,180],RSCX=2; /* target multiplier per depth, then ×RSCX for every endless depth */
const RPAY=[3,4,6],RAR=['Common','Uncommon','Rare','Fused'];
/* Charms. r = rarity, c = price, d = description. Scoring hooks get a context c:
   l = fruit tier made (-1 when not a merge), combo, bull, enc, n = fruit in the jar, jd/dl = drops made/left this jar, jm = merges this jar,
   first = the first time this size is made this jar, wall = a merging fruit touched a wall, low = the merge was in the bottom third of the jar, trick = a thrown fruit hit a wall and then merged before touching anything else, pu = different tools used this jar, tu = tool uses this jar, gold = gold fruit in the jar, sdl = seed levels held, full = every charm slot is filled, high = pile at the gold line, coins, luck, nc = charms owned, ch = this charm's saved state.
   chip adds points, add adds Mult, x multiplies Mult. Charms with no hook are handled in makeGame or RG.
   dev = a prototype: only in the dev panel, never in the shop, crates or Almanac.
   fu = [a, b]: a fusion, made from those two charms. Fusions are rarity 3, never sold, and only come out of boss crates. */
const CH={
 juicer:{n:'Juicer',r:0,c:5,d:'+1 Mult.',add:()=>1},
 honey:{n:'Honey Pot',r:0,c:5,d:'Every merge scores +8 points.',chip:()=>8},
 chain:{n:'Chain Reaction',r:0,c:5,d:'In a combo, each merge after the first gets +1 Mult more than the one before (up to +8).',add:c=>Math.min(8,c.combo)},
 bull:{n:'Bullseye',r:0,c:5,d:'A dropped fruit that merges before it touches anything else scores ×2.',x:c=>c.bull?2:1},
 early:{n:'Early Bird',r:0,c:4,d:'×2 Mult for your first 6 drops of each jar.',x:c=>c.jd<=6?2:1},
 clutch:{n:'Photo Finish',r:0,c:4,d:'×2.5 Mult for your last 5 drops of each jar.',x:c=>c.dl<5?2.5:1},
 lucky:{n:'Lucky Clover',r:0,c:5,d:'1 in 4 merges score ×3.',x:c=>c.l>=0&&Math.random()<.25*c.luck?3:1},
 scratch:{n:'Scratch Card',r:0,c:4,d:'1 in 6 merges pays 1 coin.'},
 lode:{n:'Lodestone',r:0,c:4,d:'Every 5th drop is a Magnet that pulls its matches in.'},
 piggy:{n:'Piggy Bank',r:0,c:4,d:'+3 coins every time you clear a jar.'},
 bag:{n:'Big Basket',r:0,c:5,d:'+5 drops in every jar.'},
 juggle:{n:'Juggler',r:0,c:5,d:'When you use a tool, your other tools each gain 1 charge.'},
 spark:{n:'Spark Plug',r:0,c:5,d:'Every tool starts each jar fully charged.'},
 coupon:{n:'Coupon',r:0,c:4,d:'Everything in the shop costs 1 coin less.'},
 heavy:{n:'Heavyweight',r:1,c:7,d:'Merges that make a size 6 fruit or bigger score ×2.5.',x:c=>c.l>=5?2.5:1},
 hot:{n:'Hot Streak',r:1,c:6,d:'+0.15 Mult for every merge you have made this jar.',add:c=>c.jm*.15},
 vintage:{n:'Vintage',r:1,c:7,d:'Gains +0.4 Mult every time you clear a jar.',add:c=>c.ch.v||0,live:1},
 hoard:{n:'Hoarder',r:1,c:6,d:'+0.15 Mult for every fruit in the jar.',add:c=>c.n*.15},
 tidy:{n:'Clean Plate',r:1,c:7,d:'×2 Mult while the jar holds 6 fruit or fewer.',x:c=>c.n<=6&&!c.idle?2:1},
 wallet:{n:'Fat Wallet',r:1,c:7,d:'+0.1 Mult for every coin you hold.',add:c=>c.coins*.1},
 boom:{n:'Fireworks',r:1,c:6,d:'Every 6th drop is a Boom fruit. Each fruit it blows up scores 20 points.'},
 pet:{n:'Pet Caterpillar',r:1,c:6,d:'Every 5 drops it eats a small fruit (size 3 or less) for 30 points.'},
 compost:{n:'Compost',r:1,c:6,d:'Gains +0.05 Mult every time a fruit is destroyed (Boom, caterpillar, Scrub, Safety Net).',add:c=>c.ch.v||0,live:1},
 show:{n:'Showman',r:1,c:6,d:'The first time you use each tool in a jar gives +1 Mult until the jar ends.',add:c=>c.pu},
 drive:{n:'Overdrive',r:1,c:6,d:'+0.3 Mult for every tool use this jar.',add:c=>c.tu*.3},
 crowd:{n:'Crowd Pleaser',r:1,c:6,d:'Every tool use scores 25 points.'},
 encore:{n:'Encore',r:1,c:6,d:'After you use a tool, your next merge scores ×3.',x:c=>c.enc&&c.l>=0?3:1},
 battery:{n:'Battery',r:1,c:6,d:'Tools gain double charge.'},
 shoe:{n:'Horseshoe',r:1,c:6,d:'Every "1 in" chance comes up twice as often.'},
 metro:{n:'Metronome',r:1,c:6,d:'Combos stay alive for 2.5 seconds instead of 1.'},
 net:{n:'Safety Net',r:1,c:6,d:'If the pile overflows, the top half of the jar is cleared instead. Works once.'},
 bank:{n:'Savings Account',r:1,c:6,d:'Interest can pay up to 8 coins per jar instead of 4.'},
 gold:{n:'Golden Touch',r:1,c:6,d:'Earn 1 coin whenever you make a size 6 fruit or bigger.'},
 dynamo:{n:'Dynamo',r:2,c:8,d:'Every drop gives each tool 1 charge.'},
 snake:{n:'Snake Eyes',r:0,c:5,d:'1 in 6 merges score ×4.',x:c=>c.l>=0&&Math.random()<c.luck/6?4:1},
 magpie:{n:'Magpie',r:1,c:6,d:'+1 Mult for every gold fruit in the jar.',add:c=>c.gold||0},
 ash:{n:'Ashes',r:1,c:6,d:'Every fruit that is destroyed scores 15 points.'},
 crit:{n:'Sweet Spot',r:2,c:8,d:'Every 7th merge of a jar scores ×5.',x:c=>c.l>=0&&c.jm>0&&c.jm%7===0?5:1},
 abacus:{n:'Abacus',r:2,c:8,d:'+0.5 Mult for every seed level you hold.',add:c=>c.sdl*.5},
 crew:{n:'Full House',r:2,c:9,d:'×2 Mult while every charm slot is filled.',x:c=>c.full?2:1},
 soil:{n:'Rich Soil',r:2,c:9,d:'Every fruit you drop is one size bigger.'},
 wire:{n:'High Wire',r:2,c:8,d:'×3 Mult while the pile reaches the gold line near the top of the jar.',x:c=>c.high?3:1},
 ribbon:{n:'Blue Ribbon',r:2,c:9,d:'×0.3 Mult more for every charm you own, this one included.',x:c=>1+.3*c.nc},
 fever:{n:'Melon Fever',r:2,c:9,d:'Gains +1.5 Mult every time you make a size 8 fruit or bigger.',add:c=>c.ch.v||0,live:1},
 /* thin builds (see DESIGN.md): small fruit, seeds, gold, position */
 fry:{n:'Small Fry',r:0,c:4,d:'Merges that make a size 4 fruit or smaller score ×2.',x:c=>c.l>=1&&c.l<=3?2:1},
 pip:{n:'Pip Collector',r:1,c:6,d:'Gains +0.03 Mult every time you make a size 3 fruit or smaller.',add:c=>c.ch.v||0,live:1},
 bite:{n:'Bite Size',r:1,c:6,d:'Fruit you drop are never bigger than size 3. Every merge scores +4 points.',chip:()=>4},
 gard:{n:'Gardener',r:0,c:4,d:'Every boss you beat (mini bosses too) gives a random seed 1 level.'},
 packet:{n:'Seed Packet',r:0,c:4,d:'Seeds cost 1 coin less.'},
 sprout:{n:'Sprout',r:1,c:6,d:'The first time you make each fruit size in a jar, its seed counts double.'},
 leaf:{n:'Gold Leaf',r:0,c:4,d:'The first fruit you drop in each jar is gold.'},
 prosp:{n:'Prospector',r:1,c:6,d:'1 in 10 fruit you drop are gold.'},
 alch:{n:'Alchemy',r:1,c:6,d:'1 in 3 times a gold fruit merges, the fruit it makes is gold too.'},
 wall:{n:'Wallflower',r:0,c:4,d:'Merges touching a wall score +20 points.',chip:c=>c.wall?20:0},
 low:{n:'Low Tide',r:1,c:7,d:'Merges in the bottom third of the jar score ×2.',x:c=>c.low?2:1},
 /* prototypes (dev panel only): throwing fruit */
 sling:{n:'Slingshot',r:1,c:6,dev:1,d:'Flick as you let go to throw your fruit sideways. The faster the flick, the harder the throw.'},
 trick:{n:'Trick Shot',r:1,c:6,dev:1,d:'A thrown fruit that bounces off a wall and merges before touching anything else scores ×3.',x:c=>c.trick?3:1},
 fourleaf:{n:'Four-Leaf Clover',r:3,c:12,fu:['lucky','shoe'],d:'1 in 2 merges score ×3. Every other "1 in" chance comes up twice as often.',x:c=>c.l>=0&&Math.random()<.5?3:1},
 goose:{n:'Golden Goose',r:3,c:12,fu:['piggy','bank'],d:'+4 coins every time you clear a jar. Interest can pay up to 10 coins per jar.'},
 volcano:{n:'Volcano',r:3,c:12,fu:['boom','compost'],d:'Every 5th drop is a Boom fruit. Each fruit it blows up scores 40 points. Gains +0.1 Mult every time a fruit is destroyed.',add:c=>c.ch.v||0,live:1},
 headline:{n:'Headliner',r:3,c:12,fu:['show','encore'],d:'Every tool use gives +1 Mult until the jar ends, and makes your next merge score ×3.',add:c=>c.tu,x:c=>c.enc&&c.l>=0?3:1},
 smoothie:{n:'Smoothie',r:3,c:12,fu:['juicer','honey'],d:'+2 Mult. Every merge scores +20 points.',add:()=>2,chip:()=>20},
 marathon:{n:'Marathon',r:3,c:12,fu:['early','clutch'],d:'×2 Mult. ×3 instead for your first 6 and last 5 drops of each jar.',x:c=>c.jd<=6||c.dl<5?3:2},
 wildfire:{n:'Wildfire',r:3,c:12,fu:['hot','chain'],d:'+0.3 Mult for every merge you have made this jar. In a combo, each merge gets +2 Mult more than the one before (up to +16).',add:c=>c.jm*.3+Math.min(16,c.combo*2)},
 mania:{n:'Melon Mania',r:3,c:14,fu:['heavy','fever'],d:'Merges that make a size 6 fruit or bigger score ×3. Gains +2 Mult every time you make a size 8 fruit or bigger.',add:c=>c.ch.v||0,x:c=>c.l>=5?3:1,live:1},
 mint:{n:'The Mint',r:3,c:12,fu:['scratch','gold'],d:'1 in 4 merges pays 1 coin. Earn 2 coins whenever you make a size 6 fruit or bigger.'},
 sharp:{n:'Sharpshooter',r:3,c:12,fu:['bull','lode'],d:'Every 4th drop is a Magnet. A dropped fruit that merges before it touches anything else scores ×4.',x:c=>c.bull?4:1}
};
/* Stakes: difficulty levels that stack. Stake n plays with every line from 2 to n. Winning on the highest stake you have opens the next. */
const STAKES=['The normal game.','Every jar pays 1 coin less.','Every target is 25% higher.','3 fewer drops in every jar.','Everything in the shop costs 1 coin more.','From depth 5 on, every depth has a mini boss.','1 charm slot fewer.','Bosses start in phase 2, and the final boss brings a second boss with it.'];
/* Starting jars. Each is a loadout with a twist. All but the first are opened by awards (jar.id in LOCK). The twists are read by id in RG. */
const JARS={
 classic:{n:'Classic Jar',d:'Swap, Shake and 4 coins. No twist.'},
 piggy:{n:'Piggy Jar',d:'Start with 12 coins. Interest can pay 2 more coins per jar. Every jar pays 1 coin less.'},
 tall:{n:'Deep Jar',d:'+4 drops in every jar. Every target is 15% higher.'},
 wide:{n:'Charm Jar',d:'+1 charm slot. You start with Swap only and hold 1 tool fewer.'},
 kit:{n:'Tool Kit',d:'Start with 3 tools and 3 tool slots. 1 charm slot fewer.'},
 bare:{n:'Crate Jar',d:'The shop sells no charms. Every jar you clear drops a wooden crate.'}
};
/* Bosses. d = the rule, d2 = what phase 2 adds (at half the target), min = first depth it can show up at, q = score target multiplier,
   fin = a final boss, only met at depth 8 and every 8th depth after. Every rule is a flag in makeGame's B, worth 1 in phase 1 and 2 in phase 2. */
const BOSS={
 fog:{n:'The Fog',d:'The Next box is hidden.',d2:'Your own fruit is hidden too.',min:1},
 glut:{n:'The Glutton',d:'A caterpillar eats one of your fruits every 3 drops.',d2:'It eats every 2 drops.',min:1},
 sticky:{n:'The Syrup',d:'Every 3rd fruit is Sticky and stays where it lands.',d2:'Every 2nd fruit is Sticky.',min:1},
 lock:{n:'The Padlock',d:'Tools are locked.',d2:'Every tool loses all its charge.',min:1},
 mirror:{n:'The Mirror',d:'Your aim is flipped left to right.',d2:'The Next box is hidden too.',min:1},
 hour:{n:'The Hourglass',d:'6 fewer drops.',d2:'2 more drops are taken away.',min:2},
 swarm:{n:'The Swarm',d:'Only the two smallest fruits drop.',d2:'Only the smallest fruit drops.',min:2,q:.6},
 rot:{n:'The Rot',d:'Small fruit resting on the bottom goes mouldy fast and stops merging.',d2:'Mould sets in twice as fast.',min:2},
 tax:{n:'The Taxman',d:'Takes a coin every 4 drops.',d2:'Takes a coin every 2 drops.',min:2},
 clock:{n:'The Clock',d:'Your fruit drops by itself after 3 seconds.',d2:'It drops after 2 seconds.',min:2},
 gamble:{n:'The Gambler',d:'Every fruit is a random size from 1 to 6.',d2:'Sizes go up to 7.',min:2},
 twins:{n:'The Twins',d:'Every merge that makes a size 3 fruit or bigger drops a size 1 fruit into the jar.',d2:'It drops 2 of them.',min:2},
 miser:{n:'The Miser',d:'Tools charge at half speed.',d2:'Tools stop charging.',min:2},
 ice:{n:'Cold Snap',d:'Every 4th fruit is Frozen. It freezes its neighbours, then they shrink a size.',d2:'Every 3rd fruit is Frozen.',min:3},
 stone:{n:'The Quarry',d:'Every 5th drop is a rock that never merges.',d2:'Every 3rd drop is a rock.',min:3},
 prune:{n:'The Pruner',d:'Merges that make a size 4 fruit or smaller score nothing.',d2:'Size 5 scores nothing either.',min:3},
 storm:{n:'The Storm',d:'A whirlpool hits every 6 drops.',d2:'A whirlpool hits every 4 drops.',min:3},
 thief:{n:'The Thief',d:'Your first charm does nothing.',d2:'Your first 2 charms do nothing.',min:3},
 tide:{n:'The Tide',d:'The line moves up and down.',d2:'It swings further down.',min:3},
 wilt:{n:'The Wilt',d:'Every 4 drops your biggest fruit shrinks one size.',d2:'It shrinks every 3 drops.',min:3},
 dark:{n:'The Blackout',d:'The lights go out. They come back on for a moment every 3 to 5 drops. You can still see the fruit you drop.',d2:'They come on every 4 to 6 drops, for less time.',min:3},
 collect:{n:'The Collector',d:'The jar only clears once you have also made a size 7 fruit.',d2:'If you have not made it yet, it must now be a size 8.',min:3},
 slick:{n:'The Slick',d:'Every fruit is Slippery.',d2:'The jar also shakes every 6 drops.',min:4},
 lid:{n:'The Lid',d:'The line sits lower in the jar.',d2:'The line drops lower still.',min:4},
 audit:{n:'The Auditor',d:'Mult can not go above ×6.',d2:'Mult can not go above ×4.',min:4,q:.45},
 vise:{n:'The Vise',d:'The walls close in with every drop. Making a size 6 fruit or bigger opens them again.',d2:'They close twice as fast.',min:4},
 vamp:{n:'The Leech',d:'Your jar score drains away: 0.5% of the target every second.',d2:'It drains twice as fast.',min:5,q:.7},
 melon:{n:'The Melon King',d:'A watermelon drops into your jar and stays. Keep the pile low.',d2:'A big rock drops in as well.',fin:1,q:1.1},
 queen:{n:'The Orchard Queen',d:'Two bosses at once.',d2:'Both step up.',fin:1},
 reaper:{n:'The Reaper',d:'Half the drops. Merges that make a size 4 fruit or bigger give 1 drop back.',d2:'Only a size 6 fruit or bigger gives a drop back.',fin:1,q:.9}
};
/* Upgrades. c = price, max = how many can be owned (none = no limit), now = used on the spot instead of owned.
   Owned ones cost 2 more each time. Effects are read through R.up[id] in RG and ro.up(id) in makeGame. */
const UPG={
 fert:{n:'Fertiliser',c:3,d:'Every merge scores +2 points for the rest of the run.'},
 sauce:{n:'Hot Sauce',c:4,d:'+0.25 Mult for the rest of the run.'},
 can:{n:'Watering Can',c:3,d:'+2 drops in every jar for the rest of the run.'},
 scrub:{n:'Scrub',c:3,now:1,d:'Right now: clears every size 1 and size 2 fruit out of the jar.'},
 bribe:{n:'Bribe',c:4,now:1,d:'Right now: swaps the next boss for a different one.'},
 belt:{n:'Tool Belt',c:6,max:2,d:'+1 tool slot (up to 4).'},
 pouch:{n:'Charm Pouch',c:10,max:1,d:'+1 charm slot.'},
 shelf:{n:'Bigger Shelf',c:5,max:1,d:'The shop offers 1 more charm.'},
 seedbag:{n:'Seed Bag',c:4,max:1,d:'The shop offers 1 more seed.'},
 dice:{n:'Loaded Dice',c:5,max:1,d:'The first reroll in every shop is free.'},
 taste:{n:'Good Taste',c:6,max:2,d:'Uncommon and Rare charms turn up in the shop more often.'},
 haggle:{n:'Haggler',c:4,max:1,d:'Charms and tools sell for their full price.'},
 vault:{n:'Vault',c:5,max:2,d:'Interest can pay 2 more coins per jar.'},
 lunch:{n:'Packed Lunch',c:5,max:3,d:'+1 coin every time you clear a jar.'},
 whet:{n:'Whetstone',c:6,max:2,d:'Every tool needs 1 less charge (never less than 2).'},
 fuse:{n:'Slow Fuse',c:4,max:2,d:'The pile can sit over the line 1 second longer before the run ends.'},
 drum:{n:'Tambourine',c:4,max:2,d:'Combos stay alive 0.5 seconds longer.'},
 crowbar:{n:'Crowbar',c:5,max:1,d:'Every crate offers 1 more choice.'}
};
/* Seeds level up one fruit size for the run. R.sd[l] = level for the fruit of tier l (1 to 10, shown to the player as size l+1).
   Each level: making that fruit scores sdP(l) more points and +SDM Mult. A seed costs SDC plus 1 per level already held. */
const SDC=3,SDM=.5,sdP=l=>4+2*l,sdD=l=>`Making a size ${l+1} fruit scores +${sdP(l)} points and +${SDM} Mult.`;
/* Tools: abilities the player taps during a jar. c = price, ch = charge needed (1 per merge), tg = the player then taps a fruit.
   What each one does is in tool() in makeGame, which fruit it can target in okTg().
   fu = [tool, charm]: a fusion. It takes the tool's slot and uses up the charm. */
const TL={
 swap:{n:'Swap',c:3,ch:3,d:'Swap your fruit with the next one.'},
 shake:{n:'Shake',c:4,ch:8,d:'Throw the whole pile into the air.'},
 whirl:{n:'Whirl',c:5,ch:10,d:'Swirl the whole pile around the jar.'},
 rumble:{n:'Rumble',c:4,ch:8,d:'Jiggle the pile for 3 seconds so it settles.'},
 ripen:{n:'Ripen',c:6,ch:10,tg:1,d:'Tap a fruit. It grows one size.'},
 twin:{n:'Twin',c:5,ch:8,tg:1,d:'Tap a fruit of size 6 or smaller. Your fruit becomes a copy of it.'},
 blend:{n:'Blender',c:6,ch:9,d:'The smallest fruits that can pair up all merge at once.'},
 sample:{n:'Free Sample',c:5,ch:8,d:'Your next 2 drops do not use up drops.'},
 cbomb:{n:'Cherry Bomb',c:5,ch:7,d:'Your fruit becomes a Boom fruit.'},
 lodestar:{n:'Lodestar',c:4,ch:5,d:'Your fruit becomes a Magnet that pulls its matches in.'},
 midas:{n:'Midas',c:6,ch:9,tg:1,d:'Tap a fruit. It turns gold. When it merges it scores ×2 and pays 2 coins.'},
 rewind:{n:'Rewind',c:4,ch:5,d:'Take back your last drop, if that fruit has not merged.'},
 ddown:{n:'Double Down',c:5,ch:6,d:'Costs 2 drops. Your next merge scores ×4.'},
 sieve:{n:'Sieve',c:4,ch:7,d:'Clears every size 1 fruit out of the jar.'},
 anchor:{n:'Anchor',c:4,ch:6,tg:1,d:'Tap a fruit. It cannot move until the jar ends.'},
 cash:{n:'Cash Out',c:5,ch:8,d:'Pays 2 coins.'},
 cyclone:{n:'Cyclone',c:12,ch:9,fu:['whirl','metro'],d:'Swirl the whole pile around the jar. Every merge scores ×2 for 6 seconds.'},
 sleight:{n:'Sleight of Hand',c:12,ch:1,fu:['swap','juggle'],d:'Swap your fruit with the next one. Your other tools each gain 2 charge.'},
 ghand:{n:'Golden Hand',c:12,ch:8,tg:1,fu:['midas','wallet'],d:'Tap a fruit. It turns gold. When it merges it scores ×3 and pays 4 coins.'}
};
/* Crates: pick one thing out of a few, for free. r = charm rarity odds, sd = seed levels in one pick, coin = the coin pick, out = coins for leaving it.
   Bosses drop gold (melon every 4th depth), skipping a jar gives wood, the shop sells wood crates of one kind (CRP = price). */
const CRT={wood:{n:'Wooden crate',r:[.6,.3,.1],sd:1,coin:5,out:2},gold:{n:'Gold crate',r:[.2,.5,.3],sd:2,coin:9,out:3},melon:{n:'Melon crate',r:[0,.3,.7],sd:3,coin:14,out:4}};
const CRP={ch:6,tl:5,sd:4},CRN={ch:'Charm Crate',tl:'Tool Crate',sd:'Seed Crate'},CRW={ch:'charms',tl:'tools',sd:'seeds'};
const ICN={lode:'magnet',boom:'bomb',pet:'cat',glut:'cat',rot:'mould',stone:'rock',storm:'whirl',slick:'drop',melon:'king',gamble:'dice',twins:'twin'}; /* things that share another icon (icons.js) */
const icn=id=>ICN[id]||id;
const nice=q=>{const m=Math.pow(10,Math.max(1,Math.floor(Math.log10(q))-1));return Math.round(q*(1+1e-9)/m)*m;};
const RG={
 new(jar='classic',stake=1){const pool=Object.keys(BOSS).filter(k=>!BOSS[k].fin),bs=[];for(let d=1;d<DEPTHS;d++){const c=pool.filter(k=>BOSS[k].min<=d&&!bs.includes(k));bs.push(c[rint(c.length)]);}bs.push(RG.fin());
  const tl=[RG.tool('swap')];if(jar!=='wide')tl.push(RG.tool('shake'));if(jar==='kit'){const k=Object.keys(TL).filter(k=>!TL[k].fu&&!PF.lk('tl.'+k)&&k!=='swap'&&k!=='shake');tl.push(RG.tool(k[rint(k.length)]));}
  return{v:RV,jarId:jar,stake,depth:1,jar:0,coins:jar==='piggy'?12:4,total:0,ch:[],tl,up:Object.fromEntries(Object.keys(UPG).map(k=>[k,0])),sd:Array(11).fill(0),bs,ms:{},bq:{},bx:{},off:0,shop:null,crate:null,pile:[],at:'hub',won:0,st:{},jst:{}};},
 /* the highest stake the player may pick: one above the best they have won on, with any jar */
 stakeMax:()=>Math.min(STAKES.length,1+Math.max(0,...Object.values((PF.d||PF.load()).stakes))),
 fin(){const f=Object.keys(BOSS).filter(k=>BOSS[k].fin);return f[rint(f.length)];},
 /* a saved run that this version can load, or null */
 saved(){const sv=store.get('run',null);if(sv&&sv.v!==RV){store.set('run',null);return null;}return sv;},
 /* the run's copy of a charm, if it holds one that is working (The Thief switches off the first R.off charms) */
 has:(R,id)=>{const i=R.ch.findIndex(c=>c.id===id);return i>=(R.off||0)?R.ch[i]:undefined;},
 /* tools: {id, c} where c is the charge held. New tools arrive charged */
 tool:(id,R)=>({id,c:R?RG.need(R,id):TL[id].ch}),
 tsMax:R=>TSLOTS-(R.jarId==='wide'?1:0),
 ts:R=>Math.max(1,Math.min(RG.tsMax(R),TS0+R.up.belt+(R.jarId==='kit'?1:0)-(R.jarId==='wide'?1:0))),
 slots:R=>Math.max(2,SLOTS+R.up.pouch+(R.jarId==='wide'?1:0)-(R.jarId==='kit'?1:0)-(R.stake>=7?1:0)),
 need:(R,id)=>Math.max(Math.min(2,TL[id].ch),TL[id].ch-R.up.whet),
 luck:R=>RG.has(R,'shoe')||RG.has(R,'fourleaf')?2:1,
 charge(R,n,skip){const k=n*(RG.has(R,'battery')?2:1);for(const t of R.tl)if(t!==skip)t.c=Math.min(RG.need(R,t.id),t.c+k);},
 fill(R){for(const t of R.tl)t.c=RG.need(R,t.id);},
 /* swap this depth's boss for another that is allowed here */
 bribe(R){const d=R.depth,cur=RG.boss(R),k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!==cur&&BOSS[k].min<=d&&k!==R.bs[d-2]&&k!==R.ms[d]);R.bs[d-1]=k[rint(k.length)];return R.bs[d-1];},
 boss(R,d=R.depth){while(R.bs.length<d){const k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!==R.bs[R.bs.length-1]);R.bs.push(R.bs.length%DEPTHS===DEPTHS-1?RG.fin():k[rint(k.length)]);}return R.bs[d-1];},
 /* the mini boss on jar 2 of some depths (every depth 4 of 8), or null. It has no phase 2 and drops a wooden crate */
 mid(R,d=R.depth){if(d%8!==4&&!(R.stake>=6&&d>=5))return null;if(!R.ms[d]){const b=RG.boss(R,d),k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!==b&&BOSS[k].min<=d&&k!=='hour');R.ms[d]=k[rint(k.length)];}return R.ms[d];},
 /* the rule flags a boss switches on. The Orchard Queen runs two other bosses, picked once per depth */
 rules(R,b,d=R.depth){let r=[b];if(b==='queen'){if(!R.bq[d]){const k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!=='hour'),a=k.splice(rint(k.length),1)[0],c=k.filter(x=>!(['swarm','gamble'].includes(a)&&['swarm','gamble'].includes(x)));R.bq[d]=[a,c[rint(c.length)]];}r=R.bq[d];}
  if(R.stake>=8&&BOSS[b].fin){if(!R.bx[d]){const k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!=='hour'&&!r.includes(k)&&!(['swarm','gamble'].includes(k)&&r.some(x=>['swarm','gamble'].includes(x))));R.bx[d]=k[rint(k.length)];}r=r.concat(R.bx[d]);}return r;},
 bossD(R,b,d=R.depth,two){const k=two?'d2':'d',r=RG.rules(R,b,d),x=R.stake>=8&&BOSS[b].fin?r[r.length-1]:null,xt=x?` Also ${BOSS[x].n}: ${BOSS[x][k]}`:'';if(b!=='queen')return BOSS[b][k]+xt;
  const q=r.slice(0,2);return (two?BOSS.queen.d2+' '+q.map(i=>BOSS[i].d2).join(' '):`${BOSS[q[0]].n} and ${BOSS[q[1]].n} at once. `+q.map(i=>BOSS[i].d).join(' '))+xt;},
 jarCfg(R,j=R.jar){const d=R.depth,b=j===2?RG.boss(R):j===1?RG.mid(R,d):null,bd=b&&BOSS[b],rules=b?RG.rules(R,b,d):[],sc=d<=DEPTHS?RSC[d-1]:RSC[DEPTHS-1]*Math.pow(RSCX,d-DEPTHS),J=R.jarId;
  const quota=nice(RQ[j]*sc*(bd&&bd.q||1)*(R.stake>=3?1.25:1)*(J==='tall'?1.15:1));let drops=RDROPS+R.up.can*2+(RG.has(R,'bag')?5:0)-(rules.includes('hour')?6:0)+(J==='tall'?4:0)-(R.stake>=4?3:0);if(b==='reaper')drops=Math.ceil(drops/2);drops=Math.max(8,drops);
  return{quota,drops,boss:b,rules,p2:j===2,p2s:j===2&&R.stake>=8,crate:j===2?(d%4===0?'melon':'gold'):b||J==='bare'?'wood':'',pay:Math.max(1,RPAY[j]+(b&&j<2?2:0)-(R.stake>=2?1:0)-(J==='piggy'?1:0)),tag:`D${d} · ${bd?bd.n:'Jar '+(j+1)+'/3'}`,name:bd?bd.n:`Depth ${d} · Jar ${j+1}`,ic:b?icn(b):null,
   rule:(b?RG.bossD(R,b,d)+' ':'')+`Score ${quota} in ${drops} drops.`,rule2:b?RG.bossD(R,b,d,1):''};},
 /* points for a scoring event, plus which charms took part (hit) so the screen can flash them */
 score(R,base,c){let chips=base,a=1+R.up.sauce*.25,x=1;const hit=[],sd=c.l>0?R.sd[c.l]:0;c.coins=R.coins;c.nc=R.ch.length;c.luck=RG.luck(R);c.sdl=R.sd.reduce((a,b)=>a+b,0);c.full=R.ch.length>=RG.slots(R);if(c.l>=0)chips+=R.up.fert*2;const sp=sd&&c.first&&RG.has(R,'sprout')?2:1;if(sd){chips+=sd*sp*sdP(c.l);a+=sd*sp*SDM;}if(sp>1)hit.push('sprout');
  for(let i=R.off||0;i<R.ch.length;i++){const ch=R.ch[i],d=CH[ch.id];let on=0,v;c.ch=ch;if(d.chip&&c.l>=0&&(v=d.chip(c))>0){chips+=v;on=1;}if(d.add&&(v=d.add(c))>0){a+=v;on=1;}if(d.x&&(v=d.x(c))>1){x*=v;on=1;}if(on)hit.push(ch.id);}
  return{p:Math.ceil(chips*a*x-1e-9),m:a*x,hit,chips};},
 /* a fruit of tier l was made: returns the charms that paid out */
 made(R,l){const ev=[],f=RG.has(R,'fever'),m=RG.has(R,'mania'),lk=RG.luck(R);if(l>=5&&RG.has(R,'gold')){R.coins++;ev.push('gold');}if(RG.has(R,'scratch')&&Math.random()<lk/6){R.coins++;ev.push('scratch');}
  if(RG.has(R,'mint')){if(l>=5){R.coins+=2;ev.push('mint','mint');}if(Math.random()<lk/4){R.coins++;ev.push('mint');}}if(l>=7&&f){f.v=(f.v||0)+1.5;ev.push('fever');}if(l>=7&&m){m.v=(m.v||0)+2;ev.push('mania');}const pp=l<=2&&RG.has(R,'pip');if(pp){pp.v=+((pp.v||0)+.03).toFixed(2);ev.push('pip');}return ev;},
 /* n fruit were destroyed: returns the charm that grew from it, if any */
 /* Gardener: a boss was beaten. Returns the seed tier that gained a level, or 0 */
 garden(R){if(!RG.has(R,'gard'))return 0;const a=RG.sizes(R),l=a[rint(a.length)];R.sd[l]++;return l;},
 kill(R,n){const c=RG.has(R,'compost')||RG.has(R,'volcano');if(!c||!(n>0))return false;c.v=+((c.v||0)+(c.id==='volcano'?.1:.05)*n).toFixed(2);return c.id;},
 net(R){const i=R.ch.findIndex(c=>c.id==='net');if(i<(R.off||0))return false;R.ch.splice(i,1);return true;},
 cost:(R,c)=>Math.max(1,c-(RG.has(R,'coupon')?1:0)+(R.stake>=5?1:0)),
 upCost:(R,id)=>RG.cost(R,UPG[id].c+(UPG[id].now?0:R.up[id]*2)),
 upOk:(R,k)=>PF.lk('up.'+k)?false:k==='scrub'?R.jar!==0:k==='bribe'?!BOSS[RG.boss(R)].fin:k==='belt'?RG.ts(R)<RG.tsMax(R):!UPG[k].max||R.up[k]<UPG[k].max,
 sdCost:(R,l)=>RG.cost(R,SDC+R.sd[l]-(RG.has(R,'packet')?1:0)),
 sellV:(R,c)=>R.up.haggle?c:Math.floor(c/2),
 rrCost:R=>R.up.dice?(R.shop.rr?RG.cost(R,1+R.shop.rr):0):RG.cost(R,2+R.shop.rr),
 payout(R,cfg,left){const rows=[['Jar cleared',cfg.pay]],u=Math.min(3,Math.floor(left/4)),i=Math.min((RG.has(R,'goose')?10:RG.has(R,'bank')?8:4)+R.up.vault*2+(R.jarId==='piggy'?2:0),Math.floor(R.coins/5));
  if(u)rows.push([`Unused drops (${left})`,u]);if(i)rows.push(['Interest (1 per 5 coins held)',i]);if(RG.has(R,'piggy'))rows.push(['Piggy Bank',3]);if(RG.has(R,'goose'))rows.push(['Golden Goose',4]);if(R.up.lunch)rows.push(['Packed Lunch',R.up.lunch]);return rows;},
 /* bank the payout and move on to the next jar. Returns true when the last depth has just been beaten */
 advance(R,sum){R.coins+=sum;const v=RG.has(R,'vintage');if(v)v.v=+((v.v||0)+.4).toFixed(1);let win=false;if(++R.jar>2){R.jar=0;if(R.depth===DEPTHS&&!R.won){R.won=1;win=true;}R.depth++;}R.shop=RG.stock(R);R.at='shop';return win;},
 stock(R){const own=R.ch.map(c=>c.id),ch=[],tt=R.up.taste;for(let i=0;i<(R.jarId==='bare'?0:3+R.up.shelf);i++){const left=Object.keys(CH).filter(k=>!CH[k].fu&&!CH[k].dev&&!PF.lk('ch.'+k)&&!own.includes(k)&&!ch.includes(k));if(!left.length)break;const r=Math.random(),rar=r<.6-.15*tt?0:r<.9-.075*tt?1:2,c=left.filter(k=>CH[k].r===rar),from=c.length?c:left;ch.push(from[rint(from.length)]);}
  const take=RG.pick,sizes=RG.sizes(R);
  return{ch,cr:Object.keys(CRP)[rint(3)],tl:take(Object.keys(TL).filter(k=>!TL[k].fu&&!PF.lk('tl.'+k)&&!R.tl.some(o=>o.id===k)),2),up:take(Object.keys(UPG).filter(k=>RG.upOk(R,k)),3),sd:take(sizes,2+R.up.seedbag),rr:0};},
 pick(a,n){const o=[];while(o.length<n&&a.length)o.push(a.splice(rint(a.length),1)[0]);return o;},
 sizes(R){const a=[];for(let l=1;l<=(R.depth<4?7:10);l++)a.push(l);return a;},
 /* ---- fusions ---- */
 /* every fusion the run holds both halves of: [{id, k (ch or tl), a, b}] */
 fusable(R){const o=[],hasT=id=>R.tl.some(t=>t.id===id);for(const id in CH){const f=CH[id].fu;if(f&&!PF.lk('fu.'+id)&&RG.has(R,f[0])&&RG.has(R,f[1]))o.push({id,k:'ch',a:CH[f[0]].n,b:CH[f[1]].n});}
  for(const id in TL){const f=TL[id].fu;if(f&&!PF.lk('fu.'+id)&&hasT(f[0])&&RG.has(R,f[1]))o.push({id,k:'tl',a:TL[f[0]].n,b:CH[f[1]].n});}return o;},
 /* make it: both halves go, the fusion takes the first half's place. A charm fusion keeps what its halves had grown */
 fuse(R,id){const c=CH[id],t=TL[id];if(c&&c.fu){const i=R.ch.findIndex(x=>x.id===c.fu[0]),j=R.ch.findIndex(x=>x.id===c.fu[1]);if(i<0||j<0)return false;const v=(R.ch[i].v||0)+(R.ch[j].v||0);R.ch[i]=v?{id,v}:{id};R.ch.splice(j,1);return true;}
  if(t&&t.fu){const i=R.tl.findIndex(x=>x.id===t.fu[0]),j=R.ch.findIndex(x=>x.id===t.fu[1]);if(i<0||j<0)return false;R.tl[i]=RG.tool(id,R);R.ch.splice(j,1);return true;}return false;},
 /* ---- crates ---- */
 /* opts: {k:'ch'|'tl'|'sd'|'coin'|'fu', id, n}. kind = a shop crate of one kind. then = the screen that follows (shop or hub) */
 crate(R,tier,then,kind){const T=CRT[tier],n=3+R.up.crowbar,o=[],fu=kind||tier==='wood'?[]:RG.fusable(R);if(fu.length)o.push({k:'fu',id:fu[rint(fu.length)].id});
  const chs=Object.keys(CH).filter(k=>!CH[k].fu&&!CH[k].dev&&!PF.lk('ch.'+k)&&!RG.has(R,k)),tls=Object.keys(TL).filter(k=>!TL[k].fu&&!PF.lk('tl.'+k)&&!R.tl.some(t=>t.id===k)),sds=RG.sizes(R);let coin=0;
  for(let g=0;o.length<n&&g<60;g++){const r=Math.random(),k=kind||(r<.4?'ch':r<.6?'tl':r<.9?'sd':'coin');
   if(k==='ch'){const q=Math.random(),rar=q<T.r[0]?0:q<T.r[0]+T.r[1]?1:2,c=chs.filter(x=>CH[x].r===rar),from=c.length?c:chs;if(from.length){const id=from[rint(from.length)];chs.splice(chs.indexOf(id),1);o.push({k,id});}}
   else if(k==='tl'){if(tls.length)o.push({k,id:tls.splice(rint(tls.length),1)[0]});}
   else if(k==='sd'){if(sds.length)o.push({k,id:sds.splice(rint(sds.length),1)[0],n:T.sd});}
   else if(!coin){coin=1;o.push({k,n:T.coin});}}
  return{tier,then,kind:kind||null,opts:o};},
 /* why a pick can not be taken right now, or '' */
 blocked:(R,o)=>o.k==='ch'&&R.ch.length>=RG.slots(R)?'Charms full':o.k==='tl'&&R.tl.length>=RG.ts(R)?'Tools full':'',
 take(R,i){const o=R.crate&&R.crate.opts[i];if(!o||RG.blocked(R,o))return null;if(o.k==='ch')R.ch.push({id:o.id});else if(o.k==='tl')R.tl.push(RG.tool(o.id,R));else if(o.k==='sd')R.sd[o.id]+=o.n;else if(o.k==='coin')R.coins+=o.n;else if(!RG.fuse(R,o.id))return null;
  R.at=R.crate.then;R.crate=null;return o;},
 leave(R){const c=R.crate;if(!c)return 0;const n=CRT[c.tier].out;R.coins+=n;R.at=c.then;R.crate=null;return n;},
 buyCr(R){const k=R.shop.cr,p=k&&RG.cost(R,CRP[k]);if(!k||R.coins<p)return false;R.coins-=p;R.shop.cr=null;R.crate=RG.crate(R,'wood','shop',k);R.at='crate';return true;},
 /* skip jar 1 or 2 of a depth: no payout, no shop, a wooden crate instead */
 skip(R){if(R.jar>1||RG.jarCfg(R).boss)return false;R.jar++;R.crate=RG.crate(R,'wood','hub');R.at='crate';return true;},
 buy(R,i){const id=R.shop.ch[i],p=id&&RG.cost(R,CH[id].c);if(!id||R.coins<p||R.ch.length>=RG.slots(R))return false;R.coins-=p;R.ch.push({id});R.shop.ch[i]=null;return true;},
 buyUp(R,i){const id=R.shop.up[i],p=id&&RG.upCost(R,id);if(!id||R.coins<p||!RG.upOk(R,id))return null;R.coins-=p;R.up[id]++;R.shop.up[i]=null;if(id==='bribe')RG.bribe(R);if(id==='whet')for(const t of R.tl)t.c=Math.min(t.c,RG.need(R,t.id));return id;},
 buySd(R,i){const l=R.shop.sd[i],p=l&&RG.sdCost(R,l);if(!l||R.coins<p)return 0;R.coins-=p;R.sd[l]++;R.shop.sd[i]=null;return l;},
 buyTl(R,i){const id=R.shop.tl[i],p=id&&RG.cost(R,TL[id].c);if(!id||R.coins<p||R.tl.length>=RG.ts(R))return false;R.coins-=p;R.tl.push(RG.tool(id,R));R.shop.tl[i]=null;return true;},
 sellTl(R,i){const t=R.tl[i];if(!t)return false;R.coins+=RG.sellV(R,TL[t.id].c);R.tl.splice(i,1);return true;},
 sell(R,i){const c=R.ch[i];if(!c)return false;R.coins+=RG.sellV(R,CH[c.id].c);R.ch.splice(i,1);return true;},
 reroll(R){const p=RG.rrCost(R);if(R.coins<p)return false;R.coins-=p;const s=RG.stock(R);s.rr=R.shop.rr+1;if(!R.shop.cr)s.cr=null;R.shop=s;return true;},
 ro:(R,clear,fail,fx)=>({get coins(){return R.coins},set coins(v){R.coins=v},get total(){return R.total},set total(v){R.total=v},has:id=>RG.has(R,id),luck:()=>RG.luck(R),score:(b,c)=>RG.score(R,b,c),made:l=>RG.made(R,l),kill:n=>RG.kill(R,n),net:()=>RG.net(R),get tools(){return R.tl},off:n=>{R.off=n;},up:id=>R.up[id]||0,need:id=>RG.need(R,id),charge:(n,skip)=>RG.charge(R,n,skip),fill:()=>RG.fill(R),fx:fx||(()=>{}),ev:(n,d)=>rgEv(R,n,d),clear,fail})
};

/* ---------- player profile: everything that outlives a run ---------- */
/* One object, one storage key, so a sign-in later only has to sync this.
   seen / unlocked / ach: id -> time first reached (ids are namespaced: ch.juicer, boss.fog, up.fert).
   stats: flat counters and records, only ever going up. stakes: best stake won per starting jar.
   mergeProfile joins two copies (this device and the cloud) without losing anything from either. */
const PV=1;
const PF={d:null,dirty:0,
 blank:()=>({v:PV,rev:0,at:0,seen:{},unlocked:{},ach:{},stats:{},stakes:{}}),
 fix(p){const b=PF.blank();if(!p||typeof p!=='object')return b;for(const k in b)if(typeof b[k]==='object'){if(p[k]&&typeof p[k]==='object'&&!Array.isArray(p[k]))b[k]=p[k];}else if(typeof p[k]==='number')b[k]=p[k];b.v=PV;return b;},
 load(){PF.d=PF.fix(store.get('profile',null));return PF.d;},
 save(){if(!PF.dirty||!PF.d)return;PF.dirty=0;PF.d.rev++;PF.d.at=Date.now();store.set('profile',PF.d);},
 inc(k,n=1){const s=PF.d.stats;s[k]=(s[k]||0)+n;PF.dirty=1;},
 max(k,v){const s=PF.d.stats;if(!(s[k]>=v)){s[k]=v;PF.dirty=1;}},
 /* mark things as met, for the glossary. Returns the ids that are new */
 see(kind,ids){const nu=[];for(const id of [].concat(ids)){const k=kind+'.'+id;if(id&&!PF.d.seen[k]){PF.d.seen[k]=Date.now();PF.dirty=1;nu.push(id);}}return nu;},
 saw:(kind,id)=>!!PF.d.seen[kind+'.'+id],
 /* is this thing (ch.id, tl.id, up.id, fu.id, jar.id) still locked behind an award */
 lk:key=>!!LOCK[key]&&!(PF.d||PF.load()).unlocked[key]
};
function mergeProfile(a,b){a=PF.fix(a);b=PF.fix(b);const o=PF.blank(),first=(x,y)=>{const r={...x};for(const k in y)r[k]=r[k]?Math.min(r[k],y[k]):y[k];return r;},most=(x,y)=>{const r={...x};for(const k in y)r[k]=Math.max(r[k]||0,y[k]);return r;};
 o.seen=first(a.seen,b.seen);o.unlocked=first(a.unlocked,b.unlocked);o.ach=first(a.ach,b.ach);o.stats=most(a.stats,b.stats);o.stakes=most(a.stakes,b.stakes);o.rev=Math.max(a.rev,b.rev)+1;o.at=Math.max(a.at,b.at);return o;}

/* ---------- run events ---------- */
/* Everything worth counting goes through here: the engine through ro.ev, the screens by calling rgEv.
   R.st counts over the whole run, R.jst over the jar being played (reset by the 'start' event), the profile over a lifetime.
   Engine events: drop {l,sp}, merge {l,p,m,combo,bull}, tool {id}, kill {n}, net, gold, melons {n}.
   Screen events: run, start, jar {depth,jar,boss,left,score,quota,win}, end {why,boss}, buy {id,k}, sell {id,k}, up {id}, seed {l}, grow {l} (a seed level from Gardener), roll, skip, crate {tier}, take {k,id} (k = out when the crate was left), fuse {id}. k is the kind (ch or tl).
   Runs touched by the dev panel (R.dev) count for nothing. */
function rgEv(R,n,d={}){if(!R||R.dev)return;if(!PF.d)PF.load();const rs=R.st||(R.st={}),inc=(k,v=1)=>{PF.inc(k,v);rs[k]=(rs[k]||0)+v;if(R.jst)R.jst[k]=(R.jst[k]||0)+v;},top=(k,v)=>{PF.max(k,v);if(!(rs[k]>=v))rs[k]=v;};
 if(n==='run')PF.inc('runs');
 else if(n==='start'){R.jst={};}
 else if(n==='drop')inc('drops');
 else if(n==='merge'){inc('merges');inc('made.'+d.l);if(d.bull)inc('bulls');top('bestMerge',d.p);top('bestMult',+d.m.toFixed(2));top('bestFruit',d.l);top('bestCombo',d.combo);}
 else if(n==='tool'){inc('tools');inc('tool.'+d.id);}
 else if(n==='kill')inc('kills',d.n);
 else if(n==='net')inc('nets');
 else if(n==='gold')inc('golds');
 else if(n==='melons')inc('melons2');
 else if(n==='jar'){inc('jars');top('bestDepth',d.depth);top('bestJar',d.score);if(d.boss){inc('bosses');PF.inc('boss.'+d.boss+'.win');}if(d.win){PF.inc('wins');const j=R.jarId||'classic';PF.d.stakes[j]=Math.max(PF.d.stakes[j]||0,R.stake||1);PF.dirty=1;}}
 else if(n==='end'){PF.inc('end.'+d.why);if(d.why!=='win'&&d.why!=='quit'&&d.boss)PF.inc('boss.'+d.boss+'.loss');PF.max('bestScore',R.total);top('bestCoins',R.coins);}
 else if(n==='buy'){inc('buys');PF.inc((d.k||'ch')+'.'+d.id+'.buy');}
 else if(n==='sell')inc('sells');
 else if(n==='up'){inc('ups');PF.inc('up.'+d.id+'.buy');}
 else if(n==='seed'){inc('seeds');PF.inc('sd.'+d.l+'.buy');}
 else if(n==='grow')inc('grown');
 else if(n==='roll')inc('rolls');
 else if(n==='skip'){inc('skips');R.dsk=(R.dsk||0)+1;}
 else if(n==='crate'){inc('crates');PF.inc('crate.'+d.tier);}
 else if(n==='take')inc('take.'+d.k);
 else if(n==='fuse'){inc('fuses');PF.inc('fu.'+d.id+'.made');}
 achCheck(R,n,d);if(n==='jar'&&d.jar===2)R.dsk=0;
}

/* ---------- awards (achievements) ---------- */
/* on = the events that can earn it, t(R, d, S) = the test (R the run, d the event's data, S lifetime stats), un = what it unlocks (a LOCK key),
   secret = the description stays hidden until it is earned. Earned awards land in PF.d.ach, in R.got for the run-over screen and in ACHQ for the toast. */
const fuN=R=>R.ch.filter(c=>CH[c.id].fu).length+R.tl.filter(t=>TL[t.id].fu).length;
const ACH={
 first:{n:'First Harvest',d:'Beat a boss.',on:'jar',t:(R,d)=>d.boss&&d.jar===2,un:'tl.twin'},
 melon1:{n:'Watermelon!',d:'Make a watermelon in a Rogue run.',on:'merge',t:(R,d)=>d.l===10,un:'up.pouch'},
 rich:{n:'Nest Egg',d:'Hold 40 coins at once.',on:'jar sell take start',t:R=>R.coins>=40,un:'tl.cash'},
 roller:{n:'High Roller',d:'Reroll the same shop 4 times.',on:'roll',t:R=>R.shop.rr>=4,un:'up.crowbar'},
 fuse1:{n:'Alchemist',d:'Make a fusion.',on:'fuse',t:()=>true,un:'fu.ghand'},
 seed5:{n:'Green Fingers',d:'Raise one seed to level 5.',on:'seed take grow',t:R=>Math.max(...R.sd)>=5,un:'ch.abacus'},
 salad:{n:'Fruit Salad',d:'Make every size from 2 to 8 in a single jar.',on:'merge',t:R=>[1,2,3,4,5,6,7].every(l=>R.jst['made.'+l]),un:'ch.snake'},
 combo:{n:'Chain Gang',d:'Reach a combo of 10.',on:'merge',t:(R,d)=>d.combo>=9,un:'fu.wildfire'},
 bull5:{n:'Dead Eye',d:'Land 5 merges in one jar where the dropped fruit touched nothing else first.',on:'merge',t:R=>R.jst.bulls>=5,un:'fu.sharp'},
 toolspam:{n:'Busy Hands',d:'Use tools 10 times in one jar.',on:'tool',t:R=>R.jst.tools>=10,un:'ch.dynamo'},
 alltools:{n:'Handyman',d:'Use 4 different tools in one jar.',on:'tool',t:R=>Object.keys(R.jst).filter(k=>k.startsWith('tool.')).length>=4,un:'ch.drive'},
 nohands:{n:'No Hands',d:'Beat a boss at depth 2 or deeper without using a tool in that jar.',on:'jar',t:(R,d)=>d.boss&&d.jar===2&&d.depth>=2&&!R.jst.tools,un:'tl.rewind'},
 speed:{n:'Early Finish',d:'Beat a boss at depth 3 or deeper with 8 or more drops left.',on:'jar',t:(R,d)=>d.jar===2&&d.depth>=3&&d.left>=8,un:'jar.tall'},
 minimal:{n:'Travelling Light',d:'Beat the depth 4 boss, or a deeper one, holding 3 charms or fewer.',on:'jar',t:(R,d)=>d.jar===2&&d.depth>=4&&R.ch.length<=3,un:'up.whet'},
 skipper:{n:'Shortcut',d:'Skip both jars of a depth, then beat its boss.',on:'jar',t:(R,d)=>d.jar===2&&(R.dsk||0)>=2,un:'tl.midas'},
 fullkit:{n:'Fully Loaded',d:'Hold 5 charms and 4 tools at once.',on:'buy take fuse up',t:R=>R.ch.length>=5&&R.tl.length>=4,un:'ch.crew'},
 fuse2:{n:'Master Blender',d:'Hold 2 fusions at once.',on:'fuse',t:R=>fuN(R)>=2,un:'fu.cyclone'},
 gold3:{n:'Gold Rush',d:'Merge 3 gold fruit in one jar.',on:'gold',t:R=>R.jst.golds>=3,un:'ch.magpie'},
 scorch:{n:'Scorched Earth',d:'Destroy 20 fruit in one jar.',on:'kill',t:R=>R.jst.kills>=20,un:'ch.ash'},
 jackpot:{n:'Jackpot',d:'Score 5,000 points with a single merge.',on:'merge',t:(R,d)=>d.p>=5000,un:'ch.crit'},
 overkill:{n:'Overkill',d:'Finish a jar with 3 times its target.',on:'jar',t:(R,d)=>d.score>=d.quota*3,un:'tl.ddown',secret:1},
 twomelon:{n:'Double Melon',d:'Have 2 watermelons in the jar at once.',on:'melons',t:()=>true,un:'fu.mania',secret:1},
 noshop:{n:'Window Shopper',d:'Beat the depth 3 boss having bought nothing in any shop.',on:'jar',t:(R,d)=>d.jar===2&&d.depth>=3&&!R.st.buys&&!R.st.ups&&!R.st.seeds,un:'jar.bare',secret:1},
 win:{n:'To the Bottom',d:'Win a run.',on:'jar',t:(R,d)=>d.win,un:'jar.piggy'},
 endless:{n:'Still Going',d:'Beat the depth 10 boss.',on:'jar',t:(R,d)=>d.jar===2&&d.depth>=10,un:'jar.wide'},
 slayer:{n:'Giant Slayer',d:'Beat 15 different bosses.',on:'jar',t:(R,d,S)=>Object.keys(S).filter(k=>/^boss\..*\.win$/.test(k)).length>=15,un:'jar.kit'},
 almanac:{n:'Know-It-All',d:'Meet every boss.',on:'start jar',t:()=>Object.keys(BOSS).every(k=>PF.d.seen['boss.'+k])},
 stake4:{n:'Seasoned',d:'Win a run on stake 4 or higher.',on:'jar',t:(R,d)=>d.win&&(R.stake||1)>=4},
 stake8:{n:'Juiced',d:'Win a run on stake 8.',on:'jar',t:(R,d)=>d.win&&(R.stake||1)>=8}
};
const LOCK={};for(const id in ACH)if(ACH[id].un)LOCK[ACH[id].un]=id;
const ACHQ=[]; /* awards earned and not yet shown */
function achCheck(R,n,d){for(const id in ACH){const a=ACH[id];if(PF.d.ach[id]||!a.on.split(' ').includes(n))continue;let hit=false;try{hit=!!a.t(R,d,PF.d.stats);}catch(e){}if(!hit)continue;
  PF.d.ach[id]=Date.now();if(a.un)PF.d.unlocked[a.un]=Date.now();PF.dirty=1;(R.got=R.got||[]).push(id);ACHQ.push(id);}}
/* the name of what an award unlocks, e.g. "Twin (tool)" */
function unName(key){const[k,id]=key.split('.');return k==='ch'?CH[id].n+' (charm)':k==='tl'?TL[id].n+' (tool)':k==='up'?UPG[id].n+' (upgrade)':k==='fu'?(CH[id]||TL[id]).n+' (fusion)':k==='jar'?(typeof JARS!=='undefined'&&JARS[id]?JARS[id].n:'A starting jar')+' (starting jar)':key;}
const unKind=key=>({ch:'a charm',tl:'a tool',up:'an upgrade',fu:'a fusion',jar:'a starting jar'}[key.split('.')[0]]);

