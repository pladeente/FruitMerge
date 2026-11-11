# Fruit Merge

A drop-and-merge physics game (drop fruit, matching pairs merge one size up, 11 sizes, the last is a watermelon). Static site, no build step, no dependencies, installable as a PWA. Hosted from the repo root (GitHub Pages style).

The active work is turning **Rogue mode** into a deep roguelite. Classic and Wild are finished and should not change unless asked.

## Files

| File | What it holds |
|---|---|
| `index.html` | CSS, HTML shell, engine (`makeGame`), Classic and Wild, all screens including the Rogue ones, the dev panel. About 580 very long lines. |
| `rogue.js` | Rogue rules and data (`CH`, `BOSS`, `UPG`, `TL`, seeds, crates (`CRT`), `RG`, balance tables), the player profile (`PF`, `mergeProfile`) and run events (`rgEv`). Loaded before the main script. No DOM access. |
| `icons.js` | Pixel art. `PXD` = 12x12 letter grids, `PXP` = palette, `PXF`/`PXFB` = score pop-up font. |
| `sw.js` | Service worker, network first, cache fallback. Bump `CACHE` and update `CORE` whenever a file is added or renamed. |
| `database.rules.json` | Firebase Realtime Database rules for the leaderboard (pasted into the console by hand). |
| `README.md` | Player/host facing notes, including Firebase setup. |

## Run and test

- Run: `python3 -m http.server 8000` in the repo root, open `http://localhost:8000`. Opening the file directly also works, minus the service worker.
- No test suite. Verify changes by driving the page with Playwright (preinstalled in cloud sessions): load, start a Rogue run, drop fruit, open the shop, check the console for errors. Keep throwaway scripts out of the repo.
- Syntax check quickly by loading the page headless and failing on any `pageerror`.
- The engine can be stepped by hand in a test: `G.g.up(x)` drops, `G.g.update(.016)` advances one frame, so a whole jar plays in milliseconds. `G.g.peek()` returns the engine's hidden state (drops left, held fruit, armed tool), `G.g.snap()` the pile, `G.g.load(pile)` sets it. A drop is ignored while `cool>0` (the first 0.4s of a jar, 0.55s after each drop), so step between drops. Top-level `const`s (`G`, `RUN`, `RG`, `PF`) are reachable from `page.evaluate`.
- **Dev panel**: open the page with `?dev`. Jump to any depth and jar, set the boss, add charms (fusions included), tools, upgrades and seed levels, open a crate of any tier, add coins, clear the jar being played, log or reset the profile. Any run it touches gets `R.dev=1`: no stats, no glossary marks, no score boards. Add new item types to it as they land.

## Code conventions

- Hand-written dense style: short names, many statements per line, one function per line where possible. Match it. Do not reformat existing lines, diffs must stay readable.
- No frameworks, no bundler, no npm. Plain script tags.
- UI screens are HTML strings passed to `show(html)`, which fills `#ui .msg`. Buttons carry `data-a="action"`, dispatched in one click listener (`rgAct` for Rogue actions, all prefixed `r`).
- Icons: `ic('name')` returns `<i class="px px-name">`. `fr0` to `fr10` are pictures of the fruit sizes, drawn at load from `drawFruit` (seeds use them). A charm, boss or upgrade uses the grid named after its id unless `ICN` maps it to another. Every new item needs a grid in `icons.js` or an `ICN` entry.
- Canvas text goes through `T()`, score pop-ups through `dmg()`, plain floating text through `floatTxt()`.
- Sounds are synthesised in `SFX`, played with `snd('name')`.
- Font is Jersey 15, embedded as base64 in `index.html`. Do not open that line in an editor view if avoidable, it is huge.
- In-game text is short, plain and literal. A description must say exactly what the item does, with numbers.

## Architecture

