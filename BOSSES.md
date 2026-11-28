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
- **Boss sky and zoom** (v1.101): on boss and mini boss jars the engine zooms the world out (the HUD stays put) until the sky from the canvas top to the jar line is `BSKY` (0.7) times the jar's width, easing out as the jar starts and back in the moment the boss is beaten. Size every boss once to fit under the HUD at that sky (about 50 boss cells on a 412-wide phone); never scale a boss at runtime. A scene that aims at a screen spot (the HUD, the coin counter, the tool bar) maps it into the zoomed world with `g.sw(x,y)`; `g.z` is the zoom. fxlab has no zoom: check bosses in the real game. **Build the world wider than the jar** (v1.101.1): the zoom shows strips beside the jar, so full-width fills span `-g.W` to `2*g.W`, skylines go through `SCN`/`fxScnC` (mirrored at each side) or loop over `-0.3 W..1.3 W`, drifting clouds and weather wrap over that range too, edge effects use `g.sw(0,0)[0]` and `g.sw(g.W,0)[0]` for the screen's edges. Details in `CLAUDE.md`, Boss jar zoom and The wider world.
- **Jar shake** (v1.89): a scene sets `A.jsA` (pixels) and `A.jsT` (seconds); the engine translates the jar, the fruit and the scenes by `fx.jsh()` while it lasts. Only the picture shakes: no fruit moves.
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
- **The ATO (v1.96, the user's ask: the Taxman stays, with a big animated tax office behind him):** a brutalist concrete tower behind the jar at .74 of its width (drawn in `bg`, only what is above the rim shows; the tower is 46 cells wide, its spire reaches past the HUD): a lit sign board reading ATO (`ALF` letter grids), lit windows down the sides, two slanted window eyes under concrete brows that glow and watch the Taxman and the coin, a lobby grin of glass-door teeth. Lightning (`s.bolt`, timer `s.blt`) strikes the spire or the sky beside it every 2.4 to 4.6 s (1.1 to 2.3 s in phase 2), with a fork and a flash that lights the tower (`apal` fades every colour towards white). Each tax, once the coin lands in the sack, `feed` hops a coin from the sack into its mouth: it gulps, then cackles for a second (jaw chattering, eyes squeezed to slits, three HA floats) and licks its lips (a tongue sliding along the top lip, `s.eat`). Phase 2: red eyes with dollar-sign pupils, red windows, more lightning. Beaten: the windows go dark at random, the eyes shut, the grin flips to a frown, the sign sparks and dies, and it sinks behind the jar. An Australian flag (the user's ask, `flag`, on the charm grid) flies from a pole on the crown's left side, streaming right in stepped ripples with shaded folds, so the Union Jack canton sits top left at the hoist (the user's correction), the Commonwealth Star under it, the Southern Cross on the fly. In the game it sits in the gap between the score and Mult panels (pole and canton visible, the fly partly behind the Mult panel); the spire stands on the crown's right corner. Code: `B_tax.atoX`, `apal`, `ALF`, `bg`, `atick` (called from `tick`), `flag`, `feed` (called from the tax coin's `end`).
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
- **Scene (v1.93, the user's first idea: a clockwork owl):** a brass clockwork owl on the rim (rim spot .79, width 120), about 20 cells wide folded, 40 flared, 42 tall on the boss grid, built per frame as one cell map: a pendulum tail swinging over the rim into the jar, steel talons, wings (folded plates, or six blade feathers fanned by `wing`), a brass egg body with scalloped plates, rivets and a few patina spots, a chest dial (ticks, the red hand on `ck`, a slow hand), a wind-up key turning in its back, ear tufts, an angry brow plate, gear eyes (teeth turning, faster when tense or striking) with a one-cell glow ring, a hooked beak. The head ticks round every 0.5 s to stare at the held fruit (`hx`). Tense (`ck` over .6): leans in, wings lift halfway, eyes go white-hot, sparks. Strike (event `cuckoo`, 0.65 s): wings flared, beak open, chime rings from its chest and at the held fruit. Phase 2: cracked dial over a furnace glow, red eyes, steam from the tufts, faster pendulum. Beaten: gears burst out, the spring coils up out of its head, the head spins, it slumps and fades.
- **Jar:** a big clock face on the back of the glass (ticks, a slow hand, the red hand on `ck`), gears turning in the bottom corners.
- **Arena:** scenery `gears`, weather `dust`, darkness .12, stars.
- **Code:** `fx.js` `B_clock:{` (scene: `tick`, `back` the clock face, `front` the owl, `ev` the strike), `ARENA.B_clock`; `engine.js` `B_clock:{p:` (live state: `done`, `ck`, and `hd`: `hx`, `hy`, `hr`); preview card `bclock`.

### The Fog
- **Rule:** The Next box is hidden. **Phase 2:** Your own fruit is hidden too. First depth 1.
- **Scene (v1.95, the user's pick of four):** a hooded wraith of mist behind the jar at .7 of its width (drawn in `bg`, only what is above the rim shows): a peaked pale cowl with smoke streaming off its tip, a black void face with two slanted glowing cyan eyes that follow your fruit and blink, a row of teeth below, a robe with cloth folds flaring down behind the jar, wisps off the shoulders; it floats, bobbing a cell. A long arm (in `top`, over the HUD) reaches up from its shoulder, a ragged sleeve then a bony forearm, and its claw clutches the Next half of the HUD's right panel under the fog puffs that hide it (moved for the slim HUD, v1.98) (it reaches out after arriving). The other arm (in `front`) swings an iron lantern on a short chain, cold blue flame with a stepped glow. Phase 2: it rises 5 cells so its face stays above its cloak, the eyes turn red, the lantern burns orange and is raised high, and its cloak pours over the held fruit (`band`: the fog bank plus tattered streamers trailing from it; the engine also draws the held fruit as a grey ? dot). Beaten: a gust (wind streaks) hits it, the lantern smashes on the rim (glass, sparks, smoke, `s.ls`), and it is torn to rags: `shred` blows every cell right and thins it out, top first, with strips flying off; the eyes are the last to go.
- **Jar:** ground mist in the lower half, chunky two-tone banks on the boss grid drifting behind the fruit (`back`, a cell-sized image redrawn 8 times a second).
- **Arena:** scenery `trees`, weather `fog`, darkness .14, a darker grey-blue sky (v1.95).
- **Code:** `fx.js` `B_fog:{` (`pose`, `shred`, `tick`, `bg` hood and robe, `back` mist, `front` lantern arm, `band` and `puffs`, `top` the reaching arm and the fog over Next; layers drawn through `fxBlobI`, mist with no outline), `ARENA.B_fog` (arena); `engine.js` `B_fog:{p:` (live state: `done`, plus `hx`, `hy`, `hr`); preview card `bfog`.

### The Hourglass
- **Rule:** 6 fewer drops. **Phase 2:** 2 more drops are taken away. First depth 2.
- **Scene:** The Hourglass: an hourglass stands on the rim, its top bulb holding the drops you have left and the sand running down. Phase 2: it flips over and two drops fall through at once. Beaten: the glass cracks and shatters and the sand spills into the jar The held fruit is drawn again after `fx.top` while The Fog is up (v1.99), so the wraith's arm passes behind it.
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
- **Scene (v1.97, the user's pick of four: the bandit machine):** a living slot machine behind the jar at .32 of its width (drawn in `bg`, only what is above the rim shows): a red enamel cabinet with chrome trim and vents, an arched marquee of chasing bulbs round a lit 777, two reel windows for eyes under slanted chrome brows, and a reel-window mouth between dark lips with white fangs. Each deal (`jd` changes) the reels spin (`s.sp`): the eye reels blur through fruit and stop on glaring eyeballs (slit pupils that follow your fruit), the mouth's three reels stop left to right, the middle one on your Next fruit (a ? when the Next box is hidden). Its right arm is its lever (in `front`): a white-gloved hand yanks the red-knobbed lever down and lets it spring back (`s.yk`). Its left arm is a crane claw gripping the rim. A payout tray under its chin is heaped with coins, and coins drool off it into the jar (`ly:0` particles that come to rest at random depths). Phase 2: red bulbs and eyes, steam from its vents, the cabinet rattles while it spins. Beaten: eyes crossed out in red, the reels spin wild, TILT flashes, then it jackpots itself to pieces (`burst` flies the cells apart from its middle) in a shower of coins, sparks and smoke, with a jar shake.
- **Jar:** lined with casino felt (`back`, cached as `s.fcv`, 20%): green baize, a gold rule and faint card suits.
- **Arena:** scenery `city`, weather `coins`, darkness .12, stars.
- **Code:** `fx.js` `B_gamble:{` (`pose`, `burst`, `tick`, `bg`, `back`, `front`), `ARENA.B_gamble` (arena); `engine.js` `B_gamble:{p:` (live state: `done`, `jd`, `nx`, `ns`, `hid`, plus `hx`, `hy`, `hr`); preview card `bgamble`.

### The Twins
- **Rule (v1.91, the user's call: the free Cherries made it an instant win):** Every merge that makes a size 3 fruit or bigger drops an **Evil Cherry** into the jar: a rock (`sp:'stone'`, `l:0`, flag `ec:1`) that never merges, so every rock rule applies (Gargoyle, Shatter turns it into a plain Cherry and clears `ec`, Geode, bombs). **Phase 2:** It drops 2 of them. First depth 2. Drawn by `drawEvil` (`draw.js`, sprite `EVG`, 12x12 on the Cherry's grid at `ARS[0]`, eyes flicker orange), also the fruit the heads spit. The pile snapshot keeps `ec` as item 9.
- **Bot measurement (v1.91, depth 2 boss jar, aim-at-a-match bot, 50 to 60 jars each):** no items: old rule 284 points, new 156, a neutral boss (The Miser) 178, The Quarry 124. With Mult ×2.5 (Hot Sauce): old 50/50 cleared, new 20/50, Miser 27/50, Quarry 3/50. So the new rule is a little harder than a neutral boss and much easier than The Quarry.
- **Scene (v1.90, the user's pick of three: conjoined cherry ogres):** one two-headed cherry monster on the rim, about 44 cells wide and 34 tall on the boss grid (heads radius 9 at ±11, rim spot `.24`, width 196). Built in code each frame as one cell map (`fxBlob`, `fxFade` in and out like the Rot): roots over the rim, thorny vine arms from each head's outer side to a twig claw hooked over the rim (bezier of discs), two twisted stems up to a woody knot with two leaves, then the heads (glossy cherry shading lit top left, a dimple, blemishes), the acting head drawn last over its twin. Left head the brute (slanted brows, 4-wide eye sockets, black maw, fangs, corner tusks, drool), right head the grinner (one big eye, one squint with a stitched scar, a curved split grin of little teeth, a tongue that lolls when wide open). Eyes follow the held fruit (`l.hx`). Poses per head (`s.h[d].st`): `idle` (breathing, out of step), `spit` (lurches 2 cells towards the target, stretched, mouth 6 high, eyes wide; the Cherry flies from its mouth to the drop point), `rec` (snaps back squashed, teeth gritted), `chew` (cheeks working, 0.75 s). Both heads snarl at each other every 5 to 7 s (2.4 to 3.4 in phase 2): turn inward, eyes inward, brute bares teeth, grinner cackles, spittle. Arrival lands with a jar shake and a petal burst. Phase 2: heads swell 1, veins on the temples, eyes burn white with a glow, the stems crack and bleed juice (drips), the leaves wither. Beaten: they turn on each other and bite (juice burst, a small shake), then shrivel to dark husks with crossed-out eyes, the leaves droop, and dissolve.
- **Jar:** brambles grow down both walls of the glass over 5 s (`back`): thorns, leaves, blossoms, cherry pairs hanging off them; phase 2 the cherries darken and juice drips down the glass.
- **Arena:** a blood-red orchard at dusk: crimson sky, cherry-tree silhouettes (`trees`, `k:'cherry'`), dark clouds 6 at 24 px/s, a low red moon (`sun`), red and pink petals, darkness .14, a faint jar tint.
- **Code:** `fx.js` `B_twins:{` (scene: `tick` timers and particles, `back` brambles, `front` the monster, `ev` picks the head and spits), `ARENA.B_twins` (arena); `engine.js` `B_twins:{p:` (live state: `done` and `hd`: `hx`, `hy`, `hr`); preview card `btwins` (its held fruit follows `hx`). About 3.5 ms a frame headless.

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
- **Scene:** The Great Grub (v1.100, the user's pick of four): a giant red caterpillar (about 15 segments on the boss grid, radius 3.4 at the tail to 6.2, yellow spot on each, bristle tufts with yellow tips) arches over the jar from behind: its tail goes down behind the left of the glass, its front legs hook over the right rim (segment `S`) and its neck rears up like a cobra. Front-facing head (about 21 by 19 cells): an orange V on the capsule, curled horns, angry glowing eyes whose pupils follow the held fruit (or the small caterpillar), small eyes under them, serrated mandibles that open and drool. Poses by `s.md`: idle (sways, mandibles flex, drool drips), rear (the next meal is its own: head up, bristles up, mandibles clack), dive and eat (the head follows the engine's caterpillar point as its mouth on a stretching neck, chomps at 6 fps), back (mouth shut, cheeks out), laugh (after the small caterpillar's meal), roar (phase 2 start). After its own meal a lump runs from the head to the tail (`s.gl`), then a burp. The meals alternate (the user's ask): the giant first, then a small red caterpillar (drawn by the engine from the user's sheet recoloured by `catRd`), and so on. Jar: three chewed leaves pressed on the glass behind the fruit (cached in `FXSC`). Phase 2: a roar shakes the jar and spits silk, silk webs the top corners, bristles grow and turn red-tipped, eyes red. Beaten: it recoils with flickering eyes, withers to a dry husk (palette mixed in thirds), its head slumps on the rim, then it crumbles from the tail, a puff of dust per segment, the head last
- **Arena:** dusk sky, scenery `leaf` (giant leaves with bites out of them), a low sun on the left, 3 clouds, weather `leaves`, darkness .1, a green jar tint.
- **Code:** `fx.js` `B_glut:{` (scene: `G` the frame, `home` the mouth at rest that the engine starts and ends the giant's meal at, `build` the cell maps cached per frame, `bg` the arch, `back` the leaves, `front` silk, legs, neck and head), `ARENA.B_glut`, `SCN.leaf`; `engine.js` `B_glut:{p:` (live state: `done`, `n`, `gn` = the next meal is the giant's, `cat` {`x`, `y`, `st`, `gi`}, and the held fruit `hx`, `hy`), the meal turns `gbn` in `updCat` (`cat.gi`: starts at `FXS.B_glut.home`, moves at 330·K, not drawn by `drawCat`); preview card `bglut`.

### The Syrup
- **Rule:** Every 3rd fruit is Sticky and stays where it lands. **Phase 2:** Every 2nd fruit is Sticky. First depth 1.
- **Scene:** The Syrup (v1.87, a monster in the bottle, the user's ask): a big syrup bottle on the rim with a syrup creature living in it, glaring at the fruit in your hand through the glass, bubbles rising round it; a goo tendril curls out of the neck and flings a glob onto every Sticky fruit you are handed, and syrup oozes down the inside of the jar's walls. Phase 2: the glass cracks and leaks, the creature turns red-eyed and bares its teeth, a puddle spreads on the floor. Beaten: its eyes shut, the syrup drains away, the cap pops off and the bottle fades Since v1.99 it is drawn at 90% of the boss grid (the cell rounded to whole device pixels in `front`, `s.sc` keeps the scale for the glob's start in `tick`); at v1.101's boss sky its 53 cells clear the HUD.
- **Arena:** scenery `trees`, weather `drip`, darkness .08, clouds 4 at 18 px/s.
- **Code:** `fx.js` `B_sticky:{` (scene), `ARENA.B_sticky` (arena); `engine.js` `B_sticky:{p:` (live state: `done`, `st`, `nx`, `sk`, `x`, `y`, `r`); preview card `bsticky`.

### The Swarm
- **Rule:** Only the two smallest fruits drop, whatever your Orchard says. **Phase 2:** Only the smallest fruit drops. First depth 2.
- **Scene:** The Swarm: a cloud of gnats buzzes over the jar and a few carry the fruit in your hand (only the smallest ones get through); each drop, some dive after it. Phase 2: the cloud doubles. Beaten: they scatter
- **Arena:** scenery `swamp`, weather `gnats`, darkness .14.
- **Code:** `fx.js` `B_swarm:{` (scene), `ARENA.B_swarm` (arena); `engine.js` `B_swarm:{p:` (live state: `done`, `can`); preview card `bswarm`.

### The Rot
- **Rule:** Fruit of size 6 or smaller that rest on the floor for 12 seconds go mouldy and stop merging. **Phase 2:** Mould sets in twice as fast, after 6 seconds. First depth 2.
- **Scene:** The Rot (v1.89, the user's ask: a real leap across the jar, a swamp in the jar): a hulking fungus frog-ogre on the rim, mottled green with a pale belly, bruises and pustules, toadstools on its head, glowing eyes under a heavy brow and a fanged maw that breathes spores into the jar. The jar itself turns to murky swamp water with rubbish sunk in it (cans, a boot, a fish skeleton, a bottle, a tyre), scum on top, bubbles rising, mould creeping over the floor; every fruit that goes mouldy sprouts a mushroom. Every few seconds it crouches (thighs bunched, arms braced, eyes narrowed), leaps right over the jar to the other side of the rim (body stretched, arms thrown up, legs trailing, mouth open, slime dripping, its shadow sliding along the rim) and lands in a splat (arms slammed flat, legs splayed): the jar shakes (only the picture, no fruit moves), mud and spores fly. Phase 2: it swells, more toadstools, red eyes, it leaps and breathes more often and the water darkens. Beaten: it slumps and rots away
- **Arena:** scenery `swamp`, weather `spores`, darkness .24, clouds 6 at 22 px/s.
- **Code:** `fx.js` `B_rot:{` (scene), `ARENA.B_rot` (arena); `engine.js` `B_rot:{p:` (live state: `done`, `m`, `x`, `y`, `r`, `m`); preview card `brot`.

### The Tide
- **Rule:** The line moves up and down, by up to 13% of the jar. **Phase 2:** It swings up to 24% of the jar. First depth 3.
- **Scene:** The Tide (v1.87, reworked v1.89, the user's ask): a sea serpent lives in the waves; the jar itself turns to rough sea water (deep blue, darker going down, wave streaks sliding along, foam under the surface). Its body is one continuous wave of humps that rise out of the water and dip back under it, seen dimmed through the water in the jar, and its neck climbs out of the deep to a horned head that rears on the right, jaws working, eye on the jar, rising and falling with the line it drags up and down. The moon hangs behind it. Phase 2: a blood moon, tighter humps, red eyes, a glowing crest and taller waves. Beaten: the moon flashes white and bursts into smoke and shards, the serpent sinks with a splash and the water calms
- **Arena:** scenery `waves`, weather `rain`, darkness .22, stars, lightning, clouds 7 at 120 px/s.
- **Code:** `fx.js` `B_tide:{` (scene), `ARENA.B_tide` (arena); `engine.js` `B_tide:{p:` (live state: `done`, `u`); preview card `btide`.

### The Blackout
- **Rule:** The lights go out. They come back on for a moment every 3 to 5 drops. You can still see the fruit you drop. **Phase 2:** They come on every 4 to 6 drops, for less time. First depth 3.
- **Scene (v1.92, the user's first idea: something huge with glowing eyes behind the bulb):** a giant shadow beast behind the jar, centred at .42 of the jar, the bulb on its cord at .62 hanging in front of its face. Head and shoulders are drawn in `bg` (the new behind-the-jar layer, called by `fx.arena` before the jar), so the jar hides everything below the rim; arms and hands in `front`. Built per frame as cell maps with role letters (`B` body, `S` shade, `H` lit side, `R` rim light, `K` socket, `M` mouth, `T` tooth, `O`/`o` horn, `E` eye, `W` eye core, `C` claw) coloured by `pal(dk,p2)`: in the dark a near-black hide with a violet rim light on every top edge, glowing slit eyes with a one-cell glow ring and glowing teeth; under the light a grey-violet hide, bone horns and shoulder spines (blended in thirds). `s.rs` = how far it has risen: 0 until the first darkness, 1 in the dark, .62 under the light (ducked), and the body sinks by `(1-rs)*34` cells. States: lurk (dark: breathing, eyes follow `hx`, fingers drum on the rim), reach (every 3.8 to 5.3 s in the dark, 2.2 to 3.7 in phase 2: the arm on the held fruit's side lifts and its hand hovers over the fruit, claws open then clutching), caught (the first 0.16 s of light: eyes wide) then flinch (head down and tilted, eyes shut, teeth clenched, the bulb-side hand over its face, a puff of shadow). **The light (v1.93, the user's ask: like Limelight):** while the bulb is on (`dk` over 0), `beam` keeps the jar dim (alpha 150 of 255 at full light) outside a warm cone from the bulb aimed at the middle of the jar floor, half width half the jar at the floor, swaying slowly, dithered at its edge, also faint in the air between the bulb and the rim; a cell-resolution ImageData canvas like Limelight's, drawn first in `front`. Phase 2's stutter cuts the beam; beaten, the dim fades out over 1.5 s. Phase 2: swells, a third eye on the brow, red eyes. Beaten: the light holds; it screams and burns from the top down (a dithered edge) into ash and embers, its arms slide off the rim; the moths come to the bulb as before. The eyes between the fruit in the jar (`top`) are kept.
- **Arena:** scenery `-`, weather `moths`, darkness .35.
- **Code:** `fx.js` `B_dark:{` (`tick`, `pal`, `pose`, `bg` the body, `arms`, `front` = `beam`, arms, then `bulb`, `top` the eyes in the jar), `ARENA.B_dark`; `engine.js` `B_dark:{p:` (live state: `done`, `dk`, `pt`, and `hd`: `hx`, `hy`, `hr`); preview card `bdark` (13 s: dark, reach, light, phase 2, light, beaten).

### The Collector
- **Rule:** The jar only clears once you have also made a Pear (7). **Phase 2:** If you have not made it yet, it must now be a Pineapple (8). First depth 3.
- **Scene (v1.94):** a gaunt six-armed curator behind the jar (drawn in `bg`, only what is above the rim shows): a moth-eaten green tailcoat with shoulders hunched up past a short neck, white shirt and red cravat, a narrow grey skull with white tufts, a hooked nose, a needle-toothed grin, one glowing slit eye and one huge eye behind a brass monocle on a chain. Arms (in `front`): two bare bony arms grip the rim with drumming fingers (they slap down on arrival with a small jar shake), a sleeved arm holds up a bell jar on a stand with a brass plaque giving the size (the wanted fruit as a black silhouette, `sil`, cached in `FXSIL`), a bare arm holds an open ledger (lines fill up as it writes, `s.wr`), a bare arm holds a quill, a sleeved arm holds a magnifying glass on brass lazy tongs. Cycle (`s.cy`): peer (the lens in front of its eye: a giant veined eye that blinks and follows the target), reach, inspect (the tongs shoot out over your biggest fruit, the lens draws it magnified ×1.45, a ? or ! over it, the head leans in), back, write (the quill crosses to the ledger and scribbles). Made it: it cackles (head back, jaw chattering), the fruit flies from the pile into the bell jar, sparkles, a rosette on the stand; from then on the lens inspects the prize in the bell jar. Phase 2: it rears up and roars (jar shake), two spidery arms unfold from its back holding specimen pins, red eyes, a cracked monocle, hair on end, more moth holes; if not made yet the silhouette flips to the bigger fruit. Beaten: it throws up all its hands, the monocle pops out and falls, the bell jar shatters, and it dissolves from the head down into a cloud of moths (`cut`).
- **Jar:** lined with tufted burgundy velvet with brass buttons (`back`, cached as `s.vcv`, drawn at 30%).
- **Arena:** scenery `hall`, weather `dust`, darkness .1.
- **Sizing:** fitted to the real game's sky (about 27 boss cells between the HUD and the rim): the face sits at 20 cells, the shoulders at about 10, so the HUD's boss tag line only covers the hair. fxlab's mock sky is taller, so the scene looks low there.
- **Code:** `fx.js` `B_collect:{` (`pose` holds every position, `tick` the cycle, `bg` the body, `front` the arms and props, `back` the velvet; both layers draw through `fxBlobI`), `ARENA.B_collect` (arena); `engine.js` `B_collect:{p:` (live state: `done`, `l`, `got`, `big` {x, y, r, l}, plus `hx`, `hy`, `hr`); preview card `bcollect`.

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

## The user's bar and what comes next

See `CLAUDE.md`, "Animation standard and handover": real poses drawn in code (never a squashed or split sprite), bosses big, evil and moving, free to enter the jar and affect fruit, each with its arena and a jar transformation where it fits. Next: rework the basic bosses one at a time in the order the user picks.

## Ideas the user has raised (not done yet)

- Give the remaining non-humanoid props more presence the way The Rot, The Syrup and The Tide got it in v1.87 to v1.89 (the user's examples of the bar: The Reaper and The Storm). Humanoid characters are fine as they are. Bosses may enter the jar and affect fruit (the user, 27 Nov).
- More movement for the monsters (The Rot leaps across the jar since v1.89). Bosses may shake the jar picture with `A.jsA`/`A.jsT` (engine `fx.jsh`, v1.89): only the drawing moves, never the fruit.
