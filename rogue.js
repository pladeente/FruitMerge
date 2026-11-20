/* Fruit Merge: Rogue mode rules and the player profile. Loaded before the main script in index.html.
   Nothing here touches the page. It uses rint and store from index.html, but only inside functions, so load order is fine. */
/* ---------- rogue mode: rules (charms, bosses, shop, scoring) ---------- */
/* seeded runs (v1.53): sdH hashes a string to 32 bits, mb32 is a small seeded generator, sdW runs fn with Math.random swapped for it. SDQ.d > 0 while a seeded draw runs: every lock is open then, so all players draw from the same pool */
const sdH=s=>{let h=2166136261;for(const c of String(s)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;},mb32=a=>()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;},SDQ={d:0},sdW=(fn,rng)=>{const o=Math.random;Math.random=rng;SDQ.d++;try{return fn();}finally{Math.random=o;SDQ.d--;}};
const DEPTHS=8,SLOTS=5,RDROPS=24,TS0=2,TSLOTS=4,RV=12,OS0=2; /* RV = run save version. Bump it when the run object changes shape, older saved runs are dropped */
/* fruit names by tier: a single size is written 'Orange (5)' (fnm), ranges stay numeric ('size 3 or smaller'). Rockmelon is the Australian name. The Lemon (4) was the Mandarin until v1.31 (players read the sprite as a lemon). Size 11 is the Watermelon: it was called Watermelon Queen from v1.31 to v1.32.1 by mistake, the Queen is the boss */
const FN=['Cherry','Strawberry','Grape','Lemon','Orange','Apple','Pear','Pineapple','Peach','Rockmelon','Watermelon'],fnm=l=>FN[l]+' ('+(l+1)+')',fna=l=>(/^[AEIOU]/.test(FN[l])?'an ':'a ')+fnm(l);
/* fruit families (v1.34): a tag on each size. A family merge is two fruit of that family merging, so FAM[l-1] for the fruit made at tier l. Pineapple is Tropical only */
const FAM=['st','be','be','ci','ci','po','po','tr','st','me','me'],FMN={st:'Stone fruit',be:'Berries',ci:'Citrus',po:'Pome',tr:'Tropical',me:'Melons'};
const RQ=[100,130,160]; /* depth 1 score targets: jar 1, jar 2, boss */
const RSC=[1,2.6,6,13,27,55,100,180],RSCX=2; /* target multiplier per depth, then ×RSCX for every endless depth */
const RPAY=[3,4,6],RAR=['Common','Uncommon','Rare','Fused','Legendary'];
/* Charms. r = rarity, c = price, d = description. Scoring hooks get a context c:
   l = fruit tier made (-1 when not a merge), combo, bull, enc, n = fruit in the jar, jd/dl = drops made/left this jar, jm = merges this jar, sm = merges this jar that made a size 4 fruit or smaller,
   first = the first time this size is made this jar, wall = a merging fruit touched a wall, low = the merge was in the bottom third of the jar, trick = a thrown fruit hit a wall and then merged before touching anything else, pu = different tools used this jar, tu = tool uses this jar, gold = gold fruit in the jar, rk = rocks in the jar, sdl = seed levels held, full = every charm slot is filled, high = pile at the gold line, coins, luck, nc = charms owned, ch = this charm's saved state.
   v1.40: gm = gold fruit merged this jar (the one in this merge included), bf = one of the 3 merges after a fruit was destroyed (Bonfire), ov = the pile is over the line, mis = {n}: chance charms that missed this jar (Lucky Clover, Snake Eyes and Four-Leaf Clover add 1 on a miss), ms0 = mis.n before this merge (so charm order never matters),
   nr = no rolls (the score table: chance charms count as ×1), sdn = fruit sizes with a seed, spt = coins spent in the last shop (R.sp), tf = every tool held is fully charged (and at least one is held).
   chip adds points, add adds Mult, x multiplies Mult. Charms with no hook are handled in makeGame or RG.
   dev = a prototype: only in the dev panel, never in the shop, crates or Almanac. req = only offered while the run holds that charm.
   fu = [a, b]: a fusion, made from those two charms. Fusions are rarity 3, never sold, and only come out of boss crates.
   Rarity 4 = Legendary: never in the shop, only out of a bought Charm Crate (CRL per charm inside) or a melon crate (CRT.melon.lg). x0 = where a growing × starts, when not ×1. */