- `store`: localStorage wrapper, keys prefixed `fruitMerge.v1.`. Keys in use: `mode`, `name`, `snd2`, `scores2`, `scoresWild2`, `scoresRogue`, `run` (the saved Rogue run), `profile` (all meta progress).
- `G`: app state. `G.state` is one of `menu`, `play`, `pause`, `over`, `rogue` (any Rogue screen between jars). `G.g` is the live game, `RUN` the live Rogue run.
- `makeGame(W,H,wild,onOver,ro)`: the engine (physics, merging, specials, powers, drawing). Returns `{update, draw, up, use, jar, wipe, snap, load, scrub, ...}`. `ro` is null in Classic and Wild. In Rogue it is the hook object from `RG.ro(R, clear, fail, fx)`, the only way the engine talks to run state.
- `RG` (`rogue.js`): pure Rogue rules over a run object `R`: `new`, `saved`, `jarCfg`, `score`, `made`, `kill`, `payout`, `advance`, `stock`, `buy`, `sell`, `reroll`, and for tools `tool`, `ts` (slots), `need`, `charge`, `fill`, `buyTl`, `sellTl`. Read limits and prices through the helpers, never the raw tables: `slots` (charm slots), `ts`, `need` (charge a tool needs), `sellV`, `rrCost`, `upCost`, `upOk`, `sdCost`. Upgrades change all of them.
- Tools in the engine: `use(id)` fires a tool or arms a targeted one (`TL[id].tg`), `up(x,y)` then picks the fruit under the tap. `okTg(id,f)` says what a tool may target, `tool(id,f)` does the effect and returns false when there is nothing to do (no charge is spent), `spent(t)` empties the charge and runs every on-use charm. `power(p)` holds the four physics effects shared with Wild. Wild still uses coin prices and cooldowns (`PRICE`, `COOL`), Rogue never does.
- Tool bar: `#pw` holds Wild's four fixed buttons and `#tb`, the Rogue bar. The class `rg` on `#pw` switches between them. `syncTb` builds one button per slot and updates charge, Ready, Locked and armed states each frame.
- `PF` (`rogue.js`): the profile, one object under one storage key: `{v, rev, at, seen, unlocked, ach, stats, stakes}`. `seen`/`unlocked`/`ach` map namespaced ids (`ch.juicer`, `boss.fog`, `up.fert`) to the time first reached. `stats` is flat counters and records that only go up (`PF.inc`, `PF.max`). `PF.save()` writes only when dirty and is called from `rgSave`, `rgEnd`, tab hide and page hide. `mergeProfile(a,b)` joins two copies (earliest time, highest number) and is the whole sync story for sign-in. All meta progress must live in the profile.
- `rgEv(R, name, data)` (`rogue.js`): the single place things get counted, into `R.st` (run), `R.jst` (current jar, reset by the `start` event) and `PF.d.stats` (lifetime). The engine fires `drop`, `merge`, `tool`, `kill`, `net` through `ro.ev`. Screens fire `run`, `start`, `jar`, `end`, `buy`, `sell`, `up`, `seed`, `roll`, `skip`, `crate`, `take`, `fuse`. Achievements (Stage 5) hook in at the end of it. New mechanics must fire an event here.
- `rgSee(kind, ids)`: marks things as met for the glossary. Called when the shop or hub shows them.
- Rogue UI: `rgIntro`, `rgStart`, `rgHub`, `rgGo`, `rgClear`, `rgCrate`, `rgShop`, `rgInfo`, `rgCharm`, `rgTool`, `rgEnd`, shared pieces `rgOwn` (owned charms and tools as tiles), `rgFuNote`, `rgSkipB`, header charm slots in `rgHead`, charm flash in `rgPulse`.
- Leaderboard: `lbTop`/`lbSubmit`, Firebase REST, no SDK. Modes `classic`, `wild`, `rogue`.

### Run object (save version `RV`, now 6)

`{v, depth, jar, coins, total, ch:[{id, v?}], tl:[{id, c}] (tools, `c` = charge held), up:{one count per `UPG` key}, sd:[11 seed levels, index = tier made], bs:[boss ids per depth], shop:{ch,tl,up,sd,cr,rr} (`cr` = kind of the crate on sale), crate:{tier,then,kind,opts}|null, pile:[snapshot], at:'hub'|'shop'|'crate', won, cfg, st:{run stats}, jst:{jar stats}, dev?}`. Saved between jars only, never mid-jar. Any change to this shape needs a version bump and either a migration or dropping old saves. `RG.saved()` is the only reader and drops any save whose `v` is not `RV`.

