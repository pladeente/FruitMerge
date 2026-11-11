# Fruit Merge

A drop-and-merge physics game (drop fruit, matching pairs merge one size up, 11 sizes, the last is a watermelon). Static site, no build step, no dependencies, installable as a PWA. Hosted from the repo root (GitHub Pages style).

The active work is turning **Rogue mode** into a deep roguelite. Classic and Wild are finished and should not change unless asked.

## Files

| File | What it holds |
|---|---|
| `index.html` | CSS, HTML shell, engine (`makeGame`), Classic and Wild, all screens including the Rogue ones, the dev panel. About 580 very long lines. |
| `rogue.js` | Rogue rules and data (`CH`, `BOSS`, `UPG`, `RG`, balance tables), the player profile (`PF`, `mergeProfile`) and run events (`rgEv`). Loaded before the main script. No DOM access. |
| `icons.js` | Pixel art. `PXD` = 12x12 letter grids, `PXP` = palette, `PXF`/`PXFB` = score pop-up font. |
| `sw.js` | Service worker, network first, cache fallback. Bump `CACHE` and update `CORE` whenever a file is added or renamed. |
| `database.rules.json` | Firebase Realtime Database rules for the leaderboard (pasted into the console by hand). |
| `README.md` | Player/host facing notes, including Firebase setup. |

## Run and test

- Run: `python3 -m http.server 8000` in the repo root, open `http://localhost:8000`. Opening the file directly also works, minus the service worker.
- No test suite. Verify changes by driving the page with Playwright (preinstalled in cloud sessions): load, start a Rogue run, drop fruit, open the shop, check the console for errors. Keep throwaway scripts out of the repo.
- Syntax check quickly by loading the page headless and failing on any `pageerror`.
- The engine can be stepped by hand in a test: `G.g.up(x)` drops, `G.g.update(.016)` advances one frame, so a whole jar plays in milliseconds. Top-level `const`s (`G`, `RUN`, `RG`, `PF`) are reachable from `page.evaluate`.
- **Dev panel**: open the page with `?dev`. Jump to any depth and jar, set the boss, add charms and upgrades, add coins, clear the jar being played, log or reset the profile. Any run it touches gets `R.dev=1`: no stats, no glossary marks, no score boards. Add new item types to it as they land.

## Code conventions

- Hand-written dense style: short names, many statements per line, one function per line where possible. Match it. Do not reformat existing lines, diffs must stay readable.
- No frameworks, no bundler, no npm. Plain script tags.
- UI screens are HTML strings passed to `show(html)`, which fills `#ui .msg`. Buttons carry `data-a="action"`, dispatched in one click listener (`rgAct` for Rogue actions, all prefixed `r`).
- Icons: `ic('name')` returns `<i class="px px-name">`. A charm, boss or upgrade uses the grid named after its id unless `ICN` maps it to another. Every new item needs a grid in `icons.js` or an `ICN` entry.
- Canvas text goes through `T()`, score pop-ups through `dmg()`, plain floating text through `floatTxt()`.
- Sounds are synthesised in `SFX`, played with `snd('name')`.
- Font is Jersey 15, embedded as base64 in `index.html`. Do not open that line in an editor view if avoidable, it is huge.
- In-game text is short, plain and literal. A description must say exactly what the item does, with numbers.

## Architecture

- `store`: localStorage wrapper, keys prefixed `fruitMerge.v1.`. Keys in use: `mode`, `name`, `snd2`, `scores2`, `scoresWild2`, `scoresRogue`, `run` (the saved Rogue run), `profile` (all meta progress).
- `G`: app state. `G.state` is one of `menu`, `play`, `pause`, `over`, `rogue` (any Rogue screen between jars). `G.g` is the live game, `RUN` the live Rogue run.
- `makeGame(W,H,wild,onOver,ro)`: the engine (physics, merging, specials, powers, drawing). Returns `{update, draw, up, use, jar, wipe, snap, load, scrub, ...}`. `ro` is null in Classic and Wild. In Rogue it is the hook object from `RG.ro(R, clear, fail, fx)`, the only way the engine talks to run state.
- `RG` (`rogue.js`): pure Rogue rules over a run object `R`: `new`, `saved`, `jarCfg`, `score`, `made`, `kill`, `payout`, `advance`, `stock`, `buy`, `sell`, `reroll`.
- `PF` (`rogue.js`): the profile, one object under one storage key: `{v, rev, at, seen, unlocked, ach, stats, stakes}`. `seen`/`unlocked`/`ach` map namespaced ids (`ch.juicer`, `boss.fog`, `up.fert`) to the time first reached. `stats` is flat counters and records that only go up (`PF.inc`, `PF.max`). `PF.save()` writes only when dirty and is called from `rgSave`, `rgEnd`, tab hide and page hide. `mergeProfile(a,b)` joins two copies (earliest time, highest number) and is the whole sync story for sign-in. All meta progress must live in the profile.
- `rgEv(R, name, data)` (`rogue.js`): the single place things get counted, into `R.st` (run), `R.jst` (current jar, reset by the `start` event) and `PF.d.stats` (lifetime). The engine fires `drop`, `merge`, `tool`, `kill`, `net` through `ro.ev`. Screens fire `run`, `start`, `jar`, `end`, `buy`, `sell`, `up`, `roll`. Achievements (Stage 5) hook in at the end of it. New mechanics must fire an event here.
- `rgSee(kind, ids)`: marks things as met for the glossary. Called when the shop or hub shows them.
- Rogue UI: `rgIntro`, `rgStart`, `rgHub`, `rgGo`, `rgClear`, `rgShop`, `rgInfo`, `rgCharm`, `rgEnd`, header charm slots in `rgHead`, charm flash in `rgPulse`.
- Leaderboard: `lbTop`/`lbSubmit`, Firebase REST, no SDK. Modes `classic`, `wild`, `rogue`.

