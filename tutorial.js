/* Overripe: the Rogue tutorial (TUT, tutNew, tutGo), see CLAUDE.md. Loaded in order by index.html as plain scripts sharing one global scope (see CLAUDE.md, Files). */
/* ---------- tutorial (v1.73): a scripted 3-jar run. R.tut, R.dev (no stats, no boards), never saved. Coach cards (#coach) walk through it; TUT[key] = steps [text, element to point at, actions allowed]. A step with actions waits for the player to do one, the others have Got it. tc = steps done per key ---------- */
const TUT={
 hub:[['This is a Rogue run. You go down through depths, one jar at a time. This strip is the whole run: tap it any time for the map.','.dmap'],['Each depth has 3 jars and the third is a boss. Clear a jar by reaching its score in the drops you have.','.trk'],['The boss and its curses are shown before you get there. Tap a tile to read what it does.','.bxs'],['Tap Start jar.','[data-a=rgo]',['rgo','rbx']]],
 j1:[['Drag to aim, let go to drop. Two fruit of the same size merge into the next size up.'],['Every merge scores points × Mult. Reach the score at the top before your drops run out.','#dr'],['Keep the pile under the line at the top of the jar. If it sits over the line too long, the run ends.']],
 c1:[['Clearing a jar pays coins, more for drops you did not use. Coins are spent in the shop.','.wl'],['Tap Shop.','[data-a=rshop]',['rshop']]],
 sh1:[['Charms work on their own once bought. They sit in the row at the top, 5 at most.','#hd'],['Buy the Pet Caterpillar. It is a pet: it eats small fruit for points and levels up as it eats.','[data-a=rbuy]',['rbuy']]],
 sh1b:[['Your tools are at the bottom. They charge with every merge: tap one when it says Ready. Swap trades your fruit for the next one, Shake jiggles the pile.','#tb'],['Tap Start jar.','[data-a=rgo]',['rgo']]],
 j2:[['Every 5 drops your caterpillar comes out and eats a small fruit. Try a tool once it says Ready.','#tb']],
 c2:[['Tap Shop.','[data-a=rshop]',['rshop']]],
 sh2:[['This Small Fry is Juiced. An edition adds to what an item does: Candied +10 points a merge, Juiced +1.5 Mult, Ambrosia ×1.5 Mult. Any item can roll one, rarely.','.it li'],['Small Fry and your Pet Caterpillar are the two halves of a fusion. The F lights up when you hold the other half. Tap it to see the recipe.','.fub',null],['Buy the Small Fry.','[data-a=rbuy]',['rbuy','rfu']]],
 sh2b:[['Crates hold a pick of items. Hold both halves of a fusion and a crate offers the fusion first. Buy the Charm Crate.','[data-a=rcbuy]',['rcbuy']]],
 cr:[['Take Feeding Frenzy. A fusion replaces both halves with one charm that does more than either, and frees a slot.','[data-a=rtake][data-i="0"]',['rtake']]],
 sh2c:[['In a real run the shop also sells Orchard items (they change what drops), upgrades and seeds. The Almanac explains every item.'],['From depth 2 a jar can come with a contract: sign it for a harder jar and a reward.'],['Next is the boss. Tap Start jar.','[data-a=rgo]',['rgo']]],
 j3:[['The Taxman takes a coin every 4 drops. At half the target every boss reaches phase 2 and gets worse: the black mark on the score bar.']]};
