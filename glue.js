/* Overripe: install to home screen, service worker, volume control, the i screen (iGo, ITB), drops bar (syncDr), page listeners. Loaded in order by index.html as plain scripts sharing one global scope (see CLAUDE.md, Files). */
/* ---------- install to home screen ---------- */
let instPrompt=null;
const standalone=()=>matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function installBtn(){return standalone()?'':'<button class="go inst" data-a="install">Install as app</button>'} /* every device until it runs installed: the browser's own prompt when it has one, else the steps */
function syncInstall(){const s=$('#instSlot');if(s)s.innerHTML=installBtn()}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();instPrompt=e;syncInstall()});
window.addEventListener('appinstalled',()=>{instPrompt=null;syncInstall()});
function install(){if(instPrompt){const p=instPrompt;instPrompt=null;p.prompt();(p.userChoice||Promise.resolve()).finally(syncInstall);return}
 show(`<h3>Install</h3><p>Put Overripe on your home screen. It opens full screen like an app.</p>${isIOS
  ?'<ol class="wl"><li><span>1</span><div>Tap <b>Share</b> (the square with an arrow). In Safari it is at the bottom, in Chrome it is in the address bar.</div></li><li><span>2</span><div>Scroll down and tap <b>Add to Home Screen</b>.</div></li><li><span>3</span><div>Tap <b>Add</b>.</div></li></ol>'
  :'<ol class="wl"><li><span>1</span><div>Open your browser menu (<b>⋮</b> or <b>☰</b>).</div></li><li><span>2</span><div>Tap <b>Install app</b> or <b>Add to Home screen</b>.</div></li></ol>'}<button class="go alt" data-a="menu">Back</button>`)}
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))navigator.serviceWorker.register('sw.js').catch(()=>{});
$('#lbB').onclick=()=>{if(G.state==='over'&&G.pending!=null)return;snd('ui');if(G.state==='play')pause();G.lbFrom=G.state==='pause'?'pause':G.state==='rogue'&&RUN?'rogue':'menu';showScores(G.bestM||G.mode)};
/* volume: a mute button, a slider and the number, in Options and on the pause screen. volUi updates the one on screen in place */
function volB(){const n=Math.round(VOL*100);return `<div class="vol"><button class="ib" data-a="mute" aria-label="Mute" aria-pressed="${!VOL}">${ic(VOL?'snd_on':'snd_off')}</button><input type="range" id="volR" min="0" max="100" step="5" value="${n}" style="--p:${n}%" aria-label="Volume"><b id="volN">${n}</b></div>`}
function setVol(v){VOL=v;sndOn=v>0;if(v)G.pv=v;store.set('vol',v);if(master)master.gain.value=.55*v;}
function volUi(){const r=$('#volR');if(!r)return;const n=Math.round(VOL*100),b=r.parentNode.querySelector('.ib');r.value=n;r.style.setProperty('--p',n+'%');$('#volN').textContent=n;b.innerHTML=ic(VOL?'snd_on':'snd_off');b.setAttribute('aria-pressed',!VOL);}
ui.addEventListener('input',e=>{if(e.target.id==='volR'){setVol(e.target.value/100);volUi();}});ui.addEventListener('change',e=>{if(e.target.id==='volR')snd('merge',4,0);});
/* Run info straight from the jar (the i button, or a tap on the header): G.inf makes closing it go back to the jar, not to the pause screen */
function infoGo(){iGo('ri');}
/* the i screen (Rogue, in a jar): pauses and shows tabs Run info, Almanac, Options, with Resume and Quit run at the bottom. G.iT is the open tab */
const ITB=[['ri','Run info'],['fr','Friends'],['al','Almanac'],['op','Options']];
function iOn(){return !!(G.iT&&G.state==='pause'&&RUN);}
function iGo(t){if(G.mode!=='rogue'||!RUN)return;if(G.state==='play'){snd('ui');G.state='pause';$('#pauseB').hidden=true;}if(G.state!=='pause')return;G.iT=t||'ri';G.inf=1;if(t==='al')almanac();else if(t==='op')opts();else if(t==='fr'&&soOk())frTab();else rgInfo();}
function iHead(){return `<button class="xb" data-a="resume" aria-label="Resume">×</button><div class="tabs it">${ITB.filter(([t])=>t!=='fr'||soOk()).map(([t,n])=>`<button data-a="itab" data-t="${t}"${t===G.iT?' class="on"':''}>${n}</button>`).join('')}</div>`;}
function bOn(){return !!(G.bT&&G.state==='rogue'&&RUN);} /* v1.58.1: the i screen between jars has tabs too (Run info, Friends, Almanac, Options). G.bT = open tab, cleared by back() and by every between-jars screen */
function bHead(){return `<button class="xb" data-a="rback" aria-label="Close">×</button><div class="tabs it">${ITB.filter(([t])=>t!=='fr'||soOk()).map(([t,n])=>`<button data-a="btab" data-t="${t}"${t===G.bT?' class="on"':''}>${n}</button>`).join('')}</div>`;}
function bGo(t){G.bT=t||'ri';if(t==='al')almanac();else if(t==='op')opts();else if(t==='fr'&&soOk())frTab();else rgInfo();}
const bFoot='<button class="go alt" data-a="rback">Back</button>';
function iFoot(){return '<button class="go" data-a="resume">Resume</button><button class="go lnk" data-a="rquit">Quit run</button>';}
function rsm(){G.inf=0;G.iT=0;hide();G.state='play';G.last=0;$('#pauseB').hidden=!!RUN;}
/* the drops bar and the i button above the tool bar (Rogue). The bar drains as drops are used: teal, orange at 8, red and pulsing at 5 */
$('#iB').onclick=()=>{if(G.state==='play')return iGo('ri');if(iOn()){snd('ui');rsm();return;}if(G.state!=='rogue'||!RUN)return;snd('ui');const m=ui.querySelector('.msg');if(!G.ibk&&bOn()){rgAct('rback',{dataset:{}});return;}if(G.ibk&&m){G.bT=0;const o=G.ibk;G.ibk=0;m.replaceWith(o);o.scrollTop=G.iby||0;return;}if(m){G.iby=m.scrollTop;m.remove();}rgInfo();G.ibk=m;}; /* i between jars: Run info over whatever screen is up, which is kept (G.ibk) and put back by Back, × or a second tap. show() drops it, so after any other step Back rebuilds the screen from RUN.at */
function syncDr(){if(!RUN||pw.hidden)return;const d=G.g&&G.g.dr(),pl=G.state==='play',k=(d?d.join():'')+'|'+pl+'|'+iOn()+'|'+G.state;if(k===G.drK)return;G.drK=k;const db=$('#db');$('#iB').disabled=!pl&&!iOn()&&G.state!=='rogue';db.classList.toggle('off',!d||!(pl||G.state==='pause'));if(!d){db.querySelector('span').textContent='';db.style.setProperty('--p','100%');db.classList.remove('lo');return;}
 const[dl,dm,fr,dn,ck]=d,q=ck?dl/2.5:dl,lo=q<=5&&!fr&&!dn;db.style.setProperty('--p',(100*clampN(dl/dm,0,1)).toFixed(1)+'%');db.style.setProperty('--c',q<=5?'#e63946':q<=8?'#fb8500':'#1f9c90');db.classList.toggle('lo',lo);db.querySelector('span').textContent=(ck?dl+'s left':dl===1?'1 drop':dl+' drops')+(fr?' +'+fr+' free':'');}
document.addEventListener('visibilitychange',()=>{if(document.hidden){pause();PF.save();cloudPush(1);}else beat();});
window.addEventListener('pagehide',()=>PF.save());
window.addEventListener('resize',()=>{fit();if(G.state==='menu'&&$('#ui .top .rogue'))menu()}) /* only the main menu redraws: Options, forms and other menu screens stay, or a phone keyboard opening would close them */;
