/* Overripe: charm scenes in the jar (v1.75). A scene belongs to one charm (and its fusions) and plays in the jar itself, so a charm can be seen working
   even though its header slot is small: ambient while its condition holds (High Wire's acrobat on the gold line, Full House's marquee bulbs, Limelight's spotlight),
   or a moment when it scores or grows (Old Oak's tree, Tiki Bar's totem, Snowball rolling along the rim).
   All pixel art: sprites are letter grids in FXD (palette FXP = PXP plus a few), procedural parts are drawn cell by cell on a grid of P px (about 3 px), motion is stepped at 6 to 12 fps.
   makeGame (Rogue only) owns one fxNew(): tick(dt,g,lv) with the live state of each charm (lv[id] = {p: held, on: condition holds, ...}), back(c,g) behind the fruit,
   front(c,g) over them, hit(id,o) when a charm scores on a merge, ev(name,o) for drops and jar starts. g = jar geometry from the engine.
   fxlab.html plays every scene on a mock jar. Reduced motion (RMO) holds the loops still. */
const FXP=Object.assign({},PXP,{f:'#f6c79b',F:'#d98f5c',l:'#b6e36a',h:'#fff6b8',q:'#ff6b6b',z:'#6d1424',e:'#9b6b3f',E:'#c48a52',i:'#e3f3ff',j:'#a8cfe8',x:'#3d2a52'});
const FXD={
acS:`
...kkkk...
..kNNNNk..
.kNNNNffk.
.kNNNfkfk.
.kNNffffk.
..kNFffk..
...kffk...
..kmwmwmk.
..kmwmwmk.
..kmwmwmk.
..kYyyyYk.
..kwwwwwk.
..kwwkwwk.
..kwwkwwk.
..kwwkwwk.
..kyykyyk.`,
acW:`
...kkkk...
..kNNNNk..
.kNNNNffk.
.kNNNfkfk.
.kNNffffk.
..kNFffk..
...kffk...
..kmwmwmk.
..kmwmwmk.
..kmwmwmk.
..kYyyyYk.
..kwwwwwk.
..kwwkwwk.
.kwwk.kwwk
.kwk...kwk
.kyk...kyk`,
acP:`
...kkkk...
..kNNNNk..
.kNNNNffk.
.kNNNfkfk.
.kNNffffk.
..kNFffk..
...kffk...
..kmwmwmk.
..kmwmwmk.
..kmwmwmk.
..kYyyyYk.
..kwwwwwk.
...kwwwk..
...kwwwk..
...kwkwk..
...kykyk..`,
warn:`
.....k.....
....kyk....
...kyyyk...
...kykyk...
..kyykyyk..
..kyykyyk..
.kyyykyyyk.
.kyyyyyyyk.
kyyyykyyyyk
kkkkkkkkkkk`,
lamp:`
..kkkk......
.kDDDDkk....
kDddDDDDkk..
kDdDDDDDDDk.
kDDDDDDDDhhk
.kDDDDDDhwwk
..kkDDDDhwhk
....kkkkhhk.
........kk..`,
b0:`
....kkkk........
...kNNNNk.......
..kNNNNNNk......
..kNwkNNNNk.....
yykNNNNNNNNk....
.kyooNNNNNNNk...
..kooooNNNNNNk..
..koooooNnNNNNkk
..koooooonNNNNNk
...kowwwwnNNkkk.
....kkkkkkkk....
.....kk..kk.....`,
bB:`
....kkkk........
...kNNNNk.......
..kNNNNNNk......
..kNkkNNNNk.....
yykNNNNNNNNk....
.kyooNNNNNNNk...
..kooooNNNNNNk..
..koooooNnNNNNkk
..koooooonNNNNNk
...kowwwwnNNkkk.
....kkkkkkkk....
.....kk..kk.....`,
bS:`
....kkkk........
y..kNNNNk.......
.ykNNNNNNk......
..kNwkNNNNk.....
..kNNNNNNNNk....
yyyooNNNNNNNk...
..kooooNNNNNNk..
..koooooNnNNNNkk
..koooooonNNNNNk
...kowwwwnNNkkk.
....kkkkkkkk....
.....kk..kk.....`,
bF0:`
......kk........
.....kNNk.......
....kNnNk.......
...kNNnNNk......
..kkNNNNNkk.....
.kNNNNNNNNNk....
yyNwkNNNNNNNkk..
.kooooNNNNNNNNk.
..koooooNNNkkk..
...kowwwwkk.....
....kkkkk.......
................`,
bF1:`
................
................
....kkkk........
...kNNNNk.......
..kNwkNNNk......
yykNNNNNNNkkk...
.kooooNNNNNNNk..
..kooonNNNNNNNk.
..kooonnNNkkkk..
...kownNNk......
....kNNNk.......
.....kkk........`,
nt:`
...kk..
...kyk.
...kkyk
...k.kk
...k...
.kkk...
kyyyk..
kyyyk..
.kkk...`,
nt2:`
...kk..
...ktk.
...kktk
...k.kk
...k...
.kkk...
kttttk.
kttttk.
.kkkk..`,
rose:`
..kkk..
.kmrmk.
kmrRrmk
kRmrmRk
.kRRRk.
..kGk..
.kGGk..
..kGk..`,
hd:`
.kkk.......
kfffk......
kffffk.....
kfFfffk....
.kffffFk...
.kfFfffffk.
..kffffffk.
..kffffkffk
...kfffkffk
...kfffffk.
....kffffk.
....kwwwk..
....kwwwk..
....kkkkk..`,
hg:`
...kkkk....
..kwwwwk...
.kwwwwwwk..
.kwswswwk..
.kwswswwk..
.kwswswwkk.
.kwwwwwwkwk
.kswwwwwkwk
.kswwwwwwwk
..kswwwwwk.
...kkkkkk..
...kssssk..
...kkkkkk..`,
hdu:`
.kkk..
kfffk.
kfffk.
kFffk.
kfffk.
kFffk.
kfffk.
kffffk
kffffk
.kfffk
..kffk
..kwwk
..kwwk
..kkkk`,
mp0:`
....kkkk........
...kxxxxk.......
..kxwkxxxk......
DDkxxxxxxxk.....
..kwwwxxBBxk....
..kwwwwxBbBxk...
..kwwwwwxBBxkkk.
...kwwwwxxxxxxxk
....kwwwxxkkkxxk
.....kkkkkk..kkk
......k..k......`,
mpP:`
................
....kkkk........
...kxxxxk.......
..kxwkxxxk......
.kxxxxxxxBk.....
DDkwwwxxBbBk....
..kwwwwxBBBxkkk.
...kwwwwxxxxxxxk
....kwwwxxkkkxxk
.....kkkkkk..kkk
......k..k......`,
mpF0:`
......kk........
.....kBBk.......
....kBbBk.......
...kxBBxk.......
..kxwkxxxk......
DDkxxxxxxxk.....
..kwwwxxxxxkkk..
..kwwwwxxxxxxxxk
...kwwwxxxkkkxxk
....kkkkkk...kkk`,
mpF1:`
................
....kkkk........
...kxxxxk.......
..kxwkxxxk......
DDkxxxxxxxkkkk..
..kwwwxxxxxxxxxk
..kwwwwxBBkkkxxk
...kwwwkBbBk.kkk
....kkkkBBk.....
.......kkk......`,
log:`
.kkkkkk.
kEnnnnNk
kNnNnnNk
knnnNnnk
.kkkkkk.`,
loga:`
.kkkkkk.
ksdsddDk
kdDdsdDk
kdsDddsk
.kkkkkk.`,
acn:`
.kk.
kNNk
knEk
knnk
.kk.`,
tk0:`
kkkkkkkkkkk
kNEEEEEEENk
kNkkkNkkkNk
kEwwkEkwwEk
kEwkkEkkwEk
kEEEEyEEEEk
kNkkkkkkkNk
kNwkwkwkwNk
kkkkkkkkkkk`,
tk1:`
kkkkkkkkkkk
kNtttEtttNk
kNEEEEEEENk
kEkwkEkwkEk
kErEEEEErEk
kEEEkykEEEk
kNEkkkkkENk
kNEkwwwkENk
kkkkkkkkkkk`,
tk2:`
kkkkkkkkkkk
kNEEEEEEENk
kNwwkEkwwNk
kEwkkEkkwEk
kEEEEEEEEEk
kEtkEEEktEk
kNkkkkkkkNk
kNkrrrrrkNk
kkkkkkkkkkk`};
const FXI={},fxI=k=>FXI[k]||(FXD[k]?FXI[k]=fxGrid(FXD[k]):null);
function fxGrid(s,pal=FXP){const rows=s.replace(/^\n/,'').split('\n'),h=rows.length,w=Math.max(...rows.map(r=>r.length)),cv=document.createElement('canvas');cv.width=w;cv.height=h;const c=cv.getContext('2d');rows.forEach((r,y)=>{for(let x=0;x<r.length;x++){const k=pal[r[x]];if(k){c.fillStyle=k;c.fillRect(x,y,1,1);}}});return cv;}
const fq=(v,P)=>Math.round(v/P)*P,fst=(t,f)=>RMO?0:Math.floor(t*f),fxA=(v,to,s)=>v<to?Math.min(to,v+s):Math.max(to,v-s),fhs=(a,b=0)=>{const s=Math.sin(a*127.1+b*311.7)*43758.5453;return s-Math.floor(s);};
const FBY=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5]; /* 4x4 Bayer matrix for dithered fades */
/* sprite k with its anchor (ax, ay: 0..1 of its size, default bottom centre) at x, y; r = quarter turns, fl = mirrored, a = alpha */
function fxS(c,k,x,y,P,o={}){const im=fxI(k);if(!im)return;const w=im.width*P,h=im.height*P,ax=o.ax==null?.5:o.ax,ay=o.ay==null?1:o.ay;c.save();c.imageSmoothingEnabled=false;if(o.a!=null)c.globalAlpha*=o.a;c.translate(fq(x,P),fq(y,P));if(o.r)c.rotate(o.r*Math.PI/2);if(o.fl)c.scale(-1,1);c.drawImage(im,-fq(w*ax,P),-fq(h*ay,P),w,h);c.restore();}
function fxLn(c,x0,y0,x1,y1,P,col){x0=Math.round(x0/P);y0=Math.round(y0/P);x1=Math.round(x1/P);y1=Math.round(y1/P);const dx=Math.abs(x1-x0),dy=-Math.abs(y1-y0),sx=x0<x1?1:-1,sy=y0<y1?1:-1;let e=dx+dy;c.fillStyle=col;for(let n=0;n<600;n++){c.fillRect(x0*P,y0*P,P,P);if(x0===x1&&y0===y1)break;const e2=2*e;if(e2>=dy){e+=dy;x0+=sx;}if(e2<=dx){e+=dx;y0+=sy;}}}
function fxR(c,x,y,P,col,w=1,h=1){const f=FXP[col]||(col[0]==='#'?col:0);if(!f)return;c.fillStyle=f;c.fillRect(fq(x,P),fq(y,P),w*P,h*P);}
/* a twinkle: n = 0 (a dot) to 3 (long arms) */
function fxStar(c,x,y,P,n,col='h'){x=fq(x,P);y=fq(y,P);c.fillStyle=FXP.w;c.fillRect(x,y,P,P);if(n<1)return;c.fillStyle=FXP[col];for(let k=1;k<=n;k++){c.fillRect(x+k*P,y,P,P);c.fillRect(x-k*P,y,P,P);c.fillRect(x,y+k*P,P,P);c.fillRect(x,y-k*P,P,P);}if(n>=3){c.fillStyle=FXP.w;for(const[a,b]of[[1,1],[-1,1],[1,-1],[-1,-1]])c.fillRect(x+a*P,y+b*P,P,P);}}
/* particles: k 'sq' (a square of col, s cells), 'spr' (sprite sp, spin = quarter turns a second), 'fn' (q.d draws it); ly 0 = behind the fruit, 1 = over them */
function fxPP(c,g,pp,t,ly){const P=g.P;for(const q of pp){if((q.ly==null?1:q.ly)!==ly||(q.dl&&q.t<q.dl))continue;const u=q.t/q.T,fa=q.fa==null?.6:q.fa,a=u<fa?1:Math.max(0,Math.ceil((1-(u-fa)/(1-fa))*3)/3);c.save();c.globalAlpha*=a;const x=q.x+(q.sw?Math.sin(q.t*(q.sf||3)+(q.ph||0))*q.sw:0);
 if(q.k==='sq'){c.fillStyle=FXP[q.col]||q.col;const s=(q.s||1)*P;c.fillRect(fq(x,P),fq(q.y,P),s,s);}else if(q.k==='spr')fxS(c,q.sp,x,q.y,q.P||P,{ay:.5,r:q.spin?Math.floor(q.t*q.spin)%4:q.r||0,fl:q.fl});else if(q.k==='star')fxStar(c,x,q.y,P,[0,1,2,3,2,1,0][Math.min(6,Math.floor(u*7))],q.col);else if(q.d)q.d(c,q,g,t,x);c.restore();}}
function fxNew(){const S={},pp=[];let t=0;
 const A={pp,S,g:null,F:[],SD:{},rim:{},fr:0,hf:{},fq:[],pops:[],get t(){return t},
  add(q){q.t=0;q.vx=q.vx||0;q.vy=q.vy||0;q.ly=q.ly==null?1:q.ly;pp.push(q);return q;},
  burst(x,y,cols,n,o={}){for(let k=0;k<n;k++){const a=Math.random()*Math.PI*2,v=(o.v||120)*(.4+Math.random()*.8);A.add({k:'sq',x:x+(Math.random()-.5)*(o.w||0),y,vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v+(o.vy||0),g:o.g==null?300:o.g,T:o.T||(.5+Math.random()*.4),col:cols[k%cols.length],s:o.s||1,ly:o.ly,dr:o.dr});}},
  tick(dt,g,lv){A.g=g;A.F=lv._f||[];A.SD=lv._sd||{};if(A.aqs&&A.aqs.length){for(const q of A.aqs)fxAura(A,q.o.x,q.o.y,q.o.r||20,q.ids);A.aqs=[];A.aq=null;}t+=dt;FXC=A;A.fr++;if(A.fq.length){const q0=A.fq;A.fq=[];for(const q of q0){if(A.hf[q.id]!=null&&A.hf[q.id]>=q.t)continue;const p=q.at?q.at(q.id):{x:g.W/2,y:g.top-60};fxPop(A,q.id,p.x,p.y);}}for(const id in FXS){const sc=FXS[id],s=S[id]||(S[id]={p:0,o:0,on:false,ton:9}),l=lv[id]||{},on=!!(l.p&&l.on);s.l=l;if(on!==s.on){s.on=on;s.ton=0;}else s.ton+=dt;s.p=fxA(s.p,l.p?1:0,dt*4);s.o=fxA(s.o,on?1:0,dt*(on?5:3));if(sc.tick&&(s.p>0||l.p))sc.tick(s,g,dt,A);}fxRimSolve(A,g,dt);
   for(let i=pp.length-1;i>=0;i--){const q=pp[i];q.t+=dt;if(q.dl&&q.t<q.dl)continue;if(q.t>=q.T){pp.splice(i,1);if(q.end)q.end(A,g,q);continue;}const d=dt;q.vy+=(q.g||0)*d;q.x+=q.vx*d;q.y+=q.vy*d;if(q.dr){q.vx*=1-q.dr*d;q.vy*=1-q.dr*d;}if(q.fy!=null&&q.y>q.fy){q.y=q.fy;q.vy=-q.vy*(q.bo||0);q.vx*=.6;}}},
  arena(c,g){FXC=A;const id=fxArPick(S);if(id)fxArena(c,g,A,id,S[id],t);},
  jsh(){if(!(A.jsT>0)||RMO)return null;const a=A.jsA*A.jsT/.5,k=Math.floor(t*30);A.jsT-=1/60;return[Math.round((fhs(k,1)-.5)*2*a),Math.round((fhs(k,2)-.5)*2*a*.6)];},shakeJar(a,d=.5){A.jsA=A.jsT>0?Math.max(A.jsA||0,a):a;A.jsT=d;},
  back(c,g){FXC=A;{const aid=fxArPick(S);if(aid)fxArJar(c,g,A,aid,S[aid],t);}for(const id in FXS){const s=S[id];if(s&&s.p>0&&FXS[id].back)FXS[id].back(c,g,s,t,A);}fxPP(c,g,pp,t,0);},
  front(c,g){FXC=A;for(const id in FXS){const s=S[id];if(s&&s.p>0&&FXS[id].front)FXS[id].front(c,g,s,t,A);}fxPP(c,g,pp,t,1);},
  top(c,g){FXC=A;for(const id in FXS){const s=S[id];if(s&&s.p>0&&FXS[id].top)FXS[id].top(c,g,s,t,A);}}, /* over the HUD (The Fog hides the Next box) */
  hit(id,o={}){FXC=A;A.hf[id]=t;if(S.shoe&&S.shoe.p>0&&FXCHN.has(id))S.shoe.gl=.6;if(id==='marathon'){if(S.early&&S.early.st==='sit')A.hit('early',o);if(S.clutch&&S.clutch.on)A.hit('clutch',o);return;}const ks=[].concat(FXH[id]||id),q=Object.assign({src:id},o);if(!ks.some(k=>FXS[k])){if(FXJFX.has(id)||o.x==null)return;if(FXQ.has(id)){const k2=Math.round(o.x)+','+Math.round(o.y);if(!A.aq||A.aq.t!==t||A.aq.k!==k2){A.aq={t,k:k2,ids:[],o};A.aqs=(A.aqs||[]);A.aqs.push(A.aq);}A.aq.ids.push(id);return;}fxPop(A,id,o.x,o.y-(o.r||0)*.4);return;}for(const k of ks){const s=S[k];if(s&&s.p>0&&FXS[k]&&FXS[k].hit&&A.g)FXS[k].hit(s,q,A,A.g);}},
  tok(k,x,y,id){if(A.tkc&&A.tkc[id]&&t-A.tkc[id]<.25)return;(A.tkc=A.tkc||{})[id]=t;if(A.g)fxToks(A,[k],x,y);},
  fire(ids,at){for(const id of ids)if(id&&!FXSKIP.has(id)&&!FXH[id]&&!FXS[id]&&!FXJFX.has(id)&&!FXQ.has(id)&&id!=='marathon')A.fq.push({id,at,t});},
  ev(n,o={}){if(!A.g)return;FXC=A;for(const id in FXS){const s=S[id];if(s&&FXS[id].ev)FXS[id].ev(s,n,o,A,A.g);}}};
 return A;}
/* which scenes a charm's merge plays: fusions play both halves' scenes, each scene checks o.src to play only when its half applies */
/* rim layout (v1.81): everything that stands on the jar rim books a spot, fxRX(id, pref, w, g, fix) = the centre x it gets (pref = share of the jar, w = width at K 1).
   fxRimSolve packs the spots left to right so no two overlap (a fusion plays two scenes, a boss joins the charms), each staying as near its own place as there is room for;
   fix = never moves (Centre Stage's lamps). A spot not booked for a frame is freed; when spots change, the others slide over. FXC = the fx instance drawing now. */
let FXC=null;
function fxRX(id,pref,w,g,fix){const A=FXC,x0=g.L+(g.R-g.L)*pref;if(!A)return x0;const o=A.rim[id]||(A.rim[id]={nw:1});o.pref=pref;o.w=w*(g.K||1);o.fix=fix;o.f=A.fr;return o.x==null?x0:o.x;}
function fxRimSolve(A,g,dt){const R=A.rim,L0=g.L+2,R0=g.R-2,it=[];for(const id in R){const o=R[id];if(o.f<A.fr-1){delete R[id];continue;}o.tx=g.L+(g.R-g.L)*o.pref;it.push(o);}if(!it.length)return;it.sort((a,b)=>a.tx-b.tx);
 for(let n=0;n<30;n++){for(let i=1;i<it.length;i++){const a=it[i-1],b=it[i],need=(a.w+b.w)/2+3-(b.tx-a.tx);if(need>0&&!(a.fix&&b.fix)){const ka=a.fix?0:b.fix?1:.5;a.tx-=need*ka;b.tx+=need*(1-ka);}}for(const o of it)if(!o.fix)o.tx=Math.max(L0+o.w/2,Math.min(R0-o.w/2,o.tx));}
 for(const o of it){if(o.nw||o.x==null){o.x=o.tx;o.nw=0;}else{const d=o.tx-o.x;o.x+=Math.sign(d)*Math.min(Math.abs(d),dt*140);}}}
const FXH={ivy:['wire','wall'],still:['tidy','low'],encore:'enc',headline:'enc',bonfire:'bon',cresc:'comic',chain:'comic',gfin:'comic',knock:'comic',wildfire:['hot','comic'],smoothie:'juicer',frenzy:'fry',zoo:'bowl',feast:['wfed','dbag'],hfund:'cint',mania:'heavy',allin:'dnoth',amph:['cstage','fshow'],hunter:'magpie'};
/* the rope of High Wire: the gold line, sagging under the walker, slack with nobody on it, twanging after a flip */
function fxRope(s,g,x){const P=g.P,sp=g.R-g.L,w=s.wx;let y=g.hy;if(s.onR)y+=2*P*(x<w?(x-g.L)/(w-g.L):(g.R-x)/(g.R-w));else y+=1.5*P*Math.sin(Math.PI*(x-g.L)/sp);if(s.tw>0)y+=Math.sin((x-g.L)/sp*Math.PI*5-s.tw*70)*s.tw/.5*1.5*P;return y;}
/* Full House's marquee bulbs, on the jar frame, clockwise from the top left */
function fxPer(g){const o=[],sg=(x0,y0,x1,y1)=>{const d=Math.hypot(x1-x0,y1-y0),n=Math.max(1,Math.round(d/27));for(let i=0;i<n;i++)o.push([x0+(x1-x0)*i/n,y0+(y1-y0)*i/n]);};const a=g.L+8,b=g.R-8,u=g.top-5,v=g.bot+3,lx=g.L-3,rx=g.R+3;sg(a,u,b,u);sg(rx,g.top+10,rx,g.bot-6);sg(b,v,a,v);sg(lx,g.bot-6,lx,g.top+10);return o;}
function fxBulb(c,x,y,B,lit){x=fq(x,B);y=fq(y,B);const R=(a,b,col,w=1,h=1)=>{c.fillStyle=FXP[col];c.fillRect(x+a*B,y+b*B,w*B,h*B);};
 if(lit){const a=c.globalAlpha;c.globalAlpha=a*.5;for(const[p,q]of[[3,0],[-3,0],[0,3],[0,-3],[2,2],[-2,2],[2,-2],[-2,-2]])R(p,q,lit>1?'w':'y');c.globalAlpha=a*.3;for(const[p,q]of[[4,0],[-4,0],[0,4],[0,-4]])R(p,q,'o');c.globalAlpha=a;}
 R(-1,-2,'k',3);R(-1,2,'k',3);R(-2,-1,'k',1,3);R(2,-1,'k',1,3);R(-1,-1,lit>1?'w':lit?'y':'D',3,3);R(0,0,lit>1?'w':lit?'h':'d');if(lit)R(-1,-1,'w');}
/* Old Oak: one tree per stage, built once per stage and sway (crown a cell over), in cells; it stands on the jar rim */
const OAKS=[{h:4,w:1,b:[[0,-6,2.4],[-2,-5,1.6],[2,-5,1.6]]},{h:8,w:2,b:[[0,-12,4],[-4,-10,3],[4,-10,3],[0,-15,3]]},{h:12,w:2,b:[[0,-19,6],[-6,-16,5],[6,-16,5],[-2,-24,4.5],[3,-23,4.5]]},{h:15,w:3,b:[[0,-25,8],[-8,-21,6],[8,-21,6],[-4,-31,6],[4,-30,6],[-12,-25,4],[12,-25,4]]}],OKC={};
function oakCv(sg,sw){const key=sg+'_'+sw;if(OKC[key])return OKC[key];const T=OAKS[sg],bl=T.b.map(([x,y,r])=>[x+sw,y,r]);let x0=-T.w-3,x1=T.w+3,y0=0;for(const[x,y,r]of bl){x0=Math.min(x0,Math.floor(x-r-1));x1=Math.max(x1,Math.ceil(x+r+1));y0=Math.min(y0,Math.floor(y-r-1));}const W=x1-x0+1,H=-y0+2,cv=document.createElement('canvas');cv.width=W;cv.height=H;const c=cv.getContext('2d'),ox=-x0,oy=H-1;
 const put=(x,y,col)=>{c.fillStyle=FXP[col];c.fillRect(x+ox,y+oy,1,1);};
 const tw=T.w;for(let y=0;y>=-T.h-2;y--){const fl=sg>=2&&y>-2?(y===0?2:1):0,a=-Math.ceil(tw/2)-fl,b=Math.floor((tw-1)/2)+fl;for(let x=a-1;x<=b+1;x++)put(x,y,x===a-1||x===b+1?'k':x<0?'E':(x*3+y)%4===0?'N':'n');}
 if(sg>=2)for(const d of[-1,1])for(let k=1;k<3+sg;k++){put(d*(Math.ceil(tw/2)+k),-T.h+1-k,'N');put(d*(Math.ceil(tw/2)+k),-T.h-k,'k');}
 const ins=(x,y)=>{for(let i=bl.length-1;i>=0;i--){const[bx,by,r]=bl[i];if((x-bx)**2+(y-by)**2<=r*r+r*.5)return i;}return -1;};
 for(let y=y0;y<=0;y++)for(let x=x0;x<=x1;x++){const i=ins(x,y);if(i<0)continue;if(ins(x+1,y)<0||ins(x-1,y)<0||ins(x,y+1)<0||ins(x,y-1)<0){put(x,y,'k');continue;}const[bx,by,r]=bl[i],lt=-((x-bx)*.6+(y-by)*.8)/r;let col=lt>.4?'l':lt<-.3?'G':'g';
  for(let j=0;j<bl.length;j++){if(j===i)continue;const[cx,cy,cr]=bl[j];if(j<i&&Math.abs(Math.hypot(x-cx,y-cy)-cr)<.7){col='G';break;}}
  const n=fhs(x,y);if(n<.1)col=col==='l'?'g':'G';else if(n>.92&&col==='g')col='l';put(x,y,col);}
 if(sg===3)for(const[x,y]of[[-5,-21],[4,-27],[8,-18],[-10,-25],[1,-33]]){put(x+sw,y,'N');put(x+sw,y+1,'E');}
 return OKC[key]={cv,ox,oy};}
/* Stage Fright: a tied-back curtain hanging from the top of the jar on one side; s.o = how far it is tied back */
function fxDrape(c,g,s,t,side){const P=g.P,jh=Math.floor((g.bot-g.top)/P),ty=Math.round(jh*.36),m=Math.round(s.o*4)/4,sw=s.on?fst(t,6):0,rp=s.fh>0?s.fh/.5:0,tl=ty+13;
 for(let j=0;j<=tl;j++){const op=j<=ty?3+13*Math.pow(1-j/ty,1.4):3+Math.min(5,(j-ty)*.7),ls=6;let w=Math.round(ls+(op-ls)*m);if(s.on&&j>4)w+=Math.round(Math.sin(sw*.9+j*.2)*.7);if(rp)w+=Math.round(Math.sin(j*.45-(1-rp)*28)*2*rp);if(j>tl-4)w=Math.max(2,w-(j-tl+4));
  for(let i=0;i<w;i++){const x=side<0?g.L+i*P:g.R-(i+1)*P,f=(i*2+Math.round(Math.sin(j*.13)*1.5)+70)%8;let col=i===w-1?'k':['z','R','R','r','r','q','r','R'][f];if(j===tl)col=i%2?'y':'Y';if(m>0&&(j===ty||j===ty+1))col=i===w-1?'k':j===ty?'y':'Y';fxR(c,x,g.top+j*P,P,col);}
  if(m>0&&j===ty+1){const x=side<0?g.L+(w-1)*P:g.R-w*P;fxR(c,x,g.top+(j+1)*P,P,'Y',1,3);fxR(c,x-P,g.top+(j+4)*P,P,'y',3,1);fxR(c,x-P,g.top+(j+5)*P,P,'Y',3,1);}}}
function fxHB(t){const u=(RMO?0:t)%.9;return u<.08?1:u<.16?.45:u<.26?.85:.3;} /* a heartbeat: lub-dub every 0.9 s */
const fxRim=g=>g.top-10; /* the top of the jar frame: the sky scenes stand on it */
const FXS={
 /* High Wire (and Climbing Ivy): a golden rope is the gold line. While the pile reaches it an acrobat walks it with a balance pole, otherwise waits on a platform. A merge it scores on: a flip */
 wire:{tick(s,g,dt){const P=g.P,pl=g.L+5*P,pr=g.R-5*P;if(s.wx==null){s.wx=pl;s.wd=1;}s.mv=0;
   if(s.on){s.wx+=s.wd*30*g.K*dt;s.mv=1;if(s.wx>pr-6*P)s.wd=-1;else if(s.wx<pl+6*P)s.wd=1;}
   else{const tx=s.wx-pl<pr-s.wx?pl:pr,d=tx-s.wx;if(Math.abs(d)>1.5){s.wd=Math.sign(d);s.wx+=s.wd*Math.min(Math.abs(d),42*g.K*dt);s.mv=1;}else s.wd=tx===pl?1:-1;}
   s.onR=s.wx>g.L+8*P&&s.wx<g.R-8*P;if(s.fl>0)s.fl-=dt;if(s.tw>0)s.tw-=dt;},
  back(c,g,s,t){const P=g.P;c.save();c.globalAlpha=s.p*(.5+.5*s.o);for(let x=g.L;x<g.R;x+=P){const y=fq(fxRope(s,g,x),P),i=Math.round(x/P);fxR(c,x,y-P,P,'k');fxR(c,x,y,P,i%3?'y':'h');fxR(c,x,y+P,P,i%3===2?'N':'Y');fxR(c,x,y+2*P,P,'k');}c.globalAlpha=s.p;
   if(s.l.ivy)for(let x=g.L,i=0;x<g.R;x+=P,i++){const ry=fq(fxRope(s,g,x),P),sv=Math.sin(i*.45),vy=ry+(sv>.35?-2:sv<-.35?3:sv>0?-1:2)*P;fxR(c,x,vy,P,'G');if(i%7===3){fxR(c,x,vy-P,P,'g');fxR(c,x+P,vy-P,P,'l');fxR(c,x+P,vy-2*P,P,'g');}if(i%19===9){const op=s.o>.5,fy=vy+(sv>0?-2:2)*P;for(const[a,b]of[[0,-1],[0,1],[-1,0],[1,0]])fxR(c,x+a*P,fy+b*P,P,op?'m':'G');if(op){for(const[a,b]of[[0,-2],[0,2],[-2,0],[2,0],[-1,-1],[1,1],[-1,1],[1,-1]])fxR(c,x+a*P,fy+b*P,P,'k');fxR(c,x,fy,P,'y');}else fxR(c,x,fy,P,'p');}}
   for(const d of[-1,1]){const x0=d<0?g.L:g.R-8*P;fxR(c,x0,g.hy,P,'k',8);fxR(c,x0,g.hy+P,P,'E',8);fxR(c,x0,g.hy+2*P,P,'N',8);fxR(c,x0,g.hy+3*P,P,'k',8);for(let k=0;k<5;k++)fxR(c,d<0?g.L+k*P:g.R-(k+1)*P,g.hy+(8-k)*P,P,'N');}c.restore();},
  front(c,g,s,t){const P=g.P;c.save();c.globalAlpha=s.p;let x=s.wx,y=s.onR?fxRope(s,g,x)-P:g.hy,fr='acS',rot=0,pole=1,a=0,py=0;
   if(s.mv)fr=['acW','acP','acW','acP'][fst(t,7)%4];
   if(s.on&&s.onR){const u=fst(t,8)/8;a=Math.round((Math.sin(u*2.1)*.16+Math.sin(u*5.3)*.06)/.05)*.05;}else if(!s.mv)py=fst(t,1.4)%2?-P:0;
   if(s.fl>0){const u=1-s.fl/.7;y-=Math.sin(u*Math.PI)*14*P;rot=(Math.min(3,Math.floor(u*4.6)))%4*(s.wd>0?1:-1);pole=!rot;fr='acS';}
   if(rot)fxS(c,fr,x,y-8*P,P,{ay:.5,r:rot,fl:s.wd<0});else fxS(c,fr,x,y,P,{fl:s.wd<0});
   if(pole){const hy=y-8*P+py,ca=Math.cos(a),sa=Math.sin(a),dx=ca*14*P,dy=sa*14*P;for(const k of[-1,1]){fxLn(c,x+k*2*P,y-9*P,x+k*ca*5*P,hy+k*sa*5*P,P,FXP.F);}fxLn(c,x-dx,hy-dy,x+dx,hy+dy,P,FXP.N);for(const k of[-1,1]){fxR(c,x+k*ca*5*P,hy+k*sa*5*P,P,'f');fxR(c,x+k*dx-P,hy+k*dy-P,P,'k',3,3);fxR(c,x+k*dx,hy+k*dy,P,'y');}}
   c.restore();},
  hit(s,o,A,g){if(s.fl>0||(o.src==='ivy'&&!s.on))return;s.fl=.7;s.tw=.5;const P=g.P;for(let k=0;k<6;k++)A.add({k:'star',x:s.wx+(Math.random()-.5)*20*P,y:g.hy-16*P-Math.random()*8*P,T:.55,dl:.15+k*.06,col:k%2?'o':'y'});}},
 /* Brinkmanship: while the pile is over the line, the line becomes hazard tape, warning signs bob at its ends and a red glow beats at the top of the jar. A merge it scores on: the tape flashes and throws sparks */
 brink:{tick(s,g,dt){if(s.fh>0)s.fh-=dt;},
  front(c,g,s,t){if(s.o<=0)return;const P=g.P,hb=fxHB(t),t0=fq(g.top,P);c.save();c.fillStyle=FXP.r;for(let j=0;j<24;j++){const d=Math.pow(1-j/24,1.3)*hb*s.o,y=t0+j*P;for(let x=g.L;x<g.R;x+=P){const i=Math.round(x/P),e=Math.min(1,d+(Math.min(i-g.L/P,g.R/P-i)<6?.25*hb:0));if(FBY[(i&3)*4+(j&3)]/16<e){c.globalAlpha=.42;c.fillRect(fq(x,P),y,P,P);}}}
   c.globalAlpha=Math.ceil(s.o*3)/3;const sc=fst(t,12),fl=s.fh>0&&fst(s.fh,20)%2===0;for(let x=g.L;x<g.R;x+=P){const i=Math.round(x/P),dy=Math.round(1.5*Math.sin(Math.PI*(x-g.L)/(g.R-g.L))),y0=t0-2*P+dy*P;for(let r=0;r<5;r++){const yy=Math.round(y0/P)+r;let col=r===0||r===4?'k':((i+yy+sc)%6<3?'y':'k');if(fl)col=r===0||r===4?'s':'w';fxR(c,x,yy*P,P,col);}}
   const b=fst(t,3)%2;fxS(c,'warn',g.L+6*P,t0-2*P-b*P,P);fxS(c,'warn',g.R-6*P,t0-2*P-(1-b)*P,P);c.restore();},
  hit(s,o,A,g){s.fh=.25;const P=g.P;A.burst(o.x,o.y,['r','y','o','w'],12,{v:220,vy:-90,T:.5,s:1});for(const x of[g.L+6*P,g.R-6*P])A.burst(x,g.top,['y','w','o'],8,{v:170,vy:-70,T:.45});}},
 /* Clean Plate (and Still Water): while the jar is nearly empty the floor is a willow-pattern plate, twinkles sit on the glass and a shine sweeps across it. A merge it scores on: a squeaky-clean twinkle */
 tidy:{spot(q,g){const P=g.P;q.x=g.L+(3+Math.random()*((g.R-g.L)/P-6))*P;q.y=g.top+(4+Math.random()*((g.bot-g.top)/P-12))*P;q.ph=-Math.random()*1.6;q.T=.8+Math.random()*.5;return q;},
  tick(s,g,dt){s.sp=s.sp||[];s.sw=(s.sw||0)+dt;if(s.on)while(s.sp.length<7)s.sp.push(FXS.tidy.spot({},g));for(const q of s.sp){q.ph+=dt;if(q.ph>=q.T){if(s.on)FXS.tidy.spot(q,g);else q.dead=1;}}s.sp=s.sp.filter(q=>!q.dead);},
  back(c,g,s,t){const P=g.P,b=fq(g.bot,P);c.save();c.globalAlpha=Math.ceil(s.o*3)/3;for(let x=g.L+P;x<g.R-P;x+=P){const i=Math.round(x/P),e=x<g.L+3*P||x>g.R-4*P;fxR(c,x,b-5*P,P,e?'.':'k');fxR(c,x,b-4*P,P,e?'k':'w');fxR(c,x,b-3*P,P,i%6<3?'B':'b');fxR(c,x,b-2*P,P,(i%6===1||i%6===4)?'B':'i');fxR(c,x,b-P,P,'j');}
   for(const q of s.sp)if(q.ph>0)fxStar(c,q.x,q.y,P,[0,1,2,3,2,1,0][Math.min(6,Math.floor(q.ph/q.T*7))],'b');c.restore();},
  front(c,g,s,t){const P=g.P,cy=3,u=(RMO?.5:(s.sw%cy))/.7;if(u>=1||s.o<=0)return;c.save();c.beginPath();c.rect(g.L,g.top,g.R-g.L,g.bot-g.top);c.clip();const H=g.bot-g.top,pos=g.L-H*.6+u*(g.R-g.L+H*.6+14*P);
   for(let y=g.top;y<g.bot;y+=P){const x=fq(pos+(g.top-y)*.6,P);c.globalAlpha=.5*s.o;c.fillStyle='#d6f1ff';c.fillRect(x,fq(y,P),5*P,P);c.globalAlpha=.75*s.o;c.fillStyle=FXP.w;c.fillRect(x+P,fq(y,P),2*P,P);c.globalAlpha=.45*s.o;c.fillStyle='#d6f1ff';c.fillRect(x+7*P,fq(y,P),P,P);}c.restore();},
  hit(s,o,A,g){if(o.src==='still'&&!s.on)return;const P=g.P;A.add({k:'star',x:o.x+(Math.random()-.5)*8*P,y:o.y-5*P,T:.55,col:'b'});A.add({k:'star',x:o.x+7*P,y:o.y+2*P,T:.45,dl:.12,col:'t'});A.add({k:'star',x:o.x-6*P,y:o.y+P,T:.4,dl:.2,col:'b'});}},
 /* Full House: while every charm slot is filled, marquee bulbs around the jar frame chase each other, lighting up one after another when it starts. A merge it scores on: every bulb flashes */
 crew:{tick(s,g,dt){if(s.fh>0)s.fh-=dt;},
  front(c,g,s,t){const pts=fxPer(g),n=pts.length,ch=fst(t,7),pw=Math.min(1,s.ton/.6);c.save();c.globalAlpha=s.p;pts.forEach(([x,y],i)=>{let lit=0;if(s.on)lit=s.ton<.6?(i<n*pw?1:0):((i+ch)%3===0?1:0);if(s.fh>0)lit=fst(s.fh,12)%2?2:1;fxBulb(c,x,y,3,lit);});c.restore();},
  hit(s){s.fh=.42;}},
 /* Stage Fright: velvet curtains frame the jar. While every tool is full they are tied back and footlights shine up the jar. A merge it scores on: the curtains ripple and the footlights flare */
 fright:{tick(s,g,dt){if(s.fh>0)s.fh-=dt;},
  front(c,g,s,t){const P=g.P;c.save();c.globalAlpha=s.p;const n=Math.max(3,Math.round((g.R-g.L)/64)),fl=s.fh>0?1+s.fh/.5*.7:1;
   for(let k=0;k<n;k++){const x=fq(g.L+(g.R-g.L)*(k+.5)/n,P);if(s.o>0){const H=Math.round(24*fl);for(let j=1;j<H;j++){const w=Math.round(1+j*.42),y=g.bot-j*P;for(let i=-w;i<=w;i++){const cx=Math.round(x/P)+i;if(FBY[(cx&3)*4+(j&3)]/16<(1-j/H)*.9){c.globalAlpha=s.p*Math.ceil(s.o*3)/3*(s.fh>0?.55:.35);c.fillStyle=FXP.y;c.fillRect(cx*P,fq(y,P),P,P);}}}c.globalAlpha=s.p;}
    const on=s.o>.5;fxR(c,x-3*P,g.bot,P,'k',7,2);fxR(c,x-2*P,g.bot-P,P,'k',5,1);fxR(c,x-P,g.bot-P,P,on?'h':'D',3,1);fxR(c,x-2*P,g.bot,P,on?'Y':'D',5,1);if(on)fxR(c,x,g.bot-P,P,'w');}
   fxDrape(c,g,s,t,-1);fxDrape(c,g,s,t,1);
   for(let x=g.L;x<g.R;x+=P){const i=Math.round((x-g.L)/P),d=1+Math.round(2.2*Math.sin(Math.PI*((i%10)+.5)/10));fxR(c,x,g.top,P,'k');fxR(c,x,g.top+P,P,'Y');for(let r=2;r<=3+d;r++)fxR(c,x,g.top+r*P,P,r===3+d?'y':(i%5<2?'R':i%5===4?'q':'r'));fxR(c,x,g.top+(4+d)*P,P,i%2?'Y':'k');if(i%10===0){fxR(c,x,g.top+(4+d)*P,P,'Y',1,2);fxR(c,x-P,g.top+(6+d)*P,P,'y',3,1);}}
   c.restore();},
  hit(s){s.fh=.5;}},
 /* Limelight: while its merges last the jar dims and a spotlight on the left wall follows the fruit you just dropped. A merge under it: the beam flares */
 lime:{tick(s,g,dt){const l=s.l;if(l.tx!=null&&!(s.mt>0)){if(s.tx==null||s.ton<.05){s.tx=l.tx;s.ty=l.ty;}s.tx+=(l.tx-s.tx)*Math.min(1,dt*9);s.ty+=(l.ty-s.ty)*Math.min(1,dt*9);s.tr=l.tr||20;}if(s.mt>0)s.mt-=dt;if(s.fh>0)s.fh-=dt;
   s.mo=s.mo||Array.from({length:16},()=>({x:Math.random(),y:Math.random(),v:.02+Math.random()*.04,p:Math.random()*6}));for(const m of s.mo){m.y-=m.v*dt;if(m.y<0)m.y+=1;}},
  front(c,g,s,t){if(s.o<=0||s.tx==null)return;const P=g.P,cw=Math.ceil((g.R-g.L)/P),ch=Math.ceil((g.bot-g.top)/P);if(!s.cv||s.cv.width!==cw||s.cv.height!==ch){s.cv=document.createElement('canvas');s.cv.width=cw;s.cv.height=ch;s.cx=s.cv.getContext('2d');s.im=s.cx.createImageData(cw,ch);}
   const st=s.on?s.ton:9,bOn=s.o>0&&(st>=.46||(st<.07)||(st>.15&&st<.22)||(st>.3&&st<.36)),dim=Math.ceil(Math.min(1,s.on?st/.25:1)*s.o*3)/3,lx=10.5,ly=13.5,tx=(s.tx-g.L)/P,ty=Math.max(2,(s.ty-g.top)/P),rr=Math.max(2,(s.tr*1.3+(s.fh>0?s.fh/.35*14:0))/P)*Math.min(1,s.o*1.5),dx=tx-lx,dy=ty-ly,dist=Math.max(1,Math.hypot(dx,dy)),ux=dx/dist,uy=dy/dist,tn=rr/dist,d=s.im.data;
   for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){const px=i+.5-lx,py=j+.5-ly,al=px*ux+py*uy,pe=Math.abs(px*uy-py*ux),cd=Math.hypot(i+.5-tx,j+.5-ty);let k=0;if(bOn){if((al>0&&al<dist&&pe<al*tn+.6)||cd<rr)k=2;else if((al>0&&al<dist+rr&&pe<al*tn+2)||cd<rr+1.4)k=(i+j)&1?2:0;}const o=(j*cw+i)*4;if(k){const pool=cd<rr;d[o]=255;d[o+1]=pool?226:236;d[o+2]=pool?120:170;d[o+3]=(pool?60:34)*dim;}else{d[o]=18;d[o+1]=10;d[o+2]=30;d[o+3]=118*dim;}}
   s.cx.putImageData(s.im,0,0);c.save();c.imageSmoothingEnabled=false;c.drawImage(s.cv,g.L,g.top,cw*P,ch*P);
   if(bOn)for(const m of s.mo){const i=Math.floor(m.x*cw),j=Math.floor(m.y*ch),px=i+.5-lx,py=j+.5-ly,al=px*ux+py*uy,pe=Math.abs(px*uy-py*ux);if((al>0&&al<dist&&pe<al*tn)||Math.hypot(i-tx,j-ty)<rr){c.globalAlpha=.6+.35*Math.sin(t*3+m.p);c.fillStyle=FXP.w;c.fillRect(g.L+(i+Math.round(Math.sin(t+m.p)))*P,g.top+j*P,P,P);}}
   c.globalAlpha=s.o;fxR(c,g.L,g.top+7*P,P,'k',4,1);fxR(c,g.L,g.top+8*P,P,'D',4,1);fxR(c,g.L,g.top+9*P,P,'k',4,1);fxR(c,g.L+3*P,g.top+8*P,P,'k',1,3);fxS(c,'lamp',g.L+8*P,g.top+16*P,P);if(bOn){c.globalAlpha=s.o*.6;fxR(c,g.L+12*P,g.top+12*P,P,'h');}c.restore();},
  hit(s,o,A,g){s.fh=.35;s.mt=.5;s.tx=o.x;s.ty=o.y;for(let k=0;k<5;k++){const a=k*Math.PI*2/5+.6;A.add({k:'star',x:o.x+Math.cos(a)*(s.tr||20)*1.5,y:o.y+Math.sin(a)*(s.tr||20)*1.5,T:.5,dl:k*.05,col:'y'});}}},
 /* Early Bird (and Marathon): a robin perches on the jar rim for the first drops, hops and turns to each fruit you drop, sings when it scores, and flies off when its drops are over */
 early:{tick(s,g,dt,A){const P=g.P,mar=s.l.mar,cs=A&&A.S.clutch,py=mar?fxRim(g)-32*P:fxRim(g);s.st=s.st||'gone';const px=mar?fq(((cs&&cs.cx)||g.L+(g.R-g.L)*.745)+9*P,P):s.on||s.st==='sit'||s.st==='in'?fxRX('early',.7,50,g):s.bx||g.R;s.ft=(s.ft||0)+dt;
   if(s.on&&(s.st==='gone'||s.st==='out')){s.st='in';s.ft=0;s.x0=g.W+30;s.y0=py-170;}if(!s.on&&(s.st==='sit'||s.st==='in')){s.st='out';s.ft=0;s.x0=s.bx;s.y0=s.by;}
   if(s.st==='in'){const u=Math.min(1,s.ft/1),e=1-(1-u)*(1-u);s.bx=s.x0+(px-s.x0)*e;s.by=s.y0+(py-s.y0)*e-Math.sin(u*Math.PI)*24;if(u>=1){s.st='sit';s.hop=.25;}}
   else if(s.st==='out'){const u=Math.min(1,s.ft/1.2);s.bx=s.x0-u*g.W*.8;s.by=s.y0-u*u*320-Math.sin(u*Math.PI)*20;if(u>=1)s.st='gone';}
   else if(s.st==='sit'){s.bx=px;s.by=py;}for(const k of['hop','sg'])if(s[k]>0)s[k]-=dt;},
  front(c,g,s,t){if(!s.st||s.st==='gone')return;const P=g.P;let fr='b0',y=s.by,fl=0;if(s.st!=='sit')fr=fst(t,12)%2?'bF0':'bF1';else{if(s.sg>0)fr=fst(s.sg,8)%2?'bS':'b0';else if((RMO?1:t%2.8)<.12)fr='bB';if(s.hop>0)y-=(s.hop>.12?2:1)*P;fl=s.lk&&s.hop>0?1:0;}c.save();c.globalAlpha=s.p;fxS(c,fr,s.bx,y,P,{fl});c.restore();},
  ev(s,n,o){if(n==='drop'&&s.st==='sit'){s.hop=.25;s.lk=o.x>s.bx;}},
  hit(s,o,A,g){if(s.st!=='sit')return;s.sg=.6;const P=g.P;for(let k=0;k<3;k++)A.add({k:'spr',sp:k%2?'nt2':'nt',x:s.bx-7*P,y:s.by-10*P,vx:-16-k*12,vy:-50,T:1.2,dl:k*.18,sw:6,sf:6,ph:k,fa:.55});}},
 /* Photo Finish (and Marathon): for the last drops a chequered flag runs up a pole on the rim and the bottom of the frame turns into a finish line. A merge it scores on: a camera flash, a viewfinder and a photo of the fruit */
 clutch:{tick(s,g,dt){if(s.fh>0)s.fh-=dt;s.cx=fxRX('clutch',.745,64,g);},
  back(c,g,s,t){if(s.o<=0)return;c.save();c.globalAlpha=Math.ceil(s.o*3)/3;const B=3;for(let x=g.L-6;x<g.R+6;x+=B)for(let r=0;r<3;r++)fxR(c,x,g.bot-B+r*B,B,((Math.round(x/B)+r)&1)?'k':'w');c.restore();},
  front(c,g,s,t){const P=g.P,px=fq((s.cx||g.L+(g.R-g.L)*.745)+9*P,P),base=fxRim(g),ph=30;c.save();c.globalAlpha=s.p;fxR(c,px-2*P,base-P,P,'k',5,1);fxR(c,px-P,base-2*P,P,'D',3,1);for(let j=2;j<ph;j++){fxR(c,px-P,base-(j+1)*P,P,'k');fxR(c,px,base-(j+1)*P,P,j%6===0?'s':'d');fxR(c,px+P,base-(j+1)*P,P,'k');}fxR(c,px-P,base-(ph+2)*P,P,'k',3,3);fxR(c,px,base-(ph+1)*P,P,'y');
   const fh=11,fw=16,fy=base-ph*P+Math.round((1-s.o)*(ph-fh-3))*P,wv=fst(t,8);for(let ci=0;ci<fw;ci++){const amp=(ci/(fw-1))*1.3+.2,dy=Math.round(Math.sin(ci*.6-wv*.9)*amp),dn=Math.round(Math.sin((ci+1)*.6-wv*.9)*((ci+1)/(fw-1)*1.3+.2)),sh=dn>dy;for(let rj=-1;rj<=fh;rj++){const x=px-(ci+2)*P,y=fy+(rj+dy)*P;if(rj<0||rj===fh||ci===fw-1){fxR(c,x,y,P,'k');continue;}const b=((ci>>1)+(rj>>1))&1;fxR(c,x,y,P,b?(sh?'x':'k'):(sh?'s':'w'));}}c.restore();
   if(s.fh>0){c.save();c.globalAlpha=s.fh>.09?.55:.22;c.fillStyle='#fff';c.fillRect(-20,-20,g.W+40,g.H+40);c.restore();}},
  hit(s,o,A,g){s.fh=.16;const P=g.P,r=Math.max(16,o.r||20);A.add({k:'fn',x:o.x,y:o.y,T:.5,fa:.7,d:(c,q,g)=>{const z=r*(1.8-.6*Math.min(1,Math.floor(q.t/.06)/3)),Ln=5*P;for(const[col,o2]of[['k',P],['w',0]]){c.fillStyle=FXP[col];for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]]){const x=fq(q.x+a*z,P)+o2,y=fq(q.y+b*z,P)+o2;c.fillRect(a<0?x:x-Ln+P,y,Ln,P);c.fillRect(x,b<0?y:y-Ln+P,P,Ln);}}}});
   A.add({k:'fn',x:o.x,y:o.y,vx:-40,vy:-90,dr:1.4,T:1.4,dl:.2,fa:.6,d:(c,q,g,t,x)=>{const B=3,w=14*B,h=17*B,x0=fq(x-w/2,B),y0=fq(q.y-h/2,B);c.fillStyle=FXP.k;c.fillRect(x0-B,y0-B,w+2*B,h+2*B);c.fillStyle=FXP.w;c.fillRect(x0,y0,w,h);c.fillStyle=FXP.x;c.fillRect(x0+2*B,y0+2*B,w-4*B,w-4*B);if(o.l!=null&&typeof drawFruit==='function')drawFruit(c,x0+w/2,y0+2*B+(w-4*B)/2,(w-4*B)*.36,o.l);c.fillStyle=FXP.s;c.fillRect(x0+3*B,y0+h-3*B,w-6*B,B);}});}},
 /* Encore (and Headliner): after a tool use, a pair of hands claps up from each bottom corner. The merge it scores on: roses are thrown onto the fruit and the hands burst into applause */
 enc:{tick(s,g,dt){if(s.ap>0)s.ap-=dt;s.h=fxA(s.h||0,(s.on||s.ap>0)?1:0,dt*5);},
  front(c,g,s,t){if(!(s.h>0))return;const P=g.P,fast=s.ap>0,u=(RMO?.5:t)%.9,ph=fast?fst(t,14)%3:(u<.06?2:u<.12?1:(u>.2&&u<.26)?2:(u>.26&&u<.32)?1:0),gap=[6,3,0][ph],y=g.bot+5+Math.round((1-s.h)*12)*P;c.save();c.globalAlpha=s.p;
   for(const cx of[g.L+14*P,g.R-14*P]){const gp=[6,2,-2][ph],ly=ph===2?-P:0; /* white gloves, palms facing, thumbs on the inside (like a helping hand): they meet palm to palm, overlapping a cell on the clap */fxS(c,'hg',cx-gp/2*P,y+ly,P,{ax:1});fxS(c,'hg',cx+gp/2*P,y+ly,P,{ax:1,fl:1});if(ph===2)for(const[a,b]of[[-6,-15],[-3,-17],[2,-17],[5,-15]]){fxR(c,cx+a*P,y+b*P,P,'k');fxR(c,cx+a*P,y+(b-1)*P,P,'y');}}c.restore();},
  hit(s,o,A,g){s.ap=1.1;const P=g.P;for(const x0 of[g.L+14*P,g.R-14*P])for(let k=0;k<3;k++){const T=.5+k*.07,x=x0,y=g.bot-12*P,tx=o.x+(k-1)*5*P,ty=o.y,gr=900;A.add({k:'spr',sp:'rose',x,y,vx:(tx-x)/T,vy:(ty-y-.5*gr*T*T)/T,g:gr,T,dl:k*.08,spin:10,fa:.95,end:(A)=>{A.burst(tx,ty,['p','m','r','q'],6,{v:120,vy:-60,T:.55,g:250});}});}}},
 /* Bonfire: while its merges last, flames burn along the jar floor and three logs sit on the frame, one burning to ash with each merge it scores on */
 bon:{tick(s,g,dt,A){const n=Math.min(3,s.l.n||0);s.r=fxA(s.r||0,[0,.7,1.15,1.7][n],dt*2.5);s.n=n;if(n>0&&!RMO&&Math.random()<dt*n*5)A.add({k:'sq',x:g.L+Math.random()*(g.R-g.L),y:g.bot-10,vx:(Math.random()-.5)*20,vy:-60-Math.random()*60,T:1.4+Math.random(),col:Math.random()<.5?'o':'y',sw:4,sf:4,ph:Math.random()*6,fa:.4});},
  front(c,g,s,t){if((s.r||0)<.03)return;const P=g.P;c.save();c.globalAlpha=s.p;flm(c,g.L,g.bot,g.R-g.L,s.r,t,P,1.25);const cx=(g.L+g.R)/2;for(let k=0;k<3;k++)fxS(c,k<s.n?'log':'loga',cx+(k-1)*9*P,g.bot+7,P);c.restore();},
  hit(s,o,A,g){A.burst(o.x,o.y,['o','y','r','h'],16,{v:160,vy:-120,g:-140,T:.65});A.burst((g.L+g.R)/2+((s.n||1)-2)*9*g.P,g.bot,['d','s','D'],7,{v:40,vy:-60,g:-30,T:.8,s:2});}},
 /* Old Oak: an oak on the jar rim grows in four stages as the charm grows. Every size 7+ it scores: the tree rustles and leaves and an acorn fall into the jar. A new stage: it bursts into the bigger tree */
 oak:{tick(s,g,dt,A){const v=s.l.v||0,sg=v<.12?0:v<.3?1:v<.6?2:3;if(s.sg==null)s.sg=sg;if(sg>s.sg){s.gw=.5;s.sg=sg;FXS.oak.leaf(s,g,A,10);}else if(sg<s.sg)s.sg=sg;for(const k of['gw','rs'])if(s[k]>0)s[k]-=dt;s.lt=(s.lt==null?2:s.lt)-dt;if(s.lt<=0&&s.p>.5&&!RMO){s.lt=3+Math.random()*4;FXS.oak.leaf(s,g,A,1);}},
  x0(g){return fq(fxRX('oak',.13,70,g),g.P);},
  pos(s,g){const P=g.P,b=OAKS[s.sg||0].b[0];return[FXS.oak.x0(g)+b[0]*P,fxRim(g)+b[1]*P,b[2]*P];},
  leaf(s,g,A,n){const[x,y,r]=FXS.oak.pos(s,g);for(let k=0;k<n;k++)A.add({k:'sq',x:x+(Math.random()-.5)*r*1.8,y:y+(Math.random()-.3)*r,vx:(Math.random()-.5)*30+12,vy:22+Math.random()*25,T:3+Math.random()*1.5,col:['g','l','G','Y'][k%4],sw:9,sf:2+Math.random(),ph:Math.random()*6,fa:.75});},
  front(c,g,s,t){const P=g.P,sw=fst(t,1.3)%2,sk=s.rs>0?(fst(t,16)%2?1:-1):0,o=oakCv(s.sg||0,sw),x0=FXS.oak.x0(g),dx=fq(x0+sk*P-o.ox*P,P),dy=fq(fxRim(g)-o.oy*P,P),w=o.cv.width*P,h=o.cv.height*P;c.save();c.imageSmoothingEnabled=false;c.globalAlpha=s.p;c.drawImage(o.cv,dx,dy,w,h);if(s.gw>0&&fst(s.gw,14)%2){c.globalCompositeOperation='lighter';c.drawImage(o.cv,dx,dy,w,h);c.drawImage(o.cv,dx,dy,w,h);}c.restore();},
  ev(s,n,o,A,g){if(n==='grow'&&o.id==='oak'&&s.p>0)FXS.oak.grow(s,o,A,g);},
  grow(s,o,A,g){s.rs=.42;FXS.oak.leaf(s,g,A,5);const[x,y,r]=FXS.oak.pos(s,g);A.add({k:'spr',sp:'acn',x:x+(Math.random()-.5)*r,y:y+r*.4,vx:20,vy:-80,g:700,T:1.5,fa:.75});}},
 /* Tiki Bar: a totem on the jar rim with one carved face for every Pineapple merge it has grown on, torches lit on top. A new face drops onto the stack with a puff of dust */
 tiki:{tick(s,g,dt,A){const n=Math.round((s.l.v||0)/.25);if(s.n==null)s.n=n;if(n>s.n){s.dr=.45;s.n=n;}else if(n<s.n)s.n=n;if(s.dr>0){s.dr-=dt;if(s.dr<=0){A.burst(FXS.tiki.x0(g),FXS.tiki.ty(s,g)+9*g.P,['E','s','c','n'],12,{v:100,vy:-30,g:260,T:.5,w:30});s.fl=.6;}}if(s.fl>0)s.fl-=dt;},
  x0(g){return fq(fxRX('tiki',.87,40,g),g.P);},
  cap(g){return Math.max(1,Math.floor((fxRim(g)-110)/(9*g.P)));},
  ty(s,g){return fxRim(g)-2*g.P-Math.min(s.n||0,FXS.tiki.cap(g))*9*g.P;},
  front(c,g,s,t){const P=g.P,x0=FXS.tiki.x0(g),rim=fxRim(g),k=Math.min(s.n||0,FXS.tiki.cap(g)),drop=s.dr>0?Math.round(Math.pow(s.dr/.45,2)*34)*P:0;c.save();c.globalAlpha=s.p;fxR(c,x0-7*P,rim-2*P,P,'k',13,2);fxR(c,x0-6*P,rim-2*P,P,'e',11,1);
   for(let i=0;i<k;i++){let y=rim-2*P-i*9*P;if(i===k-1)y-=drop;fxS(c,'tk'+(i%3),x0,y,P);}
   const ty=rim-2*P-k*9*P-(k?drop:0),fb=s.fl>0?2:0;for(const d of[-5,3]){ /* the faces span cells -6..4 of x0 (an odd width rounds left), so the torches sit at their centre -1 ± 4 */fxR(c,x0+(d-1)*P,ty-6*P,P,'k',3,6);fxR(c,x0+d*P,ty-6*P,P,'E',1,6);fxR(c,x0+(d-1)*P,ty-7*P,P,'k',3,1);if(k>0){const f=fst(t,7+Math.abs(d)/2),h=4+fb+(f%3===1?1:0),sw=f%4===1?1:f%4===3?-1:0;for(let j=0;j<h;j++){const y=ty-(8+j)*P;if(j<h-2){const dx=j>=h-3?sw:0;fxR(c,x0+(d-1+dx)*P,y,P,j===0?'r':'o');fxR(c,x0+(d+dx)*P,y,P,j===0?'o':'y');fxR(c,x0+(d+1+dx)*P,y,P,j===0?'r':'o');}else fxR(c,x0+(d+sw)*P,y,P,j===h-1?'h':'y');}if(f%5===0)fxR(c,x0+(d+(f%10?1:-1))*P,ty-(10+h)*P,P,'y');}}c.restore();},
  ev(s,n,o){if(n==='grow'&&o.id==='tiki')s.fl=.5;}},
 /* Snowball: a snowball sits on the rim, as big as the charm has grown. At the start of a jar after it grew it rolls along the rim picking up snow, and snow falls in the jar */
 snow:{sr(n){return Math.min(12,4+n*.8);},
  tick(s,g,dt,A){const n=Math.round((s.l.v||0)/.04);s.n=n;if(s.sn==null)s.sn=n;if(s.ro>0){s.ro-=dt;const u=1-Math.max(0,s.ro)/1.6,e=1-Math.pow(1-u,2.2);s.rd=s.r0+(FXS.snow.sr(n)-s.r0)*e;if(!RMO&&Math.random()<dt*36)A.add({k:'sq',x:s.bx+s.rd*g.P*.9,y:fxRim(g)-3,vx:30+Math.random()*30,vy:-50-Math.random()*50,g:300,T:.55,col:Math.random()<.5?'w':'j'});}else s.rd=FXS.snow.sr(n);
   if(s.fall>0){s.fall-=dt;if(Math.random()<dt*16)A.add({k:'sq',x:g.L+Math.random()*(g.R-g.L),y:fxRim(g)-80*Math.random(),vy:30+Math.random()*20,T:4,col:Math.random()<.6?'w':'j',sw:7,sf:1.5+Math.random(),ph:Math.random()*6,fa:.8});}s.gl=(s.gl||0)+dt;},
  roll(s,from){s.r0=FXS.snow.sr(Math.max(0,from==null?s.n-1:from));s.ro=1.6;s.fall=2.8;},
  front(c,g,s,t){const P=g.P,r=Math.round(s.rd||4),rest=fq(fxRX('snow',.37,(2*r+3)*P/(g.K||1),g),P),from=fq(g.R-(g.R-g.L)*.3,P),u=s.ro>0?1-s.ro/1.6:1,e=1-Math.pow(1-u,2.2),cx=fq(from+(rest-from)*e,P),cy=fq(fxRim(g)-(r+1)*P,P),ang=s.ro>0?-(from-cx)/(r*P):0;c.save();c.globalAlpha=s.p;s.bx=cx;
   const R2=r*r+r*.6;for(let j=-r-1;j<=r+1;j++)for(let i=-r-1;i<=r+1;i++){const d=i*i+j*j;if(d>R2)continue;const edge=(i+1)**2+j*j>R2||(i-1)**2+j*j>R2||i*i+(j+1)**2>R2||i*i+(j-1)**2>R2,l=(i*.6+j*.8)/r;fxR(c,cx+i*P,cy+j*P,P,edge?'k':l>.55?'j':l>.15?'i':'w');}
   for(let k=0;k<6;k++){const a=k*1.05+ang,rr=r*(.3+.13*(k%3));const x=Math.round(Math.cos(a)*rr),y=Math.round(Math.sin(a)*rr);if(x*x+y*y<r*r*.7)fxR(c,cx+x*P,cy+y*P,P,'j');}
   if(!RMO&&(s.gl%3.5)<.45)fxStar(c,cx-Math.round(r*.45)*P,cy-Math.round(r*.55)*P,P,[0,1,2,1][Math.min(3,Math.floor((s.gl%3.5)/.45*4))],'b');c.restore();},
  ev(s,n,o){if(n==='grow'&&o.id==='snow'){FXS.snow.roll(s);return;}if(n==='jar'&&s.l&&s.l.p){const m=Math.round((s.l.v||0)/.04);if(s.sn!=null&&m>s.sn)FXS.snow.roll(s,s.sn);s.sn=m;}},
  }};
/* ---------- batch 2 (v1.76): scenes that take over the jar, and merges that look different ---------- */
/* a word in the score pop-up font (PXF, strokes thickened like the pop-ups), filled fc with a black outline and drop shadow, one cell per font pixel */
function fxWord(s,fc){const g=[...s].map(ch=>PXF[ch]||PXF[' ']),W=g.length*7+3,H=10,m=Array.from({length:H},()=>new Array(W).fill(0));g.forEach((gl,i)=>{const bd=PXFB&&PXFB[s[i]],rows=(bd||gl).split('/');rows.forEach((r,y)=>{for(let x=0;x<r.length;x++)if(r[x]==='#'){m[y+1][i*7+x+1]=1;if(!bd)m[y+1][i*7+x+2]=1;}});});
 const cv=document.createElement('canvas');cv.width=W+1;cv.height=H+1;const c=cv.getContext('2d'),on=(x,y)=>y>=0&&y<H&&x>=0&&x<W&&m[y][x];c.fillStyle=FXP.k;for(let y=0;y<=H;y++)for(let x=0;x<=W;x++){if(on(x,y))continue;let n=0;for(let a=-1;a<=1;a++)for(let b=-1;b<=1;b++)if(on(x+a,y+b)||on(x+a-1,y+b-1))n=1;if(n)c.fillRect(x,y,1,1);}c.fillStyle=FXP[fc];for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(m[y][x])c.fillRect(x,y,1,1);return cv;}
/* hard pixel edges: alpha snapped to 0 or 255 after anti-aliased drawing (rotated words, polygons) */
function fxHard(cv){const c=cv.getContext('2d'),im=c.getImageData(0,0,cv.width,cv.height),d=im.data;for(let i=3;i<d.length;i+=4)d[i]=d[i]>110?255:0;c.putImageData(im,0,0);return cv;}
/* a comic burst: jagged star in a loud colour, black outline, a lighter core with halftone dots, the word slapped across it at an angle */
const FXCB=[['r','q'],['o','y'],['y','h'],['g','l'],['b','i'],['m','p'],['P','i']];
function fxBurst(word,R,ang,seed,ws=2){const pr=FXCB[seed%FXCB.length],wc=fxWord(word,pr[0]==='y'||pr[0]==='l'?'w':'y'),S=Math.ceil(Math.max(2*R+6,wc.width*ws*1.15+8)),cv=document.createElement('canvas');cv.width=cv.height=S;const c=cv.getContext('2d'),o=S/2,n=13,pts=[];for(let i=0;i<n*2;i++){const a=i*Math.PI/n+seed*.37,r=i%2?R*(.55+.12*fhs(seed,i)):R*(.85+.3*fhs(i,seed));pts.push([Math.cos(a)*r,Math.sin(a)*r]);}
 const poly=(k,col)=>{c.fillStyle=FXP[col];c.beginPath();pts.forEach(([x,y],i)=>c[i?'lineTo':'moveTo'](o+x*k,o+y*k));c.closePath();c.fill();};poly(1.12,'k');poly(1,pr[0]);poly(.62,pr[1]);fxHard(cv);
 c.fillStyle=FXP[pr[0]];for(let y=0;y<S;y+=3)for(let x=(y/3)%2?1:0;x<S;x+=3){const d=Math.hypot(x-o,y-o);if(d<R*.5&&d>R*.18)c.fillRect(x,y,1,1);}
 c.save();c.translate(o,o);c.rotate(ang);c.imageSmoothingEnabled=false;c.drawImage(wc,-wc.width*ws/2,-wc.height*ws/2,wc.width*ws,wc.height*ws);c.restore();return fxHard(cv);}
const FXW=[['POW!','BAM!','ZOK!','SOK!','ZAP!'],['WHAM!','BLAM!','BIFF!','SOCK!'],['KAPOW!','KABAM!','THWAK!']];
function fxBub(c,q,g){const P=g.P;if(q.y<q.sy)return;fxR(c,q.x-P,q.y,P,'b');fxR(c,q.x+P,q.y,P,'b');fxR(c,q.x,q.y-P,P,'b');fxR(c,q.x,q.y+P,P,'b');fxR(c,q.x,q.y,P,'w');}
function fxDie(c,x,y,P,f,r){x=fq(x,P);y=fq(y,P);c.save();c.translate(x,y);c.rotate(r*Math.PI/2);const R=(a,b,col,w=1,h=1)=>{c.fillStyle=FXP[col];c.fillRect(a*P,b*P,w*P,h*P);};R(-5,-6,'k',10,12);R(-6,-5,'k',12,10);R(-5,-5,'w',10,10);R(-5,3,'s',10,2);R(3,-5,'s',2,10);R(-5,-5,'w',8,8);R(4,4,'d');const pp={1:[[0,0]],2:[[-3,-3],[3,3]],3:[[-3,-3],[0,0],[3,3]],4:[[-3,-3],[3,-3],[-3,3],[3,3]],5:[[-3,-3],[3,-3],[0,0],[-3,3],[3,3]],6:[[-3,-3],[3,-3],[-3,0],[3,0],[-3,3],[3,3]]}[f];for(const[a,b]of pp)R(a-1,b-1,f===1?'r':'k',2,2);c.restore();}
function fxCoin(c,x,y,P,w,tl,h=7){x=fq(x,P);y=fq(y,P);for(let j=-h;j<=h;j++){const hw=Math.max(0,Math.round(w*Math.sqrt(1-(j/(h+.5))**2)));for(let i=-hw;i<=hw;i++){const e=Math.abs(i)===hw||Math.abs(j)===h||(Math.abs(i)===hw-1&&Math.abs(j)>=h-1),rim=Math.abs(i)>=hw-1||Math.abs(j)>=h-1,st=w>=5&&((i===0&&Math.abs(j)<=3)||(j===0&&Math.abs(i)<=3)||(Math.abs(i)===1&&Math.abs(j)===1));fxR(c,x+i*P,y+j*P,P,e?'k':tl?(st?'D':rim?'d':'s'):(st?'Y':rim?'Y':(i<0&&j<0?'h':'y')));}}}
Object.assign(FXS,{
 /* Low Tide: the bottom third of the jar is under water: a rippling surface, a blue tint, bubbles rising. A merge it scores on (down there): bubbles burst up and the surface ripples */
 low:{surf(g){return g.bot-(g.bot-g.top)/3;},
  tick(s,g,dt,A){const sy=FXS.low.surf(g);s.rp=(s.rp||[]).filter(r=>(r.t+=dt)<1);s.cl=fxA(s.cl||0,s.l.st&&s.l.calm?1:0,dt*2);if(!RMO&&s.p>0&&Math.random()<dt*(s.l.st?.7:2.5))A.add({k:'fn',x:g.L+Math.random()*(g.R-g.L),y:g.bot-6,vy:-30-Math.random()*25,T:(g.bot-sy)/30,sy,sw:3,sf:3,ph:Math.random()*6,fa:.95,d:fxBub});},
  front(c,g,s,t){const P=g.P,sy=fq(FXS.low.surf(g),P),wv=fst(t,8);c.save();c.globalAlpha=.17*s.p;c.fillStyle=FXP.b;c.fillRect(g.L,sy,g.R-g.L,g.bot-sy);
   for(let x=g.L;x<g.R;x+=P){const i=Math.round(x/P);let dy=Math.sin(i*.28+wv*.7)*(s.l.st?0:.9);for(const r of s.rp)dy+=Math.sin((x-r.x)*.12-r.t*18)*2.4*(1-r.t)*Math.exp(-Math.abs(x-r.x)/70);dy=Math.round(dy);c.globalAlpha=s.p;fxR(c,x,sy+dy*P-P,P,(i+wv)%9===0?'w':'b');c.globalAlpha=s.p*.85;fxR(c,x,sy+dy*P,P,'B');c.globalAlpha=s.p*.35;for(let j=1;j<5;j++)if(FBY[(i&3)*4+(j&3)]/16<.6-j*.12)fxR(c,x,sy+(dy+j)*P,P,'B');}
   if(s.l.st){c.globalAlpha=s.p;const sh=fst(t,6)%40;for(let k=0;k<4;k++)fxR(c,g.L+(sh*3+k)*P,sy-P,P,'w');for(const[f0,ph]of[[.2,0],[.55,2],[.84,4]]){const px=fq(g.L+(g.R-g.L)*f0+Math.round(Math.sin(t*.35+ph)*2)*P,P),m=new Map();for(let i=-3;i<=3;i++){m.set(i+',0',Math.abs(i)===3?'G':'g');if(Math.abs(i)<3&&i!==0)m.set(i+',-1',i>0?'G':'g');}const cl=s.cl||0;if(cl>.6){m.set('0,-2','y');m.set('-1,-2','p');m.set('1,-2','p');m.set('0,-3','p');m.set('-1,-3','m');m.set('1,-3','m');m.set('-2,-2','m');m.set('2,-2','m');}else if(cl>.15){m.set('0,-2','p');m.set('0,-3','m');}fxBlob(c,px,sy-P,P,m);}}c.restore();},
  hit(s,o,A,g){const sy=FXS.low.surf(g);if(o.src==='still'&&o.y<sy)return;s.rp.push({x:o.x,t:0});for(let k=0;k<7;k++)A.add({k:'fn',x:o.x+(Math.random()-.5)*(o.r||20),y:o.y,vy:-60-Math.random()*40,T:Math.max(.3,(o.y-sy)/70),sy,sw:4,sf:5,ph:k,fa:.95,d:fxBub});}},
 /* Floor Show: a light-up dance floor along the bottom and mirror-ball spots sweeping the glass. A merge on the floor: the tiles under it flash */
 fshow:{tick(s,g,dt){if(s.fh>0)s.fh-=dt;if(s.dm>0)s.dm-=dt;},
  back(c,g,s,t){const P=g.P,cols=['m','y','t','P','b','o'],dm=s.dm>0?Math.min(1,s.dm/.3,(1.4-s.dm)/.2):0;c.save();c.beginPath();c.rect(g.L,g.top,g.R-g.L,g.bot-g.top);c.clip();if(dm>0){c.globalAlpha=.32*dm;c.fillStyle=FXP.x;c.fillRect(g.L,g.top,g.R-g.L,g.bot-g.top);}const sp=dm>0?2.2:.5,n=dm>0?22:12;for(let k=0;k<n;k++){const a=(RMO?0:t)*sp+k*.53,x=(g.L+g.R)/2+Math.cos(a+k)*(g.R-g.L)*.45*fhs(k,1)+Math.sin(a*1.7)*20,y=g.top+(g.bot-g.top)*(.15+.6*fhs(k,2))+Math.sin(a*1.3+k)*30;c.globalAlpha=s.p*(dm>0?.9:.6);const z=dm>0?3:2;fxR(c,x,y-P,P,cols[k%6],z,1);fxR(c,x-P,y,P,cols[k%6],z+2,z-1);fxR(c,x,y+(z-1)*P,P,cols[k%6],z,1);}c.restore();
   const bx=fq(g.L+(g.R-g.L)*.8,P),by=fq(g.top+9*P,P),f=fst(t,6);c.save();c.globalAlpha=s.p;fxR(c,bx,g.top,P,'D',1,4);for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const d=i*i+j*j;if(d>18)continue;const e=d>12,fc=(i+j+f)%3;fxR(c,bx+i*P,by+j*P,P,e?'k':fc===0?'w':fc===1?'s':(i<0&&j<0?'b':'d'));}c.restore();},
  front(c,g,s,t){const P=g.P,b=fq(g.bot,P),cols=['m','y','t','P'],st=fst(t,4),tw=6;c.save();c.globalAlpha=s.p;for(let x=g.L,ti=0;x<g.R;x+=tw*P,ti++){const w=Math.min(tw,Math.round((g.R-x)/P)),near=s.fh>0&&Math.abs(x+tw*P/2-s.fx)<tw*P*1.5,lit=(ti+st)%2,col=near?(fst(s.fh,14)%2?'w':'h'):lit?cols[(ti+(st>>1))%4]:'x';fxR(c,x,b-3*P,P,'k',w,1);fxR(c,x,b-2*P,P,col,w,2);fxR(c,x,b-2*P,P,'k',1,2);if(lit||near)fxR(c,x+P,b-2*P,P,'w');}c.restore();},
  hit(s,o,A,g){if(o.src==='amph'&&o.y+(o.r||0)<g.bot-6)return;s.fh=.4;s.fx=o.x;s.dm=1.4;}},
 /* Hot Streak: the jar heats up with every merge this jar: a warm glow rises from the floor, the air shimmers, then embers fly. Every merge: a puff of heat */
 hot:{tick(s,g,dt,A){const n=s.l.v||0,st=n<5?0:n<10?1:n<15?2:3;if(s.st!=null&&st>s.st)s.fl=.45;s.st=st;s.h=fxA(s.h||0,[0,.24,.44,.64][st],dt*.8);if(s.fl>0)s.fl-=dt;if(st>=3&&!RMO&&Math.random()<dt*8)A.add({k:'sq',x:g.L+Math.random()*(g.R-g.L),y:g.bot-4,vx:(Math.random()-.5)*20,vy:-70-Math.random()*60,T:1.6,col:Math.random()<.5?'o':'y',sw:5,sf:4,ph:Math.random()*6,fa:.4});},
  front(c,g,s,t){if(!(s.h>0))return;const P=g.P,H=(g.bot-g.top)*s.h,rows=Math.ceil(H/P),fl=s.fl>0?.25:0;c.save();for(let j=0;j<rows;j++){const y=fq(g.bot,P)-(j+1)*P,d=Math.pow(1-j/rows,1.4)*.75+fl;for(let x=g.L;x<g.R;x+=P){const i=Math.round(x/P);if(FBY[(i&3)*4+(j&3)]/16<d){c.globalAlpha=s.p*.24;fxR(c,x,y,P,j<rows*.35?'r':'o');}}}
   if(s.st>=2){c.globalAlpha=s.p*.3;for(let k=0;k<6;k++){const x0=g.L+(g.R-g.L)*(k+.5)/6;for(let j=0;j<rows*.8;j+=2){const y=fq(g.bot,P)-j*P,dx=Math.round(Math.sin(j*.35+fst(t,8)*.9+k*2)*1.5);fxR(c,x0+dx*P,y,P,'o');}}}c.restore();},
  hit(s,o,A){if((s.l.v||0)<3)return;A.burst(o.x,o.y,['o','y'],3,{v:60,vy:-70,g:-60,T:.5});}},
 /* Slow Cook: while you hold a fruit, steam rises off it and a glow builds under it, up to the most it can give (4 seconds), then a ding. Merges it scored on puff steam */
 slow:{tick(s,g,dt,A){const l=s.l,w=l.w||0,k=s.on?Math.max(0,Math.min(1,(w-.4)/3.6)):0;s.k=k;if(k<1)s.dg=0;else if(!s.dg){s.dg=1;for(let i=0;i<6;i++){const a=i*Math.PI/3;A.add({k:'star',x:l.hx+Math.cos(a)*l.hr*1.6,y:l.hy+Math.sin(a)*l.hr*1.6,T:.5,dl:i*.04,col:'o'});}}
   if(k>0&&!RMO&&Math.random()<dt*(2+k*7))FXS.slow.wisp(A,l.hx+(Math.random()-.5)*l.hr,l.hy-l.hr*.8,1);},
  wisp(A,x,y,sc){A.add({k:'fn',x,y,vy:-26*sc-Math.random()*14,T:1.3,ph:Math.random()*6,fa:.35,d:(c,q,g,t)=>{const P=g.P;for(let j=0;j<6;j++){const dx=Math.round(Math.sin(q.t*3+q.ph+j*.8)*1.6);fxR(c,q.x+dx*P-P,q.y-j*P,P,'d');fxR(c,q.x+dx*P,q.y-j*P,P,'w',1,1);fxR(c,q.x+dx*P+P,q.y-j*P,P,'d');}}});},
  front(c,g,s,t){if(!(s.k>0))return;const l=s.l,P=g.P,r=l.hr+3*P;c.save();for(let j=-2;j<=2;j++)for(let i=-Math.round(r/P);i<=Math.round(r/P);i++){const d=1-Math.abs(i*P)/r;if(FBY[((i+40)&3)*4+((j+4)&3)]/16<d*s.k*.9){c.globalAlpha=.5;fxR(c,l.hx+i*P,l.hy+l.hr+(j+3)*P,P,j<0?'y':'o');}}c.restore();},
  hit(s,o,A){for(let i=0;i<4;i++)FXS.slow.wisp(A,o.x+(i-1.5)*8,o.y-(o.r||16)*.6,1.4);}},
 /* Centre Stage: the middle third of the jar is a stage: a warm column of light from two lamps on the rim and floorboards beneath. A merge it scores on: the light flares and confetti pops */
 cstage:{tick(s,g,dt){if(s.fh>0)s.fh-=dt;fxRX('cstL',1/3,16,g,1);fxRX('cstR',2/3,16,g,1);},
  front(c,g,s,t){const P=g.P,x0=fq(g.L+(g.R-g.L)/3,P),x1=fq(g.L+2*(g.R-g.L)/3,P),fl=s.fh>0?1:0;c.save();for(let y=g.top,j=0;y<g.bot-2*P;y+=P,j++)for(let x=x0-2*P,i=-2;x<x1+2*P;x+=P,i++){const e=Math.min(i+2,Math.round((x1-x)/P)+2),d=(e<2?.25:e<4?.5:.75)*(fl?1:.55);const ci=Math.round(x/P);if(FBY[(ci&3)*4+(j&3)]/16<d){c.globalAlpha=s.p*(fl?.32:.17);fxR(c,x,y,P,s.l.am?'o':'y');}}
   c.globalAlpha=s.p;const b=fq(g.bot,P),am=s.l.am;for(let x=x0;x<x1;x+=P){const i=Math.round((x-x0)/P);fxR(c,x,b-3*P,P,'k');fxR(c,x,b-2*P,P,i%7===0?(am?'d':'N'):(am?'w':'E'));fxR(c,x,b-P,P,i%7===0?(am?'D':'N'):(am?'s':'n'));}
   if(s.l.am)for(const x of[x0,x1]){const Q=fxBP(g),y=fq(fxRim(g),Q),m=new Map();for(let i=-2;i<=2;i++){m.set(i+',0','d');m.set(i+',-9','s');m.set(i+',-10','N');}for(let j=1;j<=8;j++)for(let i=-1;i<=1;i++)m.set(i+','+(-j),i<0?'w':i>0?'d':'s');for(let i=-1;i<=1;i++)m.set(i+',-11','N');fxBlob(c,x,y,Q,m);const f=fst(t+(x>x0?.3:0),10)%3,hh=fl?6:4+(f>1?1:0);for(let j=0;j<hh;j++){const w=j<hh-2?1:0;for(let i=-w;i<=w;i++)fxR(c,x+(i+(j===hh-1&&f===1?1:0))*Q,y-(12+j)*Q,Q,j===0?'r':j>=hh-1?'y':'o');}}
   else for(const x of[x0,x1]){const y=fxRim(g);fxR(c,x-2*P,y-4*P,P,'k',4,4);fxR(c,x-P,y-3*P,P,'D',2,2);fxR(c,x-P,y-P,P,fl?'w':'h',2,1);}c.restore();},
  hit(s,o,A,g){const w=g.R-g.L;if(o.src==='amph'&&(o.x<g.L+w/3||o.x>g.L+2*w/3))return;s.fh=.4;A.burst(o.x,o.y-(o.r||16),['m','y','t','b','g','P'],14,{v:170,vy:-160,g:420,T:.9,dr:1.2});}},
 /* Wallflower: flowering vines climb both walls of the jar. A merge touching a wall: the flowers on that side bloom and throw petals at it */
 wall:{tick(s,g,dt){if(s.bl&&(s.bl.t-=dt)<=0)s.bl=null;},
  front(c,g,s,t){const P=g.P,sw=fst(t,2)%2;c.save();c.globalAlpha=s.p;for(const sd of[-1,1]){const wx=sd<0?g.L:g.R-P;let k=0;for(let y=g.bot-P;y>g.top+6*P;y-=P,k++){const dx=Math.round(Math.sin(k*.18+(sd>0?2:0))*1)+1,x=wx-sd*dx*P;fxR(c,x,y,P,'G');if(k%6===3){fxR(c,x-sd*P,y,P,'g');fxR(c,x-sd*2*P,y-P,P,'g');}
     if(k%11===5){const big=s.bl&&s.bl.sd===sd&&Math.abs(s.bl.y-y)<70,fx=x-sd*3*P,fy=y-(sw&&!big?P:0),pc=k%22===5?'p':'m';for(const[a,b]of[[0,-2],[0,2],[-2,0],[2,0],[-1,-1],[1,1],[-1,1],[1,-1]])fxR(c,fx+a*P,fy+b*P,P,'k');fxR(c,fx,fy-P,P,pc);fxR(c,fx,fy+P,P,pc);fxR(c,fx-P,fy,P,pc);fxR(c,fx+P,fy,P,pc);if(big){fxR(c,fx-P,fy-P,P,pc);fxR(c,fx+P,fy+P,P,pc);fxR(c,fx-P,fy+P,P,pc);fxR(c,fx+P,fy-P,P,pc);fxR(c,fx,fy-2*P,P,pc);fxR(c,fx,fy+2*P,P,pc);fxR(c,fx-2*P,fy,P,pc);fxR(c,fx+2*P,fy,P,pc);}fxR(c,fx,fy,P,'y');}}}c.restore();},
  hit(s,o,A,g){if(o.src==='ivy'&&o.x-(o.r||0)>g.L+8&&o.x+(o.r||0)<g.R-8)return;const sd=o.x<(g.L+g.R)/2?-1:1,wx=sd<0?g.L+4*g.P:g.R-4*g.P;s.bl={sd,y:o.y,t:.7};for(let k=0;k<9;k++){const T=.45+Math.random()*.2;A.add({k:'sq',x:wx,y:o.y+(Math.random()-.5)*60,vx:(o.x-wx)/T*(.7+Math.random()*.5),vy:-40-Math.random()*60,g:200,T,col:k%2?'p':'m',dr:.4});}}},
 /* Crescendo and Chain Reaction: every combo merge they score on lands a comic-book hit: a loud starburst and a word, bigger the longer the combo runs, then it breaks apart */
 comic:{hit(s,o,A,g){if(o.src==='wildfire'&&!(o.cb>=1))return;const now=A.t;if(s.lt&&now-s.lt<.05)return;s.lt=now;const ko=o.src==='knock',fi=o.src==='wildfire',cb=Math.max(ko?3:1,o.cb||1),tier=cb<3?0:cb<5?1:2,wl=ko?['K.O.!','KAPOW!','WHAM!']:fi?['FWOOM!','WHOOSH!','BLAZE!']:FXW[tier],w=wl[Math.floor(Math.random()*wl.length)],R=Math.min(62,(ko?46:38)+cb*4),seed=fi?[0,1][Math.floor(Math.random()*2)]:ko?0:Math.floor(Math.random()*99),ang=(Math.random()<.5?-1:1)*(.15+Math.random()*.2),cv=fxBurst(w,R,ang,seed),pr=FXCB[seed%FXCB.length],P=2,x=Math.max(g.L+cv.width*P*.3,Math.min(g.R-cv.width*P*.3,o.x)),y=o.y-(o.r||16)*.4;
   if(ko)for(let k=0;k<14;k++){const a=k*Math.PI/7+Math.random()*.2;A.add({k:'fn',x:o.x,y:o.y,T:.25,fa:.4,a,d:(c,q,g)=>{const P=g.P,r0=(o.r||20)*1.3+q.t*300,r1=r0+18+q.t*60;fxLn(c,q.x+Math.cos(q.a)*r0,q.y+Math.sin(q.a)*r0,q.x+Math.cos(q.a)*r1,q.y+Math.sin(q.a)*r1,P,FXP.k);}});}
   A.add({k:'fn',x,y,T:.62,fa:.85,d:(c,q,g)=>{const P=2,f=Math.floor(q.t/.05),sc=f===0?.55:f===1?1.18:1,u=q.t>.44?1:0,w=cv.width*P*sc;if(u&&!q.br){q.br=1;A.burst(q.x,q.y,[pr[0],pr[1],'k'],16,{v:300,T:.5,s:3,g:300,w:40});}if(u)return;c.save();c.imageSmoothingEnabled=false;c.drawImage(cv,fq(q.x-w/2,P),fq(q.y-w/2,P),w,w);c.restore();}});
   if(fi){const rr=cv.width*P*.42;for(let k=0;k<10;k++){const a=k/10*Math.PI*2+.13;A.add({k:'fn',x,y,T:.5,fa:.6,d:(c,q,g2)=>{const F=Math.round(g2.P*1.6),f=Math.floor(q.t/.05),sc=f===0?.55:f===1?1.18:1,fx=q.x+Math.cos(a)*rr*sc,fy=q.y+Math.sin(a)*rr*sc,h=4+(fst(q.t+k*.07,12)+k)%3,lean=fst(q.t+k,8)%2,m=new Map();for(let j=0;j<h;j++){const w=j<2?1:j<h-1?(j<h-2?1:0):0,dx=j>=h-2?lean:0;for(let ii=-w;ii<=w;ii++)m.set((ii+dx)+','+(-j),j===0?'r':j>=h-1?'h':Math.abs(ii)===1?(j<2?'r':'o'):(j<h-2?'y':'o'));}fxBlob(c,fq(fx,F),fq(fy,F),F,m);}});}
    for(let k=0;k<9;k++)A.add({k:'sq',x:x+(Math.random()-.5)*rr*1.6,y:y+rr*.3,vx:(Math.random()-.5)*30,vy:-80-Math.random()*70,g:-30,T:.8+Math.random()*.5,col:k%3?'o':'y',sw:5,sf:4,ph:k,dl:.12});}}},
 /* Juicer: every merge squirts juice in the fruit's colour; drops that reach the glass splat and run down it */
 /* v1.84 batch 1, rim objects that count for you (the Early Bird formula: you can see what it is counting and how far it has got).
    Pet Bowl (and Menagerie): a red dog bowl on the rim; every fruit your pets eat this jar drops a kibble into it, so the heap is its +Mult; it hops and pops kibble when it scores. Empties at each new jar */
 bowl:{x(g){return fq(fxRX('bowl',.2,56,g),fxBP(g));},tick(s,g,dt,A){const n=s.l.ml||0;if(s.n==null||n<s.n){s.n=n;s.sh=n;}if(n>s.n){const P=fxBP(g),x=FXS.bowl.x(g),ty=fxRim(g)-6*P;for(let k=s.n;k<n;k++)fxAd(A,{k:'fn',x,y:ty-90*g.K,T:.4,dl:(k-s.n)*.15,fa:1,d:(c,q,g2)=>{const u=Math.max(0,(q.t-q.dl)/.4),yy=q.y+(ty-q.y)*u*u;fxBlob(c,fq(x,P),fq(yy,P),P,new Map([['0,0','E'],['1,0','n'],['0,1','n'],['1,1','N']]));},end:()=>{s.sh=Math.min(s.n,s.sh+1);s.wb=.25;A.add({k:'star',x:x+3*P,y:ty-2*P,T:.3,col:'y'});}});s.n=n;}if(s.wb>0)s.wb-=dt;if(s.hb>0)s.hb-=dt;},
  hit(s,o,A,g){s.hb=.35;const P=fxBP(g),x=FXS.bowl.x(g),y=fxRim(g)-6*P;for(let k=0;k<2;k++)A.add({k:'fn',x:x+(k?2:-2)*P,y,vx:(k?40:-40),vy:-150,g:700,T:.5,fa:.7,d:(c,q,g2)=>{const Q=fxBP(g2);fxBlob(c,fq(q.x,Q),fq(q.y,Q),Q,new Map([['0,0','E'],['1,0','n'],['0,1','n'],['1,1','N']]));}});},
  front(c,g,s,t){if(s.p<=0)return;const P=fxBP(g),x=FXS.bowl.x(g),y=fxRim(g)-(s.hb>0&&s.hb>.18?P:0),dx=s.wb>0?(fst(s.wb,24)%2?P:-P):0,cs=new Map(),HP=[[-1,-5],[1,-5],[-3,-5],[3,-5],[0,-7],[-2,-7],[2,-7],[-1,-9],[1,-9],[0,-11]],sh=Math.min(HP.length,s.sh||0);
   for(let k=0;k<sh;k++){const[i,j]=HP[k];cs.set(i+','+j,'E');cs.set((i+1)+','+j,'n');cs.set(i+','+(j+1),'n');cs.set((i+1)+','+(j+1),'N');}for(let i=-5;i<=5;i++)cs.set(i+',-3',Math.abs(i)===5?'R':'r');for(let i=-4;i<=4;i++)cs.set(i+',-2',i>2?'R':'r');for(let i=-4;i<=4;i++)cs.set(i+',-1',i>1?'R':'r');for(let i=-3;i<=3;i++)cs.set(i+',0','R');cs.set('-1,-2','w');cs.set('1,-2','w');cs.set('0,-2','w');cs.set('-2,-2','w');cs.set('2,-2','w');cs.set('-2,-1','w');cs.set('2,-1','w');cs.set('-4,-3','p');
   c.save();c.globalAlpha=s.p;fxBlob(c,x+dx,fq(y,P),P,cs);c.restore();}},
 /* Doggy Bag (and Feast): a paper takeaway bag on the rim; every meal drops a bone in and the bag fills out; it rustles and a bone peeks out when it scores */
 dbag:{x(g){return fq(fxFe()?fxRX('feast',.5,124,g)-10*fxBP(g):fxRX('dbag',.34,44,g),fxBP(g));},tick(s,g,dt,A){const n=s.l.ml||0;if(s.n==null||n<s.n){s.n=n;s.sh=n;}if(n>s.n){const P=fxBP(g),x=FXS.dbag.x(g),ty=(fxRim(g)-fxFeL(g))-12*P;for(let k=s.n;k<n;k++)fxAd(A,{k:'fn',x,y:ty-80*g.K,T:.4,dl:(k-s.n)*.15,fa:1,d:(c,q,g2)=>{const u=Math.max(0,(q.t-q.dl)/.4);fxBone(c,x,q.y+(ty-q.y)*u*u,P);},end:()=>{s.sh=Math.min(s.n,s.sh+1);s.wb=.25;}});s.n=n;}if(s.wb>0)s.wb-=dt;if(s.pk>0)s.pk-=dt;},
  hit(s){s.pk=.5;s.wb=.2;},
  front(c,g,s,t){if(s.p<=0)return;if(fxFe())fxTable(c,g,s,t);const P=fxBP(g),x=FXS.dbag.x(g),y=fq((fxRim(g)-fxFeL(g)),P),f=Math.min(2,Math.floor((s.sh||0)/2)),w=3+f,h=9,dx=s.wb>0?(fst(s.wb,24)%2?P:-P):0,cs=new Map();
   if(s.pk>0)fxBone(c,x+dx+P,y-(h+2+Math.round(Math.sin(Math.min(1,(.5-s.pk)/.2)*Math.PI*.5)*2))*P,P);
   for(let j=0;j<h;j++){const ww=j<2?w-1:w;for(let i=-ww;i<=ww;i++)cs.set(i+','+(-j),i>=ww-1?'N':i<=-ww+1&&j>1?'E':'n');}for(let i=-w+1;i<=w-1;i++)cs.set(i+','+(-h),(i&1)?'E':'n');for(let i=-w+1;i<=w-1;i++)if(!(i&1))cs.set(i+','+(-h-1),'E');for(const[i,j]of[[0,-3],[-1,-3],[1,-3],[0,-4],[-1,-4],[1,-4],[-2,-5],[2,-5],[-1,-6],[1,-6]])cs.set(i+','+j,'R');
   c.save();c.globalAlpha=s.p;fxBlob(c,x+dx,y,P,cs);c.restore();}},
 /* Well Fed (and Feast): a covered plate on the rim with three meal marks; each meal fills one, and at the third the cover lifts off a hot meal that steams for the rest of the jar (that is the ×Mult switching on); a merge it scores puffs the steam. Feast serves a roast */
 wfed:{x(g){return fq(fxFe()?fxRX('feast',.5,124,g)+6*fxBP(g):fxRX('wfed',.66,70,g),fxBP(g));},tick(s,g,dt,A){const n=s.l.ml||0;if(s.n==null||n<s.n){s.n=n;s.lf=n>=3?1:0;s.rt=0;}if(n>s.n){s.rt=.3;s.n=n;}if(s.n>=3&&s.lf<1)s.lf=Math.min(1,s.lf+dt/.7);if(s.rt>0)s.rt-=dt;if(s.lf>=1){s.st=(s.st||0)+dt;if(s.st>.45){s.st=0;const P=fxBP(g),x=FXS.wfed.x(g)+(Math.random()-.5)*6*P;fxSteam(A,x,(fxRim(g)-fxFeL(g))-8*P,0);}}},
  hit(s,o,A,g){if((s.n||0)<3)return;const P=fxBP(g),x=FXS.wfed.x(g);for(let k=-1;k<=1;k++)fxSteam(A,x+k*3*P,(fxRim(g)-fxFeL(g))-8*P,1);A.add({k:'star',x:x+7*P,y:(fxRim(g)-fxFeL(g))-5*P,T:.35,col:'y'});},
  front(c,g,s,t){if(s.p<=0)return;const P=fxBP(g),x=FXS.wfed.x(g),y=fq((fxRim(g)-fxFeL(g)),P),fe=!!s.l.f,n=Math.min(3,s.n||0),lf=s.lf||0,cs=new Map();c.save();c.globalAlpha=s.p;
   for(let i=-8;i<=8;i++){cs.set(i+',-1',Math.abs(i)>6?'s':'w');}for(let i=-6;i<=6;i++)cs.set(i+',0','s');for(let k=0;k<3;k++){const i=-4+k*4;cs.set(i+',-1',k<n?'o':'d');cs.set((i+1)+',-1',k<n?'Y':'s');}
   if(lf>0){if(fe){for(let j=2;j<=5;j++){const w=j===5?2:j===2?3:4;for(let i=-w;i<=w;i++)cs.set(i+','+(-j),i>w-2||j===2?'N':i<-w+2&&j>3?'E':'n');}cs.set('-5,-4','w');cs.set('5,-4','w');cs.set('-6,-5','w');cs.set('6,-5','w');}else{for(let j=2;j<=6;j++)for(let i=-5;i<=0;i++){const e=((i+2.5)/3)**2+((j-4)/2.3)**2;if(e<=1)cs.set(i+','+(-j),e>.55&&(i>-2||j<4)?'N':i<-3&&j>3?'E':'n');}cs.set('-3,-5','E');cs.set('-4,-4','E');for(const[i,j,col]of[[1,-4,'w'],[2,-4,'w'],[3,-4,'w'],[4,-5,'w'],[4,-3,'w'],[5,-5,'s'],[5,-3,'s'],[4,-4,'s']])cs.set(i+','+j,col);}}
   fxBlob(c,x,y,P,cs);
   if(lf<1){const up=Math.round(lf*lf*18),rx=s.rt>0?(fst(s.rt,24)%2?P:-P):0,cl=new Map();for(let j=3;j<=8;j++){const w=Math.round(Math.sqrt(Math.max(0,1-((j-3)/6)**2))*7);for(let i=-w;i<=w;i++)cl.set(i+','+(-j),i<-w+2&&j<7?'w':i>w-2?'d':'s');}cl.set('0,-9','d');cl.set('0,-10','s');if(lf>0)c.globalAlpha=s.p*Math.max(0,1-lf*1.2);fxBlob(c,x+rx,y-up*P,P,cl);}
   c.restore();}},
 /* Hallmark: a gold merge brings a steel punch down on the gold fruit and stamps a hallmark on it; a wooden board on the rim keeps one stamped shield per gold merge this jar, four of them is its ×3 */
 hall:{x(g){return fq(fxRX('hall',.82,80,g),fxBP(g));},tick(s,g,dt,A){const n=s.l.gm||0;if(s.lg==null||n<s.lg){s.lg=n;s.sh=n;}if(n>s.lg){s.lg=n;const o=s.hp;if(o&&A.t-o.t<.3)fxPunch(A,o.x,o.y,o.r,()=>{s.sh=n;s.gl=.4;});else{s.sh=n;s.gl=.4;}}if(s.gl>0)s.gl-=dt;},
  hit(s,o,A){s.hp={x:o.x,y:o.y,r:o.r||16,t:A.t};},
  front(c,g,s,t){if(s.p<=0)return;const P=fxBP(g),x=FXS.hall.x(g),y=fq(fxRim(g),P),sh=Math.min(4,s.sh||0),cs=new Map();c.save();c.globalAlpha=s.p;for(let j=0;j<7;j++)for(let i=-9;i<=9;i++)cs.set(i+','+(-j),j===0||j===6?'N':Math.abs(i)===9?'N':'n');
   for(let k=0;k<4;k++){const i0=-6+k*4,on=k<sh,F=on?'y':'E',D=on?'Y':'N';for(const[i,j]of[[-1,-5],[0,-5],[1,-5],[-1,-4],[0,-4],[1,-4],[-1,-3],[0,-3],[1,-3],[0,-2]])cs.set((i0+i)+','+j,(i===1||j===-2)?D:F);if(on){cs.set(i0+',-5','r');cs.set((i0-1)+',-5','h');}}
   fxBlob(c,x,y,P,cs);if(s.gl>0&&sh>0)fxStar(c,x+(-6+(sh-1)*4)*P+2*P,y-6*P,P,fst(s.gl,10)%3,'w');c.restore();}},
 /* v1.85 batch 2.
    Compound Interest (and Hedge Fund): a chart on an easel on the rim; its five bars grow as your interest builds up over the run (all five full is the +Mult cap), new interest grows in at the start of a jar, and a merge it scores on sends a green arrow up. Hedge Fund grows a hedge in front of it, and on every 8th merge a coin pops out of the hedge */
 cint:{x(g){return fq(fxRX('cint',.12,(FXC&&FXC.S.cint&&FXC.S.cint.l&&FXC.S.cint.l.hf)?104:62,g),fxBP(g));},
  tick(s,g,dt,A){const cap=s.l.hf?87.5:100,v=Math.min(1,(A.SD.ic||0)/cap);if(s.v==null)s.v=v;if(v>s.v+.001&&!s.gr){s.gr=1;s.v0=s.v;s.gt=0;}if(s.gr){s.gt+=dt;const u=Math.min(1,s.gt/1.2);s.v=s.v0+(v-s.v0)*u*u*(3-2*u);if(u>=1){s.gr=0;s.gl=.5;}}else if(v<s.v)s.v=v;for(const k of['ar','rs','gl'])if(s[k]>0)s[k]-=dt;},
  hit(s){s.ar=.7;},
  ev(s,n,o,A,g){if(n!=='hcoin'||!s.l.hf||s.p<=0)return;s.rs=.4;const Q=fxBP(g),x=FXS.cint.x(g),y=fxRim(g)-3*Q;A.add({k:'fn',x,y,vx:(Math.random()<.5?-1:1)*30,vy:-210,g:520,T:.9,fa:.7,d:(c,q,g2)=>{fxSpD(c,q.x,q.y,g2.P,FXSP.coin);}});A.add({k:'star',x:x+4*Q,y:y-4*Q,T:.35,col:'y'});},
  front(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),x=FXS.cint.x(g),y=fq(fxRim(g),Q),v=s.v||0,cs=new Map(),H=[2,3,4,6,8];c.save();c.globalAlpha=s.p;
   for(let j=0;j<=4;j++){cs.set((-5+(j>>1))+','+(-j),'N');cs.set((5-(j>>1))+','+(-j),'N');}for(let j=5;j<=16;j++)for(let i=-7;i<=7;i++)cs.set(i+','+(-j),(j===5||j===16||Math.abs(i)===7)?'N':'c');
   for(let k=0;k<5;k++){const f=Math.max(0,Math.min(1,v*5-k)),h=Math.round(H[k]*f),i0=-5+k*2;for(let j=0;j<H[k];j++){const yj=-(6+j);if(j<h){cs.set(i0+','+yj,j===h-1&&f<1?'l':'g');cs.set((i0+1)+','+yj,'G');}else if(j===H[k]-1){cs.set(i0+','+yj,'s');cs.set((i0+1)+','+yj,'s');}}}
   if(s.l.hf){cs.clear();for(let i=-12;i<=12;i++){cs.set(i+',0','N');cs.set(i+',-1','n');cs.set(i+',-2','E');}const HB=[4,6,9,12,15];for(let k=0;k<5;k++){const f=Math.max(0,Math.min(1,v*5-k)),h=Math.max(1,Math.round(HB[k]*f)),i0=-10+k*5;for(let j=0;j<h;j++)for(let d=-1;d<=1;d++){const bump=0;cs.set((i0+d+(bump?d:0))+','+(-3-j),j===h-1&&d===0?'l':(d+j+k)%3===0?'G':'g');}if(f>=1){cs.set(i0+','+(-4-h),'y');cs.set((i0+1)+','+(-4-h),'Y');}else{cs.set(i0+','+(-3-h),'s');}}
   }else if(0){for(let i=-8;i<=8;i++){const top=-(1+((i*7+40)%3===0?1:0));for(let j=0;j>=top;j--)cs.set(i+','+j,j===top?'g':(i+j)&1?'G':'g');}const rx=s.rs>0?(fst(s.rs,24)%2?1:-1):0;if(rx)for(let i=-8;i<=8;i++)if(i%3===0)cs.set((i+rx)+',-3','l');}
   fxBlob(c,x,y,Q,cs);if(s.ar>0){const u=1-s.ar/.7,ay=y-Math.round((s.l.hf?18:10)+u*10)*Q,ax=x+5*Q;fxBlob(c,ax,ay,Q,new Map([['0,-2','l'],['-1,-1','g'],['0,-1','g'],['1,-1','g'],['-2,0','g'],['0,0','G'],['2,0','g'],['0,1','G'],['0,2','G']]));}
   if(s.gl>0)fxStar(c,x+5*Q,y-12*Q,Q,fst(s.gl,10)%3,'w');c.restore();}},
 /* Gold Standard: a pyramid of gold bars on the rim, one bar for every 5 coins gold fruit have paid you this run (ten bars is its +5 cap); a new bar slides on with a clink, and a merge it scores on sends a glint across the stack */
 gstd:{x(g){return fq(fxRX('gstd',.9,64,g),fxBP(g));},
  tick(s,g,dt,A){const n=Math.min(10,Math.floor((A.SD.gc||0)/5));if(s.n==null||n<s.n){s.n=n;s.sh=n;}if(n>s.sh&&!(s.sl>0)){s.sl=.35;}if(s.sl>0){s.sl-=dt;if(s.sl<=0){s.sh++;s.ck=.25;}}if(s.ck>0)s.ck-=dt;if(s.gl>0)s.gl-=dt;s.n=n;},
  hit(s){s.gl=.6;},
  front(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),x=FXS.gstd.x(g),y=fq(fxRim(g),Q),sh=Math.min(10,s.sh||0),POS=[],cs=new Map();for(const[row,cnt]of[[0,4],[1,3],[2,2],[3,1]])for(let k=0;k<cnt;k++)POS.push([(-(cnt-1)*5/2+k*5),row]);
   const bar=(ix,jy,on)=>{for(let i=0;i<4;i++){cs.set((ix+i)+','+(jy-1),on?(i===0?'h':'y'):'s');cs.set((ix+i)+','+jy,on?'Y':'d');}};
   for(let k=0;k<sh;k++){const[ix,row]=POS[k];bar(Math.round(ix-2),-row*2,1);}
   c.save();c.globalAlpha=s.p;if(cs.size)fxBlob(c,x,y-Q,Q,cs);
   if(s.sl>0&&sh<10){const[ix,row]=POS[sh],u=1-s.sl/.35,m=new Map();for(let i=0;i<4;i++){m.set(i+',-1',i===0?'h':'y');m.set(i+',0','Y');}fxBlob(c,x+Math.round(ix-2)*Q,y-Q-row*2*Q-Math.round((1-u)*(1-u)*16)*Q,Q,m);}
   if(s.gl>0){const u=1-s.gl/.6,gx=Math.round(-12+u*24);for(let k=0;k<sh;k++){const[ix,row]=POS[k],bx=Math.round(ix-2);for(let i=0;i<4;i++)if(bx+i-row===gx||bx+i-row===gx+1)fxR(c,x+(bx+i)*Q,y-Q-(row*2+1)*Q,Q,'w');}}
   if(s.ck>0&&sh>0){const[ix,row]=POS[sh-1];fxStar(c,x+(Math.round(ix-2)+4)*Q,y-(row*2+3)*Q,Q,fst(s.ck,12)%3,'y');}
   if(!sh){fxR(c,x-9*Q,y-Q,Q,'d',19,1);}c.restore();}},
 /* Big Spender: a shopping bag on the rim, as full as you spent in the last shop: a thing sticks out of it for every 4 coins and a receipt hangs out, a line for every 2 (twenty coins is its ×2); a merge it scores on: the bag bounces and the receipt flutters */
 spender:{x(g){return fq(fxRX('spender',.64,40,g),fxBP(g));},
  tick(s,g,dt){if(s.hb>0)s.hb-=dt;},
  hit(s){s.hb=.5;},
  front(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),x=FXS.spender.x(g),sp=Math.min(20,(FXC&&FXC.SD.sp)||0),y=fq(fxRim(g),Q)-(s.hb>.3?Q:0),it=Math.min(5,Math.ceil(sp/4)),ln=Math.min(10,Math.floor(sp/2)),cs=new Map();c.save();c.globalAlpha=s.p;
   const IT=[[[-3,-9,'E'],[-3,-10,'E'],[-3,-11,'E'],[-2,-12,'E'],[-2,-11,'n'],[-2,-10,'E']],[[2,-9,'G'],[2,-10,'G'],[2,-11,'w'],[2,-12,'G'],[2,-13,'k']],[[0,-9,'r'],[-1,-9,'r'],[0,-10,'r'],[-1,-10,'R'],[0,-11,'G']],[[-1,-9,'g'],[-1,-10,'g'],[-1,-11,'l'],[-1,-12,'l'],[-2,-13,'l'],[0,-13,'l']],[[3,-9,'y'],[4,-9,'y'],[3,-10,'y'],[4,-10,'Y']]];
   for(let k=0;k<it;k++)for(const[i,j,col]of IT[k])cs.set(i+','+j,col);
   for(let j=0;j<8;j++)for(let i=-4;i<=4;i++)cs.set(i+','+(-j),i>=3?'m':i<=-3&&j>1?'p':'m');for(let i=-4;i<=4;i++)cs.set(i+',-8','p');for(const[i,j]of[[-3,-9],[-3,-10],[-2,-11],[-1,-11],[3,-9],[3,-10],[2,-11],[1,-11]])if(!cs.has(i+','+j))cs.set(i+','+j,'k');
   cs.set('0,-4','y');cs.set('-1,-4','Y');cs.set('1,-4','Y');cs.set('0,-5','Y');cs.set('0,-3','Y');
   fxBlob(c,x,y,Q,cs);
   if(ln){const rc=new Map(),fl=s.hb>0?fst(s.hb,12)%2:0;for(let j=0;j<ln;j++){const dx=5+(fl&&j>ln/2?1:0)+(j>ln-3?Math.round(Math.sin(t*3+j))*0:0);rc.set(dx+','+(-7+j),'w');rc.set((dx+1)+','+(-7+j),j%2?'s':'w');}rc.set((5+(fl?1:0))+','+(-7+ln),'s');fxBlob(c,x,y,Q,rc);}
   if(sp>=20)fxStar(c,x-5*Q,y-9*Q,Q,fst(t,3)%2?1:2,'y');c.restore();}},
 /* Rabbit's Foot: a lucky rabbit's foot hangs from a hook on the rim beside a slate; every miss of a chance charm this jar swings it and chalks a tally mark (its +Mult), and a merge it scores on makes it glint */
 foot:{x(g){return fq(fxRX('foot',.3,96,g),fxBP(g));},
  tick(s,g,dt,A){const n=A.SD.ms||0;if(s.n==null||n<s.n){s.n=n;s.sh=n;}if(n>s.n){s.sw=1.4;s.n=n;s.ch=.35;}if(s.ch>0){s.ch-=dt;if(s.ch<=0){s.sh=s.n;const Q=fxBP(g),x=FXS.foot.x(g);A.burst(x+5*Q,fxRim(g)-6*Q,['w','s'],5,{v:40,vy:-20,g:120,T:.4});}}if(s.sw>0)s.sw-=dt;if(s.gl>0)s.gl-=dt;},
  hit(s){s.gl=.5;},
  front(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),x=FXS.foot.x(g),y=fq(fxRim(g),Q),hx=x-5*Q,top=y-16*Q,amp=s.sw>0?.6*(s.sw/1.4):.08,a=RMO?0:Math.sin(t*(s.sw>0?7:2.2))*amp,L=7,fx2=hx+Math.round(Math.sin(a)*L)*Q,fy=top+Math.round(Math.cos(a)*L)*Q;c.save();c.globalAlpha=s.p;
   const ps=new Map();for(let j=0;j<=16;j++)ps.set('-5,'+(-j),j>14?'N':'n');ps.set('-4,-16','n');ps.set('-3,-16','n');ps.set('-6,0','N');ps.set('-4,0','N');fxBlob(c,x,y,Q,ps);
   for(let k=1;k<L;k++)fxR(c,hx+Math.round(Math.sin(a)*k)*Q,top+Math.round(Math.cos(a)*k)*Q,Q,k%2?'s':'d');
   {const m=new Map([['-1,0','y'],['0,0','Y'],['1,0','Y']]);for(let j=1;j<=4;j++)for(let i=-2;i<=2;i++)m.set(i+','+j,i===2||(j===4&&i===1)?'s':'c');m.set('-1,1','w');m.set('-1,2','w');m.set('-3,2','c');m.set('3,3','s');for(const[i,col]of[[-2,'p'],[-1,'c'],[0,'p'],[1,'s'],[2,'p']])m.set(i+',5',col);fxBlob(c,fx2,fy,Q,m);}
   if(s.gl>0)fxStar(c,fx2+2*Q,fy+Q,Q,fst(s.gl,10)%3,'w');
   const sl=new Map();for(let j=1;j<=7;j++)for(let i=1;i<=19;i++)sl.set(i+','+(-j),(j===1||j===7||i===1||i===19)?'N':'D');fxBlob(c,x,y,Q,sl);
   const sh=Math.min(10,s.sh||0);for(let k=0;k<sh;k++){const gx=x+(3+Math.floor(k/5)*8)*Q,m=k%5;if(m<4)for(let j=3;j<=5;j++)fxR(c,gx+2*m*Q,y-j*Q,Q,'w');else for(let d=0;d<9;d++)fxR(c,gx-Q+d*Q,y-(3+Math.floor(d*3/9))*Q,Q,'s');}
   c.restore();}},
 /* v1.86 batch 3.
    Compost: a slatted compost bin on the rim; the heap inside grows with the Mult it has gained, every fruit destroyed throws a scrap in (a worm pokes up), and a merge it scores on steams */
 compost:{x(g){return fq(fxRX('compost',.08,44,g),fxBP(g));},
  tick(s,g,dt){for(const k of['wm','st'])if(s[k]>0)s[k]-=dt;},
  ev(s,n,o,A,g){if(n!=='kill'||s.p<=0)return;const Q=fxBP(g),x=FXS.compost.x(g),ty=fxRim(g)-8*Q,k=Math.min(4,o.n||1);for(let i=0;i<k;i++){const x0=g.L+(g.R-g.L)*(.3+Math.random()*.5),y0=g.bot-40-Math.random()*(g.bot-g.top)*.4,col=['g','n','o','r','y'][i%5];fxAd(A,{k:'fn',x:x0,y:y0,T:.6,dl:i*.08,fa:1,d:(c,q,g2)=>{const u=(q.t-q.dl)/.6,e=u*u,bx=x0+(x-x0)*e,by=y0+(ty-y0)*e-Math.sin(u*Math.PI)*60*g2.K;fxBlob(c,fq(bx,Q),fq(by,Q),Q,new Map([['0,0',col],['1,0',col],['0,1','N']]));},end:()=>{s.wm=.7;}});}},
  hit(s){s.st=.8;},
  front(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),x=FXS.compost.x(g),y=fq(fxRim(g),Q),v=(s.l.v||0),h=Math.min(7,1+Math.floor(v/.2)),m=new Map();c.save();c.globalAlpha=s.p;
   for(let j=0;j<h;j++){const w=Math.max(1,5-Math.max(0,j-h+3));for(let i=-w;i<=w;i++)m.set(i+','+(-1-j),((i*3+j*5)&7)===0?'g':((i+j)&3)===0?'N':'n');}if(h>2){m.set('-2,'+(-h),'g');m.set('3,'+(-h+1),'o');}
   if(s.wm>0){const wy=-h-1-(s.wm>.35?1:0);m.set('1,'+wy,'p');m.set('1,'+(wy-1),'p');m.set('2,'+(wy-1),'k');}
   for(let j=0;j<=5;j++)for(const i of[-6,6])m.set(i+','+(-j),'N');for(let i=-5;i<=5;i++){m.set(i+',0','N');m.set(i+',-1','E');if(!m.has(i+',-4')||Math.abs(i)>4)m.set(i+',-4','E');}fxBlob(c,x,y,Q,m);
   if(s.st>0)for(let k=-1;k<=1;k++){const u=1-s.st/.8,yy=y-(10+u*10)*Q;fxR(c,x+(k*3+Math.round(Math.sin(u*9+k)*1))*Q,fq(yy,Q),Q,k?'u':'s');fxR(c,x+(k*3+Math.round(Math.sin(u*9+k+1)*1))*Q,fq(yy,Q)-Q,Q,'s');}
   c.restore();}},
 /* Volcano (Fireworks + Compost): a big volcano stands in the background behind everything else on the rim, smoking all the time (more as its Mult grows); lava rivers run further down its sides as the next Boom fruit comes round (every 5th drop), and it erupts when a Boom goes off */
 volcano:{x(g){return fq(g.L+(g.R-g.L)*.56,fxBP(g));},
  tick(s,g,dt,A){if(s.er>0)s.er-=dt;if(s.p<=0||RMO)return;const Q=fxBP(g),x=FXS.volcano.x(g),top=fxRim(g)-17*Q;
   if(Math.random()<dt*(2+Math.min(4,(s.l.v||0)*3)))A.add({k:'fn',ly:0,x:x+(Math.random()-.5)*3*Q,y:top-2*Q,vy:-24,vx:6,T:2.2,fa:.45,ph:Math.random()*6,d:(c,q,g2)=>{const P=fxBP(g2),u=q.t/2.2,r=1+Math.floor(u*3.6),cx=q.x+Math.sin(q.ph+u*3)*8;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r&&FBY[((i+8)&3)*4+((j+8)&3)]/16<.8-u*.6)fxR(c,cx+i*P,q.y+j*P,P,u<.2?'x':j<0?'s':'d');}});
   if(Math.random()<dt*2)A.add({k:'sq',ly:0,x:x+(Math.random()-.5)*3*Q,y:top,vx:(Math.random()-.5)*30,vy:-50-Math.random()*40,g:30,T:1.1,col:Math.random()<.5?'o':'y'});},
  ev(s,n,o,A,g){if(n!=='boom'||s.p<=0)return;s.er=1.1;const Q=fxBP(g),x=FXS.volcano.x(g),y=fxRim(g)-17*Q;for(let k=0;k<18;k++){const a=-Math.PI/2+(Math.random()-.5)*1.3,v=240+Math.random()*220;A.add({k:'fn',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:640,T:1.3,dl:k*.02,fa:.7,col:k%3?'o':k%2?'r':'y',d:(c,q,g2)=>{const P=fxBP(g2);fxBlob(c,fq(q.x,P),fq(q.y,P),P,new Map([['0,0',q.col],['1,0','r'],['0,1','r'],['1,1',q.col==='y'?'o':'r']]));}});}},
  hit(s,o,A,g){const Q=fxBP(g),x=FXS.volcano.x(g);s.hg=.4;A.add({k:'star',x:x+3*Q,y:fxRim(g)-18*Q,T:.35,col:'o'});},
  back(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),x=FXS.volcano.x(g),y=fq(fxRim(g),Q),H=17,sq=s.l.sq||0,lv=((sq%5)+5)%5/4,er=s.er>0,m=new Map(),W0=j=>Math.round(18-j*.95);c.save();c.globalAlpha=s.p;
   for(let j=0;j<=H;j++){const w=W0(j);for(let i=-w;i<=w;i++){const cr=j>=H-1&&Math.abs(i)<=2;m.set(i+','+(-j),cr?(er||fst(t,4)%2?'y':'o'):i<-w+3&&j<H-2?'d':i>w-3?'x':(((i*5+j*3+40)&7)===0?'x':((i*3+j*7+40)%11===0?'d':'D')));}}
   const LN=Math.round(lv*(H-2))+(er?H:0);for(const[i0,sd]of[[-2,-1],[2,1],[0,1]]){for(let k=0;k<Math.min(H-1,LN);k++){const j=H-1-k,i=i0+sd*Math.round(k*(i0?.75:.35))+((k>>1)%2?sd:0);if(Math.abs(i)>W0(j)-1)break;m.set(i+','+(-j),k%5===0?'y':'o');if(!m.get((i+sd)+','+(-j))||m.get((i+sd)+','+(-j))!=='o')m.set((i+sd)+','+(-j),'r');}}
   fxBlob(c,x,y,Q,m);if(er||s.hg>0){const cy=y-(H+1)*Q;c.globalAlpha=s.p*.5;for(let j=-3;j<=1;j++)for(let i=-4;i<=4;i++)if(i*i+j*j*2<=18&&FBY[((i+8)&3)*4+((j+8)&3)]/16<.5)fxR(c,x+i*Q,cy+j*Q,Q,'y');}if(s.hg>0)s.hg-=1/60;
   if(er){c.globalAlpha=s.p;const h=Math.round(Math.min(1,(1.1-s.er)*6)*6)+(fst(t,10)%2);for(let j=0;j<h;j++)for(let i=-1;i<=1;i++)fxR(c,x+i*Q,y-(H+1+j)*Q,Q,i===0&&j<h-1?'y':j===h-1?'y':'o');}
   c.restore();}},
 /* Pip Collector: a glass jar of pips on the rim, one pip for every small fruit it has counted (its Mult); a merge that makes a size 3 or smaller pops a pip out of the fruit and into the jar */
 pip:{x(g){return fq(fxRX('pip',.2,36,g),fxBP(g));},
  tick(s,g,dt){if(s.gl>0)s.gl-=dt;},
  hit(s,o,A,g){if(o.l==null||o.l>2||o.src==='keep')return;const Q=fxBP(g),x=FXS.pip.x(g),ty=fxRim(g)-7*Q,x0=o.x,y0=o.y-(o.r||14)*.6;A.add({k:'fn',x:x0,y:y0,T:.55,fa:1,d:(c,q,g2)=>{const u=q.t/.55,e=u*u,bx=x0+(x-x0)*e,by=y0+(ty-y0)*e-Math.sin(u*Math.PI)*70*g2.K;fxBlob(c,fq(bx,Q),fq(by,Q),Q,new Map([['0,0','N'],['0,1','N'],['1,1','n'],['0,-1','k']]));},end:()=>{s.gl=.4;}});},
  front(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),x=FXS.pip.x(g),y=fq(fxRim(g),Q),n=Math.min(28,Math.round((s.l.v||0)/.03)),m=new Map();c.save();c.globalAlpha=s.p;
   for(let j=0;j<=9;j++)for(let i=-4;i<=4;i++){const e=Math.abs(i)===4||j===0;m.set(i+','+(-j),e?'j':'i');}for(let i=-3;i<=3;i++){m.set(i+',-10','j');m.set(i+',-11','n');m.set(i+',-12',Math.abs(i)<3?'E':'n');}
   let k=0;for(let j=1;j<=8&&k<n;j++)for(let i=-3;i<=3&&k<n;i++,k++)m.set(i+','+(-j),((i+j)&1)?'N':((i*7+j)%5===0?'E':'n'));m.set('-3,-8','w');m.set('-3,-7','w');fxBlob(c,x,y,Q,m);if(s.gl>0)fxStar(c,x+5*Q,y-11*Q,Q,fst(s.gl,10)%3,'w');c.restore();}},
 /* Crumbs: a plate on the rim gathers a crumb for every small merge this jar (each one adds 2 points to every merge); a merge that makes a size 4 or smaller cracks a biscuit over the fruit and sends a crumb to the plate */
 crumbs:{x(g){return fq(fxRX('crumbs',.7,48,g),fxBP(g));},
  tick(s,g,dt,A){const n=A.SD.sm||0;if(s.n==null||n<s.n)s.sh=n;s.n=n;if(s.gl>0)s.gl-=dt;},
  hit(s,o,A,g){if(o.l==null||o.l>3){s.gl=.3;return;}const Q=fxBP(g),P=g.P,x0=o.x,y0=o.y-(o.r||16)-6*g.K,x=FXS.crumbs.x(g),ty=fxRim(g)-3*Q;
   A.add({k:'fn',x:x0,y:y0,T:.55,fa:.7,d:(c,q,g2)=>{const P2=g2.P,t=q.t,sp=t<.18?0:Math.round((t-.18)*30),m=new Map();for(let j=-3;j<=3;j++)for(let i=-3;i<=3;i++){if(i*i+j*j>11)continue;const qx=i<0?-1:1,qy=j<0?-1:1,col=(i===-1&&j===-1)||(i===1&&j===1)||(i===2&&j===-2)?'N':(i+j)%3===0?'E':'n';m.set((i+qx*sp)+','+(j+qy*sp+(sp?sp>>1:0)),col);}const pop=t<.05?.6:t<.1?1.15:1;if(pop!==1){c.save();c.translate(x0,y0);c.scale(pop,pop);c.translate(-x0,-y0);}fxBlob(c,fq(x0,P2),fq(y0,P2),P2,m);if(pop!==1)c.restore();}});
   for(let k=0;k<6;k++)A.add({k:'sq',x:x0+(Math.random()-.5)*20,y:y0,vx:(Math.random()-.5)*120,vy:-60-Math.random()*60,g:600,T:.6,col:k%2?'E':'n',dl:.18,fy:o.y,bo:.3});
   fxAd(A,{k:'fn',x:x0,y:y0,T:.5,dl:.2,fa:1,d:(c,q,g2)=>{const u=(q.t-q.dl)/.5,e=u*u,bx=x0+(x-x0)*e,by=y0+(ty-y0)*e-Math.sin(u*Math.PI)*60*g2.K;fxR(c,fq(bx,P)-P,fq(by,P)-P,P,'k',3,3);fxR(c,fq(bx,P),fq(by,P),P,'E');},end:()=>{s.sh=s.n;s.gl=.3;}});},
  front(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),x=FXS.crumbs.x(g),y=fq(fxRim(g),Q),n=Math.min(18,s.sh||0),m=new Map();c.save();c.globalAlpha=s.p;for(let i=-6;i<=6;i++)m.set(i+',-1',Math.abs(i)>4?'s':'w');for(let i=-4;i<=4;i++)m.set(i+',0','s');
   const PS=[[0,-2],[-1,-2],[1,-2],[-2,-2],[2,-2],[-3,-2],[3,-2],[0,-3],[-1,-3],[1,-3],[-2,-3],[2,-3],[0,-4],[-1,-4],[1,-4],[0,-5],[-4,-2],[4,-2]];for(let k=0;k<n;k++){const[i,j]=PS[k];m.set(i+','+j,(k*3)%4?'E':'n');}fxBlob(c,x,y,Q,m);if(s.gl>0&&n)fxStar(c,x+4*Q,y-4*Q,Q,fst(s.gl,10)%3,'y');c.restore();}},
 /* Bite Size: an open lunchbox on the rim holding the only sizes you will be dropped (Cherry, Strawberry, Grape); every merge it scores on, a little set of teeth takes a bite out of the air over the fruit */
 bite:{x(g){return fq(fxRX('bite',.38,44,g),fxBP(g));},
  hit(s,o,A,g){if(o.src==='snack'&&!(o.l<=2))return;const x0=o.x,y0=o.y-(o.r||16)*.2;A.add({k:'fn',x:x0,y:y0,T:.38,fa:.75,d:(c,q,g2)=>{const P=g2.P,t=q.t,gap=t<.12?4-Math.round(t/.12*4):t<.2?0:Math.min(2,Math.round((t-.2)*12)),m=new Map();for(let i=-4;i<=4;i++){m.set(i+','+(-gap-2),'p');m.set(i+','+(gap+2),'p');if(i%2===0){m.set(i+','+(-gap-1),'w');m.set(i+','+(gap+1),'w');}}fxBlob(c,fq(x0,P),fq(y0,P),P,m);}});if(o.l!=null)A.burst(x0,y0,['E','n',(typeof FRUIT!=='undefined'&&FRUIT[o.l]?FRUIT[o.l][0]:'r')],5,{v:90,vy:-40,T:.4,dr:1});},
  front(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),x=FXS.bite.x(g),y=fq(fxRim(g),Q),m=new Map();c.save();c.globalAlpha=s.p;for(let j=0;j<=3;j++)for(let i=-6;i<=6;i++)m.set(i+','+(-j),j===0||Math.abs(i)===6?'R':j===3?'r':'w');for(let j=4;j<=9;j++){const i=-6+(j-4);m.set(i+','+(-j),'r');m.set((i+1)+','+(-j),'R');}
   const fc=l=>(typeof FRUIT!=='undefined'&&FRUIT[l]?FRUIT[l][0]:'#e63946');[[-3,0],[0,1],[3,2]].forEach(([i,l])=>{m.set(i+',-2',fc(l));m.set((i+1)+',-2',fc(l));m.set(i+',-1',fc(l));m.set((i+1)+',-1',fc(l));m.set(i+',-3','g');});fxBlob(c,x,y,Q,m);c.restore();}},
 /* Zen Garden (Gargoyle + Rock Garden): raked sand ripples spread round every rock in the jar (its Mult), and a stone lantern on the rim lights a window for each drop towards the next rock (every 6th fruit); a merge it scores on: the ripples glow */
 zen:{x(g){return fq(fxRX('zen',.86,80,g),fxBP(g));},
  tick(s,g,dt){if(s.gl>0)s.gl-=dt;},hit(s){s.gl=.6;},
  front0(c,g,s,t){if(s.p<=0||!FXC)return;const P=g.P,rk=FXC.F.filter(f=>f.s==='stone');c.save();for(const f of rk){const R=Math.round(f.r/P)+1,N=Math.round(R*6);c.globalAlpha=s.p*.85;for(let a=0;a<N;a++){if(a%2)continue;const an=a/N*Math.PI*2+fst(t,2)*.15;fxR(c,f.x+Math.round(Math.cos(an)*R)*P,f.y+Math.round(Math.sin(an)*R)*P,P,'s');}if(s.gl>0){const u=1-s.gl/.6,R2=R+Math.round(u*8);c.globalAlpha=s.p*(1-u);for(let a=0;a<R2*6;a++){if(a%2)continue;const an=a/(R2*6)*Math.PI*2;fxR(c,f.x+Math.round(Math.cos(an)*R2)*P,f.y+Math.round(Math.sin(an)*R2)*P,P,'y');}}}c.restore();},
  front(c,g,s,t){if(s.p<=0)return;FXS.zen.front0(c,g,s,t);const Q=fxBP(g),x=FXS.zen.x(g),y=fq(fxRim(g),Q),sq=s.l.sq||0,lit=((sq%6)+6)%6,m=new Map();c.save();c.globalAlpha=s.p;
   for(let i=-4;i<=4;i++)m.set(i+',0','D');for(let i=-3;i<=3;i++)m.set(i+',-1','d');for(let j=2;j<=5;j++){m.set('0,'+(-j),'s');m.set('-1,'+(-j),'w');m.set('1,'+(-j),'d');}for(let i=-3;i<=3;i++)m.set(i+',-6','d');
   for(let j=7;j<=11;j++)for(let i=-3;i<=3;i++)m.set(i+','+(-j),Math.abs(i)===3?'d':'D');const W=[[-1,-8],[1,-8],[-1,-9],[1,-9],[-1,-10],[1,-10]];for(let k=0;k<6;k++){const[i,j]=W[6-1-k]||W[k];m.set(i+','+j,k<lit?(lit>=5?'y':'o'):'x');}
   for(let i=-6;i<=6;i++)m.set(i+',-12',Math.abs(i)>4?'D':'d');m.set('-7,-13','D');m.set('7,-13','D');for(let i=-4;i<=4;i++)m.set(i+',-13','D');for(let i=-2;i<=2;i++)m.set(i+',-14','D');m.set('0,-15','D');m.set('0,-16',lit>=5?'y':'D');
   const bx=9,bon=[[bx-2,0,'N'],[bx-1,0,'n'],[bx,0,'n'],[bx+1,0,'n'],[bx+2,0,'N'],[bx-1,-1,'N'],[bx,-1,'N'],[bx+1,-1,'N'],[bx,-2,'n'],[bx-1,-3,'n'],[bx-1,-4,'n'],[bx,-5,'n']];for(const[i,j,col]of bon)m.set(i+','+j,col);for(const[i,j,w]of[[bx-2,-5,2],[bx+1,-6,2],[bx-1,-7,2]])for(let d=-w;d<=w;d++)m.set((i+d)+','+j,d<0?'g':'G');
   for(const[i,j,col]of[[-9,0,'d'],[-8,0,'d'],[-7,0,'s'],[-9,-1,'s'],[-8,-1,'d'],[-8,-2,'g'],[-9,-2,'G'],[-7,-1,'g']])m.set(i+','+j,col);
   fxBlob(c,x,y,Q,m);if(lit>=5){c.globalAlpha=s.p*.35;for(let j=6;j<=12;j++)for(let i=-5;i<=5;i++)if(Math.abs(i)>3&&FBY[((i+8)&3)*4+((j+8)&3)]/16<.5)fxR(c,x+i*Q,y-j*Q,Q,'y');}c.restore();}},
 /* Family Tree: a little tree on the rim hangs each family pair (Citrus, Berries, Pome, Melons); a pair lights up while either of its sizes holds a seed (they share it); a merge it scores on grows a vine from the fruit to its family's other size in the jar */
 ftree:{x(g){return fq(fxRX('ftree',.6,56,g),fxBP(g));},
  tick(s,g,dt){if(s.gl>0)s.gl-=dt;},
  hit(s,o,A,g){if(o.l==null||!FXC)return;const sb=typeof RG!=='undefined'&&RG.sib?RG.sib(o.l):-1;s.gl=.6;s.gp=o.l;if(sb<0)return;const tg=FXC.F.filter(f=>f.l===sb).sort((a,b)=>Math.hypot(a.x-o.x,a.y-o.y)-Math.hypot(b.x-o.x,b.y-o.y))[0];if(!tg)return;const x0=o.x,y0=o.y,x1=tg.x,y1=tg.y,mx=(x0+x1)/2,my=Math.min(y0,y1)-50*g.K;
   A.add({k:'fn',x:x0,y:y0,T:1.1,fa:.75,d:(c,q,g2)=>{const P=g2.P,u=Math.min(1,q.t/.45),N=24;const N2=Math.max(16,Math.round(Math.hypot(x1-x0,y1-y0)/P*1.3));for(let k=0;k<=N2*u;k++){const v=k/N2,bx=(1-v)*(1-v)*x0+2*v*(1-v)*mx+v*v*x1,by=(1-v)*(1-v)*y0+2*v*(1-v)*my+v*v*y1;fxR(c,bx,by-P,P,'k');fxR(c,bx,by+P,P,'k');fxR(c,bx,by,P,'G');if(k%7===3){const sd=(k/7|0)%2?1:-1;fxBlob(c,fq(bx,P),fq(by+sd*2*P,P),P,new Map([['0,0','g'],['1,0','l'],['-1,0','g'],['0,'+sd,'G']]));}}if(u>=1){fxStar(c,x1,y1-tg.r*.6,P,fst(q.t,10)%3,'y');fxStar(c,x0,y0-o.r*.6,P,fst(q.t+.3,10)%3,'y');}}});},
  front(c,g,s,t){if(s.p<=0||!FXC)return;const Q=fxBP(g),x=FXS.ftree.x(g),y=fq(fxRim(g),Q),sd=FXC.SD.sd||[],m=new Map();c.save();c.globalAlpha=s.p;for(let j=0;j<=9;j++){m.set('0,'+(-j),'N');if(j<7)m.set('1,'+(-j),j<2?'N':'n');}m.set('-1,0','N');m.set('2,0','N');for(let j=10;j<=20;j++){const w=j<12?6:j<15?8:j<18?7:j<20?5:3;for(let i=-w;i<=w;i++)m.set(i+','+(-j),((i+j)%4===0)?'G':(i<-w+2&&j>13?'l':'g'));}
   const PR=[[3,4,-6,-12],[1,2,5,-12],[5,6,-4,-16],[9,10,3,-17]];for(const[a,b,i,j]of PR){const on=(sd[a]||0)+(sd[b]||0)>0,c1=fxFC(a),c2=fxFC(b),lit=s.gl>0&&(s.gp===a||s.gp===b);m.set(i+','+j,on?c1:'d');m.set((i+1)+','+j,on?c2:'d');if(lit){m.set(i+','+(j-1),'y');m.set((i+1)+','+(j-1),'y');}}fxBlob(c,x,y,Q,m);c.restore();}},
 /* Orchardist: a little orchard grows in the background behind the rim, one tree for every Orchard item you hold (its Mult), each a different size and kind (apple, pear, plum, cherry); a merge it scores on shakes fruit out of every tree */
 orch:{T:[[.15,17,0],[.36,11,1],[.8,21,2],[.66,13,3],[.27,15,2],[.92,10,0]],
  tr(k,g){const t=FXS.orch.T[k];return{x:fq(g.L+(g.R-g.L)*t[0],fxBP(g)),h:t[1],kind:t[2]};},
  hit(s,o,A,g){const Q=fxBP(g),n=Math.min(6,(FXC&&FXC.SD.or)||0);for(let k=0;k<n;k++){const tr=FXS.orch.tr(k,g),col=['r','y','V','r'][tr.kind];A.add({k:'fn',x:tr.x+(k%2?2:-2)*Q,y:fxRim(g)-(tr.h-3)*Q,vx:(k%2?24:-24),vy:-30,g:520,T:1,dl:k*.07,fy:fxRim(g)-Q,bo:.35,fa:.7,d:(c,q,g2)=>{const P=fxBP(g2);fxBlob(c,fq(q.x,P),fq(q.y,P),P,new Map([['0,0',col],['0,-1','G']]));}});}},
  back(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),n=Math.min(6,(FXC&&FXC.SD.or)||0),y=fq(fxRim(g),Q),sw=RMO?0:fst(t,1.5)%2;c.save();c.globalAlpha=s.p;
   for(let k=0;k<n;k++){const{x,h,kind}=FXS.orch.tr(k,g),th=Math.round(h*.4),m=new Map(),rx=kind===1?2:kind===2?6:4,ry=Math.round((h-th)/2),cy=th+ry,FC=['r','y','V','r'][kind];for(let j=0;j<=th;j++){m.set('0,'+(-j),'N');if(j<th-1)m.set('-1,'+(-j),j<2?'N':'n');}m.set('1,0','N');m.set('-2,0','N');
    for(let j=-ry;j<=ry;j++)for(let i=-rx-1;i<=rx+1;i++){const e=(i*i)/((rx+.5)*(rx+.5))+(j*j)/((ry+.5)*(ry+.5));if(e>1+((i*7+j*13+k*5+40)%5===0?.25:0))continue;const sx=i+(j<-ry/2&&sw?1:0);m.set(sx+','+(-(cy+j)),i<-rx/2&&j>0?'l':(i>rx/3||j<-ry/2)?'G':'g');}
    const ft=kind===1?[[0,-(cy+1)],[1,-(cy-2)],[-1,-(cy+3)]]:[[-2,-(cy+1)],[2,-(cy-1)],[0,-(cy+2)],[3,-(cy+2)],[-3,-(cy-2)]];for(const[i,j]of ft)if(Math.abs(i)<=rx){m.set(i+','+j,FC);if(kind===3)m.set(i+','+(j-1),'G');}fxBlob(c,x,y,Q,m);}
   c.restore();}},
 /* Grafter: a grafted tree on the rim with a branch for every fusion you hold, each bound with tape and flowering in its own colour (its Mult); a merge it scores on: the blossoms throw petals */
 graft:{x(g){return fq(fxRX('graft',.78,52,g),fxBP(g));},
  hit(s,o,A,g){const Q=fxBP(g),n=Math.min(6,(FXC&&FXC.SD.nfu)||0),x=FXS.graft.x(g),y=fxRim(g),C=['m','w','y','P','o','b'];for(let k=0;k<n;k++){const[bx,by]=FXS.graft.bp(k);A.burst(x+bx*Q,y+by*Q,[C[k],C[k],'w'],4,{v:60,vy:-30,g:120,T:.6,dr:.6});}},
  bp(k){return[[-6,-12],[6,-12],[-7,-7],[7,-7],[-4,-16],[4,-16]][k];},
  front(c,g,s,t){if(s.p<=0)return;const Q=fxBP(g),n=Math.min(6,(FXC&&FXC.SD.nfu)||0),x=FXS.graft.x(g),y=fq(fxRim(g),Q),C=['m','w','y','P','o','b'],m=new Map();c.save();c.globalAlpha=s.p;for(let j=0;j<=15;j++)m.set('0,'+(-j),j>13?'n':'N');m.set('1,0','N');m.set('-1,0','N');
   for(let k=0;k<n;k++){const[bx,by]=FXS.graft.bp(k),sx=Math.sign(bx);for(let d=1;d<=Math.abs(bx)-1;d++)m.set((sx*d)+','+(by+Math.round(d*.5)),'n');m.set((sx*2)+','+(by+1),'w');m.set((bx)+','+by,C[k]);m.set((bx-1)+','+by,C[k]);m.set((bx+1)+','+by,C[k]);m.set(bx+','+(by-1),C[k]);m.set(bx+','+(by+1),C[k]);m.set(bx+','+by,'y');}
   if(!n){m.set('-1,-10','g');m.set('1,-10','g');}fxBlob(c,x,y,Q,m);c.restore();}},
 /* Small Fry and Feeding Frenzy (v1.83.1): its merges are the small ones (size 4 or less); little fish hop out of the fruit it made, fall straight through the pile to the bottom of the jar and flop about on their side like fish out of water, then vanish in a puff. Frenzy sends 3, one of them a goldfish. Drawn over the fruit, they touch nothing */
 fry:{hit(s,o,A,g){const n=o.src==='frenzy'?3:2,R=o.r||16,K=g.K;for(let k=0;k<n;k++){const sd=k===2?0:(k%2?-1:1),a=-Math.PI/2+sd*(.35+Math.random()*.3),v=(230+Math.random()*50)*K,gold=o.src==='frenzy'&&k===1;
   A.add({k:'fn',x:o.x+sd*R*.25,y:o.y-R*.55,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:900*K,T:5,dl:k*.08,fa:.97,fl:0,dd:sd||1,ft:0,d:(c,q,g2)=>{const P=g2.P,fy=g2.bot-3*P;if(q.x<g2.L+7*P){q.x=g2.L+7*P;q.vx=Math.abs(q.vx);}if(q.x>g2.R-7*P){q.x=g2.R-7*P;q.vx=-Math.abs(q.vx);}
    if(q.pf)return;if(q.vy>0&&q.y>=fy){q.y=fy;q.fl++;if(!q.ft)q.ft=q.t;q.dd=Math.random()<.65?-q.dd:q.dd;if(q.fl<6){q.vy=-(110+Math.random()*60)*K;q.vx=q.dd*(25+Math.random()*35)*K;}else{q.vy=0;q.vx=0;q.g=0;}}
    if(q.ft&&q.t>q.ft+1.9&&!q.pf){q.pf=1;q.T=q.t+.01;A.burst(q.x,q.y,gold?['o','y','w']:['b','i','w'],8,{v:80,vy:-40,g:160,T:.4});return;}
    const land=!!q.ft,air=q.vy!==0,pitch=!land?(q.vy<-.8*Math.abs(q.vx)?-.5:q.vy>.8*Math.abs(q.vx)?.5:0):(air?(q.vy<0?-.5:.5)*(fst(q.t,8)%2?1:0):0);fxFish(c,q.x,q.y,P,q.vx?(q.vx>0?1:-1):q.dd,pitch,fst(q.t+k*.05,land&&!air?18:10)%2,gold);}});}}},
 juicer:{hit(s,o,A,g){const sm=o.src==='smoothie',col=sm?(Math.random()<.5?'#ff8fab':(FRUIT[o.l]||FRUIT[0])[0]):(FRUIT[o.l]||FRUIT[0])[0],P=g.P;if(sm)A.burst(o.x,o.y-(o.r||16)*.3,['y','Y','h'],6,{v:90,vy:-40,g:600,T:.6,s:2});A.burst(o.x,o.y-(o.r||16)*.3,[col,col,'w'],8,{v:140,vy:-60,g:500,T:.45,s:2});for(let k=0;k<9;k++){const a=-Math.PI*(.1+.8*Math.random()),v=180+Math.random()*200;A.add({k:'fn',x:o.x,y:o.y-(o.r||16)*.3,vx:Math.cos(a)*v*(Math.random()<.5?-1:1),vy:Math.sin(a)*v,g:900,T:1.6,fa:.8,col,st:0,d:(c,q,g)=>{const P=g.P;if(!q.st&&(q.x<=g.L+P||q.x>=g.R-2*P)){q.st=1;q.sx=q.x<=g.L+P?g.L:g.R-2*P;q.sy=q.y;q.vx=0;q.vy=16;q.g=0;q.T=q.t+1.4;}if(q.st){q.x=q.sx;const len=Math.max(1,Math.round((q.y-q.sy)/P));c.globalAlpha*=.85;fxR(c,q.x-P,q.sy-P,P,q.col,4,2);for(let j=0;j<len;j++)fxR(c,q.x,q.sy+j*P,P,q.col,2,1);fxR(c,q.x,q.y,P,q.col,2,3);fxR(c,q.x,q.y,P,'w');}else{fxR(c,q.x,q.y,P,q.col,2,2);fxR(c,q.x,q.y,P,'w');if(q.vy>0&&q.y>g.bot-2*P)q.T=q.t;}}});}}},
 /* Heavyweight: a size 6+ merge it scores on lands like a wrestler: impact lines, a shockwave along the ground and dust kicked out */
 heavy:{hit(s,o,A,g){if(o.src==='mania'&&o.l<5)return;const r=o.r||30,gy=o.y+r*.6;if(o.src==='mania')A.burst(o.x,o.y,['g','G','r','w'],12,{v:200,vy:-120,g:500,T:.7,s:2});A.add({k:'fn',x:o.x,y:o.y,T:.16,fa:1,d:(c,q,g)=>{const P=g.P;for(let k=0;k<10;k++){const a=k*Math.PI/5+.3;for(let d=1.2;d<1.95;d+=.1){fxR(c,q.x+Math.cos(a)*r*d,q.y+Math.sin(a)*r*d,P,'k');fxR(c,q.x+Math.cos(a)*r*d+P,q.y+Math.sin(a)*r*d,P,'k');}}}});
   A.add({k:'fn',x:o.x,y:gy,T:.5,fa:.4,d:(c,q,g)=>{const P=g.P,u=q.t/.5,R=r*(1+u*2.6);for(let k=0;k<64;k++){const a=k/64*Math.PI*2,x=q.x+Math.cos(a)*R,y=q.y+Math.sin(a)*R*.32;fxR(c,x,y+P,P,'k');fxR(c,x,y,P,'w');fxR(c,x,y-P,P,'s');}}});
   for(let k=0;k<12;k++){const d=k%2?1:-1;A.add({k:'fn',x:o.x+d*r*.5,y:gy,vx:d*(90+Math.random()*140),vy:-30-Math.random()*50,g:100,dr:2.2,T:.8,fa:.3,z:2+Math.floor(Math.random()*2),d:(c,q,g)=>{const P=g.P,z=q.z+Math.floor(q.t*4);fxR(c,q.x-z*P/2,q.y-z*P/2,P,'d',z,z);fxR(c,q.x-z*P/2,q.y-z*P/2,P,'s',z-1,z-1);}});}}},
 /* Snake Eyes: when it hits, two dice tumble into the jar, bounce and land on double one */
 snake:{hit(s,o,A,g){const P=g.P,fy=o.y-(o.r||16)-6*P;for(const d of[-1,1]){const x0=o.x+d*7*P;A.add({k:'fn',x:x0-d*30,y:g.top-30,vx:d*30,vy:60,g:1300,T:1.4,fa:.75,fy,bo:.45,sd:Math.random()*9,d:(c,q,g)=>{const P=g.P,mv=Math.abs(q.vy)>40||q.t<.5,f=mv?1+Math.floor(fhs(q.sd,Math.floor(q.t*14))*6):1,r=mv?Math.floor(q.t*12)%4:0;fxDie(c,q.x,q.y,P,f,r);}});}}},
 /* Double or Nothing: every merge flips a coin. Heads it lands gold and sparkles (×2), tails it lands dull and puffs (×0.75) */
 dnoth:{hit(s,o,A,g){const tl=!!o.tails,y0=o.y-(o.r||16);A.add({k:'fn',x:o.x,y:y0,vy:-340,g:1100,T:1,fa:.8,fy:y0,bo:0,end:null,land:0,d:(c,q,g)=>{const P=g.P,up=q.t<.6;if(!up&&!q.land){q.land=1;if(tl)A.burst(q.x,q.y,['s','d','D'],8,{v:60,vy:-30,g:-20,T:.5,s:2});else for(let k=0;k<5;k++){const a=k*Math.PI*2/5;A.add({k:'star',x:q.x+Math.cos(a)*24,y:q.y+Math.sin(a)*24,T:.45,dl:k*.04,col:o.src==='allin'?'g':'y'});}}const w=up?[5,3,1,3][Math.floor(q.t*16)%4]:5;fxCoin(c,q.x,q.y,P,w,!up&&tl);}});}}});

/* Magpie (and Treasure Hunter): a magpie perches on a gold fruit and every few seconds flies to the next one, riding along as the fruit moves. With no gold fruit it waits on the rim. A merge it scores on: it pecks and steals a glint */
FXS.magpie={pick(s,gl){const o=gl.filter(q=>!s.tg||q.f!==s.tg.f);return o.length?o[Math.floor(Math.random()*o.length)]:gl[0]||null;},
 perch(s,g){if(s.tg)return[s.tg.f.x,s.tg.f.y-s.tg.r*.82];return[fxRX('magpie',.56,50,g),fxRim(g)];},
 tick(s,g,dt,A){const gl=(s.l.g||[]).filter(q=>q.f&&!q.f.dead&&q.f.gold);s.ft=(s.ft||0)+dt;s.st=s.st||'gone';for(const k of['pk','cw','vis'])if(s[k]>0)s[k]-=dt;
  if(!s.l.p){if(s.st!=='gone'&&s.st!=='out'){s.st='out';s.ft=0;s.x0=s.bx;s.y0=s.by;}}
  else if(s.st==='gone'){s.tg=FXS.magpie.pick(s,gl);s.st='fly';s.ft=0;s.x0=g.W+30;s.y0=fxRim(g)-160;s.T=1;}
  const lost=s.tg&&!gl.includes(s.tg)&&!gl.some(q=>q.f===s.tg.f);if(s.l.p&&!(s.vis>0)&&(s.st==='sit'||s.st==='fly')&&(lost||(!s.tg&&gl.length))){s.x0=s.bx;s.y0=s.by;s.tg=FXS.magpie.pick(s,gl.filter(q=>!s.tg||q.f!==s.tg.f));s.st='fly';s.ft=0;const[px,py]=FXS.magpie.perch(s,g);s.T=Math.max(.45,Math.min(1.1,Math.hypot(px-s.x0,py-s.y0)/260));}
  if(s.st==='sit'){const[px,py]=FXS.magpie.perch(s,g);s.bx=px;s.by=py;s.sd=(s.sd==null?3:s.sd)-dt;if(s.sd<=0&&gl.length>1&&!(s.vis>0)){s.x0=s.bx;s.y0=s.by;s.tg=FXS.magpie.pick(s,gl);s.st='fly';s.ft=0;const[qx,qy]=FXS.magpie.perch(s,g);s.T=Math.max(.45,Math.min(1.1,Math.hypot(qx-s.x0,qy-s.y0)/260));}}
  else if(s.st==='fly'){const[px,py]=FXS.magpie.perch(s,g),u=Math.min(1,s.ft/s.T),e=u<.5?2*u*u:1-2*(1-u)*(1-u);s.dir=px>s.x0?1:-1;s.bx=s.x0+(px-s.x0)*e;s.by=s.y0+(py-s.y0)*e-Math.sin(u*Math.PI)*Math.min(70,30+Math.abs(px-s.x0)*.3);if(u>=1){s.st='sit';s.sd=2.4+Math.random()*2.2;s.pk=.25;A.add({k:'star',x:px,y:py-2*g.P,T:.4,col:'y'});}}
  else if(s.st==='out'){const u=Math.min(1,s.ft/1.1);s.dir=-1;s.bx=s.x0-u*g.W*.8;s.by=s.y0-u*u*320;if(u>=1){s.st='gone';s.tg=null;}}},
 front(c,g,s,t){if(!s.st||s.st==='gone'||s.bx==null)return;const P=g.P,lk=s.l.lk||'';let fr='mp0',fl=0;const fly=s.st==='fly'||s.st==='out';if(fly){fr=fst(t,12)%2?'mpF0':'mpF1';fl=s.dir>0?1:0;}else{if(s.pk>0)fr='mpP';else if(s.cw>0)fr=fst(s.cw,10)%2?'mpP':'mp0';fl=s.tg&&s.tg.f.x<(g.L+g.R)/2?1:0;}
  if(lk==='flock'){const ox=s.bx+(fl?-1:1)*14*P,oy=s.by-8*P-(fst(t,3)%2?P:0);fxS(c,fst(t+.3,12)%2?'mpF0':'mpF1',ox,oy,P,{fl});}
  fxS(c,fr,s.bx,s.by,P,{fl});const C=(col,row,k)=>fxR(c,s.bx+((fl?15-col:col)-8)*P,s.by-(11-row)*P,P,k),hy=fly?1:0;
  if(lk==='crown'){C(4,-1+hy,'k');C(5,-1+hy,'y');C(6,-1+hy,'y');C(7,-1+hy,'k');C(4,-2+hy,'y');C(6,-2+hy,'y');C(5,-1+hy,'r');}
  else if(lk==='mask'&&!fly){for(const col of[3,4,5,6])C(col,4,'r');C(7,5,'r');C(7,6,'R');C(0,3,'y');C(0,2,'Y');}},
 ev(s,n,o,A,g){if(n!=='mag'||!s.l.p||!o.f)return;if(s.bx==null||s.st==='gone'){s.bx=g.W+30;s.by=fxRim(g)-160;}s.x0=s.bx;s.y0=s.by;s.tg={f:o.f,r:o.r};s.st='fly';s.ft=0;s.vis=1.4;const px=o.x,py=o.y-o.r*.82;s.T=Math.max(.35,Math.min(.8,Math.hypot(px-s.x0,py-s.y0)/320));
  A.add({k:'fn',x:o.x,y:o.y,T:.6,dl:1.05,fa:.5,d:(c,q,g)=>{const f=o.f,u=(q.t-1.05)/.6,P=g.P;for(let k=0;k<6;k++){const a=k*1.047+u*2,r2=(o.r||20)*(.6+u*.7);fxStar(c,f.x+Math.cos(a)*r2,f.y+Math.sin(a)*r2,P,u<.5?2:1,'y');}}});},
 hit(s,o,A,g){if(s.st!=='sit')return;s.pk=.3;s.cw=.5;const P=g.P;A.add({k:'star',x:s.bx,y:s.by+2*P,T:.45,col:'y'});A.add({k:'spr',sp:'nt',x:s.bx,y:s.by-9*P,vy:-40,vx:(Math.random()-.5)*30,T:.9,fa:.5,sw:4,sf:6});}};
/* ---------- bosses (v1.78): every boss arrives in the sky above the jar while its banner is up, changes the jar's air for that jar, performs its rule where you can see it,
   transforms at phase 2 and reacts when beaten. Scenes are FXS entries named B_<rule>, live state from the engine: {p: the rule is on this jar, ph: phase, done: jar cleared, ...}.
   bossT(s) keeps the shared clocks: s.age since it arrived, s.p2t since phase 2, s.dnt since beaten (null until then). ---------- */
/* boss monster helpers (v1.87): fxMD puts a disc of cells into a map (col may be a function of the cell, returning null to skip it), fxFade keeps the cells a Bayer dissolve at u (0 to 1) would show */
function fxMD(m,cx,cy,r,col){const ri=Math.ceil(r),bx=Math.round(cx),by=Math.round(cy);for(let j=-ri;j<=ri;j++)for(let i=-ri;i<=ri;i++)if(i*i+j*j<=r*r+.3){const ai=bx+i,aj=by+j,v=typeof col==='function'?col(i,j,ai,aj):col;if(v)m.set(ai+','+aj,v);}}
function fxFade(m,u){if(u>=1)return m;const o=new Map();if(u<=0)return o;for(const[k,v]of m){const[i,j]=k.split(',').map(Number);if(FBY[((i+64)&3)*4+((j+64)&3)]/16<u*1.15-.1)o.set(k,v);}return o;}
/* Boss arenas (v1.88, the user's ask: like stumbling on a boss in Elden Ring, every boss brings a place of its own). Drawn behind the jar by fx.arena (the engine calls it after drawBg, before drawJar) and over the glass at the start of fx.back (a tint, the weather falling into the jar). They fade in as the boss arrives, thicken in phase 2 and clear when it is beaten.
   ARENA[scene id] = {sky:[top, horizon] colours, gr: ground colour below the horizon, sc: scenery kind on the horizon (SCN), sk:[far, near] scenery colours, o: scenery options, cl: clouds {n, v px/s (sign = direction), c:[body, underside], y:[top, bottom] share of the sky, s: size}, wx: weather kind (fxWx), wn: amount, wc: weather colours, dk: darkness over the scene 0 to 1, jar:[tint, alpha] over the glass, st: stars, fl: lightning, vg: vignette, sun:[colour, x share, y share, radius]} */
const ARENA={
 B_tax:{sky:['#4f566e','#9e9aae'],gr:'#5d5f73',sc:'city',sk:['#7b7d94','#4b4d63'],o:{win:['#ffd43b','#fff2a8']},cl:{n:6,v:-18,c:['#6d7287','#565a6e'],y:[.05,.35],s:1.2},wx:'rain',wn:.6,dk:.12,jar:['#5d6075',.08],vg:.3},
 B_storm:{sky:['#161a2c','#353e58'],gr:'#1c2134',sc:'hills',sk:['#2a3149','#181c2c'],cl:{n:18,v:-300,c:['#4a5372','#232840'],y:[-.05,.85],s:1.9},wx:'rain',wn:2.2,dk:.38,jar:['#1b2240',.22],fl:1,vg:.7},
 B_ice:{sky:['#8fbfe6','#e3f2ff'],gr:'#cfe4f5',sc:'mounts',sk:['#b2cae3','#7898bd'],o:{snow:1},cl:{n:5,v:-30,c:['#e8f2fb','#c4d6e8'],y:[.05,.4],s:1.3},wx:'snow',wn:1.2,dk:0,jar:['#bfe3ff',.14]},
 B_thief:{sky:['#141832','#352f5e'],gr:'#1a1a2e',sc:'city',sk:['#2a2a4e','#15152a'],o:{win:['#ffd43b'],chim:1},st:1,cl:{n:3,v:-14,c:['#2a2a4a','#1e1e38'],y:[.1,.4],s:1},dk:.22,jar:['#2a2350',.1],vg:.5},
 B_melon:{sky:['#ff9e6b','#ffe4bf'],gr:'#e9b47c',sc:'castle',sk:['#e8a87a','#b97a4c'],o:{flag:'#e63946'},cl:{n:5,v:-16,c:['#ffd0a8','#f0a87a'],y:[.05,.4],s:1.3},wx:'petals',wn:.8,wc:['#ff4d8d','#ff8fab','#ffd43b'],sun:['#fff2a8',.78,.55,9],jar:['#ffd8a8',.06]},
 B_clock:{sky:['#2f2b52','#7d6494'],gr:'#2f2b48',sc:'gears',sk:['#4d4673','#332e52'],wx:'dust',wn:.7,wc:['#ffd43b','#fff2a8'],st:1,dk:.12,jar:['#4d4673',.08]},
 B_fog:{sky:['#98a3a8','#d3d9d9'],gr:'#8a9396',sc:'trees',sk:['#8e989b','#6d7578'],o:{k:'dead'},wx:'fog',wn:1,dk:.05,jar:['#c9d2d4',.16]},
 B_hour:{sky:['#f0a24c','#fde2ae'],gr:'#e6b267',sc:'dunes',sk:['#e2a45a','#c3863d'],wx:'sand',wn:1.2,wc:['#f7d08a','#e6b267'],sun:['#fff6c8',.25,.45,10],jar:['#f5d29a',.1]},
 B_wilt:{sky:['#b8926a','#e8cfab'],gr:'#9a7a58',sc:'trees',sk:['#a3866a','#735a42'],o:{k:'dead'},cl:{n:4,v:-20,c:['#d6bc98','#b89c78'],y:[.05,.35],s:1.2},wx:'leaves',wn:1,wc:['#a9713a','#c48a52','#6e4420'],dk:.06,jar:['#d9c09a',.1]},
 B_lock:{sky:['#33363f','#5a5d68'],gr:'#2e3038',sc:'hall',sk:['#4a4d58','#2c2e36'],o:{bars:1},wx:'dust',wn:.5,wc:['#8f8a99','#c9c3d4'],dk:.2,jar:['#4a4d58',.12],vg:.5},
 B_gamble:{sky:['#22093a','#55185a'],gr:'#1c0a2a',sc:'city',sk:['#3a1450','#1e0a2e'],o:{win:['#ff4d8d','#35c2b4','#ffd43b','#4cc9f0'],neon:1},st:1,wx:'coins',wn:.7,dk:.12,jar:['#55185a',.08],vg:.4},
 B_twins:{sky:['#2b0a1e','#b8475a'],gr:'#2a0f1d',sc:'trees',sk:['#5a1d35','#36102a'],o:{k:'cherry'},cl:{n:6,v:-24,c:['#4a1a32','#2e0d1f'],y:[.05,.4],s:1.3},wx:'petals',wn:.9,wc:['#ff8fab','#e63946','#a3202c'],sun:['#ff8f8f',.8,.34,13],dk:.14,jar:['#5a1d35',.07],vg:.4},
 B_miser:{sky:['#24190f','#47341f'],gr:'#1f160c',sc:'city',sk:['#3a2a18','#20160c'],o:{win:['#fb8500','#ffd43b'],chim:1},st:1,wx:'dust',wn:.5,wc:['#e09600','#c48a52'],dk:.28,jar:['#3a2c1a',.12],vg:.75},
 B_stone:{sky:['#c49a72','#ead0b0'],gr:'#a8845e',sc:'mounts',sk:['#a37a56','#77573c'],wx:'pebbles',wn:.6,wc:['#8f8a99','#5f5a6b'],cl:{n:3,v:-14,c:['#e0c6a6','#c8a886'],y:[.05,.3],s:1.1},jar:['#c9a27d',.08]},
 B_mirror:{sky:['#311a52','#74499c'],gr:'#2a1640',sc:'mounts',sk:['#5a3a86','#3a2160'],o:{shard:1},wx:'sparkle',wn:1,wc:['#ffffff','#c9b3ff','#4cc9f0'],st:1,dk:.1,jar:['#c9b3ff',.1],vg:.4},
 B_glut:{sky:['#4e2214','#8a4626'],gr:'#3a180c',sc:'hall',sk:['#6a3420','#3e1c0e'],o:{col:1,ban:'#e63946'},wx:'embers',wn:.6,dk:.15,jar:['#8a4a2a',.08],vg:.5},
 B_sticky:{sky:['#6e3410','#d98538'],gr:'#5a2a0c',sc:'trees',sk:['#a85a26','#6a3010'],o:{k:'maple'},cl:{n:4,v:-18,c:['#e8a060','#c07838'],y:[.05,.35],s:1.2},wx:'drip',wn:.8,wc:['#e09600','#fb8500'],dk:.08,jar:['#e09600',.1]},
 B_swarm:{sky:['#45553a','#8a9a68'],gr:'#3a4a2c',sc:'swamp',sk:['#55663f','#2e3a22'],wx:'gnats',wn:1.4,dk:.14,jar:['#6a7a4a',.1],vg:.4},
 B_rot:{sky:['#262f1c','#556536'],gr:'#1c2414',sc:'swamp',sk:['#36422a','#1c2412'],o:{mush:1},cl:{n:6,v:-22,c:['#3e4a2c','#2a3420'],y:[.05,.5],s:1.3},wx:'spores',wn:1.3,wc:['#b6e36a','#b388eb','#7bc950'],dk:.24,jar:['#4a5a2a',.04],vg:.6},
 B_tide:{sky:['#0c1a36','#2a4a78'],gr:'#0c1a36',sc:'waves',sk:['#24467a','#163260'],st:1,cl:{n:7,v:-120,c:['#1c2c4c','#0e1a30'],y:[0,.5],s:1.4},wx:'rain',wn:.9,dk:.22,jar:['#1f4a7a',0],fl:1,vg:.5},
 B_dark:{sky:['#04050a','#0e1020'],gr:'#04050a',dk:.35,wx:'moths',wn:.5,vg:.9},
 B_collect:{sky:['#342a40','#665670'],gr:'#2a2034',sc:'hall',sk:['#4e4060','#2e2440'],o:{col:1,frame:1},wx:'dust',wn:.6,wc:['#ffd43b','#fff2a8'],dk:.1,jar:['#6a5a76',.06],vg:.5},
 B_slick:{sky:['#202b3a','#465668'],gr:'#1a2430',sc:'city',sk:['#34445a','#1c2636'],o:{win:['#4cc9f0','#fff2a8']},cl:{n:8,v:-60,c:['#2c3a4c','#1c2636'],y:[0,.4],s:1.3},wx:'rain',wn:1.5,dk:.2,jar:['#5a7a9a',.12],vg:.5},
 B_lid:{sky:['#bfa47e','#e8d6b4'],gr:'#a88c66',sc:'hall',sk:['#a88c66','#7a6244'],o:{shelf:1},wx:'steam',wn:.8,jar:['#e8d6b4',.06]},
 B_audit:{sky:['#8d98a6','#cfd6dd'],gr:'#7d8896',sc:'city',sk:['#a3adb9','#6a7584'],o:{win:['#e3f3ff','#a8cfe8'],tall:1},cl:{n:4,v:-20,c:['#dde3e9','#b9c3cd'],y:[.05,.35],s:1.2},wx:'paper',wn:.6,jar:['#c0c8d0',.06]},
 B_vise:{sky:['#24140e','#5a2818'],gr:'#1a0e08',sc:'city',sk:['#3e2014','#1e0e08'],o:{win:['#fb8500'],chim:1,fac:1},wx:'sparks',wn:1,dk:.22,jar:['#5a2a1a',.1],vg:.55},
 B_vamp:{sky:['#22060f','#561226'],gr:'#1a040a',sc:'swamp',sk:['#3e0c1a','#22060e'],st:1,cl:{n:5,v:-40,c:['#3a0c18','#22060e'],y:[0,.4],s:1.3},wx:'drip',wn:.6,wc:['#a3202c','#e63946'],dk:.28,jar:['#5a1428',.15],vg:.65},
 B_reaper:{sky:['#0e0a18','#291c3a'],gr:'#0c0814',sc:'grave',sk:['#2c2040','#120c1e'],st:1,cl:{n:6,v:-50,c:['#22182e','#120c1c'],y:[0,.45],s:1.4},wx:'ash',wn:1,wc:['#5f5a6b','#8f8a99'],dk:.36,jar:['#2a1c3a',.2],vg:.85},
 B_prune:{sky:['#58784a','#a6c68e'],gr:'#4a6a3c',sc:'hedge',sk:['#4f7a44','#2f5428'],cl:{n:4,v:-20,c:['#d8e8c8','#b0c8a0'],y:[.05,.35],s:1.2},wx:'leaves',wn:.8,wc:['#7bc950','#38862a','#b6e36a'],jar:['#7aa060',.06]},
 B_queen:{sky:['#401636','#c45c78'],gr:'#2a0e24',sc:'castle',sk:['#6a2a52','#3a1430'],o:{flag:'#ffd43b'},st:1,cl:{n:5,v:-26,c:['#7a3058','#4a1838'],y:[.05,.4],s:1.3},wx:'petals',wn:.9,wc:['#e63946','#ff4d8d','#ffd43b'],sun:['#ffd6a5',.2,.6,8],dk:.1,jar:['#c9607a',.08],vg:.5}};
const FXAR_PRI=['B_queen','B_reaper','B_melon'];
function fxArPick(S){for(const id of FXAR_PRI)if(S[id]&&S[id].p>0)return id;for(const id in ARENA)if(S[id]&&S[id].p>0)return id;return null;}
function fxArU(s){return Math.min(1,s.age/1.6)*(s.dnt!=null?Math.max(0,1-s.dnt/2.6):1)*s.p;}
function fxHx(a,b,u){const p=h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)),A=p(a),B=p(b);return'#'+A.map((v,i)=>Math.round(v+(B[i]-v)*u).toString(16).padStart(2,'0')).join('');}
/* scenery: far and near silhouettes along the horizon, one column of cells at a time, with details */
const fxTw=(x,p,a)=>a*(1-Math.abs(((x/p)%1)*2-1));
const SCN={
 hills:{f:i=>7+Math.round(4*Math.sin(i*.06)+2*Math.sin(i*.17)),n:i=>3+Math.round(2.5*Math.sin(i*.1+2)+1.5*Math.sin(i*.29))},
 mounts:{f:i=>5+Math.round(fxTw(i+3,23,13)+fxTw(i,9,3)),n:i=>2+Math.round(fxTw(i+11,17,8)+fxTw(i,5,1.5))},
 dunes:{f:i=>5+Math.round(3*Math.sin(i*.045)+2*Math.sin(i*.12)),n:i=>2+Math.round(2.4*Math.sin(i*.08+1)+1)},
 waves:{f:i=>4,n:i=>1},
 city:{f:i=>{const b=Math.floor(i/5);return 7+Math.floor(fhs(b,7)*11);},n:i=>{const b=Math.floor((i+2)/4);return 3+Math.floor(fhs(b,9)*8);}},
 hall:{f:i=>15,n:i=>1},
 castle:{f:i=>5+Math.round(2*Math.sin(i*.08)),n:i=>2+Math.round(1.5*Math.sin(i*.2))},
 trees:{f:i=>4+Math.round(1.5*Math.sin(i*.09)),n:i=>1+(fhs(i,5)>.6?1:0)},
 swamp:{f:i=>3+Math.round(1.5*Math.sin(i*.07)),n:i=>1},
 grave:{f:i=>4+Math.round(1.5*Math.sin(i*.08)),n:i=>1},
 hedge:{f:i=>{const b=Math.floor(i/7);return 6+Math.floor(fhs(b,3)*5);},n:i=>2},
 gears:{f:i=>2,n:i=>1}};
const FXSC={};
function fxScnC(c,g,a,t,id){const Q=fxBP(g),hz=fq(fxRim(g)+6,Q),key=id+'|'+g.W+'|'+g.H+'|'+Q+'|'+hz;let cv=FXSC[key];if(!cv){cv=document.createElement('canvas');cv.width=Math.ceil(g.W);cv.height=hz;const x=cv.getContext('2d');fxScn(x,g,a,0,1);FXSC[key]=cv;}c.drawImage(cv,0,0);fxScn(c,g,a,t,2);}
function fxScn(c,g,a,t,md=3){const Q=fxBP(g),hz=fq(fxRim(g)+6,Q),N=Math.ceil(g.W/Q)+2,S=SCN[a.sc],o=a.o||{},[cf,cn]=a.sk||['#888888','#555555'],ST=md&1,AN=md&2,col0=(i,h,cc)=>{if(h>0){c.fillStyle=cc;c.fillRect(i*Q,hz-h*Q,Q,h*Q);}},cel0=(i,j,cc)=>{c.fillStyle=cc;c.fillRect(i*Q,hz-(j+1)*Q,Q,Q);},col=(i,h,cc)=>{if(ST)col0(i,h,cc);},cel=(i,j,cc)=>{if(ST)cel0(i,j,cc);},cela=(i,j,cc)=>{if(AN)cel0(i,j,cc);};if(!S)return;
 const hs=a.sc==='hall'||a.sc==='gears'||a.sc==='waves'?1:(a.hs||1.5),fh=[],nh=[];for(let i=0;i<N;i++){fh[i]=Math.round(S.f(i)*hs);nh[i]=Math.round(S.n(i)*(hs>1?1.3:1));}
 /* far layer extras */
 if(a.sc==='castle'){const c0=Math.round(N*.55),tw=[c0,c0+9,c0+18,c0+27];for(let i=c0;i<=c0+27;i++)fh[i]=Math.max(fh[i],12+((i-c0)%2===0?1:0));for(const x of tw)for(let d=-1;d<=1;d++)fh[x+d]=Math.max(fh[x+d],x===c0+9||x===c0+18?20:17);}
 if(a.sc==='gears'){fh.fill(3);}
 if(o.chim)for(let i=3;i<N;i+=11)fh[i]+=5;
 if(o.tall)for(let i=0;i<N;i++)fh[i]=Math.round(fh[i]*1.5);
 for(let i=0;i<N;i++)col(i,fh[i],cf);
 /* far details */
 if(a.sc==='castle'){const c0=Math.round(N*.55);for(const x of[c0+9,c0+18]){for(let j=21;j<25;j++)cel(x,j,'#2a1a3a');const wv=fst(t,4)%2;cela(x+1,24,o.flag||'#e63946');cela(x+2,24-wv,o.flag||'#e63946');cela(x+1,23,o.flag||'#e63946');}for(let i=c0+2;i<c0+26;i+=4)cel(i,8,'#ffd43b');}
 if(o.win){const W=o.win;for(let i=0;i<N;i++)for(let j=2;j<fh[i]-1;j+=2){if(i%2===0||fhs(i*3,j)<.55)continue;const on=o.neon?fst(t+fhs(i,j)*3,2)%2:fhs(Math.floor(t*.1)+i,j)>.25;if(on)cela(i,j,W[Math.floor(fhs(i,j+1)*W.length)]);}}
 if(o.chim){for(let i=3;i<N;i+=11){for(let k=0;k<4;k++){const u=((t*.25+k*.25+i*.07)%1),sx=i+Math.round(u*4),sy=fh[i]+1+Math.round(u*8),r=1+Math.floor(u*2);c.globalAlpha*=1;for(let dj=-r+1;dj<r;dj++)for(let di=-r+1;di<r;di++)if(FBY[((di+8)&3)*4+((dj+8)&3)]/16<.7-u*.6)cela(sx+di,sy+dj,o.fac?'#5f5a6b':'#4a4560');}}}
 if(a.sc==='mounts'&&o.snow)for(let i=0;i<N;i++){const h=fh[i];if(h>10){cel(i,h-1,'#ffffff');if(h>13)cel(i,h-2,'#e3f3ff');}}
 if(a.sc==='mounts'&&o.shard)for(let k=0;k<6;k++){const sx=Math.round((k*.17+.05)*N),sy=fh[sx]+4+Math.round(Math.sin(t*1.2+k)*2+k%3*3);for(let d=0;d<3;d++){cela(sx,sy+d,d===1?'#c9b3ff':'#e3f3ff');}cela(sx-1,sy+1,'#74499c');cela(sx+1,sy+1,'#74499c');}
 if(a.sc==='hall'){for(let i=2;i<N;i+=10){for(let j=0;j<14;j++){cel(i,j,fxHx(cf,'#ffffff',.18));cel(i+1,j,fxHx(cf,'#ffffff',.1));}}if(o.bars)for(let i=6;i<N;i+=10)for(let j=5;j<11;j++){cel(i-1,j,'#15161c');cel(i+1,j,'#15161c');if(j===5||j===10)cel(i,j,'#15161c');}
  if(o.shelf)for(const j of[4,9])for(let i=0;i<N;i++){cel(i,j,'#5a4632');if(i%5===1){cel(i,j+1,'#e3f3ff');cel(i,j+2,'#e3f3ff');cel(i,j+3,'#a9713a');}}if(o.ban)for(let i=7;i<N;i+=10)for(let j=8;j<13;j++){cel(i,j,o.ban);if(j===8&&fst(t,3)%2)cela(i,j-1,o.ban);}if(o.frame)for(let i=6;i<N;i+=10){for(let j=6;j<11;j++){cel(i-1,j,'#e09600');cel(i+2,j,'#e09600');}for(let d=-1;d<=2;d++){cel(i+d,6,'#e09600');cel(i+d,10,'#e09600');}cel(i,8,'#ff4d8d');cel(i+1,8,'#ffd43b');}}
 if(a.sc==='gears'){const G=[[.2,9,1],[.38,6,-1.5],[.75,11,.8],[.9,5,-2]];for(const[fx,r,sp]of G){const cx=Math.round(fx*N),cy=r-2,an=t*sp*.5;for(let j=-r-2;j<=r+2;j++)for(let i=-r-2;i<=r+2;i++){const d=Math.hypot(i,j),aa=Math.atan2(j,i)-an,tooth=Math.cos(aa*8)>.3;if((d<=r||(d<=r+2&&tooth))&&d>r*.35)cela(cx+i,cy+j,d>r?cf:fxHx(cf,'#ffffff',.08));}}}
 if(a.sc==='trees'){const k=o.k||'pine';for(let x=2;x<N;x+=6+Math.floor(fhs(x,4)*4)){const h=6+Math.floor(fhs(x,6)*8),base=fh[x];if(k==='dead'){for(let j=0;j<h;j++)cel(x,base+j,cf);for(let b=0;b<3;b++){const by=base+3+b*2,sd=b%2?1:-1;for(let d=1;d<=2+b%2;d++)cel(x+sd*d,by+d,cf);}}else{for(let j=0;j<h-3;j++)cel(x,base+j,fxHx(cf,'#000000',.25));const r=k==='pine'?0:2+Math.floor(fhs(x,8)*2);if(k==='pine')for(let j=0;j<h;j++){const w=Math.max(0,Math.round((h-j)*.35));for(let d=-w;d<=w;d++)cel(x+d,base+2+j,cf);}else{for(let j=-r;j<=r;j++)for(let i=-r-1;i<=r+1;i++)if(i*i/((r+1)*(r+1))+j*j/(r*r)<=1)cel(x+i,base+h-r+j,k==='maple'&&fhs(x+i,j)>.7?fxHx(cf,'#fb8500',.4):cf);if(k==='cherry')for(const[i,j]of[[-1,0],[1,-1],[0,1]])cel(x+i,base+h-r+j,'#e63946');}}}}
 if(a.sc==='hedge'){for(let i=0;i<N;i++)if(i%7===3&&fh[i]>8){cel(i,fh[i],cf);cel(i,fh[i]+1,cf);cel(i-1,fh[i]+1,cf);cel(i+1,fh[i]+1,cf);cel(i,fh[i]+2,cf);}}
 if(a.sc==='waves'){for(let i=0;i<N;i++){if(((i+Math.floor(t*4))%9)===0)cela(i,fh[i]-1,'#4cc9f0');if(((i*3+Math.floor(t*2))%13)===0)cela(i,fh[i]-2,'#a8cfe8');}}
 if(a.sc==='swamp'&&o.mush){for(const[fx,h,r]of[[.12,9,4],[.3,6,3],[.68,11,5],[.88,7,3]]){const cx=Math.round(fx*N);for(let j=0;j<h;j++){cel(cx,fh[cx]+j,fxHx(cf,'#ffffff',.12));cel(cx+1,fh[cx]+j,cf);}for(let j=0;j<=r;j++){const w=Math.round(Math.sqrt(r*r+r-j*j));for(let i=-w;i<=w;i++)cel(cx+i,fh[cx]+h+j,(i+j)%4===0&&j>0?'#b6e36a':'#4a3a5a');}}}
 if(a.sc==='grave'){for(let x=3;x<N;x+=9){const base=fh[x];for(let j=0;j<8;j++)cel(x,base+j,cf);for(let b=0;b<3;b++){const sd=b%2?1:-1;for(let d=1;d<=2;d++)cel(x+sd*d,base+4+b*2+d,cf);}}}
 /* near layer */
 for(let i=0;i<N;i++)col(i,nh[i],cn);
 if(a.sc==='swamp'||a.sc==='trees'){for(let i=1;i<N;i+=3){if(fhs(i,2)<.4)continue;const h=2+Math.floor(fhs(i,3)*4);for(let j=0;j<h;j++)cel(i,nh[i]+j,cn);if(a.sc==='swamp'){cel(i,nh[i]+h,'#6e4420');cel(i,nh[i]+h+1,'#6e4420');}}}
 if(a.sc==='grave'){for(let x=1;x<N;x+=7){const tomb=fhs(x,4)>.5,base=nh[x];if(tomb){for(let j=0;j<3;j++)for(let d=0;d<2;d++)cel(x+d,base+j,cn);cel(x,base+3,cn);}else{for(let j=0;j<4;j++)cel(x,base+j,cn);cel(x-1,base+2,cn);cel(x+1,base+2,cn);}}}
 if(a.sc==='waves'){for(let i=0;i<N;i++)if(((i+Math.floor(t*6))%5)===0)cela(i,nh[i],'#4cc9f0');}}
/* clouds: puffs of cells drifting one way, wrapping round */
const FXCC={};
function fxCloI(k,w,h,Q,c0,c1){const key=k+'|'+w+'|'+h+'|'+Q+'|'+c0+c1;if(FXCC[key])return FXCC[key];const cv=document.createElement('canvas');cv.width=(2*w+1)*Q;cv.height=(2*h+1)*Q;const x=cv.getContext('2d');for(let j=-h;j<=h;j++)for(let i=-w;i<=w;i++){const e=(i*i)/(w*w)+(j*j)/(h*h)+(Math.abs(i)>w*.4?.2*Math.sin(i*.9+k):0);if(e>1)continue;if(e>.8&&FBY[((i+40)&3)*4+((j+40)&3)]/16>.5)continue;x.fillStyle=j>h*.3?c1:c0;x.fillRect((i+w)*Q,(j+h)*Q,Q,Q);}return FXCC[key]=cv;}
function fxClo(c,g,a,t,p2){const cl=a.cl;if(!cl)return;const Q=fxBP(g),hz=fxRim(g),n=Math.round(cl.n*(p2?1.4:1)),v=cl.v*(p2?1.4:1),span=g.W+260;for(let k=0;k<n;k++){const sc=(cl.s||1)*(.7+fhs(k,3)*.7),w=Math.round(12*sc),h=Math.round(5*sc),x=(((fhs(k,1)*span+t*v*(.6+fhs(k,2)*.8))%span)+span)%span-130,y=hz*(cl.y[0]+fhs(k,4)*(cl.y[1]-cl.y[0]));c.drawImage(fxCloI(k,w,h,Q,cl.c[0],cl.c[1]),fq(x,Q)-w*Q,fq(y,Q)-h*Q);}}
/* weather, drawn procedurally from the time so it costs nothing to keep; clip = only inside the jar */
function fxWx(c,g,a,t,p2,clip){const k=a.wx;if(!k)return;const W=g.W,H=g.H,P=g.P,n=Math.round(36*(a.wn||1)*(p2?1.5:1)),C=a.wc||['#a8cfe8','#e3f3ff'],y0=clip?fxRim(g):0,y1=clip?g.bot:H,x0=clip?g.L:0,x1=clip?g.R:W,sw=x1-x0,sh=y1-y0;if(sw<=0||sh<=0)return;
 const R=(x,y,cc,w=1,h=1)=>{c.fillStyle=cc;c.fillRect(fq(x,P),fq(y,P),w*P,h*P);},pos=(i,vx,vy)=>{const sp=.7+fhs(i,3)*.6;return[x0+((((fhs(i,1)*sw+vx*t*sp)%sw)+sw)%sw),y0+((((fhs(i,2)*sh+vy*t*sp)%sh)+sh)%sh)];};
 for(let i=0;i<n;i++){
  if(k==='rain'){const[x,y]=pos(i,-90,520);R(x,y,C[0]);R(x-P*.3,y+P,C[0]);R(x-P*.6,y+2*P,C[1]);}
  else if(k==='snow'){const wind=p2?-120:-25,[x,y]=pos(i,wind,50);R(x+Math.sin(t*2+i)*4,y,i%3?'#ffffff':'#e3f3ff',i%4?1:2,i%4?1:2);}
  else if(k==='spores'){const[x,y]=pos(i,10,-30);R(x+Math.sin(t+i)*6,y,C[i%C.length],i%5?1:2,i%5?1:2);}
  else if(k==='embers'){const[x,y]=pos(i,15,-60);if(fst(t+i*.13,8)%3)R(x+Math.sin(t*2+i)*4,y,i%2?'#fb8500':'#ffd43b');}
  else if(k==='leaves'){const[x,y]=pos(i,-40,45),f=fst(t+i,6)%2;R(x+Math.sin(t*1.5+i)*10,y,C[i%C.length],f?2:1,f?1:2);}
  else if(k==='ash'){const[x,y]=pos(i,-15,28);R(x+Math.sin(t+i)*5,y,C[i%C.length]);}
  else if(k==='sand'){const[x,y]=pos(i,-420,20);R(x,y,C[i%C.length],3,1);}
  else if(k==='coins'){const[x,y]=pos(i,0,60),f=fst(t*2+i,6)%3;R(x,y,'#e09600',f===1?1:2,2);if(f!==1)R(x,y,'#ffd43b');}
  else if(k==='petals'){const[x,y]=pos(i,-30,40),f=fst(t+i,5)%2;R(x+Math.sin(t*1.7+i)*12,y,C[i%C.length],f?2:1,1);}
  else if(k==='dust'){const[x,y]=pos(i,8,-6);if(fst(t*.7+i*.31,3)%3)R(x+Math.sin(t*.8+i)*8,y+Math.cos(t*.6+i)*6,C[i%C.length]);}
  else if(k==='drip'){const[x,y]=pos(i,0,140);R(x,y,C[i%C.length]);R(x,y+P,C[i%C.length]);R(x-P,y+P*2,C[0],3,1);}
  else if(k==='gnats'){const cx=x0+fhs(i%6,1)*sw,cy=y0+fhs(i%6,2)*sh*.5;R(cx+Math.sin(t*7+i*2.1)*18+Math.sin(t*1.3+i)*20,cy+Math.cos(t*6+i*1.7)*12,'#2a1a3a');}
  else if(k==='paper'){const[x,y]=pos(i,-30,35);if(i%3)continue;const f=fst(t+i,4)%2;R(x+Math.sin(t+i)*14,y,'#ffffff',f?3:2,f?2:3);R(x+Math.sin(t+i)*14,y,'#c9c3d4');}
  else if(k==='sparks'){const[x,y]=pos(i,40,-160);if(fst(t*3+i*.3,10)%4===0)continue;R(x,y,i%2?'#ffd43b':'#fb8500');R(x-P,y+P,'#e63946');}
  else if(k==='pebbles'){if(i%2)continue;const[x,y]=pos(i,0,110);R(x,y,C[i%C.length],2,2);}
  else if(k==='sparkle'){const[x,y]=pos(i,0,0),f=fst(t*1.5+i*.37,6)%6;if(f<3){R(x,y,C[i%C.length]);if(f===1){R(x-P,y,C[i%C.length]);R(x+P,y,C[i%C.length]);R(x,y-P,C[i%C.length]);R(x,y+P,C[i%C.length]);}}}
  else if(k==='steam'){if(i%2)continue;const[x,y]=pos(i,6,-28),r=2+(i%3);c.globalAlpha*=.6;for(let j=-r;j<=r;j++)for(let q=-r;q<=r;q++)if(q*q+j*j<=r*r&&FBY[((q+8)&3)*4+((j+8)&3)]<8)R(x+q*P+Math.sin(t+i)*6,y+j*P,'#ffffff');c.globalAlpha/=.6;}
  else if(k==='moths'){if(i>8)break;const cx=g.W*.5,cy=fxRim(g)-80*g.K,a2=t*(1+i*.2)+i;R(cx+Math.cos(a2)*(20+i*6),cy+Math.sin(a2*1.3)*(12+i*3),'#c9c3d4',fst(t*8+i,8)%2?2:1,1);}
  else if(k==='fog'){if(i>5)break;const fy=y0+sh*(.25+i*.13),fx=((t*(14+i*5)+i*170)%(sw+300))-150+x0,fw=110+i*20;for(let yy=-3;yy<=3;yy++)for(let xx=0;xx<fw;xx+=P){const e=Math.abs(yy)/3.5+Math.abs(xx-fw/2)/(fw/2)*.6;if(FBY[((Math.round(xx/P))&3)*4+((yy+8)&3)]/16>.75-e)continue;R(fx+xx,fy+yy*P,'#e6eaea');}}}}
/* the arena behind the jar */
function fxArena(c,g,A,id,s,t){const a=ARENA[id],u=fxArU(s);if(!a||u<=0)return;const p2=s.p2t!=null,hz=fq(fxRim(g)+6,fxBP(g));c.save();c.globalAlpha=Math.ceil(u*3)/3;
 const N=9;for(let k=0;k<N;k++){c.fillStyle=fxHx(a.sky[0],a.sky[1],k/(N-1));const y=Math.floor(hz*k/N);c.fillRect(-20,y,g.W+40,Math.ceil(hz/N)+1);}c.fillStyle=a.gr||a.sky[1];c.fillRect(-20,hz,g.W+40,g.H-hz+20);
 if(a.st){const Q=g.P;for(let i=0;i<50;i++){const x=fhs(i,11)*g.W,y=fhs(i,12)*hz*.75;if(fst(t*.8+fhs(i,13)*5,3)%3===0)continue;c.fillStyle=i%7?'#e3f3ff':'#fff2a8';c.fillRect(fq(x,Q),fq(y,Q),Q,Q);}}
 if(a.sun){const[sc,sx,sy,r]=a.sun,Q=fxBP(g),cx=fq(g.W*sx,Q),cy=fq(hz*sy,Q);for(let j=-r-2;j<=r+2;j++)for(let i=-r-2;i<=r+2;i++){const d=i*i+j*j;if(d<=r*r){c.fillStyle=sc;c.fillRect(cx+i*Q,cy+j*Q,Q,Q);}else if(d<=(r+2)*(r+2)&&FBY[((i+40)&3)*4+((j+40)&3)]<6){c.fillStyle=sc;c.globalAlpha*=.5;c.fillRect(cx+i*Q,cy+j*Q,Q,Q);c.globalAlpha/=.5;}}}
 fxClo(c,g,a,t,p2);fxScnC(c,g,a,t,id);
 fxWx(c,g,a,t,p2,0);
 const dk=(a.dk||0)+(p2?.08:0);if(dk>0){c.globalAlpha=Math.ceil(u*3)/3*dk;c.fillStyle='#0a0c18';c.fillRect(-20,-20,g.W+40,g.H+40);}
 if(a.vg){c.fillStyle='#05060c';for(let k=0;k<4;k++){c.globalAlpha=u*a.vg*.12;const w=(4-k)*10*g.K;c.fillRect(-20,-20,w+20,g.H+40);c.fillRect(g.W-w,-20,w+20,g.H+40);c.fillRect(-20,-20,g.W+40,w*.6+20);}}
 if(a.fl){const L=A.lt||(A.lt={n:2,f:0,x:0});L.n-=1/60;if(L.n<=0&&!RMO){L.n=2+Math.random()*(p2?2:4);L.f=.22;L.x=g.W*(.1+Math.random()*.8);L.sd=Math.random()*99;}if(L.f>0){L.f-=1/60;const Q=fxBP(g);c.globalAlpha=u*(L.f>.12?.45:.2);c.fillStyle='#e3f3ff';c.fillRect(-20,-20,g.W+40,hz+20);c.globalAlpha=u;let x=L.x;for(let y=0;y<hz-10*g.K;y+=Q){x+=(fhs(Math.round(y/Q),L.sd)-.5)*3*Q;c.fillStyle='#ffffff';c.fillRect(fq(x,Q),fq(y,Q),Q,Q);c.fillStyle='#ffd43b';c.fillRect(fq(x,Q)+Q,fq(y,Q),Q,Q);}}}
 c.restore();}
/* over the glass, behind the fruit: the arena's tint and its weather falling into the jar */
function fxArJar(c,g,A,id,s,t){const a=ARENA[id],u=fxArU(s);if(!a||u<=0)return;const p2=s.p2t!=null;c.save();if(a.jar){c.globalAlpha=Math.ceil(u*3)/3*(a.jar[1]+(p2?.04:0));c.fillStyle=a.jar[0];c.fillRect(g.L,fxRim(g),g.R-g.L,g.bot-fxRim(g));}c.globalAlpha=u*.55;c.beginPath();c.rect(g.L,fxRim(g),g.R-g.L,g.bot-fxRim(g));c.clip();if(a.wx&&a.wx!=='fog'&&a.wx!=='moths'&&a.wx!=='gnats')fxWx(c,g,a,t,p2,1);if(a.wx==='fog')fxWx(c,g,a,t,p2,1);if(A.lt&&A.lt.f>0&&ARENA[id].fl){c.globalAlpha=u*(A.lt.f>.12?.25:.1);c.fillStyle='#e3f3ff';c.fillRect(g.L,fxRim(g),g.R-g.L,g.bot-fxRim(g));}c.restore();}
function bossT(s,dt){const l=s.l;if(l.p&&!s.seen){s.seen=1;s.age=0;s.p2t=null;s.dnt=null;s.lt=null;}if(!l.p&&s.p<=0)s.seen=0;s.age=(s.age||0)+dt;if(l.ph>1&&s.p2t==null)s.p2t=0;else if(s.p2t!=null)s.p2t+=dt;if(l.done&&s.dnt==null)s.dnt=0;else if(s.dnt!=null)s.dnt+=dt;}
Object.assign(FXD,{
txS:`
....kkkkk....
....kVxxk....
....kVxxk....
....kVxxk....
....krrrk....
..kkkkkkkkk..
...kfffffk...
..kfwkfffk...
.kfffffffk...
..kNNNfffk...
...kkfffk....
...kwrkDDk...
..kDwrDDDDk..
..kDDrDDDDk..
..kDkDkDDDk..
..kDkfkDDDDk.
..kDDDDDDDDk.
...kDDkDDkk..
...kDDkDDk...
...kkk.kkk...`,
txW1:`
....kkkkk....
....kVxxk....
....kVxxk....
....kVxxk....
....krrrk....
..kkkkkkkkk..
...kfffffk...
..kfwkfffk...
.kfffffffk...
..kNNNfffk...
...kkfffk....
...kwrkDDk...
..kDwrDDDDk..
.kkDDrDDDDk..
kfkDDDDDDDk..
.kkDDDDDDDDk.
..kDDDDDDDDk.
..kDDk.kDDk..
.kDDk...kDDk.
.kkk.....kkk.`,
txW2:`
.............
....kkkkk....
....kVxxk....
....kVxxk....
....kVxxk....
....krrrk....
..kkkkkkkkk..
...kfffffk...
..kfwkfffk...
.kfffffffk...
..kNNNfffk...
...kkfffk....
...kwrkDDk...
..kDwrDDDDk..
..kDDrDDDDk..
..kDDkDkDDk..
..kDDkfkDDDk.
..kDDDDDDDDk.
....kDDDk....
....kkkk.....`,
txW3:`
....kkkkk....
....kVxxk....
....kVxxk....
....kVxxk....
....krrrk....
..kkkkkkkkk..
...kfffffk...
..kfwkfffk...
.kfffffffk...
..kNNNfffk...
...kkfffk....
...kwrkDDk...
..kDwrDDDDk..
..kDDrDDDDk..
..kDDDDDkDkk.
..kDDDDDkfkk.
..kDDDDDDDDk.
..kDDk.kDDk..
.kDDk...kDDk.
.kkk.....kkk.`,
txC:`
....kkkkk....
....kVxxk....
....kVxxk....
....kVxxk....
....krrrk....
..kkkkkkkkk..
...kfffffk...
..kfwkfffk...
.kfffffffk...
..kNNNfffk...
...kkfffk....
...kwrkDDk...
..kDwrDDDDk..
.kkDDrDDDDk..
kfkDDDDDDDk..
.kkDDDDDDDDk.
..kDDDDDDDDk.
...kDDkDDkk..
...kDDkDDk...
...kkk.kkk...`,
txD:`
....kkkkk....
....kVxxk....
....kVxxk....
....kVxxk....
....krrrk....
..kkkkkkkkk..
...kfffffk...
..kfykfffk...
.kfffffffk...
..kNNNfffk...
...kkfffk....
...kwrkDDk...
..kDwrDDDDk..
..kDDrDDDDk..
..kDkDkDDDk..
..kDkfkDDDDk.
..kDDDDDDDDk.
...kDDkDDkk..
...kDDkDDk...
...kkk.kkk...`,
thS:`
....kkkk....
...kVxxxk...
..kVxxxxxk..
..kkkkkkkkk.
...kffffffk.
..kkkkkkkkkk
..kfffkwkkk.
..kfffffffk.
...kfNNfffk.
....kkffkk..
...kwkwkwk..
..kkkkkkkkk.
..kwwwwwkfk.
..kkkkkkkfk.
...kwwwwkk..
...kVxxxk...
...kxkkxk...
...kxk.kxk..
..kkk..kkk..`,
thW1:`
....kkkk....
...kVxxxk...
..kVxxxxxk..
..kkkkkkkkk.
...kffffffk.
..kkkkkkkkkk
..kfffkwkkk.
..kfffffffk.
...kfNNfffk.
....kkffkk..
...kwkwkwkk.
..kkkkkkkkfk
..kwwwwwwkk.
..kkkkkkkk..
...kwwwwk...
...kVxxxk...
..kxk.kxxk..
.kxk...kxk..
.kk....kkk..`,
thW2:`
............
....kkkk....
...kVxxxk...
..kVxxxxxk..
..kkkkkkkkk.
...kffffffk.
..kkkkkkkkkk
..kfffkwkkk.
..kfffffffk.
...kfNNfffk.
....kkffkk..
...kwkwkwkk.
..kkkkkkkkfk
..kwwwwwwkk.
..kkkkkkkk..
...kwwwwk...
...kxxxkxk..
...kxxk.kk..
...kkk......`,
thC:`
............
............
............
....kkkk....
...kVxxxk...
..kVxxxxxk..
..kkkkkkkkk.
...kffffffk.
..kkkkkkkkkk
..kfffkwkkk.
..kfffffffk.
...kfNNfffk.
..kkkkkkkkk.
.kfkwkwkwkfk
.kkkkkkkkkk.
..kVxxxxxk..
.kxxk..kxxk.
.kxk....kxk.
.kkk....kkk.`,
thJ:`
.......kk...
......kfk...
......kfk...
....kkkfkk..
...kVxxxk...
..kVxxxxxk..
..kkkkkkkkk.
...kffffffk.
..kkkkkkkkkk
..kfffkwkkk.
..kfffffffk.
...kfNNfffk.
....kkffkk..
...kwkwkwk..
..kkkkkkkk..
..kwwwwwwk..
..kkkkkkkk..
...kVxxxk...
...kxk.kxk..
...kxk.kxk..
...kkk.kkk..`,
crown:`
.k....k....k.
kyk..kyk..kyk
kyyk.kyk.kyyk
kyyykyyykyyyk
kyryybyybyryk
kyyyyyyyyyyyk
kYYYYYYYYYYYk
.kkkkkkkkkkk.`});
function fxSack(c,x,y,P,z,on,open){x=fq(x,P);y=fq(y,P);const r=z;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){if(i*i+j*j>r*r+r*.6)continue;const e=(i+1)**2+j*j>r*r+r*.6||(i-1)**2+j*j>r*r+r*.6||i*i+(j+1)**2>r*r+r*.6||i*i+(j-1)**2>r*r+r*.6;fxR(c,x+i*P,y+j*P,P,e?'k':(i+j>r*.6?'N':i+j<-r*.6?'E':'e'));}if(open){fxR(c,x-3*P,y-(r+1)*P,P,'k',7,1);fxR(c,x-3*P,y-r*P,P,'k');fxR(c,x+3*P,y-r*P,P,'k');fxR(c,x-2*P,y-r*P,P,'x',5,1);fxR(c,x-2*P,y-(r+1)*P,P,'E',5,1);}else{fxR(c,x-P,y-(r+1)*P,P,'k',3,1);fxR(c,x-2*P,y-(r+2)*P,P,'k',1,1);fxR(c,x+2*P,y-(r+2)*P,P,'k',1,1);}if(on){fxR(c,x,y-P,P,'y');fxR(c,x,y+P,P,'y');fxR(c,x-P,y,P,'y',3,1);}}
/* a storm cloud: overlapping blobs, dark underneath, with a face; m = mood 0 grumpy, 1 shouting, 2 furious */
function fxCloud(c,x,y,P,w,m,t,tint){const bl=[[0,0,w*.32],[-w*.3,w*.06,w*.22],[w*.3,w*.05,w*.24],[-w*.12,-w*.14,w*.24],[w*.15,-w*.12,w*.2]],R=bl.map(b=>b.map(v=>v/P));const cx=Math.round(x/P),cy=Math.round(y/P),ins=(i,j)=>R.some(([a,b,r])=>(i-a)**2+(j-b)**2<=r*r);const W2=Math.ceil(w/P*.62),H2=Math.ceil(w/P*.42);
 for(let j=-H2;j<=H2;j++)for(let i=-W2;i<=W2;i++){if(!ins(i,j))continue;const e=!ins(i+1,j)||!ins(i-1,j)||!ins(i,j+1)||!ins(i,j-1);const sh=j>H2*.25?(tint?'U':'D'):j<-H2*.4?(tint?'s':'d'):(tint?'u':'D');fxR(c,(cx+i)*P,(cy+j)*P,P,e?'k':(j<-H2*.5&&FBY[((i+40)&3)*4+((j+40)&3)]<5?'s':sh));}
 if(m<0)return;const ey=cy-1,bl2=fst(t,1)%4===0&&m===0;for(const d of[-1,1]){const ex=cx+d*4;fxR(c,(ex-1)*P,(ey-3)*P+(m?P*(d>0?-1:-1):0),P,'k',3,1);if(m)fxR(c,(ex+(d>0?-1:1))*P,(ey-2)*P,P,'k');if(bl2)fxR(c,(ex-1)*P,ey*P,P,'k',3,1);else{fxR(c,(ex-1)*P,(ey-1)*P,P,m>1?'r':'w',3,3);fxR(c,(ex-d*0)*P,ey*P,P,'k');}}
 if(m)fxR(c,(cx-2)*P,(cy+3)*P,P,'k',5,m>1?3:2);else fxR(c,(cx-2)*P,(cy+3)*P,P,'k',5,1);}
Object.assign(FXS,{
 /* The Taxman: walks in at the left end of the rim, nearest your coin counter, and writes in his ledger, sack on his back. Each tax he turns to the wall and holds the sack open,
    a coin shoots up the edge of the jar from your counter and drops in, and he pats it. Phase 2: his monocle flashes dollar signs and he stamps the ledger.
    Beaten: he drops the ledger, papers fly, and he runs off the way he came */
 B_tax:{home(g){return fq(fxRX('B_tax',.15,88,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const P=fxBP(g),home=FXS.B_tax.home(g);if(s.age<.05||s.x==null){s.x=-50;s.bag=3;s.drop=0;s.cl=0;}
   if(s.dnt!=null){s.x-=dt*190;if(!s.drop){s.drop=1;for(let k=0;k<7;k++)A.add({k:'fn',x:s.x+6*P,y:fxRim(g)-12*P,vx:30+Math.random()*90,vy:-90-Math.random()*60,g:150,dr:.5,T:2.6,fa:.6,sw:12,sf:2.5+Math.random(),ph:k,d:(c,q,g)=>{const P=g.P;fxR(c,q.x,q.y,P,'k',5,1);fxR(c,q.x,q.y+P,P,'w',5,3);fxR(c,q.x,q.y+4*P,P,'k',5,1);fxR(c,q.x+P,q.y+2*P,P,'s',3,1);}});}}
   else if(s.x<home)s.x=Math.min(home,s.x+dt*95);
   if(s.cl>0)s.cl-=dt;for(const k of['bmp','stp'])if(s[k]>0)s[k]-=dt;if(s.p2t!=null&&s.p2t<dt*1.5)s.stp=.5;},
  /* his ledger: an open book held at his chest, two pages and a spine, lines of writing, a quill scratching across the right-hand page (a red stamp in phase 2) */
  book(c,x,y,P,t,st){const R=(a,b,col,w=1,h=1)=>fxR(c,x+a*P,y+b*P,P,col,w,h);R(-4,-1,'k',4,1);R(1,-1,'k',4,1);R(0,0,'k');R(-5,0,'k');R(5,0,'k');R(-4,0,'w',4,1);R(1,0,'w',4,1);R(-5,1,'k');R(5,1,'k');R(0,1,'k');R(-4,1,'w',4,1);R(1,1,'w',4,1);R(-3,1,'s',2,1);R(2,1,'s',2,1);R(-5,2,'k');R(5,2,'k');R(-4,2,'R',9,1);R(-4,3,'k',9,1);
   if(st){R(1,-4,'k',3,3);R(2,-3,'r');R(2,-1,'r',2,1);}else{const q=fst(t,4)%3;R(2+q,-3,'w');R(1+q,-2,'w');R(1+q,-1,'k');R(3+q,-4,'s');}},
  /* the open sack he holds out at the wall, its mouth at (mx, my) */
  mouth(s,g,bz){const P=fxBP(g),r=fxRim(g);bz=bz==null?Math.round(Math.min(6,s.bag+(s.p2t!=null?1:0))):bz;return[s.x-9*P,Math.min(r-9*P,r-(2*bz+2)*P)];},
  front(c,g,s,t){const P=fxBP(g),rim=fxRim(g),home=FXS.B_tax.home(g),walk=s.x!==home,x=s.x,p2=s.p2t!=null,run=s.dnt!=null,col=s.cl>0&&!run;c.save();c.globalAlpha=s.p;
   const faceL=run||col,fl=!faceL;let fr='txS';if(walk)fr=['txW1','txW2','txW3','txW2'][fst(t,run?13:7)%4];else if(col)fr='txC';else if(p2&&(s.p2t<1.4||(t%3)<.35))fr='txD';
   const bz=Math.round(Math.min(6,s.bag+(p2?1:0)))+(s.bmp>0?1:0);
   if(col){fxS(c,fr,x,rim,P,{fl});const[mx,my]=FXS.B_tax.mouth(s,g,bz),sx=mx,sy=my+(bz+1)*P;fxSack(c,sx,sy,P,bz,1,1);fxR(c,x-6*P,rim-7*P,P,'f',1,1);fxLn(c,x-6*P,rim-6*P,sx+3*P,my,P,FXP.k);if(s.cl<.35&&fst(t,10)%2)fxR(c,x-5*P,rim-7*P,P,'f');}
   else{const sd=fl?-1:1,bob=walk&&fst(t,run?13:7)%4%2?P:0,sx=x+sd*(3+bz)*P,sy=rim-(10+Math.round(bz*.3))*P-bob;if(!run||s.dnt<.1){fxSack(c,sx,sy,P,bz,1);fxLn(c,x+sd*2*P,rim-9*P,sx-sd*P,sy-(bz+1)*P,P,FXP.k);}fxS(c,fr,x,rim,P,{fl});
    if(!walk&&!run){FXS.B_tax.book(c,x-sd*5*P,rim-7*P,P,t,s.stp>0);}}
   if(run&&s.dnt<.6)fxR(c,x-P,rim-(22+Math.round(s.dnt*20))*P,P,'k',3,1);c.restore();},
  ev(s,n,o,A,g){if(n!=='tax'||!s.l.p||s.dnt!=null)return;const P=fxBP(g);s.cl=1.15;const x0=g.L-3,y0=g.H+14,top=FXS.B_tax.mouth(s,g)[1]-7*P,T1=.5,T2=.26;
   /* the coin: up the left edge of the jar from the counter below, then a short hop into the open sack */
   A.add({k:'fn',x:x0,y:y0,T:T1+T2,dl:.18,fa:1,d:(c,q,g)=>{const u=q.t-.18;let x,y;const[mx,my]=FXS.B_tax.mouth(s,g);if(u<T1){const e=1-Math.pow(1-u/T1,2.2);x=x0;y=y0+(top-y0)*e;for(let k=1;k<4;k++){const ek=1-Math.pow(1-Math.max(0,u-k*.05)/T1,2.2);c.save();c.globalAlpha*=.5-k*.12;fxCoin(c,x0,y0+(top-y0)*ek,fxBP(g),1,0,2);c.restore();}}else{const v=(u-T1)/T2;x=x0+(mx-x0)*v;y=top+(my-top)*v*v-Math.sin(v*Math.PI)*3*fxBP(g);}fxCoin(c,x,y,fxBP(g),[2,1,0,1][fst(q.t,16)%4],0,2);},
    end:(A)=>{const[mx,my]=FXS.B_tax.mouth(s,g);s.bag=Math.min(6,s.bag+.6);s.bmp=.2;A.burst(mx,my,['y','Y','w'],8,{v:110,vy:-40,T:.45});A.add({k:'fn',x:mx,y:my-4*P,vy:-30,T:.9,fa:.5,d:(c,q,g)=>T(c,'-1',q.x,q.y,18,'#e63946','center',FD)});}});}},
 /* The Storm: a scowling storm cloud rolls over the jar and rains into it. Each whirlpool it throws a lightning bolt at the jar. Phase 2: bigger, darker, red-eyed, heavier rain. Beaten: it breaks up and a rainbow arcs over the jar */
 B_storm:{tick(s,g,dt,A){bossT(s,dt);if(s.bt>0)s.bt-=dt;if(s.fl>0)s.fl-=dt;const P=g.P,heavy=s.p2t!=null;if(s.dnt==null&&s.age>.6&&!RMO){const n=heavy?55:28;for(let k=0;k<n*dt;k++)A.add({k:'fn',x:g.L+Math.random()*(g.R-g.L+80)-40,y:fxRim(g)-95,vx:heavy?-140:-70,vy:520,T:.9,fa:.9,ly:1,d:(c,q,g)=>{if(q.y>g.bot)return;const P=g.P;c.globalAlpha*=.6;fxR(c,q.x,q.y,P,'b',1,2);fxR(c,q.x-P,q.y+2*P,P,'B');}});}},
  cx(s,g){const u=Math.min(1,(s.age||0)/1.2),e=1-Math.pow(1-u,3);return g.L-120+(g.L+(g.R-g.L)*.5+120-g.L)*e;},
  back(c,g,s,t){if(s.dnt!=null&&s.dnt>1)return;c.save();c.globalAlpha=(s.p2t!=null?.16:.1)*Math.min(1,s.age/.8)*(s.dnt!=null?Math.max(0,1-s.dnt):1);c.fillStyle=FXP.U;c.fillRect(g.L,g.top,g.R-g.L,g.bot-g.top);c.restore();},
  front(c,g,s,t){const P=g.P,heavy=s.p2t!=null,cx=FXS.B_storm.cx(s,g),cy=fxRim(g)-118+Math.round(Math.sin(t*1.3))*P;c.save();
   if(s.bt>0){const x1=s.bx,pts=[[cx,cy+40]];let y=cy+40,x=cx;while(y<g.top+60){y+=26;x+=(Math.random()-.5)*50+(x1-x)*.25;pts.push([x,y]);}pts.push([x1,g.top+(g.bot-g.top)*.55]);for(const[col,o]of[['k',P],['y',0]])for(let i=1;i<pts.length;i++){fxLn(c,pts[i-1][0]+o,pts[i-1][1],pts[i][0]+o,pts[i][1],P,FXP[col]);if(!o)fxLn(c,pts[i-1][0]+P,pts[i-1][1],pts[i][0]+P,pts[i][1],P,FXP.w);}}
   if(s.dnt==null){c.globalAlpha=s.p;fxCloud(c,cx,cy,P,heavy?190:150,s.bt>0?1:heavy?2:0,t,0);}else if(s.dnt<1.4){const u=s.dnt/1.4;c.globalAlpha=s.p*Math.ceil((1-u)*3)/3;for(const k of[-1,0,1])fxCloud(c,cx+k*(30+u*150),cy-u*30+(k?0:-u*20),P,k?70:80,-1,t,0);}
   if(s.dnt!=null&&s.dnt<3.2){const a=Math.min(1,s.dnt/.4)*Math.min(1,(3.2-s.dnt)/.6),cxr=(g.L+g.R)/2,cyr=g.top+40,R0=(g.R-g.L)*.42;c.globalAlpha=a*.85;['r','o','y','g','b','P'].forEach((col,k)=>{for(let a2=0;a2<=Math.PI;a2+=.012){const r=R0-k*P;fxR(c,cxr+Math.cos(Math.PI+a2)*r,cyr+Math.sin(Math.PI+a2)*r*.8,P,col);}});}
   if(s.fl>0){c.globalAlpha=s.fl>.08?.4:.15;c.fillStyle='#fff';c.fillRect(-20,-20,g.W+40,g.H+40);}c.restore();},
  ev(s,n,o,A,g){if(n!=='storm'||!s.l.p)return;s.bt=.32;s.fl=.14;s.bx=(g.L+g.R)/2+(Math.random()-.5)*60;A.burst(s.bx,g.top+(g.bot-g.top)*.55,['y','w','b'],14,{v:240,T:.45});}},
 /* Cold Snap: frost creeps over the glass from the corners and icicles hang from the rim; a frost sprite hovers above and blows cold on every Frozen fruit you are handed. Phase 2: a blizzard. Beaten: the icicles drip and fall, the frost melts */
 B_ice:{tick(s,g,dt,A){bossT(s,dt);const l=s.l;if(l.ci&&!s.ci&&s.dnt==null){s.bl=.8;}s.ci=l.ci;if(s.bl>0)s.bl-=dt;s.fr=fxA(s.fr||0,s.dnt!=null?0:Math.min(1,s.age/2.2)*(s.p2t!=null?1:.62),dt*(s.dnt!=null?.6:.5));const P=g.P;
   if(s.p2t!=null&&s.dnt==null&&!RMO)for(let k=0;k<40*dt;k++)A.add({k:'sq',x:g.L+Math.random()*(g.R-g.L+120),y:g.top-40+Math.random()*(g.bot-g.top),vx:-220,vy:90,T:1.2,col:Math.random()<.6?'w':'i',fa:.7});
   if(s.dnt!=null&&!s.ifall){s.ifall=1;for(let k=0;k<7;k++)A.add({k:'fn',x:g.L+(g.R-g.L)*(k+.5)/7,y:g.top+2,vy:0,g:600,dl:.2+Math.random()*.6,T:1.6,fa:.6,len:2+(k*5)%4,d:(c,q,g)=>{const P=g.P;for(let j=0;j<q.len;j++)fxR(c,q.x-(j<1?P:0),q.y+j*P,P,j===q.len-1?'w':'j',j<1?3:1,1);}});}},
  frost(c,g,s,t){const P=g.P,k=s.fr;if(!(k>0))return;const cw=Math.round((g.R-g.L)/P),chh=Math.round((g.bot-g.top)/P);c.save();for(let j=0;j<chh;j++)for(let i=0;i<cw;i++){const dx=Math.min(i,cw-1-i),dy=Math.min(j,chh-1-j),d=Math.min(dx,dy*1.4)+Math.min(dx,dy)*.25,lim=k*9+fhs(Math.floor(i/3),Math.floor(j/3))*4*k;if(d>lim)continue;const n=fhs(i,j);if(n<.4)continue;c.globalAlpha=Math.min(1,(lim-d)/3)*.85;fxR(c,g.L+i*P,g.top+j*P,P,n>.9?'w':n>.7?'j':n>.55?'b':'i');}c.restore();},
  front(c,g,s,t){const P=g.P;FXS.B_ice.frost(c,g,s,t);c.save();c.globalAlpha=s.p;if(s.dnt==null||s.dnt<.4){for(let k=0;k<11;k++){const x=fq(g.L+(g.R-g.L)*(k+.5)/11,P),len=Math.round((4+(k*7)%7)*Math.min(1,s.age/1.4));for(let j=0;j<len;j++){const w=j<len*.35?1:0;fxR(c,x-(w+1)*P,g.top+j*P,P,'k',3+2*w,1);}for(let j=0;j<len-1;j++){const w=j<len*.35?1:0;fxR(c,x-w*P,g.top+j*P,P,j===len-2?'w':'i',1+2*w,1);if(w)fxR(c,x-P,g.top+j*P,P,'w');fxR(c,x+w*P,g.top+j*P,P,'j');}if(len>1&&!RMO&&(t*1.7+k*.37)%3<.25)fxR(c,x,g.top+(len+Math.floor(((t*1.7+k*.37)%3)/.25*4))*P,P,'b');}}
   const u=Math.min(1,s.age/1.1),sx=fq(g.L+(g.R-g.L)*.27,P),sy=fq(fxRim(g)-120+(1-u)*-90+Math.sin(t*2)*4,P),r=7,bl=s.bl>0;const P0=P;{const P=fxBP(g);if(s.dnt!=null){const m=Math.min(1,s.dnt/1);c.globalAlpha=s.p*(1-m);}
   for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const d=i*i+j*j;if(d>r*r+r*.5)continue;const e=(i+1)**2+j*j>r*r+r*.5||(i-1)**2+j*j>r*r+r*.5||i*i+(j+1)**2>r*r+r*.5||i*i+(j-1)**2>r*r+r*.5;fxR(c,sx+i*P,sy+j*P,P,e?'k':(i*.6+j*.8)/r>.45?'j':(i*.6+j*.8)/r<-.4?'w':'i');}
   for(const d of[-1,1]){fxR(c,sx+(d*3-1)*P,sy-4*P,P,'w',3,1);fxR(c,sx+(d*3-1)*P,sy-5*P,P,'k',3,1);fxR(c,sx+d*3*P,sy-2*P,P,'k',1,2);if(bl)fxR(c,sx+d*4*P,sy+P,P,'b',2,1);}
   if(bl){fxR(c,sx-P,sy+2*P,P,'k',3,3);fxR(c,sx,sy+3*P,P,'B');for(let k=0;k<4;k++){const q=(t*3+k*.25)%1;fxR(c,sx+Math.round(q*60+k*3)*P/3,sy+3*P+Math.round(Math.sin(q*9+k)*3)*P,P,k%2?'w':'i',2,1);}}else fxR(c,sx-P,sy+3*P,P,'k',3,1);
   if(s.p2t!=null&&s.dnt==null)for(const d of[-1,1])fxR(c,sx+d*(r+1)*P,sy-r*P,P,'w',1,2);}c.restore();},
  ev(s,n,o,A,g){if(n!=='freeze'||!s.l.p)return;for(let k=0;k<8;k++){const a=k*Math.PI/4;A.add({k:'fn',x:o.x,y:o.y,T:.45,fa:.4,a,d:(c,q,g)=>{const P=g.P,r=(o.r||20)*(1+q.t*2.2);fxLn(c,q.x+Math.cos(q.a)*r*.6,q.y+Math.sin(q.a)*r*.6,q.x+Math.cos(q.a)*r,q.y+Math.sin(q.a)*r,P,FXP.b);fxR(c,q.x+Math.cos(q.a)*r,q.y+Math.sin(q.a)*r,P,'w');}});}}},
 /* The Thief: tiptoes in along the rim with his sack on his back, then crouches and leaps up out of sight to swipe your leftmost charm (it goes dark up in the header) and drops back with a fatter sack.
    He glances about while he waits. Phase 2: another leap for a second charm. Beaten: he drops the sack, it bursts in sparkles as your charms come back, and he runs */
 B_thief:{home(g){return fq(fxRX('B_thief',.28,60,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const P=fxBP(g),home=FXS.B_thief.home(g),rim=fxRim(g),want=(s.l.ids||[]).length;if(s.age<.05||s.x==null){s.x=-50;s.got=0;s.st='in';s.y=0;s.bag=3;s.dir=1;}
   if(s.dnt!=null&&s.st!=='run'){s.st='run';s.dir=-1;s.sx=s.x-5*P;A.burst(s.sx,rim-10*P,['y','w','h','b'],16,{v:150,vy:-80,T:.7});for(let k=0;k<4;k++)A.add({k:'star',x:s.sx+(Math.random()-.5)*30,y:rim-12*P-Math.random()*40,T:.6,dl:k*.08,col:'y'});}
   if(s.st==='in'){s.x+=dt*80;if(s.x>=home){s.x=home;s.st='idle';s.w=.5;}}
   else if(s.st==='idle'){s.w-=dt;if(s.w<=0&&s.got<want){s.st='crouch';s.w=.28;}}
   else if(s.st==='crouch'){s.w-=dt;if(s.w<=0){s.st='jump';s.vy=-1250;}}
   else if(s.st==='jump'){s.vy+=1900*dt;s.y+=s.vy*dt;if(s.y<-rim-40&&!s.sw){s.sw=1;s.got++;}if(s.vy>0&&s.y>=0){s.y=0;s.sw=0;s.st='land';s.w=.18;s.bag+=1.2;A.burst(s.x,rim,['s','d','c'],8,{v:90,vy:-30,T:.4,s:1});}}
   else if(s.st==='land'){s.w-=dt;if(s.w<=0){s.st='idle';s.w=.7;}}
   else if(s.st==='run'){s.x-=dt*230;}},
  front(c,g,s,t){if(s.x==null)return;const P=fxBP(g),rim=fxRim(g),x=s.x,y=rim+Math.round(s.y/P)*P;c.save();c.globalAlpha=s.p;
   let fr='thS',fl=s.dir<0;if(s.st==='in'||s.st==='run')fr=['thW1','thS','thW2','thS'][fst(t,s.st==='run'?12:6)%4];else if(s.st==='crouch'||s.st==='land')fr='thC';else if(s.st==='jump')fr='thJ';else if(s.st==='idle')fl=fst(t,.8)%3===1;
   if(s.st!=='run'){const bz=Math.round(Math.min(6,s.bag)),bx=x+(fl?5:-5)*P,by=y-(fr==='thC'?7:9)*P-bz*.3*P;fxSack(c,bx,by,P,bz,0);}
   fxS(c,fr,x,y,P,{fl});if(s.st==='jump'&&s.vy<0&&!RMO){c.globalAlpha=s.p*.5;for(let k=1;k<4;k++)fxR(c,x+(k%2?-3:3)*P,y+k*5*P,P,'s',1,3);}c.restore();
   if(s.st==='jump'&&s.y<-rim+10){c.save();for(let k=0;k<3;k++)fxStar(c,x+(k-1)*14,6+(k%2)*8,g.P,[1,2,3,2][fst(t,12)%4],'y');c.restore();}},
  ev(){}},
 /* The Melon Queen: royal pennants unfurl from the rim corners, a crown comes down onto her Watermelon, an ermine-trimmed cape spreads behind her and a sceptre stands at her side (v1.81.1). Phase 2: the crown glows red-hot, the sceptre's orb burns and she hurls her rock. Beaten: her crown pops off and rolls away, the sceptre topples and the cape slips away */
 B_melon:{tick(s,g,dt,A){bossT(s,dt);const q=s.l.q;if(q){s.qx=q.x;s.qy=q.y;s.qr=q.r;}if(s.dnt!=null&&!s.cr){s.cr={x:s.qx,y:s.qy-(s.qr||60)*.9,vx:150,vy:-260,r:0};A.burst(s.qx,s.qy-(s.qr||60),['y','Y','w'],12,{v:180,T:.6});}if(s.cr){const c=s.cr;c.vy+=900*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;if(c.y>g.bot-8*g.P){c.y=g.bot-8*g.P;c.vy=-c.vy*.35;c.vx*=.85;}if(c.x>g.R-8*g.P){c.x=g.R-8*g.P;c.vx=-c.vx*.6;}c.r+=c.vx*dt/14;}if(s.cf>0)s.cf-=dt;if(s.age<.05)for(let k=0;k<20;k++)A.add({k:'sq',x:g.L+Math.random()*(g.R-g.L),y:fxRim(g)-60-Math.random()*60,vx:(Math.random()-.5)*60,vy:40+Math.random()*60,T:2+Math.random(),col:['y','r','m','b','g'][k%5],sw:6,sf:3,ph:k,fa:.7,dl:.6+Math.random()*.6});},
  back(c,g,s,t){if(s.qx==null)return;const Q=2*g.P,r=Math.round((s.qr||60)/Q),u=Math.min(1,s.age/1.4),cx=fq(s.qx,Q),cy=fq(s.qy,Q),dn=s.dnt!=null?Math.min(1,s.dnt/.6):0,R2=r+3,fl=fst(t,4)%2;if(dn>=1)return;c.save();c.beginPath();c.rect(g.L,g.top-200,g.R-g.L,g.bot-g.top+200);c.clip();c.globalAlpha=s.p*Math.ceil((1-dn)*3)/3;
   for(let j=-R2;j<=r;j++){if(j<-R2+Math.round((1-u)*R2*2))continue;const hw=j<=0?Math.round(Math.sqrt(Math.max(0,R2*R2-j*j))):R2+(fl&&j>r-3?1:0);for(let i=-hw;i<=hw;i++){const d=i*i+j*j;if(d<(r-1)*(r-1))continue;const e=i===-hw||i===hw||(j<=0&&(i*i+(j-1)*(j-1)>R2*R2))||j===r,trim=!e&&(Math.abs(i)>=hw-1||(j<=0&&(Math.abs(i)+1)*(Math.abs(i)+1)+(j-1)*(j-1)>R2*R2));fxR(c,cx+i*Q,cy+j*Q,Q,e?'k':trim?((i*3+j)%4===0?'k':'w'):(i<0&&j<-r*.3?'P':'V'));}}c.restore();},
  front(c,g,s,t){const P=g.P,rim=fxRim(g),u=Math.min(1,s.age/1.2);c.save();c.globalAlpha=s.p;
   if(s.qx!=null){const Q=2*P,r=(s.qr||60),dn=s.dnt!=null?s.dnt:0,ang=dn>0?Math.min(1.45,dn*2.4):0,bx=s.qx+r*1.02,by=s.qy+r*.55,L2=Math.round(r*1.5/Q),hot=s.p2t!=null&&!dn,cs=Math.cos(ang),sn=Math.sin(ang);if(u>.4){for(let k=0;k<L2;k++){const xx=bx+Math.round(sn*k)*Q,yy=by-Math.round(cs*k)*Q;fxR(c,xx-Q,yy,Q,'k',3,1);fxR(c,xx,yy,Q,k%4===0?'Y':'y');}
     const ox=bx+Math.round(sn*L2)*Q,oy=by-Math.round(cs*L2)*Q;fxEl(c,fq(ox,Q),fq(oy-Q,Q),Q,2,2,(i,j,e)=>e?'k':i<0&&j<0?'h':hot&&fst(t,6)%2?'o':'y');fxR(c,ox,oy-4*Q,Q,'k');fxR(c,ox,oy-5*Q,Q,hot?'r':'m');if(hot&&!RMO)for(let k=0;k<2;k++){const q=(t*1.8+k/2)%1;fxR(c,ox+(k?Q:-Q),oy-(6+q*6)*Q,Q,q<.5?'o':'r');}}}
   for(const sd of[-1,1]){const px=sd<0?g.L-2:g.R+2,len=Math.round(14*Math.min(1,s.age/.9)*(s.dnt!=null?Math.max(0,1-s.dnt):1));fxR(c,px-P,rim-24*P,P,'k',3,24);fxR(c,px,rim-24*P,P,'Y',1,24);fxR(c,px-P,rim-26*P,P,'y',3,2);for(let i=0;i<len;i++){const w=Math.round(8*(1-i/16)),dy=Math.round(Math.sin(i*.5-fst(t,6)*.9)*1);for(let j=0;j<w;j++){const x=px-sd*(i+2)*P,y=rim-22*P+(j+dy)*P;fxR(c,x,y,P,j===0||j===w-1||i===len-1?'k':(j<w/2?'r':'R'));}if(i%4===1)fxR(c,px-sd*(i+2)*P,rim-22*P+(Math.round(w/2)+dy)*P,P,'y');}}
   if(s.qx!=null&&!s.cr){const cy=s.qy-(s.qr||60)*.86-Math.round((1-u)*(1-u)*120)*P,hot=s.p2t!=null;if(hot&&!RMO){for(let k=0;k<3;k++){const q=(t*2+k/3)%1;fxR(c,s.qx+(k-1)*4*P,cy-(10+q*8)*P,P,q<.5?'o':'r');}}fxS(c,'crown',s.qx,cy,2*P);if(hot&&fst(t,6)%2){c.globalCompositeOperation='lighter';c.globalAlpha=s.p*.5;fxS(c,'crown',s.qx,cy,2*P);}
    if(u<1){c.globalAlpha=s.p;fxStar(c,s.qx,cy-10*P,P,[0,1,2,3,2,1][Math.floor(u*6)],'y');}}
   if(s.cr){c.globalAlpha=s.p;fxS(c,'crown',s.cr.x,s.cr.y,2*P,{ay:.5,r:Math.floor(s.cr.r)%4});}c.restore();},
  ev(s,n,o,A,g){if(n!=='mrock'||!s.l.p||s.qx==null)return;const P=g.P,x0=s.qx,y0=s.qy-(s.qr||60),T=.5;A.add({k:'fn',x:x0,y:y0,vx:(o.x-x0)/T,vy:(o.y-y0-.5*1300*T*T)/T,g:1300,T,fa:1,d:(c,q,g)=>{if(typeof drawStone==='function')drawStone(c,q.x,q.y,(o.r||20));},end:A2=>A2.burst(o.x,o.y,['d','D','s'],10,{v:150,T:.5,s:2})});}}});
const fxBP=g=>Math.round(g.P*4/3); /* boss characters: a 4px grid, a third chunkier than the charm scenes */
function fxIcon(c,id,x,y,P){const k=typeof icn==='function'?icn(id):id;if(!PXD[k])return;const key='ic_'+k;if(!FXI[key])FXI[key]=fxGrid(PXD[k],PXP);const im=FXI[key];c.save();c.imageSmoothingEnabled=false;c.fillStyle=FXP.k;c.fillRect(fq(x-7*P/1.5,P),fq(y-7*P/1.5,P),Math.round(14*P/1.5),Math.round(14*P/1.5));c.drawImage(im,fq(x-6*P/1.5,P),fq(y-6*P/1.5,P),Math.round(12*P/1.5),Math.round(12*P/1.5));c.restore();}
/* ---------- bosses, batch 2 (v1.79) ---------- */
Object.assign(FXD,{
msS:`
....kkkk.....
...kUUUUkk...
..kUUUUUUUkk.
..kuuuuuukUk.
..kffffffkwwk
.kffkwffffkk.
kfffkkffffk..
.kkfkkkfffk..
..kwwwffffk..
...kkkkkkk...
..kVVVVVVk...
.kVVVVVVVVk..
.kVVVVVVVVVk.
..kVVVVVVVVk.
..kVVVVVVVVk.
..kVVVVVVVk..
...kVkkVk....
...kkk.kkk...`,
msW:`
.............
....kkkk.....
...kUUUUkk...
..kUUUUUUUkk.
..kuuuuuukUk.
..kffffffkwwk
.kffkwffffkk.
kfffkkffffk..
.kkfkkkfffk..
..kwwwffffk..
...kkkkkkk...
..kVVVVVVk...
.kVVVVVVVVk..
.kVVVVVVVVVk.
..kVVVVVVVVk.
..kVVVVVVVk..
...kVVVVVk...
...kkkkkkk...`,
mnS:`
...kkkk...
..kyyyyk..
.kyyhwyyk.
kkkkkkkkk.
.kffffffk.
.kfkffffk.
kffffffk..
.kNNNNNk..
..kNNNk...
.kbbbbbk..
.kbybbbbk.
.kbbbbbbk.
.kbbkbbk..
.kkk.kkk..`,
mnW:`
...kkkk...
..kyyyyk..
.kyyhwyyk.
kkkkkkkkk.
.kffffffk.
.kfkffffk.
kffffffk..
.kNNNNNk..
..kNNNk...
.kbbbbbk..
.kbybbbbk.
.kbbbbbbk.
kbbk.kbbk.
kkk...kkk.`,
lock:`
...kkkkk...
..kdssddk..
.kdk...kdk.
.ksk...kdk.
.kdk...kdk.
kkkkkkkkkkk
kYhyYYYYYYk
kYyYYkYYYYk
kYyYkkkYYYk
kYYYYkYYYYk
kYYYYkYYYYk
kYYYYYYYYYk
.kkkkkkkkk.`,
lockO:`
...kkkkk...
..kdssddk..
.kdk...kdk.
.ksk...kdk.
.kdk.......
.kdk.......
.kkk.......
kkkkkkkkkkk
kYhyYYYYYYk
kYyYYkYYYYk
kYyYkkkYYYk
kYYYYYYYYYk
.kkkkkkkkk.`,
key:`
.kkk.......
kyyyk......
kykyk......
kyyykkkkkk.
.kkkyyyyyyk
....kkykkyk
.....kk.kk.`});
function fxGear(c,x,y,P,r,a){for(let k=0;k<8;k++){const q=a+k*Math.PI/4;fxR(c,x+Math.round(Math.cos(q)*r)*P,y+Math.round(Math.sin(q)*r)*P,P,'k');}for(let j=-r+1;j<r;j++)for(let i=-r+1;i<r;i++){const d=i*i+j*j;if(d<(r-1)*(r-1))fxR(c,x+i*P,y+j*P,P,d<1.5?'k':'Y');}}
Object.assign(FXS,{
 /* The Clock: a cuckoo clock lands on the rim. Its red hand sweeps once in the time your fruit has before it drops by itself, the pendulum ticks, and the cuckoo pops out each time it drops your fruit for you.
    Phase 2: the face flushes red, the hand races and the clock rattles. Beaten: it bursts its gears and the cuckoo flops out on its spring */
 B_clock:{x(g){return fq(fxRX('B_clock',.79,68,g)+5*g.K,fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);if(s.cu>0)s.cu-=dt;if(s.dnt!=null&&!s.br){s.br=1;const P=fxBP(g),x0=FXS.B_clock.x(g),y0=fxRim(g)-8*P;for(let k=0;k<6;k++){const a=Math.random()*Math.PI*2,v=120+Math.random()*120;A.add({k:'fn',x:x0,y:y0,vx:Math.cos(a)*v,vy:Math.sin(a)*v-120,g:700,T:1.3,fa:.6,r:1+k%2,sp:Math.random()*8,d:(c,q,g)=>fxGear(c,q.x,q.y,fxBP(g)*.75,q.r+1,q.t*q.sp)});}A.burst(x0,y0,['k','d','Y'],10,{v:160,T:.5});}},
  front(c,g,s,t){const P=fxBP(g),rim=fxRim(g),x0=FXS.B_clock.x(g),u=Math.min(1,s.age/.7),p2=s.p2t!=null,dead=s.dnt!=null,fade=dead?Math.max(0,1-Math.max(0,s.dnt-1.4)/.6):1;if(fade<=0)return;
   const drop=u<1?Math.round(Math.pow(1-u,2)*50)*P:0,bnc=u>=1&&s.age<.9?-P:0,sh=p2&&!dead&&(t%1.2)<.35?(fst(t,16)%2?P:-P):0,x=x0+sh,y=rim-drop+bnc;c.save();c.globalAlpha=s.p*fade;
   for(let r=0;r<7;r++){const hw=r===6?8:Math.round(1+r*1.25),yy=y-(19-r)*P;for(let i=-hw;i<=hw;i++)fxR(c,x+i*P,yy,P,(i===-hw||i===hw||r===0)?'k':((i+r)%3===0?'e':'N'));}
   const dy=y-16*P;if(s.cu>0&&!dead){fxR(c,x-2*P,dy-P,P,'k',4,4);fxR(c,x-P,dy,P,'x',2,2);const o=s.cu>.55?1:s.cu>.15?3:1;fxR(c,x-(o+1)*P,dy,P,'b',3,2);fxR(c,x-(o+2)*P,dy+P,P,'y');fxR(c,x-o*P,dy,P,'k');}else{fxR(c,x-P,dy-P,P,'k',3,3);fxR(c,x,dy,P,'n');}
   for(let j=0;j<12;j++)for(let i=-6;i<=6;i++)fxR(c,x+i*P,y-(12-j)*P,P,(i===-6||i===6||j===11)?'k':i===-5?'E':'n');
   const fx=x,fy=y-8*P,fc=p2&&!dead?'q':'c';for(let j=-4;j<=4;j++)for(let i=-4;i<=4;i++){const d=i*i+j*j;if(d>20)continue;fxR(c,fx+i*P,fy+j*P,P,d>13?'k':fc);}for(const[a,b]of[[0,-3],[3,0],[0,3],[-3,0]])fxR(c,fx+a*P,fy+b*P,P,'D');
   const ang=dead?t*14:-Math.PI/2+(s.l.ck||0)*Math.PI*2,ah=-Math.PI/2+t*.2;fxLn(c,fx,fy,fx+Math.cos(ah)*1.6*P,fy+Math.sin(ah)*1.6*P,P,FXP.k);fxLn(c,fx,fy,fx+Math.cos(ang)*3*P,fy+Math.sin(ang)*3*P,P,FXP.R);fxR(c,fx,fy,P,'k');
   fxR(c,x-3*P,y-4*P,P,'k',7,4);fxR(c,x-2*P,y-3*P,P,'x',5,2);const sw=Math.round(Math.sin(t*Math.PI*(p2?4:2))*1.4);fxR(c,x+sw*P,y-3*P,P,'Y',1,1);fxR(c,x+sw*P,y-2*P,P,'y',1,1);
   if(dead&&s.dnt>.1){const ly=Math.min(5,Math.floor(s.dnt*12));fxLn(c,x-2*P,dy,x-4*P,dy+ly*P,P,FXP.d);fxR(c,x-6*P,dy+ly*P,P,'b',3,2);fxR(c,x-7*P,dy+(ly+1)*P,P,'y');fxR(c,x-5*P,dy+ly*P,P,'k');}c.restore();},
  ev(s,n,o,A,g){if(n!=='cuckoo'||!s.l.p)return;s.cu=.7;const P=fxBP(g),x=FXS.B_clock.x(g),y=fxRim(g)-17*P;A.add({k:'spr',sp:'nt2',x:x-4*P,y,vx:-30,vy:-50,T:.9,dl:.15,fa:.5,sw:4,sf:6});A.add({k:'spr',sp:'nt',x:x-5*P,y,vx:-50,vy:-40,T:.9,dl:.35,fa:.5,sw:4,sf:6});}},
 /* The Fog: a fog bank rolls over the Next box with two yellow eyes blinking inside it. Phase 2: it creeps down over the fruit you are holding and the eyes turn to watch it. Beaten: a gust blows it away */
 B_fog:{tick(s,g,dt){bossT(s,dt);},
  bank(c,g,s,t,cx,cy,rx,ry,den,ox){const P=g.P,i0=Math.floor((cx-rx)/P),i1=Math.ceil((cx+rx)/P),j0=Math.floor((cy-ry)/P),j1=Math.ceil((cy+ry)/P),dr=RMO?0:Math.floor(t*3);for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const dx=(i*P-cx)/rx,dy=(j*P-cy)/ry,d=Math.sqrt(dx*dx+dy*dy),n=fhs(Math.floor((i+dr)/3),Math.floor(j/3)),v=(1-d)*1.6+(n-.5)*.9;if(v<=0)continue;const th=Math.min(1,v)*den;if(FBY[((i+40)&3)*4+((j+40)&3)]/16<th){c.globalAlpha=Math.min(.92,.55+th*.4);fxR(c,(i)*P+ox,j*P,P,v>1.1?'w':v>.6?'s':'d');}}},
  /* soft fog: overlapping puffs, white on top, grey underneath, a grey rim only on their lower edge, each drifting a little on its own */
  puffs(c,g,t,list,a,ox){const P=g.P;c.save();c.globalAlpha=a;const cells=new Map();list.forEach(([x0,y0,r],k)=>{const x=Math.round((x0+ox+(RMO?0:Math.sin(t*.55+k*1.7)*4))/P),y=Math.round((y0+(RMO?0:Math.sin(t*.7+k*2.3)*2))/P),R=Math.round(r/P);for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){const d=Math.sqrt(i*i+j*j);if(d>R+.3)continue;const key=(x+i)+','+(y+j),edge=d>R-1,col=edge?(j>0?'d':'s'):(j>R*.35?'s':'w'),pr=cells.get(key);if(!pr||pr==='d'||(pr==='s'&&col==='w'))cells.set(key,col);}});
   for(const[key,col]of cells){const[i,j]=key.split(',').map(Number);fxR(c,i*P,j*P,P,col);}c.restore();},
  /* phase 2: a fog bank over the sky where you hold your fruit, hiding it completely (the user's call, v1.80: harder is the boss's intent) */
  band(c,g,s,t){if(s.p2t==null)return;const dead=s.dnt!=null,gone=dead?Math.min(1,s.dnt/1.1):0,ox=gone*gone*300,a=(dead?1-gone:1)*Math.min(1,s.p2t/.8);if(a<=0)return;const r0=fxRim(g),list=[];for(let x=g.L+4,i=0;x<g.R+10;x+=22,i++){list.push([x,r0-40+(i%2?-4:3),16+(i%3)*2]);list.push([x+11,r0-16+(i%2?3:-2),15+(i%2)*3]);}FXS.B_fog.puffs(c,g,t,list,a,ox);},
  top(c,g,s,t){FXS.B_fog.band(c,g,s,t);const P=g.P,u=Math.min(1,s.age/1.3),dead=s.dnt!=null,gone=dead?Math.min(1,s.dnt/1.1):0,ox=(1-u)*(1-u)*160+gone*gone*300,a=dead?1-gone:Math.min(1,s.age/.5);if(a<=0)return;const W=g.W;
   FXS.B_fog.puffs(c,g,t,[[W-28,48,12],[W-52,46,11],[W-80,80,10],[W-70,64,14],[W-16,80,11],[W-26,66,14],[W-48,58,17],[W-58,82,13],[W-34,84,13]],a*.96,ox);
   if(u>=1&&!dead){const bl=(t%3.1)<.14,lk=s.p2t!=null?-1:0;for(const ex of[W-56,W-38]){const x=fq(ex,P),y=fq(70,P);if(bl)fxR(c,x-P,y,P,'Y',3,1);else{fxR(c,x-P,y-P,P,'y',3,2);fxR(c,x+lk*P,y,P,'k');fxR(c,x-P,y-P,P,'h');}}}
   if(dead&&s.dnt<1.2){c.save();c.globalAlpha=.85;for(let k=0;k<7;k++){const y=24+k*30,x=((s.dnt*700+k*90)%(W+120))-60;fxR(c,x,y,P,'d',8,1);fxR(c,x+2*P,y+P,P,'s',5,1);}c.restore();}}},
 /* The Hourglass: an hourglass stands on the rim, its top bulb holding the drops you have left and the sand running down. Phase 2: it flips over and two drops fall through at once. Beaten: the glass cracks and shatters and the sand spills into the jar */
 B_hour:{x(g){return fq(fxRX('B_hour',.42,58,g),fxBP(g));},HW:[4,4,4,3,3,2,2,1,1],
  tick(s,g,dt,A){bossT(s,dt);if(s.p2t!=null&&s.p2t<dt*1.5){A.add({k:'fn',x:FXS.B_hour.x(g)+5*fxBP(g),y:fxRim(g)-24*fxBP(g),vy:-30,T:1.1,dl:.6,fa:.5,d:(c,q,g)=>T(c,'-2',q.x,q.y,20,'#e63946','center',FD)});}
   if(s.dnt!=null&&s.dnt>.55&&!s.sh){s.sh=1;const P=fxBP(g),x0=FXS.B_hour.x(g),y0=fxRim(g)-11*P;for(let k=0;k<14;k++){const a=Math.random()*Math.PI*2,v=80+Math.random()*160;A.add({k:'sq',x:x0+(Math.random()-.5)*30,y:y0+(Math.random()-.5)*40,vx:Math.cos(a)*v,vy:Math.sin(a)*v-80,g:700,T:.9,col:k%3?'i':'w',s:1});}for(let k=0;k<24;k++)A.add({k:'sq',x:x0+(Math.random()-.5)*14,y:y0,vx:(Math.random()-.5)*60,vy:-20+Math.random()*40,g:500,T:1.6,col:k%2?'y':'Y',fa:.7});}},
  glass(c,x,y,P,f,t,cr){const HW=FXS.B_hour.HW,cap=HW.reduce((a,h)=>a+2*h+1,0);let top=Math.round(f*cap),bot=cap-top;
   for(const sd of[-1,1])for(let j=0;j<2;j++){fxR(c,x-7*P,y+(sd<0?j:20+j)*P,P,'k',15,1);if(j===(sd<0?1:0))fxR(c,x-6*P,y+(sd<0?j:20+j)*P,P,'N',13,1);}fxR(c,x-6*P,y,P,'E',13,1);
   for(const px of[-6,6])for(let j=2;j<20;j++){fxR(c,x+(px-1)*P,y+j*P,P,'k',3,1);fxR(c,x+px*P,y+j*P,P,px<0?'E':'N');}
   const rows=[];for(let r=0;r<9;r++)rows.push([2+r,HW[r]]);rows.push([11,0]);for(let r=0;r<9;r++)rows.push([12+r,HW[8-r]]);
   const tf=new Map(),bf=new Map();for(let r=8;r>=0&&top>0;r--){const n=Math.min(top,2*HW[r]+1);tf.set(2+r,n);top-=n;}for(let j=19;j>=12&&bot>0;j--){const n=Math.min(bot,2*HW[8-(j-12)]+1);bf.set(j,n);bot-=n;}
   for(const[j,hw]of rows){if(j>19)continue;fxR(c,x-(hw+1)*P,y+j*P,P,'k');fxR(c,x+(hw+1)*P,y+j*P,P,'k');for(let i=-hw;i<=hw;i++){let col='i';if(j<11){const n=tf.get(j)||0;if(Math.abs(i)<=(n-1)/2)col='y';}else if(j>11){const n=bf.get(j)||0;if(Math.abs(i)<=(n-1)/2)col=i%2?'Y':'y';}if(col==='i'&&i===-hw&&hw>0)col='w';fxR(c,x+i*P,y+j*P,P,col);}}
   if(f>0&&f<1){for(let j=11;j<19;j++)if((j+fst(t,10))%2===0&&!(bf.get(j)>0))fxR(c,x,y+j*P,P,'y');}
   if(cr){c.globalAlpha*=1;for(const[a,b]of[[-2,4],[-1,5],[0,6],[1,5],[2,7],[-1,14],[0,15],[1,16],[0,17]])fxR(c,x+a*P,y+b*P,P,'w');}},
  front(c,g,s,t){const P=fxBP(g),rim=fxRim(g),x0=FXS.B_hour.x(g),u=Math.min(1,s.age/.7),dead=s.dnt!=null;if(dead&&s.dnt>.55)return;const y0=rim-22*P-(u<1?Math.round(Math.pow(1-u,2)*60)*P:0);c.save();c.globalAlpha=s.p;
   let q=0;if(s.p2t!=null&&s.p2t<.6)q=Math.min(2,Math.floor(s.p2t/.2)+1)%3;const f=s.p2t!=null&&s.p2t<.6?1-(s.l.f||0):(s.l.f==null?1:s.l.f);
   if(q){c.translate(x0,y0+11*P);c.rotate(q*Math.PI/2);c.translate(-x0,-(y0+11*P));}FXS.B_hour.glass(c,x0,y0,P,f,t,dead);c.restore();}},
 /* The Wilt: a wilting flower droops in a pot on the rim. Every time it shrinks your biggest fruit it sighs and a sickly puff drifts onto that fruit. Phase 2: it sheds petals. Beaten: it perks up and blooms */
 B_wilt:{x(g){return fq(fxRX('B_wilt',.59,64,g)+19*g.K,fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const tgt=s.dnt!=null?0:s.p2t!=null?.85:.55;s.dr=fxA(s.dr==null?.3:s.dr,s.sg>0?1:tgt,dt*(s.sg>0?3:1));if(s.sg>0)s.sg-=dt;if(s.p2t!=null&&s.p2t<dt*1.5){const[hx,hy]=FXS.B_wilt.head(s,g);for(let k=0;k<4;k++)A.add({k:'sq',x:hx+(k-2)*6,y:hy,vx:(Math.random()-.5)*30,vy:10,T:2.4,col:k%2?'N':'e',sw:7,sf:2.4,ph:k,fa:.7,s:1});}if(s.dnt!=null&&!s.bl){s.bl=1;const[hx,hy]=FXS.B_wilt.head(s,g);for(let k=0;k<6;k++)A.add({k:'star',x:hx+Math.cos(k)*28,y:hy+Math.sin(k)*24,T:.6,dl:.3+k*.07,col:k%2?'p':'y'});}},
  head(s,g){const P=fxBP(g),x=FXS.B_wilt.x(g),y=fxRim(g)-7*P,d=s.dr||0;const k=14;return[x-Math.round(Math.pow(Math.max(0,k-6),2)*.14*d)*P,y-Math.round(k-(k>6?Math.pow(k-6,2)*.08*d:0))*P];},
  front(c,g,s,t){const P=fxBP(g),rim=fxRim(g),x=FXS.B_wilt.x(g),u=Math.min(1,s.age/.6),d=s.dr||0,bloom=s.dnt!=null&&s.dnt>.25;c.save();c.globalAlpha=s.p*u;
   for(let r=0;r<6;r++){const hw=r===0?5:4-Math.floor((r-1)/2);for(let i=-hw;i<=hw;i++)fxR(c,x+i*P,rim-(6-r)*P,P,(i===-hw||i===hw||r===5)?'k':r===0?(i%2?'n':'N'):(i>=hw-1?'R':i===-hw+1?'q':'o'));}
   let px=x,py=rim-7*P;const pts=[];for(let k=0;k<=14;k++){const bx=x-Math.round(Math.pow(Math.max(0,k-6),2)*.14*(bloom?0:d))*P,by=rim-7*P-Math.round(k-(k>6?Math.pow(k-6,2)*.08*(bloom?0:d):0))*P;pts.push([bx,by]);}for(const[bx,by]of pts){fxR(c,bx-P,by,P,'k');fxR(c,bx,by,P,bloom?'g':'G');fxR(c,bx+P,by,P,'k');}if(!bloom){fxR(c,x+P,rim-11*P,P,'G',2,1);fxR(c,x+3*P,rim-12*P,P,'k');}else{fxR(c,x-3*P,rim-11*P,P,'g',2,1);fxR(c,x+2*P,rim-12*P,P,'g',2,1);}
   const[hx,hy]=pts[pts.length-1],dr=bloom?0:d,np=bloom?6:5,gone=!bloom&&s.p2t!=null?[1,3]:[],pet=[];for(let k=0;k<np;k++){if(gone.includes(k))continue;let a=-Math.PI/2+k*Math.PI*2/np+(bloom?0:.3);if(!bloom)a=a+(Math.cos(a)>0?.18:-.18)*dr*Math.max(0,Math.sin(a));const dist=bloom?4.4:4.1+(Math.sin(a)>0?dr*.4:0);pet.push([Math.cos(a)*dist,Math.sin(a)*dist+(bloom?0:dr*.7*Math.max(0,Math.sin(a))),bloom?2.6:2.5]);}
   const cen=(i,j)=>i*i+j*j<=2.8*2.8,pIn=(i,j)=>{for(let k=0;k<pet.length;k++){const[px,py,r]=pet[k];if((i-px)**2+(j-py)**2<=r*r+.4)return k;}return -1;},fill=(i,j)=>cen(i,j)||pIn(i,j)>=0;
   for(let j=-9;j<=10;j++)for(let i=-9;i<=9;i++){if(!fill(i,j))continue;const out=!fill(i+1,j)||!fill(i-1,j)||!fill(i,j+1)||!fill(i,j-1);let col;if(cen(i,j)){const rim=!cen(i+1,j)||!cen(i-1,j)||!cen(i,j+1)||!cen(i,j-1);col=out||rim?'k':(i<0&&j<0?(bloom?'h':'y'):(bloom?'y':'Y'));}else{const k=pIn(i,j),[px,py,r]=pet[k],sep=pet.some((q,n)=>n!==k&&(i-q[0])**2+(j-q[1])**2<=q[2]*q[2]+.4)&&Math.hypot(i-px,j-py)>r-1;col=out?'k':sep?(bloom?'m':'N'):(Math.hypot(i,j)>Math.hypot(px,py)+.6?(bloom?'m':'N'):(bloom?'p':'e'));if(!out&&bloom&&Math.hypot(i-px+.8,j-py+.8)<.7)col='w';}fxR(c,hx+i*P,hy+j*P,P,col);}
   if(bloom){fxR(c,hx-P,hy-P,P,'k');fxR(c,hx+P,hy-P,P,'k');fxR(c,hx-2*P,hy+P,P,'k');fxR(c,hx+2*P,hy+P,P,'k');fxR(c,hx-P,hy+2*P,P,'k',3,1);fxR(c,hx-2*P,hy,P,'p');fxR(c,hx+2*P,hy,P,'p');}else{fxR(c,hx-2*P,hy,P,'k',2,1);fxR(c,hx+P,hy,P,'k',2,1);fxR(c,hx-P,hy+2*P,P,'k',3,1);fxR(c,hx-2*P,hy+3*P,P,'k');fxR(c,hx+2*P,hy+3*P,P,'k');if(s.sg>0&&fst(t,6)%2){fxR(c,hx+2*P,hy+P,P,'b');fxR(c,hx+2*P,hy+2*P,P,'b');}}c.restore();},
  ev(s,n,o,A,g){if(n!=='wilt'||!s.l.p)return;s.sg=.9;const[hx,hy]=FXS.B_wilt.head(s,g),T1=.7;A.add({k:'fn',x:hx,y:hy,vx:(o.x-hx)/T1,vy:(o.y-hy)/T1-60,g:170,T:T1,fa:.8,d:(c,q,g)=>{const P=g.P,r=3+Math.floor(q.t*5);for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){const dd=i*i+j*j;if(dd>r*r||fhs(i+Math.floor(q.t*8),j)<.35)continue;c.globalAlpha=.75;fxR(c,q.x+i*P,q.y+j*P,P,dd>r*r*.6?'G':fhs(i,j)>.5?'e':'g');}},end:(A)=>A.burst(o.x,o.y,['G','e','g'],10,{v:90,T:.6,g:60})});}},
 /* The Padlock (v1.80: on the tool bar itself, the user's idea): chains cross your tools in an X and a padlock slams shut over them; the scene only keeps its clocks, fxLockBar draws it on a canvas over #tb (fxLockSync, from syncPw) */
 B_lock:{tick(s,g,dt){bossT(s,dt);}}});
/* ---------- bosses, batch 3 (v1.80) ---------- */
Object.assign(FXS,{
 /* The Gambler: a slot machine stands on the rim. Every time you are dealt a fruit it pulls its lever and the reels spin, the middle one landing on your Next fruit. Phase 2: it flashes red and plays with bigger fruit. Beaten: it pays out a shower of coins and its lights die */
 B_gamble:{x(g){return fq(fxRX('B_gamble',.66,82,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const l=s.l;if(s.jd==null)s.jd=l.jd;if(l.jd!==s.jd){s.jd=l.jd;s.sp=.8;s.side=[Math.floor(Math.random()*6),Math.floor(Math.random()*6)];}if(s.sp>0)s.sp-=dt;
   if(s.dnt!=null&&!s.pay){s.pay=1;const P=fxBP(g),x=FXS.B_gamble.x(g),y=fxRim(g)-4*P;for(let k=0;k<16;k++)A.add({k:'fn',x,y,vx:(Math.random()-.5)*200,vy:-200-Math.random()*200,g:900,T:1.4,dl:k*.04,fa:.7,d:(c,q,g)=>fxCoin(c,q.x,q.y,fxBP(g)*.5,[3,2,1,2][fst(q.t,14)%4],0,3)});}},
  front(c,g,s,t){const P=fxBP(g),x=FXS.B_gamble.x(g),rim=fxRim(g),u=Math.min(1,s.age/.6),y=rim-(u<1?Math.round(Math.pow(1-u,2)*40)*P:0),dead=s.dnt!=null&&s.dnt>.3,p2=s.p2t!=null,R=(a,b,col,w=1,h=1)=>fxR(c,x+a*P,y+b*P,P,col,w,h);c.save();c.globalAlpha=s.p;
   R(-8,-22,'k',17,4);R(-7,-21,'Y',15,2);for(let i=-6;i<=6;i+=2){const on=!dead&&((i/2+fst(t,p2?10:5))%2===0);R(i,-21,on?(p2?'r':'h'):'D');}
   R(-8,-18,'k',17,18);R(-7,-18,'r',14,17);R(6,-18,'R',2,17);R(-7,-18,'y',14,1);R(-7,-4,'y',14,1);
   R(-7,-15,'k',14,9);R(-6,-14,'w',12,7);const sp=s.sp>0?s.sp:0;
   for(let k=0;k<3;k++){const cx=x+(-4+k*4)*P,cy=y-10.5*P,stop=sp<=[.45,.25,.1][k];R(-6+k*4+(k?0:0),-14,'k',0,0);if(k)R(-6+k*4,-14,'s',1,7);
    if(!stop){const f=fst(t+k*.1,16)%6;drawFruit(c,cx,cy+(fst(t,16)%2?-P:P),P*1.4,f);c.fillStyle=FXP.s;c.globalAlpha=s.p*.6;c.fillRect(cx-P,cy-3*P,2*P,P);c.fillRect(cx-P,cy+2*P,2*P,P);c.globalAlpha=s.p;}
    else if(k===1){if(s.l.hid)T(c,'?',cx,cy+P*1.8,P*5,'#3b2346','center',FD);else if(s.l.ns==='stone'&&typeof drawStone==='function')drawStone(c,cx,cy,P*1.4);else drawFruit(c,cx,cy,P*1.5,s.l.nx||0);}
    else drawFruit(c,cx,cy,P*1.4,(s.side||[0,0])[k?1:0]);}
   if(dead){c.globalAlpha=s.p*.55;R(-6,-14,'D',12,7);c.globalAlpha=s.p;T(c,'TILT',x,y-9*P,P*4,'#e63946','center',FD);}
   R(-6,-4,'k',12,3);R(-5,-3,'x',10,1);R(-8,0,'k',17,1);
   const pull=s.sp>.6?2:s.sp>.5?1:0;R(9,-17+pull*3,'k',3,3);R(10,-16+pull*3,'r');R(10,-14+pull*3,'D',1,10-pull*3);R(9,-5,'k',3,2);c.restore();}},
 /* The Twins (v1.90, the user's pick: conjoined cherry ogres): one huge two-headed cherry monster squats on the rim, two glossy cherry heads joined by thick twisted stems that knot into one woody crown with leaves, gnarled thorny vine arms clawing the rim and roots trailing over it. The left head is a brute (heavy brows, fangs, tusks), the right a grinner (one big eye, one squint and a scar, a split grin of little teeth, a lolling tongue); their eyes follow your fruit and every few seconds they turn and snarl at each other. It lands with a thud that shakes the jar. Every Cherry the rule drops, the nearer head lurches out and spits it into the jar (stretched, mouth wide, juice spraying), snaps back squashed and chews up the next. Brambles creep down the glass with cherries hanging off them. Phase 2: both heads swell, veins show, the eyes burn white, the stems crack and bleed juice, the leaves wither, the hanging cherries drip, they snarl more often. Beaten: they turn on each other and bite, juice bursts, and both shrivel to dry husks, eyes crossed out, and dissolve */
 B_twins:{x(g){return fq(fxRX('B_twins',.24,196,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);if(!s.h||s.age<.02)s.h=[{st:'idle',tm:0},{st:'idle',tm:0}];const Q=fxBP(g),p2=s.p2t!=null,dead=s.dnt!=null,x=FXS.B_twins.x(g),rim=fxRim(g);
   for(const h of s.h){h.tm+=dt;if(h.st==='spit'&&h.tm>.22){h.st='rec';h.tm=0;}else if(h.st==='rec'&&h.tm>.18){h.st='chew';h.tm=0;}else if(h.st==='chew'&&h.tm>.75){h.st='idle';h.tm=0;}}
   if(s.age>.55&&!s.thd){s.thd=1;if(!RMO){A.jsA=Math.max(4*g.K,3);A.jsT=.45;}A.burst(x,rim-Q,['p','w','m'],18,{v:210,vy:-130,g:520,T:.8,w:130});}
   s.sn=(s.sn==null?3.2:s.sn)-dt;if(s.sn<=0&&!dead&&!RMO&&s.h.every(h=>h.st==='idle')){s.sn=p2?2.4+Math.random():4.8+Math.random()*2;s.snt=0;}if(s.snt!=null){s.snt+=dt;if(s.snt>.95)s.snt=null;}
   if(s.snt!=null&&s.snt>.2&&!s.snp&&!RMO){s.snp=1;for(let k=0;k<5;k++)A.add({k:'sq',x:x+(Math.random()-.5)*4*Q,y:rim-7*Q,vx:(Math.random()-.5)*120,vy:-60-Math.random()*60,g:600,T:.6,col:k%2?'w':'q'});}if(s.snt==null)s.snp=0;
   if(dead&&!s.bit&&s.dnt>.45){s.bit=1;A.burst(x,rim-11*Q,['r','R','q','w'],28,{v:250,vy:-150,g:700,T:.9,s:2});if(!RMO){A.jsA=3*g.K;A.jsT=.3;}}
   if(!RMO&&!dead&&s.p>0&&s.age>1.2){if(Math.random()<dt*(p2?2.2:1)){const d=Math.random()<.5?0:1;A.add({k:'sq',x:x+(d?13:-15)*Q,y:rim-3*Q,vy:30,g:500,T:1.4,col:Math.random()<.5?'q':'r',fy:g.bot-3});}
    if(p2&&Math.random()<dt*1.6){const d=Math.random()<.5?-1:1;A.add({k:'sq',x:x+d*(5+Math.random()*2)*Q,y:rim-(22+Math.random()*3)*Q,vy:10,g:420,T:1.6,col:Math.random()<.6?'R':'r',fy:g.bot-3});}}},
  /* the brambles down the glass: a thorny vine on each wall with leaves, blossoms and hanging cherries, growing in over the first seconds; phase 2 the cherries darken and drip juice down the glass */
  back(c,g,s,t){const u=fxArU(s);if(u<=0)return;const P=g.P,p2=s.p2t!=null,top=g.top,hgt=g.bot-top,gr=Math.min(1,s.age/5)*(p2?.9:.7),n=Math.floor(hgt*gr/P);c.save();c.globalAlpha=Math.ceil(u*3)/3*.95;
   for(const sd of[-1,1]){const wx=sd<0?g.L:g.R-P,cx=j=>wx-sd*Math.round(2+Math.sin(j*.21+(sd>0?2:0))*1.6+Math.sin(j*.07+1))*P;
    for(let j=0;j<n;j++){const xx=cx(j),y=top+j*P;fxR(c,xx,y,P,(j+(sd>0?3:0))%7===0?'N':'G');fxR(c,xx-sd*P,y,P,'g');fxR(c,xx+sd*P,y,P,'k');
     if(j%6===2){fxR(c,xx-sd*2*P,y,P,'N');fxR(c,xx-sd*3*P,y-P,P,'N');}
     if(j%11===6){fxR(c,xx-sd*2*P,y-P,P,'g');fxR(c,xx-sd*3*P,y-2*P,P,'l');fxR(c,xx-sd*2*P,y-2*P,P,'g');fxR(c,xx-sd*4*P,y-3*P,P,'g');}
     if(j%13===9&&!p2){const bx=xx-sd*3*P;fxR(c,bx,y,P,'y');fxR(c,bx-P,y,P,'p');fxR(c,bx+P,y,P,'p');fxR(c,bx,y-P,P,'p');fxR(c,bx,y+P,P,'p');}
     if(j%17===12&&j+5<n){const sx=xx-sd*2*P;for(let k=1;k<=3;k++)fxR(c,sx-sd*(k>>1)*P,y+k*P,P,'G');for(const o of[0,3]){const ox=sx-sd*(o+1)*P,oy=y+(4+(o?1:0))*P;fxR(c,ox-P,oy-P,P,'k',4,4);fxR(c,ox,oy,P,p2?'z':'R',2,2);fxR(c,ox-P+P,oy-P+P,P,p2?'R':'r');if(!p2)fxR(c,ox,oy,P,'q');
       if(p2){const ln=Math.min(9,Math.floor((s.p2t||0)*3+fhs(j,o)*4)),dr=fst(t+j*.3+o,3)%3;for(let d=0;d<ln;d++)fxR(c,ox+(o?P:0),oy+(3+d)*P,P,d===ln-1?'r':'R');if(!RMO)fxR(c,ox+(o?P:0),oy+(3+ln+dr)*P,P,'r');}}}}}
   c.restore();},
  front(c,g,s,t){if(!s.h)return;const Q=fxBP(g),dead=s.dnt!=null,dn=dead?s.dnt:0,p2=s.p2t!=null,x=FXS.B_twins.x(g),rim=fq(fxRim(g),Q)+fxDrop(s,Q),l=s.l;if(dead&&dn>3.4)return;
   const m=new Map(),set=(i,j,col)=>m.set(Math.round(i)+','+(-Math.round(j)),col),disc=(cx,cy,r,f)=>{const ri=Math.ceil(r);for(let j=-ri;j<=ri;j++)for(let i=-ri;i<=ri;i++)if(i*i+j*j<=r*r+.3){const v=f(i,j);if(v)set(Math.round(cx)+i,Math.round(cy)+j,v);}},
    bez=(a,b,e,n,f)=>{for(let k=0;k<=n;k++){const v=k/n,w=1-v;f(w*w*a[0]+2*v*w*b[0]+v*v*e[0],w*w*a[1]+2*v*w*b[1]+v*v*e[1],v,k);}};
   const sw=p2?1:0,shr=dead?Math.min(1,Math.max(0,(dn-.85)/1.1)):0,sn=s.snt!=null&&!dead,bite=dead&&dn<.85,hx=l.hx!=null?l.hx:x+40;
   /* each head's pose: idle (breathing, out of step), spit (lurches out, stretched, mouth wide), rec (snaps back squashed, teeth clenched), chew (cheeks working), snarl (both turn in), bite (beaten: they turn on each other), then shrivel */
   const HP=[0,1].map(d=>{const h=s.h[d],sd=d?1:-1,br=!RMO&&!dead&&h.st==='idle'&&!sn&&fst(t+d*.36,1.4)%2?1:0,lean=Math.sign((h.tx!=null?h.tx:x)-(x+sd*11*Q))||sd;let ox=0,oy=br,rx=9+sw,ry=9+sw,mo=d?2:3,ey='o';
    if(h.st==='spit'){ox=lean*2;oy=1;rx-=1;ry+=1;mo=6;ey='w';}else if(h.st==='rec'){ox=-lean;oy=0;rx+=1;ry-=1;mo=1;ey='s';}else if(h.st==='chew'){const f=fst(t,6)%2;mo=f?1:2;rx+=f;ey='o';}
    else if(sn){ox=-sd;mo=d?(fst(t,8)%2?5:2):4;ey='a';}
    if(bite){ox=-sd*(dn>.4?3:2);oy=1;mo=dn>.45?1:6;ey='a';}else if(dead){const k=Math.round(shr*2.5);oy=0;mo=2;ey=dn>1.05?'x':'s';rx-=k;ry-=k;ox=-sd*Math.round(1-shr);}
    return{d,sd,h,cx:sd*11+ox,cy:ry+1+oy,rx,ry,mo,ey,lean};});
   /* roots over the rim and the vine arms, behind the heads */
   for(const H of HP){const{sd,cx,rx}=H;for(const o of[-5,-2,2,5]){const len=2+Math.floor(fhs(o+5,H.d)*3);for(let k=0;k<len;k++)set(cx+o+((k+(RMO?0:fst(t+o,2)))%3===2?sd:0),1-k,k===len-1?'n':'N');}
    const sp=H.h.st==='spit',sl=dead&&dn>.85,sh=[cx+sd*(rx-1),H.cy-1],el=[cx+sd*(rx+4),H.cy+(sp?6:sl?0:3)],hd=[cx+sd*(rx+4+(sp?1:0)),2];
    bez(sh,el,hd,16,(px,py,v,k)=>{disc(px,py,1.6-v*.5,(i)=>i*sd>0?'G':i*sd<0?'g':'G');if(k===5||k===10||k===13){set(px,py+2,'N');set(px+sd,py+3,'N');}});
    for(const f of[-1,0,1]){set(hd[0]+f*1.4,1,'N');set(hd[0]+f*2,0,'N');set(hd[0]+f*2,-1,'N');set(hd[0]+f*2+(f?f:sd)*.6,-2,'c');}}
   /* the shared stems, twisted, up to one woody knot with leaves */
   const ky=Math.max(HP[0].cy+HP[0].ry,HP[1].cy+HP[1].ry)+7-Math.round(shr*3),kx=Math.round((HP[0].cx+HP[1].cx)/2);
   for(const H of HP){const{sd,cx}=H,t0=H.cy+H.ry;bez([cx-sd,t0-1],[cx+sd,t0+5],[kx+sd,ky-1],14,(px,py,v,k)=>{const cr=p2&&!dead&&(k===6||k===11);disc(px,py,1.8-v*.5,(i,j)=>cr&&i===0&&j===0?'r':cr&&i*i+j*j<=1?'R':(k*2+i-j+H.d*3)%7===0?'N':i<0?'g':'G');});}
   const wd=p2||dead,sa=RMO?0:(fst(t,2)%2?.07:0);for(const[a0,L0,s0]of[[.62,9,0],[2.35,6,1]]){const a=a0+sa*(s0?-1:1)+(dead?shr*1.6*(s0?1:-1):0),dx=Math.cos(a),dy=Math.sin(a);for(let k=0;k<=L0;k+=.5){const w=Math.sin(Math.PI*k/L0)*(s0?2.2:3.3);for(let o=-w;o<=w;o+=.5){if(wd&&fhs(Math.round(k*3),Math.round(o*2+9))>.9)continue;set(kx+dx*(k+1.5)-dy*o,ky+1+dy*(k+1.5)+dx*o,Math.abs(o)<.5?(wd?'N':'l'):o>0?(wd?'E':'g'):(wd?'n':'G'));}}}
   disc(kx,ky,3.3,(i,j)=>i===0&&j<1?'k':(i===-1&&j===1)||(i===1&&j===-2)?'k':i*i+j*j>6?(i<0&&j>0?'n':'N'):'n');set(kx-2,ky+3,'N');set(kx-3,ky+4,'N');set(kx-3,ky+5,'n');
   /* the heads: glossy cherries lit top left, a dimple where the stem goes in; the one acting is drawn last, over its twin */
   const ord=HP[1].h.st!=='idle'?[0,1]:[1,0];
   for(const d of ord){const H=HP[d],{cx,cy,rx,ry,sd}=H,lp=bite||sn?-sd:dead?0:Math.max(-1,Math.min(1,Math.round((hx-(x+cx*Q))/(30*g.K))));
    const dk=c0=>shr<=0?c0:shr<.5?({w:'q',q:'r',r:'R',R:'z',z:'z'}[c0]||c0):({w:'R',q:'R',r:'z',R:'z',z:'k'}[c0]||c0);
    const inE=(i,j)=>(i*i)/(rx*rx+rx*.7)+(j*j)/(ry*ry+ry*.7)<=1;
    for(let j=-ry-1;j<=ry+1;j++)for(let i=-rx-1;i<=rx+1;i++){if(!inE(i,j))continue;if(Math.abs(i)<=1&&j>=ry)continue;const nx=i/rx,ny=j/ry,n2=nx*nx+ny*ny;let col;
     const sp=(nx+.42)*(nx+.42)/.05+(ny-.45)*(ny-.45)/.025;if(sp<=1)col='w';else if(sp<=2.8)col='q';else{const sh=nx*.6-ny*.5+n2*.35;col=sh>.85?'z':sh>.42||(sh>.3&&FBY[((i+40)&3)*4+((j+40)&3)]<8)?'R':'r';}
     if(Math.abs(i)<=2&&j===ry-1)col='R';if(shr>0&&((i*3+j*5+d)%9===0)&&n2<.8)col='z';set(cx+i,cy+j,dk(col));}
    if(p2&&!dead){const pu=RMO?0:fst(t,3)%2;for(const[vx,vy]of(d?[[-8,-1],[-8,0],[-7,1],[-7,2],[-8,3],[-6,2],[-5,6],[-4,7],[-3,7],[-5,7],[6,-2],[7,-1],[7,0],[8,1],[7,-3]]:[[-8,1],[-7,2],[-7,3],[-6,4],[-6,5],[-5,6],[-8,4],[-3,7],[-2,8],[7,1],[7,2],[8,3],[6,3],[6,-3],[7,-4]]))set(cx+vx,cy+vy,pu&&(vx+vy)%2?'R':'z');}
    if(!dead||shr<.6){set(cx+sd*3,cy-5,dk('R'));set(cx+sd*4,cy-5,dk('R'));set(cx-sd*5,cy+3,dk('R'));}
    /* the face */
    const ec=p2?['w','y']:['y','o'],ey=H.ey,E=(ex,w,hh,big)=>{if(ey==='x'){for(let k=0;k<3;k++){set(ex+k,cy+k,'s');set(ex+2-k,cy+k,'s');}return;}if(ey==='s'){for(let i=0;i<w;i++)set(ex+i,cy+1,'k');if(!dead)set(ex+1+Math.max(0,lp),cy+1,ec[1]);return;}const tall=ey==='w'?hh+1:hh,j0=cy-(ey==='w'?1:0);for(let i=-1;i<=w;i++)for(let j=-1;j<=tall;j++)set(ex+i,j0+j,dk(j<0?'z':'R'));for(let i=0;i<w;i++)for(let j=0;j<tall;j++)set(ex+i,j0+j,'k');const gx=ex+Math.floor((w-2)/2)+lp*(w>3?1:0),gw=big?2:1;for(let i=0;i<gw;i++){set(gx+i+(big?0:1),j0+tall-2,ec[0]);if(tall>2||!big)set(gx+i+(big?0:1),j0+tall-3<j0?j0:j0+tall-3,ec[1]);}if(big)set(gx+(lp>0?1:0),j0+tall-1,'w');};
    if(d===0){E(cx-6,4,3,1);E(cx+1,4,3,1);const bd=ey==='a'?1:0;if(ey!=='x')for(const s0 of[-1,1])for(let k=0;k<5;k++){const bi=s0<0?cx-7+k:cx+5-k,bj=cy+4+Math.round(k*-.35)-bd+(k>3?0:0);set(bi,bj,'k');set(bi,bj+1,'k');set(bi,bj+2,dk('R'));}
     const my=cy-3,mo=H.mo;if(mo<=1){for(let i=-5;i<=5;i++){set(cx+i,my+1,'k');set(cx+i,my,(i+9)%3?'c':'k');set(cx+i,my-1,(i+10)%3?'c':'k');set(cx+i,my-2,'k');}}else for(let i=-5;i<=5;i++)for(let j=0;j<mo;j++){const e=j===0||j===mo-1;set(cx+i,my-j,e?'k':j===mo-2&&mo>3?'z':'k');}
     if(mo>1){for(const fi of[-3,3])for(let k=1;k<=Math.min(2,mo-2);k++)set(cx+fi,my-k,'c');if(mo>2)for(const fi of[-5,-1,1,5])set(cx+fi,my-1,'c');if(mo>3)for(const fi of[-4,-2,2,4])set(cx+fi,my-mo+2,'c');if(mo>=5)for(let i=-1;i<=1;i++)set(cx+i,my-mo+2,'p');}
     for(const s0 of[-1,1]){set(cx+s0*6,my-mo+1,'c');set(cx+s0*6,my-mo+2,'c');set(cx+s0*6,my-mo+3,'w');}
     if(!dead&&mo<5){const ln=1+(RMO?1:fst(t+.4,3)%3);for(let k=1;k<=ln;k++)set(cx-4,my-mo+1-k,k===ln?'q':'w');}}
    else{if(!dead||shr<.5)for(let k=0;k<8;k++){const si=cx+1+Math.round(k*.62),sj=cy+5-k;set(si,sj,'z');if(k%2){set(si-1,sj,'k');set(si+1,sj,'k');}}E(cx-6,4,4,1);E(cx+2,3,2,0);if(ey!=='x'){set(cx+1,cy+4,'k');set(cx+2,cy+4,'k');set(cx+3,cy+3,'k');set(cx+4,cy+3,'k');set(cx+5,cy+4,'k');set(cx-6,cy+4+(ey==='a'?-1:0),'k');set(cx-5,cy+5,'k');set(cx-4,cy+5,'k');set(cx-3,cy+4+(ey==='a'?-1:0),'k');}
     const mo=H.mo,jm=i=>cy-3+Math.round(i*i/14);for(let i=-6;i<=6;i++){const mh=Math.max(1,Math.round(mo*(1-(i/7.5)*(i/7.5)))),top=jm(i);if(mo<=1||mh<=1){set(cx+i,top,'k');set(cx+i,top-1,(i+6)%2?'c':'k');set(cx+i,top-2,'k');continue;}set(cx+i,top,'k');set(cx+i,top-1,(i+6)%2?'c':'k');for(let j=2;j<mh+1;j++)set(cx+i,top-j,j===mh-1&&mh>3?'z':'k');set(cx+i,top-mh,(i+7)%2?'c':'k');set(cx+i,top-mh-1,'k');}
     if(mo>=4){const tb=jm(2)-Math.max(1,Math.round(mo*(1-(2/7.5)*(2/7.5))));for(let k=0;k<3+(mo>4?1:0);k++){set(cx+2,tb-k,k?'p':'m');set(cx+3,tb-k,'m');}set(cx+2,tb-3-(mo>4?1:0),'p');}}}
   const u=Math.min(1,s.age/1.2)*(dead&&dn>1.9?Math.max(0,1-(dn-1.9)/1.4):1);c.save();c.globalAlpha=s.p;fxBlob(c,x,rim,Q,fxFade(m,u));
   /* the eyes glow */
   if(!dead&&p2){c.globalAlpha=s.p*.45;const gc='y';for(const H of HP){if(H.ey==='s')continue;const ex=H.d?[[-6,4],[2,3]]:[[-6,4],[1,4]];for(const[e0,w]of ex)for(let j=-2;j<=4;j++)for(let i=-1;i<=w;i++){if((i>=0&&i<w&&j>=0&&j<=2)||FBY[((i+8)&3)*4+((j+8)&3)]/16>.5)continue;fxR(c,x+(H.cx+e0+i)*Q,rim-(H.cy+j)*Q,Q,gc);}}}
   c.restore();},
  ev(s,n,o,A,g){if(n!=='twins'||!s.l.p||s.dnt!=null||!s.h)return;const Q=fxBP(g),x=FXS.B_twins.x(g),rim=fxRim(g);let d=o.x>x?1:0;const bz=h=>h.st==='spit'||h.st==='rec';if(bz(s.h[d])&&!bz(s.h[1-d]))d=1-d;const h=s.h[d],sd=d?1:-1;h.st='spit';h.tm=0;h.tx=o.x;s.snt=null;
   const lean=Math.sign(o.x-(x+sd*11*Q))||sd,R0=10+(s.p2t!=null?1:0),mx=x+(sd*11+lean*2)*Q,my=rim-(R0-3)*Q;A.burst(mx,my,['r','q','w','R'],9,{v:130,vy:-20,T:.4});
   const T1=.28,G=1500,tx=o.x,ty=g.top+4;A.add({k:'fn',x:mx,y:my,vx:(tx-mx)/T1,vy:(ty-my-.5*G*T1*T1)/T1,g:G,T:T1,fa:1,d:(c,q,g)=>drawFruit(c,q.x,q.y,g.P*3,0),end:(A)=>A.burst(tx,ty,['r','q','w'],6,{v:90,T:.35})});}},
 /* The Miser: a hunched old man in a nightcap shuffles onto the rim clutching a glass jar. Every time your tools would charge, a spark of it flies up out of the tool bar into his jar instead. Phase 2: he hugs the jar and takes every spark. Beaten: the jar smashes and the sparks fly home */
 B_miser:{x(g){return fq(fxRX('B_miser',.79,64,g)+18*g.K,fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const home=FXS.B_miser.x(g);if(s.age<.05||s.x==null){s.x=g.W+50;s.n=0;}if(s.dnt!=null){if(!s.br){s.br=1;const P=fxBP(g),jx=s.x-7*P,jy=fxRim(g)-5*P;A.burst(jx,jy,['i','w','b'],12,{v:150,T:.6,s:1});for(let k=0;k<Math.min(14,4+s.n);k++)A.add({k:'sq',x:jx,y:jy,vx:(Math.random()-.5)*160,vy:100+Math.random()*200,g:500,T:1.1,col:k%2?'t':'w',dl:k*.03});}if(s.dnt>.6)s.x+=dt*120;}else if(s.x>home)s.x=Math.max(home,s.x-dt*60);if(s.gl>0)s.gl-=dt;},
  front(c,g,s,t){const P=fxBP(g),rim=fxRim(g),home=FXS.B_miser.x(g),x=s.x,walk=s.x!==home,p2=s.p2t!=null,dead=s.dnt!=null;c.save();c.globalAlpha=s.p;const fr=walk?(fst(t,4)%2?'msW':'msS'):'msS';fxS(c,fr,x,rim,P,{fl:dead&&s.dnt>.6});
   if(!dead){const hug=p2?2:0,jx=x-(7-hug)*P,jy=rim-5*P,lv=Math.min(5,Math.floor(s.n/2));for(let j=0;j<7;j++)for(let i=-2;i<=2;i++){const e=Math.abs(i)===2||j===6;fxR(c,jx+i*P,jy-3*P+j*P,P,e?'k':(6-j)<=lv?(fst(t+j*.1,6)%3===0?'w':'t'):'i');}fxR(c,jx-2*P,jy-4*P,P,'k',5,1);fxR(c,jx-P,jy-5*P,P,'N',3,1);if(s.gl>0){c.globalAlpha=s.p*.5;fxR(c,jx-3*P,jy-4*P,P,'t',7,1);fxR(c,jx-3*P,jy+4*P,P,'t',7,1);c.globalAlpha=s.p;}fxR(c,jx+2*P,jy,P,'f',2,1);
    if(p2&&fst(t,3)%2)fxR(c,x-3*P,rim-12*P,P,'y');}c.restore();},
  ev(s,n,o,A,g){if(n!=='charge'||!s.l.p||s.dnt!=null)return;const P=fxBP(g),take=s.p2t!=null?2:1;for(let k=0;k<2;k++){const x0=g.L+(g.R-g.L)*(.2+Math.random()*.6),y0=g.H+6,mine=k<take,T1=.7;A.add({k:'fn',x:x0,y:y0,T:T1,dl:k*.08,fa:1,mine,d:(c,q,g)=>{const u=Math.max(0,q.t-(q.dl||0))/T1,jx=s.x-((s.p2t!=null)?5:7)*P,jy=fxRim(g)-9*P,ex=q.mine?jx:x0+(k?40:-40),ey=q.mine?jy:g.H-60,x=x0+(ex-x0)*u+Math.sin(u*Math.PI)*(k?-30:30),y=y0+(ey-y0)*u;fxR(c,x,y,g.P,'t');fxR(c,x,y-g.P,g.P,'w');c.globalAlpha*=.5;fxR(c,x,y+g.P,g.P,'t');},end:k<take?()=>{s.n++;s.gl=.25;}:null});}}},
 /* The Quarry: a miner pushes a cart of rocks along rails on the rim. When a rock is next, he wheels it over; when it reaches your hand he tips it in. Phase 2: the cart is heaped and his lamp flashes red. Beaten: the cart tips over and he waves goodbye */
 B_stone:{park(g){return fq(fxRX('B_stone',.8,84,g)-16*g.K,fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const l=s.l,park=FXS.B_stone.park(g),P=fxBP(g);if(s.cx==null){s.cx=g.W+60;s.tip=0;}
   if(l.rock&&!s.rk){s.rk=1;s.tip=.55;A.burst(l.hx,l.hy-l.hr,['d','s','D'],8,{v:90,T:.45,s:1});}if(!l.rock)s.rk=0;if(s.tip>0)s.tip-=dt;
   const tgt=s.dnt!=null?park:(l.nxr||s.tip>0)?Math.max(g.L+14*P,Math.min(g.R-6*P,l.hx+9*P)):park;const d=tgt-s.cx;s.mv=Math.abs(d)>1;if(s.mv)s.cx+=Math.sign(d)*Math.min(Math.abs(d),dt*(s.p2t!=null?170:120));
   if(s.dnt!=null&&s.dnt>.4&&!s.fall){s.fall=1;for(let k=0;k<6;k++)A.add({k:'fn',x:s.cx-4*P,y:fxRim(g)-8*P,vx:-60-Math.random()*90,vy:-120-Math.random()*60,g:900,T:1.5,fa:.6,r:6+Math.random()*5,d:(c,q,g)=>{if(typeof drawStone==='function')drawStone(c,q.x,q.y,q.r);}});}},
  front(c,g,s,t){const P=fxBP(g),rim=fxRim(g),x=s.cx,p2=s.p2t!=null,dead=s.dnt!=null;c.save();c.globalAlpha=s.p;
   for(let xx=g.L+(g.R-g.L)*.2;xx<g.R;xx+=P){const i=Math.round(xx/P);fxR(c,xx,rim-P,P,i%3===0?'N':'d');}
   const tip=s.tip>0||(dead&&s.dnt>.4),fl=dead&&s.dnt>.4?2:0,wb=s.mv&&fst(t,10)%2?-P:0;
   const bx=x-5*P,by=rim-2*P;for(const wx of[-3,3]){fxR(c,x-5*P+(wx+5)*P-P,rim-2*P,P,'k',2,2);fxR(c,x-5*P+(wx+5)*P,rim-2*P,P,'D');}
   const tl=i=>tip?Math.round(i*.35)*P:0; /* tipping: the back of the cart lifts */for(let j=0;j<5;j++)for(let i=0;i<10;i++){const e=i===0||i===9||j===4;fxR(c,bx+i*P,by-(j+1)*P-tl(i)+wb,P,e?'k':(j===3?'d':'D'));}
   const heap=p2?3:2;for(let i=1;i<9;i++){const h=Math.round(heap*Math.sin(Math.PI*i/9)+(fhs(i,3)>.6?1:0));if(tip&&i<4)continue;for(let j=0;j<h;j++)fxR(c,bx+i*P,by-(6+j)*P-tl(i)+wb,P,(i+j)%3===0?'D':(i+j)%3===1?'d':'s');}
   const mx=x+9*P,leg=s.mv?(fst(t,8)%2?'mnW':'mnS'):'mnS';fxS(c,leg,mx,rim-P,P);if(p2&&fst(t,4)%2)fxR(c,mx,rim-14*P,P,'r');if(dead&&s.dnt>.8&&fst(t,4)%2)fxR(c,mx+5*P,rim-16*P,P,'f',2,2);c.restore();}},
 /* The Mirror: a magic mirror hangs in the sky (charm grid, low enough to clear the HUD in the real game) and a shimmering line runs down the middle of the jar. A ghost of your fruit shows where your finger is, with a dotted arc to where it will really drop. Phase 2: the mirror cracks. Beaten: it shatters */
 B_mirror:{tick(s,g,dt,A){bossT(s,dt);if(s.dnt!=null&&!s.sh){s.sh=1;const P=fxBP(g),mx=fxRX('B_mirror',.17,56,g),my=fxRim(g)-52;for(let k=0;k<16;k++){const a=Math.random()*Math.PI*2;A.add({k:'sq',x:mx+Math.cos(a)*20,y:my+Math.sin(a)*24,vx:Math.cos(a)*100,vy:Math.sin(a)*60-40,g:600,T:1,col:k%3?'i':'w',s:1});}}},
  front(c,g,s,t){const P=g.P,u=Math.min(1,s.age/.8),dead=s.dnt!=null;c.save();
   if(!dead||s.dnt<.6){const a=(dead?1-s.dnt/.6:u)*.55;c.globalAlpha=a;const ax=fq(g.W/2,g.P),ph=fst(t,8);for(let y=fxRim(g)-60;y<g.bot;y+=g.P){const k=Math.round(y/g.P)+ph;if(k%4<2)fxR(c,ax,y,g.P,k%8<2?'w':'b');}}
   const l=s.l;if(l.can&&!dead){const gx=g.W-l.hx,gy=l.hy;c.globalAlpha=.35*u;drawFruit(c,gx,gy,l.hr,l.l||0);c.globalAlpha=.8*u;for(let k=1;k<12;k++){const v=k/12,x=gx+(l.hx-gx)*v,y=gy-Math.sin(v*Math.PI)*28-6;if(k%2)fxR(c,x,y,g.P,'b');}}
   c.globalAlpha=s.p;if(dead&&s.dnt>.05){c.restore();return;}
   const mx=fq(fxRX('B_mirror',.17,56,g),P),my=fq(fxRim(g)-52-(1-u)*(1-u)*80,P),rx=7,ry=10,cr=s.p2t!=null;
   for(let j=-ry-2;j<=ry+2;j++)for(let i=-rx-2;i<=rx+2;i++){const d=(i*i)/((rx+2)*(rx+2))+(j*j)/((ry+2)*(ry+2)),d2=(i*i)/(rx*rx)+(j*j)/(ry*ry);if(d>1.05)continue;let col;if(d2<=1){col=(i-j*.5>2&&i-j*.5<4)?'w':'i';if(cr&&(Math.abs(i+Math.round(j*.4))<1&&j>-5&&j<6||(j===2&&i>0&&i<5)||(j===-3&&i<0&&i>-4)))col='k';}else col=d>.92?'k':d2<1.35?'Y':'y';fxR(c,mx+i*P,my+j*P,P,col);}
   fxR(c,mx-2*P,my-(ry+3)*P,P,'k',5,2);fxR(c,mx-P,my-(ry+3)*P,P,'y',3,1);fxR(c,mx,my-(ry+4)*P,P,'r');
   const bl=(t%3.3)<.12;c.globalAlpha=s.p*.75;if(!bl){fxR(c,mx-3*P,my-2*P,P,'U',2,2);fxR(c,mx+P,my-2*P,P,'U',2,2);fxR(c,mx-2*P,my-2*P,P,'w');fxR(c,mx+2*P,my-2*P,P,'w');}else{fxR(c,mx-3*P,my-P,P,'U',2,1);fxR(c,mx+P,my-P,P,'U',2,1);}fxR(c,mx-2*P,my+3*P,P,'U',5,1);fxR(c,mx+2*P,my+2*P,P,'U');c.restore();}}});

/* ---------- bosses, batch 4 (v1.81) ---------- */
/* shared: a rim prop drops in with a bounce over its first 0.6 s (fxDrop = the y offset), fxPt = a cell painter at an origin, fxEl = a filled ellipse in cells (fn(i,j,edge) = its colour) */
const fxDrop=(s,P,T=.6)=>{const u=Math.min(1,(s.age||0)/T);return u<1?-Math.round(Math.pow(1-u,2)*40)*P:0;},fxPt=(c,x0,y0,P)=>(i,j,col,w,h)=>fxR(c,x0+i*P,y0+j*P,P,col,w,h);
function fxEl(c,x0,y0,P,rx,ry,fn){const d=(a,b)=>(a*a)/(rx*rx+rx*.7)+(b*b)/(ry*ry+ry*.7)<=1;for(let j=-ry-1;j<=ry+1;j++)for(let i=-rx-1;i<=rx+1;i++){if(!d(i,j))continue;const col=fn(i,j,!d(i+1,j)||!d(i-1,j)||!d(i,j+1)||!d(i,j-1));if(col)fxR(c,x0+i*P,y0+j*P,P,col);}}
Object.assign(FXD,{
oqA:`
......k.k.k......
.....kykykyk.....
.....kyyyyyk.....
.....kyrybyk.....
....kNNNNNNNk....
...kNNfffffNNk...
...kNfkfffkfNk...
...kNfffffffNk...
...kNffrrrffNk...
....kNfffffNk....
.....kkfffkk.....
..kPPkwwwwwkPPk..
.kPPkwkwwkwwkPPk.
.kPVkrrrgrrrkVPk.
kPVkrrrrgrrrrkVPk
kPVkrrrrrgrrrkVPk
kPVkRrrrrrgrrkVPk
kPVkRrrrrrrgrkVPk
kPVkRRrrrrrrrkVPk
kPVkRRrrrrrrRkVPk
kPVkRRRrrrrRRkVPk
kVVkkkkkkkkkkkVVk
.kkk.........kkk.`,
oqB:`
......k.k.k......
.....kykykyk.....
.....kyyyyyk.....
.....kyrybyk.....
....kNNNNNNNk....
...kNNfffffNNk...
...kNfkkfkkfNk...
...kNfffffffNk...
...kNffrrrffNk...
....kNfffffNk....
.....kkfffkk.....
..kPPkwwwwwkPPk..
.kPPkwkwwkwwkPPk.
.kPVkrrrgrrrkVPk.
kPVkrrrrgrrrrkVPk
kPVkrrrrrgrrrkVPk
kPVkRrrrrrgrrkVPk
kPVkRrrrrrrgrkVPk
kPVkRRrrrrrrrkVPk
kPVkRRrrrrrrRkVPk
kPVkRRRrrrrRRkVPk
kVVkkkkkkkkkkkVVk
.kkk.........kkk.`,
slS:`
..kkkkkkk..
..kyyyyyk..
.kyyyykkyk.
.kyyyykkyk.
.kyykkkyyk.
.kykyykyyk.
kyyyykkyyyk
kyyykyykyyk
kyykyyyykyk
kyyyyyyyyyk
kybbbbbbbyk
kyyyyyyyyyk
kkkkkkkkkkk
k.........k`,
rtA:`
....kkkkk....
..kkrrwrrkk..
.krwwrrrrrrk.
krrwwrrrwwrrk
krrrrrrrwwrrk
krwwrrrrrrrrk
krwwrrrrrwrRk
.kccccccccck.
..kkkkkkkkk..
...kccccck...
...kckckck...
...kccccck...
...kckkkck...
...kccccck...
..kkkkkkkkk..`,
auS:`
...kkkkkk...
..kNNNNNNk..
.kNNNNNNNNk.
.kNfffffNNk.
.kkkkkkkkkk.
.kfkbbkbbkfk
.kfkkkfkkkfk
..kfffffffk.
..kffkrkffk.
...kffffffk.
....kwwwk...
..kkUwwwUkk.
.kUUUwrwUUUk
.kUUUwrwUUUk
.kUUUUrUUUUk
.kUUUUUUUUUk
..kUUUkUUUk.
..kUUk.kUUk.
.kkkk...kkkk`,
auA:`
...kkkkkk...
..kNNNNNNk..
.kNNNNNNNNk.
.kNfffffNNk.
.kkkkkkkkkk.
.kfkhhkhhkfk
.kfkkkfkkkfk
..kfffffffk.
..kffkkkffk.
...kffffffk.
....kwwwk...
..kkUwwwUkk.
.kUUUwrwUUUk
.kUUUwrwUUUk
.kUUUUrUUUUk
.kUUUUUUUUUk
..kUUUkUUUk.
..kUUk.kUUk.
.kkkk...kkkk`,
ldA:`
..k.....k..
...k...k...
...kkkkk...
...kwkwk...
..kkkkkkk..
kkqqrkrrRkk
.kqkrkrkRk.
kkrrrkrrRkk
.krkrkrkRk.
kkkrrkrRkkk
...kkkkk...`,
ldB:`
..k.....k..
...k...k...
...kkkkk...
...kwkwk...
k.kkkkkkk.k
.kqqrkrrRk.
kkqkrkrkRkk
.krrrkrrRk.
kkrkrkrkRkk
..krrkrRk..
...kkkkk...`,
ldC:`
..k.....k..
...k...k...
...kkkkk...
...kwkwk...
..kkkkkkk..
.kqqrkrrRk.
.kqgrkrgRk.
.krrrkrrRk.
.krgrkrgRk.
..krrkrRk..
...kkkkk...`});
FXD.rtV=FXD.rtA.replace(/r/g,'V').replace(/R/g,'x').replace(/w/g,'l');FXD.rtD=FXD.rtA.replace(/[rR]/g,'D').replace(/[wc]/g,'s'); /* the toadstool rotten (phase 2) and shrivelled (beaten) */
Object.assign(FXS,{
 /* The Glutton: a place setting on the rim, plate, knife and fork. As its next meal comes round the knife and fork bang on the table; every meal leaves a core on the plate and a burp floats out of the jar. Phase 2: they never stop banging. Beaten: a napkin over the plate, cutlery crossed on top */
 B_glut:{x(g){return fq(fxRX('B_glut',.7,72,g),fxBP(g));},
  tick(s,g,dt){bossT(s,dt);if(s.bg>0)s.bg-=dt;},
  front(c,g,s,t){const P=fxBP(g),x=FXS.B_glut.x(g),rim=fxRim(g),dy=fxDrop(s,P),R=fxPt(c,x,rim+dy,P),dead=s.dnt!=null,p2=s.p2t!=null;c.save();c.globalAlpha=s.p;
   fxEl(c,x,rim+dy-2*P,P,8,2,(i,j,e)=>e?'k':j<-1?'s':Math.abs(i)>5||j>0?'s':'w');R(-4,-3,'w',9,1);R(-6,-1,'d',13,1);
   const nc=Math.min(4,s.n||0);for(let k=0;k<nc;k++){const cx=-6+k*4+(nc===1?5:nc===2?3:nc===3?2:0);R(cx,-8,'k',4,1);R(cx-1,-7,'k',6,1);R(cx,-7,'r',3,1);R(cx+3,-7,'R');R(cx,-6,'k',4,2);R(cx+1,-6,'f');R(cx+2,-6,'F');R(cx+1,-5,'F');R(cx+2,-5,'f');R(cx-1,-4,'k',6,1);R(cx,-4,'r',3,1);R(cx+3,-4,'R');R(cx,-3,'k',4,1);R(cx+2,-9,'N');R(cx+3,-10,'G');}
   if(dead){const u=Math.min(1,s.dnt/.5),ny=-Math.round((1-u)*14);for(let i=-6;i<=6;i++)for(let j=-3;j<=0;j++){const e=i===-6||i===6||j===-3;R(i,ny+j,e?'k':((i+j)&1)?'r':'w');}
    if(u>=1){for(let k=0;k<9;k++){R(-5+k,-9+k,'k');R(-4+k,-9+k,'s');R(5-k,-9+k,'k');R(4-k,-9+k,'d');}}c.restore();return;}
   const due=(s.l.n===1)||p2,bang=due&&!RMO,fr=fst(t,p2?7:5)%2,fy=bang&&fr?-3:0,ky=bang&&!fr?-3:0,up=s.bg>0?-6:0;
   const fork=(fx,fy2)=>{R(fx-3,fy2-15,'k',7,5);for(const q of[-2,0,2])R(fx+q,fy2-14,q<0?'w':'s',1,3);R(fx-2,fy2-11,'s',5,1);R(fx-2,fy2-10,'k',5,1);R(fx-1,fy2-10,'s',3,1);R(fx-1,fy2-9,'k',3,9);R(fx,fy2-9,'s',1,8);for(const q of[-1,1])R(fx+q,fy2-15,'.');};
   const knife=(kx,ky2)=>{R(kx-1,ky2-14,'k',3,1);R(kx-2,ky2-13,'k',1,8);R(kx+1,ky2-13,'k',1,8);R(kx-1,ky2-13,'w',1,7);R(kx,ky2-13,'s',1,7);R(kx-2,ky2-6,'k',4,1);R(kx-1,ky2-5,'N',2,4);R(kx-2,ky2-5,'k',1,5);R(kx+1,ky2-5,'k',1,5);R(kx-1,ky2-1,'k',2,1);};
   fork(-10,fy+up);knife(10,ky+up);
   if(bang&&(fy||ky)&&fst(t,p2?7:5)!==s.lb){s.lb=fst(t,p2?7:5);}
   if(bang&&fst(t,p2?7:5)%2===0){R(-12,-1,'D');R(-8,-1,'D');}else if(bang){R(8,-1,'D');R(12,-1,'D');}
   if(p2&&fst(t,3)%2){R(-1,-17,'r',2,3);R(-1,-13,'r',2,1);}c.restore();},
  ev(s,n,o,A,g){if(n!=='glut'||!s.l.p||s.dnt!=null)return;s.n=(s.n||0)+1;s.bg=.5;const P=g.P;A.burst(o.x,o.y,['f','F','y'],10,{v:150,T:.5});
   A.add({k:'fn',x:o.x,y:o.y-(o.r||20)-4*P,vy:-45,T:1.6,dl:.35,fa:.5,sw:6,sf:3,d:(c,q,g,t,x)=>{const P=fxBP(g),k=Math.min(3,1+Math.floor(q.t/.1));for(const[dx,dy,r]of[[-5,1,4],[4,0,5],[0,-4,4]].slice(0,k))fxEl(c,fq(x+dx*P,P),fq(q.y+dy*P,P),P,r,r-1,(i,j,e)=>e?'k':j<-r+2?'w':i+j>r?'g':'l');if(k>=3)T(c,'BURP!',x,q.y,18,'#2a1a3a','center',FD);}});}},
 /* The Syrup (v1.87, a monster in the bottle, the user's ask): a big syrup bottle on the rim with a syrup creature living in it, glaring at the fruit in your hand through the glass, bubbles rising round it; a goo tendril curls out of the neck and flings a glob onto every Sticky fruit you are handed, and syrup oozes down the inside of the jar's walls. Phase 2: the glass cracks and leaks, the creature turns red-eyed and bares its teeth, a puddle spreads on the floor. Beaten: its eyes shut, the syrup drains away, the cap pops off and the bottle fades */
 B_sticky:{x(g){return fq(fxRX('B_sticky',.28,110,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const l=s.l;if(s.hp>0)s.hp-=dt;if(l.st&&!s.was&&s.dnt==null){s.hp=.5;const P=fxBP(g),x0=FXS.B_sticky.x(g)+(l.hx!=null&&l.hx<FXS.B_sticky.x(g)?-16:16)*P,y0=fxRim(g)-32*P,T1=.5;s.ct=0;s.tx=l.hx;A.add({k:'fn',x:x0,y:y0,vx:(l.hx-x0)/T1,vy:(l.hy-l.hr-y0-.5*900*T1*T1)/T1,g:900,T:T1,fa:1,d:(c,q,g)=>{const P=g.P;fxEl(c,fq(q.x,P),fq(q.y,P),P,2,2,(i,j,e)=>e?'k':i<0&&j<0?'y':'Y');},end:(A2,g)=>{s.ct=.01;A2.burst(l.hx,l.hy-l.hr,['Y','o','y'],8,{v:110,T:.4});}});}
   s.was=l.st;if(s.ct>0&&l.st)s.ct+=dt;if(!l.st)s.ct=0;if(s.dnt!=null&&!s.cp&&s.dnt>.9){s.cp=1;const P=fxBP(g),x=FXS.B_sticky.x(g);A.add({k:'fn',x,y:fxRim(g)-24*P,vx:-90,vy:-240,g:700,T:1.2,fa:.7,d:(c,q,g2)=>{const Q=fxBP(g2);fxBlob(c,fq(q.x,Q),fq(q.y,Q),Q,new Map([['-1,0','r'],['0,0','r'],['1,0','R'],['0,-1','r']]));}});}
   if(!RMO&&s.dnt==null&&Math.random()<dt*(s.p2t!=null?1.6:.7)){const P=g.P,sd=Math.random()<.5,wx=sd?g.L+2*P:g.R-3*P;A.add({k:'sq',x:wx,y:g.top+(10+Math.random()*30)*P,vy:30,g:260,T:1.4,col:'Y',ly:0,fy:g.bot-2*P});}},
  back(c,g,s,t){const P=g.P,jh=(g.bot-g.top)/P,gr=Math.min(1,s.age/6)*(s.p2t!=null?1:.55)*(s.dnt!=null?Math.max(0,1-s.dnt/1.5):1);if(gr<=0)return;c.save();c.globalAlpha=s.p;
   for(const sd of[0,1])for(let k=0;k<4;k++){const len=Math.round(jh*gr*(.25+.55*fhs(k,sd+2))),x=sd?g.R-(k===0?1:k===1?2:k===2?1:3)*P:g.L+(k===0?0:k===1?1:k===2?0:2)*P;if(k===3&&sd)continue;for(let j=0;j<len;j++)fxR(c,x,g.top+j*P,P,j===len-1?'o':(j%5===0?'y':'Y'));const bob=fst(t+k*.7,2)%3===0?1:0;fxR(c,x,g.top+(len+bob)*P,P,'o');}
   if(s.p2t!=null){const pw=Math.min(1,s.p2t/3);for(let x=g.L;x<g.R;x+=P){const h=Math.round(pw*(1.5+Math.sin(x*.07)+fhs(Math.round(x/P),9)*.8));for(let j=0;j<h;j++)fxR(c,x,g.bot-(j+1)*P,P,j===h-1?'y':'Y');}}c.restore();},
  front(c,g,s,t){const Q=fxBP(g),x=FXS.B_sticky.x(g),rim=fq(fxRim(g),Q)+fxDrop(s,Q),dead=s.dnt!=null,dn=dead?s.dnt:0,p2=s.p2t!=null,l=s.l;if(dead&&dn>2.6)return;c.save();c.globalAlpha=s.p;
   for(const f of l.sk||[]){const P=g.P;for(const k of[-1,1]){const len=2+(fst(t*.7+k+f.x*.01,3)%3);for(let j=0;j<len;j++)fxR(c,f.x+k*f.r*.45,f.y+f.r*.75+j*P,P,j===len-1?'o':'Y');}fxR(c,f.x-f.r*.3,f.y-f.r*.8,P,'y',2,1);}
   const m=new Map(),hp=s.hp>0,look=l.hx!=null?Math.sign(l.hx-x):1,BH=j=>j<=15?6:j===16?5:j===17?4:j<=21?2:j===22?3:0,mel=dead?Math.min(1,dn/1.1):0,rise=Math.min(1,s.age/1.6)*(1-mel);
   /* the bottle: glass walls, molasses inside, a label with a red drip; its cap lies on the rim */
   for(let j=1;j<=22;j++){const hw=BH(j);for(let i=-hw;i<=hw;i++){let col;if(Math.abs(i)===hw||j===1)col=i===-hw&&j>2&&j<16?'w':'j';else if(j<=13)col=j===13?'Y':i<=-hw+2?'Y':i>=hw-2?'N':'o';else col=j<=15&&i<-hw+3?'w':'i';m.set(i+','+(-j),col);}}
   for(let i=-4;i<=4;i++)for(let j=5;j<=9;j++)m.set(i+','+(-j),(j===5||j===9)?'s':'c');for(const[i,j,col]of[[0,-8,'r'],[-1,-7,'r'],[0,-7,'r'],[1,-7,'R'],[-1,-6,'R'],[0,-6,'R'],[1,-6,'R'],[-1,-7,'w']])m.set(i+','+j,col);m.set('-1,-7','w');
   if(p2&&!dead){for(const[i,j]of[[-5,-12],[-4,-11],[-4,-10],[-3,-9],[4,-14],[5,-13],[4,-12]])m.set(i+','+j,'k');const dl=1+fst(t,3)%3;for(let k=0;k<dl;k++)m.set('-7,'+(-10+k),'Y');}
   for(const[i,j,col]of[[-9,0,'R'],[-8,0,'r'],[-7,0,'r'],[-8,-1,'r']])m.set(i+','+j,col);
   /* the syrup genie: a body of syrup pouring up out of the neck, widening into a head with an evil grin; it sinks back in when beaten */
   const top=23,len=Math.round(19*rise),sway=RMO?0:t*1.7;if(len>1){for(let k=0;k<=len;k++){const v=k/19,hw=Math.round(1.5+v*v*(p2?9:8)),cx=Math.round(Math.sin(sway+v*3)*v*2.5);for(let i=-hw;i<=hw;i++){const col=i<=-hw+1?'y':i>=hw-1?'o':'Y';m.set((cx+i)+','+(-(top+k)),col);}if(k>4&&k%4===1&&hw>2){const dx=cx+((k>>2)%2?hw:-hw),dl=1+(fst(t+k,3)%3);for(let d=1;d<=dl;d++)m.set(dx+','+(-(top+k)+d),'o');}}
    const hk=len,hcx=Math.round(Math.sin(sway+hk/19*3)*hk/19*2.5),hy=-(top+hk),hw=p2?10:9;for(let j=0;j<=8;j++){const w=Math.round(hw*Math.sqrt(Math.max(0,1-Math.pow((j-3)/6,2))));for(let i=-w;i<=w;i++)m.set((hcx+i)+','+(hy-j),i<=-w+1?'y':i>=w-1?'o':'Y');}
    for(const dx of[-6,-1,4,7])m.set((hcx+dx)+','+(hy-9),'Y');
    if(rise>.6){const ey=hy-5,shut=dead&&dn>.2,pc=p2?'r':'w',pk=p2?'q':'k';for(const ex of[-5,2]){const sl=ex<0?1:-1;m.set((hcx+ex)+','+(ey-2+(ex<0?0:1)),'k');m.set((hcx+ex+1)+','+(ey-2),'k');m.set((hcx+ex+2)+','+(ey-2+(ex<0?1:0)),'k');if(shut){m.set((hcx+ex)+','+ey,'k');m.set((hcx+ex+1)+','+ey,'k');m.set((hcx+ex+2)+','+ey,'k');continue;}for(let i=0;i<3;i++){m.set((hcx+ex+i)+','+ey,pc);m.set((hcx+ex+i)+','+(ey+1),pc);}m.set((hcx+ex+1+(look>0?1:0))+','+ey,pk);m.set((hcx+ex+1+(look>0?1:0))+','+(ey+1),pk);}
     const my=hy-1,mo=hp?4:p2?3:2;for(let i=-6;i<=6;i++){const cur=Math.abs(i)>4?1:0;for(let j=0;j<mo;j++)m.set((hcx+i)+','+(my-j+cur),j===0||j===mo-1?'k':'R');if(i%2===0)m.set((hcx+i)+','+(my-mo+1+cur),'w');else m.set((hcx+i)+','+(my+cur),'w');}for(const dx of[-4,3]){const dl=1+(fst(t+dx,3)%3);for(let d=1;d<=dl;d++)m.set((hcx+dx)+','+(my+1+d),'o');}}
    /* arms: one braced on the rim, one reaching for your fruit (it flings the glob) */
    const ay=-(top+Math.round(hk*.55)),acx=Math.round(Math.sin(sway+.55*3)*.55*2.5);for(const sd of[-1,1]){const reach=sd===look||(!look&&sd>0);for(let k=0;k<=12;k++){const v=k/12,ex=reach?(hp?14:11):9,ey=reach?(hp?-6:-2):6,px=acx+sd*Math.round(4+v*ex+(reach?Math.sin(t*2+v*3)*v:0)),py=ay+Math.round(v*ey*(reach?1:1)+(reach?-Math.sin(v*Math.PI)*4:Math.sin(v*Math.PI)*-2));fxMD(m,px,py,k>10?1.2:1.7,(i,j)=>i*sd>0?'o':'Y');if(k===12)for(let f=-1;f<=1;f++){m.set((px+sd*2)+','+(py+f),'Y');m.set((px+sd*3)+','+(py+f),'o');}}if(!reach)for(let d=1;d<=2+(fst(t,3)%2);d++)m.set((acx+sd*13)+','+(ay+6+d),'o');}}
   const u=Math.min(1,s.age/1.2)*(dead&&dn>1.2?Math.max(0,1-(dn-1.2)/1.4):1);fxBlob(c,x,rim,Q,fxFade(m,u));c.restore();},
  top(c,g,s,t){const l=s.l;if(!l.st||!(s.ct>0)||s.dnt!=null)return;const Q=g.P;c.save();c.globalAlpha=s.p;for(let k=0;k<4;k++){const a=Math.PI*(.2+k*.2),dx=Math.cos(a)*l.hr*.8,dy=Math.sin(a)*l.hr*.8,len=1+Math.min(3,Math.floor(s.ct*3+k)%4);fxR(c,l.hx+dx,l.hy+dy-Q,Q,'Y',2,1);for(let j=0;j<len;j++)fxR(c,l.hx+dx,l.hy+dy+j*Q,Q,j===len-1?'o':'Y');}fxR(c,l.hx-l.hr*.5,l.hy-l.hr*.7,Q,'y',2,1);fxR(c,l.hx-l.hr*.2,l.hy-l.hr*.9,Q,'Y',3,1);c.restore();}},
 /* The Swarm: a cloud of gnats buzzes over the jar and a few carry the fruit in your hand (only the smallest ones get through); each drop, some dive after it. Phase 2: the cloud doubles. Beaten: they scatter */
 B_swarm:{tick(s,g,dt){bossT(s,dt);const P=g.P,n=s.p2t!=null?44:26,cx=g.L+(g.R-g.L)*(.5+.32*Math.sin(s.age*.45)),cy=fxRim(g)-85*g.K+Math.sin(s.age*.8)*18*g.K,l=s.l;s.g=s.g||[];
   while(s.g.length<n)s.g.push({x:g.W+20+Math.random()*60,y:cy+(Math.random()-.5)*60,vx:-80,vy:0,ph:Math.random()*9,e:s.g.length<7,dv:0});
   const sc=s.dnt!=null;for(const q of s.g){if(q.dv>0)q.dv-=dt;let tx,ty;if(sc){const a=q.ph*2.3;tx=q.x+Math.cos(a)*200;ty=q.y+Math.sin(a)*200-40;}else if(q.dv>0){tx=q.dx;ty=q.dy;}else if(q.e&&l.can){const a=q.ph+s.age*3;tx=l.hx+Math.cos(a)*(l.hr+6*P);ty=l.hy-l.hr*.4+Math.sin(a)*l.hr*.7;}else{const a=q.ph+s.age*(1+(q.ph%1));tx=cx+Math.cos(a)*(22+q.ph*4)*g.K;ty=cy+Math.sin(a*1.3)*(14+q.ph*2)*g.K;}
    q.vx+=((tx-q.x)*(sc?1:6)-q.vx*2.4)*dt+(Math.random()-.5)*900*dt;q.vy+=((ty-q.y)*(sc?1:6)-q.vy*2.4)*dt+(Math.random()-.5)*900*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;}},
  front(c,g,s,t){if(!s.g)return;const P=fxBP(g);c.save();c.globalAlpha=s.p*(s.dnt!=null?Math.max(0,1-s.dnt/1.2):1);const dk=s.p2t!=null;for(const q of s.g){const x=fq(q.x,P),y=fq(q.y,P),w=fst(t+q.ph,16)%2,d=q.vx>0?1:0;fxR(c,x,y,P,'k',2,1);fxR(c,x+(d?P:0),y,P,dk&&(q.ph*7|0)%3===0?'r':'x');if(w){fxR(c,x,y-P,P,'u');fxR(c,x+P,y-P,P,'j');}else{fxR(c,x-P,y,P,'j');fxR(c,x+2*P,y,P,'j');}}
   if(!RMO&&s.dnt==null){const u=(t*.7)%1;if(u<.5){const q=s.g[Math.floor(t*.7)%s.g.length];if(q){c.globalAlpha*=1-u*2;T(c,'z',q.x+8,q.y-10-u*20,11+u*6,'#3b2346','center',FD);}}}c.restore();},
  ev(s,n,o,A,g){if(n!=='drop'||!s.g||s.dnt!=null)return;let k=0;for(const q of s.g){if(k>=8)break;if(q.e)continue;q.dv=.55;q.dx=o.x+(Math.random()-.5)*30;q.dy=g.top+40*g.K+Math.random()*30;k++;}}},
 /* The Rot (v1.89, the user's ask: a real leap across the jar, a swamp in the jar): a hulking fungus frog-ogre on the rim, mottled green with a pale belly, bruises and pustules, toadstools on its head, glowing eyes under a heavy brow and a fanged maw that breathes spores into the jar. The jar itself turns to murky swamp water with rubbish sunk in it (cans, a boot, a fish skeleton, a bottle, a tyre), scum on top, bubbles rising, mould creeping over the floor; every fruit that goes mouldy sprouts a mushroom. Every few seconds it crouches (thighs bunched, arms braced, eyes narrowed), leaps right over the jar to the other side of the rim (body stretched, arms thrown up, legs trailing, mouth open, slime dripping, its shadow sliding along the rim) and lands in a splat (arms slammed flat, legs splayed): the jar shakes (only the picture, no fruit moves), mud and spores fly. Phase 2: it swells, more toadstools, red eyes, it leaps and breathes more often and the water darkens. Beaten: it slumps and rots away */
 B_rot:{sx(g,sd){return fq(g.L+(g.R-g.L)*(sd?.8:.2),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);if(s.side==null){s.side=0;s.st='idle';s.tm=0;}if(s.pf>0)s.pf-=dt;const Q=fxBP(g),p2=s.p2t!=null;
   if(s.st!=='air'){s.cx=FXS.B_rot.sx(g,s.side);fxRX('B_rot',s.side?.8:.2,150,g);}else fxRX('B_rot',s.side?.2:.8,150,g);
   if(s.dnt!=null||RMO){s.st='idle';s.hy=0;}else if(s.age>1.8){s.tm+=dt;
    if(s.st==='idle'&&s.tm>(p2?3:4.6)){s.st='crouch';s.tm=0;}
    else if(s.st==='crouch'&&s.tm>.45){s.st='air';s.tm=0;s.x0=s.cx;s.x1=FXS.B_rot.sx(g,1-s.side);}
    else if(s.st==='air'){s.x1=FXS.B_rot.sx(g,1-s.side);const u=Math.min(1,s.tm/.95),e=u<.5?2*u*u:1-2*(1-u)*(1-u);s.cx=s.x0+(s.x1-s.x0)*e;s.hy=Math.round(Math.sin(u*Math.PI)*24);
     if(Math.random()<dt*14)A.add({k:'sq',x:s.cx+(Math.random()-.5)*16*Q,y:fxRim(g)-(s.hy+2)*Q,vy:40,g:600,T:.9,col:Math.random()<.5?'l':'g',fy:g.bot-3});
     if(u>=1){s.st='land';s.tm=0;s.side=1-s.side;s.hy=0;A.jsA=Math.max(5*g.K,4);A.jsT=.55;const x=s.cx,y=fxRim(g);A.burst(x,y-Q,['N','n','g','l'],22,{v:220,vy:-120,g:600,T:.8,w:110});for(let k=0;k<10;k++)A.add({k:'sq',x:x+(Math.random()-.5)*140,y:y+4,vx:(Math.random()-.5)*80,vy:30+Math.random()*60,g:420,T:1.1,col:['g','l','N'][k%3],s:k%3?1:2,fy:g.bot-3,bo:.2,ly:0});for(let k=0;k<8;k++){const a=k/8*Math.PI*2;A.add({k:'sq',x:x+Math.cos(a)*30,y:y-6,vx:Math.cos(a)*160,vy:-30,g:200,T:.5,col:'s',fa:.3});}}}
    else if(s.st==='land'&&s.tm>.4){s.st='idle';s.tm=0;}}
   s.nt=(s.nt==null?1.5:s.nt)-dt;if(s.nt<=0&&s.dnt==null&&!RMO&&s.st==='idle'){s.nt=p2?1.3:2.6;s.pf=.5;const x=s.cx,y=fxRim(g)-(p2?16:14)*Q,dir=s.side?-1:1;for(let k=0;k<12;k++)A.add({k:'sq',x:x+dir*6*Q,y,vx:dir*(Math.random()*.9+.2)*90,vy:-10+Math.random()*50,g:30,T:2.4+Math.random(),col:['G','V','g','l'][k%4],s:k%3?1:2,sw:6,sf:2,ph:k,fa:.5,dr:.5});}
   if(!RMO&&s.p>0&&Math.random()<dt*(p2?5:3))A.add({k:'fn',ly:0,x:g.L+Math.random()*(g.R-g.L),y:g.bot-6,vy:-22-Math.random()*20,T:(g.bot-fxRim(g))/30,sw:3,sf:2,ph:Math.random()*6,fa:.9,d:(c,q,g2)=>{const P=g2.P;if(q.y<fxRim(g2)+P){q.T=q.t;return;}fxR(c,q.x,q.y,P,'l');fxR(c,q.x+P,q.y-P,P,'g');}});},
  back(c,g,s,t){const P=g.P,u=fxArU(s),p2=s.p2t!=null,top=fxRim(g),hgt=g.bot-top;if(u>0){c.save();
   const B=7;for(let k=0;k<B;k++){c.globalAlpha=Math.ceil(u*3)/3*(.32+k*.05+(p2?.06:0));c.fillStyle=fxHx('#5f7c34','#24300f',k/(B-1));const y=top+Math.floor(hgt*k/B);c.fillRect(g.L,y,g.R-g.L,Math.ceil(hgt/B)+1);}
   c.globalAlpha=u*.8;const TR=[[.14,.5,'can'],[.44,.3,'boot'],[.72,.58,'fish'],[.86,.28,'tyre'],[.3,.72,'bottle'],[.58,.48,'bone'],[.12,.2,'core'],[.8,.78,'can']],SP={can:[[0,0,'s'],[1,0,'d'],[2,0,'d'],[0,1,'r'],[1,1,'r'],[2,1,'R'],[0,2,'s'],[1,2,'d'],[2,2,'D'],[3,0,'D'],[3,1,'D'],[3,2,'D']],boot:[[0,-3,'n'],[1,-3,'N'],[0,-2,'n'],[1,-2,'N'],[0,-1,'n'],[1,-1,'N'],[0,0,'n'],[1,0,'n'],[2,0,'n'],[3,0,'N'],[0,1,'k'],[1,1,'k'],[2,1,'k'],[3,1,'k'],[0,-4,'E'],[1,-4,'E']],fish:[[0,0,'w'],[0,-1,'w'],[1,0,'s'],[2,0,'w'],[3,0,'w'],[4,0,'w'],[5,0,'w'],[2,-1,'s'],[3,-1,'s'],[4,-1,'s'],[2,1,'s'],[3,1,'s'],[4,1,'s'],[6,-1,'w'],[6,1,'w'],[-1,0,'k']],tyre:[[-2,0,'D'],[-1,-1,'D'],[0,-1,'k'],[1,-1,'D'],[2,0,'D'],[1,1,'D'],[0,1,'k'],[-1,1,'D'],[-2,-1,'k'],[2,-1,'k'],[-2,1,'k'],[2,1,'k']],bottle:[[0,0,'G'],[1,0,'G'],[2,0,'g'],[3,0,'G'],[4,0,'G'],[0,1,'G'],[1,1,'c'],[2,1,'c'],[3,1,'G'],[4,1,'G'],[5,0,'G'],[6,0,'N']],bone:[[0,0,'w'],[1,0,'w'],[2,0,'w'],[3,0,'w'],[-1,-1,'w'],[-1,1,'w'],[4,-1,'w'],[4,1,'w']],core:[[0,-1,'r'],[0,0,'c'],[0,1,'c'],[0,2,'r'],[-1,0,'E'],[1,1,'E'],[0,-2,'N']]};
   const TQ=fxBP(g);for(let x=g.L+2*P,i=0;x<g.R-2*P;x+=5*P,i++){const h=4+Math.floor(fhs(i,7)*8),sw=Math.round(Math.sin(t*1.2+i)*1);for(let j=0;j<h;j++)fxR(c,x+(j>h/2?sw*P:0),g.bot-(j+1)*P,P,j===h-1?'l':j%3===2?'g':'G');}
   for(const[fx,fy,k]of TR){const bob=Math.round(Math.sin(t*.7+fx*9)*1.4),m=new Map();for(const[i,j,col]of SP[k])m.set(i+','+(j+bob),col);fxBlob(c,fq(g.L+(g.R-g.L)*fx,TQ),fq(top+hgt*fy,TQ),TQ,m);}
   c.globalAlpha=u*.9;for(let x=g.L,i=0;x<g.R;x+=P,i++){const w=Math.round(Math.sin(i*.4+t*1.5)*.6);if(fhs(i,3)>.35)fxR(c,x,top+(1+w)*P,P,fhs(i,4)>.6?'l':'g');if(fhs(i,5)>.85)fxR(c,x,top+(2+w)*P,P,'G');}
   for(let k=0;k<14;k++){const x=g.L+((fhs(k,1)*(g.R-g.L)+t*6*(k%2?1:-1))%(g.R-g.L)+(g.R-g.L))%(g.R-g.L),y=top+hgt*(.2+fhs(k,2)*.75)+Math.sin(t+k)*4;fxR(c,x,y,P,'N');}
   c.restore();}
   const gr=Math.min(1,s.age/7)*(p2?1.7:1)*(s.dnt!=null?Math.max(0,1-s.dnt/1.6):1);if(gr<=0)return;c.save();c.globalAlpha=s.p;for(let x=g.L,i=0;x<g.R;x+=P,i++){const h=Math.round(gr*(2.4+1.6*Math.sin(i*.31)+1.2*Math.sin(i*.83+1)+fhs(i,4)));for(let j=0;j<h;j++){const y=g.bot-(j+1)*P,tp=j===h-1;if(tp&&FBY[(i&3)*4+(j&3)]>9)continue;fxR(c,x,y,P,tp?(fhs(i,j)>.5?'l':'s'):j>h-3?'u':'U');}if(fhs(i,7)>.85&&h>2)fxR(c,x,g.bot-2*P,P,'g');}c.restore();},
  front(c,g,s,t){const Q=fxBP(g),dead=s.dnt!=null,dn=dead?s.dnt:0,p2=s.p2t!=null,st=s.st||'idle',x=fq(s.cx!=null?s.cx:FXS.B_rot.sx(g,0),Q),rim=fq(fxRim(g),Q)+fxDrop(s,Q)-(s.hy||0)*Q;c.save();c.globalAlpha=s.p;
   for(const f of s.l.m||[]){const P=g.P,ty=f.y-f.r*.8;if(f.m>=1){const M=fxPt(c,fq(f.x,P),fq(ty,P),P);M(-1,-1,'k',3,2);M(0,-1,'c',1,2);M(-2,-3,'k',5,2);M(-3,-2,'k',7,1);M(-1,-4,'k',3,1);M(-2,-2,'V',5,1);M(-1,-3,'P',3,1);M(-1,-2,'l');M(1,-3,'w');}else for(let k=0;k<Math.ceil(f.m*4);k++)fxR(c,f.x+(k-1.5)*P*1.6,ty-((k*7)%3)*P,P,k%2?'l':'g');}
   if(dead&&dn>2.6){c.restore();return;}
   if(st==='air'){const sw=Math.max(4,Math.round(14-(s.hy||0)*.35)),ry=fq(fxRim(g),Q);c.globalAlpha=s.p*.45;for(let i=-sw;i<=sw;i++)if(FBY[((i+40)&3)*4]<10)fxR(c,x+i*Q,ry-Q,Q,'k');c.globalAlpha=s.p;}
   const PO={idle:{H:27,W:13,arm:'hang',leg:'fold',mo:3},crouch:{H:22,W:14,arm:'brace',leg:'crouch',mo:2,sq:1},air:{H:30,W:11,arm:'up',leg:'trail',mo:5},land:{H:20,W:16,arm:'slam',leg:'splay',mo:4}}[dead?'idle':st],H=PO.H+(p2?2:0),W0=PO.W+(p2?1:0),br=st==='idle'&&!RMO?fst(t,1.4)%2:0,shr=dead?Math.min(.75,dn/1.4):0,m=new Map(),Y=j=>-Math.round(j*(1-shr)),set=(i,j,col)=>m.set(i+','+(Y(j)-(j>H-12?br:0)),col),disc=(cx,cy,r,f)=>{const ri=Math.ceil(r);for(let j=-ri;j<=ri;j++)for(let i=-ri;i<=ri;i++)if(i*i+j*j<=r*r+.3)set(Math.round(cx)+i,Math.round(cy)+j,f(i,j));},look=st==='air'?(s.side?-1:1):(s.side?-1:1);
   /* legs (frog legs: thighs, shins, webbed feet) */
   for(const sd of[-1,1]){const shade=(i)=>i*sd>0?'x':'G';if(PO.leg==='fold'||PO.leg==='crouch'){const big=PO.leg==='crouch',tx=sd*(W0-2),ty=big?5:3,tr=big?5:3.5;disc(tx,ty,tr,(i,j)=>j>1?'x':i*sd>1?'x':i*sd<-1?'g':'G');for(let k=0;k<=5;k++)set(sd*(W0-1+k),0,k>3?'g':'G');for(const d of[0,2,4])set(sd*(W0+5)+sd*(d>>1),-1+(d>>1)*0,'g');set(sd*(W0+5),1,'g');set(sd*(W0+6),1,'g');}
    else if(PO.leg==='trail'){for(let k=0;k<=9;k++){const v=k/9;disc(sd*(W0-4+v*3),-v*9,2.6-v*1.1,(i)=>shade(i));}for(let d=-1;d<=1;d++){set(sd*(W0-1)+d*sd,-10,'g');set(sd*(W0-1)+d*sd*2,-11,'g');}}
    else{for(let k=0;k<=9;k++){const v=k/9;disc(sd*(W0-2+v*9),2-v,2.4-v*.9,(i,j)=>j>0?'x':'G');}for(let d=0;d<3;d++)set(sd*(W0+8+d),0,'g');}}
   /* the body, lit top left, a pale belly, bruises and pustules */
   const HW=j=>j<=4?W0-3+j*.6:j<=H*.4?W0:W0*Math.sqrt(Math.max(0,1-Math.pow((j-H*.4)/(H*.6+1),2)));
   for(let j=0;j<=H;j++){const hw=Math.round(HW(j));for(let i=-hw;i<=hw;i++){let col=i>hw-3||j<2?'x':i<-hw+3&&j>3?'g':'G';if(i<-hw+2&&j>H-8)col='l';const be=(i*i)/Math.pow(W0*.55,2)+Math.pow((j-H*.32)/(H*.28),2);if(be<=1)col=be<.5&&FBY[((i+40)&3)*4+((j+40)&3)]<8?'l':'g';set(i,j,col);}}
   for(const[bi,bj,r]of[[-W0+5,H*.25,2],[W0-6,H*.38,2.5],[W0-3,H*.12,1.5],[-W0+3,H*.45,1.5]])disc(bi,Math.round(bj),r,(i,j)=>i*i+j*j<=1?'P':'V');
   for(const[pi,pj]of[[-4,H*.33],[3,H*.2],[W0-4,H*.3],[-W0+3,H*.15]]){set(pi,Math.round(pj),'l');set(pi+1,Math.round(pj),'l');set(pi,Math.round(pj)+1,'w');}
   /* arms, from the shoulders: hanging, braced, thrown up or slammed flat, claws at the end */
   const sj=Math.round(H*.62);for(const sd of[-1,1]){const A0={hang:[W0+5,sj-6,W0+3,1],brace:[W0+8,sj-2,W0+6,1],up:[W0+5,sj+3,W0+7,H+3],slam:[W0+6,sj-3,W0+9,1]}[PO.arm],[cxp,cyp,ex,ey]=A0;for(let k=0;k<=14;k++){const v=k/14,px=(1-v)*(1-v)*sd*W0+2*v*(1-v)*sd*cxp+v*v*sd*ex,py=(1-v)*(1-v)*sj+2*v*(1-v)*cyp+v*v*ey;disc(px,py,2.5-v*.9,(i)=>i*sd>0?'x':i*sd<0?'g':'G');}
    const up=PO.arm==='up';for(let f=-1;f<=1;f++)for(let d=1;d<=3;d++){const fx=sd*(ex+(up?f*2:0)+(PO.arm==='slam'?sd*f:0)),fy=up?ey+d:(PO.arm==='hang'||PO.arm==='brace'?-d:-d+(f+1)*0);m.set((fx+(up?0:sd*f*2)+(d===3&&!up?sd:0))+','+(Y(fy)-(up?d>2?0:0:0)),d===3?'s':'c');}}
   /* the face */
   const fy=H-8,ec=p2?['q','r']:['y','l'],blink=st==='idle'&&!dead&&(t%3.7)<.12,sqz=PO.sq;for(let i=0;i<=5;i++){set(-8+i,fy+3-Math.round(i*.4)-(sqz?1:0),'x');set(-8+i,fy+2-Math.round(i*.4)-(sqz?1:0),'k');set(7-i,fy+3-Math.round(i*.4)-(sqz?1:0),'x');set(7-i,fy+2-Math.round(i*.4)-(sqz?1:0),'k');}
   for(const ex of[-7,2]){for(let i=0;i<5;i++)for(let j=-1;j<=(sqz?0:1);j++)set(ex+i,fy+j,'k');if(!blink&&!(dead&&dn>.3)){const lp=look>0?1:0;set(ex+1+lp,fy,ec[0]);set(ex+2+lp,fy,ec[0]);if(!sqz){set(ex+1+lp,fy+1,ec[1]);set(ex+2+lp,fy+1,ec[1]);}set(ex+(ex<0?3:1),fy,'w');}}
   const my=H-15,mo=(s.pf>0?2:0)+PO.mo;for(let i=-8;i<=7;i++){for(let j=0;j<mo;j++)set(i,my-j,j===0||j===mo-1?'k':'R');if((i+40)%2===0)set(i,my,'c');else set(i,my-1,'c');if((i+41)%2===0)set(i,my-mo+1,'c');else if(mo>3)set(i,my-mo+2,'c');}if(st==='air')for(let i=-2;i<=1;i++)set(i,my-mo+2,'p');
   for(const fx of[-7,6]){set(fx,my+1,'c');set(fx,my+2,'w');}for(const[dx,ph]of[[-6,0],[0,1.3],[5,.6]]){const len=1+(fst(t+ph,3)%3)+(st==='air'?2:0);for(let d=1;d<=len;d++)m.set(dx+','+(Y(my-mo+1)+d),'l');}
   /* toadstools */
   const CAPS=[[-8,H-4,4,'r'],[6,H-2,5,'V'],[-1,H+1,3,'r'],[W0-2,H-9,3,'r']].concat(p2?[[-W0+1,H-10,3,'V'],[2,H+4,3,'P']]:[]),wob=st==='air'?1:st==='land'?-1:0;CAPS.forEach(([ci,cj,r,cc],k)=>{for(let d=0;d<=2;d++){set(ci,cj+d,'c');set(ci+1,cj+d,'s');}const tp=cj+3+(k%2?wob:0);for(let j=0;j<=r;j++){const w=Math.round(Math.sqrt(Math.max(0,r*r+r-j*j)))+1;for(let i=-w;i<=w;i++){const spt=((i*3+j*5+k)%7===0)&&j>0&&j<r;set(ci+i,tp+j,j===0?'s':spt?'w':j===r||i===-w?cc==='r'?'R':'x':cc);}}});
   const u=Math.min(1,s.age/1.4)*(dead&&dn>1.2?Math.max(0,1-(dn-1.2)/1.4):1);fxBlob(c,x,rim,Q,fxFade(m,u));
   if(!dead&&s.age>1.2){const gy=rim-(fy-br)*Q,gc=p2?'r':'l';c.globalAlpha=s.p*.4;for(const ex of[-7,2])for(let j=-2;j<=2;j++)for(let i=-1;i<=5;i++){if((i>=0&&i<5&&j>=-1&&j<=1)||FBY[((i+8)&3)*4+((j+8)&3)]/16>.5)continue;fxR(c,x+(ex+i)*Q,gy-j*Q,Q,gc);}c.globalAlpha=s.p;}
   if(!dead&&!RMO&&st!=='air')for(let k=0;k<3;k++){const a=t*(2.2+k*.4)+k*2.1,fx=x+Math.cos(a)*(12+k*3)*Q,fy2=rim-(H+5+Math.sin(a*1.7)*3)*Q;fxR(c,fx,fy2,Q,'k');fxR(c,fx+(fst(t,16)%2?Q:-Q),fy2-Q,Q,'i');}
   c.restore();},
  ev(s,n,o,A,g){if(n!=='mould'||!s.l.p)return;A.burst(o.x,o.y-(o.r||20)*.6,['l','g','P'],10,{v:70,vy:-40,g:40,T:.9});}},
 /* The Tide (v1.87, reworked v1.89, the user's ask): a sea serpent lives in the waves; the jar itself turns to rough sea water (deep blue, darker going down, wave streaks sliding along, foam under the surface). Its body is one continuous wave of humps that rise out of the water and dip back under it, seen dimmed through the water in the jar, and its neck climbs out of the deep to a horned head that rears on the right, jaws working, eye on the jar, rising and falling with the line it drags up and down. The moon hangs behind it. Phase 2: a blood moon, tighter humps, red eyes, a glowing crest and taller waves. Beaten: the moon flashes white and bursts into smoke and shards, the serpent sinks with a splash and the water calms */
 B_tide:{tick(s,g,dt,A){bossT(s,dt);if(s.dnt!=null&&!s.mex&&s.dnt>.35&&s.mxy){s.mex=1;const[mx,my]=s.mxy,Q=fxBP(g);for(let k=0;k<14;k++){const a=k/14*Math.PI*2,v=40+Math.random()*60;A.add({k:'fn',x:mx+Math.cos(a)*8,y:my+Math.sin(a)*8,vx:Math.cos(a)*v,vy:Math.sin(a)*v-10,dr:1.2,T:1.8+Math.random()*.8,fa:.35,ph:k,d:(c,q,g2)=>{const P=fxBP(g2),uq=q.t/q.T,r=1+Math.floor(uq*3.5);for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++)if(i*i+j*j<=r*r&&FBY[((i+8)&3)*4+((j+8)&3)]/16<.85-uq*.7)fxR(c,q.x+i*P,q.y+j*P,P,uq<.15?'w':j<0?'s':'d');}});}for(let k=0;k<10;k++){const a=Math.random()*Math.PI*2,v=120+Math.random()*120;A.add({k:'sq',x:mx,y:my,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:300,T:.9,col:s.p2t!=null?(k%2?'r':'q'):(k%2?'i':'w'),s:2});}A.add({k:'fn',x:mx,y:my,T:.4,fa:.2,d:(c,q,g2)=>{const P=fxBP(g2),R2=Math.round(6+q.t*40);for(let a=0;a<6.28;a+=.25)fxR(c,q.x+Math.round(Math.cos(a)*R2)*P,q.y+Math.round(Math.sin(a)*R2)*P,P,'w');}});}
   if(s.dnt!=null&&!s.spl&&s.dnt>.5){s.spl=1;const x=g.L+(g.R-g.L)*.8;A.burst(x,g.top-3*g.P,['b','i','w'],18,{v:220,vy:-160,g:500,T:.9,s:2});}},
  /* the serpent, built once a frame on a grid 1.3 times the boss grid: coils (whole loops) and the neck are chains of discs from fxMD, the head is built cell by cell; am = the cells above the water (front), bm = below it (back, seen through the rough water in the jar) */
  build(s,g,t){if(s.bf===t&&s.bv)return s.bv;const P=g.P,u=s.l.u||0,dead=s.dnt!=null,dn=dead?Math.min(1,s.dnt/1.4):0,p2=s.p2t!=null;
   const SQ=Math.round(fxBP(g)*1.3),x0=fq(g.L,SQ),y0=fq(g.top-2*P,SQ),Wc=Math.round((g.R-g.L)/SQ),m=new Map(),sink=Math.round(dn*30),bob=Math.round((u-.5)*4),body=(i,j)=>(((i*2+j*3+Math.floor(t*3))%7+7)%7===0)?'G':(((i+j*2)%11+11)%11===0?'B':'t');
   const coil=(cf,R,ph)=>{const cx=cf*Wc,h=1+u*.35;for(let a=0;a<Math.PI*2;a+=.12){const px=cx+Math.cos(a+Math.PI)*R,py=-Math.sin(a)*R*(a<=Math.PI?h:1)+sink-bob;fxMD(m,px,py,2.3,(i,j,ai,aj)=>(j>.5?'h':body(ai,aj)));if(Math.round(a/.12)%3===1&&py<-2){const nx=Math.round(px-Math.cos(a+Math.PI)*0),ny=Math.round(py-3.2);if(ny<0){m.set(nx+','+ny,p2&&fst(t,4)%2?'m':'P');m.set(nx+','+(ny-1),'V');}}}};
   const BX0=.06*Wc,BX1=.7*Wc,LAM=p2?11:14,AMP=(p2?9:8)*(1+u*.2);let last=[BX1,0];for(let xx=BX0;xx<=BX1;xx+=.35){const v=(xx-BX0)/(BX1-BX0),ph=(xx-BX0)/LAM*Math.PI*2-t*.9,py=-Math.sin(ph)*AMP+sink-bob,r=1.3+Math.min(1,v*2.2)*1.3;fxMD(m,xx,py,r,(i,j,ai,aj)=>j>r*.35?'h':body(ai,aj));if(Math.round(xx/.35)%5===0&&py<-2&&v>.1){const sx=Math.round(xx),sy=Math.round(py-r-.6);m.set(sx+','+sy,p2&&fst(t,4)%2?'m':'P');m.set(sx+','+(sy-1),'V');}last=[xx,py];}
   const nb=[last[0],last[1]],nt=[.8*Wc,-23-Math.round(u*3)],nc=[.6*Wc,-13],hs=RMO?0:Math.round(Math.sin(t*.9)*1.5);for(let k=0;k<=24;k++){const v=k/24,px=(1-v)*(1-v)*nb[0]+2*v*(1-v)*nc[0]+v*v*nt[0]+hs*v,py=(1-v)*(1-v)*nb[1]+2*v*(1-v)*nc[1]+v*v*nt[1]+sink-bob;fxMD(m,px,py,3.2-v*.6,(i,j,ai,aj)=>(i>.8?'h':body(ai,aj)));if(k%3===0&&k>2){const sx=Math.round(px-2.6),sy=Math.round(py-1.5);if(sy<0){m.set(sx+','+sy,'P');m.set((sx-1)+','+(sy-1),'V');}}}
   const hx=Math.round(nt[0]+hs),hy=Math.round(nt[1]+sink-bob-2),op=dead?3:Math.round(1+(.5+.5*Math.sin(t*1.3))*(p2?3:2));
   for(let j=-5;j<=4;j++)for(let i=-6;i<=6;i++)if((i*i)/40+(j*j)/22<=1&&hy+j<0)m.set((hx+i)+','+(hy+j),i+j<-4?'l':body(hx+i,hy+j));
   for(let j=-2;j<=1;j++)for(let i=-14;i<=-5;i++){const e=((i+9.5)*(i+9.5))/26+((j+.5)*(j+.5))/5;if(e<=1&&hy+j<0)m.set((hx+i)+','+(hy+j),j===1?'h':body(hx+i,hy+j));}
   for(let i=-13;i<=-4;i++)for(let j=2;j<=2+op;j++){const yy=hy+j;if(yy>=0)continue;m.set((hx+i)+','+yy,j===2||j===2+op?'k':'R');}for(let i=-13;i<=-5;i++){const yb=hy+3+op;if(yb<0)m.set((hx+i)+','+yb,'h');if(yb+1<0)m.set((hx+i)+','+(yb+1),'k');}
   for(let i=-13;i<=-5;i+=2){if(hy+2<0)m.set((hx+i)+','+(hy+2),'w');if(hy+2+op<0)m.set((hx+i+1)+','+(hy+2+op),'w');}
   m.set((hx-14)+','+(hy-1),'k');const ec=p2?['q','r']:['y','o'];if(!(dead&&dn>.3)){m.set((hx-3)+','+(hy-3),ec[0]);m.set((hx-2)+','+(hy-3),ec[1]);m.set((hx-3)+','+(hy-2),'k');m.set((hx-2)+','+(hy-2),ec[0]);}else{m.set((hx-3)+','+(hy-2),'k');m.set((hx-2)+','+(hy-2),'k');}m.set((hx-4)+','+(hy-4),'k');m.set((hx-3)+','+(hy-4),'k');
   for(const[i,j,col]of[[0,-6,'V'],[1,-7,'V'],[2,-8,'P'],[3,-7,'V'],[-2,-6,'P'],[-1,-7,'V'],[4,-6,'V'],[5,-5,'P'],[6,-4,'V']])if(hy+j<0)m.set((hx+i)+','+(hy+j),p2&&fst(t+i*.1,6)%2?'m':col);for(const[i0,j0,n]of[[-4,-6,6],[-1,-7,5]])for(let k=0;k<n;k++){const i=i0-Math.round(k*.6),j=j0-k;if(hy+j<0){m.set((hx+i)+','+(hy+j),k>n-3?'w':'c');m.set((hx+i+1)+','+(hy+j),k>n-3?'c':'s');}}if(!(dead&&dn>.3)){m.set((hx-4)+','+(hy-3),'k');m.set((hx-1)+','+(hy-3),ec[1]);}
   for(const[i,j]of[[6,0],[7,1],[6,2],[7,-1]])if(hy+j<0)m.set((hx+i)+','+(hy+j),'m');
   const am=new Map(),bm=new Map();for(const[k,v]of m){const aj=+k.split(',')[1];(aj>0?bm:am).set(k,v);}s.bf=t;return s.bv={am,bm,x0,y0,SQ};},
  /* the jar turns to rough sea water: deep blue going darker down, wave streaks sliding along, foam under the surface; the serpent's coils and neck carry on under it, dimmed */
  back(c,g,s,t){const u=fxArU(s);if(u<=0)return;const top=fxRim(g),hgt=g.bot-top,P=g.P,p2=s.p2t!=null;c.save();const B=7;for(let k=0;k<B;k++){c.globalAlpha=Math.ceil(u*3)/3*(.34+k*.05+(p2?.06:0));c.fillStyle=fxHx('#2f78b0','#0e2246',k/(B-1));c.fillRect(g.L,top+Math.floor(hgt*k/B),g.R-g.L,Math.ceil(hgt/B)+1);}
   const SV=FXS.B_tide.build(s,g,t),DM={t:'B',G:'x',h:'b',B:'x',P:'V',V:'x',l:'b',w:'b',R:'x',y:'b',o:'B',q:'R',r:'R',c:'b',s:'b',m:'V',k:'k'},dm=new Map();for(const[k,v]of SV.bm)dm.set(k,DM[v]||'B');const uu=Math.min(1,s.age/1.4)*(s.dnt!=null&&s.dnt>1.4?Math.max(0,1-(s.dnt-1.4)/.8):1);c.globalAlpha=u*.8;fxBlob(c,SV.x0,SV.y0,SV.SQ,fxFade(dm,uu));
   c.globalAlpha=u*.3;c.fillStyle='#0e2246';c.fillRect(g.L,top,g.R-g.L,hgt);c.globalAlpha=u*.85;
   for(let k=0;k<22;k++){const yy=top+hgt*fhs(k,2)*.95,len=(4+Math.floor(fhs(k,3)*6))*P,sp=(p2?60:36)*(k%2?1:-1)*(.6+fhs(k,4)),xx=g.L+((fhs(k,1)*(g.R-g.L)+t*sp)%(g.R-g.L)+(g.R-g.L))%(g.R-g.L);c.fillStyle=k%3?'#4cc9f0':'#a8cfe8';c.fillRect(fq(xx,P),fq(yy+Math.sin(t*2+k)*3,P),len,P);}
   for(let x=g.L,i=0;x<g.R;x+=P,i++){const f=Math.sin(i*.5+t*3)+Math.sin(i*.17-t*2);if(f>.6)fxR(c,x,top+P*(1+(f>1.2?1:0)),P,'w');else if(f>.1)fxR(c,x,top+P,P,'i');}c.restore();},
  front(c,g,s,t){const P=g.P,Q=fxBP(g),u=s.l.u||0,dead=s.dnt!=null,dn=dead?Math.min(1,s.dnt/1.4):0,p2=s.p2t!=null,amp=(p2?2.4:1.4)*(1-dn)*Math.min(1,s.age/1.2),wv=fst(t,8);c.save();c.globalAlpha=s.p;
   const mx=fq(g.L+(g.R-g.L)*.14,Q),my=fq(fxRim(g)-(96+u*20)*g.K,Q),r=6+(dead&&s.dnt>.15&&s.dnt<.35?1:0),M=fxPt(c,mx,my,Q),mgo=dead&&s.dnt>.35;s.mxy=[mx,my];c.globalAlpha=mgo?0:s.p;
   for(let j=-r-3;j<=r+3;j++)for(let i=-r-3;i<=r+3;i++){const d=i*i+j*j;if(d>(r+3)*(r+3)||d<=(r+1)*(r+1))continue;if(FBY[((i+40)&3)*4+((j+40)&3)]<(d<(r+2)*(r+2)?7:3))M(i,j,p2?'q':'h');}
   if(!mgo)fxEl(c,mx,my,Q,r,r,(i,j,e)=>e?'k':dead&&s.dnt>.15?'w':p2?(fhs(i,j)>.82?'R':i+j<-4?'q':'r'):(fhs(i,j)>.82?'j':i+j<-4?'w':'i'));c.globalAlpha=s.p;
   const SV=FXS.B_tide.build(s,g,t),m=SV.am,x0=SV.x0,y0=SV.y0,SQ=SV.SQ;
   const uu=Math.min(1,s.age/1.4)*(dead&&s.dnt>1.4?Math.max(0,1-(s.dnt-1.4)/.8):1);fxBlob(c,x0,y0,SQ,fxFade(m,uu));
   for(let x=g.L,i=0;x<g.R;x+=P,i++){const v=Math.sin(i*.33-wv*.7)+.5*Math.sin(i*.12+wv*.3),h=1+Math.max(0,Math.round(amp*(.8+.7*v)));for(let j=0;j<h;j++){c.globalAlpha=s.p*(j===h-1?.95:.85);fxR(c,x,g.top-(j+2)*P,P,j===h-1?(v>.9?'w':'b'):j===0?'B':'b');}}c.globalAlpha=s.p;
   const by=fq(g.top-2*P-Math.round(amp*(1+Math.sin(5*.33-wv*.7)))*P,P),bx=fq(g.L+7*P,P),Bb=fxPt(c,bx,by,P);Bb(-2,-1,'k',5,2);Bb(-1,-1,'B',3,1);Bb(-2,-6,'k',5,5);Bb(-1,-6,'r',3,2);Bb(-1,-4,'w',3,1);Bb(-1,-3,'r',3,1);Bb(-1,-8,'k',3,2);Bb(0,-8,fst(t,1.5)%2?'y':'D');
   c.restore();}},
 /* The Blackout: a bare bulb hangs in the sky on its cord. In the dark, eyes open between the fruit and follow your hand; when the light flicks on they snap shut. Phase 2: the bulb cracks and stutters. Beaten: it shines steady and moths come to it */
 B_dark:{tick(s,g,dt){bossT(s,dt);const dk=s.l.dk==null?1:s.l.dk;if(dk<.3&&!s.drk){s.drk=1;s.ey=[];const n=s.p2t!=null?8:5,y0=Math.max(g.top+20,s.l.pt||g.top);for(let k=0;k<n;k++)s.ey.push({x:g.L+(.12+.76*Math.random())*(g.R-g.L),y:y0+(.1+.8*Math.random())*(g.bot-y0),ph:Math.random()*5,d:.2+Math.random()*1.2});}if(dk>.5)s.drk=0;},
  front(c,g,s,t){const BP=fxBP(g),x=fq(g.L+(g.R-g.L)*.62,BP),y0=fxRim(g)-150*g.K,yb=fq(fxRim(g)-62*g.K,BP),dk=s.l.dk==null?1:s.l.dk,p2=s.p2t!=null,dead=s.dnt!=null,fl=p2&&!dead&&dk>.5&&fst(t,14)%5===0;let lit=dead||(dk>.5&&!fl);c.save();c.globalAlpha=s.p*Math.min(1,s.age/.6);
   for(let y=fq(y0,BP);y<yb-6*BP;y+=BP)fxR(c,x,y,BP,'k');fxR(c,x+2*BP,yb-12*BP,BP,'d',1,4);fxR(c,x+2*BP,yb-8*BP,BP,'k');
   const B=fxPt(c,x,yb,BP);B(-2,-7,'k',5,1);B(-2,-6,'d',5,2);B(-2,-5,'D',5,1);B(-3,-4,'k',7,1);
   fxEl(c,x,yb,BP,3,3,(i,j,e)=>e?'k':lit?(i<0&&j<0?'w':i+j>2?'Y':'y'):(i<0&&j<0?'s':'D'));if(p2){B(1,-2,'k');B(0,-1,'k');B(1,0,'k');}if(lit)B(0,1,'y');
   if(lit){c.globalAlpha=s.p*.85;const r0=6;for(let k=0;k<8;k++){const a=k*Math.PI/4,L2=fst(t,4)%2?3:2;for(let q=0;q<L2;q++){const px=Math.round(Math.cos(a)*(r0+q)),py=Math.round(Math.sin(a)*(r0+q));B(px,py,q?'y':'o');}}}
   if(dead){c.globalAlpha=s.p;for(let k=0;k<2;k++){const a=t*(3+k)+k*3,mx=x+Math.cos(a)*(9+k*3)*BP,my=yb+Math.sin(a*1.3)*6*BP,w=fst(t+k,12)%2;fxR(c,mx,my,BP,'N');fxR(c,mx-BP,my-(w?BP:0),BP,'d');fxR(c,mx+BP,my-(w?BP:0),BP,'d');}}c.restore();},
  top(c,g,s,t){const dk=s.l.dk==null?1:s.l.dk;if(!s.ey||dk>.45||s.dnt!=null)return;const P=g.P,hx=s.l.hx!=null?s.l.hx:g.W/2;c.save();c.globalAlpha=s.p*Math.max(0,1-dk*2.2);
   const Q=fxBP(g);for(const e of s.ey){if(s.age<e.d)continue;const bl=((t+e.ph)%3.1)<.14,lk=hx<e.x-20?-1:hx>e.x+20?1:0,red=s.p2t!=null&&e.ph>3.5;for(const k of[-1,1]){const ex=fq(e.x+k*2*Q,Q),ey=fq(e.y,Q);if(bl){fxR(c,ex-Q,ey,Q,red?'r':'Y',2,1);continue;}fxR(c,ex-Q,ey-Q,Q,red?'q':'y',2,2);fxR(c,ex-Q,ey-Q,Q,red?'h':'h');fxR(c,ex+(lk>0?0:lk<0?-Q:(k<0?0:-Q)),ey,Q,'k');}}c.restore();}},
 /* The Collector: a glass display case on the rim holds the shape of the fruit it wants, and a magnifying glass drifts over your biggest fruit, checking. Made it: the fruit appears in the case with a rosette. Phase 2 (not made yet): the label flips to a bigger fruit. Beaten: a gold star on the case */
 B_collect:{x(g){return fq(fxRX('B_collect',.26,56,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const l=s.l;if(s.l0==null)s.l0=l.l;if(l.l!==s.l0){s.fl=.5;s.l0=l.l;}if(s.fl>0)s.fl-=dt;if(l.got&&!s.gt){s.gt=1;s.gtt=0;const P=fxBP(g),x=FXS.B_collect.x(g),y=fxRim(g)-10*P;for(let k=0;k<10;k++)A.add({k:'star',x:x+(Math.random()-.5)*20*P,y:y+(Math.random()-.5)*14*P,T:.6,dl:k*.05,col:k%2?'y':'b'});}if(s.gt)s.gtt+=dt;
   const b=l.big;if(b){s.mx=s.mx==null?b.x:s.mx+(b.x-s.mx)*Math.min(1,dt*2.2);s.my=s.my==null?b.y:s.my+(b.y-s.my)*Math.min(1,dt*2.2);s.mr=b.r;s.ml=b.l;}},
  front(c,g,s,t){const P=fxBP(g),x=FXS.B_collect.x(g),rim=fxRim(g),l=s.l,R=fxPt(c,x,rim+fxDrop(s,P),P),y0=rim+fxDrop(s,P);c.save();c.globalAlpha=s.p;
   if(s.mx!=null&&s.dnt==null){const Q=g.P,a=t*1.3,cx=fq(s.mx+Math.cos(a)*s.mr*.35,Q),cy=fq(s.my+Math.sin(a)*s.mr*.25,Q),rr2=Math.max(6,Math.round((s.mr||20)/Q*.55));
    c.globalAlpha=s.p*.28;fxEl(c,cx,cy,Q,rr2,rr2,(i,j,e)=>e?0:(i+j)<-rr2?'w':'i');c.globalAlpha=s.p;fxEl(c,cx,cy,Q,rr2,rr2,(i,j,e)=>{if(!e)return 0;return(i*i+j*j)>(rr2-.5)*(rr2-.5)?'k':0;});
    for(let k=0;k<5;k++){fxR(c,cx+(rr2+k)*Q*.71,cy+(rr2+k)*Q*.71,Q,'k',2,2);fxR(c,cx+(rr2+k)*Q*.71+Q*.5,cy+(rr2+k)*Q*.71,Q,'N');}
    const ok=s.ml!=null&&s.ml>=l.l;if((t%2.4)<.9){const q=Math.min(1,(t%2.4)/.15);T(c,l.got?'!':ok?'!':'?',cx,cy-rr2*Q-10-q*4,16,l.got||ok?'#38b000':'#3b2346','center',FD);}}
   const sq=s.fl>0?Math.abs(Math.cos((1-s.fl/.5)*Math.PI)):1;
   R(-7,-2,'k',15,2);R(-6,-2,'n',13,1);R(-7,-17,'k',15,15);c.globalAlpha=s.p*.85;R(-6,-16,'i',13,14);c.globalAlpha=s.p;R(-6,-16,'w',1,6);R(-5,-16,'w',1,2);
   const fr0=Math.round(5.5*P),fx=x,fy=y0-9*P;if(sq>.1){c.save();c.translate(fx,fy);c.scale(sq,1);if(l.got){drawFruit(c,0,0,fr0,l.l);}else{drawFruit(c,0,0,fr0,l.l);c.fillStyle=FXP.x;c.globalAlpha=s.p*.88;c.beginPath();c.arc(0,0,fr0*1.02,0,7);c.fill();c.globalAlpha=s.p;T(c,'?',0,P*.6,P*5,'#fff2d8','center',FD);}c.restore();}
   R(-4,-1,'k',9,1);R(-3,-1,'Y',7,1);
   if(l.got){const gu=Math.min(1,(s.gtt||0)/.4),ry=-17-Math.round((1-gu)*6);R(4,ry,'k',5,5);R(5,ry+1,'r',3,3);R(6,ry+2,'y');R(5,ry+5,'R');R(7,ry+5,'R');R(5,ry+6,'k');R(7,ry+6,'k');}
   if(s.dnt!=null){const q=Math.min(1,s.dnt/.5);fxStar(c,x,y0-20*P-Math.round((1-q)*10)*P,g.P,3,'y');}c.restore();}},
 /* The Slick: a wet floor sign on the rim, a sheen running over the glass and glints sliding off every fruit. Phase 2: each shake knocks the sign flat for a moment. Beaten: a mop wipes the floor dry and the sign folds away */
 B_slick:{x(g){return fq(fxRX('B_slick',.76,40,g),fxBP(g));},
  tick(s,g,dt){bossT(s,dt);if(s.kn>0)s.kn-=dt;s.sw=(s.sw||0)+dt;},
  back(c,g,s,t){const P=g.P,dead=s.dnt!=null;if(dead&&s.dnt>1.4)return;c.save();c.globalAlpha=s.p*.75;const hx=fq(g.L+((t*.35)%1)*(g.R-g.L),P);for(let x=g.L;x<g.R;x+=P){const d=Math.abs(x-hx);fxR(c,x,g.bot-P,P,d<6*P?'w':'j');}c.restore();},
  front(c,g,s,t){const P=fxBP(g),Q=g.P,x=FXS.B_slick.x(g),rim=fxRim(g),dead=s.dnt!=null;c.save();c.globalAlpha=s.p;
   if(!dead)(s.l.fr||[]).forEach((f,i)=>{const ph=(t*.55+fhs(i,5))%1;if(ph>.16)return;const k=Math.floor(ph/.16*4),gx=f.x-f.r*.42,gy=f.y-f.r*.42;for(let q=-1;q<=1;q++)fxR(c,gx+(q+k-1)*Q,gy-(q+k-1)*Q,Q,'w');if(k===2)fxStar(c,gx,gy,Q,1,'b');});
   {const u=(s.sw%3.2)/1.1;if(u<1&&!dead){c.save();c.beginPath();c.rect(g.L,g.top,g.R-g.L,g.bot-g.top);c.clip();const pos=g.L-60+u*(g.R-g.L+120);c.globalAlpha=s.p*.4;for(let y=g.top;y<g.bot;y+=Q){const xx=fq(pos+(g.top-y)*.5,Q);c.fillStyle='#e3f3ff';c.fillRect(xx,y,Q*2,Q);c.fillRect(xx+5*Q,y,Q,Q);}c.restore();c.globalAlpha=s.p;}}
   const flat=(s.kn>0&&s.kn<.55)||(dead&&s.dnt>1.2),y0=rim+fxDrop(s,P),R=fxPt(c,x,y0,P);
   if(flat)fxS(c,'slS',x,y0-6*P,P,{ay:.5,r:1});else fxS(c,'slS',x+(s.kn>.55&&fst(s.kn,12)%2?P:0),y0,P);
   if(dead&&s.dnt<1.4){const u=s.dnt/1.2,mx=fq(g.L+(g.R-g.L)*Math.min(1,u),Q),my=g.bot-2*Q;for(let k=0;k<14;k++)fxR(c,mx-k*Q*.6,my-k*Q,Q,'n');for(let i=-3;i<=3;i++)fxR(c,mx+i*Q,my,Q,i%2?'c':'s',1,2);c.globalAlpha=s.p*.6;for(let xx=g.L;xx<mx-4*Q;xx+=Q)if(fhs(Math.round(xx/Q),2)>.6)fxR(c,xx,g.bot-Q,Q,'s');}c.restore();},
  ev(s,n){if(n==='slick'&&s.dnt==null)s.kn=.9;}},
 /* The Lid: a grumpy screw-top lid hangs over the jar, its rim turning, arrows pressing the line down. Phase 2: it screws lower with a hiss of steam. Beaten: it pops off and spins away */
 B_lid:{tick(s,g,dt){bossT(s,dt);},front(c,g,s,t){const P=fxBP(g),cx=fq((g.L+g.R)/2,P),hw=Math.round((g.R-g.L)*.3/P),u=Math.min(1,s.age/.9),p2=s.p2t!=null,dead=s.dnt!=null,dn=dead?s.dnt:0;let by=fxRim(g)-(p2?100:116)*g.K-Math.round(Math.pow(1-u,2)*60)*P;if(dead)by-=dn*dn*520-dn*80;
   const sx=p2&&!dead&&fst(t,16)%3===0?P:0,sp=dead?Math.max(.15,Math.abs(Math.cos(dn*9))):1,w=Math.max(2,Math.round(hw*sp));c.save();c.globalAlpha=s.p*(dead?Math.max(0,1-Math.max(0,dn-.7)/.4):1);if(dead&&dn>1.1){c.restore();return;}
   const R=fxPt(c,cx+sx,fq(by,P),P),rot=fst(t,dead?18:p2?7:2);R(-w+1,-8,'k',2*w-1,1);R(-w,-7,'k',2*w+1,1);R(-w+1,-7,'h',2*w-1,1);R(-w,-6,'k');R(w,-6,'k');R(-w+1,-6,'y',2*w-1,1);
   for(let i=-w;i<=w;i++)for(let j=-5;j<=-1;j++){const e=i===-w||i===w;R(i,j,e?'k':j===-1?'Y':(((i+rot)%3+3)%3===0?'o':((i+rot)%3+3)%3===1?'Y':'y'));}R(-w,0,'k',2*w+1,1);
   if(sp>.6){const ang=p2?1:0;R(-7,-5,'y',15,4);R(-7,-5,'Y',1,4);R(7,-5,'Y',1,4);R(-4,-5,'w',3,2);R(3,-5,'w',3,2);R(-3+ang,-4,'k');R(4-ang,-4,'k');R(-5,-6+(p2?1:0),'k',3,1);R(3,-6+(p2?1:0),'k',3,1);R(-2,-2,'k',5,1);if(p2){R(-2,-3,'k');R(2,-3,'k');}}
   if(!dead){const ph=fst(t,6)%3;c.globalAlpha=s.p*Math.min(1,s.age/1.2);for(const ax of[-.6,0,.6]){const ox=Math.round(ax*w);for(let k=0;k<2;k++){const yy=3+k*4+ph;R(ox-2,yy,'r');R(ox+2,yy,'r');R(ox-1,yy+1,'r');R(ox+1,yy+1,'r');R(ox,yy+2,'R');}}
    if(p2&&!RMO){for(const sd of[-1,1]){const q=(t*1.4+(sd>0?.5:0))%1;c.globalAlpha=s.p*(1-q);fxEl(c,fq(cx+sd*(w+3+q*6)*P,P),fq(by-(4+q*8)*P,P),P,1+Math.round(q*2),1+Math.round(q),(i,j,e)=>e?'s':'w');}}}
   if(dead&&dn<.5){c.globalAlpha=1;T(c,'POP!',cx,by+12*P,22,'#e63946','center',FD);}c.restore();}},
 /* The Auditor: a stern auditor stands on the rim with her clipboard, tapping her pen. Every merge whose Mult she cuts gets a red AUDITED stamp with the Mult struck through. Phase 2: she turns red in the face and her glasses flash. Beaten: she shuts the clipboard and walks off */
 B_audit:{x(g){return fq(fxRX('B_audit',.82,52,g),fxBP(g));},
  tick(s,g,dt){bossT(s,dt);if(s.st>0)s.st-=dt;if(s.dnt!=null)s.wo=(s.wo||0)+dt*60*g.K;},
  front(c,g,s,t){const P=fxBP(g),x=FXS.B_audit.x(g)+(s.wo||0),rim=fxRim(g),y0=rim+fxDrop(s,P),dead=s.dnt!=null,p2=s.p2t!=null,R=fxPt(c,x,y0,P);if(x>g.W+60)return;c.save();c.globalAlpha=s.p;
   const fr=s.st>0||(p2&&fst(t,2)%3===0)?'auA':'auS',wk=dead&&s.dnt>.5?(fst(t,6)%2?-P:0):0;fxS(c,fr,x,y0+wk,P);if(p2&&!dead){c.globalAlpha=s.p*.45;R(-3,-11,'r',2,1);R(2,-11,'r',2,1);c.globalAlpha=s.p;}
   const sh=dead?1:0;R(-7,-9,'k',5,7);R(-6,-8,sh?'n':'c',3,5);if(!sh){R(-6,-7,'d',3,1);R(-6,-5,'d',3,1);}R(-5,-9,'s');
   const tap=s.st>0?-4:fst(t,3)%2?-1:0;R(4,-8+tap,'k',2,3);R(4,-8+tap,'f');R(5,-11+tap,'k',1,3);R(5,-11+tap,'r',1,2);if(s.st>0){R(3,-15,'k',4,3);R(4,-14,'r',2,1);}c.restore();},
  ev(s,n,o,A,g){if(n!=='audit'||!s.l.p||s.dnt!=null)return;s.st=.5;const m0=o.m0,m=o.m,P=g.P;A.add({k:'fn',x:o.x,y:o.y-(o.r||20)-14,vy:-18,T:1.5,fa:.65,d:(c,q,g)=>{const z=(q.t<.08?1.6:q.t<.14?.9:1)*1.45,w=60*z,h=34*z,x0=q.x-w/2,y0=q.y-h/2;c.save();c.translate(q.x,q.y);c.rotate(-.12);c.translate(-q.x,-q.y);c.strokeStyle='#e63946';c.lineWidth=3;c.strokeRect(fq(x0,P),fq(y0,P),fq(w,P),fq(h,P));T(c,'AUDITED',q.x,y0+9*z,10*z,'#e63946','center',FD);const a='×'+(m0<10?m0.toFixed(1):Math.round(m0)),b='×'+(m<10?m.toFixed(1):Math.round(m));T(c,a,q.x-12*z,y0+24*z,11*z,'#3b2346','center',FD);c.fillStyle='#e63946';c.fillRect(q.x-24*z,y0+23*z,24*z,2);T(c,b,q.x+14*z,y0+24*z,12*z,'#e63946','center',FD);c.restore();}});}},
 /* The Vise: steel jaws line both walls and a handwheel stands on each corner of the rim; every time the walls close in the wheels turn a notch and red arrows squeeze inward. Opening them (size 6+) spins the wheels back, sparks fly and teal arrows push out. Phase 2: the jaw teeth glow red-hot. Beaten: the wheels drop off */
 B_vise:{tick(s,g,dt,A){bossT(s,dt);const v=s.l.vz||0;if(s.v0!=null&&v>s.v0+1e-4){s.cr=(s.cr||0)+1;s.ar=.5;}s.v0=v;if(s.sp>0)s.sp-=dt;if(s.ar>0)s.ar-=dt;s.wl=fxRX('viseL',.02,34,g,1);s.wr=fxRX('viseR',.98,34,g,1);},
  back(c,g,s,t){const P=g.P,p2=s.p2t!=null,dead=s.dnt!=null,a=dead?Math.max(0,1-s.dnt/1):Math.min(1,s.age/.5);if(a<=0)return;c.save();c.globalAlpha=s.p*a;
   for(const sd of[-1,1]){const x0=sd<0?g.L:g.R-P;for(let y=fq(g.top,P),k=0;y<g.bot;y+=P,k++){fxR(c,x0,y,P,k%2?'d':'s');if(k%3===0)fxR(c,x0-sd*P,y,P,p2?(fst(t+k*.05,6)%2?'o':'r'):'D');}}c.restore();},
  front(c,g,s,t){const P=fxBP(g),Q=g.P,p2=s.p2t!=null,dead=s.dnt!=null,dn=dead?s.dnt:0,rim=fxRim(g);c.save();c.globalAlpha=s.p*Math.min(1,s.age/.5);
   for(const sd of[-1,1]){const wx=fq(sd<0?(s.wl||g.L+20):(s.wr||g.R-20),P),fall=dead?dn*dn*600:0,wy=fq(rim-5*P+fall,P),rot=(((s.cr||0)*(sd<0?1:-1)+(s.sp>0?fst(s.sp,14)*(sd<0?-1:1):0))%2+2)%2;if(dead&&dn>1.3)continue;const W2=fxPt(c,wx,wy,P);
    W2(-1,1,'k',3,4);W2(0,1,'D',1,3);
    fxEl(c,wx,wy,P,4,4,(i,j,e)=>{const d=i*i+j*j;if(e)return'k';if(d>=9)return p2?'R':'D';if(d<=1)return d===0?(p2?'o':'y'):'k';return rot?(i===j||i===-j?'d':0):(i===0||j===0?'d':0);});}
   if(s.ar>0||s.sp>0){const out=s.sp>0,u=out?1-s.sp/.6:1-s.ar/.5,yy=fq(g.top+(g.bot-g.top)*.4,Q);for(const sd of[-1,1])for(let k=0;k<2;k++){const ox=(out?-1:1)*(2+u*5+k*3)*Q,x0=fq(sd<0?g.L+3*Q+ox:g.R-4*Q-ox,Q),dd=(out?-sd:sd);for(let q=0;q<3;q++){fxR(c,x0-dd*q*Q,yy-q*Q,Q,out?'t':'r');fxR(c,x0-dd*q*Q,yy+q*Q,Q,out?'t':'r');}}}c.restore();},
  ev(s,n,o,A,g){if(n!=='viseo'||!s.l.p)return;s.sp=.6;for(const sd of[-1,1]){const x=sd<0?g.L:g.R,y=g.top+(g.bot-g.top)*.4;A.burst(x,y,['y','o','w'],10,{v:200,vx:-sd*60,T:.4});}}},
 /* The Leech: a fat leech clings to the rim, swelling as it drinks; drops of your score drip out of the score panel and into its mouth. Phase 2: it swells bigger and drinks twice as fast. Beaten: it pops */
 B_vamp:{x(g){return fq(fxRX('B_vamp',.62,60,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const p2=s.p2t!=null;s.nt=(s.nt==null?.8:s.nt)-dt;if(s.l.on&&s.dnt==null&&s.nt<=0&&!RMO){s.nt=p2?.45:.9;const P=fxBP(g),x1=FXS.B_vamp.x(g)-8*P,y1=fxRim(g)-5*P,x0=g.W/2+(Math.random()-.5)*40,y0=44*g.K,T1=1.1;s.sl=(s.sl||0)+1;A.add({k:'fn',x:x0,y:y0,T:T1,fa:.9,d:(c,q,g)=>{const u=q.t/T1,e=u*u,xx=x0+(x1-x0)*u,yy=y0+(y1-y0)*e+Math.sin(u*Math.PI)*-30,Q=g.P;fxR(c,xx,yy-Q,Q,'k',2,1);fxR(c,xx-Q,yy,Q,'k',1,2);fxR(c,xx+2*Q,yy,Q,'k',1,2);fxR(c,xx,yy,Q,'r',2,2);fxR(c,xx,yy,Q,'q');fxR(c,xx,yy+2*Q,Q,'k',2,1);},end:()=>{s.gl=.25;}});}if(s.gl>0)s.gl-=dt;
   if(s.dnt!=null&&!s.pop){s.pop=1;const P=fxBP(g),x=FXS.B_vamp.x(g),y=fxRim(g)-5*P;A.burst(x,y,['r','R','q','V'],22,{v:260,vy:-80,T:.8});}},
  front(c,g,s,t){const P=fxBP(g),x=FXS.B_vamp.x(g),rim=fxRim(g),dead=s.dnt!=null,p2=s.p2t!=null;c.save();c.globalAlpha=s.p;
   if(dead){if(s.dnt<1.2){const R=fxPt(c,x,rim,P);R(-6,-1,'k',12,1);R(-5,-2,'V',10,1);R(-6,-2,'k');R(5,-2,'k');}c.restore();return;}
   const sw=Math.min(1,s.age/10)+(p2?.6:0),gl=s.gl>0?1:0,inch=fst(t,p2?4:2)%2,y0=rim+fxDrop(s,P);
   const st=inch?1:0,rx=8+(st?1:-1)+Math.round(sw),ry=Math.min(5,Math.round(3+sw*1.4+(st?0:1)+gl)),cy=fq(y0-(ry+1)*P,P);
   fxEl(c,x,cy,P,rx,ry,(i,j,e)=>e?'k':j<=-ry+1?(i%3===0?'V':'P'):j>=ry-1?'x':(((i+40)%3===0)?'x':(i<-rx+3&&j<0?'P':'V')));
   const H=fxPt(c,x-(rx+1)*P,cy+(ry-2)*P,P);H(-1,-1,'k',2,4);H(-2,0,'k',1,2);H(-1,0,'R',1,2);H(0,0,'r',1,2);
   const E=fxPt(c,x-(rx-3)*P,cy-(ry-1)*P,P);E(-1,-1,'k',3,3);E(0,0,'w');E(-1,0,'w');E(-1,0,p2?'r':'k');if(p2&&fst(t,3)%2)E(0,-3,'r');
   if(gl){const D=fxPt(c,x-(rx+2)*P,cy+(ry-2)*P,P);D(-1,0,'q');}c.restore();}},
 /* The Reaper (final boss, v1.81.1 bigger and darker, the user's ask): a towering hooded reaper hangs in the sky over the right of the jar, a black void under its hood with two burning eyes, a bony hand reaching for your fruit, a huge scythe over its head and smoke dripping from its tattered hem. It fades in out of the dark. Every merge that wins a drop back, its eyes flare, it swings the scythe in a wide arc and a soul floats down out of the jar to your drops. Phase 2: the eyes burn red, the blade's edge glows, lost souls circle it and the jar's edges darken. Beaten: the eyes go out, the robe crumples onto the rim and the scythe falls */
 B_reaper:{x(g){return fq(fxRX('B_reaper',.74,118,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);if(s.sw>0)s.sw-=dt;if(s.fl>0)s.fl-=dt;const P=fxBP(g),x=FXS.B_reaper.x(g),y0=fxRim(g)-5*P;
   if(!RMO&&s.dnt==null&&s.age>.8&&Math.random()<dt*9)A.add({k:'sq',x:x+(Math.random()*24-13)*P,y:y0-Math.random()*2*P,vx:(Math.random()-.6)*20,vy:14+Math.random()*16,T:1.1+Math.random()*.6,col:Math.random()<.5?'x':'V',s:Math.random()<.3?2:1,fa:.3,ly:1});},
  back(c,g,s,t){if(s.p2t==null||s.dnt!=null)return;const P=g.P,a=Math.min(1,s.p2t/1.5);c.save();for(let y=g.top,j=0;y<g.bot;y+=P,j++)for(let i=0;i<5;i++){if(FBY[(i&3)*4+(j&3)]/16<(5-i)/6*a*.75){fxR(c,g.L+i*P,y,P,'x');fxR(c,g.R-(i+1)*P,y,P,'x');}}c.restore();},
  front(c,g,s,t){const P=fxBP(g),x=FXS.B_reaper.x(g),rim=fxRim(g),dead=s.dnt!=null,dn=dead?s.dnt:0,p2=s.p2t!=null,u=Math.min(1,s.age/1.4);if(dead&&dn>3.2)return;
   const bob=dead?0:Math.round(Math.sin(t*1.6)*1.4),vs=dead?Math.max(.18,1-Math.max(0,dn-.25)/.6*.82):1,y0=fq(rim-(dead?Math.round(5*(1-Math.min(1,dn/.85))):5)*P+bob*P,P),hem=fst(t,7),fade=dead&&dn>2.4?Math.max(0,1-(dn-2.4)/.8):1;
   c.save();c.globalAlpha=s.p*fade;
   const R=(i,j,col)=>{if(u<1&&FBY[((i+64)&3)*4+((j+64)&3)]/16>=u*1.15-.1)return;fxR(c,x+i*P,y0+Math.round(j*vs)*P,P,col);};
   /* the scythe (v1.82: held in front, the user's note): a long snath gripped by a bony hand out of the far sleeve, the blade over the head curving down towards the jar with its edge on the inside. It swings about the grip: wind up back, then a sweep down towards the jar */
   const sw=s.sw>0?Math.min(3,Math.floor((1-s.sw/.75)*4)):0,ang=dead?Math.min(1.5,dn*3.2):[.05,.4,-.7,-1.15][sw],cs=Math.cos(ang),sn=Math.sin(ang),hx=7,hy=-17,pt=(a,b)=>[hx+Math.round(a*cs-b*sn),hy+Math.round(a*sn+b*cs)];
   /* robe */
   const top=-24;for(let j=top;j<=0;j++){const hw=Math.round(7+(j-top)*.38),sk=j>-7?Math.round(Math.sin(t*2.4+j*.5)*(j+7)*.18):0;for(let i=-hw;i<=hw;i++){const cut=j>-4&&fhs(i+hem*3,j)<(j+4)*.22;if(cut)continue;const e=i===-hw||i===hw||j===0||(j>-4&&fhs(i+hem*3,j+1)<(j+5)*.22);const fold=j>top+5&&((i+40)%5===0);R(i+sk,j,e?'k':i<-hw+2?'V':fold?'k':i>hw-3?'k':'x');}}
   for(let i=-5;i<=5;i++){R(i,top-1,'k');}
   /* the hood: a peaked cowl leaning towards the jar, a void inside */
   const hc=-30;for(let j=-39;j<=top;j++)for(let i=-9;i<=8;i++){const dy=j-hc,dx=i+1,inH=(dx*dx)/56+(dy*dy)/64<=1||(j<-36&&i>=-4+(j+39)&&i<=-1-(j+39)*0)||(j>=-36&&j<-35&&i>=-6&&i<=2);if(!inH)continue;const ed=((dx+1)*(dx+1))/56+(dy*dy)/64>1||((dx-1)*(dx-1))/56+(dy*dy)/64>1||(dx*dx)/56+((dy+1)*(dy+1))/64>1||(dx*dx)/56+((dy-1)*(dy-1))/64>1;R(i,j,ed?'k':i<-5?'V':'x');}
   for(let j=-34;j<=-23;j++)for(let i=-8;i<=2;i++){const dx=i+3,dy=j+28,e1=(dx*dx)/17+(dy*dy)/24,e2=(dx*dx)/27+(dy*dy)/36;if(e1<=1)R(i,j,'k');else if(e2<=1&&(i<-2||j<-31))R(i,j,'V');}
   /* the face in the void: a pale jaw, burning eyes with a halo */
   if(!dead||dn<.25){R(-5,-25,'s');R(-4,-25,'c');R(-3,-25,'s');R(-2,-25,'c');R(-1,-25,'s');R(-4,-24,'k');R(-2,-24,'k');
    const fl=s.fl>0,ey=p2?['R','r','q']:['G','g','l'],ea=Math.min(1,Math.max(0,(s.age-1)/.4));if(ea>0){c.globalAlpha=s.p*fade*ea;for(const ex of[-5,-2]){R(ex,-29,ey[2]);R(ex+1,-29,ey[1]);R(ex,-28,ey[0]);if(fl){R(ex-1,-29,ey[1]);R(ex+2,-29,ey[0]);R(ex,-30,ey[1]);R(ex+1,-30,ey[0]);R(ex+1,-28,ey[0]);}}if(fl||(t%2.6)<1.6){c.globalAlpha=s.p*fade*ea*.5;for(const ex of[-5,-2]){R(ex,-30,ey[0]);R(ex-1,-28,ey[0]);}}c.globalAlpha=s.p*fade;}}
   /* the reaching hand: a sleeve out towards the jar and long bony fingers that curl */
   if(!dead){const cl=fst(t,1.6)%2,reach=s.sw>0?2:0;for(let k=0;k<8;k++){const ax=-5-k-reach,ay=-21+Math.round(k*.55),w0=k>5?-2:-1,w1=k>5?3:2;for(let w=w0;w<=w1;w++)R(ax,ay+w,w===w0||w===w1?'k':w===w0+1?'V':'x');}
    const fx0=-13-reach,fy0=-18,bn=[[0,0],[0,1],[0,2],[-1,0],[-1,1],[-1,2]];for(let f=0;f<3;f++){const fy=-1+f*2;for(let q=0;q<4;q++)bn.push([-2-q,fy+(cl&&q>1?q-1:0)]);}bn.push([-1,4],[-2,5]);
    const bs=new Set(bn.map(([a,b])=>a+','+b));for(const[a,b]of bn)for(const[da,db]of[[1,0],[-1,0],[0,1],[0,-1]])if(!bs.has((a+da)+','+(b+db)))R(fx0+a+da,fy0+b+db,'k');for(const[a,b]of bn)R(fx0+a,fy0+b,a<-4?'w':'s');
    for(let k=0;k<6;k++){const ax=4+Math.round(k*.3),ay=-23+k;R(ax+2,ay,'k');R(ax+1,ay,'x');}}
   /* the snath in front of the robe, the far sleeve and the gripping hand over it, then the blade */
   const pole=[];for(let k=-20;k<=26;k++)pole.push(pt(0,-k));for(const[i,j]of pole){R(i-1,j,'k');R(i+1,j,'k');}pole.forEach(([i,j],k)=>R(i,j,k%5===2?'n':'N'));const[ti,tj]=pt(0,-26),[bi,bj]=pt(0,20);R(ti,tj-1,'k');R(bi,bj+1,'k');
   if(!dead)for(let k=0;k<6;k++){const ax=4+Math.round(k*.5),ay=-23+k;for(let w=-1;w<=2;w++)R(ax+w,ay,w===-1||w===2?'k':w===0?'V':'x');}
   if(!dead){const H=(i,j,col)=>R(hx+i,hy+j,col);for(let i=-2;i<=2;i++){H(i,-2,'k');H(i,2,'k');}for(const j of[-1,0,1]){H(-2,j,'k');H(2,j,'k');}H(-1,-1,'s');H(0,-1,'w');H(1,-1,'s');H(-1,0,'w');H(1,0,'s');H(-1,1,'s');H(0,1,'s');H(1,1,'d');}
   const bl=[];for(let k=0;k<=18;k++){const yb=-26+Math.round(k*k*.028),th=k<12?3:k<16?2:1;for(let q=0;q<th;q++)bl.push([-1-k,yb+q,q===th-1?(p2?'q':'w'):q===0?'d':'s']);}bl.push([0,-27,'d'],[0,-26,'d']);
   const bs=new Set(bl.map(([a,b])=>pt(a,b).join(',')));for(const[a,b]of bl){const[i,j]=pt(a,b);for(const[da,db]of[[1,0],[-1,0],[0,1],[0,-1]])if(!bs.has((i+da)+','+(j+db)))R(i+da,j+db,'k');}for(const[a,b,col]of bl){const[i,j]=pt(a,b);R(i,j,col);}
   {const gk=Math.floor((t*7)%24);if(gk<18&&!dead){const[i,j]=pt(-1-gk,-26+Math.round(gk*gk*.028)+(gk<12?2:gk<16?1:0));fxStar(c,x+i*P,y0+j*P,g.P,gk%3?1:2,p2?'r':'b');}}
   if(s.sw>0&&sw>=2){c.globalAlpha=s.p*.45;for(let k=0;k<12;k++){const a=ang+.15+k*.08,c2=Math.cos(a),s2=Math.sin(a),i=hx+Math.round(-12*c2+22*s2),j=hy+Math.round(-12*s2-22*c2);R(i,j,'w');R(i+1,j,'s');}c.globalAlpha=s.p*fade;}
   /* phase 2: lost souls circle it */
   if(p2&&!dead){for(let k=0;k<3;k++){const a=t*1.3+k*2.09,sx=x+Math.round(Math.cos(a)*18)*P,sy=y0+Math.round(-18+Math.sin(a)*9)*P;c.globalAlpha=s.p*.75;fxR(c,sx-P,sy-P,P,'k',3,3);fxR(c,sx,sy,P,'l');fxR(c,sx,sy-P,P,'w');fxR(c,sx-Math.round(Math.sin(a))*P*2,sy+P,P,'g');}c.globalAlpha=s.p*fade;}
   if(dead&&dn>.85){for(let k=0;k<4;k++){const q=Math.min(1,(dn-.85)/.4);R(-12+k*7,0,'k');}}
   c.restore();},
  ev(s,n,o,A,g){if(n!=='reap'||!s.l.p||s.dnt!=null)return;s.sw=.75;s.fl=.6;const x0=o.x,y0=o.y,T1=1.5;A.add({k:'fn',x:x0,y:y0,T:T1,fa:.75,d:(c,q,g)=>{const P=fxBP(g),u=q.t/T1,rise=Math.min(1,q.t/.35),yy=u<.23?y0-rise*30:y0-30+(g.H+40-(y0-30))*Math.pow((u-.23)/.77,1.6),xx=fq(x0+Math.sin(q.t*7)*8,P),y1=fq(yy,P),wv=fst(q.t,8)%2,G=fxPt(c,xx,y1,P);
   c.globalAlpha*=.9;G(-2,-4,'k',5,1);G(-3,-3,'k',7,5);G(-2,-3,'w',5,4);G(-2,-3,'i',1,4);G(-1,-2,'k');G(1,-2,'k');G(0,0,'k');G(-3,2,'k',1,1);G(-2,2,wv?'k':'w');G(-1,2,'w');G(0,2,wv?'w':'k');G(1,2,'w');G(2,2,wv?'k':'w');G(3,2,'k');G(-2,3,wv?'.':'k');G(0,3,'k');G(2,3,wv?'k':'.');
   for(let k=1;k<4;k++)fxR(c,fq(x0+Math.sin((q.t-k*.06)*7)*8,P),fq(yy-(u<.23?-k:k)*P*1.4-4*P,P),P,k<2?'l':'g');}});
   A.add({k:'fn',x:x0,y:y0-20,vy:-30,T:1,fa:.5,d:(c,q,g)=>T(c,'+1',q.x+16,q.y,18,'#38862a','center',FD)});}},
 /* The Pruner: a pair of secateurs struts along the rim on its handles, snipping the air. Every small merge it zeroes, a giant pair snaps shut on it and the 0 falls in two halves with a few leaves. Phase 2: its blades glint red. Beaten: its spring snaps and it topples */
 B_prune:{x(g){return fq(fxRX('B_prune',.4,64,g),fxBP(g));},
  tick(s,g,dt){bossT(s,dt);const P=fxBP(g),home=FXS.B_prune.x(g),span=10*P;if(s.ox==null){s.ox=0;s.dir=1;}if(s.dnt==null){s.ox+=s.dir*14*g.K*dt;if(s.ox>span)s.dir=-1;else if(s.ox<-span)s.dir=1;}},
  front(c,g,s,t){const P=fxBP(g),x=fq(FXS.B_prune.x(g)+(s.ox||0),P),rim=fxRim(g),dead=s.dnt!=null,p2=s.p2t!=null,fl=s.dir<0;c.save();c.globalAlpha=s.p;const y0=rim+fxDrop(s,P);
   const R=(i,j,col,w=1,h=1)=>fxR(c,x+(fl?-i-w+1:i)*P,y0+j*P,P,col,w,h);if(dead&&s.dnt>.4){R(-9,-3,'k',19,3);R(-8,-2,'r',8,1);R(1,-2,'s',8,1);R(0,-3,'y');R(-1,-4,'y');R(1,-5,'y');c.restore();return;}
   const th=(x0,y0,x1,y1,w,col,ol)=>{for(let d=-1;d<=w;d++)fxLn(c,x+(fl?-x0-d:x0+d)*P,y0*P+y0b,x+(fl?-x1-d:x1+d)*P,y1*P+y0b,P,FXP[ol||'k']);for(let d=0;d<w;d++)fxLn(c,x+(fl?-x0-d:x0+d)*P,y0*P+y0b,x+(fl?-x1-d:x1+d)*P,y1*P+y0b,P,FXP[col]);},y0b=y0;
   const st=dead?0:fst(t,6)%2,op=dead?0:(fst(t,1.4)%2?3:0),bl=p2?'q':'s';
   th(-2,-9,-4-st,-2+(st?-1:0),2,'r');th(1,-9,3+(1-st),-2+(st?0:-1),2,'R');R(-5-st,-1+(st?-1:0),'k',3,1);R(3+(1-st),-1+(st?0:-1),'k',3,1);
   R(-1,-6,'y');R(0,-5,'y');R(-1,-4,'y');
   th(-2,-11,-2-op,-19,2,bl);th(1,-11,1+op,-19,2,'w');R(-1-op,-19,'w');R(2+op,-19,bl);
   R(-2,-12,'k',4,3);R(-1,-11,'y',2,1);
   R(-4-Math.round(op*.5),-16,'k',2,2);R(-4-Math.round(op*.5),-16,'w');if(p2){R(-5-Math.round(op*.5),-17,'k',3,1);}
   if(p2&&fst(t,4)%3===0)fxStar(c,x+(fl?-1:1)*(2+op)*P,y0-20*P,g.P,1,'r');c.restore();},
  ev(s,n,o,A,g){if(n!=='prune'||!s.l.p||s.dnt!=null)return;const P=fxBP(g),z=Math.max(1,(o.r||20)/30);A.add({k:'fn',x:o.x,y:o.y,T:.55,fa:.7,d:(c,q,g)=>{const op=q.t<.12?3:q.t<.2?1:0,x=q.x,y=q.y;for(const sd of[-1,1])for(let k=0;k<11;k++){const xx=fq(x+sd*(op*(11-k)*.45+1)*P*z*.7,P),yy=fq(y-10*P*z+k*P*z,P);fxR(c,xx-P,yy,P,'k',4,1);fxR(c,xx,yy,P,sd<0?'s':'w',2,1);}fxR(c,x-P,y,P,'k',3,3);fxR(c,x,y+P,P,'y');}});
   for(const sd of[-1,1])A.add({k:'fn',x:o.x+sd*4,y:o.y-(o.r||20)*.3,vx:sd*50,vy:-80,g:500,T:1,dl:.18,fa:.5,d:(c,q,g,t,x)=>{c.save();c.beginPath();if(sd<0)c.rect(x-20,q.y-20,20,40);else c.rect(x,q.y-20,20,40);c.clip();T(c,'0',x,q.y,30,'#e63946','center',FD);c.restore();}});
   for(let k=0;k<4;k++)A.add({k:'sq',x:o.x,y:o.y,vx:(Math.random()-.5)*120,vy:-60-Math.random()*60,g:240,T:.9,col:k%2?'g':'G',s:2,sw:5,sf:6,dl:.15});}},
 /* The Orchard Queen (v1.81.1, a character now): the queen herself floats high over the jar in an apple-red gown and a purple cape trimmed with ermine, sceptre in hand, while her two rules play their own scenes below. Every time one of her rules strikes she raises the sceptre and its golden apple flares. She moves aside for a boss that needs the sky (The Lid, The Storm, The Blackout). Phase 2: her eyes glow and a dark aura gathers round her. Beaten: her crown tumbles into the jar and she bursts into blossom */
 B_queen:{EVS:['tax','storm','freeze','wilt','cuckoo','twins','charge','mrock','glut','mould','viseo','reap','slick','prune','audit','drop'],
  tick(s,g,dt,A){bossT(s,dt);if(s.cm>0)s.cm-=dt;const S=A.S,on=k=>S[k]&&S[k].p>0,px=on('B_lid')||on('B_storm')||on('B_dark')?(on('B_mirror')||on('B_ice')?.84:.17):.5;s.qx=s.qx==null?px:fxA(s.qx,px,dt*.6);
   if(s.dnt!=null&&!s.cr){const P=fxBP(g),x=g.L+(g.R-g.L)*s.qx,y=fxRim(g)-100*g.K-19*P;s.cr={x,y,vx:90,vy:-120,r:0};for(let k=0;k<26;k++){const a=Math.random()*Math.PI*2,v=60+Math.random()*120;A.add({k:'sq',x:x+(Math.random()-.5)*16*P,y:y+Math.random()*20*P,vx:Math.cos(a)*v,vy:Math.sin(a)*v-40,g:140,T:1.2+Math.random()*.6,col:['p','w','m','p'][k%4],s:2,sw:5,sf:4,ph:k,fa:.5});}}
   if(s.cr){const q=s.cr;q.vy+=900*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;q.r+=dt*6;if(q.y>g.bot-6*g.P){q.y=g.bot-6*g.P;q.vy*=-.45;q.vx*=.7;}}},
  front(c,g,s,t){const P=fxBP(g),x=fq(g.L+(g.R-g.L)*(s.qx==null?.5:s.qx),P),u=Math.min(1,s.age/1.2),dead=s.dnt!=null,p2=s.p2t!=null,bob=fst(t,1.5)%2?-1:0,yb=fq(fxRim(g)-100*g.K-Math.round((1-u)*(1-u)*50)*P+bob*P,P);c.save();c.globalAlpha=s.p;
   if(s.cr){fxS(c,'crown',s.cr.x,s.cr.y,P,{ay:.5,r:Math.floor(s.cr.r)%4});c.restore();return;}
   if(p2){const a=Math.min(1,s.p2t/1.2);for(let j=-28;j<=2;j++)for(let i=-13;i<=13;i++){const d=(i*i)/169+((j+12)*(j+12))/256;if(d>1||d<.55)continue;if(FBY[((i+40)&3)*4+((j+40)&3)]/16<(1-d)*2.2*a)fxR(c,x+i*P,yb+j*P,P,fst(t+i*.03,4)%3?'V':'x');}}
   const R=fxPt(c,x,yb,P),cm=s.cm>0,cp=fst(t,5)%2;
   for(let j=0;j<3;j++){R(-8+(cp?-1:0),-2+j,'k');R(8+(cp?1:0),-2+j,'k');}
   fxS(c,p2&&fst(t,3)%2===0?'oqB':'oqA',x,yb,P);R(-3,-19,'k');R(-2,-18,'k');R(2,-18,'k');R(3,-19,'k');if(p2){R(-2,-17,'r');R(2,-17,'r');}
   const sy=cm?-30:-26,sx=10;for(let j=sy+3;j<=-6;j++){R(sx-1,j,'k');R(sx+1,j,'k');R(sx,j,'Y');}R(sx-1,-12,'k',3,1);R(sx,-12,'f');R(sx-1,-11,'k',3,2);R(sx,-11,'f');
   fxEl(c,x+sx*P,yb+(sy+1)*P,P,2,2,(i,j,e)=>e?'k':i<0&&j<0?'h':cm&&fst(t,10)%2?'w':'y');R(sx,sy-2,'G');R(sx+1,sy-3,'g');
   if(cm){for(let k=0;k<8;k++){const a=k*Math.PI/4,r2=4+(fst(s.cm,12)%2);R(sx+Math.round(Math.cos(a)*r2),sy+1+Math.round(Math.sin(a)*r2),k%2?'y':'o');}}
   const tw=(t%2.2)/2.2;if(tw<.3)fxStar(c,x-5*P,yb-25*P,g.P,[1,2,3,2,1][Math.floor(tw/.3*5)],'y');if(u<1)fxStar(c,x,yb-27*P,g.P,[0,1,2,3,2,1][Math.floor(u*6)],'y');c.restore();},
  ev(s,n){if(!s.l.p||s.dnt!=null||!FXS.B_queen.EVS.includes(n)||n==='drop')return;s.cm=.6;}}});

/* ---------- charm triggers (v1.82, the user's ask: every charm animated). A charm with no scene of its own still shows in the jar when it fires: its icon pops out where it fired
   (the merge, or under its header slot when it fires on its own: a tool use, a jar start, a pet meal), bobs, bursts into cells of its own colours and sends a token to the part of
   the screen it changes: points to the score, Mult to the Mult panel, coins down to the coin counter, charge down to the tool bar, drops to the drops bar, seeds up to the header.
   Pops from one moment fan out in an arc (FXPOP keeps the recent spots) and at most FXCAP icons show at once, so a combo never stacks them. FXT overrides a charm's tokens,
   FXSKIP lists the charms that already show in the jar (pets, the Passerby cat). ---------- */
const FXCHN=new Set(['lucky','fourleaf','scratch','mint','snake','dnoth','allin','alch','phil','gberry','cblast','foot']),FXSKIP=new Set(['pet','bee','mole','hog','lady','passer','frenzy','zoo','nectar','bfly','treat','magpie','hunter','chrys']),FXCAP=7;
const FXT={piggy:['c'],goose:['c'],bank:['c'],scratch:['c'],mint:['c'],gold:['c'],tjar:['c'],tpunch:['c'],pdirt:['c'],truffle:['c'],gdig:['c'],lchange:['c'],hfund:['c','a'],bag:['d'],horn:['x','d'],dom:['d'],aval:['d','a'],spark:['z'],dynamo:['z'],battery:['z'],juggle:['z'],tremor:['z'],jstart:['z'],csq:['z'],kindl:['z'],play:['a','z'],recyc:['z'],wshop:['z'],tsmith:['z'],citblast:['a','z'],gard:['s'],green:['s'],root:['s'],xpol:['s'],hcomb:['a','s'],packet:['s'],svault:['s'],sbank:['s'],cbin:['s'],coupon:['c'],leaf:['g'],phil:['g'],alch:['g'],gberry:['g'],geode:['g'],ccave:['g','p'],crowd:['p'],ash:['p'],fin:['p'],boom:['p'],volcano:['p','a'],show:['a'],drive:['a'],rfire:['a'],droll:['a'],lslide:['a'],bigbang:['a'],shortf:['p'],zbomb:['a'],bbomb:['p'],cblast:['p'],cluster:['p'],psq:['p'],net:['p'],phoenix:['x']};
function fxTok(id){if(FXT[id])return FXT[id];const c=(typeof CH!=='undefined'&&CH[id])||(typeof TL!=='undefined'&&TL[id])||{},d=(c.d||'').toLowerCase(),o=[];if(c.x)o.push('x');if(c.add)o.push('a');if(c.chip)o.push('p');if(/coin/.test(d))o.push('c');if(/charge/.test(d))o.push('z');if(/drop back|more drops|\+\d+ drops/.test(d))o.push('d');if(/seed/.test(d)&&!o.length)o.push('s');if(/gold/.test(d)&&!o.length)o.push('g');return FXT[id]=o.length?o.slice(0,2):['p'];}
const FXIC={};function fxIc(id){if(FXIC[id]!==undefined)return FXIC[id];const k=(typeof ICN!=='undefined'&&ICN[id])||id,gd=typeof PXD!=='undefined'&&PXD[k];if(!gd)return FXIC[id]=null;const cnt={};for(const ch of gd)if(/[a-zA-Z]/.test(ch)&&ch!=='k'&&FXP[ch])cnt[ch]=(cnt[ch]||0)+1;const cols=Object.keys(cnt).sort((a,b)=>cnt[b]-cnt[a]).slice(0,3);return FXIC[id]={im:fxGrid(gd,FXP),cols:cols.length?cols:['w']};}
/* a token's look, in cells around its centre: [di, dj, colour]; every token gets a dark outline */
const FXTG={x:[[-1,-1,'P'],[1,-1,'P'],[0,0,'V'],[-1,1,'P'],[1,1,'P']],a:[[0,-1,'m'],[-1,0,'m'],[0,0,'p'],[1,0,'m'],[0,1,'m']],p:[[0,0,'b'],[1,0,'B'],[0,1,'B'],[1,1,'b'],[0,0,'w']],c:[[-1,-1,'y'],[0,-1,'y'],[1,-1,'Y'],[-1,0,'y'],[0,0,'h'],[1,0,'Y'],[-1,1,'Y'],[0,1,'Y'],[1,1,'Y']],z:[[1,-2,'y'],[0,-1,'y'],[1,-1,'y'],[-1,0,'o'],[0,0,'y'],[0,1,'y'],[-1,2,'o']],d:[[0,-2,'b'],[0,-1,'b'],[-1,0,'b'],[0,0,'w'],[1,0,'B'],[0,1,'B']],s:[[0,-2,'g'],[1,-2,'l'],[-1,-1,'g'],[0,-1,'G'],[0,0,'G'],[0,1,'N']],g:[[0,-1,'y'],[-1,0,'y'],[0,0,'h'],[1,0,'y'],[0,1,'Y']]};
function fxTgD(c,x,y,P,k){const cs=FXTG[k]||FXTG.p,s=new Set(cs.map(([a,b])=>a+','+b));c.fillStyle=FXP.k;for(const[a,b]of cs)for(const[da,db]of[[1,0],[-1,0],[0,1],[0,-1]])if(!s.has((a+da)+','+(b+db)))c.fillRect(fq(x+(a+da)*P,P),fq(y+(b+db)*P,P),P,P);for(const[a,b,col]of cs){c.fillStyle=FXP[col];c.fillRect(fq(x+a*P,P),fq(y+b*P,P),P,P);}}
function fxTgT(k,g){const W=g.W,H=g.H;return k==='x'||k==='a'?[W-48,22]:k==='p'?[W/2,26]:k==='c'?[26,H+40]:k==='z'?[W*.62,H+40]:k==='d'?[W*.3,H+24]:k==='s'?[W*.22,-24]:null;}
function fxToks(A,tk,px,py){const g=A.g,P=g.P;for(const k of tk){if(k==='p'||k==='x'||k==='a')continue; /* v1.82.2: points and Mult already pop under the header slots, so only coins, charge, drops, seeds and gold fly */const tg=fxTgT(k,g);if(!tg){A.burst(px,py,['y','h','Y'],8,{v:110,T:.5});continue;}const x0=px,y0=py-22*g.K,T1=.55+Math.random()*.1,bx=(Math.random()-.5)*60;A.add({k:'fn',x:x0,y:y0,T:T1,fa:.92,d:(c,q,g)=>{const u=Math.min(1,q.t/T1),e=u*u*(3-2*u),xx=x0+(tg[0]-x0)*e+Math.sin(u*Math.PI)*bx,yy=y0+(tg[1]-y0)*e-Math.sin(u*Math.PI)*30*g.K;for(let s2=3;s2>0;s2--){const v=Math.max(0,u-s2*.05),ev=v*v*(3-2*v);c.globalAlpha*=.6;c.fillStyle=FXP[k==='c'?'y':k==='z'?'y':k==='x'?'P':k==='a'?'m':k==='d'?'b':k==='s'?'g':'b'];c.fillRect(fq(x0+(tg[0]-x0)*ev+Math.sin(v*Math.PI)*bx,g.P),fq(y0+(tg[1]-y0)*ev-Math.sin(v*Math.PI)*30*g.K,g.P),g.P,g.P);}c.globalAlpha=1;fxTgD(c,xx,yy,g.P,k);}});}}
function fxPop(A,id,x,y){if(FXSKIP.has(id)||RMO&&0)return;const g=A.g;if(!g)return;const ic=fxIc(id),P=g.P,tk=fxTok(id);A.pops=(A.pops||[]).filter(q=>A.t-q.t<.18);let sp=A.pops.find(q=>Math.hypot(q.x-x,q.y-y)<36);if(!sp){sp={x,y,t:A.t,n:0};A.pops.push(sp);}const n=sp.n++,live=A.pp.filter(q=>q.pop&&q.t<q.T).length;
 const cw=64*g.K,cx=Math.max(g.L+cw*.5,Math.min(g.R-cw*.5,x)),md=cx<g.L+cw*2.2?1:cx>g.R-cw*2.2?-1:0,sd=md?md*n:n?(n%2?1:-1)*Math.ceil(n/2):0,c0=md>0?Math.max(g.L+cw*.5,Math.min(cx,g.R-cw*4.5)):md<0?Math.min(g.R-cw*.5,Math.max(cx,g.L+cw*4.5)):cx,px=Math.max(g.L+30*g.K,Math.min(g.R-30*g.K,c0+sd*cw)),py=Math.max(70,y-10*g.K),dl=n*.07,cols=ic?ic.cols:['w'];
 const toks=()=>fxToks(A,tk,px,py);
 {A.add({k:'fn',x:px,y:py,T:.01,dl,d:()=>{},end:()=>{toks();fxFl(A,id,x,y);}});return;} /* v1.83: no cards in the jar (the user's call: icons in the jar look messy and get in the way of quick play) */}
/* charm flourishes (v1.82): beside its card, each charm adds a touch of its own (honey drips, clover leaves, a bullseye's rings, a leaping fish, coins, flames, seedlings...).
   FXSP = small pixel sprites as [di, dj, colour] cells, drawn outlined by fxSpD; FXFL[id] = [kind, ...] read by fxFl. */
/* Feast: Doggy Bag and Well Fed share one laid table on the rim (one rim spot, 'feast'), lifted by fxFeL */
const fxFe=()=>{const S=FXC&&FXC.S;return !!(S&&S.dbag&&S.dbag.l&&S.dbag.l.fe&&S.dbag.p>0);},fxFeL=g=>fxFe()?6*fxBP(g):0;
function fxTable(c,g,s,t){const Q=fxBP(g),tx=fq(fxRX('feast',.5,124,g),Q),y=fq(fxRim(g),Q),m=new Map();c.save();c.globalAlpha=s.p;for(let i=-17;i<=17;i++){m.set(i+',-6',((i+40)>>1)&1?'r':'w');m.set(i+',-5',((i+41)>>1)&1?'r':'w');if(i%2===0)m.set(i+',-4',((i+40)>>1)&1?'R':'s');}for(const lx of[-14,13])for(let j=0;j<=3;j++)m.set(lx+','+(-j),j===0?'N':'n');fxBlob(c,tx,y,Q,m);
 const cx=tx-3*Q,cm=new Map([['0,-7','Y'],['0,-8','Y'],['-1,-7','Y'],['1,-7','Y'],['0,-9','Y'],['-2,-9','Y'],['-1,-9','Y'],['1,-9','Y'],['2,-9','Y'],['-2,-10','w'],['-2,-11','w'],['0,-10','w'],['0,-11','w'],['0,-12','w'],['2,-10','w'],['2,-11','w']]);fxBlob(c,cx,y,Q,cm);for(const[i,top,o2]of[[-2,12,0],[0,13,.3],[2,12,.6]]){const fh=fst(t+o2,9)%3;fxR(c,cx+i*Q,y-(top+(fh>1?1:0))*Q,Q,'o');fxR(c,cx+(i+(fh===1?1:0))*Q,y-(top+1+(fh>1?1:0))*Q,Q,'y');}
 const bn=new Map();for(const lx of[-17,16])for(let j=6;j<=23;j++)bn.set(lx+','+(-j),'N');for(let i=-16;i<=15;i++){const sag=Math.round(Math.sin((i+16)/31*Math.PI)*3);bn.set(i+','+(-23+sag),'k');if((i+16)%3===1){const col=['r','y','b','g','m'][((i+16)/3|0)%5];bn.set(i+','+(-22+sag),col);bn.set((i+1)+','+(-22+sag),col);bn.set(i+','+(-21+sag),col);}}fxBlob(c,tx,y,Q,bn);c.restore();}
/* a little bone (Doggy Bag) */
function fxBone(c,x,y,P){fxBlob(c,fq(x,P),fq(y,P),P,new Map([['-2,-1','w'],['-2,1','w'],['-1,0','w'],['0,0','w'],['1,0','s'],['2,-1','w'],['2,1','s']]));}
/* a curl of steam rising off a hot meal; big = a puff when it scores */
function fxSteam(A,x,y,big){A.add({k:'fn',x,y,T:big?.9:1.2,fa:.4,ph:Math.random()*6,d:(c,q,g)=>{const P=g.P,u=q.t/q.T,yy=y-u*(big?44:30)*g.K;for(let k=0;k<(big?4:3);k++){const j=k*2,xx=x+Math.round(Math.sin(q.ph+u*7+k*1.3)*1.6)*P;fxR(c,xx,yy+j*P,P,k?'u':'s',big?2:1,1);}}});}
/* Hallmark's punch: a steel punch drops onto the fruit, a flash, and a hallmark (a gold shield with a red crown) stays on the fruit a moment */
function fxPunch(A,x,y,r,done){fxAd(A,{k:'fn',x,y,T:.95,fa:.75,d:(c,q,g)=>{const P=g.P,t=q.t,top=y-r-30*g.K,hit=y-r*.15,py=t<.12?top+(hit-top)*(t/.12)**2:t<.3?hit:hit-(t-.3)*240*g.K;if(t>=.12&&!q.hd){q.hd=1;if(done)done();A.add({k:'star',x:x-r*.5,y:y-r*.2,T:.3,col:'y'});A.add({k:'star',x:x+r*.5,y:y-r*.3,T:.3,col:'w'});}
  if(t>=.12){const cs=new Map();for(const[i,j]of[[-2,-3],[-1,-3],[0,-3],[1,-3],[2,-3],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[-2,-1],[-1,-1],[0,-1],[1,-1],[2,-1],[-1,0],[0,0],[1,0],[0,1]])cs.set(i+','+j,(i===2||j===1||(i===1&&j===0))?'Y':'y');cs.set('-1,-3','r');cs.set('0,-3','r');cs.set('1,-3','r');cs.set('0,-4','r');cs.set('-2,-4','r');cs.set('2,-4','r');cs.set('-1,-2','h');fxBlob(c,fq(x,P),fq(y,P),P,cs);if(t<.2){const R2=Math.round(r/P*.6+(t-.12)*80);for(let a=0;a<6.28;a+=.5)fxR(c,x+Math.round(Math.cos(a)*R2)*P,y+Math.round(Math.sin(a)*R2)*P,P,'w');}}
  if(t<.55){const cs=new Map();for(let j=-9;j<=0;j++)for(let i=-1;i<=1;i++)cs.set(i+','+j,j<-7?'d':i<0?'w':i>0?'d':'s');for(let i=-2;i<=2;i++)cs.set(i+',-10','D');fxBlob(c,fq(x,P),fq(py-6*P,P),P,cs);}}});}
/* a fish facing d (1 right, -1 left), pitch p (-1 nose up .. 1 nose down, in half steps), tail frame f; gold = a goldfish for the shoal */
function fxFish(c,x,y,P,d,p,f,gold){const B=gold?'Y':'B',b=gold?'o':'b',L=gold?'y':'i',src=new Map(),put=(i,j,col)=>src.set(i+','+j,col);
 for(let i=-1;i<=1;i++)put(i,-2,B);for(let i=-2;i<=3;i++)put(i,-1,i===3?b:B);for(let i=-3;i<=4;i++)put(i,0,b);for(let i=-2;i<=3;i++)put(i,1,L);for(let i=-1;i<=1;i++)put(i,2,L);put(0,-3,B);put(-1,0,'w');put(2,-1,'k');put(0,1,b);
 if(f){put(-4,0,B);put(-5,-1,B);put(-5,1,B);put(-6,-2,B);put(-6,2,B);}else{put(-4,0,B);put(-5,0,B);put(-6,-1,B);put(-6,1,B);put(-5,-1,B);put(-5,1,B);}
 /* p = pitch: a leaping fish uses a hand-drawn diagonal sprite (nose up and forward), flipped for the dive */
 const cs=new Map();if(!p){for(const[k,col]of src){const[i,j]=k.split(',').map(Number);cs.set((i*d)+','+j,col);}}else{const D=[[2,-4,B],[3,-4,b],[0,-3,B],[1,-3,B],[2,-3,b],[3,-3,b],[4,-3,b],[-1,-2,B],[0,-2,B],[1,-2,b],[2,-2,'k'],[3,-2,b],[4,-2,L],[-2,-1,B],[-1,-1,B],[0,-1,b],[1,-1,b],[2,-1,b],[3,-1,L],[4,-1,L],[-3,0,B],[-2,0,B],[-1,0,b],[0,0,'w'],[1,0,b],[2,0,L],[3,0,L],[-2,1,b],[-1,1,b],[0,1,b],[1,1,L],[2,1,L],[-2,2,B],[-1,2,b],[0,2,L],[1,2,L],[-3,2,B]].concat(f?[[-3,3,B],[-4,3,B],[-5,3,B],[-6,2,B],[-3,4,B],[-3,5,B],[-2,6,B],[-4,4,B]]:[[-3,3,B],[-4,3,B],[-3,4,B],[-4,4,B],[-5,4,B],[-4,5,B],[-6,4,B],[-4,6,B]]);for(const[i,j,col]of D)cs.set((i*d)+','+(p>0?-j:j),col);}
 fxBlob(c,fq(x,P),fq(y,P),P,cs);}
const FXSP={leaf:[[0,-1,'g'],[-1,0,'g'],[1,0,'g'],[0,1,'G'],[0,0,'l'],[1,1,'G']],drop:[[0,-1,'Y'],[-1,0,'Y'],[0,0,'y'],[1,0,'o'],[0,1,'o']],fish:[[-1,0,'o'],[0,0,'o'],[1,0,'y'],[-1,-1,'o'],[0,-1,'y'],[-1,1,'o'],[0,1,'o'],[2,-1,'o'],[2,1,'o'],[-1,0,'k']],berry:[[0,0,'m'],[1,0,'V'],[0,1,'V'],[1,1,'m'],[0,-1,'G'],[1,-1,'g']],flame:[[0,-2,'y'],[0,-1,'o'],[-1,0,'o'],[0,0,'y'],[1,0,'r'],[0,1,'r'],[-1,1,'r']],crys:[[0,-2,'i'],[0,-1,'b'],[-1,0,'b'],[0,0,'i'],[1,0,'B'],[0,1,'B']],heart:[[-1,-1,'m'],[1,-1,'m'],[-1,0,'m'],[0,0,'p'],[1,0,'m'],[0,1,'m']],paw:[[0,0,'N'],[1,0,'N'],[0,1,'N'],[1,1,'N'],[-1,-1,'N'],[1,-2,'N'],[2,-1,'N']],note:[[1,-3,'V'],[1,-2,'V'],[1,-1,'V'],[0,0,'V'],[1,0,'V'],[2,-3,'V']],tile:[[0,-2,'w'],[1,-2,'w'],[0,-1,'k'],[1,-1,'w'],[0,0,'w'],[1,0,'w'],[0,1,'w'],[1,1,'k']],ice:[[0,-1,'i'],[-1,0,'j'],[0,0,'w'],[1,0,'j'],[0,1,'i']],cheese:[[-1,0,'y'],[0,0,'Y'],[1,0,'y'],[0,-1,'y'],[-1,1,'Y'],[0,1,'y'],[1,1,'y']],candy:[[-1,0,'p'],[0,0,'w'],[1,0,'m'],[-2,-1,'p'],[2,1,'m']],petal:[[0,0,'p'],[1,0,'m'],[0,1,'m']],chip:[[0,0,'d'],[1,0,'s'],[0,1,'D']],crumb:[[0,0,'n'],[1,1,'N']],card:[[0,-1,'w'],[1,-1,'w'],[0,0,'r'],[1,0,'w'],[0,1,'w'],[1,1,'b']],arrow:[[-2,0,'n'],[-1,0,'n'],[0,0,'n'],[1,0,'s'],[2,0,'w'],[1,-1,'s'],[1,1,'s'],[-2,-1,'r'],[-2,1,'r']],ribbon:[[0,-1,'b'],[1,-1,'B'],[0,0,'b'],[-1,1,'B'],[1,1,'B']],vine:[[0,0,'G'],[1,-1,'g'],[0,-2,'G'],[-1,-1,'l']],coin:FXTG.c,bolt:FXTG.z,seed:FXTG.s,plus:FXTG.a,gold:FXTG.g};
function fxSpD(c,x,y,P,cs){const s=new Set(cs.map(([a,b])=>a+','+b));c.fillStyle=FXP.k;for(const[a,b]of cs)for(const[da,db]of[[1,0],[-1,0],[0,1],[0,-1]])if(!s.has((a+da)+','+(b+db)))c.fillRect(fq(x+(a+da)*P,P),fq(y+(b+db)*P,P),P,P);for(const[a,b,col]of cs){c.fillStyle=FXP[col];c.fillRect(fq(x+a*P,P),fq(y+b*P,P),P,P);}}
const fxMir=cs=>cs.map(([a,b,c2])=>[-a,b,c2]);
function fxSpray(A,x,y,k,n,o={}){const cs=FXSP[k]||FXSP.leaf;for(let i=0;i<n;i++){const a=o.a!=null?o.a+(Math.random()-.5)*(o.sp||1.2):Math.random()*Math.PI*2,v=(o.v||130)*(.55+Math.random()*.6),fl=Math.random()<.5,q={k:'fn',x:x+(Math.random()-.5)*(o.w||10),y,vx:Math.cos(a)*v,vy:Math.sin(a)*v+(o.vy||0),g:o.g==null?320:o.g,T:(o.T||.9)+Math.random()*.3,dl:(o.dl||0)+i*(o.st||0),fa:o.fa||.6,fy:o.fy,bo:.35,d:(c,q,g,t,x2)=>fxSpD(c,x2,q.y,g.P,fl?fxMir(cs):cs)};if(o.sw){q.sw=o.sw;q.sf=4;q.ph=i;}A.add(q);}}
function fxWd(A,x,y,s,col,o={}){A.add({k:'fn',x,y,vy:o.vy==null?-26:o.vy,T:o.T||1,fa:.6,dl:o.dl||0,d:(c,q,g)=>{const u=q.t-(o.dl||0),z=u<.06?.6:u<.12?1.25:1,sz=(o.sz||20)*z;for(const[dx,dy]of[[-2,0],[2,0],[0,-2],[0,2]])T(c,s,q.x+dx,q.y+dy,sz,'#2a1a3a','center',FD);T(c,s,q.x,q.y,sz,col,'center',FD);}});}
function fxRing(A,x,y,col,R,o={}){A.add({k:'fn',x,y,T:o.T||.45,dl:o.dl||0,fa:.4,d:(c,q,g)=>{const P=g.P,u=(q.t-(o.dl||0))/(o.T||.45),r=Math.max(1,Math.round(R*(.25+.75*u)/P));for(let a=0;a<Math.PI*2;a+=.9/r){const i=Math.round(Math.cos(a)*r),j=Math.round(Math.sin(a)*r);fxR(c,x+i*P,y+j*P,P,col);}}});}
/* the recipes: [kind, ...]. s = spray a sprite (sprite, count, options), w = a word, r = rings, b = a burst of cells, x = several of these */
const FXFL={honey:['s','drop',5,{a:Math.PI/2,v:40,g:260,T:1}],lucky:['x',['s','leaf',5,{v:140,g:120,sw:6}],['w','×3','#38862a']],fourleaf:['x',['s','leaf',7,{v:160,g:120,sw:6}],['w','×3','#38862a']],foot:['s','leaf',3,{v:100,g:200}],
 bull:['x',['r','r',30],['r','w',22,{dl:.08}],['r','r',14,{dl:.16}],['w','BULLSEYE','#e63946',{sz:16}]],sharp:['x',['r','r',30],['r','w',22,{dl:.08}],['w','×4','#e63946']],crit:['x',['r','k',34],['r','r',24,{dl:.06}],['w','SWEET SPOT ×5','#e63946',{sz:16}]],
 scratch:['x',['s','coin',3,{a:-Math.PI/2,v:180}],['w','WIN!','#e09600',{sz:16}]],mint:['s','coin',4,{a:-Math.PI/2,v:180}],gold:['s','coin',3,{a:-Math.PI/2,v:170}],tjar:['s','coin',2,{a:-Math.PI/2,v:150}],
 pdirt:['s','coin',5,{a:-Math.PI/2,v:190}],tpunch:['s','coin',4,{a:-Math.PI/2,v:180}],truffle:['s','coin',2,{a:-Math.PI/2,v:150}],gdig:['s','coin',3,{a:-Math.PI/2,v:160}],piggy:['s','coin',4,{a:-Math.PI/2,v:170}],goose:['s','coin',5,{a:-Math.PI/2,v:180}],wallet:['s','coin',2,{a:-Math.PI/2,v:140}],cint:['s','coin',2,{a:-Math.PI/2,v:140}],hfund:['s','coin',3,{a:-Math.PI/2,v:160}],gstd:['s','coin',2,{a:-Math.PI/2,v:140}],
 cider:['b',['r','y','o','R'],14],mill:['b',['r','y','o','R'],18],zest:['b',['y','o','h'],12],marm:['b',['y','o','h'],16],csq:['x',['b',['y','o'],10],['s','bolt',2,{a:-Math.PI/2,v:150}]],citblast:['x',['b',['y','o'],14],['s','bolt',2,{a:-Math.PI/2,v:150}]],
 picker:['s','berry',3,{a:-Math.PI/2,v:170}],bbowl:['s','berry',3,{a:-Math.PI/2,v:170}],jam:['s','berry',4,{a:-Math.PI/2,v:180}],pit:['s','chip',4,{v:150}],
 fin:['w','FINISH!','#fb8500'],gfin:['w','GRAND FINALE!','#fb8500',{sz:16}],dom:['s','tile',4,{a:-Math.PI/2,v:160,g:420}],aval:['s','tile',5,{a:-Math.PI/2,v:170,g:420}],
 ash:['b',['s','d','D'],12,{vy:-60,g:-40}],demo:['b',['s','d','o'],12,{vy:-40}],crowd:['b',['r','y','b','g','m'],18,{vy:-80}],show:['b',['y','h','w'],12],drive:['s','bolt',2,{a:-Math.PI/2,v:150}],
 fever:['s','flame',4,{a:-Math.PI/2,v:110,g:-60}],mania:['s','flame',5,{a:-Math.PI/2,v:120,g:-60}],kindl:['s','flame',2,{a:-Math.PI/2,v:90,g:-50}],play:['x',['s','flame',2,{a:-Math.PI/2,v:90,g:-50}],['s','heart',2,{a:-Math.PI/2,v:100,g:-30}]],
 gard:['s','seed',3,{a:-Math.PI/2,v:110}],green:['s','seed',4,{a:-Math.PI/2,v:120}],root:['s','seed',3,{a:-Math.PI/2,v:110}],xpol:['s','seed',2,{a:-Math.PI/2,v:100}],hcomb:['s','seed',2,{a:-Math.PI/2,v:100}],sprout:['s','seed',2,{a:-Math.PI/2,v:90}],svault:['s','seed',3,{a:-Math.PI/2,v:100}],abacus:['s','seed',2,{a:-Math.PI/2,v:90}],poly:['s','seed',2,{a:-Math.PI/2,v:90}],hmoon:['x',['s','seed',2,{a:-Math.PI/2,v:90}],['w','HARVEST MOON','#7a2fe0',{sz:14}]],hfest:['s','seed',4,{a:-Math.PI/2,v:110}],ftree:['s','seed',2,{a:-Math.PI/2,v:90}],
 geode:['s','crys',5,{v:170}],ccave:['s','crys',6,{v:180}],ppol:['b',['w','i','b'],10],isculpt:['s','ice',4,{v:140}],fondue:['x',['s','ice',3,{v:130}],['s','cheese',2,{v:120}]],bcheese:['s','cheese',3,{a:-Math.PI/2,v:150}],stooth:['s','candy',3,{a:-Math.PI/2,v:150}],
 psq:['w','squeak!','#ff4d8d',{sz:14}],nurs:['s','heart',3,{a:-Math.PI/2,v:110,g:-40}],bbrk:['w','BIG BREAK ×3','#e63946',{sz:16}],skyscr:['w','BIG BREAK','#e63946',{sz:16}],sky:['b',['b','B','w'],10],lslide:['b',['d','D','s'],16,{vy:20}],bigbang:['x',['b',['d','D','y'],16],['w','BIG BANG','#fb8500',{sz:16}]],
 rfire:['s','bolt',3,{v:200,g:0,T:.5}],droll:['w','ba-dum!','#7a2fe0',{sz:15}],balc:['s','petal',5,{v:120,g:140,sw:6}],hall:['w','HALLMARK','#e09600',{sz:14}],garg:['s','chip',4,{v:150}],zen:['s','chip',4,{v:140}],
 ribbon:['s','ribbon',3,{a:-Math.PI/2,v:140}],pack:['s','paw',3,{a:-Math.PI/2,v:120}],alpha:['s','paw',4,{a:-Math.PI/2,v:130}],bowl:['s','paw',2,{a:-Math.PI/2,v:110}],dbag:['s','paw',2,{a:-Math.PI/2,v:110}],wfed:['s','paw',3,{a:-Math.PI/2,v:120}],feast:['s','paw',3,{a:-Math.PI/2,v:120}],pcount:['b',['y','h'],10],treats:['s','heart',2,{a:-Math.PI/2,v:100,g:-30}],collar:['s','paw',2,{a:-Math.PI/2,v:110}],
 alch:['s','gold',3,{v:140}],phil:['s','gold',4,{v:150}],leaf:['s','gold',4,{v:120}],gberry:['s','gold',3,{v:130}],vintage:['b',['y','Y','h'],10],keep:['b',['y','Y','h'],10],heir:['b',['y','Y','h'],14],
 hoard:['s','crumb',4,{v:110}],snack:['s','crumb',5,{v:120}],bite:['s','crumb',3,{v:100}],crumbs:['s','crumb',4,{v:100}],pip:['s','crumb',3,{v:100}],compost:['b',['N','n','G'],10],volcano:['s','flame',4,{a:-Math.PI/2,v:150,g:200}],boom:['b',['o','y','r'],12],
 trick:['s','arrow',1,{a:-Math.PI/2,v:160,g:0,T:.6}],ricochet:['s','arrow',2,{v:180,g:0,T:.5}],pinball:['b',['b','w','m'],12],lob:['s','arrow',1,{a:-Math.PI/2,v:150,g:0,T:.5}],cpult:['s','arrow',2,{v:170,g:0,T:.5}],curve:['s','arrow',1,{v:150,g:0,T:.5}],
 graft:['s','vine',3,{a:-Math.PI/2,v:110}],orch:['s','leaf',3,{a:-Math.PI/2,v:110,g:120,sw:5}],medley:['s','note',3,{a:-Math.PI/2,v:100,g:-40,sw:5}],fsalad:['s','berry',3,{v:150}],carnival:['x',['s','card',3,{v:150}],['b',['r','y','b','g','m'],12]],masq:['s','card',2,{v:130}],joker:['s','card',2,{v:130}],wcard:['s','card',2,{v:130}],fdeck:['s','card',4,{v:150}],
 juggle:['s','bolt',2,{a:-Math.PI/2,v:150}],dynamo:['s','bolt',2,{a:-Math.PI/2,v:150}],jstart:['s','bolt',3,{a:-Math.PI/2,v:170}],tremor:['b',['d','N','n'],10,{vy:20}],recyc:['s','bolt',2,{a:-Math.PI/2,v:150}],wshop:['s','bolt',2,{a:-Math.PI/2,v:150}],battery:['s','bolt',1,{a:-Math.PI/2,v:130}],
 horn:['s','berry',4,{a:-Math.PI/2,v:170}],bag:['s','drop',3,{a:-Math.PI/2,v:120}],spark:['s','bolt',3,{a:-Math.PI/2,v:160}],shortf:['b',['o','y','r'],10],bbomb:['s','petal',5,{v:150,g:120,sw:6}],zbomb:['b',['y','o'],12],cblast:['b',['o','r','y'],10],cluster:['b',['o','r','y'],14],shrap:['b',['d','s'],10],
 limbo:['w','LIMBO ×3','#7a2fe0',{sz:15}],stow:['b',['N','n','y'],10],flag:['b',['w','s'],10],grain:['s','gold',6,{v:160}],nova:['b',['y','h','w','o'],20],phoenix:['s','flame',6,{a:-Math.PI/2,v:180,g:-80}],net:['b',['t','w'],12],lady:null};
function fxFl(A,id,x,y){const r=FXFL[id];if(!r)return;const run=rc=>{const[k,...a]=rc;if(k==='x'){for(const q of a)run(q);return;}if(k==='s')fxSpray(A,x,y,a[0],a[1],a[2]||{});else if(k==='w'){A.wds=(A.wds||[]).filter(q=>A.t-q<.5);const n=A.wds.length;A.wds.push(A.t);fxWd(A,Math.max(A.g.L+60,Math.min(A.g.R-60,x)),Math.max(70,y-96*A.g.K-n*24*A.g.K),a[0],a[1],Object.assign({vy:-18},a[2]||{}));}else if(k==='r')fxRing(A,x,y,a[0],a[1]*A.g.K,a[2]||{});else if(k==='b'){const o=a[2]||{};A.burst(x,y,a[0],a[1],{v:o.v||150,vy:o.vy==null?-60:o.vy,g:o.g,T:o.T||.6});}};run(r);}

/* ---------- charm scenes, batch 5 (v1.82): passives you could not see before ---------- */
Object.assign(FXD,{
garg:`
..k.......k..
.kdk.....kdk.
.kddkkkkkddk.
.kdddddddddk.
kddkwkdddkwkk
kdddddddddddk
.kddkkkkkddk.
..kdddddddk..
.kDkdddddkDk.
kDDkdddddkDDk
kDk.kdddk.kDk
.k.kdkdkdk.k.
...kkk.kkk...`});
Object.assign(FXS,{
 /* Limbo: a bamboo limbo bar on two posts sits just above the line it lowered; every fruit that drops under it makes it wobble, and a merge it scores on sets it bouncing */
 limbo:{tick(s,g,dt){if(s.wb>0)s.wb-=dt;},
  front(c,g,s,t){const P=g.P,by=fq(g.top-4*P,P),a=Math.min(1,s.p),w=s.wb>0?Math.sin((1-s.wb/.6)*Math.PI*4)*(s.wb/.6)*3:0;c.save();c.globalAlpha=a;
   for(const sd of[-1,1]){const px=sd<0?g.L+P:g.R-3*P;fxR(c,px-P,by-5*P,P,'k',4,9);fxR(c,px,by-4*P,P,'N',2,8);fxR(c,px,by-4*P,P,'n',1,8);fxR(c,px-P,by-7*P,P,'k',4,2);fxR(c,px,by-7*P,P,'o',2,1);fxR(c,px,by-8*P,P,'y',2,1);}
   for(let x=g.L+3*P,i=0;x<g.R-3*P;x+=P,i++){const u=(x-g.L)/(g.R-g.L),sag=Math.round(Math.sin(u*Math.PI)*(1+w)+(s.wx!=null?Math.max(0,2-Math.abs(x-s.wx)/(20*g.K))*w*.5:0)),y=by+sag*P;fxR(c,x,y-2*P,P,'k');fxR(c,x,y+P,P,'k');fxR(c,x,y-P,P,i%7===0?'G':'l');fxR(c,x,y,P,i%7===0?'G':'g');}c.restore();},
  ev(s,n,o){if(n==='drop'){s.wb=.6;s.wx=o.x;}},
  hit(s,o,A,g){s.wb=.6;s.wx=o.x;A.burst(o.x,g.top-4*g.P,['l','g','y'],8,{v:110,vy:-80,T:.5});}},
 /* Metronome: a metronome on the rim; while a combo is alive its arm swings, the weight sliding down the arm as the combo window runs out, and it rings when a combo merge lands */
 metro:{x(g){return fq(fxRX('metro',.33,30,g),fxBP(g));},tick(s,g,dt){s.ph=(s.ph||0)+dt*(s.on?7:2*(s.sw||0));s.sw=fxA(s.sw||0,s.on?1:0,dt*(s.on?6:1.5));if(s.rg>0)s.rg-=dt;},
  front(c,g,s,t){const P=fxBP(g),x=FXS.metro.x(g),rim=fxRim(g),R=fxPt(c,x,rim,P);c.save();c.globalAlpha=s.p;for(let j=0;j<12;j++){const hw=Math.round(1.5+j*.33);for(let i=-hw;i<=hw;i++)R(i,-12+j,i===-hw||i===hw||j===0?'k':Math.abs(i)<=1&&j>1&&j<10?'c':i<0?'n':'N');}R(-5,-1,'k',11,1);R(-4,-2,'N',9,1);
   const a=RMO?0:Math.round(Math.sin(s.ph)*4)/4*.55*s.sw,cx=x,cy=rim-3*P,L2=12;for(let k=0;k<=L2;k++){const px=cx+Math.round(Math.sin(a)*k)*P,py=cy-Math.round(Math.cos(a)*k)*P;fxR(c,px,py,P,k===L2?'k':'d');}const wk=Math.round(4+(s.on?(1-(s.l.u||0))*6:6)),wx=cx+Math.round(Math.sin(a)*wk)*P,wy=cy-Math.round(Math.cos(a)*wk)*P;fxR(c,wx-P,wy-P,P,'k',3,3);fxR(c,wx,wy,P,s.rg>0?'w':'y');
   if(s.rg>0){fxStar(c,x+5*P,rim-15*P,g.P,2,'y');}c.restore();},
  hit(s){s.rg=.3;}},
 /* Safety Net: a rope net is strung across both top corners of the jar. When it saves you it flashes gold, snaps and falls away */
 net:{back(c,g,s,t){const P=g.P,a=s.p;c.save();c.globalAlpha=a*.85;for(const sd of[-1,1])for(let j=0;j<22;j++){const w=22-j;for(let i=0;i<w;i++){const k1=(i+j)%4===0,k2=(i-j+80)%4===0;if(!k1&&!k2)continue;const x=sd<0?g.L+i*P:g.R-(i+1)*P,y=g.top+(j+1)*P;fxR(c,x,y,P,k1&&k2?'k':i===w-1?'N':'n');}}c.restore();},
  ev(s,n,o,A,g){if(n!=='save'||o.k!=='net')return;const P=g.P;for(const sd of[-1,1])for(let k=0;k<26;k++){const x=sd<0?g.L+Math.random()*14*P:g.R-Math.random()*14*P,y=g.top+Math.random()*14*P;A.add({k:'sq',x,y,vx:(Math.random()-.5)*60,vy:-40-Math.random()*60,g:500,T:1+Math.random()*.4,col:k%3?'N':'y',fa:.5});}}},
 /* Phoenix: when it saves you a great phoenix bursts up out of the jar in flames, wings beating, and flies away over the top */
 phoenix:{ev(s,n,o,A,g){if(n!=='save'||o.k!=='phoenix')return;const x0=(g.L+g.R)/2,y0=o.cut||g.top+(g.bot-g.top)*.5,T1=2;A.add({k:'fn',x:x0,y:y0,T:T1,fa:.85,d:(c,q,g)=>{const P=fxBP(g),u=q.t/T1,e=u*u,x=x0+Math.sin(u*5)*20,y=y0-(y0+60)*e,up=fst(q.t,8)%2,R=(i,j,col)=>fxR(c,x+i*P,y+j*P,P,col);
    for(const sd of[-1,1])for(let k=1;k<=17;k++){const ty=up?-Math.round(k*.75):Math.round(k*.2)-1,th=Math.max(2,8-Math.floor(k*.42));R(sd*k,ty-1,'k');for(let w=0;w<th;w++)R(sd*k,ty+w,w===0?(k>12?'h':'y'):k>13?'y':k>7?(w<2?'y':'o'):(w<3?'o':'r'));R(sd*k,ty+th,(k+fst(q.t,10))%3?'r':'k');if(k%3===0&&th>2)R(sd*k,ty+th+1,'o');}
    for(let j=-3;j<=5;j++)for(let i=-3;i<=3;i++)if(i*i*1.4+j*j<=12)R(i,j,(i*i*1.4+j*j>8)?'k':j<0?'y':'o');for(let j=-7;j<=-4;j++)for(let i=-2;i<=2;i++)if(i*i+(j+5.5)*(j+5.5)<=3.5)R(i,j,(i*i+(j+5.5)*(j+5.5)>2)?'k':'y');R(-1,-6,'k');R(1,-6,'k');R(0,-4,'o');R(0,-3,'Y');for(const[i,j]of[[0,-8],[-1,-9],[1,-9],[0,-10]])R(i,j,fst(q.t,8)%2?'r':'o');
    for(let k=0;k<3;k++)for(let j=5;j<11+k*2;j++)R(k-1+Math.round(Math.sin(q.t*12+j+k)*.6),j,j>8+k?'r':'o');}});for(let k=0;k<30;k++)A.add({k:'sq',x:x0+(Math.random()-.5)*120,y:y0,vx:(Math.random()-.5)*80,vy:-80-Math.random()*160,g:-40,T:1.2+Math.random(),col:['y','o','r'][k%3],s:k%3?1:2,fa:.4});A.add({k:'fn',x:x0,y:y0+50,T:1.4,vy:-10,fa:.6,d:(c,q,g)=>{for(const[dx,dy]of[[-2,0],[2,0],[0,-2],[0,2]])T(c,'REBORN',q.x+dx,q.y+dy,24,'#2a1a3a','center',FD);T(c,'REBORN',q.x,q.y,24,'#fb8500','center',FD);}});}},
 /* Gargoyle: a stone gargoyle crouches on the rim. While there are rocks in the jar its eyes glow red; a merge it scores on, it flexes and stone chips fly */
 garg:{x(g){return fq(fxRX('garg',.06,44,g),fxBP(g));},tick(s,g,dt){if(s.fl>0)s.fl-=dt;},
  front(c,g,s,t){const P=fxBP(g),x=FXS.garg.x(g),rim=fxRim(g),n=s.l.n||0,fl=s.fl>0;c.save();c.globalAlpha=s.p;fxS(c,'garg',x,rim-(fl?P:0),P,{fl:1});const ey=rim-(fl?P:0)-9*P,lit=n>0,bl=(t%3.4)<.12;for(const ex of[-3,2]){fxR(c,x+ex*P,ey,P,bl?'d':lit?(fst(t,3)%2||fl?'r':'R'):'D');}if(lit&&!RMO&&fst(t,2)%2){c.globalAlpha=s.p*.4;fxR(c,x-4*P,ey,P,'q');fxR(c,x+3*P,ey,P,'q');}c.restore();},
  hit(s,o,A,g){s.fl=.3;const x=FXS.garg.x(g),y=fxRim(g)-6*fxBP(g);A.burst(x,y,['d','D','s'],8,{v:120,T:.5});}},
 /* Horseshoe: a lucky horseshoe hangs on a nail in the top corner of the glass; every time one of your chance charms comes good it flashes gold */
 shoe:{tick(s,g,dt){if(s.gl>0)s.gl-=dt;},
  back(c,g,s,t){const P=g.P,x=fq(g.L+8*P,P),y=fq(g.top+8*P,P),G=s.gl>0,R=fxPt(c,x,y,P);c.save();c.globalAlpha=s.p;R(0,-6,'d');R(0,-7,'k');
   const pts=[];for(let a=0;a<=Math.PI;a+=.18)pts.push([Math.round(Math.cos(a)*5),Math.round(Math.sin(a)*5)]);const S2=new Set();for(let w=0;w<2;w++)for(const[i,j]of pts)S2.add(i+','+(j+w));for(const k2 of S2){const[i,j]=k2.split(',').map(Number);for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])if(!S2.has((i+a)+','+(j+b)))R(i+a,j+b-2,'k');}for(let j=-3;j<0;j++){for(const sd of[-5,4]){R(sd,j-2,'k');R(sd+1,j-2,'k');}}for(const k2 of S2){const[i,j]=k2.split(',').map(Number);R(i,j-2,G?(j>3?'y':'h'):(j>3?'d':'s'));}for(const sd of[-5,4])for(let j=-3;j<0;j++)R(sd+(sd<0?0:1),j-2,G?'y':'s');for(const[i,j]of[[-4,1],[4,1],[-2,3],[2,3]])R(i,j-2,'k');if(G)fxStar(c,x+5*P,y-4*P,P,2,'y');c.restore();}},
 /* Ballast: heavy fruit (Apples and up) fall with speed lines streaming off them */
 ball:{front(c,g,s,t){const P=g.P;c.save();c.globalAlpha=s.p*.8;for(const f of s.l.f||[]){for(const k of[-1,0,1]){const x=fq(f.x+k*f.r*.45,P),len=3+((Math.round(f.x/P)+k+fst(t,12))%3);for(let j=0;j<len;j++)fxR(c,x,f.y-f.r-(3+j+Math.abs(k))*P,P,j===len-1?'s':'d');}}c.restore();}},
 /* Fireworks and Volcano: after every Boom, rockets shoot up out of the blast and burst into stars in the sky (Volcano throws lava instead) */
 boom:{ev(s,n,o,A,g){if(n!=='boom'||!s.l.p||o.dp)return;if(s.l.sh){for(let i=0;i<10;i++){const a=i/10*Math.PI*2+Math.random()*.3,v=260+Math.random()*80;A.add({k:'fn',x:o.x,y:o.y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,dr:2.2,T:.45,fa:.5,d:(c,q,g,t,x)=>{const P=g.P;fxR(c,x-P,q.y-P,P,'k',3,3);fxR(c,x,q.y,P,i%2?'s':'d');fxR(c,x-q.vx*.012,q.y-q.vy*.012,P,'d');}});}}if(!s.l.fw)return;const vol=!!(A.S.boom&&A.S.boom.l&&0),P=g.P,cols=[['r','y','R'],['b','B','w'],['g','G','l'],['m','V','p'],['o','y','r']];for(let k=0;k<2;k++){const tx=o.x+(k?1:-1)*(30+Math.random()*40),ty=fxRim(g)-50-Math.random()*70,T1=.55,cc=cols[Math.floor(Math.random()*cols.length)],x0=o.x,y0=o.y;
    A.add({k:'fn',x:x0,y:y0,T:T1,dl:k*.15,fa:1,d:(c,q,g)=>{const u=Math.min(1,(q.t-k*.15)/T1),e=1-(1-u)*(1-u),x=x0+(tx-x0)*e,y=y0+(ty-y0)*e;fxR(c,x-P,y-P,g.P,'k',3,3);fxR(c,x,y,g.P,'w');for(let j=1;j<6;j++)fxR(c,x-(tx-x0)*.03*j,y+j*P,g.P,j<3?'y':'o');},end:A2=>{for(let i=0;i<22;i++){const a=i/22*Math.PI*2,v=150+Math.random()*40;A2.add({k:'sq',x:tx,y:ty,vx:Math.cos(a)*v,vy:Math.sin(a)*v,g:110,dr:1.6,T:1,col:cc[i%3],s:i%2?2:1,fa:.5});}for(let i=0;i<10;i++){const a=i/10*Math.PI*2+.3;A2.add({k:'star',x:tx+Math.cos(a)*48,y:ty+Math.sin(a)*48,T:.35,dl:.35+Math.random()*.2,col:cc[i%2]});}A2.add({k:'star',x:tx,y:ty,T:.4,col:'y'});}});}}},
 /* White Flag: on a boss jar a white flag waves on a pole at the right end of the rim: the boss never reaches phase 2 */
 flag:{x(g){return fq(fxRX('wflag',.95,30,g),g.P);},front(c,g,s,t){if(s.o<=0)return;const P=g.P,px=FXS.flag.x(g)+6*P,base=fxRim(g),ph=24,fh=8,fw=12,wv=fst(t,7);c.save();c.globalAlpha=s.o;fxR(c,px-P,base-P,P,'k',3,1);for(let j=1;j<ph;j++){fxR(c,px-P,base-(j+1)*P,P,'k');fxR(c,px,base-(j+1)*P,P,'d');fxR(c,px+P,base-(j+1)*P,P,'k');}fxR(c,px-P,base-(ph+2)*P,P,'k',3,2);fxR(c,px,base-(ph+1)*P,P,'y');
   const fy=base-ph*P;for(let ci=0;ci<fw;ci++){const dy=Math.round(Math.sin(ci*.7-wv*.9)*(ci/fw*1.4+.2));for(let rj=-1;rj<=fh;rj++){const x=px-(ci+2)*P,y=fy+(rj+dy)*P;fxR(c,x,y,P,rj<0||rj===fh||ci===fw-1?'k':(ci+rj+wv)%5===0?'s':'w');}}c.restore();}}});


Object.assign(FXD,{
stwB:`
..kkkkkkkk..
.kNnnnnnnNk.
.kkkkkkkkkk.
kNnNnnnnNnNk
kNnNnnnnNnNk
kddddddddddk
kNnNnnnnNnNk
kNnNnnnnNnNk
kddddddddddk
.kNnNnnNnNk.
..kkkkkkkk..`});
Object.assign(FXS,{
 /* Curveball, Catapult and Lob: a thrown fruit leaves a trail in the air: dotted pink when it curves towards its match, white speed streaks when it is a Lob */
 curve:{tick(s,g,dt){s.tr=s.tr||new Map();const P=g.P,live=new Set();for(const q of s.l.f||[]){live.add(q.f);let a=s.tr.get(q.f);if(!a){a=[];s.tr.set(q.f,a);}const l=a[a.length-1];if(!l||Math.hypot(l[0]-q.x,l[1]-q.y)>3*P)a.push([q.x,q.y]);if(a.length>14)a.shift();}for(const k of[...s.tr.keys()]){if(!live.has(k)){const a=s.tr.get(k);a.shift();if(!a.length)s.tr.delete(k);}}},
  front(c,g,s,t){if(!s.tr)return;const P=g.P;c.save();c.globalAlpha=s.p;for(const a of s.tr.values())a.forEach(([x,y],i)=>{const u=i/a.length;if(s.l.cv){if(i%2)return;fxR(c,x-P,y-P,P,'k',3,3);fxR(c,x,y,P,u>.6?'m':'p');}else{c.globalAlpha=s.p*Math.ceil(u*3)/3;fxR(c,x,y,P,'w',2,1);fxR(c,x,y+P,P,'s',2,1);c.globalAlpha=s.p;}});c.restore();}},
 /* Quick Hands: every drop leaves speed lines where it left your hand */
 quick:{ev(s,n,o,A,g){if(n!=='drop'||!s.l.p)return;const P=g.P;for(let k=0;k<3;k++){const y=g.top-(14+k*8)*g.K,dir=k%2?1:-1;A.add({k:'fn',x:o.x,y,T:.3,fa:.3,d:(c,q,g)=>{const u=q.t/.3,P=g.P;for(let i=0;i<4;i++)fxR(c,q.x+dir*(10+i*3+u*18)*g.K,q.y,P,i<2?'d':'s');}});}}},
 /* Gold Plating and Fort Knox: gold fruit up by the line shine with a golden shield ring, safe from overflow */
 gplate:{front(c,g,s,t){const P=g.P;c.save();c.globalAlpha=s.p;for(const f of s.l.f||[]){const r=Math.round(f.r/P)+2,n=Math.max(8,r*3);for(let k=0;k<n;k++){const a=k/n*Math.PI*2+(RMO?0:fst(t,6)*.12);if(k%3===0)continue;fxR(c,f.x+Math.round(Math.cos(a)*r)*P,f.y+Math.round(Math.sin(a)*r)*P,P,k%3===1?'y':'Y');}fxStar(c,f.x+f.r*.6,f.y-f.r*.7,P,fst(t+f.x,3)%3?1:2,'y');}c.restore();}},
 /* Stowaway: a barrel stands on the rim with a little mouse hiding in it; every merge where it copies your rightmost charm, the mouse pops out and waves */
 stow:{x(g){return fq(fxRX('stow',.9,34,g),fxBP(g));},tick(s,g,dt){if(s.up>0)s.up-=dt;},
  front(c,g,s,t){const P=fxBP(g),x=FXS.stow.x(g),rim=fxRim(g),up=s.up>0?Math.round(Math.sin((1-s.up/.7)*Math.PI)*5):((t%4.2)<.5?1:0),R=fxPt(c,x,rim-11*P,P);c.save();c.globalAlpha=s.p;
   if(up>0){const y=-up;R(-2,y-1,'k',5,4);R(-1,y,'s',3,3);R(-2,y-2,'k');R(2,y-2,'k');R(-2,y-1,'p');R(2,y-1,'p');R(-1,y+1,'k');R(1,y+1,'k');R(0,y+2,'m');if(s.up>0&&fst(t,6)%2){R(3,y-1,'k');R(3,y,'s');}}
   fxS(c,'stwB',x,rim,P);c.restore();},
  hit(s){s.up=.7;}}});


Object.assign(FXD,{pigA:`
....kkkkkk......
...kppppppkkk...
..kppkkppppppk..
.kppppppppppppk.
kppkpppppppppmkk
kppppppppppppmmk
kppppppppppppmmk
.kpppppppppppmk.
..kpkkppppkkpk..
..kk..kkkk..kk..`});
Object.assign(FXS,{
 /* Piggy Bank and Golden Goose: when you clear a jar a piggy bank trots onto the rim and the coins it pays you drop into its slot one by one */
 piggy:{x(g){return fq(fxRX('piggy',.66,64,g),fxBP(g));},tick(s,g,dt,A){if(!s.l.done){s.dt=null;return;}if(s.dt==null){s.dt=0;s.dn=0;}s.dt+=dt;const n=s.l.n||3;if(s.dt>.5+s.dn*.32&&s.dn<n){const P=fxBP(g),x=FXS.piggy.x(g),y0=fxRim(g)-110,ty=fxRim(g)-10*P,k=s.dn++;A.add({k:'fn',x,y:y0,T:.38,fa:1,d:(c,q,g)=>{const u=q.t/.38,y=y0+(ty-y0)*u*u;fxSpD(c,x,y,g.P,FXSP.coin);},end:A2=>{s.wg=.2;A2.add({k:'star',x,y:ty,T:.3,col:'y'});}});}if(s.wg>0)s.wg-=dt;},
  front(c,g,s,t){if(!s.l.done||s.dt==null)return;const P=fxBP(g),x=FXS.piggy.x(g),u=Math.min(1,s.dt/.4),y=fxRim(g)-Math.round((1-u)*(1-u)*30)*P;c.save();c.globalAlpha=s.p;fxS(c,'pigA',x+(s.wg>0?(fst(s.wg,20)%2?P:-P):0),y,P);c.restore();}},
 /* Melon Fever and Melon Mania: a thermometer down the right wall of the jar; the red rises with every Mult it has grown and steams when a big fruit makes it jump */
 fever:{tick(s,g,dt,A){const v=s.l.v||0;if(s.v0!=null&&v>s.v0){s.st=.8;const P=g.P;for(let k=0;k<6;k++)A.add({k:'sq',x:g.R-6*P+(Math.random()-.5)*6*P,y:g.top+4*P,vy:-40-Math.random()*40,g:-30,T:1,col:k%2?'s':'w',s:2,fa:.3,ly:0});}s.v0=v;if(s.st>0)s.st-=dt;if(s.pl>0)s.pl-=dt;},
  back(c,g,s,t){const P=g.P,x=fq(g.R-7*P,P),top=fq(g.top+6*P,P),len=Math.max(18,Math.round((g.bot-g.top)/P*.42)),fill=Math.min(1,(s.l.v||0)/18),hot=s.st>0,R=fxPt(c,x,top,P);c.save();c.globalAlpha=s.p;
   R(-2,-1,'k',5,len+2);R(-1,0,'w',3,len);for(let j=0;j<len;j++){if(j%5===0)R(2,j,'k');}const fh=Math.round(fill*(len-2));for(let j=len-fh;j<len;j++)R(0,j,hot&&fst(t,10)%2?'o':'r');R(-1,0,'i',1,len);
   const by=len+2,pl=s.pl>0?1:0;for(let j=-3-pl;j<=3+pl;j++)for(let i=-3-pl;i<=3+pl;i++){const d=i*i+j*j;if(d>(3+pl)*(3+pl)+1)continue;R(i,by+j,d>(2+pl)*(2+pl)+1?'k':i<0&&j<0?'q':'r');}c.restore();},
  hit(s){s.pl=.25;}},
 /* Cornucopia: a horn of plenty lies on the rim spilling fruit; every merge that gives you a drop back, a fruit tumbles out of it and a drop flies to your drops bar */
 horn:{x(g){return fq(fxRX('horn',.7,64,g),fxBP(g));},
  front(c,g,s,t){const P=fxBP(g),x=FXS.horn.x(g),rim=fxRim(g),R=fxPt(c,x,rim,P);c.save();c.globalAlpha=s.p;const cells=new Map();
   for(let k=0;k<=20;k++){const u=k/20,cx=-9+13*u,cy=-11+9*u-Math.sin(u*Math.PI)*2.5,r=.9+u*4;for(let j=Math.floor(cy-r);j<=Math.ceil(cy+r);j++)for(let i=Math.floor(cx-r);i<=Math.ceil(cx+r);i++)if((i-cx)**2+(j-cy)**2<=r*r)cells.set(i+','+j,u);}
   for(const[k2]of cells){const[i,j]=k2.split(',').map(Number);for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])if(!cells.has((i+a)+','+(j+b)))R(i+a,j+b,'k');}
   for(const[k2,u]of cells){const[i,j]=k2.split(',').map(Number);const up=!cells.has(i+','+(j-1));R(i,j,u>.95?'N':Math.floor(u*22)%3===0?'N':up?'E':(i+j)%2?'n':'e');}
   for(let j=-6;j<=-1;j++)for(let i=3;i<=5;i++)if((i-4)**2*2+(j+3.5)**2<=7)R(i,j,'N');
   const fr2=[[6,-3,4],[9,-2,1],[7,-1,0],[10,-1,2],[5,-6,3]];for(const[i,j,l]of fr2)if(typeof drawFruit==='function')drawFruit(c,x+i*P,rim+j*P,P*1.7,l);c.restore();},
  ev(s,n,o,A,g){if(n!=='hornd'||!s.l.p)return;const P=fxBP(g),x=FXS.horn.x(g)+8*P,y=fxRim(g)-4*P,l=Math.floor(Math.random()*4);A.add({k:'fn',x,y,vx:-30+Math.random()*60,vy:-160,g:600,T:.9,fa:.7,fy:fxRim(g)+40,d:(c,q,g,t,x2)=>{if(typeof drawFruit==='function')drawFruit(c,x2,q.y,P*1.6,l);}});fxToks(A,['d'],x,y+20);}},
 /* Golden Rain: when you use it, gold rains down over the whole jar */
 grain:{ev(s,n,o,A,g){if(n!=='act'||o.id!=='grain')return;const P=g.P;for(let k=0;k<60;k++)A.add({k:'fn',x:g.L+Math.random()*(g.R-g.L),y:g.top-120-Math.random()*80,vy:180+Math.random()*120,T:1.6,dl:Math.random()*.9,fa:.7,fy:g.bot,d:(c,q,g,t,x2)=>{k%3?(fxR(c,x2,q.y,g.P,'y'),fxR(c,x2,q.y-g.P,g.P,'Y')):fxSpD(c,x2,q.y,g.P,FXSP.coin);}});fxWd(A,(g.L+g.R)/2,g.top+60,'GOLDEN RAIN','#e09600',{sz:22,vy:-10,T:1.4});}},
 /* Supernova: when you use it, a star explodes in the middle of the jar in a white flash and a ring of fire */
 nova:{ev(s,n,o,A,g){if(n!=='act'||o.id!=='nova')return;const x=(g.L+g.R)/2,y=g.top+(g.bot-g.top)*.45;A.add({k:'fn',x,y,T:.25,fa:0,d:(c,q,g)=>{c.globalAlpha*=.6*(1-q.t/.25);c.fillStyle='#fff';c.fillRect(g.L,g.top-40,g.R-g.L,g.bot-g.top+40);}});for(let i=0;i<3;i++)fxRing(A,x,y,['y','o','r'][i],(140+i*30)*g.K,{dl:i*.08,T:.6});A.burst(x,y,['y','w','o','r'],36,{v:320,T:.9});A.add({k:'star',x,y,T:.5,col:'y'});fxWd(A,x,y-60,'SUPERNOVA','#fb8500',{sz:24,vy:-10,T:1.3});}}});

/* v1.82.1 (the user's note: many charms already had a merge effect, and cards crowded the jar). FXJFX = charms the engine's jfx already gives a merge effect of their own:
   they get no card. FXQ = charms that fire on nearly every merge: no card either; they fold into the merge itself as one ring around the new fruit, an arc per charm in its
   own colour (fxAura), and Honey Pot glazes the fruit with drips. Cards are left for moments: a chance coming good, a payout, a count landing. */
const FXJFX=new Set(['bull','sharp','lucky','fourleaf','snake','zest','marm','picker','jam','pit','cider','mill','medley','tiki','crit','heavy','mania','wall','ivy','low','still','sprout','chain','wildfire','encore','headline','tidy','trick','clutch','early','wire','cresc','bonfire','brink']);
const FXQ=new Set(['honey','hoard','snack','wallet','ribbon','pack','alpha','sky','skyscr','nurs','play','orch','graft','abacus','poly','bowl','dbag','pcount','hcomb','vintage','keep','heir','spender','cint','hfund','gstd','compost','volcano','pip','crumbs','bite','zen','ftree','hall','foot','wfed','feast','smoothie','juicer']);
function fxAura(A,x,y,r,ids){if(ids.includes('honey')||ids.includes('smoothie'))fxHoney(A,x,y,r);for(const id of ids)if(FXM[id])FXM[id](A,x,y,r);}
/* Honey Pot (v1.82.3): honey pours over the top of the new fruit, oozes down its sides in thick drips with round bulbs, and one drop falls and splats */
function fxHoney(A,x,y,r){const T1=1.7,R0=Math.max(5,Math.round(r/A.g.P)),nd=R0<8?2:3,DR=nd===2?[[-.35,.7,0],[.3,.45,.12]]:[[-.45,.55,0],[.05,.9,.1],[.45,.42,.2]];
 A.add({k:'fn',x,y,T:T1,fa:.8,d:(c,q,g)=>{const P=g.P,t=q.t,R=Math.round(r/P),pour=Math.min(1,Math.max(0,(t-.12)/.3)),cy=Math.round(-R+pour*R*.85),cells=new Map(),fl=t<.45;
   if(t<.42){const sy=-R-14,ey=t<.12?-R-14+Math.round(t/.12*14):cy;for(let j=sy;j<=ey;j++){cells.set('0,'+j,4);if(j>sy+4)cells.set('1,'+j,4);}}
   for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){if(i*i+j*j>R*R)continue;const edge=cy+Math.round(Math.sin(i*.7+t*2)*1.1+(Math.abs(i)<R*.3?1:0));if(j<=edge&&pour>0)cells.set(i+','+j,1);}
   if(pour>=1)DR.forEach(([dx,L,d0],k)=>{const i0=Math.round(dx*R),top=cy+Math.round(Math.sin(i0*.7+t*2)*1.1)+1,u=Math.min(1,Math.max(0,(t-.42-d0)/.75)),len=Math.round(u*u*(3-2*u)*L*R)+1,sw=Math.round(Math.sin(t*3+k)*.6);
     for(let j=0;j<len;j++){const w=j<len*.75?2:1,xo=j>len*.6?sw:0;for(let ww=0;ww<w;ww++)cells.set((i0+ww+xo)+','+(top+j),2);}const bx=i0+(len>2?sw:0),by=top+len;cells.set(bx+','+by,3);cells.set((bx+1)+','+by,3);cells.set(bx+','+(by+1),3);cells.set((bx+1)+','+(by+1),5);});
   c.save();c.globalAlpha=t>T1-.3?Math.ceil((T1-t)/.1)/3:1;for(const[k2,v]of cells){const[i,j]=k2.split(',').map(Number);const od=v===1?[[0,1]]:v===3||v===5?[[1,0],[-1,0],[0,1]]:[];for(const[a,b]of od)if(!cells.has((i+a)+','+(j+b)))fxR(c,x+(i+a)*P,y+(j+b)*P,P,'N');}
   c.globalAlpha*=.92;for(const[k2,v]of cells){const[i,j]=k2.split(',').map(Number),dn=!cells.has(i+','+(j+1));const lf=!cells.has((i-1)+','+j);fxR(c,x+i*P,y+j*P,P,v===4?'Y':v===5?'h':v===3?'o':v===2?(lf?'y':'Y'):dn?'o':j<cy-R*.5?'y':'Y');}
   c.globalAlpha=t>T1-.3?Math.ceil((T1-t)/.1)/3:1;if(pour>.5){const hx=Math.round(-R*.5),hy=Math.round(cy-R*.45);for(const[a,b]of[[0,0],[1,-1],[2,-1],[3,-2]])fxR(c,x+(hx+a)*P,y+(hy+b)*P,P,'h');fxR(c,x+Math.round(R*.35)*P,y+(cy-1)*P,P,'h');}c.restore();}});
 const k=nd===2?0:1,[dx,L,d0]=DR[k],T2=.5,dl=1.25+d0;A.add({k:'fn',x,y,T:T2,dl,fa:.75,d:(c,q,g)=>{const P=g.P,R=Math.round(r/P),u=(q.t-dl)/T2,x0=x+Math.round(dx*R)*P,y0=y+(Math.round(-R*.15)+Math.round(L*R)+2)*P,yy=y0+u*u*110*g.K;if(u<.8)fxSpD(c,x0,yy,P,FXSP.drop);else for(const kk of[-2,-1,0,1,2])fxR(c,x0+kk*P,yy+(Math.abs(kk)===1?0:P),P,Math.abs(kk)===2?'o':'Y');}});}


Object.assign(FXS,{
 /* gold in flight (v1.82.1): any gold fruit falling (Gold Leaf's first fruit, Prospector's, Golden Hour's, a Midas throw) trails gold flakes */
 gtrail:{front(c,g,s,t){const P=g.P;for(const f of s.l.f||[]){for(let k=0;k<5;k++){const j=fhs(Math.round(f.y/P)+k,k),x=f.x+(j-.5)*f.r*1.4,y=f.y-f.r-(2+k*3+fst(t,12)%3)*P;c.save();c.globalAlpha=s.p*(1-k/6);fxR(c,x,y,P,k%2?'y':'Y');if(k===1)fxStar(c,x,y-2*P,P,1,'y');c.restore();}}}}});

/* merge effects for the charms that work on nearly every merge (v1.83, the user's bar: each one its own crafted, detailed animation that shows what the charm counts;
   no icons in the jar, nothing that moves a fruit). FXM[id](A, x, y, r) runs once per merge the charm scored on; A.F = the fruit in the jar this frame, A.SD = run counts. */
/* fxAd: like A.add, but T is the time after the delay dl */
const fxAd=(A,q)=>A.add(Object.assign(q,{T:q.T+(q.dl||0)}));
const fxFrMine=(A,x,y)=>A.F.filter(f=>Math.hypot(f.x-x,f.y-y)>4);
const fxFC=l=>(typeof FRUIT!=='undefined'&&FRUIT[l]&&FRUIT[l][0])||FXP.r;
/* an outlined cell blob from a set of cells ("i,j" -> colour) at grid P */
function fxBlob(c,x,y,P,cells){for(const k2 of cells.keys()){const[i,j]=k2.split(',').map(Number);for(const[a,b]of[[1,0],[-1,0],[0,1],[0,-1]])if(!cells.has((i+a)+','+(j+b)))fxR(c,x+(i+a)*P,y+(j+b)*P,P,'k');}for(const[k2,col]of cells){const[i,j]=k2.split(',').map(Number);fxR(c,x+i*P,y+j*P,P,col);}}
const FXHT=[[-2,-2,'m'],[-1,-2,'m'],[1,-2,'m'],[2,-2,'m'],[-3,-1,'m'],[-2,-1,'p'],[-1,-1,'m'],[0,-1,'m'],[1,-1,'m'],[2,-1,'m'],[3,-1,'m'],[-3,0,'m'],[-2,0,'m'],[-1,0,'m'],[0,0,'m'],[1,0,'m'],[2,0,'m'],[3,0,'m'],[-2,1,'m'],[-1,1,'m'],[0,1,'m'],[1,1,'m'],[2,1,'R'],[-1,2,'m'],[0,2,'m'],[1,2,'R'],[0,3,'R']];
const FXM={
 /* Hoarder and Snack Pack: a sack appears over the new fruit and a bit of every fruit in the jar, in its own colour, arcs into it; the sack bulges as it fills, then ties shut */
 hoard(A,x,y,r){const fs=fxFrMine(A,x,y).sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y)).slice(0,18),n=fs.length,sx=x,sy=y-r-26*A.g.K,T0=1.5;let got=0;
  fxAd(A,{k:'fn',x:sx,y:sy,T:T0,fa:.8,d:(c,q,g)=>{const P=g.P,t=q.t,pop=t<.06?.5:t<.12?1.2:1,full=Math.min(1,got/Math.max(1,n)),w=Math.round((5+full*2)*pop),h=Math.round((4+full*2)*pop),tied=t>1.05,cells=new Map(),sq=got&&fst(t,12)%2&&!tied?1:0;
    for(let j=-h;j<=h;j++){const u=(j+h)/(2*h),ww=Math.round(w*(.55+.45*Math.sin(Math.min(1,u*1.25)*Math.PI*.5))+(j>h-2?0:sq));for(let i=-ww;i<=ww;i++){if(j===h&&Math.abs(i)>ww-2)continue;cells.set(i+','+j,(i>ww-2||j>h-2)?'N':(i<-ww+2&&j<h-1&&j>-h+1)?'E':'n');}}
    for(let i=-1;i<=1;i++)cells.set(i+','+(-h-1),'n');const fl=tied?2:3;for(let i=-fl;i<=fl;i++){cells.set(i+','+(-h-2),Math.abs(i)===fl?'N':'n');if(!tied)cells.set(i+','+(-h-3),'E');}for(let i=-2;i<=2;i++)cells.set(i+','+(-h-1),'r');if(tied){cells.set('3,'+(-h),'r');cells.set('4,'+(-h+1),'r');cells.set('-3,'+(-h),'r');}
    fxBlob(c,fq(sx,P),fq(sy,P),P,cells);if(tied&&t<1.2)fxStar(c,sx+(w+1)*P,sy-h*P,P,2,'y');}});
  fs.forEach((f,k)=>{const T1=.5,dl=.12+k*.035,x0=f.x,y0=f.y-f.r*.5,col=fxFC(f.l);fxAd(A,{k:'fn',x:x0,y:y0,T:T1,dl,fa:1,d:(c,q,g)=>{const u=(q.t-dl)/T1,e=u*u,bx=x0+(sx-x0)*e,by=y0+(sy-y0)*e-Math.sin(u*Math.PI)*36*g.K,P=g.P;fxBlob(c,fq(bx,P),fq(by,P),P,new Map([['0,-1',col],['-1,0',col],['0,0',col],['1,0',col],['0,1',col],['-1,-1','w'],['1,1',col],['0,-2','g']]));},end:()=>{got++;}});
   fxAd(A,{k:'fn',x:f.x,y:f.y,T:.25,dl,fa:.3,d:(c,q,g)=>{const P=g.P,R=Math.round(f.r/P);for(let a=-2.6;a<-1.6;a+=.2)fxR(c,f.x+Math.round(Math.cos(a)*(R-1))*P,f.y+Math.round(Math.sin(a)*(R-1))*P,P,'w');}});});},
 /* Nursery and Playground: a heart lifts off every Cherry and Strawberry, beats, and flies into the new fruit, where they join into one big heart that beats and bursts */
 nurs(A,x,y,r){const fs=fxFrMine(A,x,y).filter(f=>f.l<=1).slice(0,10),n=fs.length;if(!n)return;const hx=x,hy=y-r-20*A.g.K;
  fs.forEach((f,k)=>{const x0=f.x,y0=f.y-f.r-6*A.g.K,dl=k*.05,T1=1;fxAd(A,{k:'fn',x:x0,y:y0,T:T1,dl,fa:1,d:(c,q,g)=>{const t=q.t-dl,P=g.P;let bx,by;if(t<.35){bx=x0;by=y0-Math.min(1,t/.2)*8*g.K;}else{const u=Math.min(1,(t-.35)/.5),e=u*u*(3-2*u);bx=x0+(hx-x0)*e;by=y0-8*g.K+(hy-y0+8*g.K)*e-Math.sin(u*Math.PI)*30*g.K;}const big=t<.35&&fst(t,8)%2;fxSpD(c,bx,by,P,big?FXHT:FXHT.filter(([a,b])=>Math.abs(a)<3&&b<3));}});});
  const tA=.85+n*.05;fxAd(A,{k:'fn',x:hx,y:hy,T:.9,dl:tA,fa:.7,d:(c,q,g)=>{const t=q.t-tA,P=g.P*2+(t<.15||(t>.3&&t<.42)?Math.round(g.P/2):0);fxSpD(c,hx,hy,P,FXHT);},end:A2=>{for(let k=0;k<10;k++){const a=k/10*Math.PI*2;A2.add({k:'fn',x:hx,y:hy,vx:Math.cos(a)*140,vy:Math.sin(a)*140-40,g:200,T:.6,fa:.4,d:(c,q,g,t2,x2)=>fxSpD(c,x2,q.y,g.P,FXHT.filter(([a,b])=>Math.abs(a)<2&&b>-2&&b<2))});}}});},
 /* Pollen Count and Honeycomb: pollinated fruit flash gold and stream pollen into the new fruit, where a flower opens */
 pcount(A,x,y,r){const fs=fxFrMine(A,x,y).filter(f=>f.p).slice(0,8);if(!fs.length)return;fs.forEach((f,k)=>{fxAd(A,{k:'fn',x:f.x,y:f.y,T:.4,dl:k*.06,fa:.3,d:(c,q,g)=>{const P=g.P,R=Math.round(f.r/P)+1,N=R*6;for(let m=0;m<N;m++){if(m%2)continue;const a=m/N*Math.PI*2;fxR(c,f.x+Math.round(Math.cos(a)*R)*P,f.y+Math.round(Math.sin(a)*R)*P,P,'y');}}});
   for(let m=0;m<6;m++){const T1=.7,dl=k*.06+m*.06,x0=f.x+(Math.random()-.5)*f.r,y0=f.y-f.r*.3;fxAd(A,{k:'fn',x:x0,y:y0,T:T1,dl,fa:.85,d:(c,q,g)=>{const u=(q.t-dl)/T1,e=u*u*(3-2*u),bx=x0+(x-x0)*e+Math.sin(u*10+m)*12*g.K*(1-u),by=y0+(y-r*.5-y0)*e-Math.sin(u*Math.PI)*40*g.K,P=g.P;fxR(c,bx-P,by-P,P,'k',4,4);fxR(c,bx,by,P,'y',2,2);fxR(c,bx,by,P,'h');}});}});
  const tf=.75+fs.length*.06;fxAd(A,{k:'fn',x,y:y-r*.5,T:.9,dl:tf,fa:.6,d:(c,q,g)=>{const t=q.t-tf,P=g.P,o=t<.08?.5:t<.16?1.25:1,D=Math.round(3*o),cells=new Map();for(let k=0;k<5;k++){const a=k/5*Math.PI*2-Math.PI/2,ci=Math.round(Math.cos(a)*D),cj=Math.round(Math.sin(a)*D);for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){if(Math.abs(i)+Math.abs(j)>1&&D<3)continue;cells.set((ci+i)+','+(cj+j),i===-1&&j===-1?'w':(i+j>0?'p':'w'));}}for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++)cells.set(i+','+j,i+j<0?'y':'Y');cells.set('0,0','o');
   fxBlob(c,fq(x,P),fq(y-r*.5,P),P,cells);}});},
 /* Skyline and Skyscraper: a little skyscraper rises off each fruit it counts (the biggest of every size from 6 up), its windows lighting floor by floor; the tallest blinks an antenna */
 sky(A,x,y,r){const by={};for(const f of A.F)if(f.l>=5&&(!by[f.l]||f.y<by[f.l].y))by[f.l]=f;const fs=Object.values(by).sort((a,b)=>a.l-b.l),top=fs[fs.length-1];
  fs.forEach((f,k)=>{const H=9+(f.l-5)*3,W2=f.l>=8?3:2,dl=k*.14;fxAd(A,{k:'fn',x:f.x,y:f.y,T:1.5,dl,fa:.8,d:(c,q,g)=>{const t=q.t-dl,P=g.P,rise=t<.3?t/.3:1,hh=Math.round(H*(rise<1?rise*1.12:1)),x0=fq(f.x,P),y0=fq(f.y-f.r*.72,P),lit=(t-.3)*22,cells=new Map();
    for(let j=0;j<=hh;j++){const wd=j>hh-2&&hh>4?W2-1:W2;for(let i=-wd;i<=wd;i++){let col=i===wd?'U':'u';if(i>-wd&&i<wd&&j>0&&j<hh-1&&(i+wd)%2===1&&j%2===1)col=lit>fhs(i*7+j,f.l)*H*1.4?(fst(t+i*3+j,2)%7?'y':'h'):'D';if(j===0)col='U';cells.set(i+','+(-j),col);}}
    if(f===top&&rise>=1){for(let j=1;j<=3;j++)cells.set('0,'+(-hh-j),'s');cells.set('0,'+(-hh-4),fst(t,3)%2?'r':'R');}
    fxBlob(c,x0,y0,P,cells);if(f===top&&rise>=1&&fst(t,3)%2)fxStar(c,x0,y0-(hh+4)*P,P,1,'r');}});});},
 /* Fat Wallet: coins tumble in from the coin counter's corner, spinning, and stack on the new fruit, then topple off; more coins held, more coins */
 wallet(A,x,y,r){const n=Math.max(2,Math.min(6,Math.round((A.SD.c||0)/3)));
  /* a spinning coin (face width sx cells of 3) and a coin lying in a stack (side view) */
  const spin=(c,bx,by,P,ph)=>{const cs=Math.cos(ph),sx=Math.max(.6,Math.abs(cs)*3.3),cells=new Map();for(let j=-3;j<=3;j++)for(let i=-4;i<=4;i++){const e=(i*i)/(sx*sx)+(j*j)/10.5;if(e>1)continue;const rim=(i+1)*(i+1)/(sx*sx)+(j*j)/10.5>1||e>.55;cells.set(i+','+j,sx<1.2?'Y':rim?'Y':'y');}if(sx>=1.6){cells.set('0,-1','Y');cells.set('0,0','Y');cells.set('0,1','Y');cells.set(Math.round(-sx/2)+',-2','h');}fxBlob(c,fq(bx,P),fq(by,P),P,cells);},
   lie=(c,bx,by,P)=>{const cells=new Map();for(let i=-3;i<=3;i++){cells.set(i+',0',Math.abs(i)<3?'y':'Y');cells.set(i+',1','Y');}cells.set('-2,0','h');fxBlob(c,fq(bx,P),fq(by,P),P,cells);};
  for(let k=0;k<n;k++){const x0=A.g.L+8,y0=A.g.bot-10,T1=.45,dl=k*.11,tx=x+(fhs(k,3)-.5)*2*A.g.K,ty=y-r-4*A.g.K,fall=n*.11+.5-dl+T1,ph0=k*1.7;fxAd(A,{k:'fn',x:x0,y:y0,T:fall+.65,dl,fa:.85,d:(c,q,g)=>{const t=q.t-dl,P=g.P,sy=ty-k*2*P;if(t<T1){const u=t/T1;spin(c,x0+(tx-x0)*u,y0+(sy-y0)*u-Math.sin(u*Math.PI)*140*g.K,P,ph0+t*16);}else if(t<fall){lie(c,tx,sy,P);if(t<T1+.08)fxStar(c,tx+4*P,sy-P,P,1,'y');}else{const u=(t-fall)/.65;spin(c,tx+(k%2?1:-1)*(u*50+k*4)*g.K,sy+u*u*90*g.K-Math.sin(Math.min(1,u*2.5)*Math.PI)*14*g.K,P,ph0+t*14);}}});}},
 /* Blue Ribbon: a big prize rosette pins onto the new fruit with a bounce, pleats round a gold centre, notched tails fluttering */
 ribbon(A,x,y,r){const pl=Math.max(8,Math.min(12,(A.SD.nch||5)+5));fxAd(A,{k:'fn',x,y,T:1.4,fa:.8,d:(c,q,g)=>{const P=g.P,t=q.t,R=t<.07?2:t<.14?7:t<.2?5:6,cx=fq(x+r*.35,P),cy=fq(y-r*.55-(t<.14?(.14-t)*200:0),P),cells=new Map();
   for(const sd of[-1,1])for(let j=0;j<8;j++){const wv=Math.round(Math.sin(t*10+j*.8+sd*1.3)*.8),i0=sd*(1+Math.floor(j*.5))+wv;for(let w=0;w<3;w++)if(!(j===7&&w===1))cells.set((i0+w-1)+','+(R-1+j),j>5?'B':'b');}
   for(let j=-R;j<=R;j++)for(let i=-R;i<=R;i++){const d=Math.hypot(i,j),a=Math.atan2(j,i),pk=Math.cos(a*pl)>.2;const rr=R-(pk?0:1);if(d>rr+.4)continue;cells.set(i+','+j,d<=2.2?(d<1?'h':'y'):d<=2.9?'Y':pk?'b':'B');}fxBlob(c,cx,cy,P,cells);fxR(c,cx-P,cy-P,P,'w');}});},
 /* Pack Leader and Alpha: paw prints trot across the new fruit and off it, one trail for every pet you hold */
 pack(A,x,y,r){const n=Math.max(1,Math.min(4,A.SD.np||1)),PW=[[0,0,'N'],[1,0,'N'],[-1,0,'N'],[0,1,'N'],[1,1,'N'],[-1,1,'n'],[-2,-2,'N'],[0,-3,'N'],[2,-2,'N']];for(let m=0;m<n;m++){const y0=y-r*.35+m*r*.32,dir=m%2?-1:1;for(let k=0;k<7;k++){const px=x-dir*r*1.2+dir*k*r*.42,py=y0+(k%2?-5:5)*A.g.K-Math.sin(k/6*Math.PI)*r*.35,dl=m*.15+k*.09;fxAd(A,{k:'fn',x:px,y:py,T:.6,dl,fa:.45,d:(c,q,g)=>{const s2=q.t-dl<.05?g.P+1:g.P;fxSpD(c,px,py,s2,dir<0?fxMir(PW):PW);}});}}},
 /* Vintage and Keepsake: an old photo frame with sprocket holes closes round the new fruit, sepia and scratched, then develops back to colour; Heirloom frames it in a gold locket */
 vintage(A,x,y,r,gold){fxAd(A,{k:'fn',x,y,T:1.15,fa:.8,d:(c,q,g)=>{const P=g.P,t=q.t,R=Math.round(r/P)+3,lv=t<.3?.6:t<.6?.4:t<.85?.2:0,fr=gold?'Y':'k',ins=gold?'y':'c';c.save();
   for(let j=-R+1;j<R;j++)for(let i=-R+1;i<R;i++){if(i*i+j*j>(R-2)*(R-2))continue;if(FBY[((i+40)&3)*4+((j+40)&3)]/16<lv)fxR(c,x+i*P,y+j*P,P,gold?(((i+j)&1)?'y':'h'):(((i+j)&1)?'E':'n'));}
   for(let k=-R;k<=R;k++){for(const[a,b]of[[k,-R],[k,R],[-R,k],[R,k]])fxR(c,x+a*P,y+b*P,P,fr);for(const[a,b]of[[k,-R+1],[k,R-1],[-R+1,k],[R-1,k]])if(Math.abs(a)<R&&Math.abs(b)<R)fxR(c,x+a*P,y+b*P,P,(gold?false:(k+40)%3===0)?'k':ins);}
   if(gold){for(const[sx,sy]of[[-1,-1],[1,-1],[-1,1],[1,1]]){fxR(c,x+sx*(R+1)*P,y+sy*(R+1)*P,P,'Y');fxStar(c,x+sx*(R+1)*P,y+sy*(R+1)*P,P,fst(t,4)%2?1:0,'y');}}
   else if(t<.85&&fst(t,10)%3===0){const sx=x+Math.round((fhs(fst(t,10),2)-.5)*(R-3)*2)*P;for(let j=-R+2;j<R-1;j++)fxR(c,sx,y+j*P,P,'c');}c.restore();}});
  for(let k=0;k<6;k++)A.add({k:'sq',x:x+(Math.random()-.5)*r*1.6,y:y-r*.2,vy:-18-Math.random()*20,g:0,T:1+Math.random()*.4,col:gold?'h':k%2?'s':'c',fa:.4,sw:4,sf:3,ph:k,dl:.1});},
 /* Abacus and Polyculture: a two-rod abacus appears over the new fruit and its beads click across, one for every seed level (Polyculture: every seeded size) */
 abacus(A,x,y,r,poly){const n=Math.max(1,Math.min(16,poly?(A.SD.sz||1):(A.SD.n||1)));fxAd(A,{k:'fn',x,y,T:1.5,fa:.8,d:(c,q,g)=>{const P=g.P,t=q.t,W2=29,pop=t<.06?.6:t<.12?1.1:1,x0=fq(x-W2/2*P,P),y0=fq(y-r-18*g.K,P),R=(i,j,col,w=1,h=1)=>fxR(c,x0+i*P,y0+j*P,P,col,w,h);if(pop<1){c.save();c.translate(x,y0);c.scale(pop,pop);c.translate(-x,-y0);}
   R(-2,-7,'k',W2+4,16);R(-1,-6,'N',W2+2,14);R(1,-4,'c',W2-2,10);R(-1,-6,'n',W2+2,1);R(-1,7,'n',W2+2,1);R(-1,-6,'E',1,13);for(const j of[-2,3])R(1,j,'d',W2-2,1);for(const[i,j]of[[-1,-6],[W2,-6],[-1,7],[W2,7]])R(i,j,'Y');
   const cols=['r','o','y','g','t','b','P','m'],DK={r:'R',o:'N',y:'Y',g:'G',t:'G',b:'B',P:'V',m:'R'};for(let k=0;k<n;k++){const row=k<8?0:1,kk=k%8,st=Math.min(1,Math.max(0,(t-.18-k*.07)/.08)),home=W2-3-(7-kk)*0-kk*3,dest=2+kk*3,bx=Math.round(home+(dest-home)*st),by=row?3:-2,col=cols[kk];const cells=new Map([['0,-1',col],['-1,0',col],['0,0',col],['1,0',DK[col]],['0,1',DK[col]],['-1,-1','w'],['1,-1',col],['-1,1',col],['1,1',DK[col]]]);fxBlob(c,x0+bx*P,y0+by*P,P,cells);if(st>.99&&t-.26-k*.07<.06)fxStar(c,x0+(bx-2)*P,y0+(by-2)*P,P,1,'w');}if(pop<1)c.restore();}});}};
FXM.snack=FXM.hoard;FXM.play=FXM.nurs;FXM.hcomb=FXM.pcount;FXM.skyscr=FXM.sky;FXM.alpha=FXM.pack;FXM.keep=FXM.vintage;FXM.heir=(A,x,y,r)=>FXM.vintage(A,x,y,r,1);FXM.poly=(A,x,y,r)=>FXM.abacus(A,x,y,r,1);

/* The Padlock on the tool bar: chains cross the tools in an X, link by link, then the padlock drops onto them and the bar dims. Phase 2: it shakes and the charge bursts out of the tools in teal sparks. Beaten: a key flies in and turns, the padlock springs open and drops, and the chains fall away */
function fxLockBar(c,W,H,s,t){const P=3,BP=4,age=s.age||0,u=Math.min(1,age/.8),dead=s.dnt!=null,dn=dead?s.dnt:0;
 c.globalAlpha=(dead?Math.max(0,1-dn/.8):Math.min(1,age/.4))*.3;c.fillStyle=FXP.x;c.fillRect(0,0,W,H);
 const fall=dead&&dn>.6?(dn-.6)*(dn-.6)*900:0,sh=(s.p2t!=null&&s.p2t<.6)?(fst(t,20)%2?P:0):0;c.globalAlpha=dead?Math.max(0,1-(dn-.6)/.5):1;
 for(const[x0,y0,x1,y1]of[[2,5,W-2,H-5],[2,H-5,W-2,5]]){const len=Math.hypot(x1-x0,y1-y0),n=Math.floor(len/(2*P)),m=Math.round(n*u);for(let k=0;k<m;k++){const v=k/n,x=x0+(x1-x0)*v,y=y0+(y1-y0)*v+fall+sh;if(k%2){fxR(c,x-P,y-P,P,'k',3,3);fxR(c,x,y,P,'d');}else{fxR(c,x-P,y,P,'k',3,1);fxR(c,x,y-P,P,'k',1,3);fxR(c,x,y,P,'s');}}}
 c.globalAlpha=1;const lu=Math.min(1,Math.max(0,(age-.6)/.35)),ly=H/2+26-(lu<1?Math.round(Math.pow(1-lu,2)*70):0)+(dead&&dn>.65?Math.pow(dn-.65,2)*900:0),shk=s.p2t!=null&&s.p2t<.6?(fst(t,20)%2?BP:-BP)/2:0;
 if(lu>0&&ly<H+60)fxS(c,dead&&dn>.5?'lockO':'lock',W/2+shk,ly,BP);
 if(dead&&dn<.62){const k=Math.min(1,dn/.5),kx=-30+(W/2+18+30)*k;fxS(c,'key',kx,H/2-4,BP,{ay:.5,r:Math.min(3,Math.floor(dn*8))%4});}
 if(s.p2t!=null&&s.p2t<.9){const q=s.p2t/.9;for(let k=0;k<18;k++){const a=k*.35,x=W/2+Math.cos(a)*q*W*.48,y=H/2+Math.sin(a)*q*H*.7-q*q*30;c.globalAlpha=Math.max(0,1-q);fxR(c,x,y,P,k%3?'t':'w');}c.globalAlpha=1;}
 if(!dead&&lu>=1&&(t%3.3)<.2)fxStar(c,W/2-14,ly-46,P,[1,2,1][Math.min(2,Math.floor((t%3.3)/.07))],'y');}
function fxLockSync(){const g=G.g,s=g&&g.fx&&g.fx.S.B_lock,pw=document.getElementById('pw'),tb=document.getElementById('tb');let cv=document.getElementById('lkc');
 if(!s||!(s.p>0)||(G.state!=='play'&&G.state!=='pause')||!tb||!pw){if(cv)cv.hidden=true;return;}
 if(!cv){cv=document.createElement('canvas');cv.id='lkc';cv.style.cssText='position:absolute;pointer-events:none;z-index:5';pw.appendChild(cv);if(getComputedStyle(pw).position==='static')pw.style.position='relative';}
 cv.hidden=false;const r=tb.getBoundingClientRect(),pr=pw.getBoundingClientRect(),dp=devicePixelRatio||1,w=Math.round(r.width),h=Math.round(r.height);if(!w||!h)return;cv.style.left=(r.left-pr.left)+'px';cv.style.top=(r.top-pr.top)+'px';cv.style.width=w+'px';cv.style.height=h+'px';if(cv.width!==w*dp||cv.height!==h*dp){cv.width=w*dp;cv.height=h*dp;}
 const c=cv.getContext('2d');c.setTransform(dp,0,0,dp,0,0);c.clearRect(0,0,w,h);c.imageSmoothingEnabled=false;fxLockBar(c,w,h,s,g.fx.t);}
