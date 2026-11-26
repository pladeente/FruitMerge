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
 const A={pp,S,g:null,get t(){return t},
  add(q){q.t=0;q.vx=q.vx||0;q.vy=q.vy||0;q.ly=q.ly==null?1:q.ly;pp.push(q);return q;},
  burst(x,y,cols,n,o={}){for(let k=0;k<n;k++){const a=Math.random()*Math.PI*2,v=(o.v||120)*(.4+Math.random()*.8);A.add({k:'sq',x:x+(Math.random()-.5)*(o.w||0),y,vx:Math.cos(a)*v+(o.vx||0),vy:Math.sin(a)*v+(o.vy||0),g:o.g==null?300:o.g,T:o.T||(.5+Math.random()*.4),col:cols[k%cols.length],s:o.s||1,ly:o.ly,dr:o.dr});}},
  tick(dt,g,lv){A.g=g;t+=dt;for(const id in FXS){const sc=FXS[id],s=S[id]||(S[id]={p:0,o:0,on:false,ton:9}),l=lv[id]||{},on=!!(l.p&&l.on);s.l=l;if(on!==s.on){s.on=on;s.ton=0;}else s.ton+=dt;s.p=fxA(s.p,l.p?1:0,dt*4);s.o=fxA(s.o,on?1:0,dt*(on?5:3));if(sc.tick&&(s.p>0||l.p))sc.tick(s,g,dt,A);}
   for(let i=pp.length-1;i>=0;i--){const q=pp[i];q.t+=dt;if(q.dl&&q.t<q.dl)continue;if(q.t>=q.T){pp.splice(i,1);if(q.end)q.end(A,g,q);continue;}const d=dt;q.vy+=(q.g||0)*d;q.x+=q.vx*d;q.y+=q.vy*d;if(q.dr){q.vx*=1-q.dr*d;q.vy*=1-q.dr*d;}if(q.fy!=null&&q.y>q.fy){q.y=q.fy;q.vy=-q.vy*(q.bo||0);q.vx*=.6;}}},
  back(c,g){for(const id in FXS){const s=S[id];if(s&&s.p>0&&FXS[id].back)FXS[id].back(c,g,s,t,A);}fxPP(c,g,pp,t,0);},
  front(c,g){for(const id in FXS){const s=S[id];if(s&&s.p>0&&FXS[id].front)FXS[id].front(c,g,s,t,A);}fxPP(c,g,pp,t,1);},
  hit(id,o={}){if(id==='marathon'){A.hit(S.early&&S.early.on?'early':'clutch',o);return;}const ks=[].concat(FXH[id]||id),q=Object.assign({src:id},o);for(const k of ks){const s=S[k];if(s&&s.p>0&&FXS[k]&&FXS[k].hit&&A.g)FXS[k].hit(s,q,A,A.g);}},
  ev(n,o={}){if(!A.g)return;for(const id in FXS){const s=S[id];if(s&&FXS[id].ev)FXS[id].ev(s,n,o,A,A.g);}}};
 return A;}