/* pet groups for req: CAT = brings the caterpillar, EAT = a pet that eats fruit, PETS = any pet */
/* a chance charm missed: counted for Rabbit's Foot (c.mis is only there on a real merge, never in the score table) */
const miss=c=>{if(c.mis)c.mis.n++;return 1;};
const CAT=['pet','frenzy'],EAT=['pet','frenzy','mole','zoo','hog'],PETS=['pet','frenzy','mole','zoo','bee','bfly','nectar','hog','lady'],BEE=['bee','bfly','nectar'],MOLE=['mole','zoo'],BOMB=['boom','volcano','cbomb','gtree'],WILD=['joker','fdeck','vine'];
const CH={
 juicer:{n:'Juicer',r:0,c:5,d:'+1 Mult.',add:()=>1},
 honey:{n:'Honey Pot',r:0,c:5,d:'Every merge scores +8 points.',chip:()=>8},
 chain:{n:'Chain Reaction',r:0,c:5,d:'In a combo (merges less than 1 second apart), the 2nd merge gets +0.5 Mult, the 3rd +1, and so on (up to +4).',add:c=>Math.min(4,c.combo*.5)},
 bull:{n:'Bullseye',r:0,c:5,d:'A dropped fruit that merges before it touches anything else gets ×2 Mult.',x:c=>c.bull?2:1},
 early:{n:'Early Bird',r:0,c:4,d:'×2 Mult for your first 6 drops of each jar.',x:c=>c.jd<=6?2:1},
 clutch:{n:'Photo Finish',r:0,c:4,d:'×2.5 Mult for your last 5 drops of each jar.',x:c=>c.dl<5?2.5:1},
 lucky:{n:'Lucky Clover',r:0,c:5,d:'1 in 4 merges get ×3 Mult.',x:c=>c.l<0||c.nr?1:Math.random()<.25*c.luck?3:miss(c)},
 scratch:{n:'Scratch Card',r:0,c:4,d:'1 in 6 merges pays 1 coin.'},
 lode:{n:'Lodestone',r:0,c:4,o:1,rv:'Every 5th drop is a rock.',d:'Every 5th drop is a Magnet that pulls its matches in.'},
 piggy:{n:'Piggy Bank',r:0,c:4,d:'+3 coins every time you clear a jar.'},
 bag:{n:'Big Basket',r:0,c:5,d:'+5 drops in every jar.'},
 juggle:{n:'Juggler',r:0,c:5,d:'When you use a tool, your other tools each gain 1 charge. A tool can only do this once per drop.'},
 spark:{n:'Spark Plug',r:0,c:5,d:'Every tool starts each jar fully charged.'},
 coupon:{n:'Coupon',r:0,c:4,d:'Everything in the shop costs 1 coin less.'},
 heavy:{n:'Heavyweight',r:1,c:7,d:'Merges that make a size 6 fruit or bigger get ×2.5 Mult.',x:c=>c.l>=5?2.5:1},
 crumbs:{n:'Crumbs',r:1,c:6,d:'Every merge that makes a size 4 fruit or smaller adds +2 points to every merge for the rest of the jar.',chip:c=>c.l>=0?(c.sm||0)*2:0},
 hot:{n:'Hot Streak',r:1,c:6,d:'+0.15 Mult for every merge you have made this jar.',add:c=>c.jm*.15},
 vintage:{n:'Vintage',r:1,c:7,d:'Gains +0.08 Mult every time you clear a jar.',add:c=>c.ch.v||0,live:1},
 hoard:{n:'Hoarder',r:1,c:6,d:'+0.15 Mult for every fruit in the jar.',add:c=>c.n*.15},
 tidy:{n:'Clean Plate',r:1,c:7,d:'×2 Mult while the jar holds 6 fruit or fewer.',x:c=>c.n<=6&&!c.idle?2:1},
 wallet:{n:'Fat Wallet',r:1,c:7,d:'+0.1 Mult for every coin you hold (up to +4).',add:c=>Math.min(4,c.coins*.1)},
 boom:{n:'Fireworks',r:1,c:6,d:'Every 6th drop is a Boom fruit. Each fruit it blows up scores 20 points.'},
 pet:{n:'Pet Caterpillar',r:1,c:6,d:'Every 5 drops it eats a small fruit (size 3 or less) for 45 points.'},
 compost:{n:'Compost',r:1,c:6,d:'Gains +0.05 Mult every time a fruit is destroyed (removed without merging: Boom, pets, Sieve, Harvest, Scrub, Safety Net).',add:c=>c.ch.v||0,live:1},
 show:{n:'Showman',r:1,c:6,d:'The first time you use each tool in a jar gives +1 Mult until the jar ends.',add:c=>c.pu},
 drive:{n:'Overdrive',r:1,c:6,d:'+0.3 Mult for every tool use this jar.',add:c=>c.tu*.3},
 crowd:{n:'Crowd Pleaser',r:1,c:6,d:'Every tool use scores 25 points.'},
 encore:{n:'Encore',r:1,c:6,d:'After you use a tool, your next merge gets ×3 Mult.',x:c=>c.enc&&c.l>=0?3:1},
 battery:{n:'Battery',r:1,c:6,d:'Tools gain double charge.'},
 shoe:{n:'Horseshoe',r:1,c:6,d:'Every "1 in" chance on your items happens twice as often: 1 in 4 becomes 1 in 2.'},
 metro:{n:'Metronome',r:1,c:6,d:'Combos stay alive for 2.5 seconds instead of 1.'},
 net:{n:'Safety Net',r:1,c:6,d:'If the pile overflows, the top half of the jar is cleared instead. Works once.'},
 bank:{n:'Savings Account',r:1,c:6,d:'Interest can pay up to 8 coins per jar instead of 4.'},
 gold:{n:'Golden Touch',r:1,c:6,d:'Earn 1 coin whenever you make a size 6 fruit or bigger.'},
 dynamo:{n:'Dynamo',r:2,c:8,d:'Every drop gives each tool 1 charge.'},
 snake:{n:'Snake Eyes',r:0,c:5,d:'1 in 6 merges get ×4 Mult.',x:c=>c.l<0||c.nr?1:Math.random()<c.luck/6?4:miss(c)},
 magpie:{n:'Magpie',r:1,c:6,d:'+1 Mult for every gold fruit in the jar.',add:c=>c.gold||0},
 ash:{n:'Ashes',r:1,c:6,d:'Every fruit that is destroyed (removed without merging) scores 15 points.'},
 crit:{n:'Sweet Spot',r:2,c:8,d:'Every 5th merge of a jar gets ×5 Mult.',x:c=>c.l>=0&&c.jm>0&&c.jm%5===0?5:1},
 abacus:{n:'Abacus',r:2,c:8,d:'+0.5 Mult for every seed level you hold.',add:c=>c.sdl*.5},
 crew:{n:'Full House',r:2,c:9,d:'×2 Mult while every charm slot is filled.',x:c=>c.full?2:1},
 soil:{n:'Rich Soil',r:2,c:9,o:1,rv:'Every fruit you drop is one size smaller.',d:'Every fruit you drop is one size bigger.'},
 garg:{n:'Gargoyle',r:1,c:6,d:'Rocks never count as over the line. +0.5 Mult for every rock in the jar.',add:c=>(c.rk||0)*.5},
 wire:{n:'High Wire',r:2,c:8,d:'×3 Mult while the pile reaches the gold line near the top of the jar.',x:c=>c.high?3:1},
 limbo:{n:'Limbo',r:2,c:8,d:'×3 Mult. The line sits lower, by 25% of the jar.',x:()=>3}, /* v1.42: the line move is in bossTick */
 ribbon:{n:'Blue Ribbon',r:2,c:9,d:'Starts at ×1 Mult, +0.2 for every charm you own, this one included (5 charms: ×2).',x:c=>1+.2*c.nc},
 /* rares whose ×Mult grows over the run (DESIGN.md priority 4). live:'x' = the grown value is a ×, shown as ×(1+v) */
 snow:{n:'Snowball',r:2,c:9,d:'Gains ×0.04 Mult every time you clear a jar with 5 or more drops left. Starts at ×1.',x:c=>1+(c.ch.v||0),live:'x'},
 oak:{n:'Old Oak',r:2,c:9,d:'Gains ×0.06 Mult every time you make a size 7 fruit or bigger. Starts at ×1.',x:c=>1+(c.ch.v||0),live:'x'},
 fever:{n:'Melon Fever',r:2,c:9,d:'Gains +1.5 Mult every time you make a size 8 fruit or bigger.',add:c=>c.ch.v||0,live:1},
 /* thin builds (see DESIGN.md): small fruit, seeds, gold, position */
 fry:{n:'Small Fry',r:0,c:4,d:'Merges that make a size 4 fruit or smaller get ×2 Mult.',x:c=>c.l>=1&&c.l<=3?2:1},
 pip:{n:'Pip Collector',r:1,c:6,d:'Gains +0.03 Mult every time you make a size 3 fruit or smaller.',add:c=>c.ch.v||0,live:1},
 bite:{n:'Bite Size',r:1,c:6,d:'Fruit you drop are never bigger than size 3. Every merge scores +4 points.',chip:()=>4},
 gard:{n:'Gardener',r:0,c:4,d:'Every boss you beat (mini bosses too) gives +1 level to the seed of a random fruit size.'},
 packet:{n:'Seed Packet',r:0,c:4,d:'Seeds cost 1 coin less.'},
 sprout:{n:'Sprout',r:1,c:6,d:'The first time you make each fruit size in a jar, that merge gets its seed bonus twice.'},
 leaf:{n:'Gold Leaf',r:0,c:4,d:'The first fruit you drop in each jar is gold.'},
 prosp:{n:'Prospector',r:1,c:6,o:1,rv:'1 in 10 fruit you drop arrives mouldy.',d:'1 in 10 fruit you drop is gold.'},
 alch:{n:'Alchemy',r:1,c:6,d:'1 in 3 times a gold fruit merges, the fruit it makes is gold too.'},
 wall:{n:'Wallflower',r:0,c:4,d:'Merges touching a wall score +20 points.',chip:c=>c.wall?20:0},
 low:{n:'Low Tide',r:1,c:7,d:'Merges in the bottom third of the jar get ×2 Mult.',x:c=>c.low?2:1},
 /* pets (DESIGN.md): creatures in the jar, handled in makeGame. Pet combos need a pet (req) */
 bee:{n:'Busy Bee',r:1,c:6,d:'Every 4 drops a bee pollinates a fruit (up to 3 at a time). A pollinated fruit scores ×3 when it merges. Your pets leave pollinated fruit alone.'},
 mole:{n:'Mole',r:1,c:6,d:'Every 6 drops a mole eats a fruit on the floor (size 4 or less) for 40 points.'},
 hog:{n:'Hedgehog',r:1,c:6,d:'When the pile reaches the gold line near the top of the jar, a hedgehog climbs up and eats the highest fruit (size 6 or less) for 50 points. At most once every 3 drops.'},
 lady:{n:'Ladybird',r:0,c:4,d:'A ladybird rides one fruit. When that fruit merges, the merge scores ×2 and she moves to the new fruit.'},
 bowl:{n:'Pet Bowl',r:0,c:4,req:EAT,d:'+0.3 Mult for every fruit your pets have eaten this jar.',add:c=>(c.ml||0)*.3},
 treats:{n:'Pet Treats',r:0,c:4,req:EAT,d:'Every fruit your pets eat scores 30 more points.'},
 chrys:{n:'Chrysalis',r:1,c:6,req:CAT,d:'Every 4th fruit your caterpillar eats, it turns into a butterfly: +0.5 Mult for the rest of the run.',add:c=>c.ch.v||0,live:1},
 appetite:{n:'Big Appetite',r:1,c:6,req:EAT,d:'Your pets can eat bigger fruit: the caterpillar and mole up to size 5, the hedgehog up to size 7. Eating a size 4 or bigger fruit scores 3 times as much.'},
 /* batch 1 of the pool expansion (v1.43, DESIGN.md "Pool expansion plan"): pets */
 collar:{n:'Pet Collar',r:0,c:4,req:PETS,d:'Your pets gain levels twice as fast.'},
 dbag:{n:'Doggy Bag',r:0,c:4,req:EAT,d:'+0.1 Mult for every fruit your pets have eaten this jar.',add:c=>(c.ml||0)*.1},
 pcount:{n:'Pollen Count',r:0,c:5,req:BEE,d:'+0.5 Mult for every pollinated fruit in the jar.',add:c=>(c.pn||0)*.5},
 truffle:{n:'Truffle Hunt',r:0,c:4,req:MOLE,d:'Every fruit your Mole eats pays 1 coin.'},
 wfed:{n:'Well Fed',r:1,c:6,req:EAT,d:'Once your pets have eaten 3 fruit in a jar, ×2 Mult for the rest of the jar.',x:c=>(c.ml||0)>=3?2:1},
 pack:{n:'Pack Leader',r:1,c:7,req:PETS,d:'Starts at ×1 Mult, +0.25 for every pet you hold.',x:c=>1+.25*(c.npt||0)},
 xpol:{n:'Cross-Pollination',r:1,c:6,req:BEE,d:'The first pollinated merge of each jar gives the seed of the size it makes +1 level.'},
 /* bombs (Boom fruit come from Fireworks, Volcano and the Cherry Bomb tool) */
 shortf:{n:'Short Fuse',r:0,c:4,req:BOMB,d:'Boom fruit go off the moment they land, and score +10 points for every fruit they hit.'},
 shrap:{n:'Shrapnel',r:0,c:4,req:BOMB,d:'Boom blasts reach 50% further and hit up to 5 fruit instead of 3.'},
 demo:{n:'Demolition',r:0,c:5,d:'Every merge scores +3 points for every fruit destroyed (removed without merging) this jar.',chip:c=>(c.kd||0)*3},
 zbomb:{n:'Zest Bomb',r:1,c:6,req:BOMB,d:'Boom fruit only hit Citrus (Lemons and Oranges), up to 3 anywhere in the blast. Every Citrus destroyed gives +0.3 Mult for the rest of the jar.',add:c=>(c.zb||0)*.3},
 bbomb:{n:'Bloom Bomb',r:1,c:6,req:BOMB,d:'Boom fruit grow the fruit they hit one size instead of destroying them. A grown fruit scores half when it next merges.'},
 cblast:{n:'Chain Blast',r:1,c:6,req:BOMB,d:'1 in 3 fruit destroyed by a Boom explode too.'},
 /* batch 2 (v1.44): Wildcards, a new special fruit that merges with any size, makes one size up from the bigger and scores half */
 joker:{n:'Joker Seed',r:1,c:6,d:'Every 10th fruit is a Wildcard: it merges with a fruit of any size and makes one size up from the bigger of the two. Wildcard merges score half.'},
 wcard:{n:'Wild Card',r:0,c:4,req:WILD,d:'Wildcard merges score full points instead of half.'},
 masq:{n:'Masquerade',r:1,c:6,req:WILD,d:'A merge with a Wildcard counts as every family, for family charms.'},
 /* families */
 csq:{n:'Citrus Squeeze',r:0,c:4,d:'Citrus merges (two Lemons or two Oranges) give every tool +1 charge.'},
 tpunch:{n:'Tropical Punch',r:0,c:4,d:'Two Pineapples (8) merging pay 3 coins.'},
 bbowl:{n:'Berry Bowl',r:0,c:4,d:'Berry merges (two Strawberries or two Grapes) in a combo score +20 points.',chip:c=>(c.fa==='be'||c.wf)&&c.combo>=1?20:0},
 fsalad:{n:'Fruit Salad',r:1,c:6,d:'In a combo (merges less than 1 second apart), the merge that brings it to 3 different families gets ×3 Mult.',x:c=>c.fs3?3:1},
 orch:{n:'Orchardist',r:1,c:6,d:'+0.5 Mult for every Orchard item you hold.',add:c=>(c.nor||0)*.5},
 /* boss counters: turn mould, frost and Sticky into a payoff */
 bcheese:{n:'Blue Cheese',r:1,c:6,d:'Mouldy fruit can merge with each other, and those merges get ×2 Mult.',x:c=>c.mo?2:1},
 isculpt:{n:'Ice Sculptor',r:1,c:6,d:'A fruit that has been frozen gets ×2 Mult on its next merge.',x:c=>c.wz?2:1},
 stooth:{n:'Sweet Tooth',r:0,c:4,d:'Sticky fruit score +20 points when they merge.',chip:c=>c.stk?20:0},
 /* batch 3 (v1.45): small fruit */
 psq:{n:'Pip Squeak',r:0,c:4,d:'Every merge that makes a Strawberry (2) pushes the fruit around it apart a little.'},
 gberry:{n:'Golden Berry',r:0,c:5,d:'1 in 8 merges that make a Strawberry (2) make it gold.'},
 kindl:{n:'Kindling',r:1,c:6,d:'Merges that make a Strawberry (2) or Grape (3) give every tool +1 charge, once per drop.'},
 nurs:{n:'Nursery',r:1,c:6,d:'+0.25 Mult for every Cherry and Strawberry in the jar. Two Cherries merging get ×2 Mult.',add:c=>(c.ncs||0)*.25,x:c=>c.l===1?2:1},
 /* big fruit */
 bbrk:{n:'Big Break',r:0,c:5,d:'The first merge of each jar that makes a size 7 fruit or bigger gets ×3 Mult.',x:c=>c.bb1?3:1},
 ball:{n:'Ballast',r:0,c:4,d:'Apples (6) and bigger fall 30% faster and push other fruit harder.'},
 sky:{n:'Skyline',r:1,c:7,d:'Starts at ×1 Mult, +0.25 for every different size from 6 up in the jar.',x:c=>1+.25*(c.sk6||0)},
 lslide:{n:'Landslide',r:1,c:6,d:'Making a size 8 fruit or bigger settles the pile (a free Rumble) and gives +2 Mult for the rest of the jar.',add:c=>(c.ls||0)*2},
 /* combo */
 fin:{n:'Finisher',r:0,c:4,d:'When a combo of 2 or more merges ends, it scores +25 points for every merge in it.'},
 rfire:{n:'Rapid Fire',r:0,c:4,d:'Drop 3 fruit within 2 seconds: +0.3 Mult for the rest of the jar.',add:c=>(c.rf||0)*.3},
 dom:{n:'Domino',r:1,c:6,d:'The 4th merge of a combo gives 1 drop back.'},
 droll:{n:'Drumroll',r:1,c:6,d:'The 3rd merge of every combo gives +0.2 Mult for the rest of the jar.',add:c=>(c.drn||0)*.2},
 /* gold */
 pdirt:{n:'Pay Dirt',r:0,c:4,d:'The first gold merge of each jar pays 3 more coins.'},
 gplate:{n:'Gold Plating',r:1,c:6,d:'Gold fruit never count as over the line.'},
 gstd:{n:'Gold Standard',r:1,c:7,d:'+0.1 Mult for every coin gold fruit have paid you this run (up to +5).',add:c=>Math.min(5,(c.gco||0)*.1)},
 /* batch 4 (v1.46): seeds */
 cbin:{n:'Compost Bin',r:0,c:4,d:'In the shop, seeds cost 1 coin less for every fruit destroyed (removed without merging) in the jar you just played, up to 3 less.'},
 hmoon:{n:'Harvest Moon',r:1,c:6,d:'The first merge each jar that makes a size whose seed is level 3 or higher gets ×3 Mult.',x:c=>c.first&&(c.sdv||0)>=3?3:1},
 sbank:{n:'Seed Bank',r:1,c:6,d:'Seed prices stop rising once a seed reaches level 3.'},
 /* tools */
 jstart:{n:'Jump Start',r:0,c:4,d:'The first merge of each jar gives every tool +2 charge.'},
 tremor:{n:'Tremor',r:0,c:4,d:'Using Shake or Rumble gives your other tools +1 charge.'},
 recyc:{n:'Recycler',r:1,c:6,d:'Every 4th tool use in a jar is free: the tool keeps its charge.'},
 tsmith:{n:'Toolsmith',r:1,c:6,d:'Tools you aim at a fruit (Ripen, Twin, Midas, Anchor, Lead Weight, Shears, Petrify...) need 2 less charge, never less than 2.'},
 /* position and rocks */
 fshow:{n:'Floor Show',r:0,c:4,d:'Merges touching the floor score +15 points.',chip:c=>c.floor?15:0},
 balc:{n:'Balcony',r:0,c:4,d:'Merges above the gold line near the top of the jar score +40 points.',chip:c=>c.hi?40:0},
 ppol:{n:'Pebble Polish',r:0,c:4,d:'Every rock touching a merge adds +15 points to it.',chip:c=>(c.rkt||0)*15},
 cstage:{n:'Centre Stage',r:1,c:6,d:'Merges in the middle third of the jar get ×2 Mult.',x:c=>c.mid?2:1},
 geode:{n:'Geode',r:1,c:6,d:'A rock touched by 3 merges cracks open into a gold fruit of its size.'},
 /* economy and chance */
 tjar:{n:'Tip Jar',r:0,c:4,d:'Every 10th merge of a jar pays 1 coin.'},
 lchange:{n:'Loose Change',r:0,c:4,d:'Selling a charm gives 2 more coins.'},
 cint:{n:'Compound Interest',r:1,c:7,d:'+0.05 Mult for every coin of interest you have earned this run (up to +5).',add:c=>Math.min(5,(c.intc||0)*.05)},
 dnoth:{n:'Double or Nothing',r:1,c:6,d:'Every merge has a 1 in 2 chance of ×2 Mult. Otherwise it gets ×0.75.',x:c=>c.l<0||c.nr?1:Math.random()<Math.min(.75,.5*c.luck)?2:(miss(c),.75)},
 /* throwing */
 lob:{n:'Lob',r:0,c:4,req:'sling',d:'Slingshot throws are 30% faster.'},
 /* Orchard expansion (v1.47): 20 Orchard items, most of them uncommon, each feeding a new build from the side. rv = what Sour Graft makes it do */
 mtap:{n:'Maple Tap',r:0,c:4,o:1,rv:'Every 7th fruit is a rock.',d:'Every 7th fruit is Sticky and stays where it lands.'},
 smaple:{n:'Sugar Maple',r:0,c:4,o:1,rv:'Every 10th fruit is a rock.',d:'Every 10th fruit is Candied: when it merges, the merge scores +40 points.'},
 corch:{n:'Cherry Orchard',r:0,c:4,o:1,rv:'Cherries (1) drop half as often.',d:'Cherries (1) drop twice as often.'},
 mring:{n:'Mushroom Ring',r:0,c:4,o:1,rv:'Every 12th fruit you drop is a rock.',d:'Every 12th fruit you drop arrives mouldy.'},
 fpock:{n:'Frost Pocket',r:0,c:4,o:1,rv:'Every 10th fruit you drop is a rock.',d:'Every 10th fruit you drop freezes where it lands for 3 seconds.'},
 wsock:{n:'Wind Sock',r:0,c:4,o:1,req:'sling',rv:'Thrown fruit fly 25% less far.',d:'Thrown fruit fly 25% further.'},
 vine:{n:'Grafting Vine',r:1,c:6,o:1,rv:'Every 12th fruit is a rock.',d:'Every 12th fruit is a Wildcard: it merges with a fruit of any size and makes one size up from the bigger, for half the points.'},
 gtree:{n:'Gunpowder Tree',r:1,c:6,o:1,rv:'Every 9th fruit is a rock.',d:'Every 9th fruit is a Boom fruit that blows up the fruit next to it.'},
 treat:{n:'Treat Tree',r:1,c:6,o:1,req:PETS,rv:'Every 8th fruit is a rock.',d:'Every 8th fruit is a Treat. Your pets eat Treats first, and every Treat eaten gives that pet 1 XP towards its next level.'},
 dblos:{n:'Double Blossom',r:1,c:6,o:1,rv:'Every 10th fruit you drop is a rock.',d:'Every 10th fruit you drop comes with a free copy beside it.'},
 sbush:{n:'Spark Bush',r:1,c:6,o:1,rv:'Every 8th fruit is a rock.',d:'Every 8th fruit is Charged: when it merges, every tool gets +1 charge.'},
 mtree:{n:'Money Tree',r:1,c:6,o:1,rv:'Every 10th fruit is a rock.',d:'Every 10th fruit carries a coin: when it merges, it pays 1 coin.'},
 vol:{n:'Volunteer Seedlings',r:1,c:6,o:1,rv:'Every 8th fruit is a Cherry (1).',d:'Every 8th fruit is one size below the size you hold the most seed levels in, so two of them merge into it (up to an Orange).'},
 term:{n:'Termite Mound',r:1,c:6,o:1,rv:'Every 12th fruit is a rock.',d:'Every 12th fruit is Brittle: if it has not merged 6 seconds after landing, it crumbles away (counts as destroyed).'},
 tbrz:{n:'Tropical Breeze',r:1,c:6,o:1,rv:'Every 20th fruit is a Cherry (1).',d:'Every 20th fruit is a Pineapple (8).'},
 glade:{n:'Firefly Glade',r:1,c:6,o:1,rv:'Every 6th fruit is a rock.',d:'Every 6th fruit Glows: a merge with a glowing fruit always counts as part of a combo, however long it has been.'},
 sink:{n:'Sinkhole',r:1,c:6,o:1,rv:'Every 8th fruit you drop is a rock.',d:'Every 8th fruit you drop is Heavy, like Lead Weight: 8 times the mass, it sinks and pushes other fruit aside.'},
 srain:{n:'Seed Rain',r:1,c:5,o:1,rv:'Every 6th fruit is a Lemon (4).',d:'Every 6th fruit is a Cherry (1) or a Strawberry (2).'},
 gourd:{n:'Gourd Vine',r:2,c:8,o:1,rv:'Every 15th fruit is a Cherry (1).',d:'Every 15th fruit is a Pear (7).'},
 gapple:{n:'Golden Apple Tree',r:2,c:9,o:1,rv:'Every 12th fruit is a Cherry (1).',d:'Every 12th fruit is a gold Apple (6).'},
 /* legendaries: each one breaks a rule, or grows ×Mult over the run. Phoenix (no slot, grows on a save) and Cornucopia in makeGame, White Flag in RG.jarCfg and RG.advance, Stowaway in RG.slots, RG.os and RG.score, Heirloom grows in RG.advance (g = growth). NSL = the ones that take no slot */
 phoenix:{n:'Phoenix',r:4,c:15,d:'Takes no charm slot. If the pile overflows, the top half of the jar is cleared instead, once in every jar: each fruit cleared scores twice its size\'s base points and Phoenix gains ×0.5 Mult. Starts at ×1.',x:c=>1+(c.ch.v||0),live:'x'},
 horn:{n:'Cornucopia',r:4,c:15,d:'×1.5 Mult. Every merge that makes an Orange (5) or bigger gives 1 drop back.',x:()=>1.5}, /* v1.41: growth per drop left and drops from a Lemon measured 80 to 88% with the bot, cut */
 heir:{n:'Heirloom',r:4,c:15,d:'Gains ×0.1 Mult every time you clear a jar. Starts at ×1.25.',x:c=>1.25+(c.ch.v||0),live:'x',x0:1.25,g:.1},
 stow:{n:'Stowaway',r:4,c:15,d:'Takes no charm slot. ×1.75 Mult. +1 Orchard slot. The charm furthest right, other than this one, counts twice for points and Mult.',x:()=>1.75},
 flag:{n:'White Flag',r:4,c:15,d:'Bosses never reach phase 2 and bring no curses. Boss targets are 10% lower. Gains ×0.08 Mult for every boss you beat (mini bosses too). Starts at ×1.',x:c=>1+(c.ch.v||0),live:'x',g:.08,q:.9},
 /* active legendaries (v1.41): n2 = how many merges or drops it lasts, xm = what its merges score ×, gl = the gold it gives (2 = Golden Hand's). act = the charge one use needs, 1 per merge, kept in the charm as c (none = full). Tap the charm in a jar, then Use (G.g.act). Effects in act() in makeGame */
 grain:{n:'Golden Rain',r:4,c:15,act:10,gl:2,d:'Active (tap it in a jar, then Use; 10 charge, 1 per merge): every fruit in the jar turns gold. Each scores ×3 and pays 4 coins when it merges.'},
 nova:{n:'Supernova',r:4,c:15,act:8,xm:10,d:'Active (tap it in a jar, then Use; 8 charge, 1 per merge): every fruit with a partner of its size merges with it at once, all sizes, and those merges score ×10.'},
 lime:{n:'Limelight',r:4,c:15,act:10,n2:8,d:'Active (tap it in a jar, then Use; 10 charge, 1 per merge): your next 8 merges score ×4.'},
 passer:{n:'Passerby',r:4,c:15,act:6,n2:6,d:'Active (tap it in a jar, then Use; 6 charge, 1 per merge): a Russian Blue cat carries your next 6 fruit through the jar and sets each one down on a fruit of its size. Those drops are free.'},
 /* throwing fruit (being tested) */
 trick:{n:'Trick Shot',r:1,c:6,req:'sling',d:'A thrown fruit that bounces off a wall and merges before touching anything else gets ×3 Mult.',x:c=>c.trick?3:1},
 /* style (v1.36): throwing charms need the Slingshot tool (req). c.wb = wall bounces of thrown fruit this jar, c.pin = wall bounces of the thrown fruit in this merge, c.wt = seconds waited before the last drop */
 ricochet:{n:'Ricochet',r:0,c:5,req:'sling',d:'+0.2 Mult for every wall bounce of a thrown fruit this jar, up to +3.',add:c=>Math.min(3,(c.wb||0)*.2)},
 curve:{n:'Curveball',r:1,c:6,req:'sling',d:'A thrown fruit curves towards the nearest fruit of its size.'},
 pinball:{n:'Pinball',r:2,c:9,req:'sling',d:'A thrown fruit gets ×1.25 Mult for every wall bounce (up to 4) if it merges before it comes to rest.',x:c=>Math.pow(1.25,Math.min(4,c.pin||0))},
 quick:{n:'Quick Hands',r:0,c:4,d:'You can drop again 0.3 seconds after a drop, instead of 0.55.'},
 slow:{n:'Slow Cook',r:1,c:6,d:'+0.5 Mult for every second you waited before your last drop (up to +2).',add:c=>Math.min(2,(c.wt||0)*.5)},
 linger:{n:'Lingering',r:1,c:6,d:'Timed tools last 2 more drops. Switch-on tools (Slingshot, Moon Boots) use 1 charge every 2 drops instead of every drop.'},
 /* v1.40: ×Mult for builds that had none of their own (combo, destruction, economy, seeds, gold, tools, chance, the full jar). Context fields in the comment above CH. Family Tree is in RG.score */
 cresc:{n:'Crescendo',r:1,c:7,d:'In a combo (merges less than 1 second apart), the 2nd merge and every merge after it get ×2 Mult.',x:c=>c.combo>=1?2:1},
 bonfire:{n:'Bonfire',r:1,c:6,d:'After a fruit is destroyed (removed without merging), your next 3 merges get ×2 Mult.',x:c=>c.bf&&c.l>=0?2:1},
 spender:{n:'Big Spender',r:1,c:7,d:'Starts at ×1 Mult, +0.1 for every 2 coins you spent in the last shop (up to ×2).',x:c=>Math.min(2,1+.1*Math.floor((c.spt||0)/2))},
 poly:{n:'Polyculture',r:1,c:7,d:'Starts at ×1 Mult, +0.1 for every fruit size you hold a seed for.',x:c=>1+.1*(c.sdn||0)},
 hall:{n:'Hallmark',r:1,c:6,d:'Starts at ×1 Mult, +0.5 for every gold fruit merged this jar (up to ×3).',x:c=>Math.min(3,1+.5*(c.gm||0))},
 fright:{n:'Stage Fright',r:2,c:9,d:'×2 Mult while every tool you hold is fully charged.',x:c=>c.tf?2:1},
 foot:{n:"Rabbit's Foot",r:0,c:5,req:['lucky','snake','fourleaf'],d:'Every time Lucky Clover, Snake Eyes or Four-Leaf Clover fails to trigger on a merge, +0.15 Mult until the jar ends.',add:c=>(c.ms0||0)*.15},
 brink:{n:'Brinkmanship',r:2,c:9,d:'Merges made while the pile is over the line get ×3 Mult.',x:c=>c.ov&&c.l>=0?3:1},
 ftree:{n:'Family Tree',r:1,c:6,d:'Fruit in the same family share seeds: each also gets half the other\'s seed levels (Lemon and Orange, Strawberry and Grape, Apple and Pear, Melon and Watermelon). Peach and Pineapple get nothing.'},
 fourleaf:{n:'Four-Leaf Clover',r:3,c:12,fu:['lucky','shoe'],d:'1 in 2 merges get ×3 Mult. Your other "1 in" chances happen twice as often.',x:c=>c.l<0||c.nr?1:Math.random()<.5?3:miss(c)},
 goose:{n:'Golden Goose',r:3,c:12,fu:['piggy','bank'],d:'+4 coins every time you clear a jar. Interest can pay up to 10 coins per jar.'},
 volcano:{n:'Volcano',r:3,c:12,fu:['boom','compost'],d:'Every 5th drop is a Boom fruit. Each fruit it blows up scores 40 points. Gains +0.1 Mult every time a fruit is destroyed (removed without merging).',add:c=>c.ch.v||0,live:1},
 headline:{n:'Headliner',r:3,c:12,fu:['show','encore'],d:'Every tool use gives +0.5 Mult until the jar ends, and gives your next merge ×3 Mult.',add:c=>c.tu*.5,x:c=>c.enc&&c.l>=0?3:1},
 smoothie:{n:'Smoothie',r:3,c:12,fu:['juicer','honey'],d:'+1.5 Mult. Every merge scores +12 points.',add:()=>1.5,chip:()=>12},
 marathon:{n:'Marathon',r:3,c:12,fu:['early','clutch'],d:'×3 Mult for your first 7 and last 6 drops of each jar.',x:c=>c.jd<=7||c.dl<6?3:1},
 wildfire:{n:'Wildfire',r:3,c:12,fu:['hot','chain'],d:'+0.3 Mult for every merge you have made this jar. In a combo (merges less than 1 second apart), the 2nd merge gets +1 Mult, the 3rd +2, and so on (up to +8).',add:c=>c.jm*.3+Math.min(8,c.combo)},
 mania:{n:'Melon Mania',r:3,c:14,fu:['heavy','fever'],d:'Merges that make a size 6 fruit or bigger get ×3 Mult. Gains +2 Mult every time you make a size 8 fruit or bigger.',add:c=>c.ch.v||0,x:c=>c.l>=5?3:1,live:1},
 mint:{n:'The Mint',r:3,c:12,fu:['scratch','gold'],d:'1 in 4 merges pays 1 coin. Earn 2 coins whenever you make a size 6 fruit or bigger.'},
 snack:{n:'Snack Pack',r:3,c:12,fu:['bite','hoard'],d:'Fruit you drop are never bigger than size 3. +0.25 Mult for every fruit in the jar. Every merge scores +6 points.',add:c=>c.n*.25,chip:()=>6},
 svault:{n:'Seed Vault',r:3,c:12,fu:['sprout','packet'],d:'Seeds cost 2 coins less. The first time you make each fruit size in a jar, that merge gets its seed bonus three times.'},
 phil:{n:"Philosopher's Stone",r:3,c:12,fu:['leaf','alch'],d:'The first 2 fruit you drop in each jar are gold. 1 in 2 times a gold fruit merges, the fruit it makes is gold too (Horseshoe does not change this).'},
 keep:{n:'Keepsake',r:3,c:12,fu:['pip','vintage'],d:'Gains +0.04 Mult every time you make a size 3 fruit or smaller, and +0.12 every time you clear a jar.',add:c=>c.ch.v||0,live:1},
 bfly:{n:'Butterfly Garden',r:3,c:12,fu:['chrys','bee'],d:'Every 3rd fruit your caterpillar eats, it turns into a butterfly: +0.5 Mult for the rest of the run. Every 3 drops a bee pollinates a fruit, and pollinated fruit score ×4 when they merge.',add:c=>c.ch.v||0,live:1},
 nectar:{n:'Nectar',r:3,c:12,fu:['bee','treats'],d:'Every 4 drops a bee pollinates a fruit (up to 3 at a time). A pollinated fruit scores ×3 when it merges. Pets eat pollinated fruit first, and a pollinated meal scores ×3 too. Every fruit your pets eat scores 30 more points.'},
 zoo:{n:'Menagerie',r:3,c:12,fu:['bowl','mole'],d:'+0.5 Mult for every fruit your pets have eaten this jar. Every 5 drops a mole eats a fruit on the floor (size 4 or less) for 60 points.',add:c=>(c.ml||0)*.5},
 sharp:{n:'Sharpshooter',r:3,c:12,fu:['bull','lode'],d:'Every 4th drop is a Magnet. A dropped fruit that merges before it touches anything else gets ×4 Mult.',x:c=>c.bull?4:1},
 /* fusions for the thin-build charms (DESIGN.md) */
 frenzy:{n:'Feeding Frenzy',r:3,c:12,fu:['fry','pet'],d:'Merges that make a size 4 fruit or smaller get ×3 Mult. Every 4 drops a caterpillar eats a small fruit (size 3 or less) for 90 points.',x:c=>c.l>=1&&c.l<=3?3:1},
 green:{n:'Greenhouse',r:3,c:12,fu:['gard','abacus'],d:'Every boss you beat (mini bosses too) gives +1 level to the seeds of 2 random fruit sizes. +0.75 Mult for every seed level you hold.',add:c=>c.sdl*.75},
 hunter:{n:'Treasure Hunter',r:3,c:12,fu:['prosp','magpie'],d:'1 in 6 fruit you drop is gold. +1.5 Mult for every gold fruit in the jar.',add:c=>(c.gold||0)*1.5},
 still:{n:'Still Water',r:3,c:12,fu:['low','tidy'],d:'Merges in the bottom third of the jar get ×2.5 Mult. ×2 more while the jar holds 8 fruit or fewer.',x:c=>(c.low?2.5:1)*(c.n<=8&&!c.idle?2:1)},
 ivy:{n:'Climbing Ivy',r:3,c:12,fu:['wall','wire'],d:'Merges touching a wall score +30 points and get ×1.5 Mult. ×3 Mult while the pile reaches the gold line near the top of the jar.',chip:c=>c.wall?30:0,x:c=>(c.wall?1.5:1)*(c.high?3:1)},
 /* rv = what it does while The Sour Graft has it working backwards (v1.37) */
 /* the Orchard row (v1.34): o = an Orchard item. It sits in R.or, not a charm slot, and only changes what drops and the state a drop arrives in. Lodestone, Rich Soil and Prospector moved here (o:1 above) */
 citrus:{n:'Citrus Grove',r:0,c:4,o:1,rv:'Lemons (4) drop half as often.',d:'Lemons (4) drop twice as often.'},
 berry:{n:'Berry Patch',r:0,c:4,o:1,rv:'Strawberries (2) and Grapes (3) drop half as often.',d:'Strawberries (2) and Grapes (3) drop twice as often.'},
 rubber:{n:'Rubber Tree',r:1,c:6,o:1,rv:'Every 5th fruit you drop is Sticky.',d:'Every 5th fruit you drop is bouncy: it springs off walls and fruit until it has bounced 4 times.'},
 fore:{n:'Forecast',r:0,c:4,o:1,rv:'The Next box is hidden.',d:'Shows the 2 fruit that come after Next.'},
 dew:{n:'Morning Dew',r:0,c:4,o:1,rv:'Your first 6 fruit of each jar are Lemons (4).',d:'Your first 6 fruit of each jar are Cherries (1).'},
 crop:{n:'Crop Rotation',r:0,c:4,o:1,rv:'Every 4th drop is a rock.',d:'Drops take turns by family: a Cherry (1), then a Strawberry (2) or Grape (3), then a Lemon (4).'},
 rgard:{n:'Rock Garden',r:0,c:3,o:1,rv:'No rocks from it.',d:'Every 8th fruit is a rock.'},
 weed:{n:'Weeding',r:1,c:6,o:1,rv:'Cherries (1) drop twice as often.',d:'Cherries (1) never drop.'},
 hothouse:{n:'Hothouse',r:1,c:6,o:1,rv:'1 in 12 fruit you drop is a Cherry (1).',d:'1 in 12 fruit you drop is an Apple (6).'},
 second:{n:'Second Helping',r:1,c:6,o:1,rv:'Every 5th fruit is never the same as the one before it.',d:'Every 5th fruit is the same as the one before it.'},
 hive:{n:'Beehive',r:1,c:6,o:1,rv:'Every 6th fruit you drop arrives mouldy.',d:'Every 6th fruit you drop arrives pollinated: it scores ×3 when it merges.'},
 ghour:{n:'Golden Hour',r:1,c:7,o:1,rv:'Your last 4 drops arrive mouldy.',d:'Your last 4 drops of each jar arrive gold.'},
 hotbed:{n:'Hot Bed',r:1,c:6,o:1,rv:'When a combo reaches 3 merges, your Next fruit becomes a rock.',d:'When a combo (merges less than 1 second apart) reaches 3 merges, your Next fruit becomes a Magnet.'},
 /* family scorers: c.fa = the family of the pair that merged, c.fm = family merges this jar (this one included), */
 zest:{n:'Zest',r:0,c:5,d:'+0.3 Mult for every Citrus merge this jar (two Lemons or two Oranges).',add:c=>(c.fm&&c.fm.ci||0)*.3},
 picker:{n:'Berry Picker',r:0,c:5,d:'Berry merges (two Strawberries or two Grapes) score +15 points.',chip:c=>(c.fa==='be'||c.wf)?15:0},
 pit:{n:'Cherry Pit',r:1,c:6,d:'+0.5 Mult for every Stone fruit merge this jar (two Cherries or two Peaches). Two Peaches merging get ×5 Mult.',add:c=>(c.fm&&c.fm.st||0)*.5,x:c=>c.l===9?5:1},
 cider:{n:'Cider Press',r:1,c:7,d:'Pome merges (two Apples or two Pears) get ×3 Mult.',x:c=>(c.fa==='po'||c.wf)?3:1},
 medley:{n:'Medley',r:1,c:7,d:'Starts at ×1 Mult, +0.15 for every family you have merged this jar.',x:c=>1+.15*Object.keys(c.fm||{}).length},
 tiki:{n:'Tiki Bar',r:2,c:9,d:'Gains ×0.25 Mult every time two Pineapples (8) merge. Starts at ×1.',x:c=>1+(c.ch.v||0),live:'x'},
 /* fusion payoffs (v1.35): Grafter reads c.nfu = fusions held (charms, Orchard items and tools), Rootstock is in RG.take */
 graft:{n:'Grafter',r:1,c:7,d:'+2 Mult for every fusion you hold.',add:c=>2*(c.nfu||0)},
 root:{n:'Rootstock',r:0,c:5,d:'Making a fusion gives +2 levels to the seed of a random fruit size.'},
 /* Orchard fusions: an Orchard item and a charm make a charm (it takes the charm's slot and frees the Orchard one), two Orchard items make an Orchard item */
 marm:{n:'Marmalade',r:3,c:12,fu:['zest','citrus'],d:'Lemons (4) drop twice as often. +0.5 Mult for every Citrus merge this jar.',add:c=>(c.fm&&c.fm.ci||0)*.5},
 jam:{n:'Jam',r:3,c:12,fu:['picker','berry'],d:'Strawberries (2) and Grapes (3) drop twice as often. Berry merges score +25 points and get ×1.5 Mult.',chip:c=>(c.fa==='be'||c.wf)?25:0,x:c=>(c.fa==='be'||c.wf)?1.5:1},
 mill:{n:'Cider Mill',r:3,c:12,fu:['cider','hothouse'],d:'1 in 12 fruit you drop is an Apple (6). Pome merges get ×4 Mult.',x:c=>(c.fa==='po'||c.wf)?4:1},
 zen:{n:'Zen Garden',r:3,c:12,fu:['garg','rgard'],d:'Every 6th fruit is a rock. Rocks never count as over the line. Starts at ×1 Mult, +0.25 for every rock in the jar.',x:c=>1+.25*(c.rk||0)},
 alpha:{n:'Alpha',r:3,c:12,fu:['pack','collar'],d:'Starts at ×1 Mult, +0.35 for every pet you hold. Your pets gain levels three times as fast.',x:c=>1+.35*(c.npt||0)},
 feast:{n:'Feast',r:3,c:12,fu:['wfed','dbag'],d:'+0.15 Mult for every fruit your pets have eaten this jar. Once they have eaten 3, ×2.5 Mult for the rest of the jar.',add:c=>(c.ml||0)*.15,x:c=>(c.ml||0)>=3?2.5:1},
 hcomb:{n:'Honeycomb',r:3,c:12,fu:['pcount','xpol'],d:'+0.6 Mult for every pollinated fruit in the jar. The first 2 pollinated merges of each jar give the seed of the size they make +1 level.',add:c=>(c.pn||0)*.6},
 cluster:{n:'Cluster Bomb',r:3,c:12,fu:['shrap','cblast'],d:'Boom blasts reach 50% further and hit up to 5 fruit. Every fruit a Boom destroys explodes too, and scores +20 points.'},
 fdeck:{n:'Full Deck',r:3,c:12,fu:['joker','wcard'],d:'Every 7th fruit is a Wildcard. Wildcard merges score full points and get ×1.5 Mult.',x:c=>c.wd?1.5:1},
 carnival:{n:'Carnival',r:3,c:12,fu:['masq','fsalad'],d:'A merge with a Wildcard counts as every family. In a combo, the merge that brings it to 3 different families gets ×4 Mult.',x:c=>c.fs3?4:1},
 citblast:{n:'Citrus Blast',r:3,c:12,fu:['zbomb','csq'],d:'Boom fruit only hit Citrus, up to 3 anywhere in the blast. Every Citrus destroyed gives +0.4 Mult for the rest of the jar and every tool +1 charge. Citrus merges give every tool +1 charge.',add:c=>(c.zb||0)*.4},
 fondue:{n:'Fondue',r:3,c:12,fu:['bcheese','isculpt'],d:'Mouldy and frozen fruit can merge with any fruit of their size. Those merges, and the next merge of a fruit that has been frozen, get ×2 Mult.',x:c=>c.mo||c.fzm||c.wz?2:1},
 play:{n:'Playground',r:3,c:12,fu:['nurs','kindl'],d:'+0.3 Mult for every Cherry and Strawberry in the jar. Two Cherries merging get ×2 Mult. Merges that make a Strawberry or Grape give every tool +1 charge, once per drop.',add:c=>(c.ncs||0)*.3,x:c=>c.l===1?2:1},
 skyscr:{n:'Skyscraper',r:3,c:12,fu:['sky','bbrk'],d:'Starts at ×1 Mult, +0.35 for every different size from 6 up in the jar. The first merge of each jar that makes a size 7 fruit or bigger gets ×4 Mult.',x:c=>(1+.35*(c.sk6||0))*(c.bb1?4:1)},
 aval:{n:'Avalanche',r:3,c:12,fu:['dom','droll'],d:'The 4th merge of a combo gives 1 drop back. The 3rd merge of every combo gives +0.3 Mult for the rest of the jar.',add:c=>(c.drn||0)*.3},
 gfin:{n:'Grand Finale',r:3,c:12,fu:['fin','cresc'],d:'In a combo, the 2nd merge and every merge after it get ×2 Mult. When a combo of 2 or more ends, it scores +30 points for every merge in it.',x:c=>c.combo>=1?2:1},
 bigbang:{n:'Big Bang',r:3,c:12,fu:['bbomb','lslide'],d:'Boom fruit grow the fruit they hit one size instead of destroying them, at full points. Making or growing a size 8 fruit or bigger settles the pile and gives +2 Mult for the rest of the jar.',add:c=>(c.ls||0)*2},
 fknox:{n:'Fort Knox',r:3,c:12,fu:['gplate','gstd'],d:'Gold fruit never count as over the line. +0.15 Mult for every coin gold fruit have paid you this run (up to +7).',add:c=>Math.min(7,(c.gco||0)*.15)},
 gdig:{n:'Gold Digger',r:3,c:12,fu:['truffle','pdirt'],d:'Every fruit your Mole eats pays 2 coins and turns a fruit next to it gold. The first gold merge of each jar pays 3 more coins.'},
 hfest:{n:'Harvest Festival',r:3,c:12,fu:['hmoon','sbank'],d:'The first merge each jar that makes each size whose seed is level 3 or higher gets ×3 Mult. Seed prices stop rising once a seed reaches level 2.',x:c=>c.first&&(c.sdv||0)>=3?3:1},
 wshop:{n:'Workshop',r:3,c:12,fu:['recyc','tsmith'],d:'Every 3rd tool use in a jar is free. Tools you aim at a fruit need 2 less charge, never less than 2.'},
 amph:{n:'Amphitheatre',r:3,c:12,fu:['cstage','fshow'],d:'Merges in the middle third of the jar get ×2.5 Mult. Merges touching the floor score +25 points.',x:c=>c.mid?2.5:1,chip:c=>c.floor?25:0},
 ccave:{n:'Crystal Cave',r:3,c:12,fu:['geode','ppol'],d:'A rock touched by 2 merges cracks open into a gold fruit of its size. Every rock touching a merge adds +20 points to it.',chip:c=>(c.rkt||0)*20},
 hfund:{n:'Hedge Fund',r:3,c:12,fu:['cint','tjar'],d:'+0.08 Mult for every coin of interest you have earned this run (up to +7). Every 8th merge of a jar pays 1 coin.',add:c=>Math.min(7,(c.intc||0)*.08)},
 allin:{n:'All In',r:3,c:12,fu:['dnoth','lucky'],d:'Every merge has a 1 in 2 chance of ×2.5 Mult, with no downside.',x:c=>c.l<0||c.nr?1:Math.random()<Math.min(.75,.5*c.luck)?2.5:miss(c)},
 cpult:{n:'Catapult',r:3,c:12,fu:['lob','curve'],d:'Slingshot throws are 30% faster and curve towards the nearest fruit of their size.'},
 fortune:{n:'Fortune Teller',r:3,c:12,o:1,rv:'The Next box is hidden. Every 4th fruit is never the same as the one before it.',fu:['fore','second'],d:'Shows the 3 fruit that come after Next. Every 4th fruit is the same as the one before it.'}
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
 bare:{n:'Crate Jar',d:'The shop sells no charms. Every jar you clear drops a wooden crate.'},
 /* v1.55: jars that change how a jar plays. The engine reads the jar from cfg.jk (JK) */
 see:{n:'Seesaw Jar',d:'The jar leans towards its heavier side and every fruit slides that way. +3 drops in every jar. Merges made while it is level score ×1.5.'},
 clock:{n:'Clockwork Jar',d:'No drop count: each jar runs on a clock, 2.5 seconds for every drop it would have had (60 seconds for 24). The held fruit drops by itself after 2 seconds. Time left pays like unused drops.'},
 giant:{n:'Giant Jar',d:'Drops are Grapes, Lemons and Oranges, never Cherries or Strawberries. The jar is 25% wider. Every target is 50% higher.'},
 moon:{n:'Moon Jar',d:'Half gravity: fruit fall slowly and bounce higher. You start with Swap and Slingshot.'},
 hour:{n:'Hourglass Jar',d:'The walls pinch in halfway down. A Pineapple (8) or bigger can not fit through the neck. +1 Orchard slot.'}
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
 swarm:{n:'The Swarm',d:'Only the two smallest fruits drop, whatever your Orchard says.',d2:'Only the smallest fruit drops.',min:2,q:.6},
 rot:{n:'The Rot',d:'Fruit of size 6 or smaller that rest on the floor for 12 seconds go mouldy and stop merging.',d2:'Mould sets in twice as fast, after 6 seconds.',min:2},
 tax:{n:'The Taxman',d:'Takes a coin every 4 drops.',d2:'Takes a coin every 2 drops.',min:2},
 clock:{n:'The Clock',d:'Your fruit drops by itself after 3 seconds.',d2:'It drops after 2 seconds.',min:2},
 gamble:{n:'The Gambler',d:'Every fruit is a random size from 1 to 6, whatever your Orchard says.',d2:'Sizes go up to 7.',min:2},
 twins:{n:'The Twins',d:'Every merge that makes a size 3 fruit or bigger drops a Cherry (1) into the jar.',d2:'It drops 2 of them.',min:2},
 miser:{n:'The Miser',d:'Tools charge at half speed.',d2:'Tools stop charging.',min:2},
 ice:{n:'Cold Snap',d:'Every 4th fruit is Frozen: when it lands it freezes up to 4 fruit it touches for 3 seconds, then shatters. Each frozen fruit shrinks one size when it thaws, and a Cherry vanishes.',d2:'Every 3rd fruit is Frozen.',min:3},
 stone:{n:'The Quarry',d:'Every 5th drop is a rock that never merges.',d2:'Every 3rd drop is a rock.',min:3},
 prune:{n:'The Pruner',d:'Merges that make a size 4 fruit or smaller score nothing.',d2:'Oranges (5) score nothing either.',min:3},
 storm:{n:'The Storm',d:'A whirlpool hits every 6 drops.',d2:'A whirlpool hits every 4 drops.',min:3},
 thief:{n:'The Thief',d:'Your leftmost charm does nothing.',d2:'Your leftmost 2 charms do nothing.',min:3},
 tide:{n:'The Tide',d:'The line moves up and down, by up to 13% of the jar.',d2:'It swings up to 24% of the jar.',min:3},
 wilt:{n:'The Wilt',d:'Every 4 drops your biggest fruit shrinks one size.',d2:'It shrinks every 3 drops.',min:3},
 dark:{n:'The Blackout',d:'The lights go out. They come back on for a moment every 3 to 5 drops. You can still see the fruit you drop.',d2:'They come on every 4 to 6 drops, for less time.',min:3},
 collect:{n:'The Collector',d:'The jar only clears once you have also made a Pear (7).',d2:'If you have not made it yet, it must now be a Pineapple (8).',nb:'With Bite Size or Snack Pack it asks for one size smaller.',min:3}, /* nb = a note for the Almanac only. In a run the text comes from RG.bt */
 slick:{n:'The Slick',d:'Every fruit is Slippery: it slides with almost no grip.',d2:'The jar also shakes every 6 drops.',min:4},
 lid:{n:'The Lid',d:'The line sits lower, by 14% of the jar.',d2:'The line sits lower still, by 22% of the jar.',min:4},
 audit:{n:'The Auditor',d:'Mult above ×6 counts only half.',d2:'Mult above ×4 counts only a quarter.',min:4,q:.45},
 vise:{n:'The Vise',d:'The walls close in with every drop. Making a size 6 fruit or bigger opens them again.',d2:'They close twice as fast.',min:4},
 vamp:{n:'The Leech',d:'Your jar score drains away: 0.5% of the target every second.',d2:'It drains twice as fast.',min:5,q:.7},
 melon:{n:'The Melon Queen',d:'A Watermelon (11) drops into your jar and stays. It never counts as over the line.',d2:'A big rock drops into the lowest gap as well. It never counts as over the line either.',fin:1,q:1.1},
 queen:{n:'The Orchard Queen',d:'Two bosses at once.',d2:'Both step up.',fin:1},
 reaper:{n:'The Reaper',d:'Half the drops. Merges that make a size 4 fruit or bigger give 1 drop back.',d2:'Only a size 6 fruit or bigger gives a drop back.',fin:1,q:.9}
};
/* Upgrades. c = price, max = how many can be owned (none = no limit), now = used on the spot instead of owned.
   Owned ones cost 2 more each time. Effects are read through R.up[id] in RG and ro.up(id) in makeGame. */
