# Bosses: what each one looks like, and where to change it

Written 27 Nov 2026 (v1.88) so that a new context window can find and adjust any boss's animation without reading all of `fx.js`. Keep it current when a boss scene changes (`CLAUDE.md` points here).

## How a boss scene works

- **Rules** live in `rogue.js` (`BOSS[id]`: `n` name, `d` rule, `d2` phase 2, `min` first depth, `fin` final boss). The engine applies them (`B.<flag>` in `engine.js`).
- **Scenes** live in `fx.js` as `FXS.B_<flag>` entries (search `B_<flag>:{`). The comment line just above each entry describes the scene in words; keep it in step with the code.
- **Live state** comes from the engine every frame: `fxLv()` in `engine.js` builds `B_<flag>:{p, ph, done, ...}` (search `B_<flag>:{p:` in `engine.js`). `p` = the boss is on, `ph` = phase (2 = phase 2), `done` = beaten, plus anything the scene needs (positions, counts). `bossT(s,dt)` turns that into clocks on the scene state: `s.age` (seconds since it arrived), `s.p2t` (seconds since phase 2, null before), `s.dnt` (seconds since beaten, null before).
- **Events**: the engine calls `fx.ev(name, o)` at the moment a rule acts; every scene's `ev(s,n,o,A,g)` hears all of them. Boss events in use: `act`, `audit`, `boom`, `charge`, `cuckoo`, `drop`, `freeze`, `glut`, `grow`, `hcoin`, `hornd`, `jar`, `kill`, `mag`, `mould`, `mrock`, `prune`, `reap`, `save`, `slick`, `storm`, `tax`, `twins`, `viseo`, `wilt`.
- **Layers**, in drawing order (engine `draw`):
  1. `fx.arena` (v1.88): the boss's place behind the jar (see Arenas), right after `drawBg`, before `drawJar`.
  2. `fx.back`: over the jar glass, behind the fruit. The arena's jar tint and in-jar weather go first, then every scene's `back` (wall ooze, floor mould, frost...), then particles with `ly:0`.
  3. the fruit.
  4. `fx.front`: over the fruit. Most characters and monsters, then particles with `ly:1`.
  5. a falling fruit is drawn again over `front` (v1.84.1), then the held fruit, the HUD.
  6. `fx.top`: over the HUD (The Fog over the Next box, The Blackout's eyes, the Syrup's glob on your hand).
- **Grids**: charms draw in cells of `g.P` (about 3px), bosses on `fxBP(g)` (about 4px) so they have presence; The Tide's serpent uses 1.3 times the boss grid. Positions snap with `fq`.
- **Helpers**: `fxR` (one cell), `fxBlob(c,x,y,P,map)` (a map of `"i,j" -> colour` drawn with a dark outline: the way every big monster is built), `fxMD(map,cx,cy,r,col)` (a disc of cells into a map; `col` may be a function returning null to skip), `fxFade(map,u)` (Bayer dissolve: the fade in and out every monster uses), `fxEl` (ellipse), `fxS` (a sprite from `FXD` letter grids), `fxStar`, `fxDrop(s,P)` (the drop-in on arrival), `fst(t,fps)` (stepped time), `fhs(a,b)` (a fixed hash), `FBY` (Bayer table), `A.add` / `fxAd` / `A.burst` (particles).
- **Rim spots**: anything standing on the rim books a spot with `fxRX(id, pref, width, g)` so it never overlaps charms. Arena scenery and the Volcano draw behind without booking.
- **Testing**: every boss has a card in `fxlab.html` under the Bosses filter (`b<flag>`: it plays arrival, phase 1 with its events, phase 2 and beaten on a loop). Render frames with a Playwright script that steps `frame(c,1/60)` (see `CLAUDE.md`, Making animations), then play the boss in the game with `?dev` (set the boss for the jar) and check the console.

## Arenas (v1.88)