/* which scenes a charm's merge plays: fusions play both halves' scenes, each scene checks o.src to play only when its half applies */
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
 early:{tick(s,g,dt){const P=g.P,px=g.L+(g.R-g.L)*.7,py=fxRim(g);s.st=s.st||'gone';s.ft=(s.ft||0)+dt;
   if(s.on&&(s.st==='gone'||s.st==='out')){s.st='in';s.ft=0;s.x0=g.W+30;s.y0=py-170;}if(!s.on&&(s.st==='sit'||s.st==='in')){s.st='out';s.ft=0;s.x0=s.bx;s.y0=s.by;}
   if(s.st==='in'){const u=Math.min(1,s.ft/1),e=1-(1-u)*(1-u);s.bx=s.x0+(px-s.x0)*e;s.by=s.y0+(py-s.y0)*e-Math.sin(u*Math.PI)*24;if(u>=1){s.st='sit';s.hop=.25;}}
   else if(s.st==='out'){const u=Math.min(1,s.ft/1.2);s.bx=s.x0-u*g.W*.8;s.by=s.y0-u*u*320-Math.sin(u*Math.PI)*20;if(u>=1)s.st='gone';}
   else if(s.st==='sit'){s.bx=px;s.by=py;}for(const k of['hop','sg'])if(s[k]>0)s[k]-=dt;},
  front(c,g,s,t){if(!s.st||s.st==='gone')return;const P=g.P;let fr='b0',y=s.by,fl=0;if(s.st!=='sit')fr=fst(t,12)%2?'bF0':'bF1';else{if(s.sg>0)fr=fst(s.sg,8)%2?'bS':'b0';else if((RMO?1:t%2.8)<.12)fr='bB';if(s.hop>0)y-=(s.hop>.12?2:1)*P;fl=s.lk&&s.hop>0?1:0;}c.save();c.globalAlpha=s.p;fxS(c,fr,s.bx,y,P,{fl});c.restore();},
  ev(s,n,o){if(n==='drop'&&s.st==='sit'){s.hop=.25;s.lk=o.x>s.bx;}},
  hit(s,o,A,g){if(s.st!=='sit')return;s.sg=.6;const P=g.P;for(let k=0;k<3;k++)A.add({k:'spr',sp:k%2?'nt2':'nt',x:s.bx-7*P,y:s.by-10*P,vx:-16-k*12,vy:-50,T:1.2,dl:k*.18,sw:6,sf:6,ph:k,fa:.55});}},
 /* Photo Finish (and Marathon): for the last drops a chequered flag runs up a pole on the rim and the bottom of the frame turns into a finish line. A merge it scores on: a camera flash, a viewfinder and a photo of the fruit */
 clutch:{tick(s,g,dt){if(s.fh>0)s.fh-=dt;},
  back(c,g,s,t){if(s.o<=0)return;c.save();c.globalAlpha=Math.ceil(s.o*3)/3;const B=3;for(let x=g.L-6;x<g.R+6;x+=B)for(let r=0;r<3;r++)fxR(c,x,g.bot-B+r*B,B,((Math.round(x/B)+r)&1)?'k':'w');c.restore();},
  front(c,g,s,t){const P=g.P,px=fq(g.L+(g.R-g.L)*.82,P),base=fxRim(g),ph=30;c.save();c.globalAlpha=s.p;fxR(c,px-2*P,base-P,P,'k',5,1);fxR(c,px-P,base-2*P,P,'D',3,1);for(let j=2;j<ph;j++){fxR(c,px-P,base-(j+1)*P,P,'k');fxR(c,px,base-(j+1)*P,P,j%6===0?'s':'d');fxR(c,px+P,base-(j+1)*P,P,'k');}fxR(c,px-P,base-(ph+2)*P,P,'k',3,3);fxR(c,px,base-(ph+1)*P,P,'y');
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
  x0(g){return fq(g.L+(g.R-g.L)*.13,g.P);},
  pos(s,g){const P=g.P,b=OAKS[s.sg||0].b[0];return[FXS.oak.x0(g)+b[0]*P,fxRim(g)+b[1]*P,b[2]*P];},
  leaf(s,g,A,n){const[x,y,r]=FXS.oak.pos(s,g);for(let k=0;k<n;k++)A.add({k:'sq',x:x+(Math.random()-.5)*r*1.8,y:y+(Math.random()-.3)*r,vx:(Math.random()-.5)*30+12,vy:22+Math.random()*25,T:3+Math.random()*1.5,col:['g','l','G','Y'][k%4],sw:9,sf:2+Math.random(),ph:Math.random()*6,fa:.75});},
  front(c,g,s,t){const P=g.P,sw=fst(t,1.3)%2,sk=s.rs>0?(fst(t,16)%2?1:-1):0,o=oakCv(s.sg||0,sw),x0=FXS.oak.x0(g),dx=fq(x0+sk*P-o.ox*P,P),dy=fq(fxRim(g)-o.oy*P,P),w=o.cv.width*P,h=o.cv.height*P;c.save();c.imageSmoothingEnabled=false;c.globalAlpha=s.p;c.drawImage(o.cv,dx,dy,w,h);if(s.gw>0&&fst(s.gw,14)%2){c.globalCompositeOperation='lighter';c.drawImage(o.cv,dx,dy,w,h);c.drawImage(o.cv,dx,dy,w,h);}c.restore();},
  ev(s,n,o,A,g){if(n==='grow'&&o.id==='oak'&&s.p>0)FXS.oak.grow(s,o,A,g);},
  grow(s,o,A,g){s.rs=.42;FXS.oak.leaf(s,g,A,5);const[x,y,r]=FXS.oak.pos(s,g);A.add({k:'spr',sp:'acn',x:x+(Math.random()-.5)*r,y:y+r*.4,vx:20,vy:-80,g:700,T:1.5,fa:.75});}},
 /* Tiki Bar: a totem on the jar rim with one carved face for every Pineapple merge it has grown on, torches lit on top. A new face drops onto the stack with a puff of dust */
 tiki:{tick(s,g,dt,A){const n=Math.round((s.l.v||0)/.25);if(s.n==null)s.n=n;if(n>s.n){s.dr=.45;s.n=n;}else if(n<s.n)s.n=n;if(s.dr>0){s.dr-=dt;if(s.dr<=0){A.burst(FXS.tiki.x0(g),FXS.tiki.ty(s,g)+9*g.P,['E','s','c','n'],12,{v:100,vy:-30,g:260,T:.5,w:30});s.fl=.6;}}if(s.fl>0)s.fl-=dt;},
  x0(g){return fq(g.R-(g.R-g.L)*.13,g.P);},
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
  front(c,g,s,t){const P=g.P,r=Math.round(s.rd||4),rest=fq(g.L+(g.R-g.L)*.37,P),from=fq(g.R-(g.R-g.L)*.3,P),u=s.ro>0?1-s.ro/1.6:1,e=1-Math.pow(1-u,2.2),cx=fq(from+(rest-from)*e,P),cy=fq(fxRim(g)-(r+1)*P,P),ang=s.ro>0?-(from-cx)/(r*P):0;c.save();c.globalAlpha=s.p;s.bx=cx;
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
function fxCoin(c,x,y,P,w,tl){x=fq(x,P);y=fq(y,P);const h=7;for(let j=-h;j<=h;j++){const hw=Math.max(0,Math.round(w*Math.sqrt(1-(j/(h+.5))**2)));for(let i=-hw;i<=hw;i++){const e=Math.abs(i)===hw||Math.abs(j)===h||(Math.abs(i)===hw-1&&Math.abs(j)>=h-1),rim=Math.abs(i)>=hw-1||Math.abs(j)>=h-1,st=w>=5&&((i===0&&Math.abs(j)<=3)||(j===0&&Math.abs(i)<=3)||(Math.abs(i)===1&&Math.abs(j)===1));fxR(c,x+i*P,y+j*P,P,e?'k':tl?(st?'D':rim?'d':'s'):(st?'Y':rim?'Y':(i<0&&j<0?'h':'y')));}}}
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
 cstage:{tick(s,g,dt){if(s.fh>0)s.fh-=dt;},
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
 perch(s,g){if(s.tg)return[s.tg.f.x,s.tg.f.y-s.tg.r*.82];return[g.L+(g.R-g.L)*.56,fxRim(g)];},
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
txB:`
.....kkkkk....
.....kxxxk....
.....kxxxk....
.....krrrk....
...kkkkkkkkk..
....kffffffk..
...kwwkwwfFk..
...kkkfkkffk..
....kNNNNffk..
.....kffffk...
....kDwrwDk...
...kDDwrwDDk..
..kDDDDrDDDDk.
..kfkDDDDDkfk.
...kDDDDDDDk..
...kDDDDDDDk..`,
txL0:`
....kDDkDDk...
....kDDkDDk...
...kkkk.kkkk..`,
txL1:`
...kDDk.kDDk..
..kDDk...kDDk.
..kkkk...kkkk.`,
txL2:`
....kDDDDk....
.....kDDk.....
....kkkkkk....`,
thB:`
...kkkkk.....
..kxxxxxk....
.kxxxxxxxk...
kkkkkkkkkkk..
.kffffffffk..
.kkkkkkkkkk..
.kkwwkkwwkk..
.kffffffffk..
..kfNNNNfk...
...kkkkkk....
..kkkkkkkk...
.kwwwwwwwwk..
kfkkkkkkkkfk.
.kwwwwwwwwk..
..kkkkkkkk...
..kxxxxxxk...`,
thL0:`
..kxxkkxxk...
..kxxk.kxxk..
..kkkk.kkkk..`,
thL1:`
.kxxk..kxxk..
kxxk....kxxk.
kkkk....kkkk.`,
crown:`
.k....k....k.
kyk..kyk..kyk
kyyk.kyk.kyyk
kyyykyyykyyyk
kyryybyybyryk
kyyyyyyyyyyyk
kYYYYYYYYYYYk
.kkkkkkkkkkk.`});
function fxSack(c,x,y,P,z,on){x=fq(x,P);y=fq(y,P);const r=z;for(let j=-r;j<=r;j++)for(let i=-r;i<=r;i++){if(i*i+j*j>r*r+r*.6)continue;const e=(i+1)**2+j*j>r*r+r*.6||(i-1)**2+j*j>r*r+r*.6||i*i+(j+1)**2>r*r+r*.6||i*i+(j-1)**2>r*r+r*.6;fxR(c,x+i*P,y+j*P,P,e?'k':(i+j>r*.6?'N':i+j<-r*.6?'E':'e'));}fxR(c,x-P,y-(r+1)*P,P,'k',3,1);fxR(c,x-2*P,y-(r+2)*P,P,'k',1,1);fxR(c,x+2*P,y-(r+2)*P,P,'k',1,1);if(on){fxR(c,x,y-P,P,'y');fxR(c,x,y+P,P,'y');fxR(c,x-P,y,P,'y',3,1);}}
/* a storm cloud: overlapping blobs, dark underneath, with a face; m = mood 0 grumpy, 1 shouting, 2 furious */
function fxCloud(c,x,y,P,w,m,t,tint){const bl=[[0,0,w*.32],[-w*.3,w*.06,w*.22],[w*.3,w*.05,w*.24],[-w*.12,-w*.14,w*.24],[w*.15,-w*.12,w*.2]],R=bl.map(b=>b.map(v=>v/P));const cx=Math.round(x/P),cy=Math.round(y/P),ins=(i,j)=>R.some(([a,b,r])=>(i-a)**2+(j-b)**2<=r*r);const W2=Math.ceil(w/P*.62),H2=Math.ceil(w/P*.42);
 for(let j=-H2;j<=H2;j++)for(let i=-W2;i<=W2;i++){if(!ins(i,j))continue;const e=!ins(i+1,j)||!ins(i-1,j)||!ins(i,j+1)||!ins(i,j-1);const sh=j>H2*.25?(tint?'U':'D'):j<-H2*.4?(tint?'s':'d'):(tint?'u':'D');fxR(c,(cx+i)*P,(cy+j)*P,P,e?'k':(j<-H2*.5&&FBY[((i+40)&3)*4+((j+40)&3)]<5?'s':sh));}
 const ey=cy-1,bl2=fst(t,1)%4===0&&m===0;for(const d of[-1,1]){const ex=cx+d*4;fxR(c,(ex-1)*P,(ey-3)*P+(m?P*(d>0?-1:-1):0),P,'k',3,1);if(m)fxR(c,(ex+(d>0?-1:1))*P,(ey-2)*P,P,'k');if(bl2)fxR(c,(ex-1)*P,ey*P,P,'k',3,1);else{fxR(c,(ex-1)*P,(ey-1)*P,P,m>1?'r':'w',3,3);fxR(c,(ex-d*0)*P,ey*P,P,'k');}}
 if(m)fxR(c,(cx-2)*P,(cy+3)*P,P,'k',5,m>1?3:2);else fxR(c,(cx-2)*P,(cy+3)*P,P,'k',5,1);}
Object.assign(FXS,{
 /* The Taxman: walks along the rim with his ledger and pockets a coin from you every few drops, his sack fattening. Phase 2: dollar-sign eyes and a bigger sack. Beaten: drops his papers and runs */
 B_tax:{tick(s,g,dt,A){bossT(s,dt);const P=fxBP(g),home=fq(g.L+(g.R-g.L)*.74,P);if(s.age<.05||s.x==null){s.x=g.W+40;s.bag=0;}if(s.dnt!=null){s.x+=dt*230;if(!s.drop){s.drop=1;for(let k=0;k<6;k++)A.add({k:'fn',x:s.x-6*P,y:fxRim(g)-14*P,vx:-40+Math.random()*-80,vy:-60-Math.random()*40,g:160,dr:.6,T:2.4,fa:.6,sw:10,sf:3,ph:k,d:(c,q,g)=>{const P=g.P;fxR(c,q.x,q.y,P,'k',4,1);fxR(c,q.x,q.y+P,P,'w',4,2);fxR(c,q.x,q.y+3*P,P,'k',4,1);fxR(c,q.x+P,q.y+P,P,'s',2,1);}});}}else if(s.x>home)s.x=Math.max(home,s.x-dt*120);if(s.ct>0)s.ct-=dt;},
  front(c,g,s,t){const P=fxBP(g),rim=fxRim(g),walk=s.x!==fq(g.L+(g.R-g.L)*.74,g.P),x=s.x,p2=s.p2t!=null;c.save();c.globalAlpha=s.p;const leg=walk?['txL1','txL2'][fst(t,8)%2]:'txL0',bob=walk&&fst(t,8)%2?P:0;fxS(c,leg,x,rim,P);fxS(c,'txB',x,rim-3*P-bob,P);
   if(p2&&(s.p2t<1.4||fst(t,2)%4===0)){fxR(c,x-4*P,rim-16*P-bob,P,'y',2,1);fxR(c,x-P,rim-16*P-bob,P,'y',2,1);fxR(c,x-4*P,rim-15*P-bob,P,'Y',2,1);fxR(c,x-P,rim-15*P-bob,P,'Y',2,1);}
   const sz=Math.round(Math.min(5,2+(s.bag||0)*.5+(p2?1.5:0))),sx=x-(6+sz)*P,sy=Math.min(rim-(sz+1)*P,rim-6*P+sz*P)-(s.ct>0?4*P:0)-bob;fxLn(c,x-5*P,rim-6*P-bob,sx+P,sy-(sz+1)*P,P,FXP.k);fxSack(c,sx,sy,P,sz,1);
   if(s.dnt==null){const wr=!walk&&fst(t,3)%2;fxR(c,x+4*P,rim-11*P-bob,P,'k',4,5);fxR(c,x+4*P,rim-11*P-bob,P,'R',4,4);fxR(c,x+5*P,rim-11*P-bob,P,'w',2,3);if(wr)fxR(c,x+5*P,rim-12*P-bob,P,'k',1,2);}c.restore();},
  ev(s,n,o,A,g){if(n!=='tax'||!s.l.p)return;s.ct=.5;s.bag=(s.bag||0)+1;const P=fxBP(g),tx=s.x-10*P,ty=fxRim(g)-11*P;A.add({k:'fn',x:g.L+6,y:g.H-14,vx:(tx-g.L)/.55,vy:(ty-g.H-.5*1400*.3)/.55,g:1400,T:.55,fa:1,d:(c,q,g)=>fxCoin(c,q.x,q.y,g.P*.67,[4,2,1,2][fst(q.t,16)%4],0),end:(A)=>{A.burst(tx,ty,['y','Y','w'],6,{v:90,T:.4});}});A.add({k:'fn',x:tx,y:ty-6*P,vy:-30,T:.9,fa:.5,d:(c,q,g)=>T(c,'-1',q.x,q.y,18,'#e63946','center',FD)});}},
 /* The Storm: a scowling storm cloud rolls over the jar and rains into it. Each whirlpool it throws a lightning bolt at the jar. Phase 2: bigger, darker, red-eyed, heavier rain. Beaten: it breaks up and a rainbow arcs over the jar */
 B_storm:{tick(s,g,dt,A){bossT(s,dt);if(s.bt>0)s.bt-=dt;if(s.fl>0)s.fl-=dt;const P=g.P,heavy=s.p2t!=null;if(s.dnt==null&&s.age>.6&&!RMO){const n=heavy?55:28;for(let k=0;k<n*dt;k++)A.add({k:'fn',x:g.L+Math.random()*(g.R-g.L+80)-40,y:fxRim(g)-95,vx:heavy?-140:-70,vy:520,T:.9,fa:.9,ly:1,d:(c,q,g)=>{if(q.y>g.bot)return;const P=g.P;c.globalAlpha*=.6;fxR(c,q.x,q.y,P,'b',1,2);fxR(c,q.x-P,q.y+2*P,P,'B');}});}if(s.dnt!=null&&!s.rb){s.rb=1;const cx=FXS.B_storm.cx(s,g),cy=fxRim(g)-110;for(let k=0;k<10;k++)A.add({k:'fn',x:cx+(k-5)*14,y:cy,vx:(k-5)*30,vy:-20-Math.random()*20,T:1.1,fa:.3,z:4+k%3,d:(c,q,g)=>{const P=g.P;for(let j=-q.z;j<=q.z;j++)for(let i=-q.z;i<=q.z;i++)if(i*i+j*j<=q.z*q.z)fxR(c,q.x+i*P,q.y+j*P,P,(i*i+j*j>q.z*q.z-q.z)?'k':'s');}});}},
  cx(s,g){const u=Math.min(1,(s.age||0)/1.2),e=1-Math.pow(1-u,3);return g.L-120+(g.L+(g.R-g.L)*.5+120-g.L)*e;},
  back(c,g,s,t){if(s.dnt!=null&&s.dnt>1)return;c.save();c.globalAlpha=(s.p2t!=null?.16:.1)*Math.min(1,s.age/.8)*(s.dnt!=null?Math.max(0,1-s.dnt):1);c.fillStyle=FXP.U;c.fillRect(g.L,g.top,g.R-g.L,g.bot-g.top);c.restore();},
  front(c,g,s,t){const P=g.P,heavy=s.p2t!=null,cx=FXS.B_storm.cx(s,g),cy=fxRim(g)-118+Math.round(Math.sin(t*1.3))*P;c.save();
   if(s.bt>0){const x1=s.bx,pts=[[cx,cy+40]];let y=cy+40,x=cx;while(y<g.top+60){y+=26;x+=(Math.random()-.5)*50+(x1-x)*.25;pts.push([x,y]);}pts.push([x1,g.top+(g.bot-g.top)*.55]);for(const[col,o]of[['k',P],['y',0]])for(let i=1;i<pts.length;i++){fxLn(c,pts[i-1][0]+o,pts[i-1][1],pts[i][0]+o,pts[i][1],P,FXP[col]);if(!o)fxLn(c,pts[i-1][0]+P,pts[i-1][1],pts[i][0]+P,pts[i][1],P,FXP.w);}}
   if(s.dnt==null||s.dnt<.15){c.globalAlpha=s.p;fxCloud(c,cx,cy,P,heavy?190:150,s.bt>0?1:heavy?2:0,t,0);}
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
 /* The Thief: tiptoes along the rim, reaches up and drops your leftmost charm into his sack, where you can see it; glances about while he holds it. Phase 2: reaches up for a second. Beaten: drops the sack, the charms fly home and he runs */
 B_thief:{tick(s,g,dt,A){bossT(s,dt);const P=fxBP(g),home=fq(g.L+(g.R-g.L)*.3,P);if(s.age<.05||s.x==null){s.x=-40;s.got=0;s.gr=0;}const want=(s.l.ids||[]).length;if(s.dnt!=null){s.x-=dt*240;if(!s.back){s.back=1;(s.l.ids||[]).forEach((id,k)=>A.add({k:'fn',x:home+6*P,y:fxRim(g)-10*P,vx:-30+k*30,vy:-520,g:200,T:.9,fa:.8,id,d:(c,q,g)=>fxIcon(c,q.id,q.x,q.y,g.P)}));}}
   else if(s.x<home)s.x=Math.min(home,s.x+dt*70);else if(s.got<want&&!(s.gr>0)){s.gr=.9;}if(s.gr>0){s.gr-=dt;if(s.gr<=.35&&s.got<want&&!s.drp){s.drp=1;const id=s.l.ids[s.got];A.add({k:'fn',x:home+5*P,y:-20,vy:300,g:900,T:Math.max(.2,(fxRim(g)-12*P+20)/600),fa:1,id,d:(c,q,g)=>fxIcon(c,q.id,q.x,q.y,g.P),end:()=>{s.got++;s.drp=0;}});}}},
  front(c,g,s,t){const P=fxBP(g),rim=fxRim(g),home=fq(g.L+(g.R-g.L)*.3,P),walk=s.x!==home,x=s.x,reach=s.gr>0;c.save();c.globalAlpha=s.p;const leg=walk?['thL1','thL0'][fst(t,6)%2]:'thL0',bob=walk?(fst(t,6)%2?-P:0):0,look=!walk&&!reach&&s.dnt==null?(fst(t,.7)%2?1:0):0;
   fxS(c,leg,x,rim,P,{fl:look||s.dnt!=null});fxS(c,'thB',x,rim-3*P+bob,P,{fl:look||s.dnt!=null});
   if(reach){fxLn(c,x+4*P,rim-12*P,x+5*P,rim-27*P,P,FXP.k);fxLn(c,x+5*P,rim-12*P,x+6*P,rim-27*P,P,FXP.f);}
   if(s.dnt==null){const sx=x+6*P,sy=rim-5*P;fxSack(c,sx,sy,P,4,0);(s.l.ids||[]).slice(0,s.got).forEach((id,k)=>fxIcon(c,id,sx+(k?3:-1)*P,sy-6*P-k*2*P,P));}c.restore();},
  ev(){}},
 /* The Melon Queen: royal pennants unfurl from the rim corners and a crown comes down onto her Watermelon. Phase 2: the crown glows red-hot as she hurls her rock. Beaten: her crown pops off and rolls away across the floor */
 B_melon:{tick(s,g,dt,A){bossT(s,dt);const q=s.l.q;if(q){s.qx=q.x;s.qy=q.y;s.qr=q.r;}if(s.dnt!=null&&!s.cr){s.cr={x:s.qx,y:s.qy-(s.qr||60)*.9,vx:150,vy:-260,r:0};A.burst(s.qx,s.qy-(s.qr||60),['y','Y','w'],12,{v:180,T:.6});}if(s.cr){const c=s.cr;c.vy+=900*dt;c.x+=c.vx*dt;c.y+=c.vy*dt;if(c.y>g.bot-8*g.P){c.y=g.bot-8*g.P;c.vy=-c.vy*.35;c.vx*=.85;}if(c.x>g.R-8*g.P){c.x=g.R-8*g.P;c.vx=-c.vx*.6;}c.r+=c.vx*dt/14;}if(s.cf>0)s.cf-=dt;if(s.age<.05)for(let k=0;k<20;k++)A.add({k:'sq',x:g.L+Math.random()*(g.R-g.L),y:fxRim(g)-60-Math.random()*60,vx:(Math.random()-.5)*60,vy:40+Math.random()*60,T:2+Math.random(),col:['y','r','m','b','g'][k%5],sw:6,sf:3,ph:k,fa:.7,dl:.6+Math.random()*.6});},
  front(c,g,s,t){const P=g.P,rim=fxRim(g),u=Math.min(1,s.age/1.2);c.save();c.globalAlpha=s.p;
   for(const sd of[-1,1]){const px=sd<0?g.L-2:g.R+2,len=Math.round(14*Math.min(1,s.age/.9)*(s.dnt!=null?Math.max(0,1-s.dnt):1));fxR(c,px-P,rim-24*P,P,'k',3,24);fxR(c,px,rim-24*P,P,'Y',1,24);fxR(c,px-P,rim-26*P,P,'y',3,2);for(let i=0;i<len;i++){const w=Math.round(8*(1-i/16)),dy=Math.round(Math.sin(i*.5-fst(t,6)*.9)*1);for(let j=0;j<w;j++){const x=px-sd*(i+2)*P,y=rim-22*P+(j+dy)*P;fxR(c,x,y,P,j===0||j===w-1||i===len-1?'k':(j<w/2?'r':'R'));}if(i%4===1)fxR(c,px-sd*(i+2)*P,rim-22*P+(Math.round(w/2)+dy)*P,P,'y');}}
   if(s.qx!=null&&!s.cr){const cy=s.qy-(s.qr||60)*.86-Math.round((1-u)*(1-u)*120)*P,hot=s.p2t!=null;if(hot&&!RMO){for(let k=0;k<3;k++){const q=(t*2+k/3)%1;fxR(c,s.qx+(k-1)*4*P,cy-(10+q*8)*P,P,q<.5?'o':'r');}}fxS(c,'crown',s.qx,cy,2*P);if(hot&&fst(t,6)%2){c.globalCompositeOperation='lighter';c.globalAlpha=s.p*.5;fxS(c,'crown',s.qx,cy,2*P);}
    if(u<1){c.globalAlpha=s.p;fxStar(c,s.qx,cy-10*P,P,[0,1,2,3,2,1][Math.floor(u*6)],'y');}}
   if(s.cr){c.globalAlpha=s.p;fxS(c,'crown',s.cr.x,s.cr.y,2*P,{ay:.5,r:Math.floor(s.cr.r)%4});}c.restore();},
  ev(s,n,o,A,g){if(n!=='mrock'||!s.l.p||s.qx==null)return;const P=g.P,x0=s.qx,y0=s.qy-(s.qr||60),T=.5;A.add({k:'fn',x:x0,y:y0,vx:(o.x-x0)/T,vy:(o.y-y0-.5*1300*T*T)/T,g:1300,T,fa:1,d:(c,q,g)=>{if(typeof drawStone==='function')drawStone(c,q.x,q.y,(o.r||20));},end:A2=>A2.burst(o.x,o.y,['d','D','s'],10,{v:150,T:.5,s:2})});}}});
const fxBP=g=>Math.round(g.P*4/3); /* boss characters: a 4px grid, a third chunkier than the charm scenes */
function fxIcon(c,id,x,y,P){const k=typeof icn==='function'?icn(id):id;if(!PXD[k])return;const key='ic_'+k;if(!FXI[key])FXI[key]=fxGrid(PXD[k],PXP);const im=FXI[key];c.save();c.imageSmoothingEnabled=false;c.fillStyle=FXP.k;c.fillRect(fq(x-7*P/1.5,P),fq(y-7*P/1.5,P),Math.round(14*P/1.5),Math.round(14*P/1.5));c.drawImage(im,fq(x-6*P/1.5,P),fq(y-6*P/1.5,P),Math.round(12*P/1.5),Math.round(12*P/1.5));c.restore();}
