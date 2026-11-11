/* Fruit Merge: Rogue mode rules and the player profile. Loaded before the main script in index.html.
   Nothing here touches the page. It uses rint and store from index.html, but only inside functions, so load order is fine. */
/* ---------- rogue mode: rules (charms, bosses, shop, scoring) ---------- */
const DEPTHS=8,SLOTS=5,RDROPS=24,TS0=2,TSLOTS=4,RV=6; /* RV = run save version. Bump it when the run object changes shape, older saved runs are dropped */
const RQ=[100,130,150]; /* depth 1 score targets: jar 1, jar 2, boss */
const RSC=[1,2.3,4,6.5,9.5,13,17,22]; /* target multiplier per depth */
const RPAY=[3,4,6],RAR=['Common','Uncommon','Rare','Fused'];
/* Charms. r = rarity, c = price, d = description. Scoring hooks get a context c:
   l = fruit tier made (-1 when not a merge), combo, bull, enc, n = fruit in the jar, jd/dl = drops made/left this jar, jm = merges this jar,
   pu = different tools used this jar, tu = tool uses this jar, high = pile at the gold line, coins, luck, nc = charms owned, ch = this charm's saved state.
   chip adds points, add adds Mult, x multiplies Mult. Charms with no hook are handled in makeGame or RG.
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
 soil:{n:'Rich Soil',r:2,c:9,d:'Every fruit you drop is one size bigger.'},
 wire:{n:'High Wire',r:2,c:8,d:'×3 Mult while the pile reaches the gold line near the top of the jar.',x:c=>c.high?3:1},
 ribbon:{n:'Blue Ribbon',r:2,c:9,d:'×0.3 Mult more for every charm you own, this one included.',x:c=>1+.3*c.nc},
 fever:{n:'Melon Fever',r:2,c:9,d:'Gains +1.5 Mult every time you make a size 8 fruit or bigger.',add:c=>c.ch.v||0,live:1},
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
/* min = first depth a boss can show up at, q = score target multiplier */
const BOSS={
 fog:{n:'The Fog',d:'The Next box is hidden.',min:1},
 glut:{n:'The Glutton',d:'A caterpillar eats one of your fruits every 3 drops.',min:1},
 sticky:{n:'The Syrup',d:'Every 3rd fruit is Sticky and stays where it lands.',min:1},
 lock:{n:'The Padlock',d:'Tools are locked.',min:1},
 hour:{n:'The Hourglass',d:'6 fewer drops.',min:2},
 swarm:{n:'The Swarm',d:'Only the two smallest fruits drop.',min:2,q:.6},
 rot:{n:'The Rot',d:'Small fruit resting on the bottom goes mouldy fast and stops merging.',min:2},
 tax:{n:'The Taxman',d:'Takes a coin every 4 drops.',min:2},
 ice:{n:'Cold Snap',d:'Every 4th fruit is Frozen. It freezes its neighbours, then they shrink a size.',min:3},
 stone:{n:'The Quarry',d:'Every 5th drop is a rock that never merges.',min:3},
 prune:{n:'The Pruner',d:'Merges that make a size 4 fruit or smaller score nothing.',min:3},
 storm:{n:'The Storm',d:'A whirlpool hits every 6 drops.',min:3},
 slick:{n:'The Slick',d:'Every fruit is Slippery.',min:4},
 lid:{n:'The Lid',d:'The line sits lower in the jar.',min:4},
 melon:{n:'The Melon King',d:'A watermelon drops into your jar and stays. Keep the pile low.',min:99,q:1.1}
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
const ICN={lode:'magnet',boom:'bomb',pet:'cat',glut:'cat',rot:'mould',stone:'rock',storm:'whirl',slick:'drop',melon:'king'}; /* things that share another icon (icons.js) */
const icn=id=>ICN[id]||id;
const nice=q=>{const m=Math.pow(10,Math.max(1,Math.floor(Math.log10(q))-1));return Math.round(q/m)*m;};
const RG={
 new(){const pool=Object.keys(BOSS).filter(k=>k!=='melon'),bs=[];for(let d=1;d<DEPTHS;d++){const c=pool.filter(k=>BOSS[k].min<=d&&!bs.includes(k));bs.push(c[rint(c.length)]);}bs.push('melon');
  return{v:RV,depth:1,jar:0,coins:4,total:0,ch:[],tl:[RG.tool('swap'),RG.tool('shake')],up:Object.fromEntries(Object.keys(UPG).map(k=>[k,0])),sd:Array(11).fill(0),bs,shop:null,crate:null,pile:[],at:'hub',won:0,st:{},jst:{}};},
 /* a saved run that this version can load, or null */
 saved(){const sv=store.get('run',null);if(sv&&sv.v!==RV){store.set('run',null);return null;}return sv;},
 has:(R,id)=>R.ch.find(c=>c.id===id),
 /* tools: {id, c} where c is the charge held. New tools arrive charged */
 tool:(id,R)=>({id,c:R?RG.need(R,id):TL[id].ch}),
 ts:R=>Math.min(TSLOTS,TS0+R.up.belt),
 slots:R=>SLOTS+R.up.pouch,
 need:(R,id)=>Math.max(Math.min(2,TL[id].ch),TL[id].ch-R.up.whet),
 luck:R=>RG.has(R,'shoe')||RG.has(R,'fourleaf')?2:1,
 charge(R,n,skip){const k=n*(RG.has(R,'battery')?2:1);for(const t of R.tl)if(t!==skip)t.c=Math.min(RG.need(R,t.id),t.c+k);},
 fill(R){for(const t of R.tl)t.c=RG.need(R,t.id);},
 /* swap this depth's boss for another that is allowed here */
 bribe(R){const d=R.depth,cur=RG.boss(R),k=Object.keys(BOSS).filter(k=>k!=='melon'&&k!==cur&&BOSS[k].min<=d&&k!==R.bs[d-2]);R.bs[d-1]=k[rint(k.length)];return R.bs[d-1];},
 boss(R,d=R.depth){while(R.bs.length<d){const k=Object.keys(BOSS).filter(k=>k!=='melon'&&k!==R.bs[R.bs.length-1]);R.bs.push(R.bs.length%DEPTHS===DEPTHS-1?'melon':k[rint(k.length)]);}return R.bs[d-1];},
 jarCfg(R,j=R.jar){const d=R.depth,b=j===2?RG.boss(R):null,bd=b&&BOSS[b],sc=d<=DEPTHS?RSC[d-1]:RSC[DEPTHS-1]*Math.pow(1.6,d-DEPTHS);
  const quota=nice(RQ[j]*sc*(bd&&bd.q||1)),drops=Math.max(8,RDROPS+R.up.can*2+(RG.has(R,'bag')?5:0)-(b==='hour'?6:0));
  return{quota,drops,boss:b,pay:RPAY[j],tag:`D${d} · ${bd?bd.n:'Jar '+(j+1)+'/3'}`,name:bd?bd.n:`Depth ${d} · Jar ${j+1}`,ic:b?icn(b):null,rule:(bd?bd.d+' ':'')+`Score ${quota} in ${drops} drops.`};},
 /* points for a scoring event, plus which charms took part (hit) so the screen can flash them */
 score(R,base,c){let chips=base,a=1+R.up.sauce*.25,x=1;const hit=[],sd=c.l>0?R.sd[c.l]:0;c.coins=R.coins;c.nc=R.ch.length;c.luck=RG.luck(R);if(c.l>=0)chips+=R.up.fert*2;if(sd){chips+=sd*sdP(c.l);a+=sd*SDM;}
  for(const ch of R.ch){const d=CH[ch.id];let on=0,v;c.ch=ch;if(d.chip&&c.l>=0){chips+=d.chip(c);on=1;}if(d.add&&(v=d.add(c))>0){a+=v;on=1;}if(d.x&&(v=d.x(c))>1){x*=v;on=1;}if(on)hit.push(ch.id);}
  return{p:Math.ceil(chips*a*x-1e-9),m:a*x,hit};},
 /* a fruit of tier l was made: returns the charms that paid out */
 made(R,l){const ev=[],f=RG.has(R,'fever'),m=RG.has(R,'mania'),lk=RG.luck(R);if(l>=5&&RG.has(R,'gold')){R.coins++;ev.push('gold');}if(RG.has(R,'scratch')&&Math.random()<lk/6){R.coins++;ev.push('scratch');}
  if(RG.has(R,'mint')){if(l>=5){R.coins+=2;ev.push('mint','mint');}if(Math.random()<lk/4){R.coins++;ev.push('mint');}}if(l>=7&&f){f.v=(f.v||0)+1.5;ev.push('fever');}if(l>=7&&m){m.v=(m.v||0)+2;ev.push('mania');}return ev;},
 /* n fruit were destroyed: returns the charm that grew from it, if any */
 kill(R,n){const c=RG.has(R,'compost')||RG.has(R,'volcano');if(!c||!(n>0))return false;c.v=+((c.v||0)+(c.id==='volcano'?.1:.05)*n).toFixed(2);return c.id;},
 net(R){const i=R.ch.findIndex(c=>c.id==='net');if(i<0)return false;R.ch.splice(i,1);return true;},
 cost:(R,c)=>Math.max(1,c-(RG.has(R,'coupon')?1:0)),
 upCost:(R,id)=>RG.cost(R,UPG[id].c+(UPG[id].now?0:R.up[id]*2)),
 upOk:(R,k)=>k==='scrub'?R.jar!==0:k==='bribe'?RG.boss(R)!=='melon':!UPG[k].max||R.up[k]<UPG[k].max,
 sdCost:(R,l)=>RG.cost(R,SDC+R.sd[l]),
 sellV:(R,c)=>R.up.haggle?c:Math.floor(c/2),
 rrCost:R=>R.up.dice?(R.shop.rr?RG.cost(R,1+R.shop.rr):0):RG.cost(R,2+R.shop.rr),
 payout(R,cfg,left){const rows=[['Jar cleared',cfg.pay]],u=Math.min(3,Math.floor(left/4)),i=Math.min((RG.has(R,'goose')?10:RG.has(R,'bank')?8:4)+R.up.vault*2,Math.floor(R.coins/5));
  if(u)rows.push([`Unused drops (${left})`,u]);if(i)rows.push(['Interest (1 per 5 coins held)',i]);if(RG.has(R,'piggy'))rows.push(['Piggy Bank',3]);if(RG.has(R,'goose'))rows.push(['Golden Goose',4]);if(R.up.lunch)rows.push(['Packed Lunch',R.up.lunch]);return rows;},
 /* bank the payout and move on to the next jar. Returns true when the last depth has just been beaten */
 advance(R,sum){R.coins+=sum;const v=RG.has(R,'vintage');if(v)v.v=+((v.v||0)+.4).toFixed(1);let win=false;if(++R.jar>2){R.jar=0;if(R.depth===DEPTHS&&!R.won){R.won=1;win=true;}R.depth++;}R.shop=RG.stock(R);R.at='shop';return win;},
 stock(R){const own=R.ch.map(c=>c.id),ch=[],tt=R.up.taste;for(let i=0;i<3+R.up.shelf;i++){const left=Object.keys(CH).filter(k=>!CH[k].fu&&!own.includes(k)&&!ch.includes(k));if(!left.length)break;const r=Math.random(),rar=r<.6-.15*tt?0:r<.9-.075*tt?1:2,c=left.filter(k=>CH[k].r===rar),from=c.length?c:left;ch.push(from[rint(from.length)]);}
  const take=RG.pick,sizes=RG.sizes(R);
  return{ch,cr:Object.keys(CRP)[rint(3)],tl:take(Object.keys(TL).filter(k=>!TL[k].fu&&!R.tl.some(o=>o.id===k)),2),up:take(Object.keys(UPG).filter(k=>RG.upOk(R,k)),3),sd:take(sizes,2+R.up.seedbag),rr:0};},
 pick(a,n){const o=[];while(o.length<n&&a.length)o.push(a.splice(rint(a.length),1)[0]);return o;},
 sizes(R){const a=[];for(let l=1;l<=(R.depth<4?7:10);l++)a.push(l);return a;},
 /* ---- fusions ---- */
 /* every fusion the run holds both halves of: [{id, k (ch or tl), a, b}] */
 fusable(R){const o=[],hasT=id=>R.tl.some(t=>t.id===id);for(const id in CH){const f=CH[id].fu;if(f&&RG.has(R,f[0])&&RG.has(R,f[1]))o.push({id,k:'ch',a:CH[f[0]].n,b:CH[f[1]].n});}
  for(const id in TL){const f=TL[id].fu;if(f&&hasT(f[0])&&RG.has(R,f[1]))o.push({id,k:'tl',a:TL[f[0]].n,b:CH[f[1]].n});}return o;},
 /* make it: both halves go, the fusion takes the first half's place. A charm fusion keeps what its halves had grown */
 fuse(R,id){const c=CH[id],t=TL[id];if(c&&c.fu){const i=R.ch.findIndex(x=>x.id===c.fu[0]),j=R.ch.findIndex(x=>x.id===c.fu[1]);if(i<0||j<0)return false;const v=(R.ch[i].v||0)+(R.ch[j].v||0);R.ch[i]=v?{id,v}:{id};R.ch.splice(j,1);return true;}
  if(t&&t.fu){const i=R.tl.findIndex(x=>x.id===t.fu[0]),j=R.ch.findIndex(x=>x.id===t.fu[1]);if(i<0||j<0)return false;R.tl[i]=RG.tool(id,R);R.ch.splice(j,1);return true;}return false;},
 /* ---- crates ---- */
 /* opts: {k:'ch'|'tl'|'sd'|'coin'|'fu', id, n}. kind = a shop crate of one kind. then = the screen that follows (shop or hub) */
 crate(R,tier,then,kind){const T=CRT[tier],n=3+R.up.crowbar,o=[],fu=kind||tier==='wood'?[]:RG.fusable(R);if(fu.length)o.push({k:'fu',id:fu[rint(fu.length)].id});
  const chs=Object.keys(CH).filter(k=>!CH[k].fu&&!RG.has(R,k)),tls=Object.keys(TL).filter(k=>!TL[k].fu&&!R.tl.some(t=>t.id===k)),sds=RG.sizes(R);let coin=0;
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
 skip(R){if(R.jar>1)return false;R.jar++;R.crate=RG.crate(R,'wood','hub');R.at='crate';return true;},
 buy(R,i){const id=R.shop.ch[i],p=id&&RG.cost(R,CH[id].c);if(!id||R.coins<p||R.ch.length>=RG.slots(R))return false;R.coins-=p;R.ch.push({id});R.shop.ch[i]=null;return true;},
 buyUp(R,i){const id=R.shop.up[i],p=id&&RG.upCost(R,id);if(!id||R.coins<p||!RG.upOk(R,id))return null;R.coins-=p;R.up[id]++;R.shop.up[i]=null;if(id==='bribe')RG.bribe(R);if(id==='whet')for(const t of R.tl)t.c=Math.min(t.c,RG.need(R,t.id));return id;},
 buySd(R,i){const l=R.shop.sd[i],p=l&&RG.sdCost(R,l);if(!l||R.coins<p)return 0;R.coins-=p;R.sd[l]++;R.shop.sd[i]=null;return l;},
 buyTl(R,i){const id=R.shop.tl[i],p=id&&RG.cost(R,TL[id].c);if(!id||R.coins<p||R.tl.length>=RG.ts(R))return false;R.coins-=p;R.tl.push(RG.tool(id,R));R.shop.tl[i]=null;return true;},
 sellTl(R,i){const t=R.tl[i];if(!t)return false;R.coins+=RG.sellV(R,TL[t.id].c);R.tl.splice(i,1);return true;},
 sell(R,i){const c=R.ch[i];if(!c)return false;R.coins+=RG.sellV(R,CH[c.id].c);R.ch.splice(i,1);return true;},
 reroll(R){const p=RG.rrCost(R);if(R.coins<p)return false;R.coins-=p;const s=RG.stock(R);s.rr=R.shop.rr+1;if(!R.shop.cr)s.cr=null;R.shop=s;return true;},
 ro:(R,clear,fail,fx)=>({get coins(){return R.coins},set coins(v){R.coins=v},get total(){return R.total},set total(v){R.total=v},has:id=>RG.has(R,id),score:(b,c)=>RG.score(R,b,c),made:l=>RG.made(R,l),kill:n=>RG.kill(R,n),net:()=>RG.net(R),get tools(){return R.tl},up:id=>R.up[id]||0,need:id=>RG.need(R,id),charge:(n,skip)=>RG.charge(R,n,skip),fill:()=>RG.fill(R),fx:fx||(()=>{}),ev:(n,d)=>rgEv(R,n,d),clear,fail})
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
 saw:(kind,id)=>!!PF.d.seen[kind+'.'+id]
};
function mergeProfile(a,b){a=PF.fix(a);b=PF.fix(b);const o=PF.blank(),first=(x,y)=>{const r={...x};for(const k in y)r[k]=r[k]?Math.min(r[k],y[k]):y[k];return r;},most=(x,y)=>{const r={...x};for(const k in y)r[k]=Math.max(r[k]||0,y[k]);return r;};
 o.seen=first(a.seen,b.seen);o.unlocked=first(a.unlocked,b.unlocked);o.ach=first(a.ach,b.ach);o.stats=most(a.stats,b.stats);o.stakes=most(a.stakes,b.stakes);o.rev=Math.max(a.rev,b.rev)+1;o.at=Math.max(a.at,b.at);return o;}

/* ---------- run events ---------- */
/* Everything worth counting goes through here: the engine through ro.ev, the screens by calling rgEv.
   R.st counts over the whole run, R.jst over the jar being played (reset by the 'start' event), the profile over a lifetime.
   Engine events: drop {l,sp}, merge {l,p,m,combo,bull}, tool {id}, kill {n}, net.
   Screen events: run, start, jar {depth,jar,boss,left,score,quota,win}, end {why,boss}, buy {id,k}, sell {id,k}, up {id}, seed {l}, roll, skip, crate {tier}, take {k,id} (k = out when the crate was left), fuse {id}. k is the kind (ch or tl).
   Runs touched by the dev panel (R.dev) count for nothing. */
function rgEv(R,n,d={}){if(!R||R.dev)return;if(!PF.d)PF.load();const rs=R.st||(R.st={}),inc=(k,v=1)=>{PF.inc(k,v);rs[k]=(rs[k]||0)+v;if(R.jst)R.jst[k]=(R.jst[k]||0)+v;},top=(k,v)=>{PF.max(k,v);if(!(rs[k]>=v))rs[k]=v;};
 if(n==='run')PF.inc('runs');
 else if(n==='start'){R.jst={};}
 else if(n==='drop')inc('drops');
 else if(n==='merge'){inc('merges');inc('made.'+d.l);if(d.bull)inc('bulls');top('bestMerge',d.p);top('bestMult',+d.m.toFixed(2));top('bestFruit',d.l);top('bestCombo',d.combo);}
 else if(n==='tool'){inc('tools');inc('tool.'+d.id);}
 else if(n==='kill')inc('kills',d.n);
 else if(n==='net')inc('nets');
 else if(n==='jar'){inc('jars');top('bestDepth',d.depth);top('bestJar',d.score);if(d.boss){inc('bosses');PF.inc('boss.'+d.boss+'.win');}if(d.win)PF.inc('wins');}
 else if(n==='end'){PF.inc('end.'+d.why);if(d.why!=='win'&&d.why!=='quit'&&d.boss)PF.inc('boss.'+d.boss+'.loss');PF.max('bestScore',R.total);top('bestCoins',R.coins);}
 else if(n==='buy'){inc('buys');PF.inc((d.k||'ch')+'.'+d.id+'.buy');}
 else if(n==='sell')inc('sells');
 else if(n==='up'){inc('ups');PF.inc('up.'+d.id+'.buy');}
 else if(n==='seed'){inc('seeds');PF.inc('sd.'+d.l+'.buy');}
 else if(n==='roll')inc('rolls');
 else if(n==='skip')inc('skips');
 else if(n==='crate'){inc('crates');PF.inc('crate.'+d.tier);}
 else if(n==='take')inc('take.'+d.k);
 else if(n==='fuse'){inc('fuses');PF.inc('fu.'+d.id+'.made');}
 /* Stage 5: achievement checks hook in here */
}