const TUJ=[{quota:50,drops:16},{quota:110,drops:20},{quota:140,drops:22}];
(f=>{RG.jarCfg=function(R,j=R.jar){const c=f.call(this,R,j);if(R.tut&&TUJ[j])Object.assign(c,TUJ[j],{en:'',de:'',crate:''});return c;};})(RG.jarCfg);
function tutNew(){const R=RG.new('classic',1,0,1);Object.assign(R,{dev:1,tut:1,tc:{},bs:['tax'],sc:{1:['','',0]}});rgStart(R);}
/* the step key for what is on screen now */
function tutKey(){const R=RUN,at=R.at;if(G.state==='play'||G.state==='pause')return 'j'+(R.jar+1);if(at==='hub')return 'hub';if(at==='crate')return 'cr';if(at==='shop'){if(G.tutC)return R.jar===1?'c1':'c2';return R.jar===1?(RG.has(R,'pet')?'sh1b':'sh1'):RG.has(R,'frenzy')?'sh2c':RG.has(R,'fry')?'sh2b':'sh2';}return '';}
function tutStock(){const R=RUN,S=R.shop;if(!S||S.tut===R.jar)return;R.shop={ch:R.jar===1?['pet']:['fry'],or:[],tl:[],up:[],sd:[],cr:R.jar===2?'ch':'',rr:0,ed:R.jar===2?{ch0:'j'}:{},tut:R.jar};const need=R.jar===1?RG.pr(R,'ch',0):RG.pr(R,'ch',0)+RG.crCost(R);R.coins=Math.max(R.coins,need);if(R.jar===2)PF.see('fu',['frenzy']);}
function coachX(){const c=$('#coach');if(c)c.remove();document.querySelectorAll('.coachT').forEach(e=>e.classList.remove('coachT'));}
function tutGo(){coachX();if(!RUN||!RUN.tut)return;const k=tutKey(),st=TUT[k];if(!st)return;const i=RUN.tc[k]||0,m=ui.querySelector('.msg'),inJ=k[0]==='j';
 if(i>=st.length){if(inJ&&G.state==='pause'&&G.tutP){G.tutP=0;G.state='play';G.last=0;}return;}
 const [t,sel,al]=st[i],el=sel&&(document.querySelector('#ui '+sel)||document.querySelector(sel));if(inJ&&G.state==='play'){G.state='pause';G.tutP=1;}
 if(m&&!inJ)m.querySelectorAll('[data-a]').forEach(b=>{const a=b.dataset.a,ok=a==='menu'||el&&(el===b||el.contains(b)||b.contains(el))&&(!al||al.includes(a))||al&&al.includes(a)&&(!sel||b.matches(sel)||a!==st[i][2][0]);b.classList.toggle('tdis',!ok);});
 if(el){const dd=el.closest('details');if(dd)dd.open=true;el.classList.add('coachT');if(m&&m.contains(el))el.scrollIntoView({block:'center'});}
 const c=document.createElement('div');c.id='coach';c.className='coach'+(inJ?' cj':'');c.innerHTML=`<p>${t}</p><div class="cb"><button class="lnk" data-c="skip">Skip tutorial</button>${al?'':'<button class="go sm" data-c="ok">Got it</button>'}</div><small>${Object.keys(TUT).indexOf(k)+1} / ${Object.keys(TUT).length}</small>`;document.body.appendChild(c);
 c.addEventListener('click',e=>{e.stopPropagation();const d=e.target.closest('[data-c]');if(!d)return;snd('ui');if(d.dataset.c==='ok'){RUN.tc[k]=i+1;tutGo();}else if(d.dataset.c==='skip'){if(d.dataset.sure)tutEnd(0);else{d.dataset.sure=1;d.textContent='Tap again to leave';}}});}
/* an action step is done once its action ran: count it, then the screen it led to picks up its own key */
function tutAct(a){if(!RUN||!RUN.tut)return;const k=tutKey(),st=TUT[k],i=RUN.tc[k]||0;if(st&&st[i]&&st[i][2]&&st[i][2][0]===a)RUN.tc[k]=i+1;}
function tutEnd(done){coachX();G.tutP=0;G.tutC=0;PF.max('tut',1);PF.save();cloudPush();menu();if(!done)return;
 show(`<div class="mode">Tutorial</div>${tile('frenzy','big r3')}<h3>You're ready</h3><p>That's the loop: clear jars, spend coins, build an engine, beat the boss.</p><p class="tg">A real run is 8 depths. Seeds, the Orchard, upgrades, contracts and skips are waiting. Tap any tile on the Rogue screen to read about one.</p><button class="go rogue" data-a="rtnew">Start a real run</button><button class="go alt sm" data-a="menu">Menu</button>`);}
function tutFail(){coachX();G.tutC=0;menu();show(`<div class="mode">Tutorial</div><h3>The jar got away</h3><p>The pile sat over the line, or the drops ran out. No harm done.</p><button class="go rogue" data-a="rtut">Try again</button><button class="go alt sm" data-a="menu">Menu</button>`);}
for(const n of ['rgHub','rgShop','rgCrate','rgClear'])(f=>{window[n]=function(...a){const T=RUN&&RUN.tut;if(T&&n==='rgClear'&&RUN.jar===2){G.state='rogue';return setTimeout(()=>tutEnd(1),0);}if(T)G.tutC=n==='rgClear'?1:0;if(T&&n==='rgShop')tutStock();const r=f.apply(this,a);if(RUN&&RUN.tut)setTimeout(tutGo,n==='rgCrate'?1700:30);return r;};})(window[n]);
(f=>{window.rgGo=function(){f();if(RUN&&RUN.tut)setTimeout(tutGo,30);};})(rgGo);
(f=>{window.rgSave=function(){if(RUN&&RUN.tut)return;f();};})(rgSave);
(f=>{window.rgEnd=function(why){if(RUN&&RUN.tut){G.over=null;if(why==='win')return tutEnd(1);if(why==='quit'){coachX();return menu();}G.state='rogue';return setTimeout(tutFail,0);}return f(why);};})(rgEnd);