const UPG={
 fert:{n:'Fertiliser',c:3,d:'Every merge scores +2 points for the rest of the run.'},
 sauce:{n:'Hot Sauce',c:4,d:'+0.25 Mult for the rest of the run.'},
 can:{n:'Watering Can',c:3,d:'+2 drops in every jar for the rest of the run.'},
 scrub:{n:'Scrub',c:3,now:1,d:'Right now: clears every Cherry (1) and Strawberry (2) out of the jar.'},
 bribe:{n:'Bribe',c:4,now:1,d:'Right now: swaps the next boss for a different one.'},
 belt:{n:'Tool Belt',c:6,max:2,d:'+1 tool slot (up to 4).'},
 pouch:{n:'Charm Pouch',c:10,max:1,d:'+1 charm slot.'},
 bed:{n:'Raised Bed',c:10,max:1,d:'+1 Orchard slot.'},
 hardy:{n:'Hardy',c:6,max:1,d:'Bosses can not switch off or sour your Orchard.'},
 pesti:{n:'Pesticide',c:5,max:1,d:'Your fruit never go mouldy.'},
 shelf:{n:'Bigger Shelf',c:5,max:1,d:'The shop offers 1 more charm.'},
 seedbag:{n:'Seed Bag',c:4,max:1,d:'The shop offers 1 more seed.'},
 cata:{n:'Catalogue',c:5,max:1,d:'The shop offers 1 more upgrade.'},
 dice:{n:'Loaded Dice',c:5,max:1,d:'The first reroll in every shop is free.'},
 taste:{n:'Good Taste',c:6,max:2,r:1,d:'Rarer charms turn up in the shop more often. Common, Uncommon and Rare odds go from 70/27.6/2.4 to 62.5/33.3/4.2 (55/39/6 with two).'},
 haggle:{n:'Haggler',c:4,max:1,d:'Charms and tools sell for their full price.'},
 vault:{n:'Vault',c:5,max:2,d:'Interest can pay 2 more coins per jar.'},
 lunch:{n:'Packed Lunch',c:5,max:3,d:'+1 coin every time you clear a jar.'},
 whet:{n:'Whetstone',c:6,max:2,d:'Every tool needs 1 less charge (never less than 2).'},
 fuse:{n:'Slow Fuse',c:4,max:2,d:'The pile can sit over the line 1 second longer before the run ends.'},
 drum:{n:'Tambourine',c:4,max:2,d:'Combos stay alive 0.5 seconds longer.'},
 crowbar:{n:'Crowbar',c:5,max:1,d:'Every crate offers 1 more choice.'},
 trellis:{n:'Trellis',c:4,d:'Merges that make a size 7 fruit or bigger score +30 points for the rest of the run.'},
 clean:{n:'Spring Clean',c:5,now:1,d:'Right now: clears the top half of the jar.'},
 sign:{n:'Signing Bonus',c:4,max:2,d:'Every contract you clear pays 2 more coins.'},
 road:{n:'Back Road',c:4,max:1,d:'Skipping a jar pays 3 coins.'},
 key:{n:'Crate Key',c:4,max:1,d:'The crate in the shop costs 2 coins less.'},
 thick:{n:'Thick Skin',c:4,max:2,d:'Bosses reach phase 2 later: at 60% of the target instead of 50% (70% with two).'},
 scales:{n:'Gold Scales',c:4,max:2,d:'A gold fruit pays 1 more coin when it merges.'},
 ledger:{n:'Ledger',c:5,max:1,d:'Interest pays 1 coin per 3 coins held instead of per 5.'},
 ot:{n:'Overtime',c:3,max:1,d:'Unused drops can pay up to 5 coins instead of 3.'},
 rim:{n:'Raised Rim',c:6,max:1,r:1,d:'The line sits higher, by 5% of the jar.'}
};
const UPW=[1,.4]; /* an upgrade's weight on the shop shelf by its rarity r (0 when not set): an Uncommon one is picked 0.4 times as often */
/* Seeds level up one fruit size for the run. R.sd[l] = level for the fruit of tier l (1 to 10, shown to the player as size l+1).
   Each level: making that fruit scores sdP(l) more points and +SDM Mult. A seed costs SDC plus SDS per level already held. */
