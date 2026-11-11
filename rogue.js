/* Fruit Merge: Rogue mode rules and the player profile. Loaded before the main script in index.html.
   Nothing here touches the page. It uses rint and store from index.html, but only inside functions, so load order is fine. */
/* ---------- rogue mode: rules (charms, bosses, shop, scoring) ---------- */
const DEPTHS=8,SLOTS=5,RDROPS=24,TS0=2,TSLOTS=4,RV=4; /* RV = run save version. Bump it when the run object changes shape, older saved runs are dropped */
const RQ=[100,130,150]; /* depth 1 score targets: jar 1, jar 2, boss */
const RSC=[1,2.3,4,6.5,9.5,13,17,22]; /* target multiplier per depth */
const RPAY=[3,4,6],RAR=['Common','Uncommon','Rare'];
/* Charms. r = rarity, c = price, d = description. Scoring hooks get a context c:
   l = fruit tier made (-1 when not a merge), combo, bull, enc, n = fruit in the jar, jd/dl = drops made/left this jar, jm = merges this jar,
   pu = different tools used this jar, tu = tool uses this jar, high = pile at the gold line, coins, luck, nc = charms owned, ch = this charm's saved state.
   chip adds points, add adds Mult, x multiplies Mult. Charms with no hook are handled in makeGame or RG. */
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
 fever:{n:'Melon Fever',r:2,c:9,d:'Gains +1.5 Mult every time you make a size 8 fruit or bigger.',add:c=>c.ch.v||0,live:1}
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
const UPG={
 fert:{n:'Fertiliser',c:3,d:'Every merge scores +2 points for the rest of the run.'},
 sauce:{n:'Hot Sauce',c:4,d:'+0.25 Mult for the rest of the run.'},
 can:{n:'Watering Can',c:3,d:'+2 drops in every jar for the rest of the run.'},
 scrub:{n:'Scrub',c:3,d:'Right now: clears every size 1 and size 2 fruit out of the jar.'},
 belt:{n:'Tool Belt',c:6,d:'+1 tool slot (up to 4).'}
};
/* Tools: abilities the player taps during a jar. c = price, ch = charge needed (1 per merge), tg = the player then taps a fruit.
   What each one does is in tool() in makeGame, which fruit it can target in okTg(). */
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
 cash:{n:'Cash Out',c:5,ch:8,d:'Pays 2 coins.'}
};
const ICN={lode:'magnet',boom:'bomb',pet:'cat',glut:'cat',rot:'mould',stone:'rock',storm:'whirl',slick:'drop',melon:'king'}; /* things that share another icon (icons.js) */
const icn=id=>ICN[id]||id;
const nice=q=>{const m=Math.pow(10,Math.max(1,Math.floor(Math.log10(q))-1));return Math.round(q/m)*m;};
const RG={
 new(){const pool=Object.keys(BOSS).filter(k=>k!=='melon'),bs=[];for(let d=1;d<DEPTHS;d++){const c=pool.filter(k=>BOSS[k].min<=d&&!bs.includes(k));bs.push(c[rint(c.length)]);}bs.push('melon');
  return{v:RV,depth:1,jar:0,coins:4,total:0,ch:[],tl:[RG.tool('swap'),RG.tool('shake')],up:{fert:0,sauce:0,can:0,scrub:0,belt:0},bs,shop:null,pile:[],at:'hub',won:0,st:{},jst:{}};},
 /* a saved run that this version can load, or null */
 saved(){const sv=store.get('run',null);if(sv&&sv.v!==RV){store.set('run',null);return null;}return sv;},
 has:(R,id)=>R.ch.find(c=>c.id===id),
 /* tools: {id, c} where c is the charge held. New tools arrive charged */
 tool:id=>({id,c:TL[id].ch}),
 ts:R=>Math.min(TSLOTS,TS0+R.up.belt),
 charge(R,n,skip){const k=n*(RG.has(R,'battery')?2:1);for(const t of R.tl)if(t!==skip)t.c=Math.min(TL[t.id].ch,t.c+k);},
 fill(R){for(const t of R.tl)t.c=TL[t.id].ch;},
 boss(R,d=R.depth){while(R.bs.length<d){const k=Object.keys(BOSS).filter(k=>k!=='melon'&&k!==R.bs[R.bs.length-1]);R.bs.push(R.bs.length%DEPTHS===DEPTHS-1?'melon':k[rint(k.length)]);}return R.bs[d-1];},
 jarCfg(R,j=R.jar){const d=R.depth,b=j===2?RG.boss(R):null,bd=b&&BOSS[b],sc=d<=DEPTHS?RSC[d-1]:RSC[DEPTHS-1]*Math.pow(1.6,d-DEPTHS);
  const quota=nice(RQ[j]*sc*(bd&&bd.q||1)),drops=Math.max(8,RDROPS+R.up.can*2+(RG.has(R,'bag')?5:0)-(b==='hour'?6:0));
  return{quota,drops,boss:b,pay:RPAY[j],tag:`D${d} · ${bd?bd.n:'Jar '+(j+1)+'/3'}`,name:bd?bd.n:`Depth ${d} · Jar ${j+1}`,ic:b?icn(b):null,rule:(bd?bd.d+' ':'')+`Score ${quota} in ${drops} drops.`};},
 /* points for a scoring event, plus which charms took part (hit) so the screen can flash them */
 score(R,base,c){let chips=base,a=1+R.up.sauce*.25,x=1;const hit=[];c.coins=R.coins;c.nc=R.ch.length;c.luck=RG.has(R,'shoe')?2:1;if(c.l>=0)chips+=R.up.fert*2;
  for(const ch of R.ch){const d=CH[ch.id];let on=0,v;c.ch=ch;if(d.chip&&c.l>=0){chips+=d.chip(c);on=1;}if(d.add&&(v=d.add(c))>0){a+=v;on=1;}if(d.x&&(v=d.x(c))>1){x*=v;on=1;}if(on)hit.push(ch.id);}
  return{p:Math.ceil(chips*a*x-1e-9),m:a*x,hit};},
 /* a fruit of tier l was made: returns the charms that paid out */
 made(R,l){const ev=[],f=RG.has(R,'fever');if(l>=5&&RG.has(R,'gold')){R.coins++;ev.push('gold');}if(RG.has(R,'scratch')&&Math.random()<(RG.has(R,'shoe')?2:1)/6){R.coins++;ev.push('scratch');}if(l>=7&&f){f.v=(f.v||0)+1.5;ev.push('fever');}return ev;},
 kill(R,n){const c=RG.has(R,'compost');if(!c||!(n>0))return false;c.v=+((c.v||0)+.05*n).toFixed(2);return true;},
 net(R){const i=R.ch.findIndex(c=>c.id==='net');if(i<0)return false;R.ch.splice(i,1);return true;},
 cost:(R,c)=>Math.max(1,c-(RG.has(R,'coupon')?1:0)),
 upCost:(R,id)=>RG.cost(R,UPG[id].c+(id==='scrub'?0:R.up[id]*2)),
 payout(R,cfg,left){const rows=[['Jar cleared',cfg.pay]],u=Math.min(3,Math.floor(left/4)),i=Math.min(RG.has(R,'bank')?8:4,Math.floor(R.coins/5));
  if(u)rows.push([`Unused drops (${left})`,u]);if(i)rows.push(['Interest (1 per 5 coins held)',i]);if(RG.has(R,'piggy'))rows.push(['Piggy Bank',3]);return rows;},
 /* bank the payout and move on to the next jar. Returns true when the last depth has just been beaten */
 advance(R,sum){R.coins+=sum;const v=RG.has(R,'vintage');if(v)v.v=+((v.v||0)+.4).toFixed(1);let win=false;if(++R.jar>2){R.jar=0;if(R.depth===DEPTHS&&!R.won){R.won=1;win=true;}R.depth++;}R.shop=RG.stock(R);R.at='shop';return win;},
 stock(R){const own=R.ch.map(c=>c.id),ch=[];for(let i=0;i<3;i++){const left=Object.keys(CH).filter(k=>!own.includes(k)&&!ch.includes(k));if(!left.length)break;const r=Math.random(),rar=r<.6?0:r<.9?1:2,c=left.filter(k=>CH[k].r===rar),from=c.length?c:left;ch.push(from[rint(from.length)]);}
  const u=Object.keys(UPG).filter(k=>k==='scrub'?R.jar!==0:k!=='belt'||RG.ts(R)<TSLOTS),up=[];while(up.length<2)up.push(u.splice(rint(u.length),1)[0]);
  const t=Object.keys(TL).filter(k=>!R.tl.some(o=>o.id===k)),tl=[];while(tl.length<2&&t.length)tl.push(t.splice(rint(t.length),1)[0]);return{ch,tl,up,rr:0};},
 buy(R,i){const id=R.shop.ch[i],p=id&&RG.cost(R,CH[id].c);if(!id||R.coins<p||R.ch.length>=SLOTS)return false;R.coins-=p;R.ch.push({id});R.shop.ch[i]=null;return true;},
 buyUp(R,i){const id=R.shop.up[i],p=id&&RG.upCost(R,id);if(!id||R.coins<p)return null;R.coins-=p;R.up[id]++;R.shop.up[i]=null;return id;},
 buyTl(R,i){const id=R.shop.tl[i],p=id&&RG.cost(R,TL[id].c);if(!id||R.coins<p||R.tl.length>=RG.ts(R))return false;R.coins-=p;R.tl.push(RG.tool(id));R.shop.tl[i]=null;return true;},
 sellTl(R,i){const t=R.tl[i];if(!t)return false;R.coins+=Math.floor(TL[t.id].c/2);R.tl.splice(i,1);return true;},
 sell(R,i){const c=R.ch[i];if(!c)return false;R.coins+=Math.floor(CH[c.id].c/2);R.ch.splice(i,1);return true;},
 reroll(R){const p=RG.cost(R,2+R.shop.rr);if(R.coins<p)return false;R.coins-=p;const s=RG.stock(R);s.rr=R.shop.rr+1;R.shop=s;return true;},
 ro:(R,clear,fail,fx)=>({get coins(){return R.coins},set coins(v){R.coins=v},get total(){return R.total},set total(v){R.total=v},has:id=>RG.has(R,id),score:(b,c)=>RG.score(R,b,c),made:l=>RG.made(R,l),kill:n=>RG.kill(R,n),net:()=>RG.net(R),get tools(){return R.tl},charge:(n,skip)=>RG.charge(R,n,skip),fill:()=>RG.fill(R),fx:fx||(()=>{}),ev:(n,d)=>rgEv(R,n,d),clear,fail})
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
   Screen events: run, start, jar {depth,jar,boss,left,score,quota,win}, end {why,boss}, buy {id,k}, sell {id,k}, up {id}, roll. k is the kind (ch or tl).
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
 else if(n==='roll')inc('rolls');
 /* Stage 5: achievement checks hook in here */
}