Every boss brings a place of its own (the user's ask: like stumbling on a boss in Elden Ring). All of it is data in `ARENA` in `fx.js` (search `const ARENA=`), keyed by scene id, read by `fxArena` (behind the jar) and `fxArJar` (the tint and weather over the glass):

- `sky:[top, horizon]` banded in 9 steps, `gr` ground colour, `sun:[colour, x, y, radius]`, `st` stars.
- `sc` scenery on the horizon (`SCN`: hills, mounts, dunes, waves, city, hall, castle, trees, swamp, grave, hedge, gears) with colours `sk:[far, near]` and options `o` (`win` window colours, `neon`, `chim` chimneys with smoke, `fac`, `tall`, `snow` caps, `shard` floating shards, `k` tree kind pine/round/dead/maple/cherry, `mush` giant mushrooms, `bars`, `shelf`, `ban` banners, `col` columns, `frame` picture frames, `flag` castle flag colour). The static part is drawn once and cached (`FXSC`), animated details (windows, flags, smoke, gears, shards, waves) are drawn live.
- `cl` clouds `{n, v px/s (sign = direction), c:[top, underside], y:[top, bottom] share of the sky, s size}`; each cloud shape is cached (`FXCC`).
- `wx` weather (`fxWx`: rain, snow, spores, embers, leaves, ash, sand, coins, petals, dust, drip, gnats, paper, sparks, pebbles, sparkle, steam, moths, fog), `wn` amount, `wc` colours. It is drawn behind the jar and, at half strength, inside the glass.
- `dk` darkness over the whole scene, `jar:[tint, alpha]` over the glass, `vg` vignette, `fl` lightning (a flash and a bolt in the sky every 2 to 6 s).
- Phase 2 thickens it all (more clouds and weather, faster, darker). Beaten, it clears over 2.6 s. The Orchard Queen, the Reaper and the Melon Queen take the arena when they share a jar with another rule (`FXAR_PRI`).

## The bosses

Each entry: the rule, what the scene shows, its arena, and where to look.

### The Taxman
- **Rule:** Takes a coin every 4 drops. **Phase 2:** Takes a coin every 2 drops. First depth 2.
- **Scene:** The Taxman: walks in at the left end of the rim, nearest your coin counter, and writes in his ledger, sack on his back. Each tax he turns to the wall and holds the sack open,
- **Arena:** scenery `city`, weather `rain`, darkness .12, clouds 6 at 18 px/s.
- **Code:** `fx.js` `B_tax:{` (scene), `ARENA.B_tax` (arena); `engine.js` `B_tax:{p:` (live state: `done`); preview card `btax`.

### The Storm
- **Rule:** A whirlpool hits every 6 drops. **Phase 2:** A whirlpool hits every 4 drops. First depth 3.
- **Scene:** The Storm: a scowling storm cloud rolls over the jar and rains into it. Each whirlpool it throws a lightning bolt at the jar. Phase 2: bigger, darker, red-eyed, heavier rain. Beaten: it breaks up and a rainbow arcs over the jar
- **Arena:** scenery `hills`, weather `rain`, darkness .38, lightning, clouds 18 at 300 px/s.
- **Code:** `fx.js` `B_storm:{` (scene), `ARENA.B_storm` (arena); `engine.js` `B_storm:{p:` (live state: `done`); preview card `bstorm`.

### Cold Snap
- **Rule:** Every 4th fruit is Frozen: when it lands it freezes up to 4 fruit it touches for 3 seconds, then shatters. Each frozen fruit shrinks one size when it thaws, and a Cherry vanishes. **Phase 2:** Every 3rd fruit is Frozen. First depth 3.
- **Scene:** Cold Snap: frost creeps over the glass from the corners and icicles hang from the rim; a frost sprite hovers above and blows cold on every Frozen fruit you are handed. Phase 2: a blizzard. Beaten: the icicles drip and fall, the frost melts
- **Arena:** scenery `mounts`, weather `snow`, darkness 0, clouds 5 at 30 px/s.
- **Code:** `fx.js` `B_ice:{` (scene), `ARENA.B_ice` (arena); `engine.js` `B_ice:{p:` (live state: `done`, `ci`); preview card `bice`.

### The Thief
- **Rule:** Your leftmost charm does nothing. **Phase 2:** Your leftmost 2 charms do nothing. First depth 3.
- **Scene:** The Thief: tiptoes in along the rim with his sack on his back, then crouches and leaps up out of sight to swipe your leftmost charm (it goes dark up in the header) and drops back with a fatter sack.
- **Arena:** scenery `city`, weather `-`, darkness .22, stars, clouds 3 at 14 px/s.
- **Code:** `fx.js` `B_thief:{` (scene), `ARENA.B_thief` (arena); `engine.js` `B_thief:{p:` (live state: `done`, `ids`); preview card `bthief`.

### The Melon Queen (final boss)
- **Rule:** A Watermelon (11) drops into your jar and stays. It never counts as over the line. **Phase 2:** A big rock drops into the lowest gap as well. It never counts as over the line either. First depth None.
- **Scene:** The Melon Queen: royal pennants unfurl from the rim corners, a crown comes down onto her Watermelon, an ermine-trimmed cape spreads behind her and a sceptre stands at her side (v1.81.1). Phase 2: the crown glows red-hot, the sceptre's orb burns and she hurls her rock. Beaten: her crown pops off and rolls away, the sceptre topples and the cape slips away
- **Arena:** scenery `castle`, weather `petals`, darkness 0, sun, clouds 5 at 16 px/s.
- **Code:** `fx.js` `B_melon:{` (scene), `ARENA.B_melon` (arena); `engine.js` `B_melon:{p:` (live state: `done`, `q`, `x`, `y`, `r`); preview card `bmelon`.

### The Clock
- **Rule:** Your fruit drops by itself after 3 seconds. **Phase 2:** It drops after 2 seconds. First depth 2.
- **Scene:** The Clock: a cuckoo clock lands on the rim. Its red hand sweeps once in the time your fruit has before it drops by itself, the pendulum ticks, and the cuckoo pops out each time it drops your fruit for you.
- **Arena:** scenery `gears`, weather `dust`, darkness .12, stars.
- **Code:** `fx.js` `B_clock:{` (scene), `ARENA.B_clock` (arena); `engine.js` `B_clock:{p:` (live state: `done`, `ck`); preview card `bclock`.

### The Fog
- **Rule:** The Next box is hidden. **Phase 2:** Your own fruit is hidden too. First depth 1.
- **Scene:** The Fog: a fog bank rolls over the Next box with two yellow eyes blinking inside it. Phase 2: it creeps down over the fruit you are holding and the eyes turn to watch it. Beaten: a gust blows it away
- **Arena:** scenery `trees`, weather `fog`, darkness .05.
- **Code:** `fx.js` `B_fog:{` (scene), `ARENA.B_fog` (arena); `engine.js` `B_fog:{p:` (live state: `done`); preview card `bfog`.

### The Hourglass
- **Rule:** 6 fewer drops. **Phase 2:** 2 more drops are taken away. First depth 2.
- **Scene:** The Hourglass: an hourglass stands on the rim, its top bulb holding the drops you have left and the sand running down. Phase 2: it flips over and two drops fall through at once. Beaten: the glass cracks and shatters and the sand spills into the jar
- **Arena:** scenery `dunes`, weather `sand`, darkness 0, sun.
- **Code:** `fx.js` `B_hour:{` (scene), `ARENA.B_hour` (arena); `engine.js` `B_hour:{p:` (live state: `done`, `f`); preview card `bhour`.

### The Wilt
- **Rule:** Every 4 drops your biggest fruit shrinks one size. **Phase 2:** It shrinks every 3 drops. First depth 3.
- **Scene:** The Wilt: a wilting flower droops in a pot on the rim. Every time it shrinks your biggest fruit it sighs and a sickly puff drifts onto that fruit. Phase 2: it sheds petals. Beaten: it perks up and blooms
- **Arena:** scenery `trees`, weather `leaves`, darkness .06, clouds 4 at 20 px/s.
- **Code:** `fx.js` `B_wilt:{` (scene), `ARENA.B_wilt` (arena); `engine.js` `B_wilt:{p:` (live state: `done`); preview card `bwilt`.

### The Padlock
- **Rule:** Tools are locked. **Phase 2:** Every tool loses all its charge. First depth 1.
- **Scene:** The Padlock (v1.80: on the tool bar itself, the user's idea): chains cross your tools in an X and a padlock slams shut over them; the scene only keeps its clocks, fxLockBar draws it on a canvas over #tb (fxLockSync, from syncPw)
- **Arena:** scenery `hall`, weather `dust`, darkness .2.
- **Code:** `fx.js` `B_lock:{` (scene), `ARENA.B_lock` (arena); `engine.js` `B_lock:{p:` (live state: `done`); preview card `block`.

### The Gambler
- **Rule:** Every fruit is a random size from 1 to 6, whatever your Orchard says. **Phase 2:** Sizes go up to 7. First depth 2.
- **Scene:** The Gambler: a slot machine stands on the rim. Every time you are dealt a fruit it pulls its lever and the reels spin, the middle one landing on your Next fruit. Phase 2: it flashes red and plays with bigger fruit. Beaten: it pays out a shower of coins and its lights die
- **Arena:** scenery `city`, weather `coins`, darkness .12, stars.
- **Code:** `fx.js` `B_gamble:{` (scene), `ARENA.B_gamble` (arena); `engine.js` `B_gamble:{p:` (live state: `done`, `nx`, `ns`, `hid`); preview card `bgamble`.

### The Twins
- **Rule:** Every merge that makes a size 3 fruit or bigger drops a Cherry (1) into the jar. **Phase 2:** It drops 2 of them. First depth 2.
- **Scene:** The Twins: two cherry kids sit on the rim holding stems. Every merge that drops a Cherry in, one of them kicks it into the jar. Phase 2: they both throw. Beaten: they fall asleep leaning on each other
- **Arena:** scenery `trees`, weather `petals`, darkness 0, clouds 6 at 24 px/s.
- **Code:** `fx.js` `B_twins:{` (scene), `ARENA.B_twins` (arena); `engine.js` `B_twins:{p:` (live state: `done`); preview card `btwins`.

### The Miser
- **Rule:** Tools charge at half speed. **Phase 2:** Tools stop charging. First depth 2.
- **Scene:** The Miser: a hunched old man in a nightcap shuffles onto the rim clutching a glass jar. Every time your tools would charge, a spark of it flies up out of the tool bar into his jar instead. Phase 2: he hugs the jar and takes every spark. Beaten: the jar smashes and the sparks fly home
- **Arena:** scenery `city`, weather `dust`, darkness .28, stars.
- **Code:** `fx.js` `B_miser:{` (scene), `ARENA.B_miser` (arena); `engine.js` `B_miser:{p:` (live state: `done`); preview card `bmiser`.

### The Quarry
- **Rule:** Every 5th drop is a rock that never merges. **Phase 2:** Every 3rd drop is a rock. First depth 3.
- **Scene:** The Quarry: a miner pushes a cart of rocks along rails on the rim. When a rock is next, he wheels it over; when it reaches your hand he tips it in. Phase 2: the cart is heaped and his lamp flashes red. Beaten: the cart tips over and he waves goodbye
- **Arena:** scenery `mounts`, weather `pebbles`, darkness 0, clouds 3 at 14 px/s.
- **Code:** `fx.js` `B_stone:{` (scene), `ARENA.B_stone` (arena); `engine.js` `B_stone:{p:` (live state: `done`, `nxr`, `rock`); preview card `bstone`.

### The Mirror
- **Rule:** Your aim is flipped left to right. **Phase 2:** The Next box is hidden too. First depth 1.
- **Scene:** The Mirror: a magic mirror hangs in the sky (charm grid, low enough to clear the HUD in the real game) and a shimmering line runs down the middle of the jar. A ghost of your fruit shows where your finger is, with a dotted arc to where it will really drop. Phase 2: the mirror cracks. Beaten: it shatters
- **Arena:** scenery `mounts`, weather `sparkle`, darkness .1, stars.
- **Code:** `fx.js` `B_mirror:{` (scene), `ARENA.B_mirror` (arena); `engine.js` `B_mirror:{p:` (live state: `done`, `can`, `l`); preview card `bmirror`.

### The Glutton
- **Rule:** A caterpillar eats one of your fruits every 3 drops. **Phase 2:** It eats every 2 drops. First depth 1.
- **Scene:** The Glutton: a place setting on the rim, plate, knife and fork. As its next meal comes round the knife and fork bang on the table; every meal leaves a core on the plate and a burp floats out of the jar. Phase 2: they never stop banging. Beaten: a napkin over the plate, cutlery crossed on top
- **Arena:** scenery `hall`, weather `embers`, darkness .15.
- **Code:** `fx.js` `B_glut:{` (scene), `ARENA.B_glut` (arena); `engine.js` `B_glut:{p:` (live state: `done`, `n`, `cat`, `x`, `y`, `st`); preview card `bglut`.

### The Syrup
- **Rule:** Every 3rd fruit is Sticky and stays where it lands. **Phase 2:** Every 2nd fruit is Sticky. First depth 1.
- **Scene:** The Syrup (v1.87, a monster in the bottle, the user's ask): a big syrup bottle on the rim with a syrup creature living in it, glaring at the fruit in your hand through the glass, bubbles rising round it; a goo tendril curls out of the neck and flings a glob onto every Sticky fruit you are handed, and syrup oozes down the inside of the jar's walls. Phase 2: the glass cracks and leaks, the creature turns red-eyed and bares its teeth, a puddle spreads on the floor. Beaten: its eyes shut, the syrup drains away, the cap pops off and the bottle fades
- **Arena:** scenery `trees`, weather `drip`, darkness .08, clouds 4 at 18 px/s.
- **Code:** `fx.js` `B_sticky:{` (scene), `ARENA.B_sticky` (arena); `engine.js` `B_sticky:{p:` (live state: `done`, `st`, `nx`, `sk`, `x`, `y`, `r`); preview card `bsticky`.

### The Swarm
- **Rule:** Only the two smallest fruits drop, whatever your Orchard says. **Phase 2:** Only the smallest fruit drops. First depth 2.
- **Scene:** The Swarm: a cloud of gnats buzzes over the jar and a few carry the fruit in your hand (only the smallest ones get through); each drop, some dive after it. Phase 2: the cloud doubles. Beaten: they scatter
- **Arena:** scenery `swamp`, weather `gnats`, darkness .14.
- **Code:** `fx.js` `B_swarm:{` (scene), `ARENA.B_swarm` (arena); `engine.js` `B_swarm:{p:` (live state: `done`, `can`); preview card `bswarm`.

### The Rot
- **Rule:** Fruit of size 6 or smaller that rest on the floor for 12 seconds go mouldy and stop merging. **Phase 2:** Mould sets in twice as fast, after 6 seconds. First depth 2.
- **Scene:** The Rot (v1.87, a monster, the user's ask): a hulking rotten fungus ogre squats on the rim, mottled green and bruised purple, toadstools sprouting from its head, its claws hooked over the edge of the jar; sunken eyes glow and its drooling mouth breathes spores into the jar, while mould creeps across the floor and every fruit that goes mouldy sprouts a little mushroom. Phase 2: it swells, more toadstools burst out, its eyes burn red and it breathes twice as often. Beaten: it slumps and rots away to nothing
- **Arena:** scenery `swamp`, weather `spores`, darkness .24, clouds 6 at 22 px/s.
- **Code:** `fx.js` `B_rot:{` (scene), `ARENA.B_rot` (arena); `engine.js` `B_rot:{p:` (live state: `done`, `m`, `x`, `y`, `r`, `m`); preview card `brot`.

### The Tide
- **Rule:** The line moves up and down, by up to 13% of the jar. **Phase 2:** It swings up to 24% of the jar. First depth 3.
- **Scene:** The Tide (v1.87, a monster, the user's ask): a sea serpent lives in the waves over the jar; its coils arch up out of the water and its horned head rears on the right, jaws working, eye fixed on the jar, all rising and falling with the line it drags up and down. The moon hangs behind it. Phase 2: a blood moon, a third coil, red eyes, a glowing crest and taller waves. Beaten: it roars once and sinks beneath the waves, the water calms
- **Arena:** scenery `waves`, weather `rain`, darkness .22, stars, lightning, clouds 7 at 120 px/s.
- **Code:** `fx.js` `B_tide:{` (scene), `ARENA.B_tide` (arena); `engine.js` `B_tide:{p:` (live state: `done`, `u`); preview card `btide`.

### The Blackout
- **Rule:** The lights go out. They come back on for a moment every 3 to 5 drops. You can still see the fruit you drop. **Phase 2:** They come on every 4 to 6 drops, for less time. First depth 3.
- **Scene:** The Blackout: a bare bulb hangs in the sky on its cord. In the dark, eyes open between the fruit and follow your hand; when the light flicks on they snap shut. Phase 2: the bulb cracks and stutters. Beaten: it shines steady and moths come to it
- **Arena:** scenery `-`, weather `moths`, darkness .35.
- **Code:** `fx.js` `B_dark:{` (scene), `ARENA.B_dark` (arena); `engine.js` `B_dark:{p:` (live state: `done`, `pt`, `hx`); preview card `bdark`.

### The Collector
- **Rule:** The jar only clears once you have also made a Pear (7). **Phase 2:** If you have not made it yet, it must now be a Pineapple (8). First depth 3.
- **Scene:** The Collector: a glass display case on the rim holds the shape of the fruit it wants, and a magnifying glass drifts over your biggest fruit, checking. Made it: the fruit appears in the case with a rosette. Phase 2 (not made yet): the label flips to a bigger fruit. Beaten: a gold star on the case
- **Arena:** scenery `hall`, weather `dust`, darkness .1.
- **Code:** `fx.js` `B_collect:{` (scene), `ARENA.B_collect` (arena); `engine.js` `B_collect:{p:` (live state: `done`, `l`, `got`, `big`, `x`, `y`, `r`, `l`); preview card `bcollect`.

### The Slick
- **Rule:** Every fruit is Slippery: it slides with almost no grip. **Phase 2:** The jar also shakes every 6 drops. First depth 4.
- **Scene:** The Slick: a wet floor sign on the rim, a sheen running over the glass and glints sliding off every fruit. Phase 2: each shake knocks the sign flat for a moment. Beaten: a mop wipes the floor dry and the sign folds away
- **Arena:** scenery `city`, weather `rain`, darkness .2, clouds 8 at 60 px/s.
- **Code:** `fx.js` `B_slick:{` (scene), `ARENA.B_slick` (arena); `engine.js` `B_slick:{p:` (live state: `done`, `fr`, `x`, `y`, `r`); preview card `bslick`.

### The Lid
- **Rule:** The line sits lower, by 14% of the jar. **Phase 2:** The line sits lower still, by 22% of the jar. First depth 4.
- **Scene:** The Lid: a grumpy screw-top lid hangs over the jar, its rim turning, arrows pressing the line down. Phase 2: it screws lower with a hiss of steam. Beaten: it pops off and spins away
- **Arena:** scenery `hall`, weather `steam`, darkness 0.
- **Code:** `fx.js` `B_lid:{` (scene), `ARENA.B_lid` (arena); `engine.js` `B_lid:{p:` (live state: `done`); preview card `blid`.

### The Auditor
- **Rule:** Mult above ×6 counts only half. **Phase 2:** Mult above ×4 counts only a quarter. First depth 4.
- **Scene:** The Auditor: a stern auditor stands on the rim with her clipboard, tapping her pen. Every merge whose Mult she cuts gets a red AUDITED stamp with the Mult struck through. Phase 2: she turns red in the face and her glasses flash. Beaten: she shuts the clipboard and walks off
- **Arena:** scenery `city`, weather `paper`, darkness 0, clouds 4 at 20 px/s.
- **Code:** `fx.js` `B_audit:{` (scene), `ARENA.B_audit` (arena); `engine.js` `B_audit:{p:` (live state: `done`); preview card `baudit`.

### The Vise
- **Rule:** The walls close in with every drop. Making a size 6 fruit or bigger opens them again. **Phase 2:** They close twice as fast. First depth 4.
- **Scene:** The Vise: steel jaws line both walls and a handwheel stands on each corner of the rim; every time the walls close in the wheels turn a notch and red arrows squeeze inward. Opening them (size 6+) spins the wheels back, sparks fly and teal arrows push out. Phase 2: the jaw teeth glow red-hot. Beaten: the wheels drop off
- **Arena:** scenery `city`, weather `sparks`, darkness .22.
- **Code:** `fx.js` `B_vise:{` (scene), `ARENA.B_vise` (arena); `engine.js` `B_vise:{p:` (live state: `done`, `vz`); preview card `bvise`.

### The Leech
- **Rule:** Your jar score drains away: 0.5% of the target every second. **Phase 2:** It drains twice as fast. First depth 5.
- **Scene:** The Leech: a fat leech clings to the rim, swelling as it drinks; drops of your score drip out of the score panel and into its mouth. Phase 2: it swells bigger and drinks twice as fast. Beaten: it pops
- **Arena:** scenery `swamp`, weather `drip`, darkness .28, stars, clouds 5 at 40 px/s.
- **Code:** `fx.js` `B_vamp:{` (scene), `ARENA.B_vamp` (arena); `engine.js` `B_vamp:{p:` (live state: `done`, `on`); preview card `bvamp`.

### The Reaper (final boss)
- **Rule:** Half the drops. Merges that make a size 4 fruit or bigger give 1 drop back. **Phase 2:** Only a size 6 fruit or bigger gives a drop back. First depth None.
- **Scene:** The Reaper (final boss, v1.81.1 bigger and darker, the user's ask): a towering hooded reaper hangs in the sky over the right of the jar, a black void under its hood with two burning eyes, a bony hand reaching for your fruit, a huge scythe over its head and smoke dripping from its tattered hem. It fades in out of the dark. Every merge that wins a drop back, its eyes flare, it swings the scythe in a wide arc and a soul floats down out of the jar to your drops. Phase 2: the eyes burn red, the blade's edge glows, lost souls circle it and the jar's edges darken. Beaten: the eyes go out, the robe crumples onto the rim and the scythe falls
- **Arena:** scenery `grave`, weather `ash`, darkness .36, stars, clouds 6 at 50 px/s.
- **Code:** `fx.js` `B_reaper:{` (scene), `ARENA.B_reaper` (arena); `engine.js` `B_reaper:{p:` (live state: `done`); preview card `breaper`.

### The Pruner
- **Rule:** Merges that make a size 4 fruit or smaller score nothing. **Phase 2:** Oranges (5) score nothing either. First depth 3.
- **Scene:** The Pruner: a pair of secateurs struts along the rim on its handles, snipping the air. Every small merge it zeroes, a giant pair snaps shut on it and the 0 falls in two halves with a few leaves. Phase 2: its blades glint red. Beaten: its spring snaps and it topples
- **Arena:** scenery `hedge`, weather `leaves`, darkness 0, clouds 4 at 20 px/s.
- **Code:** `fx.js` `B_prune:{` (scene), `ARENA.B_prune` (arena); `engine.js` `B_prune:{p:` (live state: `done`); preview card `bprune`.

### The Orchard Queen (final boss)
- **Rule:** Two bosses at once. **Phase 2:** Both step up. First depth None.
- **Scene:** The Orchard Queen (v1.81.1, a character now): the queen herself floats high over the jar in an apple-red gown and a purple cape trimmed with ermine, sceptre in hand, while her two rules play their own scenes below. Every time one of her rules strikes she raises the sceptre and its golden apple flares. She moves aside for a boss that needs the sky (The Lid, The Storm, The Blackout). Phase 2: her eyes glow and a dark aura gathers round her. Beaten: her crown tumbles into the jar and she bursts into blossom
- **Arena:** scenery `castle`, weather `petals`, darkness .1, stars, sun, clouds 5 at 26 px/s.
- **Code:** `fx.js` `B_queen:{` (scene), `ARENA.B_queen` (arena); `engine.js` `B_queen:{p:` (live state: `done`); preview card `bqueen`.

## Ideas the user has raised (not done yet)

- Give the remaining non-humanoid props more presence the way The Rot, The Syrup and The Tide got it in v1.87 (the user's examples of the bar: The Reaper and The Storm). Humanoid characters are fine as they are.
- More movement for the monsters (The Rot hops since v1.88).