const SDC=3,SDS=2,SDM=.25,sdP=l=>4+2*l,sdD=l=>`Making ${fna(l)} scores +${sdP(l)} points and +${SDM} Mult.`;
/* Tools: abilities the player taps during a jar. c = price, ch = charge needed (1 per merge), tg = the player then taps a fruit, s = short name for the tool bar.
   What each one does is in tool() in makeGame, which fruit it can target in okTg().
   fu = [tool, charm]: a fusion. It takes the tool's slot and uses up the charm. */
const TL={
 swap:{n:'Swap',c:3,ch:3,d:'Swap the fruit you are holding with the next one.'},
 shake:{n:'Shake',c:4,ch:8,d:'Throw the whole pile into the air.'},
 whirl:{n:'Whirl',c:5,ch:10,d:'Swirl the whole pile around the jar.'},
 rumble:{n:'Rumble',c:4,ch:8,d:'Jiggle the pile for 3 seconds so it settles.'},
 ripen:{n:'Ripen',c:6,ch:10,tg:1,d:'Tap a fruit. It grows one size.'},
 twin:{n:'Twin',c:5,ch:8,tg:1,d:'Tap a fruit of size 6 or smaller. The fruit you are holding becomes a copy of it.'},
 blend:{n:'Blender',c:6,ch:9,d:'Every fruit of the smallest size that has a pair merges at once, two by two.'},
 sample:{n:'Free Sample',s:'Sample',c:5,ch:8,d:'Your next 2 drops do not use up drops.'},
 cbomb:{n:'Cherry Bomb',s:'Bomb',c:5,ch:7,d:'The fruit you are holding becomes a Boom fruit.'},
 lodestar:{n:'Lodestar',c:4,ch:5,d:'The fruit you are holding becomes a Magnet that pulls its matches in.'},
 midas:{n:'Midas',c:6,ch:9,tg:1,d:'Tap a fruit. It turns gold. When it merges it scores ×2 and pays 2 coins.'},
 rewind:{n:'Rewind',c:4,ch:5,d:'Take back your last drop, if that fruit has not merged.'},
 ddown:{n:'Double Down',s:'Double',c:5,ch:6,d:'Costs 2 drops. Your next merge scores ×4.'},
 sieve:{n:'Sieve',c:4,ch:7,d:'Clears every Cherry (1) out of the jar.'},
 anchor:{n:'Anchor',c:4,ch:6,tg:1,d:'Tap a fruit. It cannot move until the jar ends, but it still merges.'},
 lead:{n:'Lead Weight',s:'Weight',c:5,ch:5,tg:1,d:'Tap a fruit, or the one you hold. It becomes 8 times heavier until it merges or the jar ends. It pushes lighter fruit aside and sinks.'},
 petrify:{n:'Petrify',c:5,ch:8,tg:1,d:'Tap a fruit. It turns to stone: it can not move or merge, and never counts as over the line. It crumbles away when the next jar starts.'},
 shatter:{n:'Shatter',c:4,ch:6,tg:1,d:'Tap a rock. It turns into a fruit of the same size.'},
 cash:{n:'Cash Out',c:5,ch:8,d:'Pays 2 coins.'},
 /* v1.36: tog = a toggle (tap on, tap off: switching on costs 1 charge and counts as a use, every drop while on costs 1, it goes off at 0). tm = a timed tool, lasting tm drops (t.n counts down) */
 sling:{n:'Slingshot',s:'Sling',c:6,ch:6,tog:1,d:'Switch on or off. While on, press, pull back and let go: your fruit flies the other way, faster the further you pull. A band shows the pull and dots show the path.'},
 moon:{n:'Moon Boots',s:'Moon',c:6,ch:8,tog:1,d:'Switch on or off. While on, fruit fall at half the gravity.'},
 reach:{n:'Long Arm',s:'Arm',c:5,ch:6,tm:3,d:'For your next 3 drops, your fruit drops from where you tap in the jar, not from the top.'}, /* a toggle until v1.40 */
 tilt:{n:'Tilt',c:6,ch:8,tm:3,d:'For your next 3 drops the jar tips towards the side your fruit is on, and the pile slides that way.'},
 tdrop:{n:'Twin Drop',s:'Twins',c:7,ch:10,tm:2,d:'Your next 2 drops each drop two of your fruit side by side. The second one is free.'},
 /* v1.40 */
 shears:{n:'Shears',c:4,ch:5,tg:1,d:'Tap a fruit of size 2 or bigger. It shrinks one size.'},
 harvest:{n:'Harvest',c:6,ch:12,d:'Every fruit over the line is removed and scores the points of its size.'},
 cyclone:{n:'Cyclone',c:12,ch:9,fu:['whirl','metro'],d:'Swirl the whole pile around the jar. Every merge scores ×2 for 6 seconds.'},
 sleight:{n:'Sleight of Hand',s:'Sleight',c:12,ch:2,fu:['swap','juggle'],d:'Swap the fruit you are holding with the next one. Your other tools each gain 2 charge (a tool can only do this once per drop).'},
 bloom:{n:'Bloom',c:12,ch:10,tg:1,fu:['ripen','sprout'],d:'Tap a fruit. It grows one size. The first use in each jar also gives the seed for its new size 1 level.'},
 mesh:{n:'Fine Mesh',c:12,ch:7,fu:['sieve','pip'],d:'Clears every Cherry (1) and Strawberry (2) out of the jar. Each one cleared scores 15 points.'},
 medusa:{n:'Medusa',c:12,ch:8,tg:1,fu:['petrify','wire'],d:'Tap a fruit. It and every fruit touching it turn to stone: they can not move or merge, and never count as over the line. They crumble away when the next jar starts.'},
 whistle:{n:'Whistle',c:5,ch:6,tg:1,req:CAT,d:'Tap a fruit (size 3 or less). Your caterpillar comes out now and eats it.'},
 ghand:{n:'Golden Hand',s:'Gold Hand',c:12,ch:8,tg:1,fu:['midas','wallet'],d:'Tap a fruit. It turns gold. When it merges it scores ×3 and pays 4 coins.'}
};
/* Crates: pick one thing out of a few, for free. r = charm rarity odds, sd = seed levels in one pick, coin = the coin pick, out = coins for leaving it.
   Bosses drop gold (melon every 4th depth), skipping a jar gives wood, the shop sells wood crates of one kind (CRP = price). */
const CRT={wood:{n:'Wooden crate',r:[.7,.26,.04],sd:1,coin:5,out:2},gold:{n:'Gold crate',r:[.45,.45,.1],sd:2,coin:9,out:3},melon:{n:'Melon crate',r:[0,.65,.3],lg:.05,sd:3,coin:14,out:4}};
const NSL=['stow','phoenix'],CRL=.04,CRO=.2,SHN=5; /* SHN: charms on the shop shelf (v1.43, was 3). The rare chance per slot went from 4% to 2.4% (+1.8% per Good Taste) so rares per run stay the same */ /* a bought Charm Crate: the chance that a charm inside is a Legendary. lg on a tier is the same chance for that tier's crates. At most one Legendary in a crate */
/* Editions (v1.43, the user's idea after Balatro's foil and holographic): any charm, Orchard item or tool can come Candied or Juiced, rolled on shop and crate offers.
   The bonus counts on every merge while the item is held and working. p = points, m = Mult, $ = added to the price (and so to the sell value), w = chance per offer */
const ED={c:{n:'Candied',p:10,$:2,w:.02,d:'+10 points on every merge'},j:{n:'Juiced',m:1.5,$:3,w:.008,d:'+1.5 Mult'},a:{n:'Ambrosia',x:1.5,$:5,w:.003,d:'×1.5 Mult'}},edR=()=>{const r=Math.random();return r<ED.a.w?'a':r<ED.a.w+ED.j.w?'j':r<ED.a.w+ED.j.w+ED.c.w?'c':'';},ed$=e=>e&&ED[e]?ED[e].$:0,EDO='cja',edB=(a,b)=>EDO.indexOf(a||'x')>EDO.indexOf(b||'x')?a:b||a||''; /* edB: a fusion keeps the better edition of its halves (EDO = worst to best) */
/* Pet levels (v1.43, Vampire Survivors): a pet item gains 1 XP per jar cleared while held and 1 per 5 actions (meals, pollinations, ladybird hops).
   PK = the items that carry each pet (fusions keep the level), PLX = XP needed for Lv1 to Lv5. XP lives in the charm as x (a = actions towards the next XP), selling loses it */
const PK={cat:['pet','frenzy'],bee:['bee','bfly','nectar'],mole:['mole','zoo'],hog:['hog'],lady:['lady']},PLX=[0,2,5,9,14],PLK=Object.fromEntries(Object.entries(PK).flatMap(([k,a])=>a.map(id=>[id,k])));
const SDF=['svault','green','bloom'],CRP={ch:6,tl:5,sd:4},CRN={ch:'Charm Crate',tl:'Tool Crate',sd:'Seed Crate'},CRW={ch:'charms',tl:'tools',sd:'seeds'};
/* Contracts: an optional handicap on a normal jar (never a boss or mini boss jar), offered from depth 2. Sign it and the jar is harder, clear the jar and it pays.
   One is drawn for every such jar: R.ct = {id, on (signed), sd (the seed tier it pays, for a seed contract)}.
   r = a boss rule switched on at phase 1, dr = drops taken away, q = target multiplier, fz = seconds less the pile may sit over the line.
   pay = [kind, n]: coin, sd (levels of one seed) or cr (a wooden crate, a gold one where the jar drops a wooden crate anyway). */
