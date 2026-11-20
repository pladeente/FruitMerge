# Fruit Merge

Drop fruit, merge matching ones, make a watermelon. The game lives in `index.html`, the Rogue rules in `rogue.js`, the pixel art in `icons.js`.

## Modes

- **Classic**: the plain game.
- **Wild**: special fruit, mould, a caterpillar, and coin powers.
- **Rogue**: a run of 8 depths. Each depth is 3 jars with a score target and a drop limit, and the third jar is a boss with its own rule, which gets worse once you reach half its target. Depth 8 ends on one of three final bosses. The pile carries over between jars and is emptied at each new depth. Cleared jars pay coins for the shop, which sells charms (passive items, 5 slots), Orchard items (a second row of 2 slots for items that only change what drops), tools, upgrades and seeds. Every fruit belongs to a family (Stone fruit, Berries, Citrus, Pome, Tropical, Melons), and some charms score family merges. A seed levels up one fruit size for the rest of the run. Every boss drops a crate (pick 1 thing, free), and holding the right two items lets a boss crate fuse them into one. Jar 1 or 2 of a depth can be skipped for a smaller crate. Tools are abilities you tap during a jar (2 slots to start, up to 4). They charge as you merge and cost nothing to use. A run is saved between jars, so it can be continued later. Beating depth 8 wins, after which the run can continue into endless depths. A new run starts with a choice of starting jar (five of the six are opened by awards) and of Ripeness, eight difficulty levels that each add a rule. Each jar opens its own levels: winning on one opens the next for that jar.

Rogue rules live in `rogue.js`: `CH` (charms, and Orchard items marked `o`), `FAM` and `FMN` (fruit families), `TL` (tools), `BOSS`, `UPG` (upgrades), the seed numbers (`SDC`, `SDS`, `SDM`, `sdP`), crates (`CRT`, `CRP`), Legendary charms (rarity 4 in `CH`, found only in bought Charm Crates and melon crates), contracts (`CT`: an optional handicap on a jar that pays when the jar is cleared), skip rewards (`SKR`), fusions (entries with `fu` in `CH` and `TL`), and the balance tables `RQ` (depth 1 targets), `RSC` (target multiplier per depth) and `RPAY` (coins per jar).

Some tools, charms, upgrades and fusions start locked and are opened by awards (`ACH` in `rogue.js`). The Almanac, on the menu, lists everything you have met and every award. Other awards open looks (jar skins, backgrounds, fruit skins, sound sets, in `COS` in `rogue.js`), worn from Options. Looks change nothing about play. Progress that outlives a run (stats, things met, awards) is kept in one `profile` object on the device, ready to sync once sign-in exists.

For testing, open the page with `?dev` on the end of the address. A panel lets you jump to any depth, pick the boss and hand yourself charms and tools. Runs it touches do not count for scores or stats.

## Icons

No image files. Every icon is a 12x12 grid of letters in `icons.js`, one letter per pixel, drawn at load time. To change an icon, edit its letters. To add one, add a grid and use it as `<i class="px px-NAME"></i>`. A charm, tool, boss or upgrade uses the grid with the same name as its id, unless `ICN` in `index.html` points it at another one. The score pop-up font is in the same file.

The text font is [Jersey 15](https://github.com/scfried/soft-type-jersey) (SIL Open Font License 1.1), embedded in `index.html`.

## World leaderboard setup (Firebase, free tier)

Without this the game still works and keeps scores on the device only.

1. Go to https://console.firebase.google.com, create a project (Analytics not needed).
2. **Build → Realtime Database → Create database**. Pick a region, start in **locked mode**.
3. Open the **Rules** tab, paste the contents of `database.rules.json`, click **Publish**.
4. Copy the database URL shown at the top of the **Data** tab, e.g. `https://fruit-merge-1234-default-rtdb.firebaseio.com`.
5. In `index.html`, set it on this line:
   ```js
   const LB_URL='https://fruit-merge-1234-default-rtdb.firebaseio.com';
   ```
6. Commit and host the page (GitHub Pages works).

Scores are stored under `scores/classic`, `scores/wild` and `scores/rogue`. The rules allow reading, and adding new entries only (no edits or deletes), with a name of 1 to 12 characters and a score under 1,000,000 (1,000,000,000 for Rogue). To wipe a board, delete the node in the Firebase console.

If the database was set up before Rogue mode existed, paste `database.rules.json` into the Rules tab again and publish. Until then the Rogue world board says it can't be reached, and Rogue scores stay on the device.

Titles work the same way: the rules allow an optional `ti` (the player's title, up to 16 characters) on every score. Until the rules are re-published, scores post without it.

The same goes for stakes: the rules now allow an optional `k` (the Ripeness level, called stake in the code, 2 to 8) on Rogue scores. Paste `database.rules.json` into the Rules tab again and publish. Until then Rogue scores still reach the world board, but without their stake.

Run summaries (v1.39) use the same database. A player who switches them on (Options, or the question on the Run over screen) sends one small record per Rogue run to `runs`: where it ended, what beat it, the build, and the username when signed in. The rules let anyone add a record and only signed-in accounts read them. Paste `database.rules.json` into the Rules tab again and publish, or nothing is stored (Options then shows "Last run: not sent"). To read them, sign in, open the game with `?dev` and press Run data in the dev panel from the menu.

Note: any browser game that submits its own score can be cheated by someone who edits the request. The rules stop junk data and overwrites, not a determined cheater.

Title codes (v1.52) use the same database. Paste `database.rules.json` into the Rules tab again and publish, or redeeming and making codes is refused. A code gives a title (up to 16 characters, rarity Common to Legendary) to a set number of accounts. To make one, sign in as the owner account, open the game with `?dev`, go to the menu and press Make code in the dev panel: pick the title, rarity and number of uses and it saves the code and shows it. Copy it then, it is not shown again: the database keeps only a hash of it, under `codes`. If saving is refused, the screen shows the name and value to add under `codes` by hand in the console. Players redeem codes in Options, Redeem code, and must be signed in. The rules allow one claim per account and stop at the number of uses. To end a code early, delete its node in the console.

Daily runs, profiles and friends (v1.53) use the same database: `daily/<day>/<uid>` (one score per account per day, day = days since 1 Jan 1970 UTC), `pub/<uid>` (each player's public profile: username, title, three stats, best scores), `freq` (friend requests) and `frd` (friend lists, written in pairs when a request is accepted). Paste `database.rules.json` into the Rules tab again and publish, or none of them can be written. Old days' daily boards stay in the database; delete `daily/<day>` nodes in the console to tidy up.

## Accounts (Firebase Authentication, email and password)

Signing in is optional. An account keeps a player's Rogue profile (awards, unlocks, stats, Ripeness wins), saved run, local scores and title online, merges them when they sign in on another device, and reserves their username so nobody else can post scores under it.

1. In the Firebase console: Authentication, Sign-in method, enable **Email/Password** (leave the passwordless link off).
2. Paste `database.rules.json` into Realtime Database, Rules, and publish. The rules add `users` (each player reads and writes only their own) and `usernames` (one owner per name), refuse the worst slurs in any name, and refuse a claimed username from anyone but its owner.
3. The game uses the project's Web API key (`FB_KEY` in `index.html`) and talks to Firebase over REST, with no SDK. The key is not a secret: it only identifies the project, the rules protect the data.

Usernames and leaderboard names are 1 to 12 letters, numbers, spaces, `-` or `_` (usernames at least 3). The game filters slurs, swears and staff-sounding names (`nameBad`), the database rules repeat the worst of it. If something slips through, delete it under Realtime Database, Data.