## Rogue mode as it stands

- 8 depths, 3 jars each, the third is a boss. Beat depth 8 to win, then optional endless depths (targets ×1.6 per depth).
- Each jar: reach `quota` points within `drops` drops. Overflow (pile above the line for 2.2s) or running dry ends the run. The pile carries between jars and is wiped at each new depth.
- Scoring per merge: `(tri(l) + flat points) × Mult`, where `tri(l)=(l+1)(l+2)/2` for the fruit made, `Mult = (1 + sum of add) × product of x`. Charm order does not matter. Seeds add to both the points and the add part for their own size. After that, one-off multipliers stack on the result: gold fruit (×2, or ×3 from Golden Hand), Double Down (×4), Cyclone (×2).
- Charms (`CH`, 39 plus 10 fusions): passive items, rarity 0 to 2, fusions are rarity 3. 5 slots (`SLOTS`), 6 with Charm Pouch. Hooks `chip`, `add`, `x` receive context `c` (see the comment above `CH`). Charms with no hook are special-cased in `makeGame` or `RG`.
- Tools (`TL`, 16 plus 3 fusions): abilities tapped during a jar. A run starts with Swap and Shake in 2 slots (`TS0`), up to 4 (`TSLOTS`) through the Tool Belt upgrade. Each tool needs `ch` charge and gains 1 per merge. Charge carries between jars, a bought tool arrives full. No coin cost, no cooldown. Targeted tools (Ripen, Twin, Midas, Anchor) arm first, then the player taps a fruit. Tool charms: Juggler, Spark Plug, Showman, Overdrive, Crowd Pleaser, Encore, Battery, Dynamo. The Padlock boss locks tools.
- Fruit states added by tools: `gold` (Midas, ×2 and 2 coins when it merges, saved in the pile), `anch` (Anchor, stuck until the next jar starts). Jar states: `free` (Free Sample drops), `dd` (Double Down), `stash` (the Next fruit Rewind pushed back).
- Fusions: an entry in `CH` or `TL` with `fu:[a,b]`. Charm fusions take two charms, tool fusions take a tool then a charm. Never sold, never a random crate pick. `RG.fusable(R)` lists the ones the run holds both halves of, `RG.fuse` makes one: it takes the first half's place, frees the other slot, and a charm fusion keeps the halves' grown value. Recipes: Four-Leaf Clover (Lucky Clover + Horseshoe), Golden Goose (Piggy Bank + Savings Account), Volcano (Fireworks + Compost), Headliner (Showman + Encore), Smoothie (Juicer + Honey Pot), Marathon (Early Bird + Photo Finish), Wildfire (Hot Streak + Chain Reaction), Melon Mania (Heavyweight + Melon Fever), The Mint (Scratch Card + Golden Touch), Sharpshooter (Bullseye + Lodestone), Cyclone (Whirl + Metronome), Sleight of Hand (Swap + Juggler), Golden Hand (Midas + Fat Wallet). Recipes are not shown before the player holds both halves (the user removed combo hints on purpose). The hub and shop then say "Fusion ready".
- Crates (`CRT`): pick 1 of 3 free (4 with Crowbar), or leave it for a few coins. A boss drops a gold crate, a melon crate every 4th depth. Those two offer a ready fusion as the first pick. Wooden crates come from skipping and from the shop (one crate of a single kind per visit, prices in `CRP`). Picks are charms, tools, seed levels or coins. Higher tiers mean rarer charms and more seed levels. A pick is blocked while its slots are full, and the crate screen lets the player sell to make room. `RG.crate` builds one, `RG.take` / `RG.leave` resolve it and move on to `crate.then` (shop or hub).
- Skip: jar 1 or 2 of a depth can be skipped from the hub or shop. No payout, no shop, a wooden crate, then the hub for the next jar.
- Bosses (`BOSS`, 15): one static rule each, chosen per depth at run start, `min` = first depth it can appear. Depth 8 is always `melon`.
- Upgrades (`UPG`, 18): `max` caps how many can be owned, `now` marks the instant ones (Scrub, Bribe). Owned ones cost 2 more each time. Stacking with no cap: Fertiliser, Hot Sauce, Watering Can. Capped: Tool Belt, Charm Pouch, Bigger Shelf, Seed Bag, Loaded Dice, Good Taste, Haggler, Vault, Packed Lunch, Whetstone, Slow Fuse, Tambourine, Crowbar. The engine reads them through `ro.up(id)`.
- Seeds: `R.sd[l]` is the level for the fruit of tier `l` (1 to 10, shown as size `l+1`). Each level gives `sdP(l)=4+2l` points and `SDM=0.5` Mult when that fruit is made. Price `SDC=3` plus 1 per level held. The shop offers sizes 2 to 8 before depth 4, every size after.
- Economy: jar payout `RPAY`, unused drops bonus, interest 1 per 5 coins (cap 4), shop of 3 charms, 2 tools, 3 upgrades, 2 seeds and 1 crate, reroll from 2 coins, sell for half price. Coins are spent in the shop only.
- Balance tables: `RQ` (depth 1 targets), `RSC` (target multiplier per depth), `RDROPS`, `RPAY`, and `c`/`ch` on each tool.

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