const CT={
 short:{n:'Short Day',d:'6 fewer drops.',dr:6,pay:['coin',4]},
 high:{n:'High Bar',d:'The target is 50% higher.',q:1.5,pay:['coin',5]},
 lock:{n:'Hands Off',d:'Tools are locked.',r:'lock',pay:['coin',3]},
 fog:{n:'Blindfold',d:'The Next box is hidden.',r:'fog',pay:['coin',3]},
 mirror:{n:'Looking Glass',d:'Your aim is flipped left to right.',r:'mirror',pay:['coin',3]},
 clock:{n:'Rush Job',d:'Your fruit drops by itself after 3 seconds.',r:'clock',pay:['coin',4]},
 thin:{n:'Thin Ice',d:'The pile can sit over the line for 1 second less.',fz:1,pay:['coin',3]},
 lid:{n:'Low Ceiling',d:'The line sits lower, by 14% of the jar.',r:'lid',pay:['sd',1]},
 sticky:{n:'Sticky Fingers',d:'Every 3rd fruit is Sticky and stays where it lands.',r:'sticky',pay:['sd',1]},
 prune:{n:'Big Game',d:'Merges that make a size 4 fruit or smaller score nothing.',r:'prune',pay:['cr',1]},
 stone:{n:'Rubble',d:'Every 5th drop is a rock that never merges.',r:'stone',pay:['cr',1]},
 /* drop curses as contracts (v1.37), cu = the curse */
 cblight:{n:'Blight',cu:'blight',pay:['coin',3]},
 covg:{n:'Overgrowth',cu:'overg',pay:['coin',3]},
 cworms:{n:'Worms',cu:'worms',pay:['coin',4]},
 cfrost:{n:'Frost',cu:'frost',pay:['coin',3]},
 cbramble:{n:'Bramble',cu:'bramble',pay:['sd',1]}
};
/* boss curses (v1.37): every boss jar (not mini bosses) draws one drop curse (k:'en', from the start) and one Orchard curse (k:'de', at phase 2) per depth, kept in R.sc[depth] = [en, de, the size Blight hits]. Drop curses also come as contracts (CT cu). Hardy stops the Orchard curses, Pesticide stops mould */
const CUR={
 blight:{n:'Blight',k:'en',d:f=>'Every 3rd '+fnm(+f||0)+' you get arrives as a rock.'},
 overg:{n:'Overgrowth',k:'en',d:()=>'Every 5th drop is a Cherry (1), whatever your Orchard says.'},
 worms:{n:'Worms',k:'en',d:()=>'Every 12th drop arrives mouldy and never merges.'},
 frost:{n:'Frost',k:'en',d:()=>'Every 4th drop freezes where it lands for 3 seconds: it can not move or merge.'},
 bramble:{n:'Bramble',k:'en',d:()=>'The Next box and Forecast are hidden.'},
 uproot:{n:'Uproot',k:'de',d:()=>'Your Orchard items are switched off.'},
 pest:{n:'Pest',k:'de',d:()=>'Your leftmost Orchard item is switched off.'},
 sour:{n:'Sour Graft',k:'de',d:()=>'Your Orchard items work backwards.'}
};
/* Skip rewards: a skipped jar offers the wooden crate or one of the others. u = how many uses it holds. R.sk = the ids on offer while the pick is open, R.tg = the ones held (id -> uses left) */
const SKR={
 crate:{n:'Wooden crate',d:'Pick 1 thing from a wooden crate.'},
 roll:{n:'Free Rolls',d:'Your next 3 paid shop rerolls are free.',u:3},
 pay:{n:'Double Pay',d:'The next jar you clear pays double.',u:1},
 boss:{n:'Bigger Haul',d:'The next boss crate offers 2 more choices.',u:1},
 drops:{n:'Extra Drops',d:'+6 drops in the next jar you play.',u:1},
 detour:{n:'Detour',d:'This depth\'s boss is drawn again, with new curses.',u:0}
};
const ICN={sk_detour:'bribe',worms:'mould',frost:'ice',sk_roll:'dice',sk_pay:'wallet',sk_boss:'crate_gold',sk_drops:'bag',lode:'magnet',boom:'bomb',pet:'cat',glut:'cat',rot:'mould',stone:'rock',storm:'whirl',slick:'drop',melon:'king',gamble:'dice',twins:'twin'}; /* things that share another icon (icons.js) */
const icn=id=>ICN[id]||id,T0=t=>CRT[t].lg||0;
/* boss rules that may not share a jar (The Orchard Queen's pair, the second rule on Ripeness 8): The Swarm drops only tiny fruit, so it can not sit with a rule that needs or only pays for bigger fruit */
const CLASH=[['swarm','gamble'],['swarm','prune'],['swarm','collect']],clash=(a,b)=>a!==b&&CLASH.some(p=>p.includes(a)&&p.includes(b));
const nice=q=>{const m=Math.pow(10,Math.max(1,Math.floor(Math.log10(q))-1));return Math.round(q*(1+1e-9)/m)*m;};
const RG={
 new(jar='classic',stake=1){const pool=Object.keys(BOSS).filter(k=>!BOSS[k].fin),bs=[];for(let d=1;d<DEPTHS;d++){const c=pool.filter(k=>BOSS[k].min<=d&&!bs.includes(k));bs.push(c[rint(c.length)]);}bs.push(RG.fin());
  const tl=[RG.tool('swap')];if(jar!=='wide')tl.push(RG.tool(jar==='moon'?'sling':'shake'));if(jar==='kit'){const k=Object.keys(TL).filter(k=>!TL[k].fu&&!PF.lk('tl.'+k)&&k!=='swap'&&k!=='shake');tl.push(RG.tool(k[rint(k.length)]));}
  return{v:RV,jarId:jar,stake,depth:1,jar:0,coins:jar==='piggy'?12:4,total:0,ch:[],or:[],tl,up:Object.fromEntries(Object.keys(UPG).map(k=>[k,0])),sd:Array(11).fill(0),bs,ms:{},bq:{},bx:{},off:0,shop:null,crate:null,ct:null,sk:null,tg:{},fw:{},pile:[],at:'hub',won:0,st:{},jst:{}};},
 /* the highest stake the player may pick: one above the best they have won on, with any jar */
 stakeMax:(jar='classic')=>Math.min(STAKES.length,1+((PF.d||PF.load()).stakes[jar]||0)), /* per jar: one above the best Ripeness won with that jar */
 fin(){const f=Object.keys(BOSS).filter(k=>BOSS[k].fin);return f[rint(f.length)];},
 /* a saved run that this version can load, or null */
 saved(){const sv=store.get('run',null);if(sv&&sv.v===9){sv.ct=null;sv.sk=null;sv.tg={};sv.v=10;} /* v9 to v10: contracts and skip rewards, nothing else moved */
  if(sv&&sv.v===10){sv.or=[];sv.ch=sv.ch.filter(c=>{if(!CH[c.id]||!CH[c.id].o)return true;if(sv.or.length<OS0)sv.or.push(c);else sv.coins+=Math.max(1,Math.floor(CH[c.id].c/2));return false;});sv.v=11;} /* v10 to v11: the Orchard row. Lodestone, Rich Soil and Prospector move from the charm slots to it, any past its 2 slots are sold */
  if(sv&&sv.v===11){const i=sv.ch.findIndex(c=>c.id==='sling');if(i>=0){sv.ch.splice(i,1);if(sv.tl.length<RG.ts(sv))sv.tl.push({id:'sling',c:TL.sling.ch});else sv.coins+=3;}sv.v=12;} /* v11 to v12: Slingshot became a tool. With no free tool slot it is sold */
  if(sv&&!sv.fw)sv.fw={}; /* v1.35: the fusion weight counters, filled in place */
  if(sv&&sv.up)for(const k in UPG)if(sv.up[k]==null)sv.up[k]=0; /* upgrades added since the run was saved start at 0, no version bump needed for those */
  if(sv&&sv.v!==RV){store.set('run',null);return null;}return sv;},
 /* the run's copy of a charm, if it holds one that is working (The Thief switches off the first R.off charms) */
 has:(R,id)=>{const i=R.ch.findIndex(c=>c.id===id);if(i>=(R.off||0))return R.ch[i];if(!R.or)return;const j=R.or.findIndex(c=>c.id===id);if(j<0||R.oc&&(R.oc!=='pest'||j===0))return;return R.or[j];},
 /* R.oc = the Orchard curse running in this jar (uproot, pest, sour), set by the engine at phase 2, 0 otherwise. rev = an Orchard item working backwards */
 rev:(R,id)=>R.oc==='sour'&&!!R.or&&R.or.some(c=>c.id===id), /* the Orchard row (R.or) counts too, The Thief never touches it */
 os:R=>OS0+R.up.bed+(R.ch.some(c=>c.id==='stow')?1:0)+(R.jarId==='hour'?1:0), /* Orchard slots: Stowaway brings one */
 /* tools: {id, c} where c is the charge held. New tools arrive charged */
 tool:(id,R)=>({id,c:R?RG.need(R,id):TL[id].ch}),
 tsMax:R=>TSLOTS-(R.jarId==='wide'?1:0),
 ts:R=>Math.max(1,Math.min(RG.tsMax(R),TS0+R.up.belt+(R.jarId==='kit'?1:0)-(R.jarId==='wide'?1:0))),
 slots:R=>Math.max(2,SLOTS+R.up.pouch+(R.jarId==='wide'?1:0)-(R.jarId==='kit'?1:0)-(R.stake>=7?1:0))+R.ch.filter(c=>NSL.includes(c.id)).length, /* Stowaway and Phoenix take no slot: they brings its own */
 need:(R,id)=>Math.max(Math.min(2,TL[id].ch),TL[id].ch-R.up.whet-(TL[id].tg&&(RG.has(R,'tsmith')||RG.has(R,'wshop'))?2:0)),
 /* req: an item that needs one of these charms (an id or a list) before it is offered */
 rq:(R,q)=>!q||[].concat(q).some(id=>RG.has(R,id)||R.tl.some(t=>t.id===id)), /* a charm or a tool (Slingshot) */
 /* Chrysalis / Butterfly Garden: the caterpillar ate. Returns the charm id when it turns into a butterfly */
 chrys(R){const c=RG.has(R,'bfly')||RG.has(R,'chrys');if(!c)return false;c.n=(c.n||0)+1;if(c.n%(c.id==='bfly'?3:4))return false;c.v=+((c.v||0)+.5).toFixed(1);return c.id;},
 /* active legendaries: the charge a charm holds (none saved = full) */
 ac:c=>c.c==null?CH[c.id].act:c.c,
 luck:R=>RG.has(R,'shoe')||RG.has(R,'fourleaf')?2:1,
 charge(R,n,skip){const k=n*(RG.has(R,'battery')?2:1);for(const t of R.tl)if(t!==skip)t.c=Math.min(RG.need(R,t.id),t.c+k);},
 fill(R){for(const t of R.tl)t.c=RG.need(R,t.id);},
 /* swap this depth's boss for another that is allowed here */
 bribe(R){const d=R.depth,cur=RG.boss(R),k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!==cur&&BOSS[k].min<=d&&k!==R.bs[d-2]&&k!==R.ms[d]);R.bs[d-1]=k[rint(k.length)];return R.bs[d-1];},
 boss(R,d=R.depth){while(R.bs.length<d){const k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!==R.bs[R.bs.length-1]);R.bs.push(R.bs.length%DEPTHS===DEPTHS-1?RG.fin():k[rint(k.length)]);}return R.bs[d-1];},
 /* the mini boss on jar 2 of some depths (every depth 4 of 8), or null. It has no phase 2 and drops a wooden crate */
 mid(R,d=R.depth){if(d%8!==4&&!(R.stake>=6&&d>=5))return null;if(!R.ms[d]){const b=RG.boss(R,d),k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!==b&&BOSS[k].min<=d&&k!=='hour');R.ms[d]=k[rint(k.length)];}return R.ms[d];},
 /* the rule flags a boss switches on. The Orchard Queen runs two other bosses, picked once per depth */
 rules(R,b,d=R.depth){let r=[b];if(b==='queen'){if(R.bq[d]&&clash(R.bq[d][0],R.bq[d][1]))delete R.bq[d]; /* a pair drawn before v1.38 that is no longer allowed is drawn again */
  if(!R.bq[d]){const k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!=='hour'),a=k.splice(rint(k.length),1)[0],c=k.filter(x=>!clash(a,x));R.bq[d]=[a,c[rint(c.length)]];}r=R.bq[d];}
  if(R.stake>=8&&BOSS[b].fin){if(R.bx[d]&&r.some(x=>clash(x,R.bx[d])))delete R.bx[d];if(!R.bx[d]){const k=Object.keys(BOSS).filter(k=>!BOSS[k].fin&&k!=='hour'&&!r.includes(k)&&!r.some(x=>clash(x,k)));R.bx[d]=k[rint(k.length)];}r=r.concat(R.bx[d]);}return r;},
 /* a boss jar's target multiplier: the boss's own q, times the biggest discount among the other rules in the jar (the Queen's pair, the Ripeness 8 extra). Without it the Queen ran The Auditor's Mult cap against a full target */
 bq:(b,rules)=>b?(BOSS[b].q||1)*Math.min(1,...rules.filter(k=>k!==b&&BOSS[k]).map(k=>BOSS[k].q||1)):1,
 /* the curses on this depth's boss jar: [drop curse, Orchard curse, Blight family] */
 curse(R,d=R.depth){if(!R.sc)R.sc={};if(!R.sc[d]){const e=Object.keys(CUR).filter(k=>CUR[k].k==='en'),o=Object.keys(CUR).filter(k=>CUR[k].k==='de');R.sc[d]=[e[rint(e.length)],o[rint(o.length)],rint(3)];}if(typeof R.sc[d][2]!=='number')R.sc[d][2]=rint(3);return R.sc[d];}, /* [2] = the size Blight hits, Cherry to Lemon */
 curD:(id,f)=>CUR[id].d(f),
 bossD(R,b,d=R.depth,two){if(b===RG.boss(R,d)&&!RG.has(R,'flag')){const[e,o,f]=RG.curse(R,d);return RG.bossD0(R,b,d,two)+(two?(CUR[o]?` ${CUR[o].n}: ${CUR[o].d()}${R.up.hardy?' (Hardy: no effect.)':''}`:''):(CUR[e]?` ${CUR[e].n}: ${CUR[e].d(f)}`:''));}return RG.bossD0(R,b,d,two);},
 bossD0(R,b,d=R.depth,two){const k=two?'d2':'d',r=RG.rules(R,b,d),x=R.stake>=8&&BOSS[b].fin?r[r.length-1]:null,xt=x?` Also ${BOSS[x].n}: ${RG.bt(R,x,k)}`:'';if(b!=='queen')return RG.bt(R,b,k)+xt;
  const q=r.slice(0,2);return (two?BOSS.queen.d2+' '+q.map(i=>RG.bt(R,i,'d2')).join(' '):`${BOSS[q[0]].n} and ${BOSS[q[1]].n} at once. `+q.map(i=>RG.bt(R,i,'d')).join(' '))+xt;},
 /* one rule's text in this run: The Collector asks for one size smaller while the run holds Bite Size or Snack Pack (RG.cs = how many sizes smaller) */
 cs:R=>RG.has(R,'bite')||RG.has(R,'snack')?1:0,
 bt:(R,b,k)=>b==='collect'&&RG.cs(R)?(k==='d'?`The jar only clears once you have also made ${fna(6-RG.cs(R))}.`:`If you have not made it yet, it must now be ${fna(7-RG.cs(R))}.`):BOSS[b][k],
 jarCfg(R,j=R.jar){const d=R.depth,b=j===2?RG.boss(R):j===1?RG.mid(R,d):null,bd=b&&BOSS[b],rules=b?RG.rules(R,b,d):[],sc=d<=DEPTHS?RSC[d-1]:RSC[DEPTHS-1]*Math.pow(RSCX,d-DEPTHS),J=R.jarId,now=j===R.jar,ct=now&&!b&&R.ct&&R.ct.on?CT[R.ct.id]:null; /* ct = the contract signed for this jar */
  const fl=RG.has(R,'flag'),quota=nice(RQ[j]*sc*RG.bq(b,rules)*(b&&fl?CH.flag.q:1)*(R.stake>=3?1.25:1)*(J==='tall'?1.15:J==='giant'?1.5:1)*(ct&&ct.q||1));let drops=RDROPS+R.up.can*2+(RG.has(R,'bag')?5:0)-(rules.includes('hour')?6:0)+(J==='tall'?4:J==='see'?3:0)-(R.stake>=4?3:0)-(ct&&ct.dr||0)+(now&&R.tg.drops?6:0);if(b==='reaper')drops=Math.ceil(drops/2);drops=Math.max(8,drops);if(ct&&ct.r)rules.push(ct.r);
  const cr0=j===2?(d%4===0?'melon':'gold'):b||J==='bare'?'wood':'',cs=j===2&&!fl?RG.curse(R,d):null; /* White Flag: no curses */
  const p2=j===2&&!RG.has(R,'flag'); /* White Flag: no phase 2 */
  return{quota,drops,boss:b,rules,en:cs?cs[0]:ct&&ct.cu||'',de:cs?cs[1]:'',fam:cs?cs[2]:ct&&R.ct.f!=null?R.ct.f:'',ct:ct?R.ct.id:'',fz:ct&&ct.fz||0,p2,p2s:p2&&R.stake>=8,crate:ct&&ct.pay[0]==='cr'?(cr0?'gold':'wood'):cr0,pay:Math.max(1,RPAY[j]+(b&&j<2?2:0)-(R.stake>=2?1:0)-(J==='piggy'?1:0)),tag:`D${d} · ${bd?bd.n:'Jar '+(j+1)+'/3'}`,name:bd?bd.n:`Depth ${d} · Jar ${j+1}`,ic:b?icn(b):null,
   rule:(b?RG.bossD(R,b,d)+' ':'')+(ct?`Contract: ${ct.cu?RG.curD(ct.cu,R.ct.f):ct.d} `:'')+`Score ${quota} in ${drops} drops.`,rule2:b?RG.bossD(R,b,d,1):''};},
 /* points for a scoring event, plus which charms took part (hit) so the screen can flash them */
 score(R,base,c){let chips=base,a=1+R.up.sauce*.25,x=1;const hit=[],ft=c.l>0&&RG.has(R,'ftree')&&R.sd[RG.sib(c.l)]||0,sd=c.l>0?R.sd[c.l]+ft/2:0;if(ft)hit.push('ftree');c.coins=R.coins;c.sdn=R.sd.filter(v=>v>0).length;c.spt=R.sp||0;c.tf=R.tl.length>0&&R.tl.every(t=>t.c>=RG.need(R,t.id));c.nc=R.ch.length;c.npt=R.ch.filter(o=>PLK[o.id]).length;c.nor=R.or.filter(o=>RG.has(R,o.id)).length;c.gco=R.st&&R.st.goldc||0;c.intc=R.st&&R.st.intc||0;if(c.l>=0)c.sdv=R.sd[c.l]||0;c.luck=RG.luck(R);c.sdl=R.sd.reduce((a,b)=>a+b,0);c.full=R.ch.length>=RG.slots(R);c.nfu=R.ch.filter(x=>CH[x.id].fu).length+R.or.filter(x=>CH[x.id].fu).length+R.tl.filter(x=>TL[x.id].fu).length;if(c.l>=0)chips+=R.up.fert*2;if(c.l>=6)chips+=R.up.trellis*30;const sp=sd&&c.first?(RG.has(R,'svault')?3:RG.has(R,'sprout')?2:1):1;if(sd){chips+=sd*sp*sdP(c.l);a+=sd*sp*SDM;}if(sp>1)hit.push(sp>2?'svault':'sprout');
  for(let i=R.off||0;i<R.ch.length;i++){const ch=R.ch[i],d=CH[ch.id];let on=0,v;c.ch=ch;if(d.chip&&c.l>=0&&(v=d.chip(c))>0){chips+=v;on=1;}if(d.add&&(v=d.add(c))>0){a+=v;on=1;}if(d.x&&(v=d.x(c))>1){x*=v;on=1;}if(on)hit.push(ch.id);}
  if(RG.has(R,'stow'))for(let i=R.ch.length-1;i>=(R.off||0);i--){const ch=R.ch[i],d=CH[ch.id];if(ch.id==='stow')continue;let on=0,v;c.ch=ch;if(d.chip&&c.l>=0&&(v=d.chip(c))>0){chips+=v;on=1;}if(d.add&&(v=d.add(c))>0){a+=v;on=1;}if(d.x&&(v=d.x(c))>1){x*=v;on=1;}if(on)hit.push('stow');break;} /* Stowaway: the rightmost other working charm scores twice */
  for(let i=R.off||0;i<R.ch.length;i++){const o=R.ch[i];if(PLK[o.id]&&RG.plv(o)>=5){x*=1.25;hit.push(o.id);}} /* a Lv5 pet: ×1.25 Mult */
  const eds=[...R.ch.slice(R.off||0),...R.or.filter(o=>RG.has(R,o.id)),...R.tl];for(const o of eds)if(o.e&&ED[o.e]){const E=ED[o.e];if(E.p&&c.l>=0)chips+=E.p;if(E.m)a+=E.m;if(E.x)x*=E.x;} /* editions: Candied points, Juiced +Mult, Ambrosia ×Mult */
  if(R.jarId==='see'&&c.lvl)x*=1.5; /* Seesaw Jar: a merge made while the jar is level */
  return{p:Math.ceil(chips*a*x-1e-9),m:a*x,hit,chips};},
 /* Family Tree: the other tier of the same family (FAM), or -1 (Pineapple has none). The Peach's is the Cherry, which never has a seed */
 sib:l=>FAM.findIndex((f,i)=>i!==l&&f===FAM[l]),
 /* a fruit of tier l was made: returns the charms that paid out */
 made(R,l){const ev=[],f=RG.has(R,'fever'),m=RG.has(R,'mania'),lk=RG.luck(R);if(l>=5&&RG.has(R,'gold')){R.coins++;ev.push('gold');}if(RG.has(R,'scratch')&&Math.random()<lk/6){R.coins++;ev.push('scratch');}
  if(RG.has(R,'mint')){if(l>=5){R.coins+=2;ev.push('mint','mint');}if(Math.random()<lk/4){R.coins++;ev.push('mint');}}if(l>=7&&f){f.v=(f.v||0)+1.5;ev.push('fever');}if(l>=7&&m){m.v=(m.v||0)+2;ev.push('mania');}const ok=l>=6&&RG.has(R,'oak');if(ok){ok.v=+((ok.v||0)+.06).toFixed(2);ev.push('oak');}const pp=l<=2&&(RG.has(R,'keep')||RG.has(R,'pip'));if(pp){pp.v=+((pp.v||0)+(pp.id==='keep'?.04:.03)).toFixed(2);ev.push(pp.id);}const tk=l===8&&RG.has(R,'tiki');if(tk){tk.v=+((tk.v||0)+.25).toFixed(2);ev.push('tiki');}return ev;},
 /* n fruit were destroyed: returns the charm that grew from it, if any */
 /* Snowball: a jar was cleared with `left` drops unused. Returns true when it grew */
 snow(R,left){const s=RG.has(R,'snow');if(!s||left<5)return false;s.v=+((s.v||0)+.04).toFixed(2);return true;},
 /* Gardener (1 level) or Greenhouse (2): a boss was beaten. Returns the seed tiers that gained a level */
 garden(R){const n=RG.has(R,'green')?2:RG.has(R,'gard')?1:0,a=RG.sizes(R),o=[];for(let i=0;i<n;i++){const l=a[rint(a.length)];R.sd[l]++;o.push(l);}return o;},
 kill(R,n){const c=RG.has(R,'compost')||RG.has(R,'volcano');if(!c||!(n>0))return false;c.v=+((c.v||0)+(c.id==='volcano'?.1:.05)*n).toFixed(2);return c.id;},
 net(R){const i=R.ch.findIndex(c=>c.id==='net');if(i<(R.off||0))return false;R.ch.splice(i,1);return true;},
 /* every coin spent in the shop goes through pay: R.sp = coins spent in this shop (Big Spender, Big Night Out), reset when the next shop is stocked in advance. Selling does not lower it */
 pay(R,p){R.coins-=p;R.sp=(R.sp||0)+p;},
 cost:(R,c)=>Math.max(1,c-(RG.has(R,'coupon')?1:0)+(R.stake>=5?1:0)),
 upCost:(R,id)=>RG.cost(R,UPG[id].c+(UPG[id].now?0:R.up[id]*2)),
 upOk:(R,k)=>PF.lk('up.'+k)?false:k==='scrub'||k==='clean'?R.jar!==0:k==='thick'&&(R.stake>=8||RG.has(R,'flag'))?false:k==='bribe'?!BOSS[RG.boss(R)].fin:k==='belt'?RG.ts(R)<RG.tsMax(R):!UPG[k].max||R.up[k]<UPG[k].max,
 sdCost:(R,l)=>RG.cost(R,SDC+Math.min(R.sd[l],RG.has(R,'hfest')?2:RG.has(R,'sbank')?3:99)*SDS-(RG.has(R,'svault')?2:RG.has(R,'packet')?1:0)-(RG.has(R,'cbin')?Math.min(3,R.jst&&R.jst.kills||0):0)), /* Seed Bank and Harvest Festival stop the rise, Compost Bin reads the last jar's kills */
 intN:R=>R.up.ledger?3:5, /* coins held per coin of interest */
 crCost:R=>Math.max(1,RG.cost(R,CRP[R.shop.cr])-R.up.key*2), /* the price of the crate on the shop's shelf */
 p2at:R=>.5+R.up.thick*.1, /* the share of the target where a boss reaches phase 2 */
 sellV:(R,c,r)=>R.up.haggle||r===4?c:Math.floor(c/2), /* r = rarity: a Legendary sells for its full price */
 rrBase:R=>R.up.dice?(R.shop.rr?RG.cost(R,1+R.shop.rr):0):RG.cost(R,2+R.shop.rr),
 rrCost:R=>R.tg.roll?0:RG.rrBase(R), /* Free Rolls (a skip reward) covers the rerolls that would cost coins */
 /* draw the contract for the jar that is up next: none on depth 1, none on a boss or mini boss jar */
 offer(R){R.ct=null;if(R.depth<2||R.jar>1||(R.jar===1&&RG.mid(R)))return;const k=Object.keys(CT).filter(k=>!CT[k].r||BOSS[CT[k].r].min<=R.depth),id=k[rint(k.length)],c={id,on:0};if(CT[id].cu==='blight')c.f=rint(3);if(CT[id].pay[0]==='sd'){const a=RG.sizes(R);c.sd=a[rint(a.length)];}R.ct=c;},
 payout(R,cfg,left){const rows=[['Jar cleared',cfg.pay]],ct=cfg.ct&&CT[cfg.ct],u=Math.min(3+R.up.ot*2,Math.floor(left/4)),i=Math.min((RG.has(R,'goose')?10:RG.has(R,'bank')?8:4)+R.up.vault*2+(R.jarId==='piggy'?2:0),Math.floor(R.coins/RG.intN(R)));R.lint=i; /* Compound Interest counts it in advance */
  if(R.tg.pay)rows.push(['Double Pay (skip reward)',cfg.pay]);if(ct&&ct.pay[0]==='coin')rows.push(['Contract: '+ct.n,ct.pay[1]]);if(ct&&R.up.sign)rows.push(['Signing Bonus',R.up.sign*2]);if(u)rows.push([`Unused drops (${left})`,u]);if(i)rows.push([`Interest (1 per ${RG.intN(R)} coins held)`,i]);if(RG.has(R,'piggy'))rows.push(['Piggy Bank',3]);if(RG.has(R,'goose'))rows.push(['Golden Goose',4]);if(R.up.lunch)rows.push(['Packed Lunch',R.up.lunch]);return rows;},
 /* bank the payout and move on to the next jar. Returns true when the last depth has just been beaten */
 advance(R,sum){R.coins+=sum;if(R.lint){R.st.intc=(R.st.intc||0)+R.lint;R.lint=0;}const wf=R.cfg&&R.cfg.boss&&RG.has(R,'flag');if(wf)wf.v=+((wf.v||0)+CH.flag.g).toFixed(2);const v=RG.has(R,'keep')||RG.has(R,'vintage'),hl=RG.has(R,'heir');if(v)v.v=+((v.v||0)+(v.id==='keep'?.12:.08)).toFixed(2);if(hl)hl.v=+((hl.v||0)+CH.heir.g).toFixed(2);let win=false;delete R.tg.pay;delete R.tg.drops;if(++R.jar>2){R.jar=0;if(R.depth===DEPTHS&&!R.won){R.won=1;win=true;}R.depth++;}RG.offer(R);R.sp=0;R.shop=RG.stock(R);R.at='shop';return win;},
 stock(R){const own=R.ch.map(c=>c.id),fz=RG.fz(R),ch=[],tt=R.up.taste,m=RG.miss(R),w=RG.fwW(R,m);for(let i=0;i<(R.jarId==='bare'?0:SHN+R.up.shelf);i++){const left=Object.keys(CH).filter(k=>!CH[k].fu&&!CH[k].o&&CH[k].r<3&&!CH[k].dev&&!PF.lk('ch.'+k)&&!own.includes(k)&&!fz.has(k)&&!ch.includes(k)&&RG.rq(R,CH[k].req));if(!left.length)break;const r=Math.random(),rar=r<.7-.075*tt?0:r<.976-.018*tt?1:2,c=left.filter(k=>CH[k].r===rar),from=c.length?c:left;ch.push(RG.pickW(from,1,w)[0]);}
  const take=RG.pick,sizes=RG.sizes(R);
  const S={ch,or:RG.orPick(R,1,[],w),cr:Object.keys(CRP)[rint(3)],tl:RG.pickW(Object.keys(TL).filter(k=>!TL[k].fu&&!fz.has(k)&&!PF.lk('tl.'+k)&&!R.tl.some(o=>o.id===k)&&RG.rq(R,TL[k].req)),2,w),up:RG.pickW(Object.keys(UPG).filter(k=>RG.upOk(R,k)),2+R.up.cata,k=>UPW[UPG[k].r||0]),sd:take(sizes,2+R.up.seedbag),rr:0,ed:{}};for(const k of ['ch','or','tl'])(S[k]||[]).forEach((id,i)=>{const e=id&&edR();if(e)S.ed[k+i]=e;});if(!R.fw)R.fw={};for(const k in R.fw)if(!m.has(k))delete R.fw[k];for(const k of m)R.fw[k]=S.ch.includes(k)||S.or.includes(k)||S.tl.includes(k)?0:(R.fw[k]||0)+1;return S;},
 /* steering to fusions (v1.35): while the run holds one half of a fusion, the missing half weighs 2 in the shop and in crates, +1 for every shop that has not shown it (R.fw), back to 2 once it shows. Rarity is rolled first, so it only wins within its rarity */
 miss(R){const m=new Set(),hasT=id=>R.tl.some(t=>t.id===id),hold=id=>CH[id]?!!RG.has(R,id):hasT(id);for(const D of[CH,TL])for(const id in D){const f=D[id].fu;if(!f||PF.lk('fu.'+id)||hold(id))continue;const a=hold(f[0]),b=hold(f[1]);if(a!==b)m.add(a?f[1]:f[0]);}return m;},
 /* halves of the fusions the run holds: never offered again (v1.58.2), so a fused piece can not be held twice */
 fz(R){const z=new Set();for(const o of[...R.ch,...R.or])for(const h of CH[o.id].fu||[])z.add(h);for(const t of R.tl)for(const h of TL[t.id].fu||[])z.add(h);return z;},
 fwW:(R,m)=>k=>m.has(k)?2+((R.fw||{})[k]||0):1,
 /* n Orchard items the run does not hold, rarity rolled like the charms (70/26/4, Good Taste shifts it) */
 orPick(R,n,not=[],w=()=>1){const o=[],tt=R.up.taste,fz=RG.fz(R);for(let i=0;i<n;i++){const left=Object.keys(CH).filter(k=>CH[k].o&&!CH[k].fu&&!CH[k].dev&&!PF.lk('ch.'+k)&&!RG.has(R,k)&&!fz.has(k)&&!o.includes(k)&&!not.includes(k));if(!left.length)break;const r=Math.random(),rar=r<.55-.075*tt?0:r<.96-.03*tt?1:2,c=left.filter(k=>CH[k].r===rar),from=c.length?c:left;o.push(RG.pickW(from,1,w)[0]);}return o;},
 pick(a,n){const o=[];while(o.length<n&&a.length)o.push(a.splice(rint(a.length),1)[0]);return o;},
 /* the same, with a weight per item: w(item) */
 pickW(a,n,w){const o=[];while(o.length<n&&a.length){let t=0,i=0;for(const k of a)t+=w(k);let r=Math.random()*t;while(i<a.length-1&&(r-=w(a[i]))>=0)i++;o.push(a.splice(i,1)[0]);}return o;},
 sizes(R){const a=[];for(let l=1;l<=(R.depth<4?7:10);l++)a.push(l);return a;},
 /* ---- fusions ---- */
 /* every fusion the run holds both halves of: [{id, k (ch or tl), a, b}] */
 pob:(R,k)=>R.ch.find(c=>PK[k].includes(c.id)), /* the held item that carries pet k */
 plv:o=>o?PLX.filter(t=>(o.x||0)>=t).length:1, /* its level */
 pl:(R,k)=>RG.plv(RG.pob(R,k)),
 pxp(R,o,n){if(!o||!PLK[o.id])return;const a=RG.plv(o);o.x=(o.x||0)+n*(RG.has(R,'alpha')?3:RG.has(R,'collar')?2:1);const b=RG.plv(o);if(b>a)(R.lvq=R.lvq||[]).push({id:o.id,lv:b});}, /* add XP, queue a level-up for the engine to show */
 fuK(f){const k=[f.k==='tl'?'tl':'ch'];if(SDF.includes(f.id))k.push('sd');return k;}, /* the shop crates that offer this fusion (v1.43): Charm Crate a charm fusion, Tool Crate a tool fusion, Seed Crate one with a seed half */
 fusable(R){const o=[],hasT=id=>R.tl.some(t=>t.id===id);for(const id in CH){const f=CH[id].fu;if(f&&!PF.lk('fu.'+id)&&RG.has(R,f[0])&&RG.has(R,f[1]))o.push({id,k:'ch',a:CH[f[0]].n,b:CH[f[1]].n});}
  for(const id in TL){const f=TL[id].fu;if(f&&!PF.lk('fu.'+id)&&hasT(f[0])&&RG.has(R,f[1]))o.push({id,k:'tl',a:TL[f[0]].n,b:CH[f[1]].n});}return o;},
 /* make it: both halves go, the fusion takes the first half's place. A charm fusion keeps what its halves had grown */
 fuse(R,id){const c=CH[id],t=TL[id];if(c&&c.fu){const row=c.o?R.or:R.ch,at=x=>R.ch.includes(x)?R.ch:R.or,a=RG.has(R,c.fu[0]),b=RG.has(R,c.fu[1]);if(!a||!b)return false;const[k,o]=at(a)===row?[a,b]:[b,a];if(at(k)!==row)return false;const v=(a.v||0)+(b.v||0),e=edB(a.e,b.e),n={id},px=Math.max(a.x||0,b.x||0);if(v)n.v=v;if(e)n.e=e;if(px&&PLK[id])n.x=px;row[row.indexOf(k)]=n;const L=at(o);L.splice(L.indexOf(o),1);return true;} /* an Orchard half and a charm half make a charm in the charm's place; two Orchard halves make an Orchard item */
  if(t&&t.fu){const i=R.tl.findIndex(x=>x.id===t.fu[0]),j=R.ch.findIndex(x=>x.id===t.fu[1]);if(i<0||j<0)return false;const e=edB(R.tl[i].e,R.ch[j].e);R.tl[i]=RG.tool(id,R);if(e)R.tl[i].e=e;R.ch.splice(j,1);return true;}return false;},
 /* ---- crates ---- */
 /* opts: {k:'ch'|'tl'|'sd'|'coin'|'fu', id, n}. kind = a shop crate of one kind. then = the screen that follows (shop or hub) */
 crate(R,tier,then,kind,lgAll){const w=RG.fwW(R,RG.miss(R)),lg=lgAll?1:kind==='ch'?CRL:kind?0:T0(tier),big=!kind&&tier!=='wood'&&R.tg.boss?2:0,T=CRT[tier],n=3+R.up.crowbar+big,o=[],fu=tier==='wood'&&!kind?[]:RG.fusable(R).filter(f=>!kind||RG.fuK(f).includes(kind));if(fu.length)o.push({k:'fu',id:fu[rint(fu.length)].id});
  const fz=RG.fz(R),all=Object.keys(CH).filter(k=>!CH[k].fu&&!fz.has(k)&&!CH[k].o&&!CH[k].dev&&!PF.lk('ch.'+k)&&!R.ch.some(c=>c.id===k)&&RG.rq(R,CH[k].req)),chs=all.filter(k=>CH[k].r<3),lgs=all.filter(k=>CH[k].r===4),tls=Object.keys(TL).filter(k=>!TL[k].fu&&!fz.has(k)&&!PF.lk('tl.'+k)&&!R.tl.some(t=>t.id===k)&&RG.rq(R,TL[k].req)),sds=RG.sizes(R);let coin=0;
  for(let g=0;o.length<n&&g<60;g++){const r=Math.random(),k=kind||(r<.4?'ch':r<.6?'tl':r<.9?'sd':'coin');
   if(k==='ch'&&lgs.length&&lg&&!o.some(x=>x.lg)&&Math.random()<lg)o.push({k,id:lgs[rint(lgs.length)],lg:1});
   else if(k==='ch'&&Math.random()<CRO){const id=RG.orPick(R,1,o.filter(x=>x.k==='or').map(x=>x.id),w)[0];if(id)o.push({k:'or',id});}
   else if(k==='ch'){const q=Math.random()*(T.r[0]+T.r[1]+T.r[2]),rar=q<T.r[0]?0:q<T.r[0]+T.r[1]?1:2,c=chs.filter(x=>CH[x].r===rar),from=c.length?c:chs;if(from.length){const id=RG.pickW(from.slice(),1,w)[0];chs.splice(chs.indexOf(id),1);o.push({k,id});}}
   else if(k==='tl'){if(tls.length){const id=RG.pickW(tls.slice(),1,w)[0];tls.splice(tls.indexOf(id),1);o.push({k,id});}}
   else if(k==='sd'){if(sds.length)o.push({k,id:sds.splice(rint(sds.length),1)[0],n:T.sd});}
   else if(!coin){coin=1;o.push({k,n:T.coin});}}
  for(const x of o)if((x.k==='ch'||x.k==='or'||x.k==='tl')&&!x.lg){const e=edR();if(e)x.e=e;} /* editions on crate picks */
  if(big)delete R.tg.boss;return{tier,then,kind:kind||null,opts:o};},
 /* why a pick can not be taken right now, or '' */
 blocked:(R,o)=>o.k==='ch'&&!NSL.includes(o.id)&&R.ch.length>=RG.slots(R)?'Charms full':o.k==='or'&&R.or.length>=RG.os(R)?'Orchard full':o.k==='tl'&&R.tl.length>=RG.ts(R)?'Tools full':'',
 take(R,i){const o=R.crate&&R.crate.opts[i];if(!o||RG.blocked(R,o))return null;if(o.k==='ch')R.ch.push(o.e?{id:o.id,e:o.e}:{id:o.id});else if(o.k==='or')R.or.push(o.e?{id:o.id,e:o.e}:{id:o.id});else if(o.k==='tl'){const t=RG.tool(o.id,R);if(o.e)t.e=o.e;R.tl.push(t);}else if(o.k==='sd')R.sd[o.id]+=o.n;else if(o.k==='coin')R.coins+=o.n;else if(!RG.fuse(R,o.id))return null;else if(RG.has(R,'root')){const a=RG.sizes(R),l=a[rint(a.length)];R.sd[l]+=2;o.root=l;} /* Rootstock */
  if(R.shop&&R.shop[o.k]&&(o.k==='ch'||o.k==='tl'||o.k==='or'))R.shop[o.k]=R.shop[o.k].map(x=>x===o.id?null:x); /* the shop was stocked before the crate opened: take that item off its shelf */
  R.at=R.crate.then;R.crate=null;return o;},
 leave(R){const c=R.crate;if(!c)return 0;const n=CRT[c.tier].out;R.coins+=n;R.at=c.then;R.crate=null;return n;},
 buyCr(R){const k=R.shop.cr,p=k&&RG.crCost(R);if(!k||R.coins<p)return false;RG.pay(R,p);R.shop.cr=null;R.crate=RG.crate(R,'wood','shop',k);R.at='crate';return true;},
 /* skip jar 1 or 2 of a depth: no payout, no shop, and a pick between a wooden crate and one other skip reward (not one already held) */
 /* the skip rewards on offer, drawn ahead per depth so the map can show them (v1.38): R.sr[depth] = [jar 1's, jar 2's], the wooden crate always comes with it */
 srw(R,d=R.depth){if(!R.sr)R.sr={};if(!R.sr[d]){const k=Object.keys(SKR).filter(k=>k!=='crate'),a=k[rint(k.length)],b=k.filter(x=>x!==a);R.sr[d]=[a,b[rint(b.length)]];}return R.sr[d];},
 skO(R){const a=Object.keys(SKR).filter(k=>k!=='crate'),pre=RG.srw(R)[R.jar],i=a.indexOf(pre);for(let n=0;n<a.length;n++){const x=a[(i+n)%a.length];if(!R.tg[x])return ['crate',x];}return ['crate'];}, /* what skipping the current jar offers: the drawn reward, or the next one along that is not already held, so the map and the hub can name it */
 skip(R){if(R.jar>1||RG.jarCfg(R).boss)return false;R.sk=RG.skO(R);R.jar++;R.coins+=R.up.road*3;RG.offer(R);R.at='skip';return true;},
 skipTake(R,id){if(!R.sk||!R.sk.includes(id))return false;R.sk=null;if(id==='crate'){R.crate=RG.crate(R,'wood','hub');R.at='crate';}else if(id==='detour'){RG.bribe(R);R.at='hub';}else{R.tg[id]=SKR[id].u;R.at='hub';}return true;},
 sv:(R,o,tl)=>tl?RG.sellV(R,TL[o.id].c+ed$(o.e)):RG.sellV(R,CH[o.id].c+ed$(o.e),CH[o.id].r), /* sell value of an owned item, edition included */
 se:(R,k,i)=>R.shop&&R.shop.ed&&R.shop.ed[k+i]||'', /* the edition of shop offer k (ch, or, tl) at i */
 pr:(R,k,i)=>{const id=R.shop[k][i];return RG.cost(R,(k==='tl'?TL:CH)[id].c+ed$(RG.se(R,k,i)));}, /* its price */
 buy(R,i){const id=R.shop.ch[i],e=RG.se(R,'ch',i),p=id&&RG.cost(R,CH[id].c+ed$(e));if(!id||R.coins<p||R.ch.length>=RG.slots(R)||R.ch.some(c=>c.id===id))return false;RG.pay(R,p);R.ch.push(e?{id,e}:{id});R.shop.ch[i]=null;return true;},
 buyUp(R,i){const id=R.shop.up[i],p=id&&RG.upCost(R,id);if(!id||R.coins<p||!RG.upOk(R,id))return null;RG.pay(R,p);R.up[id]++;R.shop.up[i]=null;if(id==='bribe')RG.bribe(R);if(id==='whet')for(const t of R.tl)t.c=Math.min(t.c,RG.need(R,t.id));return id;},
 buySd(R,i){const l=R.shop.sd[i],p=l&&RG.sdCost(R,l);if(!l||R.coins<p)return 0;RG.pay(R,p);R.sd[l]++;R.shop.sd[i]=null;return l;},
 buyTl(R,i){const id=R.shop.tl[i],e=RG.se(R,'tl',i),p=id&&RG.cost(R,TL[id].c+ed$(e));if(!id||R.coins<p||R.tl.length>=RG.ts(R)||R.tl.some(t=>t.id===id))return false;RG.pay(R,p);const t=RG.tool(id,R);if(e)t.e=e;R.tl.push(t);R.shop.tl[i]=null;return true;},
 sellTl(R,i){const t=R.tl[i];if(!t)return false;R.coins+=RG.sellV(R,TL[t.id].c+ed$(t.e));R.tl.splice(i,1);return true;},
 buyOr(R,i){const id=R.shop.or&&R.shop.or[i],e=RG.se(R,'or',i),p=id&&RG.cost(R,CH[id].c+ed$(e));if(!id||R.coins<p||R.or.length>=RG.os(R)||RG.has(R,id))return false;RG.pay(R,p);R.or.push(e?{id,e}:{id});R.shop.or[i]=null;return true;},
 sellOr(R,i){const c=R.or[i];if(!c)return false;R.coins+=RG.sellV(R,CH[c.id].c+ed$(c.e),CH[c.id].r);R.or.splice(i,1);return true;},
 sell(R,i){const c=R.ch[i];if(!c)return false;R.coins+=RG.sellV(R,CH[c.id].c+ed$(c.e),CH[c.id].r)+(RG.has(R,'lchange')?2:0);R.ch.splice(i,1);return true;},
 reroll(R){const fr=R.tg.roll>0&&RG.rrBase(R)>0,p=fr?0:RG.rrBase(R);if(R.coins<p)return false;RG.pay(R,p);const s=RG.stock(R);s.rr=R.shop.rr+(fr?0:1);if(fr&&--R.tg.roll<=0)delete R.tg.roll;if(!R.shop.cr)s.cr=null;R.shop=s;return true;},
 ro:(R,clear,fail,fx)=>({get coins(){return R.coins},set coins(v){R.coins=v},get total(){return R.total},set total(v){R.total=v},has:id=>RG.has(R,id),pl:k=>RG.has(R,(RG.pob(R,k)||{}).id)?RG.pl(R,k):1,lvq:()=>R.lvq&&R.lvq.shift(),luck:()=>RG.luck(R),chrys:()=>RG.chrys(R),seed:l=>{R.sd[l]++;},sdb:()=>R.sd.reduce((b,v,l)=>v>(R.sd[b]||0)?l:b,0),score:(b,c)=>RG.score(R,b,c),made:l=>RG.made(R,l),kill:n=>RG.kill(R,n),net:()=>RG.net(R),get tools(){return R.tl},off:n=>{R.off=n;},oc:v=>{R.oc=v;},rev:id=>RG.rev(R,id),up:id=>R.up[id]||0,need:id=>RG.need(R,id),charge:(n,skip)=>RG.charge(R,n,skip),fill:()=>RG.fill(R),acts:()=>R.ch.filter((c,i)=>i>=(R.off||0)&&CH[c.id].act),grow:(id,d)=>{const c=RG.has(R,id);if(c)c.v=+((c.v||0)+d).toFixed(2);},fx:fx||(()=>{}),ev:(n,d)=>rgEv(R,n,d),clear,fail})
};
/* seeded runs: every draw in a seeded run (R.seed) gets its own stream, from the seed, the draw's name, the depth and jar, and how many times that draw has run there (R.sq, filled lazily), so two players get the same shops, crates, bosses and contracts as long as they make the same calls. Draws cached in the run (bosses, curses, skip rewards) are keyed by the depth they are for. Calls that only read locks (fusable, upOk, miss) run inside so locks stay open. jarCfg carries fs, the seed of the jar's fruit order (read by the engine's gen) */
RG.at=(R,k,fn)=>{if(!R||!R.seed||SDQ.d)return fn();return sdW(fn,mb32(sdH(R.seed+'|'+k)));};
for(const n of ['boss','mid','rules','curse','srw'])((f)=>{RG[n]=function(R,a,b){const d=n==='rules'?(b===undefined?R.depth:b):(a===undefined?R.depth:a);return RG.at(R,n+'|'+d,()=>f.apply(this,arguments));};})(RG[n]);
for(const n of ['stock','crate','offer','bribe'])((f)=>{RG[n]=function(R){if(!R||!R.seed||SDQ.d)return f.apply(this,arguments);const q=R.sq||(R.sq={}),k=n+'|'+R.depth+'|'+R.jar;q[k]=(q[k]||0)+1;return RG.at(R,k+'|'+q[k],()=>f.apply(this,arguments));};})(RG[n]);
for(const n of ['fusable','upOk','miss'])((f)=>{RG[n]=function(R){return RG.at(R,'lk',()=>f.apply(this,arguments));};})(RG[n]);
((f)=>{RG.new=function(j,s,seed){if(!seed)return f.call(this,j,s);const R=RG.at({seed},'new',()=>f.call(this,j,s));R.seed=seed;return R;};})(RG.new);
((f)=>{RG.jarCfg=function(R,j=R.jar){const c=f.call(this,R,j);c.jk=R.jarId;if(R.seed)c.fs=R.seed+'|f|'+R.depth+'|'+j;return c;};})(RG.jarCfg);


