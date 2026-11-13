# Fruit Merge

A drop-and-merge physics game (drop fruit, matching pairs merge one size up, 11 sizes, the last is a watermelon). Static site, no build step, no dependencies, installable as a PWA. Hosted from the repo root (GitHub Pages style).

Rogue mode is a full roguelite: charms, tools, fusions, seeds, crates, bosses with phases, awards, stakes and starting jars. All seven stages of the expansion plan below are done. Classic and Wild are finished and should not change unless asked.

## Files

| File | What it holds |
|---|---|
| `index.html` | CSS, HTML shell, engine (`makeGame`), Classic and Wild, all screens including the Rogue ones, the dev panel. About 580 very long lines. |
| `rogue.js` | Rogue rules and data (`CH`, `BOSS`, `UPG`, `TL`, seeds, crates (`CRT`), `RG`, balance tables), the player profile (`PF`, `mergeProfile`), run events (`rgEv`) and awards (`ACH`, `LOCK`). Loaded before the main script. No DOM access. |
| `icons.js` | Pixel art. `PXD` = 12x12 letter grids, `PXP` = palette, `PXF`/`PXFB` = score pop-up font. |
| `fruits.png` | Beta fruit art: one strip of square pixel sprites (widths in `ARW`): the 11 fruit (the user's drawings), then the rock (`SPR[11]`, drawn by `drawStone`). The default since v1.18. The original drawn fruit are the option, in Options or the pause screen (`artB`). |
| `sw.js` | Service worker, network first, cache fallback. Bump `CACHE` and update `CORE` whenever a file is added or renamed. |
| `database.rules.json` | Firebase Realtime Database rules for the leaderboard (pasted into the console by hand). |
| `README.md` | Player/host facing notes, including Firebase setup. |
| `DESIGN.md` | Rogue design view: builds each item feeds, thin builds, power budget by rarity, how often items turn up, candidate items. Read before proposing new items. |

## Run and test

- Run: `python3 -m http.server 8000` in the repo root, open `http://localhost:8000`. Opening the file directly also works, minus the service worker.
- No test suite. Verify changes by driving the page with Playwright (preinstalled in cloud sessions): load, start a Rogue run, drop fruit, open the shop, check the console for errors. Keep throwaway scripts out of the repo.
- Syntax check quickly by loading the page headless and failing on any `pageerror`.
- The engine can be stepped by hand in a test: `G.g.up(x)` drops, `G.g.update(.016)` advances one frame, so a whole jar plays in milliseconds. `G.g.peek()` returns the engine's hidden state (drops left, held fruit, armed tool), `G.g.snap()` the pile, `G.g.load(pile)` sets it. A drop is ignored while `cool>0` (the first 0.4s of a jar, 0.55s after each drop), so step between drops. Top-level `const`s (`G`, `RUN`, `RG`, `PF`) are reachable from `page.evaluate`.
- **Dev panel**: open the page with `?dev`. Jump to any depth and jar, set the boss, add charms (fusions included), tools, upgrades and seed levels, open a crate of any tier, add coins, clear the jar being played, log or reset the profile, unlock everything. Any run it touches gets `R.dev=1`: no stats, no glossary marks, no score boards. Add new item types to it as they land.

## Code conventions

- Hand-written dense style: short names, many statements per line, one function per line where possible. Match it. Do not reformat existing lines, diffs must stay readable.
- No frameworks, no bundler, no npm. Plain script tags.
- UI screens are HTML strings passed to `show(html)`, which fills `#ui .msg`. Buttons carry `data-a="action"`, dispatched in one click listener (`rgAct` for Rogue actions, all prefixed `r`).
- Icons: `ic('name')` returns `<i class="px px-name">`. `fr0` to `fr10` are pictures of the fruit sizes, drawn at load from `drawFruit` (seeds use them). A charm, boss or upgrade uses the grid named after its id unless `ICN` maps it to another. Every new item needs a grid in `icons.js` or an `ICN` entry.
- What's new: `LOG` in `index.html` (newest first, `news()` shows it from the menu, which marks it New until opened). Add a short player-facing entry for every change players will notice, and bump the version.
- Canvas text goes through `T()`, score pop-ups through `dmg()`, plain floating text through `floatTxt()`.
- Charm animations: `rgPulse(ids)` plays the charm's entry in `ANIM` (a CSS move `m-<name>` on the header icon, plus particles from `slotFx`). In the jar, `jfx(ids, merge)` in `makeGame` plays spot effects using `ring()` and `spray()`. Every new charm needs an `ANIM` entry.
- Sounds are synthesised in `SFX`, played with `snd('name')`.
- Font is Jersey 15, embedded as base64 in `index.html`. Do not open that line in an editor view if avoidable, it is huge.
- In-game text is short, plain and literal. A description must say exactly what the item does, with numbers.

## Architecture

- `store`: localStorage wrapper, keys prefixed `fruitMerge.v1.`. Keys in use: `mode`, `name`, `snd2`, `scores2`, `scoresWild2`, `scoresRogue`, `run` (the saved Rogue run), `profile` (all meta progress), `jar` and `stake` (the last picks on the new-run screen, a device preference), `seenLog` (newest What's new version opened), `art` (pixel fruit art, default on; off = drawn fruit, from the Options screen `opts()`).
- `G`: app state. `G.state` is one of `menu`, `play`, `pause`, `over`, `rogue` (any Rogue screen between jars). `G.g` is the live game, `RUN` the live Rogue run.
- `makeGame(W,H,wild,onOver,ro)`: the engine (physics, merging, specials, powers, drawing). Returns `{update, draw, up, use, jar, wipe, snap, load, scrub, ...}`. `ro` is null in Classic and Wild. In Rogue it is the hook object from `RG.ro(R, clear, fail, fx)`, the only way the engine talks to run state.
- `RG` (`rogue.js`): pure Rogue rules over a run object `R`: `new`, `saved`, `jarCfg`, `score`, `made`, `kill`, `payout`, `advance`, `stock`, `buy`, `sell`, `reroll`, and for tools `tool`, `ts` (slots), `need`, `charge`, `fill`, `buyTl`, `sellTl`. Read limits and prices through the helpers, never the raw tables: `slots` (charm slots), `ts`, `need` (charge a tool needs), `sellV`, `rrCost`, `upCost`, `upOk`, `sdCost`. Upgrades change all of them.
- Tools in the engine: `use(id)` fires a tool or arms a targeted one (`TL[id].tg`), `up(x,y)` then picks the fruit under the tap. `okTg(id,f)` says what a tool may target, `tool(id,f)` does the effect and returns false when there is nothing to do (no charge is spent), `spent(t)` empties the charge and runs every on-use charm. `power(p)` holds the four physics effects shared with Wild. Wild still uses coin prices and cooldowns (`PRICE`, `COOL`), Rogue never does.
- Tool bar: `#pw` holds Wild's four fixed buttons and `#tb`, the Rogue bar. The class `rg` on `#pw` switches between them. `syncTb` builds one button per slot and updates charge, Ready, Locked and armed states each frame.
- `PF` (`rogue.js`): the profile, one object under one storage key: `{v, rev, at, seen, unlocked, ach, stats, stakes}`. `seen`/`unlocked`/`ach` map namespaced ids (`ch.juicer`, `boss.fog`, `up.fert`) to the time first reached. `stats` is flat counters and records that only go up (`PF.inc`, `PF.max`). `PF.save()` writes only when dirty and is called from `rgSave`, `rgEnd`, tab hide and page hide. `mergeProfile(a,b)` joins two copies (earliest time, highest number) and is the whole sync story for sign-in. All meta progress must live in the profile.
- `rgEv(R, name, data)` (`rogue.js`): the single place things get counted, into `R.st` (run), `R.jst` (current jar, reset by the `start` event) and `PF.d.stats` (lifetime). The engine fires `drop`, `merge`, `tool`, `kill`, `net` through `ro.ev`. Screens fire `run`, `start`, `jar`, `end`, `buy`, `sell`, `up`, `seed`, `grow` (Gardener and Bloom), `roll`, `skip`, `crate`, `take`, `fuse`. `achCheck` runs at the end of it. New mechanics must fire an event here. The engine also fires `gold`, `melons` and `pet` (`k` = cat, mole or bee).
- `rgSee(kind, ids)`: marks things as met for the Almanac. Called when the shop, hub or a crate shows them. Kinds: `ch`, `tl`, `fu`, `up`, `sd`, `boss`.
- Awards (`ACH` in `rogue.js`, 37): the 8 newest cover the newer content (pets eaten, bees, 3 pets held, 6 gold merges, small fruit, 15 seed levels, The Blackout, a Trick Shot) and lock Big Appetite and 5 fusions. `on` = the events that can earn it, `t(R, d, S)` = the test, `un` = the lock key it opens (`ch.id`, `tl.id`, `up.id`, `fu.id`, `jar.id`), `secret` hides the text until earned. `LOCK` maps each key back to its award. `PF.lk(key)` is true while a thing is locked, and `RG.stock`, `RG.crate`, `RG.fusable` and `RG.upOk` all respect it. Earned awards go to `PF.d.ach` and `PF.d.unlocked`, to `R.got` (run over screen) and to `ACHQ` (the toast, shown by `toastTick`). Tests that need locked content must unlock it first: `for(const k in LOCK)PF.d.unlocked[k]=1`.
- Long screens (What's new, Run info, Almanac) have a sticky × at the top right (`.xb`) doing the same as their Back button.
- Almanac: `almanac(tab)` with `alRows(kind)` building the entries. Locked entries show the award's text, unmet ones a silhouette, met ones the full text and lifetime stats. Opened from the menu, the Rogue intro and the pause screen (`G.alFrom` says where Back goes).
- Rogue UI: `rgIntro`, `rgSetup` (pick jar and stake), `rgStart`, `rgHub`, `rgGo`, `rgClear`, `rgCrate`, `rgShop`, `rgInfo`, `rgCharm`, `rgTool`, `rgEnd`, shared pieces `rgOwn` (owned charms and tools as tiles), `rgFuNote`, `rgSkipB`, header charm slots in `rgHead`, charm flash in `rgPulse`. Tapping an owned charm or tool (header slot or `rgOwn` tile) opens a small card next to it (`tipOpen`/`tipClose`, Balatro style) with Sell and, between jars, ◀ ▶ to reorder charms. Tapping anywhere else closes it. From the header in play it freezes the jar (`G.tipP`), and the closing tap never drops a fruit. `rgCharm`/`rgTool` (full-screen) are no longer reached from taps. With slots full, the shop's buy button becomes Swap (`rswap`): a card (`tipShow`) lists owned items with their sell value, and picking one sells it and buys the new item into its place (`rswp2`). Tools have an optional short tool-bar name `s`.
- Leaderboard: `lbTop`/`lbSubmit`, Firebase REST, no SDK. Modes `classic`, `wild`, `rogue`. A Rogue score above stake 1 carries `k` (the stake). `lbSubmit` sends it and, if the write is refused (database rules older than the field), sends the score again without it. Rogue boards show every score's Ripeness as a coloured number (`rpB`, colours `RPC` green to deep red, legend `RPN`).

### Run object (save version `RV`, now 9)

`{v, jarId, stake, depth, jar, coins, total, ch:[{id, v?}], tl:[{id, c}] (tools, `c` = charge held), up:{one count per `UPG` key}, sd:[11 seed levels, index = tier made], bs:[boss ids per depth], ms:{depth: mini boss id}, bq:{depth: [two rule ids] for The Orchard Queen}, bx:{depth: extra rule id for a final boss on stake 8}, off (charms switched off by The Thief, only non-zero mid-jar), shop:{ch,tl,up,sd,cr,rr} (`cr` = kind of the crate on sale), crate:{tier,then,kind,opts}|null, pile:[snapshot], at:'hub'|'shop'|'crate', won, cfg, st:{run stats}, jst:{jar stats}, got:[awards earned this run], dsk (jars skipped this depth), dev?}`. Saved between jars only, never mid-jar. Any change to this shape needs a version bump and either a migration or dropping old saves. `RG.saved()` is the only reader and drops any save whose `v` is not `RV`.

## Rogue mode as it stands

- 8 depths, 3 jars each, the third is a boss. Beat depth 8 to win, then optional endless depths (targets ×`RSCX`=2 per depth).
- Each jar: reach `quota` points within `drops` drops. Charms that fire every few drops or merges show a countdown badge on their header slot (`G.g.cnt()` from the engine, meals for Chrysalis from the charm, drawn by `syncCnt`), red when the next one fires. Bosses with a rhythm show what is coming in the HUD tag line (`bossIn`: Tax, Whirlpool, Wilt, Glutton, Sticky, Frozen, Rock). Under Mult the HUD shows the last merge as points × Mult = score (`lsc`). The HUD shows drops left as a thick dark bar that drains, with the number written in it ("18 drops"): teal, orange at 8, red and pulsing at 5, never green, so it does not read as the score bar. A warning shows at 5, 3 and 1. Overflow (pile above the line for 2.2s) or running dry ends the run. The pile carries between jars and is wiped at each new depth.
- Scoring per merge: `(tri(l) + flat points) × Mult`, where `tri(l)=(l+1)(l+2)/2` for the fruit made, `Mult = (1 + sum of add) × product of x`. Charm order does not matter. Seeds add to both the points and the add part for their own size. After that, one-off multipliers stack on the result: gold fruit (×2, or ×3 from Golden Hand), Double Down (×4), Cyclone (×2), pollen (×3, ×4 with Butterfly Garden), Ladybird (×2).
- Charms (`CH`, 68 plus 21 fusions): passive items, rarity 0 to 2, fusions are rarity 3. Six are award rewards (Snake Eyes, Magpie, Ashes, Sweet Spot, Abacus, Full House). Eleven fill thin builds (see `DESIGN.md`): Small Fry, Pip Collector, Bite Size (small fruit), Gardener, Seed Packet, Sprout (seeds), Gold Leaf, Prospector, Alchemy (gold fruit), Wallflower, Low Tide (position). Eight make the Pets build (see below). Two rares grow ×Mult over the run: Snowball (×0.1 per jar cleared with 5+ drops left, `RG.snow`) and Old Oak (×0.04 per size 7+ fruit, in `RG.made`); `live:'x'` shows their value as ×. 5 slots (`SLOTS`), 6 with Charm Pouch. Hooks `chip`, `add`, `x` receive context `c` (see the comment above `CH`). Charms with no hook are special-cased in `makeGame` or `RG`. `dev:1` marks a prototype: dev panel only, never in the shop, crates or Almanac. `req` (an id or a list) means the item is only offered while the run holds one of those charms (`RG.rq`, used for charms and tools). Slingshot and Trick Shot (throwing) are in the shop for testing, Trick Shot only once Slingshot is held: with Slingshot, the release speed of a drag (`flick()` in the pointer handlers, passed as `up(x,y,vx)`) throws the fruit sideways at 0.35 of the flick speed above 300·K px/s, capped at 450·K (halved after the first playtest). A thrown fruit that hits a wall before touching anything gets `wb`, and a merge on its first contact is a `trick`.
- Tools (`TL`, 19 plus 6 fusions): abilities tapped during a jar. A run starts with Swap and Shake in 2 slots (`TS0`), up to 4 (`TSLOTS`) through the Tool Belt upgrade. Each tool needs `ch` charge and gains 1 per merge. Charge carries between jars, a bought tool arrives full. No coin cost, no cooldown. Targeted tools (Ripen, Twin, Midas, Anchor) arm first, then the player taps a fruit. Tool charms: Juggler, Spark Plug, Showman, Overdrive, Crowd Pleaser, Encore, Battery, Dynamo. The Padlock boss locks tools.
- Fruit states added by tools: `gold` (Midas, ×2 and 2 coins when it merges, saved in the pile; also from Gold Leaf, Prospector and Alchemy), `anch` (Anchor, stuck until the next jar starts), `pet` (Petrify / Medusa: turned to stone, `safe` from overflow, crumbles when the next jar starts and is left out of the pile snapshot). Gargoyle makes every rock safe from overflow and gives +0.5 Mult per rock (`rk` in the score context). Shatter turns a rock back into fruit. From pets: `pol` (pollen multiplier) and `lb` (the Ladybird), both saved in the pile snapshot as items 7 and 8. Jar states: `free` (Free Sample drops), `dd` (Double Down), `stash` (the Next fruit Rewind pushed back).
- Fusions: an entry in `CH` or `TL` with `fu:[a,b]`. Charm fusions take two charms, tool fusions take a tool then a charm. Never sold, never a random crate pick. `RG.fusable(R)` lists the ones the run holds both halves of, `RG.fuse` makes one: it takes the first half's place, frees the other slot, and a charm fusion keeps the halves' grown value. Recipes: Four-Leaf Clover (Lucky Clover + Horseshoe), Golden Goose (Piggy Bank + Savings Account), Volcano (Fireworks + Compost), Headliner (Showman + Encore), Smoothie (Juicer + Honey Pot), Marathon (Early Bird + Photo Finish), Wildfire (Hot Streak + Chain Reaction), Melon Mania (Heavyweight + Melon Fever), The Mint (Scratch Card + Golden Touch), Sharpshooter (Bullseye + Lodestone), Cyclone (Whirl + Metronome), Sleight of Hand (Swap + Juggler), Golden Hand (Midas + Fat Wallet). For the thin builds: Feeding Frenzy (Small Fry + Pet Caterpillar), Greenhouse (Gardener + Abacus), Treasure Hunter (Prospector + Magpie), Still Water (Low Tide + Clean Plate), Climbing Ivy (Wallflower + High Wire), Bloom (Ripen + Sprout, tool: the first use each jar also gives the new size's seed 1 level, via `ro.seed`), Snack Pack (Bite Size + Hoarder), Seed Vault (Sprout + Seed Packet), Philosopher's Stone (Gold Leaf + Alchemy, its 1 in 2 ignores Horseshoe), Keepsake (Pip Collector + Vintage), Fine Mesh (Sieve + Pip Collector, tool), Medusa (Petrify + High Wire, tool: also petrifies every fruit touching the target). Pets: Butterfly Garden, Menagerie. Recipes are not shown before the player holds both halves (the user removed combo hints on purpose). The hub and shop then say "Fusion ready".
- Pets: Pet Caterpillar, Busy Bee, Mole, Hedgehog, Ladybird, combos Pet Bowl, Pet Treats, Chrysalis, Big Appetite (need a pet: `CAT`, `EAT`, `PETS` lists in `rogue.js`), tool Whistle, fusions Feeding Frenzy, Butterfly Garden, Menagerie. In the engine: the caterpillar is `cat` (`updCat`, shared with Wild and The Glutton, a Rogue pet one walks and eats faster), the rest are `bee`, `mole`, `hog` in `updPets`/`drawPets`. The Hedgehog is the defensive pet: when the pile reaches the gold line (`ptop<hiY()`, at most every 3 drops, `hogD`) it climbs up and eats the highest fruit of size 6 or less (`hogTg`). A call that finds no target, or comes while the pet is out, waits (`catQ`, `beeQ`, `moleQ`). `jml` counts meals per jar for Pet Bowl. Chrysalis keeps its meal count in the charm (`n`) through `ro.chrys`.
- Crates (`CRT`): pick 1 of 3 free (4 with Crowbar), or leave it for a few coins. A boss drops a gold crate, a melon crate every 4th depth. Those two offer a ready fusion as the first pick. Wooden crates come from skipping and from the shop (one crate of a single kind per visit, prices in `CRP`). Picks are charms, tools, seed levels or coins. Higher tiers mean rarer charms and more seed levels. A pick is blocked while its slots are full, and the crate screen lets the player sell to make room. `RG.crate` builds one, `RG.take` / `RG.leave` resolve it and move on to `crate.then` (shop or hub).
- Skip: jar 1 or 2 of a depth can be skipped from the hub or shop. No payout, no shop, a wooden crate, then the hub for the next jar.
- Bosses (`BOSS`, 30): `d` = rule, `d2` = what phase 2 adds, `min` = first depth it can appear, `q` = target multiplier, `fin` = final boss. A run draws 7 different bosses for depths 1 to 7 and one final (Melon King, Orchard Queen, Reaper) for depth 8, and again every 8th depth in endless. Depth 4 (and 12, 20...) also has a **mini boss** on jar 2: a normal boss rule with no phase 2, 2 more coins and a wooden crate. Boss jars can not be skipped.
- Boss phases: on the boss jar (`cfg.p2`), reaching half the target calls `phase2()` in the engine. Every rule flag in `B` goes from 1 to 2 and the code reads the flag's value (`seq%(B.sticky>1?2:3)`). One-off hits (Padlock drains tools, Hourglass takes 2 drops, Melon King drops a rock into the lowest gap with 3s of grace, and that rock (`safe`) never counts for overflow) happen there. `cfg.rules` lists the flags a jar switches on: one for a normal boss, two for the Orchard Queen (`RG.rules`). Texts come from `RG.bossD(R, id, depth, two)`, never straight from `BOSS[id].d`, because the Queen's text depends on the run.
- Boss machinery in the engine: `bossTick(dt)` runs every frame (line position for Lid and Tide, wall position for Vise, the phase switch, Leech drain, Clock auto-drop). `sc()` wraps every score so the Auditor can cap Mult, `chg()` wraps every tool charge so the Miser can slow it, `mx()` flips the aim for the Mirror. The Blackout darkens the jar (`dk` light level, `dkT` seconds lit, `dkN` drops until the next light, `dkTick`), drawing only the held fruit and the one falling on top. The walls `L`/`Rw` and the line `line` are variables now, with `L0`/`R0`/`line0` as the resting values (the pile snapshot uses the resting ones). `RG.has` ignores the first `R.off` charms, which is how the Thief works.
- Upgrades (`UPG`, 18): `max` caps how many can be owned, `now` marks the instant ones (Scrub, Bribe). Owned ones cost 2 more each time. Stacking with no cap: Fertiliser, Hot Sauce, Watering Can. Capped: Tool Belt, Charm Pouch, Bigger Shelf, Seed Bag, Loaded Dice, Good Taste, Haggler, Vault, Packed Lunch, Whetstone, Slow Fuse, Tambourine, Crowbar. The engine reads them through `ro.up(id)`.
- Stakes (`STAKES`, 8), shown to players as **Ripeness** (the code, saves and the score field `k` still say stake): each adds one rule on top of the ones below: 2 jars pay 1 coin less, 3 targets ×1.25, 4 three fewer drops, 5 shop prices +1, 6 a mini boss on every depth from 5, 7 one charm slot fewer, 8 bosses start in phase 2 and the final boss brings a second boss rule. `RG.stakeMax(jar)` is one above the best stake won with that jar: every jar opens its own levels. Wins are stored per jar in `PF.d.stakes`. All of it is read from `R.stake` inside `RG.jarCfg`, `RG.cost`, `RG.slots`, `RG.mid` and `RG.rules`.
- Starting jars (`JARS`, 6): Classic, and five opened by awards. Piggy (12 coins, interest cap +2, jars pay 1 less), Deep (+4 drops, targets ×1.15), Charm (+1 charm slot, starts with Swap only, 1 tool slot fewer), Tool Kit (3 tools and 3 slots, 1 charm slot fewer), Crate (no charms in the shop, every cleared jar drops a wooden crate). Read from `R.jarId` in the same helpers.
- Seeds: `R.sd[l]` is the level for the fruit of tier `l` (1 to 10, shown as size `l+1`). Each level gives `sdP(l)=4+2l` points and `SDM=0.5` Mult when that fruit is made. Price `SDC=3` plus 1 per level held. The shop offers sizes 2 to 8 before depth 4, every size after.
- Economy: jar payout `RPAY`, unused drops bonus, interest 1 per 5 coins (cap 4), shop of 3 charms, 2 tools, 3 upgrades, 2 seeds and 1 crate, reroll from 2 coins, sell for half price. Coins are spent in the shop only.
- Balance tables: `RQ` (depth 1 targets), `RSC` (target multiplier per depth), `RSCX`, `RDROPS`, `RPAY`, and `c`/`ch` on each tool. `RSC` was set from bot runs, not human play: a bot that aims every fruit at a matching one and buys nothing scores about 230 points per 24-drop jar at any depth. The same bot buying greedily (first charm it can afford, no thought for synergy, no targeted tools) wins about 1 run in 12 on this curve and usually dies between depths 3 and 6. Re-measure after any change to scoring power. The last measurement (with the Pets build) is in `DESIGN.md`, with a rebuilt bot that aims a little worse than the original (~190 a jar): greedy win rate matched between the old and the new item pool.

## Design pillars for the Rogue expansion

Taken from what makes Balatro and Vampire Survivors work, applied to a physics merger:

1. **Legible score maths.** Points × Mult stays visible at all times. Every item says what it adds in numbers.
2. **Targets outrun linear builds.** Quotas grow faster than flat bonuses, so a winning run needs a multiplying engine.
3. **Scarcity forces identity.** Few slots, so each pick commits the run to a build (small-fruit swarm, big-fruit, combo, economy, destruction, tool spam).
4. **Known threats, chosen answers.** The boss is shown in advance. Bosses attack builds, the player prepares.
5. **Risk for reward.** Skipping a jar, holding coins for interest, playing near the line.
6. **Skill still matters.** It is a physics game. Items change what a good drop is, they never play the game for you.
7. **Meta progression is content, not power.** Unlocks add options and harder stakes. No permanent stat boosts that make old stakes trivial.
8. **Active play.** Clickable tools should fire often and visibly change the jar.

## Roadmap

Status key: `planned` (awaiting go-ahead), `doing`, `done`. Update this section as stages land. One stage per commit series, each stage leaves the game playable.

### Stage 0: Foundations — done
- Rogue rules moved to `rogue.js`. Profile save with `mergeProfile`. Event hook `rgEv` / `ro.ev`. Run save `v:3`, older runs dropped. `?dev` panel. See Architecture above.
- No gameplay change. Stats and glossary marks are recorded from here on, with no screen to show them until Stage 5.

### Stage 1: Tools (clickable abilities) — done
- Powers became Tools: 16 of them, loadout of 2 to 4 slots, charged by merges, sold in the shop. Targeting mode, charge bar with Ready pulse, use flash. See "Rogue mode as it stands".
- 4 new charms (Spark Plug, Overdrive, Crowd Pleaser, Dynamo), Juggler and Battery reworded for charges, Tool Belt upgrade brought forward from Stage 2.
- Not balanced yet. Players are richer (no coin spend mid-jar) and stronger. The retune is Stage 4.

### Stage 2: Upgrades and Seeds — done
- 17 upgrades with caps and instant ones, Seeds for each fruit size, shop sections Charms, Tools, Upgrades, Seeds. See "Rogue mode as it stands".
- "Extra crate choice" moved to Stage 3 with crates. "Starting tool charge" became Whetstone, since Spark Plug already covers starting charge.

### Stage 3: Crates, Fusions, Skips — done
- Boss crates (gold, melon), wooden crates from skips and the shop, 13 fusions, jar skipping, Crowbar upgrade. See "Rogue mode as it stands".

### Stage 4: Bosses and difficulty — done
- Phase 2 for every boss, 12 new bosses (Mirror, Clock, Gambler, Twins, Miser, Thief, Tide, Wilt, Collector, Auditor, Vise, Leech), 2 new finals (Orchard Queen, Reaper), a mini boss at depth 4. Hydra became the Wilt: splitting a fruit in two let the halves merge again for free points.
- Targets retuned from `[1,2.3,4,6.5,9.5,13,17,22]` to `[1,2.6,6,13,27,55,100,180]`. On the old curve the greedy bot won half its runs.
- Icons redrawn to match the original set (chunky, outlined, shaded). Check any new icon against the old ones on a contact sheet before shipping it.

### Stage 5: Awards, unlocks, Almanac — done
- 29 awards, 26 of them unlock something: 5 tools (Twin, Rewind, Double Down, Cash Out, Midas), 2 charms from earlier stages (Overdrive, Dynamo), 6 new reward charms, 3 upgrades (Charm Pouch, Crowbar, Whetstone), 5 fusion recipes (Golden Hand, Wildfire, Sharpshooter, Cyclone, Melon Mania) and 5 starting jars. Three are secret. The three with no unlock are for stakes and meeting every boss.
- None of the charms from before the expansion is locked.
- Almanac with tabs Charms, Tools, Fusions, Upgrades (seeds included), Bosses, Awards. Award toasts in play, awards listed on the run over screen.

### Stage 6: Stakes and starting jars — done
- 8 stakes, 6 starting jars, a new-run screen to pick them, the stake on local and world score boards.
- "Perishable charms" was dropped for stake 7 in favour of one charm slot fewer: it needed a per-charm countdown and is more annoying than hard.
- `database.rules.json` now accepts the optional stake field `k` on Rogue scores. Until the user re-publishes the rules in the Firebase console, scores still post, without their stake.

### Later
- Fruit art: the user's sprites are the default since v1.18 (`ART`, the drawn fruit are the Options toggle). `artLoad` scales each sprite 8x without smoothing once (`SPR`), `drawFruit` draws it in place of the coded fruit and `frIcons` rebuilds the `fr0`-`fr10` icons. `artFit` measures how far each sprite reaches toward its square edge and `ARS` draws it that much bigger (cap ×1.12) so neighbours touch. The sprites carry their own faces, so the game draws none on them. Mouldy sprite fruit get a green tint (`drawMold`) and rising spores (`spores`) instead of the X face. Second pass (13 Nov) redrew the pear with a face, gave the watermelon lashes, blush and a tongue, and touched up sizes 2 to 6. Still open: pale peach and melon.
- Human playtesting of the difficulty curve, stakes and the newer bosses. Everything so far was tuned against a bot.
- Sign-in and cloud save (user will ask). Plan: Firebase Auth, `users/$uid/profile`, merge with `mergeProfile`. The run save can sync too.
- Charm editions, daily seeded run, more fusions.

## Standing decisions

1. Charm order is irrelevant to scoring. The Thief is the one exception: it switches off the leftmost charms, which players can reorder between jars.
2. Charms from before the expansion are never locked.

## Working rules

- Ask before starting anything under "Later". The seven stages above were each started on the user's go-ahead.
- Keep `README.md` and this file current when rules or tables change. Keep `DESIGN.md` current when items are added, removed or change build.
- Never add permanent power meta progression (see pillar 7) without asking.
- The Firebase rules file is applied by hand in the console. Any change to it must be called out to the user.
