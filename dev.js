/* Overripe: the ?dev panel. Loaded in order by index.html as plain scripts sharing one global scope (see CLAUDE.md, Files). */
/* ---------- dev panel: open the page with ?dev. For balance testing. A run it touches is marked R.dev and counts for nothing ---------- */
if(/[?&]dev\b/.test(location.search))(function(){
 const el=document.createElement('details'),opt=o=>Object.keys(o).map(k=>`<option value="${k}">${o[k].n}</option>`).join('');el.id='dev';
 el.style.cssText='position:fixed;left:4px;bottom:4px;z-index:99;max-width:230px;padding:4px 8px;border-radius:8px;background:#000c;color:#fff;font:14px monospace';
 el.innerHTML=`<summary>DEV</summary><style>#dev label,#dev button{display:inline-block;margin:3px 3px 0 0;font:inherit}#dev input{width:44px;font:inherit}#dev select{max-width:120px;font:inherit}#dev p{margin:4px 0 0;color:#f4bb4a}</style>
<label>Depth <input id="dvD" type="number" min="1" max="99" value="1"></label><label>Jar <select id="dvJ"><option value="0">1</option><option value="1">2</option><option value="2">Boss</option></select></label><button data-d="go">Jump</button><br>
<label>Boss <select id="dvB">${opt(BOSS)}</select></label><button data-d="boss">Set</button><br>
<label>Curses <select id="dvE">${opt(CUR)}</select></label><button data-d="cur">Set</button><br>
<label>Charm <select id="dvC">${opt(CH)}</select></label><label>Edition <select id="dvE"><option value="">None</option><option value="c">Candied</option><option value="j">Juiced</option><option value="a">Ambrosia</option></select></label><button data-d="charm">Add</button><br>
<label>Tool <select id="dvT">${opt(TL)}</select></label><button data-d="tool">Add</button><br>
<label>Upgrade <select id="dvU">${opt(UPG)}</select></label><button data-d="up">Add</button><br>
<label>Seed <select id="dvS">${[1,2,3,4,5,6,7,8,9,10].map(l=>`<option value="${l}">${fnm(l)}</option>`).join('')}</select></label><button data-d="seed">+1 level</button><br>
<label>Crate <select id="dvK">${opt(CRT)}</select></label><button data-d="crate">Open</button><button data-d="lcrate">Legendary</button><br>
<label>Contract <select id="dvQ">${opt(CT)}</select></label><button data-d="ct">Offer</button><br>
<label>Skip reward <select id="dvR">${opt(SKR)}</select></label><button data-d="tag">Give</button><br>
<label>Jar <select id="dvA">${opt(JARS)}</select></label><label>Ripeness <input id="dvK2" type="number" min="1" max="8" value="1"></label><br>
<button data-d="new">New dev run</button><button data-d="coins">+20 coins</button><button data-d="win">Clear jar</button><br><button data-d="runs">Run data</button><button data-d="code">Make code</button><button data-d="pf">Log profile</button><button data-d="pfu">Unlock all</button><button data-d="pfx">Reset profile</button><p id="dvM"></p>`;
 document.body.appendChild(el);
 const say=t=>{el.querySelector('#dvM').textContent=t;},v=id=>el.querySelector(id).value,redraw=()=>{rgHead();if(RUN.at==='crate')rgCrate();else if(RUN.at==='skip')rgSkip();else if(RUN.at==='shop')rgShop(1);else rgHub();};
 el.addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(!b)return;const a=b.dataset.d,idle=RUN&&G.state==='rogue';
  if(a==='pf'){console.log(JSON.stringify(PF.d,null,1));return say('Profile is in the console.');}
  if(a==='runs'){if(G.state!=='menu')return say('From the menu only.');teleView();return say('Run data loaded from /runs.');}if(a==='code'){if(G.state!=='menu')return say('From the menu only.');codeMk();return say('Make a code: title, rarity, uses.');}
  if(a==='pfx'){PF.d=PF.blank();PF.dirty=1;PF.save();lookSync();return say('Profile reset.');}
  if(a==='pfu'){for(const k in LOCK)PF.d.unlocked[k]=PF.d.unlocked[k]||Date.now();PF.dirty=1;PF.save();return say('Everything unlocked. Awards are not marked as earned.');}
  if(a==='new'){const R=RG.new(v('#dvA'),clampN(+v('#dvK2')||1,1,8));R.dev=1;rgStart(R);return say('Dev run started.');}
  if(!RUN)return say('Start a Rogue run first.');
  if(a==='win'){if(G.state!=='play')return say('Only while a jar is being played.');RUN.dev=1;G.g.cheat();return say('Target filled.');}
  if(a==='coins'){RUN.dev=1;RUN.coins+=20;if(idle)redraw();return say('+20 coins.');}
  if(!idle)return say('Only between jars (hub or shop).');
  if(a==='go'){RUN.depth=clampN(+v('#dvD')||1,1,99);RUN.jar=+v('#dvJ');RG.boss(RUN);G.g.wipe();RG.offer(RUN);RUN.shop=RG.stock(RUN);RUN.at='hub';}
  else if(a==='ct'){if(RG.jarCfg(RUN).boss)return say('Not on a boss jar.');const id=v('#dvQ');RUN.ct={id,on:0,sd:CT[id].pay[0]==='sd'?RG.sizes(RUN)[0]:undefined};}
  else if(a==='tag'){const id=v('#dvR');if(id==='crate')return say('Use the Crate row.');RUN.tg[id]=SKR[id].u;}
  else if(a==='boss'){RG.boss(RUN);RUN.bs[RUN.depth-1]=v('#dvB');}
  else if(a==='cur'){const k=v('#dvE'),c=RG.curse(RUN);c[CUR[k].k==='en'?0:1]=k;}
  else if(a==='charm'){const id=v('#dvC'),e=v('#dvE'),o=e?{id,e}:{id};if(RG.has(RUN,id))return say('Already owned.');if(CH[id].o){if(RUN.or.length>=RG.os(RUN))RUN.or.shift();RUN.or.push(o);}else{if(RUN.ch.length>=RG.slots(RUN))RUN.ch.shift();RUN.ch.push(o);}}
  else if(a==='tool'){const id=v('#dvT'),e=v('#dvE');if(RUN.tl.some(t=>t.id===id))return say('Already owned.');if(RUN.tl.length>=RG.ts(RUN))RUN.tl.shift();const t=RG.tool(id,RUN);if(e)t.e=e;RUN.tl.push(t);}
  else if(a==='up'){const id=v('#dvU');if(!RG.upOk(RUN,id)&&id!=='scrub'&&id!=='clean')return say('Not available now.');if(id==='scrub'||id==='clean')G.g[id]();else if(id==='bribe')RG.bribe(RUN);else RUN.up[id]++;}
  else if(a==='seed')RUN.sd[+v('#dvS')]++;
  else if(a==='crate'||a==='lcrate'){RUN.dev=1;RUN.crate=a==='crate'?RG.crate(RUN,v('#dvK'),RUN.at==='shop'?'shop':'hub'):RG.crate(RUN,'wood',RUN.at==='shop'?'shop':'hub','ch',1);rgHead();rgCrate();return say('Crate opened.');}
  RUN.dev=1;redraw();say('Done. This run no longer counts.');});})();