/* ---------- looks: cosmetics worn from Options, opened by awards (LOCK keys jk.id, bg.id, fs.id, ss.id). They change nothing about play ----------
   jk = jar skins: f frame, i inside, e edge line, k pattern. bg = backgrounds: c colours top to bottom, k pattern.
   fs = fruit skins: r = colour ramp, dark to light, every fruit is recoloured through it by brightness. ss = sound sets (the merge sound, in SFX.merge).
   a = animated: the looks from the hardest awards (Ripeness 4 and 8, the full Almanac, the depth 12 boss, 10 wins, a boss with no charms) move.
   Drawn by drawJar, drawBg and skinBuild in index.html. */
const COS={
 jk:{piggy:{n:'Pink Ceramic',f:'#ff9db5',i:'#fff1f5',e:'#d8607f',k:'dots'},tall:{n:'Deep Glass',f:'#3d5a80',i:'#eaf3ff',e:'#22395a',k:'shine'},wide:{n:'Velvet',f:'#6b3fb0',i:'#f6efff',e:'#f4bb4a',k:'trim'},kit:{n:'Steel',f:'#aab2bb',i:'#f3f5f7',e:'#5f6770',k:'dots'},bare:{n:'Planks',f:'#a9713a',i:'#fff6e8',e:'#6e4420',k:'planks'},gold:{n:'Golden',f:'#ffd43b',i:'#fffbe6',e:'#e09600',k:'spark',a:1},melon:{n:'Melon Rind',f:'#7fcf4e',i:'#fff0f0',e:'#24711c',k:'stripe',a:1},crystal:{n:'Crystal',f:'#bfefff',i:'#f7fdff',e:'#4cc9f0',k:'prism',a:1}},
 bg:{throne:{n:'Throne Room',c:['#1d4d2b','#12331c'],k:'diamond'},orchard:{n:'Orchard Sky',c:['#9fdcff','#e3f7c9'],k:'cloud'},night:{n:'Midnight',c:['#1b1029','#3a2358'],k:'stars'},deep:{n:'The Deep',c:['#06283d','#0f5a6e'],k:'bubbles',a:1},patch:{n:'Melon Patch',c:['#8fd85e','#6fc043'],k:'stripe'},note:{n:'Notebook',c:['#fdfaf0','#fdfaf0'],k:'lines'},sunset:{n:'Sunset',c:['#6b3fb0','#ff8f6b','#ffd1a3'],k:'sun',a:1}},
 fs:{gold:{n:'Solid Gold',r:['#3d2400','#b87400','#ffc61a','#fff8d0']},rot:{n:'Past It',r:['#241a12','#6b5230','#b59a62','#efe2b8']},mono:{n:'Black and White',r:['#16101f','#6b6572','#c9c3d4','#ffffff'],k:'film',a:1}},
 ss:{chip:{n:'Chiptune'},mar:{n:'Marimba'},wood:{n:'Wood Block'}}
};
const COSK={jk:'jar skin',bg:'background',fs:'fruit skin',ss:'sound set'};for(const k in COS)for(const id in COS[k])COS[k][id].id=id;