### Stage 4: Bosses and difficulty — planned
- Bosses get a **second phase** at 50% of the target (the rule escalates).
- About 12 new bosses that attack builds: Mirror (aim reversed), Thief (disables a charm), Vise (walls close in until you make a big fruit), Tide (line rises and falls), Gambler (random sizes), Auditor (Mult capped), Twins (each merge spawns a size 1), Clock (fruit auto-drops after 3s), Hydra (destroyed fruit splits), Miser (tools charge at half speed), Collector (must also make a named fruit), Vampire (score drains over time).
- Depth 4 gets a mid-boss, depth 8 draws from a final boss pool (Melon King plus 2 or 3 new ones).
- Retune `RSC`, `RQ`, drops and payouts upward once Stages 1 to 3 have raised player power.

### Stage 5: Achievements, unlocks, Almanac — planned
- About 30 achievements, mostly multi-condition (clear a boss with no tool use, score 3× a target, win with 3 charms or fewer, two watermelons in one jar, every fruit size in one jar). Each unlocks a named charm, tool, fusion recipe or starting jar. Some are secret.
- All 35 current charms stay unlocked. Roughly a third of the new content is locked.
- **Almanac**: glossary with tabs for Charms, Tools, Fusions, Upgrades and Seeds, Bosses, Achievements. Unseen entries are silhouettes, locked entries show their unlock condition, seen entries show full text and stats. Open from the menu and the pause screen.
- Unlock toasts in play and a summary on the run over screen.

### Stage 6: Stakes and starting jars — planned
- **Stakes**: 8 stacking difficulty levels, each unlocked by winning the one below (lower payouts, faster targets, fewer drops, dearer shop, mid-bosses from depth 5, perishable charms, phase 2 from the start, double-rule final boss).
- **Starting jars**: 5 or 6 unlockable loadouts with a rule twist each.
- Leaderboard: record the stake with the score. Needs a `database.rules.json` change and a console re-publish, flag this to the user.
- Full balance pass.

### Later
- Sign-in and cloud save (user will ask). Plan: Firebase Auth, `users/$uid/profile`, merge with `mergeProfile`. The run save can sync too.
- Charm editions, daily seeded run, more fusions.

## Open decisions (defaults will be used unless the user says otherwise)

1. Charm order stays irrelevant to scoring.
2. Existing charms stay unlocked.

## Working rules

- Nothing in the roadmap is implemented until the user gives the go-ahead for that stage. One go-ahead covers one stage.
- Keep `README.md` and this file current when rules or tables change.
- Never add permanent power meta progression (see pillar 7) without asking.
- The Firebase rules file is applied by hand in the console. Any change to it must be called out to the user.