### Run object (save version `RV`, now 3)

`{v, depth, jar, coins, total, ch:[{id, v?}], up:{fert,sauce,can,scrub}, bs:[boss ids per depth], shop:{ch,up,rr}, pile:[snapshot], at:'hub'|'shop', won, cfg, st:{run stats}, jst:{jar stats}, dev?}`. Saved between jars only, never mid-jar. Any change to this shape needs a version bump and either a migration or dropping old saves. `RG.saved()` is the only reader and drops any save whose `v` is not `RV`.

## Rogue mode as it stands

- 8 depths, 3 jars each, the third is a boss. Beat depth 8 to win, then optional endless depths (targets ×1.6 per depth).
- Each jar: reach `quota` points within `drops` drops. Overflow (pile above the line for 2.2s) or running dry ends the run. The pile carries between jars and is wiped at each new depth.
- Scoring per merge: `(tri(l) + flat points) × Mult`, where `tri(l)=(l+1)(l+2)/2` for the fruit made, `Mult = (1 + sum of add) × product of x`. Charm order does not matter.
- Charms (`CH`, 35 of them, rarity 0 to 2): passive items, 5 slots (`SLOTS`). Hooks `chip`, `add`, `x` receive context `c` (see the comment above `CH`). Charms with no hook are special-cased in `makeGame` or `RG`.
- Powers: `swap`, `shake`, `whirl`, `rumble`. Fixed set of four, cost coins (`RPRICE`), have cooldowns (`COOL`).
- Bosses (`BOSS`, 15): one static rule each, chosen per depth at run start, `min` = first depth it can appear. Depth 8 is always `melon`.
- Upgrades (`UPG`, 4): `fert`, `sauce`, `can` stack with rising price, `scrub` is instant.
- Economy: jar payout `RPAY`, unused drops bonus, interest 1 per 5 coins (cap 4), shop of 3 charms and 2 upgrades, reroll from 2 coins, sell for half price.
- Balance tables: `RQ` (depth 1 targets), `RSC` (target multiplier per depth), `RDROPS`, `RPAY`, `RPRICE`.

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

### Stage 1: Tools (clickable abilities) — planned
- Powers become **Tools**: a loadout of slots (start 2, max 4) filled from shop and crates. Start with Swap and Shake.
- Tools **charge from merges** instead of costing coins. Coins become shop-only. Charge ring on each button, pulse and sound when ready, keys 1 to 4.
- Targeted tools: arming one makes the next tap pick a fruit instead of dropping.
- New tools (about 12): Ripen (tap a fruit, +1 size), Twin (copy a tapped fruit into your hand), Blender (smallest size in the jar merges in pairs), Free Sample (next 2 drops are free), Cherry Bomb (held fruit becomes Boom), Lodestar (held fruit becomes Magnet), Midas (tapped fruit turns gold, pays coins when merged), Rewind (undo last drop), Double Down (next merge ×4, costs 2 drops), Sieve (clears size 1 fruit), Anchor (tapped fruit cannot move for the jar), Cash Out (turn charge into coins).
- Existing power charms (`show`, `encore`, `battery`, `juggle`) are reworked for charges. New charms that key off tool use.

### Stage 2: Upgrades and Seeds — planned
- Upgrades grow from 4 to about 16, most with two tiers: +1 charm slot, +1 tool slot, 4th shop charm, cheaper rerolls, higher interest cap, boss reroll, extra crate choice, better rarity odds, full sell value, starting tool charge, and the existing four.
- **Seeds**: level up one fruit size for the run (more base points and a little Mult when that size is made). 11 sizes, so builds can specialise. Balatro's planet cards, in fruit form.
- Shop layout: Charms, Tools, Upgrades, Seeds, Crates.

### Stage 3: Crates, Fusions, Skips — planned
- **Crates**: every boss drops one (pick 1 of 3). Wood, Gold, Melon tiers. Also sold in the shop by type (Charm, Tool, Seed).
- **Fusions**: owning both halves of a recipe makes the next boss crate offer the fusion. It takes one slot, frees the other. About 12 recipes, charm + charm and tool + charm. Examples: Lucky Clover + Horseshoe, Piggy Bank + Savings Account, Fireworks + Compost, Showman + Encore, Whirl + Metronome.
- **Skip**: jar 1 or 2 of a depth can be skipped for a crate. No payout, no shop.

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

1. Tools charge from merges, coins are shop-only.
2. Charm order stays irrelevant to scoring.
3. Existing charms stay unlocked.

## Working rules

- Nothing in the roadmap is implemented until the user gives the go-ahead for that stage. One go-ahead covers one stage.
- Keep `README.md` and this file current when rules or tables change.
- Never add permanent power meta progression (see pillar 7) without asking.
- The Firebase rules file is applied by hand in the console. Any change to it must be called out to the user.