/* ---------- player profile: everything that outlives a run ---------- */
/* One object, one storage key, so a sign-in later only has to sync this.
   seen / unlocked / ach: id -> time first reached (ids are namespaced: ch.juicer, boss.fog, up.fert).
   stats: flat counters and records, only ever going up. stakes: best stake won per starting jar.
   mergeProfile joins two copies (this device and the cloud) without losing anything from either. */
const PV=1;
const PF={d:null,dirty:0,
 blank:()=>({v:PV,rev:0,at:0,seen:{},unlocked:{},ach:{},stats:{},stakes:{}}),
 fix(p){const b=PF.blank();if(!p||typeof p!=='object')return b;for(const k in b)if(typeof b[k]==='object'){if(p[k]&&typeof p[k]==='object'&&!Array.isArray(p[k]))b[k]=p[k];}else if(typeof p[k]==='number')b[k]=p[k];b.v=PV;return b;},
 load(){PF.d=PF.heal(PF.fix(store.get('profile',null)));return PF.d;},
 /* an award earned before it unlocked anything (an unlock added to it later) opens its unlock now */
 heal(p){if(p.seen&&p.seen['ch.sling']&&!p.seen['tl.sling'])p.seen['tl.sling']=p.seen['ch.sling']; /* Slingshot moved from charms to tools in v1.36 */
  for(const id in p.ach){const a=ACH[id];if(a&&a.un&&!p.unlocked[a.un])p.unlocked[a.un]=p.ach[id];}return p;},
 save(){if(!PF.dirty||!PF.d)return;PF.dirty=0;PF.d.rev++;PF.d.at=Date.now();store.set('profile',PF.d);},
 inc(k,n=1){const s=PF.d.stats;s[k]=(s[k]||0)+n;PF.dirty=1;},
 max(k,v){const s=PF.d.stats;if(!(s[k]>=v)){s[k]=v;PF.dirty=1;}},
 /* mark things as met, for the glossary. Returns the ids that are new */
 see(kind,ids){const nu=[];for(const id of [].concat(ids)){const k=kind+'.'+id;if(id&&!PF.d.seen[k]){PF.d.seen[k]=Date.now();PF.dirty=1;nu.push(id);}}return nu;},
 saw:(kind,id)=>!!PF.d.seen[kind+'.'+id],
 /* is this thing (ch.id, tl.id, up.id, fu.id, jar.id) still locked behind an award */
 lk:key=>!SDQ.d&&!!LOCK[key]&&!(PF.d||PF.load()).unlocked[key]
};
function mergeProfile(a,b){a=PF.fix(a);b=PF.fix(b);const o=PF.blank(),first=(x,y)=>{const r={...x};for(const k in y)r[k]=r[k]?Math.min(r[k],y[k]):y[k];return r;},most=(x,y)=>{const r={...x};for(const k in y)r[k]=Math.max(r[k]||0,y[k]);return r;};
 o.seen=first(a.seen,b.seen);o.unlocked=first(a.unlocked,b.unlocked);o.ach=first(a.ach,b.ach);o.stats=most(a.stats,b.stats);o.stakes=most(a.stakes,b.stakes);o.rev=Math.max(a.rev,b.rev)+1;o.at=Math.max(a.at,b.at);return PF.heal(o);}

/* ---------- run events ---------- */
/* Everything worth counting goes through here: the engine through ro.ev, the screens by calling rgEv.
   R.st counts over the whole run, R.jst over the jar being played (reset by the 'start' event), the profile over a lifetime.
   Engine events: drop {l,sp}, merge {l,p,m,combo,bull}, tool {id}, kill {n}, net, gold, melons {n}.
   Screen events: ct {id} (a jar was cleared with that contract signed), tag {id} (a skip reward other than the crate was taken), run, start, jar {depth,jar,boss,left,score,quota,win}, end {why,boss}, buy {id,k}, sell {id,k}, up {id}, seed {l}, grow {l} (a seed level from Gardener), pet {k} (a pet acted: cat, mole, bee, hog), roll, skip, crate {tier}, take {k,id} (k = out when the crate was left), fuse {id}, act {id} (an active legendary was used, from the engine). k is the kind (ch or tl).
   Runs touched by the dev panel (R.dev) count for nothing. */
function rgEv(R,n,d={}){if(!R||R.dev)return;if(!PF.d)PF.load();const rs=R.st||(R.st={}),inc=(k,v=1)=>{PF.inc(k,v);rs[k]=(rs[k]||0)+v;if(R.jst)R.jst[k]=(R.jst[k]||0)+v;},top=(k,v)=>{PF.max(k,v);if(!(rs[k]>=v))rs[k]=v;};
 if(n==='run')PF.inc('runs');
 else if(n==='start'){R.jst={};}
 else if(n==='drop'){inc('drops');if(d.rt)inc('rdrops');}
 else if(n==='merge'){inc('merges');if(d.trick)inc('tricks');if(d.wd)inc('wilds');inc('made.'+d.l);if(d.l>0)inc('fam.'+FAM[d.l-1]);if(d.bull)inc('bulls');top('bestMerge',d.p);top('bestMult',+d.m.toFixed(2));top('bestFruit',d.l);top('bestCombo',d.combo);if(R.jst){if(!(R.jst.bm>=d.p))R.jst.bm=d.p;if(!(R.jst.bc>=d.combo))R.jst.bc=d.combo;}}
 else if(n==='tool'){inc('tools');inc('tool.'+d.id);}
 else if(n==='kill')inc('kills',d.n);
 else if(n==='net')inc('nets');
 else if(n==='gold'){inc('golds');if(d.c)inc('goldc',d.c);}
 else if(n==='melons')inc('melons2');
 else if(n==='jar'){inc('jars');for(const c of R.ch)if(PLK[c.id])RG.pxp(R,c,1);top('bestDepth',d.depth);top('bestJar',d.score);if(d.boss){inc('bosses');PF.inc('boss.'+d.boss+'.win');}if(d.win){PF.inc('wins');const j=R.jarId||'classic';PF.d.stakes[j]=Math.max(PF.d.stakes[j]||0,R.stake||1);PF.dirty=1;}}
 else if(n==='end'){PF.inc('end.'+d.why);if(d.why!=='win'&&d.why!=='quit'&&d.boss)PF.inc('boss.'+d.boss+'.loss');PF.max('bestScore',R.total);top('bestCoins',R.coins);}
 else if(n==='buy'){inc('buys');PF.inc((d.k||'ch')+'.'+d.id+'.buy');}
 else if(n==='sell'){inc('sells');if(R.jst&&(d.k||'ch')==='ch')R.jst['sold.'+d.id]=1;}
 else if(n==='leave')inc('leaves');
 else if(n==='petr')inc('petr.'+d.l);
 else if(n==='mould')inc('moulds');
 else if(n==='overln')inc('overlns');
 else if(n==='up'){inc('ups');PF.inc('up.'+d.id+'.buy');}
 else if(n==='seed'){inc('seeds');PF.inc('sd.'+d.l+'.buy');}
 else if(n==='grow')inc('grown');
 else if(n==='treat'){const o=RG.pob(R,d.k);if(o)RG.pxp(R,o,1);} /* Treat Tree: a Treat eaten gives its pet 1 XP */
 else if(n==='pet'||n==='hop'){if(n==='pet'){inc('pets');inc('pet.'+d.k);}const o=RG.pob(R,n==='hop'?'lady':d.k==='cat'?'cat':d.k);if(o){o.a=(o.a||0)+1;if(o.a>=5){o.a=0;RG.pxp(R,o,1);}}} /* hop: the ladybird moved on, only for pet XP */
 else if(n==='roll')inc('rolls');
 else if(n==='skip'){inc('skips');R.dsk=(R.dsk||0)+1;}
 else if(n==='crate'){inc('crates');PF.inc('crate.'+d.tier);}
 else if(n==='take')inc('take.'+d.k);
 else if(n==='fuse'){inc('fuses');PF.inc('fu.'+d.id+'.made');}
 else if(n==='ct'){inc('cts');PF.inc('ct.'+d.id);}
 else if(n==='tag')inc('tag.'+d.id);
 else if(n==='act'){inc('acts');inc('act.'+d.id);} /* an active legendary was used */
 achCheck(R,n,d);if(n==='jar'&&d.jar===2)R.dsk=0;
}

/* ---------- awards (achievements) ---------- */
/* on = the events that can earn it, t(R, d, S) = the test (R the run, d the event's data, S lifetime stats), un = what it unlocks (a LOCK key),
   secret = the description stays hidden until it is earned. Earned awards land in PF.d.ach, in R.got for the run-over screen and in ACHQ for the toast. */
