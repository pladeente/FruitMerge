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
 const A={pp,S,g:null,rim:{},fr:0,get t(){return t},
  add(q){q.t=0;q.vx=q.vx||0;q.vy=q.vy||0;q.ly=q.ly==null?1:q.ly;pp.push(q);return q;},
  burst(x,y,cols,n,o={}){for(let k=0;k<n;k++){const a=Math.random()*Math.PI*2,v=(o.v||120)*(.4+Math.random()*.8);A.add({k:'sq',x:x+(Math.random()-.5)*(o.w||0),y,vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v+(o.vy||0),g:o.g==null?300:o.g,T:o.T||(.5+Math.random()*.4),col:cols[k%cols.length],s:o.s||1,ly:o.ly,dr:o.dr});}},
  tick(dt,g,lv){A.g=g;t+=dt;FXC=A;A.fr++;for(const id in FXS){const sc=FXS[id],s=S[id]||(S[id]={p:0,o:0,on:false,ton:9}),l=lv[id]||{},on=!!(l.p&&l.on);s.l=l;if(on!==s.on){s.on=on;s.ton=0;}else s.ton+=dt;s.p=fxA(s.p,l.p?1:0,dt*4);s.o=fxA(s.o,on?1:0,dt*(on?5:3));if(sc.tick&&(s.p>0||l.p))sc.tick(s,g,dt,A);}fxRimSolve(A,g,dt);
   for(let i=pp.length-1;i>=0;i--){const q=pp[i];q.t+=dt;if(q.dl&&q.t<q.dl)continue;if(q.t>=q.T){pp.splice(i,1);if(q.end)q.end(A,g,q);continue;}const d=dt;q.vy+=(q.g||0)*d;q.x+=q.vx*d;q.y+=q.vy*d;if(q.dr){q.vx*=1-q.dr*d;q.vy*=1-q.dr*d;}if(q.fy!=null&&q.y>q.fy){q.y=q.fy;q.vy=-q.vy*(q.bo||0);q.vx*=.6;}}},
  back(c,g){FXC=A;for(const id in FXS){const s=S[id];if(s&&s.p>0&&FXS[id].back)FXS[id].back(c,g,s,t,A);}fxPP(c,g,pp,t,0);},
  front(c,g){FXC=A;for(const id in FXS){const s=S[id];if(s&&s.p>0&&FXS[id].front)FXS[id].front(c,g,s,t,A);}fxPP(c,g,pp,t,1);},
  top(c,g){FXC=A;for(const id in FXS){const s=S[id];if(s&&s.p>0&&FXS[id].top)FXS[id].top(c,g,s,t,A);}}, /* over the HUD (The Fog hides the Next box) */
  hit(id,o={}){FXC=A;if(id==='marathon'){A.hit(S.early&&S.early.on?'early':'clutch',o);return;}const ks=[].concat(FXH[id]||id),q=Object.assign({src:id},o);for(const k of ks){const s=S[k];if(s&&s.p>0&&FXS[k]&&FXS[k].hit&&A.g)FXS[k].hit(s,q,A,A.g);}},
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
const FXH={ivy:['wire','wall'],still:['tidy','low'],encore:'enc',headline:'enc',bonfire:'bon',cresc:'comic',chain:'comic',gfin:'comic',knock:'comic',wildfire:['hot','comic'],smoothie:'juicer',mania:'heavy',allin:'dnoth',amph:['cstage','fshow'],hunter:'magpie'};
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
 early:{tick(s,g,dt){const P=g.P,py=fxRim(g);s.st=s.st||'gone';const px=s.on||s.st==='sit'||s.st==='in'?fxRX('early',.7,50,g):s.bx||g.R;s.ft=(s.ft||0)+dt;
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
  tick(s,g,dt,A){const sy=FXS.low.surf(g);s.rp=(s.rp||[]).filter(r=>(r.t+=dt)<1);if(!RMO&&s.p>0&&Math.random()<dt*2.5)A.add({k:'fn',x:g.L+Math.random()*(g.R-g.L),y:g.bot-6,vy:-30-Math.random()*25,T:(g.bot-sy)/30,sy,sw:3,sf:3,ph:Math.random()*6,fa:.95,d:fxBub});},
  front(c,g,s,t){const P=g.P,sy=fq(FXS.low.surf(g),P),wv=fst(t,8);c.save();c.globalAlpha=.17*s.p;c.fillStyle=FXP.b;c.fillRect(g.L,sy,g.R-g.L,g.bot-sy);
   for(let x=g.L;x<g.R;x+=P){const i=Math.round(x/P);let dy=Math.sin(i*.28+wv*.7)*.9;for(const r of s.rp)dy+=Math.sin((x-r.x)*.12-r.t*18)*2.4*(1-r.t)*Math.exp(-Math.abs(x-r.x)/70);dy=Math.round(dy);c.globalAlpha=s.p;fxR(c,x,sy+dy*P-P,P,(i+wv)%9===0?'w':'b');c.globalAlpha=s.p*.85;fxR(c,x,sy+dy*P,P,'B');c.globalAlpha=s.p*.35;for(let j=1;j<5;j++)if(FBY[(i&3)*4+(j&3)]/16<.6-j*.12)fxR(c,x,sy+(dy+j)*P,P,'B');}c.restore();},
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
  front(c,g,s,t){const P=g.P,x0=fq(g.L+(g.R-g.L)/3,P),x1=fq(g.L+2*(g.R-g.L)/3,P),fl=s.fh>0?1:0;c.save();for(let y=g.top,j=0;y<g.bot-2*P;y+=P,j++)for(let x=x0-2*P,i=-2;x<x1+2*P;x+=P,i++){const e=Math.min(i+2,Math.round((x1-x)/P)+2),d=(e<2?.25:e<4?.5:.75)*(fl?1:.55);const ci=Math.round(x/P);if(FBY[(ci&3)*4+(j&3)]/16<d){c.globalAlpha=s.p*(fl?.32:.17);fxR(c,x,y,P,'y');}}
   c.globalAlpha=s.p;const b=fq(g.bot,P);for(let x=x0;x<x1;x+=P){const i=Math.round((x-x0)/P);fxR(c,x,b-3*P,P,'k');fxR(c,x,b-2*P,P,i%7===0?'N':'E');fxR(c,x,b-P,P,i%7===0?'N':'n');}
   for(const x of[x0,x1]){const y=fxRim(g);fxR(c,x-2*P,y-4*P,P,'k',4,4);fxR(c,x-P,y-3*P,P,'D',2,2);fxR(c,x-P,y-P,P,fl?'w':'h',2,1);}c.restore();},
  hit(s,o,A,g){const w=g.R-g.L;if(o.src==='amph'&&(o.x<g.L+w/3||o.x>g.L+2*w/3))return;s.fh=.4;A.burst(o.x,o.y-(o.r||16),['m','y','t','b','g','P'],14,{v:170,vy:-160,g:420,T:.9,dr:1.2});}},
 /* Wallflower: flowering vines climb both walls of the jar. A merge touching a wall: the flowers on that side bloom and throw petals at it */
 wall:{tick(s,g,dt){if(s.bl&&(s.bl.t-=dt)<=0)s.bl=null;},
  front(c,g,s,t){const P=g.P,sw=fst(t,2)%2;c.save();c.globalAlpha=s.p;for(const sd of[-1,1]){const wx=sd<0?g.L:g.R-P;let k=0;for(let y=g.bot-P;y>g.top+6*P;y-=P,k++){const dx=Math.round(Math.sin(k*.18+(sd>0?2:0))*1)+1,x=wx-sd*dx*P;fxR(c,x,y,P,'G');if(k%6===3){fxR(c,x-sd*P,y,P,'g');fxR(c,x-sd*2*P,y-P,P,'g');}
     if(k%11===5){const big=s.bl&&s.bl.sd===sd&&Math.abs(s.bl.y-y)<70,fx=x-sd*3*P,fy=y-(sw&&!big?P:0),pc=k%22===5?'p':'m';for(const[a,b]of[[0,-2],[0,2],[-2,0],[2,0],[-1,-1],[1,1],[-1,1],[1,-1]])fxR(c,fx+a*P,fy+b*P,P,'k');fxR(c,fx,fy-P,P,pc);fxR(c,fx,fy+P,P,pc);fxR(c,fx-P,fy,P,pc);fxR(c,fx+P,fy,P,pc);if(big){fxR(c,fx-P,fy-P,P,pc);fxR(c,fx+P,fy+P,P,pc);fxR(c,fx-P,fy+P,P,pc);fxR(c,fx+P,fy-P,P,pc);fxR(c,fx,fy-2*P,P,pc);fxR(c,fx,fy+2*P,P,pc);fxR(c,fx-2*P,fy,P,pc);fxR(c,fx+2*P,fy,P,pc);}fxR(c,fx,fy,P,'y');}}}c.restore();},
  hit(s,o,A,g){if(o.src==='ivy'&&o.x-(o.r||0)>g.L+8&&o.x+(o.r||0)<g.R-8)return;const sd=o.x<(g.L+g.R)/2?-1:1,wx=sd<0?g.L+4*g.P:g.R-4*g.P;s.bl={sd,y:o.y,t:.7};for(let k=0;k<9;k++){const T=.45+Math.random()*.2;A.add({k:'sq',x:wx,y:o.y+(Math.random()-.5)*60,vx:(o.x-wx)/T*(.7+Math.random()*.5),vy:-40-Math.random()*60,g:200,T,col:k%2?'p':'m',dr:.4});}}},
 /* Crescendo and Chain Reaction: every combo merge they score on lands a comic-book hit: a loud starburst and a word, bigger the longer the combo runs, then it breaks apart */
 comic:{hit(s,o,A,g){if(o.src==='wildfire'&&!(o.cb>=1))return;const now=A.t;if(s.lt&&now-s.lt<.05)return;s.lt=now;const ko=o.src==='knock',fi=o.src==='wildfire',cb=Math.max(ko?3:1,o.cb||1),tier=cb<3?0:cb<5?1:2,wl=ko?['K.O.!','KAPOW!','WHAM!']:fi?['FWOOM!','WHOOSH!','BLAZE!']:FXW[tier],w=wl[Math.floor(Math.random()*wl.length)],R=Math.min(62,(ko?46:38)+cb*4),seed=fi?[0,1][Math.floor(Math.random()*2)]:ko?0:Math.floor(Math.random()*99),ang=(Math.random()<.5?-1:1)*(.15+Math.random()*.2),cv=fxBurst(w,R,ang,seed),pr=FXCB[seed%FXCB.length],P=2,x=Math.max(g.L+cv.width*P*.3,Math.min(g.R-cv.width*P*.3,o.x)),y=o.y-(o.r||16)*.4;
   if(ko)for(let k=0;k<14;k++){const a=k*Math.PI/7+Math.random()*.2;A.add({k:'fn',x:o.x,y:o.y,T:.25,fa:.4,a,d:(c,q,g)=>{const P=g.P,r0=(o.r||20)*1.3+q.t*300,r1=r0+18+q.t*60;fxLn(c,q.x+Math.cos(q.a)*r0,q.y+Math.sin(q.a)*r0,q.x+Math.cos(q.a)*r1,q.y+Math.sin(q.a)*r1,P,FXP.k);}});}
   A.add({k:'fn',x,y,T:.62,fa:.85,d:(c,q,g)=>{const P=2,f=Math.floor(q.t/.05),sc=f===0?.55:f===1?1.18:1,u=q.t>.44?1:0,w=cv.width*P*sc;if(u&&!q.br){q.br=1;A.burst(q.x,q.y,[pr[0],pr[1],'k'],16,{v:300,T:.5,s:3,g:300,w:40});}if(u)return;c.save();c.imageSmoothingEnabled=false;c.drawImage(cv,fq(q.x-w/2,P),fq(q.y-w/2,P),w,w);c.restore();}});}},
 /* Juicer: every merge squirts juice in the fruit's colour; drops that reach the glass splat and run down it */
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
 tick(s,g,dt,A){const gl=(s.l.g||[]).filter(q=>q.f&&!q.f.dead&&q.f.gold);s.ft=(s.ft||0)+dt;s.st=s.st||'gone';for(const k of['pk','cw'])if(s[k]>0)s[k]-=dt;
  if(!s.l.p){if(s.st!=='gone'&&s.st!=='out'){s.st='out';s.ft=0;s.x0=s.bx;s.y0=s.by;}}
  else if(s.st==='gone'){s.tg=FXS.magpie.pick(s,gl);s.st='fly';s.ft=0;s.x0=g.W+30;s.y0=fxRim(g)-160;s.T=1;}
  const lost=s.tg&&!gl.includes(s.tg)&&!gl.some(q=>q.f===s.tg.f);if(s.l.p&&(s.st==='sit'||s.st==='fly')&&(lost||(!s.tg&&gl.length))){s.x0=s.bx;s.y0=s.by;s.tg=FXS.magpie.pick(s,gl.filter(q=>!s.tg||q.f!==s.tg.f));s.st='fly';s.ft=0;const[px,py]=FXS.magpie.perch(s,g);s.T=Math.max(.45,Math.min(1.1,Math.hypot(px-s.x0,py-s.y0)/260));}
  if(s.st==='sit'){const[px,py]=FXS.magpie.perch(s,g);s.bx=px;s.by=py;s.sd=(s.sd==null?3:s.sd)-dt;if(s.sd<=0&&gl.length>1){s.x0=s.bx;s.y0=s.by;s.tg=FXS.magpie.pick(s,gl);s.st='fly';s.ft=0;const[qx,qy]=FXS.magpie.perch(s,g);s.T=Math.max(.45,Math.min(1.1,Math.hypot(qx-s.x0,qy-s.y0)/260));}}
  else if(s.st==='fly'){const[px,py]=FXS.magpie.perch(s,g),u=Math.min(1,s.ft/s.T),e=u<.5?2*u*u:1-2*(1-u)*(1-u);s.dir=px>s.x0?1:-1;s.bx=s.x0+(px-s.x0)*e;s.by=s.y0+(py-s.y0)*e-Math.sin(u*Math.PI)*Math.min(70,30+Math.abs(px-s.x0)*.3);if(u>=1){s.st='sit';s.sd=2.4+Math.random()*2.2;s.pk=.25;A.add({k:'star',x:px,y:py-2*g.P,T:.4,col:'y'});}}
  else if(s.st==='out'){const u=Math.min(1,s.ft/1.1);s.dir=-1;s.bx=s.x0-u*g.W*.8;s.by=s.y0-u*u*320;if(u>=1){s.st='gone';s.tg=null;}}},
 front(c,g,s,t){if(!s.st||s.st==='gone'||s.bx==null)return;const P=g.P;let fr='mp0',fl=0;if(s.st==='fly'||s.st==='out'){fr=fst(t,12)%2?'mpF0':'mpF1';fl=s.dir>0?1:0;}else{if(s.pk>0)fr='mpP';else if(s.cw>0)fr=fst(s.cw,10)%2?'mpP':'mp0';fl=s.tg&&s.tg.f.x<(g.L+g.R)/2?1:0;}fxS(c,fr,s.bx,s.by,P,{fl});},
 hit(s,o,A,g){if(s.st!=='sit')return;s.pk=.3;s.cw=.5;const P=g.P;A.add({k:'star',x:s.bx,y:s.by+2*P,T:.45,col:'y'});A.add({k:'spr',sp:'nt',x:s.bx,y:s.by-9*P,vy:-40,vx:(Math.random()-.5)*30,T:.9,fa:.5,sw:4,sf:6});}};
/* ---------- bosses (v1.78): every boss arrives in the sky above the jar while its banner is up, changes the jar's air for that jar, performs its rule where you can see it,
   transforms at phase 2 and reacts when beaten. Scenes are FXS entries named B_<rule>, live state from the engine: {p: the rule is on this jar, ph: phase, done: jar cleared, ...}.
   bossT(s) keeps the shared clocks: s.age since it arrived, s.p2t since phase 2, s.dnt since beaten (null until then). ---------- */
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
 /* The Twins: two cherry kids sit on the rim holding stems. Every merge that drops a Cherry in, one of them kicks it into the jar. Phase 2: they both throw. Beaten: they fall asleep leaning on each other */
 B_twins:{x(g){return fq(fxRX('B_twins',.24,78,g),fxBP(g));},
  tick(s,g,dt){bossT(s,dt);for(const k of['k0','k1'])if(s[k]>0)s[k]-=dt;},
  front(c,g,s,t){const P=fxBP(g),x0=FXS.B_twins.x(g),rim=fxRim(g),u=Math.min(1,s.age/.7),sl=s.dnt!=null&&s.dnt>.3;c.save();c.globalAlpha=s.p*u;const jx=x0,jy=rim-17*P;
   for(const d of[0,1]){const kk=s['k'+d]||0,hop=kk>.15?-2:kk>0?1:(sl?0:(fst(t+d*.35,3)%2?-1:0)),lean=sl?(d?-1:1):0,cx=x0+(d?5:-5)*P+lean*P,cy=rim-5*P+hop*P,r=4;
    fxLn(c,cx+(d?-1:1)*P,cy-r*P,jx,jy+P,P,FXP.N);fxLn(c,cx,cy-r*P,jx+(d?1:-1)*P,jy+P,P,FXP.G);
    for(let j=-r-1;j<=r+1;j++)for(let i=-r-1;i<=r+1;i++){const dd=i*i+j*j;if(dd>r*r+r)continue;const e=(i+1)**2+j*j>r*r+r||(i-1)**2+j*j>r*r+r||i*i+(j+1)**2>r*r+r||i*i+(j-1)**2>r*r+r;fxR(c,cx+i*P,cy+j*P,P,e?'k':(i+j>r*.7?'R':(i<-1&&j<-1?'q':'r')));}
    fxR(c,cx-2*P,cy-2*P,P,'w');const bl=(t+d)%2.9<.13;if(sl){fxR(c,cx-2*P,cy,P,'k',2,1);fxR(c,cx+P,cy,P,'k',2,1);}else if(bl){fxR(c,cx-2*P,cy-P,P,'k',2,1);fxR(c,cx+P,cy-P,P,'k',2,1);}else{fxR(c,cx-2*P,cy-P,P,'k',1,2);fxR(c,cx+P,cy-P,P,'k',1,2);}
    fxR(c,cx-3*P,cy+P,P,'p');fxR(c,cx+2*P,cy+P,P,'p');if(!sl){fxR(c,cx-P,cy+2*P,P,'k',3,1);fxR(c,cx-2*P,cy+P,P,'k');fxR(c,cx+2*P,cy+P,P,'k');}else fxR(c,cx,cy+2*P,P,'k');}
   fxR(c,jx-P,jy-P,P,'k',3,2);fxR(c,jx,jy-2*P,P,'k',4,2);fxR(c,jx+P,jy-2*P,P,'g',2,1);fxR(c,jx,jy-P,P,'G');
   if(sl&&!RMO){const q=(t*.6)%1;T(c,'z',jx+(8+q*10)*P/2,jy-q*30,10+q*8,'#3b2346','center',FD);}c.restore();},
  ev(s,n,o,A,g){if(n!=='twins'||!s.l.p||s.dnt!=null)return;const d=o.x>FXS.B_twins.x(g)?1:0,P=fxBP(g),k='k'+(s['k'+d]>0?1-d:d);s[k]=.3;const x0=FXS.B_twins.x(g)+(k==='k1'?5:-5)*P,y0=fxRim(g)-8*P,T1=.3,G=1500,tx=o.x,ty=g.top+4;A.add({k:'fn',x:x0,y:y0,vx:(tx-x0)/T1,vy:(ty-y0-.5*G*T1*T1)/T1,g:G,T:T1,fa:1,d:(c,q,g)=>drawFruit(c,q.x,q.y,g.P*3,0),end:(A)=>A.burst(tx,ty,['r','q','w'],5,{v:80,T:.3})});}},
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
 /* The Syrup: a syrup bottle on the rim and syrup oozing down the inside of the walls. When a Sticky fruit comes up it hops and throws a glob onto the fruit in your hand, which drips; Sticky fruit in the jar drip too. Phase 2: it glugs, the walls run thick and a puddle spreads on the floor. Beaten: it falls over empty and its cap pops off */
 B_sticky:{x(g){return fq(fxRX('B_sticky',.3,40,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);const l=s.l;if(s.hp>0)s.hp-=dt;if(l.st&&!s.was&&s.dnt==null){s.hp=.4;const P=fxBP(g),x0=FXS.B_sticky.x(g),y0=fxRim(g)-17*P,T1=.45;s.ct=0;A.add({k:'fn',x:x0,y:y0,vx:(l.hx-x0)/T1,vy:(l.hy-l.hr-y0-.5*900*T1*T1)/T1,g:900,T:T1,fa:1,d:(c,q,g)=>{const P=g.P;fxEl(c,fq(q.x,P),fq(q.y,P),P,2,2,(i,j,e)=>e?'k':i<0&&j<0?'y':'Y');},end:(A2,g)=>{s.ct=.01;A2.burst(l.hx,l.hy-l.hr,['Y','o','y'],8,{v:110,T:.4});}});}
   s.was=l.st;if(s.ct>0&&l.st)s.ct+=dt;if(!l.st)s.ct=0;
   if(!RMO&&s.dnt==null&&Math.random()<dt*(s.p2t!=null?1.6:.7)){const P=g.P,sd=Math.random()<.5,wx=sd?g.L+2*P:g.R-3*P;A.add({k:'sq',x:wx,y:g.top+(10+Math.random()*30)*P,vy:30,g:260,T:1.4,col:'Y',ly:0,fy:g.bot-2*P});}},
  back(c,g,s,t){const P=g.P,jh=(g.bot-g.top)/P,gr=Math.min(1,s.age/6)*(s.p2t!=null?1:.55)*(s.dnt!=null?Math.max(0,1-s.dnt/1.5):1);if(gr<=0)return;c.save();c.globalAlpha=s.p;
   for(const sd of[0,1])for(let k=0;k<4;k++){const len=Math.round(jh*gr*(.25+.55*fhs(k,sd+2))),x=sd?g.R-(k===0?1:k===1?2:k===2?1:3)*P:g.L+(k===0?0:k===1?1:k===2?0:2)*P;if(k===3&&sd)continue;for(let j=0;j<len;j++)fxR(c,x,g.top+j*P,P,j===len-1?'o':(j%5===0?'y':'Y'));const bob=fst(t+k*.7,2)%3===0?1:0;fxR(c,x,g.top+(len+bob)*P,P,'o');}
   if(s.p2t!=null){const pw=Math.min(1,s.p2t/3);for(let x=g.L;x<g.R;x+=P){const h=Math.round(pw*(1.5+Math.sin(x*.07)+fhs(Math.round(x/P),9)*.8));for(let j=0;j<h;j++)fxR(c,x,g.bot-(j+1)*P,P,j===h-1?'y':'Y');}}c.restore();},
  front(c,g,s,t){const P=fxBP(g),x=FXS.B_sticky.x(g),rim=fxRim(g),dead=s.dnt!=null,hop=s.hp>0?-Math.round(Math.sin(s.hp/.4*Math.PI)*3):0,p2=s.p2t!=null,gl=p2&&!dead&&fst(t,4)%2;c.save();c.globalAlpha=s.p;
   for(const f of s.l.sk||[]){const Q=g.P;for(const k of[-1,1]){const len=2+(fst(t*.7+k+f.x*.01,3)%3);for(let j=0;j<len;j++)fxR(c,f.x+k*f.r*.45,f.y+f.r*.75+j*Q,Q,j===len-1?'o':'Y');}fxR(c,f.x-f.r*.3,f.y-f.r*.8,Q,'y',2,1);}
   const bottle=(ox,oy,flat)=>{const Rr=(i,j,col,w=1,h=1)=>flat?fxR(c,ox-(j+1)*P-(h-1)*P,oy+i*P,P,col,h,w):fxR(c,ox+i*P,oy+j*P,P,col,w,h);
    Rr(-3,-12,'k',7,12);Rr(-2,-12,'Y',5,11);Rr(-2,-12,'y',1,10);Rr(2,-11,'o',1,10);Rr(-2,-9,'c',5,4);Rr(0,-8,'r');Rr(-1,-7,'r',3,1);Rr(0,-6,'R');Rr(-2,-1,'o',5,1);
    Rr(-2,-15,'k',5,3);Rr(-1,-15,dead?'D':'Y',3,3);if(!dead||!flat){Rr(-2,-17,'k',5,2);Rr(-1,-17,'r',3,1);}if(gl)Rr(-1,-14,'h');};
   if(dead){const u=Math.min(1,s.dnt/.45);if(u<1)bottle(x,rim+hop,0);else bottle(x+3*P,rim-P,1);if(s.dnt>.45&&s.dnt<1.6){const q=(s.dnt-.45)/1.15;fxR(c,x-12*P-q*40,rim-4*P-Math.sin(q*Math.PI)*40,P,'k',4,2);fxR(c,x-11*P-q*40,rim-4*P-Math.sin(q*Math.PI)*40,P,'r',2,1);}}
   else bottle(x,rim+fxDrop(s,P)+hop*P,0);c.restore();},
  top(c,g,s,t){const l=s.l;if(!l.st||!(s.ct>0)||s.dnt!=null)return;const Q=g.P;c.save();c.globalAlpha=s.p;for(let k=0;k<4;k++){const a=Math.PI*(.2+k*.2),dx=Math.cos(a)*l.hr*.8,dy=Math.sin(a)*l.hr*.8,len=1+Math.min(3,Math.floor(s.ct*3+k)%4);fxR(c,l.hx+dx,l.hy+dy-Q,Q,'Y',2,1);for(let j=0;j<len;j++)fxR(c,l.hx+dx,l.hy+dy+j*Q,Q,j===len-1?'o':'Y');}fxR(c,l.hx-l.hr*.5,l.hy-l.hr*.7,Q,'y',2,1);fxR(c,l.hx-l.hr*.2,l.hy-l.hr*.9,Q,'Y',3,1);c.restore();}},
 /* The Swarm: a cloud of gnats buzzes over the jar and a few carry the fruit in your hand (only the smallest ones get through); each drop, some dive after it. Phase 2: the cloud doubles. Beaten: they scatter */
 B_swarm:{tick(s,g,dt){bossT(s,dt);const P=g.P,n=s.p2t!=null?44:26,cx=g.L+(g.R-g.L)*(.5+.32*Math.sin(s.age*.45)),cy=fxRim(g)-85*g.K+Math.sin(s.age*.8)*18*g.K,l=s.l;s.g=s.g||[];
   while(s.g.length<n)s.g.push({x:g.W+20+Math.random()*60,y:cy+(Math.random()-.5)*60,vx:-80,vy:0,ph:Math.random()*9,e:s.g.length<7,dv:0});
   const sc=s.dnt!=null;for(const q of s.g){if(q.dv>0)q.dv-=dt;let tx,ty;if(sc){const a=q.ph*2.3;tx=q.x+Math.cos(a)*200;ty=q.y+Math.sin(a)*200-40;}else if(q.dv>0){tx=q.dx;ty=q.dy;}else if(q.e&&l.can){const a=q.ph+s.age*3;tx=l.hx+Math.cos(a)*(l.hr+6*P);ty=l.hy-l.hr*.4+Math.sin(a)*l.hr*.7;}else{const a=q.ph+s.age*(1+(q.ph%1));tx=cx+Math.cos(a)*(22+q.ph*4)*g.K;ty=cy+Math.sin(a*1.3)*(14+q.ph*2)*g.K;}
    q.vx+=((tx-q.x)*(sc?1:6)-q.vx*2.4)*dt+(Math.random()-.5)*900*dt;q.vy+=((ty-q.y)*(sc?1:6)-q.vy*2.4)*dt+(Math.random()-.5)*900*dt;q.x+=q.vx*dt;q.y+=q.vy*dt;}},
  front(c,g,s,t){if(!s.g)return;const P=fxBP(g);c.save();c.globalAlpha=s.p*(s.dnt!=null?Math.max(0,1-s.dnt/1.2):1);const dk=s.p2t!=null;for(const q of s.g){const x=fq(q.x,P),y=fq(q.y,P),w=fst(t+q.ph,16)%2,d=q.vx>0?1:0;fxR(c,x,y,P,'k',2,1);fxR(c,x+(d?P:0),y,P,dk&&(q.ph*7|0)%3===0?'r':'x');if(w){fxR(c,x,y-P,P,'u');fxR(c,x+P,y-P,P,'j');}else{fxR(c,x-P,y,P,'j');fxR(c,x+2*P,y,P,'j');}}
   if(!RMO&&s.dnt==null){const u=(t*.7)%1;if(u<.5){const q=s.g[Math.floor(t*.7)%s.g.length];if(q){c.globalAlpha*=1-u*2;T(c,'z',q.x+8,q.y-10-u*20,11+u*6,'#3b2346','center',FD);}}}c.restore();},
  ev(s,n,o,A,g){if(n!=='drop'||!s.g||s.dnt!=null)return;let k=0;for(const q of s.g){if(k>=8)break;if(q.e)continue;q.dv=.55;q.dx=o.x+(Math.random()-.5)*30;q.dy=g.top+40*g.K+Math.random()*30;k++;}}},
 /* The Rot: mould creeps across the jar floor and a grumpy toadstool on the rim puffs spores into the jar; every fruit that goes mouldy sprouts a little mushroom. Phase 2: the toadstool swells and puffs twice as often, the mould climbs higher. Beaten: it shrivels and the mould fades */
 B_rot:{x(g){return fq(fxRX('B_rot',.2,44,g),fxBP(g));},
  tick(s,g,dt,A){bossT(s,dt);if(s.pf>0)s.pf-=dt;s.nt=(s.nt==null?1.5:s.nt)-dt;if(s.nt<=0&&s.dnt==null&&!RMO){s.nt=s.p2t!=null?1.3:2.6;s.pf=.35;const P=fxBP(g),x=FXS.B_rot.x(g),y=fxRim(g)-14*P;for(let k=0;k<8;k++)A.add({k:'sq',x:x+(Math.random()-.5)*10*P,y,vx:(Math.random()-.3)*60,vy:-35-Math.random()*30,g:24,T:2.6+Math.random(),col:['G','V','g','r'][k%4],s:k%3?1:2,sw:6,sf:2,ph:k,fa:.5,dr:.4});}},
  back(c,g,s,t){const P=g.P,gr=Math.min(1,s.age/7)*(s.p2t!=null?1.7:1)*(s.dnt!=null?Math.max(0,1-s.dnt/1.6):1);if(gr<=0)return;c.save();c.globalAlpha=s.p;for(let x=g.L,i=0;x<g.R;x+=P,i++){const h=Math.round(gr*(2.4+1.6*Math.sin(i*.31)+1.2*Math.sin(i*.83+1)+fhs(i,4)));for(let j=0;j<h;j++){const y=g.bot-(j+1)*P,top=j===h-1;if(top&&FBY[(i&3)*4+(j&3)]>9)continue;fxR(c,x,y,P,top?(fhs(i,j)>.5?'l':'s'):j>h-3?'u':'U');}if(fhs(i,7)>.85&&h>2)fxR(c,x,g.bot-2*P,P,'g');if(fhs(i,8)>.9&&h>3)fxR(c,x,g.bot-3*P,P,'w');}c.restore();},
  front(c,g,s,t){const P=fxBP(g),x=FXS.B_rot.x(g),rim=fxRim(g),dead=s.dnt!=null,big=s.p2t!=null?1:0,sh=dead?Math.min(1,s.dnt/1):0,R=fxPt(c,x,rim+fxDrop(s,P),P);c.save();c.globalAlpha=s.p;
   for(const f of s.l.m||[]){const Q=g.P,ty=f.y-f.r*.8;if(f.m>=1){const M=fxPt(c,fq(f.x,Q),fq(ty,Q),Q);M(-1,-1,'k',3,2);M(0,-1,'c',1,2);M(-2,-3,'k',5,2);M(-3,-2,'k',7,1);M(-1,-4,'k',3,1);M(-2,-2,'V',5,1);M(-1,-3,'P',3,1);M(-1,-2,'l');M(1,-3,'w');}else for(let k=0;k<Math.ceil(f.m*4);k++)fxR(c,f.x+(k-1.5)*Q*1.6,ty-((k*7)%3)*Q,Q,k%2?'l':'g');}
   const k=dead&&sh>.4?'rtD':big?'rtV':'rtA',sq=s.pf>0?P:0,y=rim+fxDrop(s,P)+sq+(dead?Math.round(sh*3)*P:0);fxS(c,k,x+(dead?0:(fst(t,2)%2?P:0)),y,P);if(!dead&&(t%3.1)<.13){fxR(c,x-P,y-5*P,P,'c');fxR(c,x+P,y-5*P,P,'c');}if(big&&!dead&&fst(t,3)%2)fxR(c,x,y-16*P,P,'G');c.restore();},
  ev(s,n,o,A,g){if(n!=='mould'||!s.l.p)return;A.burst(o.x,o.y-(o.r||20)*.6,['l','g','P'],10,{v:70,vy:-40,g:40,T:.9});}},
 /* The Tide: a sleepy moon hangs in the sky pulling the line up and down, waves lap along the line and a buoy bobs on it. Phase 2: a blood moon and taller waves. Beaten: the moon winks and sinks, the water calms */
 B_tide:{tick(s,g,dt){bossT(s,dt);},front(c,g,s,t){const P=g.P,BP=fxBP(g),u=s.l.u||0,dead=s.dnt!=null,dn=dead?Math.min(1,s.dnt/1.4):0,p2=s.p2t!=null,amp=(p2?2.4:1.4)*(1-dn)*Math.min(1,s.age/1.2),wv=fst(t,8);c.save();c.globalAlpha=s.p;
   for(let x=g.L,i=0;x<g.R;x+=P,i++){const v=Math.sin(i*.33-wv*.7)+.5*Math.sin(i*.12+wv*.3),h=1+Math.max(0,Math.round(amp*(.8+.7*v)));for(let j=0;j<h;j++){c.globalAlpha=s.p*(j===h-1?.95:.7);fxR(c,x,g.top-(j+2)*P,P,j===h-1?(v>.9?'w':'b'):j===0?'B':'b');}}c.globalAlpha=s.p;
   const by=fq(g.top-2*P-Math.round(amp*(1+Math.sin(5*.33-wv*.7)))*P,P),bx=fq(g.L+7*P,P),Bb=fxPt(c,bx,by,P);Bb(-2,-1,'k',5,2);Bb(-1,-1,'B',3,1);Bb(-2,-6,'k',5,5);Bb(-1,-6,'r',3,2);Bb(-1,-4,'w',3,1);Bb(-1,-3,'r',3,1);Bb(-1,-8,'k',3,2);Bb(0,-8,fst(t,1.5)%2?'y':'D');
   const mx=fq(g.L+(g.R-g.L)*.83,BP),my=fq(fxRim(g)-(84+u*28)*g.K+dn*140,BP),r=7,M=fxPt(c,mx,my,BP),wink=dead&&s.dnt<.7;c.globalAlpha=s.p*Math.max(0,1-dn*.9);
   for(let j=-r-3;j<=r+3;j++)for(let i=-r-3;i<=r+3;i++){const d=i*i+j*j;if(d>(r+3)*(r+3)||d<=(r+1)*(r+1))continue;if(FBY[((i+40)&3)*4+((j+40)&3)]<(d<(r+2)*(r+2)?7:3))M(i,j,p2?'q':'h');}
   fxEl(c,mx,my,BP,r,r,(i,j,e)=>e?'k':p2?(fhs(i,j)>.82?'R':i+j<-4?'q':'r'):(fhs(i,j)>.82?'j':i+j<-4?'w':'i'));
   if(p2){M(-4,-3,'k',3,1);M(2,-3,'k',3,1);M(-3,-2,'k',2,1);M(2,-2,'k',2,1);M(-2,3,'k',5,1);}else{M(-4,-1,'k',3,1);if(wink)M(2,-2,'k',2,2);else M(2,-1,'k',3,1);M(-1,3,'k',3,1);M(-2,2,'k');M(2,2,'k');M(-5,1,'p');M(4,1,'p');}
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
   /* the scythe: pole behind the robe, blade in front over the hood; swings around the far hand */
   const sw=s.sw>0?Math.min(3,Math.floor((1-s.sw/.75)*4)):0,ang=dead?.12-Math.min(1.69,dn*3.2):[.12,-.45,.7,1.25][sw],cs=Math.cos(ang),sn=Math.sin(ang),hx=6,hy=-17,pt=(a,b)=>[hx+Math.round(a*cs-b*sn),hy+Math.round(a*sn+b*cs)];
   const pole=[];for(let k=-9;k<=24;k++)pole.push(pt(0,-k));for(const[i,j]of pole){R(i-1,j,'k');R(i+1,j,'k');}for(const[i,j]of pole)R(i,j,'N');for(const[i,j]of pole.filter((q,k)=>k%3===0))R(i,j,'n');
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
   R(hx-1,hy,'s');R(hx,hy+1,'d');R(hx-1,hy+1,'s');R(hx+1,hy,'k');
   /* the blade */
   const bl=[];for(let k=0;k<=19;k++){const yb=-24-Math.round(k*k*.012)+Math.round(k*.25),th=k<15?3:k<18?2:1;for(let q=0;q<th;q++)bl.push([-k,yb+q,q===0?(p2?'q':'w'):q===1?'s':'d']);}for(const[a,b]of bl){const[i,j]=pt(a,b-1);R(i,j,'k');const[i2,j2]=pt(a,b+1);R(i2,j2,'k');}for(const[a,b,col]of bl){const[i,j]=pt(a,b);R(i,j,col);}
   {const gk=Math.floor((t*7)%26);if(gk<20&&!dead){const[i,j]=pt(-gk,-24-Math.round(gk*gk*.012)+Math.round(gk*.25));R(i,j,'w');fxStar(c,x+i*P,y0+j*P,g.P,gk%3?1:2,p2?'r':'b');}}
   if(s.sw>0&&sw>=2){c.globalAlpha=s.p*.45;for(let k=0;k<14;k++){const a2=ang-.5-k*.06,r2=20+k*.15;const i=hx+Math.round(-r2*Math.cos(a2)*.9),j=hy+Math.round(-r2*Math.sin(a2)*.9);R(i,j,'w');R(i+1,j,'s');}c.globalAlpha=s.p*fade;}
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