const fuN=R=>R.ch.filter(c=>CH[c.id].fu).length+R.tl.filter(t=>TL[t.id].fu).length;
const ACH={
 first:{n:'First Harvest',d:'Beat a boss.',ti:'Farmhand',tr:0,on:'jar',t:(R,d)=>d.boss&&d.jar===2,un:'tl.twin'},
 melon1:{n:'Watermelon!',d:'Make a watermelon in a Rogue run.',ti:'Melon Head',tr:0,on:'merge',t:(R,d)=>d.l===10,un:'up.pouch'},
 rich:{n:'Nest Egg',d:'Hold 40 coins at once.',ti:'Tycoon',tr:1,on:'jar sell take start',t:R=>R.coins>=40,un:'tl.cash'},
 roller:{n:'High Roller',d:'Reroll the same shop 4 times.',ti:'High Roller',tr:0,on:'roll',t:R=>R.shop.rr>=4,un:'up.crowbar'},
 fuse1:{n:'Alchemist',d:'Make a fusion.',ti:'Mixologist',tr:0,on:'fuse',t:()=>true,un:'fu.ghand'},
 seed5:{n:'Green Fingers',d:'Raise one seed to level 5.',ti:'Green Thumb',tr:0,on:'seed take grow',t:R=>Math.max(...R.sd)>=5,un:'ch.abacus'},
 salad:{n:'Fruit Salad',d:'Make every size from 2 to 8 in a single jar.',ti:'Salad Chef',tr:1,on:'merge',t:R=>[1,2,3,4,5,6,7].every(l=>R.jst['made.'+l]),un:'ch.snake'},
 combo:{n:'Chain Gang',d:'Reach a combo of 10.',ti:'Combo Artist',tr:1,on:'merge',t:(R,d)=>d.combo>=9,un:'fu.wildfire'},
 bull5:{n:'Dead Eye',d:'Land 5 merges in one jar where the dropped fruit touched nothing else first.',ti:'Sniper',tr:2,on:'merge',t:R=>R.jst.bulls>=5,un:'fu.sharp'},
 toolspam:{n:'Busy Hands',d:'Use tools 10 times in one jar.',ti:'Tinkerer',tr:1,on:'tool',t:R=>R.jst.tools>=10,un:'ch.dynamo'},
 alltools:{n:'Handyman',d:'Use 4 different tools in one jar.',ti:'Jack of All Trades',tr:1,on:'tool',t:R=>Object.keys(R.jst).filter(k=>k.startsWith('tool.')).length>=4,un:'ch.drive'},
 nohands:{n:'No Hands',d:'Beat a boss at depth 2 or deeper without using a tool in that jar.',ti:'Purist',tr:1,on:'jar',t:(R,d)=>d.boss&&d.jar===2&&d.depth>=2&&!R.jst.tools,un:'tl.rewind'},
 speed:{n:'Early Finish',d:'Beat a boss at depth 3 or deeper with 8 or more drops left.',ti:'Speedrunner',tr:2,on:'jar',t:(R,d)=>d.jar===2&&d.depth>=3&&d.left>=8,un:'jar.tall'},
 minimal:{n:'Travelling Light',d:'Beat the depth 4 boss, or a deeper one, holding 3 charms or fewer.',ti:'Minimalist',tr:2,on:'jar',t:(R,d)=>d.jar===2&&d.depth>=4&&R.ch.length<=3,un:'up.whet'},
 skipper:{n:'Shortcut',d:'Skip both jars of a depth, then beat its boss.',ti:'Corner Cutter',tr:1,on:'jar',t:(R,d)=>d.jar===2&&(R.dsk||0)>=2,un:'tl.midas'},
 fullkit:{n:'Fully Loaded',d:'Hold 5 charms and 4 tools at once.',ti:'Packrat',tr:1,on:'buy take fuse up',t:R=>R.ch.length>=5&&R.tl.length>=4,un:'ch.crew'},
 fuse2:{n:'Master Blender',d:'Hold 2 fusions at once.',ti:'Blendmaster',tr:2,on:'fuse',t:R=>fuN(R)>=2,un:'fu.cyclone'},
 gold3:{n:'Gold Rush',d:'Merge 3 gold fruit in one jar.',ti:'Gold Rusher',tr:1,on:'gold',t:R=>R.jst.golds>=3,un:'ch.magpie'},
 scorch:{n:'Scorched Earth',d:'Destroy 20 fruit in one jar.',ti:'Pyro',tr:1,on:'kill',t:R=>R.jst.kills>=20,un:'ch.ash'},
 jackpot:{n:'Jackpot',d:'Score 5,000 points with a single merge.',ti:'Jackpot',tr:2,on:'merge',t:(R,d)=>d.p>=5000,un:'ch.crit'},
 overkill:{n:'Overkill',d:'Finish a jar with 3 times its target.',ti:'Overachiever',tr:2,on:'jar',t:(R,d)=>d.score>=d.quota*3,un:'tl.ddown',secret:1},
 twomelon:{n:'Double Melon',d:'Make 2 Watermelons in one jar.',ti:'Melon Magnate',tr:2,on:'melons',t:()=>true,un:'fu.mania',secret:1},
 noshop:{n:'Window Shopper',d:'Beat the depth 3 boss having bought nothing in any shop.',ti:'Window Shopper',tr:2,on:'jar',t:(R,d)=>d.jar===2&&d.depth>=3&&!R.st.buys&&!R.st.ups&&!R.st.seeds,un:'jar.bare',secret:1},
 /* v1.55: challenges that open the new jars */
 evenkeel:{n:'Even Keel',d:'Beat a boss with exactly as many drops on the left half of the jar as on the right (12 drops or more).',ti:'Level-Headed',tr:2,on:'jar',t:(R,d)=>{const n=R.jst.drops||0,r=R.jst.rdrops||0;return d.jar===2&&n>=12&&r*2===n;},un:'jar.see'},
 quickdraw:{n:'Quick Draw',d:'Beat a boss at depth 2 or deeper using 12 drops or fewer.',ti:'Quick Draw',tr:2,on:'jar',t:(R,d)=>d.jar===2&&d.depth>=2&&(R.jst.drops||0)<=12,un:'jar.clock'},
 bigleague:{n:'Big Leagues',d:'Clear a jar with 10 or more merges without making a Strawberry (2) or a Grape (3).',ti:'Big Leagues',tr:2,on:'jar',t:R=>(R.jst.merges||0)>=10&&!R.jst['made.1']&&!R.jst['made.2'],un:'jar.giant'},
 liftoff:{n:'Lift-off',d:'Score 3 Trick Shots in one run.',ti:'Moonwalker',tr:2,on:'merge',t:R=>(R.st.tricks||0)>=3,un:'jar.moon'},
 pineexp:{n:'Pineapple Express',d:'Make 3 Pineapples (8) in one run.',ti:'Pineapple Express',tr:2,on:'merge',t:R=>(R.st['made.7']||0)>=3,un:'jar.hour'},
 pets40:{n:'Picky Eaters',d:'Your pets eat 40 fruit (over all your runs).',ti:'Animal Friend',tr:0,on:'pet',t:(R,d,S)=>(S['pet.cat']||0)+(S['pet.mole']||0)+(S['pet.hog']||0)>=40,un:'ch.appetite'},
 pollen:{n:'Pollinator',d:'Your bees pollinate 30 fruit (over all your runs).',ti:'Beekeeper',tr:1,on:'pet',t:(R,d,S)=>(S['pet.bee']||0)>=30,un:'fu.bfly'},
 zoo3:{n:'Petting Zoo',d:'Hold 3 pets at once.',ti:'Zookeeper',tr:1,on:'buy take fuse',t:R=>PETS.filter(id=>RG.has(R,id)).length>=3,un:'fu.zoo'},
 gold6:{n:'Treasure Trove',d:'Merge 6 gold fruit in one jar.',ti:'Goldsmith',tr:2,on:'gold',t:R=>R.jst.golds>=6,un:'fu.phil'},
 small15:{n:'Small Wonders',d:'Make 15 Strawberries (2) or Grapes (3) in one jar.',ti:'Small Wonder',tr:1,on:'merge',t:R=>(R.jst['made.1']||0)+(R.jst['made.2']||0)>=15,un:'fu.snack'},
 seeds15:{n:'Orchard',d:'Hold 15 seed levels at once.',ti:'Head Gardener',tr:2,on:'seed take grow',t:R=>R.sd.reduce((a,b)=>a+b,0)>=15,un:'fu.svault'},
 dark:{n:'Night Owl',d:'Beat The Blackout.',ti:'Night Owl',tr:1,on:'jar',t:(R,d)=>d.boss==='dark'},
 bank:{n:'Bank Shot',d:'Score a Trick Shot.',ti:'Hotshot',tr:1,on:'merge',t:(R,d)=>d.trick,secret:1},
 win:{n:'To the Bottom',d:'Win a run.',ti:'Champion',tr:2,on:'jar',t:(R,d)=>d.win,un:'jar.piggy'},
 endless:{n:'Still Going',d:'Beat the depth 10 boss.',ti:'Deep Diver',tr:2,on:'jar',t:(R,d)=>d.jar===2&&d.depth>=10,un:'jar.wide'},
 slayer:{n:'Giant Slayer',d:'Beat 15 different bosses.',ti:'Giant Slayer',tr:3,on:'jar',t:(R,d,S)=>Object.keys(S).filter(k=>/^boss\..*\.win$/.test(k)).length>=15,un:'jar.kit'},
 almanac:{n:'Know-It-All',d:'Meet every boss.',ti:'Boss Hunter',tr:3,on:'start jar',t:()=>Object.keys(BOSS).every(k=>PF.d.seen['boss.'+k])},
 stake4:{n:'Seasoned',d:'Win a run on Ripeness 4 or higher.',ti:'Veteran',tr:3,on:'jar',t:(R,d)=>d.win&&(R.stake||1)>=4,un:'jk.gold'},
 stake8:{n:'Juiced',d:'Win a run on Ripeness 8.',ti:'Overripe',tr:4,on:'jar',t:(R,d)=>d.win&&(R.stake||1)>=8,un:'jk.melon'},
 /* hard and obscure ones (ti = the title they give, shown before the player's name) */
 bugtest:{n:'Bugtest',d:'Hold Pet Caterpillar, Pet Bowl, Pet Treats, Chrysalis and Big Appetite at once. Their fusions count.',on:'buy take fuse',t:R=>[['pet','frenzy'],['bowl','zoo'],['treats','nectar'],['chrys','bfly'],['appetite']].every(g=>g.some(id=>RG.has(R,id))),ti:'Bugtester',tr:3},
 bfly5:{n:'Butterfly Effect',d:'Chrysalis reaches +5 Mult in one run.',on:'pet jar fuse',t:R=>R.ch.some(c=>(c.id==='chrys'||c.id==='bfly')&&(c.v||0)>=5),ti:'Lepidopterist',tr:3},
 rainbow:{n:'Rainbow Jar',d:'Have one of every fruit from Cherry (1) to Rockmelon (10) in the jar at once.',on:'rainbow',t:()=>true,ti:'Rainbow',tr:3},
 gmelon:{n:'Golden Melon',d:'Make a Watermelon (11) out of a gold Rockmelon (10).',on:'merge',t:(R,d)=>d.l===10&&d.gold,ti:'Golden',tr:4},
 exact:{n:'Exact Change',d:'Reach a jar\'s target exactly, not a point over.',on:'exact',t:()=>true,ti:'Accountant',tr:2},
 shave:{n:'Close Shave',d:'Clear a jar while the pile is over the line.',on:'shave',t:()=>true,ti:'Daredevil',tr:2},
 south:{n:'Southpaw',d:'Clear a jar of 10 or more drops with every fruit dropped in the left half.',on:'jar',t:R=>R.jst.drops>=10&&!R.jst.rdrops,ti:'Southpaw',tr:2},
 ladder:{n:'Full Ladder',d:'Make every fruit from Strawberry (2) to Watermelon (11) in one combo.',on:'ladder',t:()=>true,ti:'Climber',tr:4},
 untouch:{n:'Untouchable',d:'Beat a boss at depth 5 or deeper without the pile ever going over the line.',on:'jar',t:(R,d)=>d.boss&&d.jar===2&&d.depth>=5&&!R.jst.overlns,ti:'Untouchable',tr:3},
 medusa:{n:'Medusa\'s Garden',d:'Petrify 5 Oranges (5) in one run.',on:'petr',t:R=>(R.st['petr.4']||0)>=5,ti:'Medusa',tr:2},
 rocks:{n:'Rock Bottom',d:'Have 6 rocks in the jar at once.',on:'rocks6',t:()=>true,ti:'Geologist',tr:2},
 mouldy:{n:'Mouldy Oldie',d:'Let 3 fruit go mouldy in one jar and still clear it.',ti:'Mouldy Oldie',tr:1,on:'jar',t:R=>(R.jst.moulds||0)>=3},
 remorse:{n:'Seller\'s Remorse',d:'Sell a charm, then buy the same charm back before the next jar.',ti:'Indecisive',tr:1,on:'buy',t:(R,d)=>(!d.k||d.k==='ch')&&!!(R.jst&&R.jst['sold.'+d.id])},
 broke:{n:'Empty Pockets',d:'Beat a final boss holding 0 coins.',on:'jar',t:(R,d)=>d.jar===2&&d.boss&&BOSS[d.boss].fin&&R.coins===0,ti:'Pauper',tr:3},
 noint:{n:'Not Interested',d:'Leave 5 crates unopened in one run.',ti:'Not Interested',tr:1,on:'leave',t:R=>(R.st.leaves||0)>=5},
 pear:{n:'Pear-Shaped',d:'Lose a run with a Pear (7) over the line.',on:'overf',t:(R,d)=>d.l===6,secret:1,ti:'Pear-Shaped',tr:1},
 fly:{n:'Fruit Fly',d:'Keep a fruit in the air for 2.5 seconds without it touching anything.',on:'fly',t:()=>true,ti:'Fruit Fly',tr:2},
 /* awards that open looks (COS). Cosmetic only. Most read lifetime stats, so they are also checked when a run starts (on 'run') and count what was done before they existed */
 jwpiggy:{n:'Piggy Banked',d:'Win a run with the Piggy Jar.',ti:'Piggy Banker',tr:3,on:'run jar',t:()=>PF.d.stakes.piggy>=1,un:'jk.piggy'},
 jwtall:{n:'Deep End',d:'Win a run with the Deep Jar.',ti:'Deep Sea',tr:3,on:'run jar',t:()=>PF.d.stakes.tall>=1,un:'jk.tall'},
 jwwide:{n:'Charmed Life',d:'Win a run with the Charm Jar.',ti:'Charmer',tr:3,on:'run jar',t:()=>PF.d.stakes.wide>=1,un:'jk.wide'},
 jwkit:{n:'Right Tool',d:'Win a run with the Tool Kit.',ti:'Toolmaster',tr:3,on:'run jar',t:()=>PF.d.stakes.kit>=1,un:'jk.kit'},
 jwbare:{n:'Unboxed',d:'Win a run with the Crate Jar.',ti:'Unboxer',tr:3,on:'run jar',t:()=>PF.d.stakes.bare>=1,un:'jk.bare'},
 king:{n:'Regicide',d:'Beat The Melon Queen.',ti:'Queenslayer',tr:2,on:'run jar',t:(R,d,S)=>S['boss.melon.win']>=1,un:'bg.throne'},
 queen:{n:'Windfall',d:'Beat The Orchard Queen.',ti:'Usurper',tr:2,on:'run jar',t:(R,d,S)=>S['boss.queen.win']>=1,un:'bg.orchard'},
 reap:{n:'Cheat Death',d:'Beat The Reaper.',ti:'Deathless',tr:3,on:'run jar',t:(R,d,S)=>S['boss.reaper.win']>=1,un:'bg.night'},
 deep12:{n:'Pressure',d:'Beat the depth 12 boss.',ti:'Abyssal',tr:3,on:'run jar',t:(R,d,S)=>S.bestDepth>=13||(d.jar===2&&d.depth>=12),un:'bg.deep'},
 melons:{n:'Melon Farmer',d:'Make 10 Watermelons (over all your runs).',ti:'Melon Farmer',tr:2,on:'run merge',t:(R,d,S)=>S['made.10']>=10,un:'bg.patch'},
 wins10:{n:'Old Hand',d:'Win 10 runs.',ti:'Old Hand',tr:3,on:'run jar',t:(R,d,S)=>S.wins>=10,un:'bg.sunset'},
 gold200:{n:'Gilded',d:'Merge 200 gold fruit (over all your runs).',ti:'Bullion',tr:3,on:'run gold',t:(R,d,S)=>S.golds>=200,un:'fs.gold'},
 mould25:{n:'Past Its Best',d:'Let 25 fruit go mouldy (over all your runs).',ti:'Cheesemonger',tr:2,on:'run mould',t:(R,d,S)=>S.moulds>=25,un:'fs.rot'},
 nocharm:{n:'Bare Hands',d:'Beat the depth 3 boss, or a deeper one, holding no charms.',ti:'Bare Knuckle',tr:3,on:'jar',t:(R,d)=>d.jar===2&&d.depth>=3&&!R.ch.length,un:'fs.mono'},
 m1500:{n:'Warming Up',d:'Make 1,500 merges (over all your runs).',ti:'Warmed Up',tr:1,on:'run merge',t:(R,d,S)=>S.merges>=1500,un:'ss.chip'},
 m6000:{n:'In the Groove',d:'Make 6,000 merges (over all your runs).',ti:'Grinder',tr:3,on:'run merge',t:(R,d,S)=>S.merges>=6000,un:'ss.mar'},
 crates50:{n:'Unpacker',d:'Get 50 crates (over all your runs).',ti:'Crate Digger',tr:2,on:'run crate',t:(R,d,S)=>S.crates>=50,un:'ss.wood'},
 /* meta = left out of the Almanac's own completion count (alPct), since they are earned from it */
 al50:{n:'Bookworm',d:'Fill half of the Almanac.',ti:'Bookworm',tr:2,on:'run start jar',t:()=>alPct()>=50,un:'bg.note',meta:1},
 al100:{n:'Encyclopedia',d:'Fill the whole Almanac.',on:'run start jar',t:()=>alPct()>=100,un:'jk.crystal',ti:'Professor',tr:4,meta:1},
 /* contracts */
 legend:{n:'Once in a Blue Moon',d:'Take a Legendary charm from a crate.',on:'take',t:(R,d)=>d.k==='ch'&&!!CH[d.id]&&CH[d.id].r===4,ti:'Legend',tr:3},
 ct1:{n:'Signed and Sealed',d:'Clear a jar with a contract signed.',ti:'Signatory',tr:0,on:'ct',t:()=>true},
 ct6:{n:'Fine Print',d:'Clear 6 jars with a contract signed in one run.',on:'ct',t:R=>R.st.cts>=6,ti:'Contractor',tr:2},
 /* v1.40: they open the new charms. Jailbreak reads the jar's rules, so The Orchard Queen with The Padlock or The Miser counts, and so does either as a mini boss */
 jail:{n:'Jailbreak',d:'Beat The Padlock or The Miser.',ti:'Escape Artist',tr:2,on:'jar',t:(R,d)=>!!d.boss&&!!R.cfg&&(R.cfg.rules||[]).some(k=>k==='lock'||k==='miser'),un:'ch.fright'},
 spree:{n:'Big Night Out',d:'Spend 30 coins in one shop.',ti:'Shopaholic',tr:1,on:'buy up seed roll',t:R=>(R.sp||0)>=30,un:'ch.spender'},
 edge:{n:'On the Brink',d:'The pile goes over the line in 5 different jars of one run.',ti:'Edge Walker',tr:2,on:'overln',t:R=>(R.st.overlns||0)>=5,un:'ch.brink'},
 superst:{n:'Superstitious',d:'Hold Lucky Clover, Snake Eyes and Horseshoe at once.',ti:'Superstitious',tr:2,on:'buy take',t:R=>['lucky','snake','shoe'].every(id=>RG.has(R,id)),un:'ch.foot'},
 reunion:{n:'Family Reunion',d:'Merge 5 different families in one jar.',ti:'Matchmaker',tr:1,on:'merge',t:R=>Object.keys(R.jst).filter(k=>k.startsWith('fam.')).length>=5,un:'ch.ftree'},
 /* v1.45: awards that open the pool expansion's items */
 petjar:{n:'Good Boy',d:'Clear a jar while holding a pet.',ti:'Pet Parent',tr:0,on:'jar',t:R=>PETS.some(id=>RG.has(R,id)),un:'ch.collar'},
 cat5:{n:'The Very Hungry Caterpillar',d:'Raise a Pet Caterpillar to level 5.',ti:'Very Hungry',tr:2,on:'jar pet',t:R=>!!RG.pob(R,'cat')&&RG.pl(R,'cat')>=5,un:'ch.wfed'},
 pets4:{n:'Top of the Food Chain',d:'Hold 4 level 5 pets at once.',ti:'Apex',tr:3,on:'jar pet hop',t:R=>R.ch.filter(o=>PLK[o.id]&&RG.plv(o)>=5).length>=4,un:'fu.alpha'},
 goldrun:{n:'Golden Thread',d:'Keep a fruit gold through 6 merges in a row.',ti:'Gold Weaver',tr:3,on:'gchain',t:(R,d)=>d.n>=6,un:'ch.gstd'},
 kaboom:{n:'Kaboom',d:'Destroy 5 fruit with a single Boom (chain blasts count).',ti:'Demolitionist',tr:2,on:'blast',t:(R,d)=>d.n>=5,un:'ch.cblast'},
 wild3:{n:'Wild Night',d:'Make 3 Wildcard merges in one jar.',ti:'Joker',tr:2,on:'merge',t:R=>(R.jst.wilds||0)>=3,un:'ch.masq'},
 rotboss:{n:'Cheese Course',d:'Beat The Rot.',ti:'Fromager',tr:2,on:'jar',t:(R,d)=>!!d.boss&&!!R.cfg&&(R.cfg.rules||[]).includes('rot'),un:'ch.bcheese'},
 iceboss:{n:'Thaw',d:'Beat Cold Snap.',ti:'Icebreaker',tr:2,on:'jar',t:(R,d)=>!!d.boss&&!!R.cfg&&(R.cfg.rules||[]).includes('ice'),un:'ch.isculpt'},
 small20:{n:'Tiny Army',d:'Make 20 fruit of size 2 to 4 in one jar.',ti:'Tiny Tyrant',tr:1,on:'merge',t:R=>[1,2,3].reduce((a,l)=>a+(R.jst['made.'+l]||0),0)>=20,un:'ch.nurs'},
 tower:{n:'High Rise',d:'Have 3 fruit of size 8 or bigger in the jar at once.',ti:'Architect',tr:2,on:'tower',t:()=>true,un:'ch.sky'},
 combo7:{n:'Domino Effect',d:'Reach a combo of 7.',ti:'Toppler',tr:1,on:'merge',t:(R,d)=>d.combo>=6,un:'ch.dom'},
 /* long-haul ladder (v1.50): lifetime counts, a title each, lh = left out of the Almanac's completion, pg/of = progress shown on the Almanac and Titles screen */
 w25:{n:'Winning Streak',d:'Win 25 runs.',ti:'Victor',tr:2,lh:1,of:25,pg:S=>S.wins||0,on:'run jar',t:(R,d,S)=>(S.wins||0)>=25},
 w50:{n:'Half Century',d:'Win 50 runs.',ti:'Conqueror',tr:3,lh:1,of:50,pg:S=>S.wins||0,on:'run jar',t:(R,d,S)=>(S.wins||0)>=50},
 w100:{n:'Centurion',d:'Win 100 runs.',ti:'Immortal',tr:4,lh:1,of:100,pg:S=>S.wins||0,on:'run jar',t:(R,d,S)=>(S.wins||0)>=100},
 l50:{n:'Back for More',d:'Lose 50 runs.',ti:'Persistent',tr:1,lh:1,of:50,pg:S=>(S['end.over']||0)+(S['end.drops']||0),on:'run end',t:(R,d,S)=>((S['end.over']||0)+(S['end.drops']||0))>=50},
 l200:{n:'Glutton for Punishment',d:'Lose 200 runs.',ti:'Stubborn',tr:2,lh:1,of:200,pg:S=>(S['end.over']||0)+(S['end.drops']||0),on:'run end',t:(R,d,S)=>((S['end.over']||0)+(S['end.drops']||0))>=200},
 l500:{n:'Never Give Up',d:'Lose 500 runs.',ti:'Unbreakable',tr:3,lh:1,of:500,pg:S=>(S['end.over']||0)+(S['end.drops']||0),on:'run end',t:(R,d,S)=>((S['end.over']||0)+(S['end.drops']||0))>=500},
 r25:{n:'Regular',d:'Start 25 Rogue runs.',ti:'Regular',tr:0,lh:1,of:25,pg:S=>S.runs||0,on:'run',t:(R,d,S)=>(S.runs||0)>=25},
 r100:{n:'Frequent Flyer',d:'Start 100 Rogue runs.',ti:'Devotee',tr:1,lh:1,of:100,pg:S=>S.runs||0,on:'run',t:(R,d,S)=>(S.runs||0)>=100},
 r250:{n:'Lifer',d:'Start 250 Rogue runs.',ti:'Lifer',tr:2,lh:1,of:250,pg:S=>S.runs||0,on:'run',t:(R,d,S)=>(S.runs||0)>=250},
 r500:{n:'No Days Off',d:'Start 500 Rogue runs.',ti:'Fruit Fanatic',tr:3,lh:1,of:500,pg:S=>S.runs||0,on:'run',t:(R,d,S)=>(S.runs||0)>=500},
 m20k:{n:'Merge Machine',d:'Make 20,000 merges (over all your runs).',ti:'Machine',tr:3,lh:1,of:20000,pg:S=>S.merges||0,on:'run merge',t:(R,d,S)=>(S.merges||0)>=20000},
 m50k:{n:'Fifty Thousand',d:'Make 50,000 merges (over all your runs).',ti:'Unstoppable',tr:4,lh:1,of:50000,pg:S=>S.merges||0,on:'run merge',t:(R,d,S)=>(S.merges||0)>=50000},
 mel50:{n:'Melon Patch',d:'Make 50 Watermelons (over all your runs).',ti:'Melon Tycoon',tr:2,lh:1,of:50,pg:S=>S['made.10']||0,on:'run merge',t:(R,d,S)=>(S['made.10']||0)>=50},
 mel150:{n:'Melon Empire',d:'Make 150 Watermelons (over all your runs).',ti:'Melon Mogul',tr:3,lh:1,of:150,pg:S=>S['made.10']||0,on:'run merge',t:(R,d,S)=>(S['made.10']||0)>=150},
 mel500:{n:'Melon Legend',d:'Make 500 Watermelons (over all your runs).',ti:'Watermelon Royalty',tr:4,lh:1,of:500,pg:S=>S['made.10']||0,on:'run merge',t:(R,d,S)=>(S['made.10']||0)>=500},
 g500:{n:'Gold Reserve',d:'Merge 500 gold fruit (over all your runs).',ti:'Gold Hoarder',tr:3,lh:1,of:500,pg:S=>S.golds||0,on:'run gold',t:(R,d,S)=>(S.golds||0)>=500},
 g1500:{n:'El Dorado',d:'Merge 1,500 gold fruit (over all your runs).',ti:'El Dorado',tr:4,lh:1,of:1500,pg:S=>S.golds||0,on:'run gold',t:(R,d,S)=>(S.golds||0)>=1500},
 cr150:{n:'Crate Collector',d:'Get 150 crates (over all your runs).',ti:'Quartermaster',tr:2,lh:1,of:150,pg:S=>S.crates||0,on:'run crate',t:(R,d,S)=>(S.crates||0)>=150},
 cr400:{n:'Warehouse',d:'Get 400 crates (over all your runs).',ti:'Warehouse Keeper',tr:3,lh:1,of:400,pg:S=>S.crates||0,on:'run crate',t:(R,d,S)=>(S.crates||0)>=400},
 pf200:{n:'Feeding Time',d:'Your pets eat 200 fruit (over all your runs).',ti:'Pet Whisperer',tr:2,lh:1,of:200,pg:S=>(S['pet.cat']||0)+(S['pet.mole']||0)+(S['pet.hog']||0),on:'run pet',t:(R,d,S)=>((S['pet.cat']||0)+(S['pet.mole']||0)+(S['pet.hog']||0))>=200},
 pf750:{n:'Banquet',d:'Your pets eat 750 fruit (over all your runs).',ti:'Beastmaster',tr:3,lh:1,of:750,pg:S=>(S['pet.cat']||0)+(S['pet.mole']||0)+(S['pet.hog']||0),on:'run pet',t:(R,d,S)=>((S['pet.cat']||0)+(S['pet.mole']||0)+(S['pet.hog']||0))>=750},
 k250:{n:'Wrecking Crew',d:'Destroy 250 fruit (over all your runs).',ti:'Wrecker',tr:1,lh:1,of:250,pg:S=>S.kills||0,on:'run kill',t:(R,d,S)=>(S.kills||0)>=250},
 k1000:{n:'Demolition Derby',d:'Destroy 1,000 fruit (over all your runs).',ti:'Destroyer',tr:2,lh:1,of:1000,pg:S=>S.kills||0,on:'run kill',t:(R,d,S)=>(S.kills||0)>=1000},
 k3000:{n:'Scorched Orchard',d:'Destroy 3,000 fruit (over all your runs).',ti:'Fruit Reaper',tr:3,lh:1,of:3000,pg:S=>S.kills||0,on:'run kill',t:(R,d,S)=>(S.kills||0)>=3000},
 fu25:{n:'Mad Scientist',d:'Make 25 fusions (over all your runs).',ti:'Mad Scientist',tr:2,lh:1,of:25,pg:S=>S.fuses||0,on:'run fuse',t:(R,d,S)=>(S.fuses||0)>=25},
 fu100:{n:'Grand Alchemist',d:'Make 100 fusions (over all your runs).',ti:'Transmuter',tr:3,lh:1,of:100,pg:S=>S.fuses||0,on:'run fuse',t:(R,d,S)=>(S.fuses||0)>=100},
 b50:{n:'Boss Rush',d:'Beat 50 bosses (over all your runs).',ti:'Boss Breaker',tr:2,lh:1,of:50,pg:S=>S.bosses||0,on:'run jar',t:(R,d,S)=>(S.bosses||0)>=50},
 b200:{n:'Big Game',d:'Beat 200 bosses (over all your runs).',ti:'Big Game Hunter',tr:3,lh:1,of:200,pg:S=>S.bosses||0,on:'run jar',t:(R,d,S)=>(S.bosses||0)>=200},
 b500:{n:'Monster Hunter',d:'Beat 500 bosses (over all your runs).',ti:'Bane of Bosses',tr:4,lh:1,of:500,pg:S=>S.bosses||0,on:'run jar',t:(R,d,S)=>(S.bosses||0)>=500}
};
const LOCK={};for(const id in ACH)if(ACH[id].un)LOCK[ACH[id].un]=id;
const ACHQ=[]; /* awards earned and not yet shown */
function achCheck(R,n,d){for(const id in ACH){const a=ACH[id];if(PF.d.ach[id]||!a.on.split(' ').includes(n))continue;let hit=false;try{hit=!!a.t(R,d,PF.d.stats);}catch(e){}if(!hit)continue;
  PF.d.ach[id]=Date.now();if(a.un)PF.d.unlocked[a.un]=Date.now();PF.dirty=1;(R.got=R.got||[]).push(id);ACHQ.push(id);}}
/* the name of what an award unlocks, e.g. "Twin (tool)" */
function unName(key){const[k,id]=key.split('.');return k==='ch'?CH[id].n+' (charm)':k==='tl'?TL[id].n+' (tool)':k==='up'?UPG[id].n+' (upgrade)':k==='fu'?(CH[id]||TL[id]).n+' (fusion)':k==='jar'?(typeof JARS!=='undefined'&&JARS[id]?JARS[id].n:'A starting jar')+' (starting jar)':COS[k]&&COS[k][id]?COS[k][id].n+' ('+COSK[k]+')':key;}
const unKind=key=>({ch:'a charm',tl:'a tool',up:'an upgrade',fu:'a fusion',jar:'a starting jar'}[key.split('.')[0]])||'a '+COSK[key.split('.')[0]];
/* Almanac completion, 0 to 100: things met (charms, tools, fusions, upgrades, seeds, bosses; locked ones do not count) plus awards earned */
function alPct(){const P=PF.d||PF.load(),ks=[...Object.keys(CH).filter(k=>!CH[k].dev).map(k=>(CH[k].fu?'fu.':'ch.')+k),...Object.keys(TL).map(k=>(TL[k].fu?'fu.':'tl.')+k),...Object.keys(UPG).map(k=>'up.'+k),...[1,2,3,4,5,6,7,8,9,10].map(l=>'sd.'+l),...Object.keys(BOSS).map(k=>'boss.'+k)],as=Object.keys(ACH).filter(k=>!ACH[k].meta&&!ACH[k].lh);
 return Math.floor((ks.filter(k=>P.seen[k]&&!PF.lk(k)).length+as.filter(k=>P.ach[k]).length)/(ks.length+as.length)*100);}

