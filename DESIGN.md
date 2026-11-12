# Rogue design notes

The design view of Rogue mode: which build each item feeds, where the gaps are, and the rules for adding more. Item text and numbers live in `rogue.js` (`CH`, `TL`, `UPG`, seeds) and are not copied here, so this file cannot drift on them. Read this before proposing new items, update it when items land.

## Balance goals

1. **No item is clearly better.** Every charm pays for its power with a condition, a slot, or a clash with another build. If one pick is always right, the choice is gone.
2. **Builds should be earned, not handed out.** RNG is what makes a build hard to assemble. A small pool makes the same strong combo turn up almost every run, which flattens runs into one shape.
3. **Mult grows over the run, from the build.** Targets rise ×180 by depth 8 (`RSC`), so a winning run needs multiplying power, but it should come from combining pieces, not from one card.
4. **Fill thin builds before adding power.** New common and uncommon charms for thin builds do two jobs: they give those builds a real chance, and they dilute the pool so every existing combo turns up less often. Higher-powered cards (scaling ×Mult rares) come after.

## How often things turn up

Shop stock (`RG.stock`): 3 charms per visit, rarity rolled 60% common, 30% uncommon, 10% rare (Good Taste shifts it), then a random charm of that rarity the run does not own. About 24 shops per full run (one after every jar), so roughly 72 charm offers before rerolls, crates and Bigger Shelf.

| Rarity | Charms in pool | Offers per run | Times each one is seen |
|---|---|---|---|
| Common | 20 | ~43 | ~2.2 |
| Uncommon | 27 | ~22 | ~0.8 |
| Rare | 8 | ~7 | ~0.9 |

(Before the thin-build charms: 15 commons seen ~2.9 times each, 21 uncommons ~1.0.)

What this means:
- Any two-common combo was near certain each run, and is still likely. That covers the halves of most fusions (Lucky Clover, Juicer, Honey Pot, Early Bird, Photo Finish, Bullseye, Lodestone, Scratch Card, Piggy Bank are all common).
- Each rare is now seen slightly more often than each uncommon, because the rare pool is so small. Rare means "rare slot", not "rare charm".
- Adding a charm to a rarity lowers how often every other charm of that rarity shows up. That is the main lever for point 2 above, without touching any numbers.

## Power budget by rarity

A guide for new charms, from what is in the pool now:

| Rarity | Typical power | Examples |
|---|---|---|
| Common | +1 Mult, +8 points a merge, ×2 to ×2.5 with a tight condition, or a small utility | Juicer, Honey Pot, Early Bird, Bullseye |
| Uncommon | ×2 to ×2.5 with a loose condition, or +Mult that grows slowly | Heavyweight, Hot Streak, Vintage, Clean Plate |
| Rare | ×3 with a condition, ×5 now and then, or a rule change | High Wire, Sweet Spot, Rich Soil, Melon Fever |
| Fusion | about both halves together plus a bit | Smoothie, Marathon, Wildfire |

## Builds and what feeds them

Every charm, tool and upgrade sits in one or more builds. A build is thin when it has fewer than four pieces, or no payoff (something that scores because the build is happening).

| Build | Charms | Tools | Upgrades | State |
|---|---|---|---|---|
| Flat Mult and points | Juicer, Honey Pot, Blue Ribbon, Full House, Smoothie | | Hot Sauce, Fertiliser | Fine, the default |
| Chance | Lucky Clover, Snake Eyes, Scratch Card, Horseshoe, Four-Leaf Clover, The Mint | | | Fine |
| Combo | Chain Reaction, Hot Streak, Metronome, Wildfire | Blender, Cyclone | Tambourine | Fine |
| Timing in the jar | Early Bird, Photo Finish, Marathon | Free Sample, Double Down | Watering Can, Big Basket | Fine |
| Big fruit | Heavyweight, Melon Fever, Golden Touch, Rich Soil, Melon Mania | Ripen | | Fine |
| Economy | Piggy Bank, Savings Account, Fat Wallet, Coupon, Golden Touch, Scratch Card, Golden Goose, The Mint | Cash Out | Vault, Packed Lunch, Haggler | Plenty |
| Tools | Juggler, Spark Plug, Showman, Overdrive, Crowd Pleaser, Encore, Battery, Dynamo, Headliner | all, Sleight of Hand | Tool Belt, Whetstone | Plenty |
| Destruction | Fireworks, Pet Caterpillar, Compost, Ashes, Volcano, Safety Net | Cherry Bomb, Sieve | Scrub | Fine |
| Aim | Bullseye, Lodestone, Sharpshooter | Lodestar, Swap, Rewind, Twin | | Fine |
| Full jar | Hoarder, High Wire | Anchor | Slow Fuse | Thin |
| Small fruit | Small Fry, Pip Collector, Bite Size, Pet Caterpillar, Hoarder | Sieve | Scrub | Filled, needs play |
| Seeds | Abacus, Gardener, Seed Packet, Sprout | | Seed Bag | Filled, needs play |
| Gold fruit | Magpie, Gold Leaf, Prospector, Alchemy | Midas, Golden Hand | | Filled, needs play |
| Physics and position | Bullseye, Clean Plate, High Wire, Wallflower, Low Tide | Shake, Whirl, Rumble | | Better, still the most room to grow |
| Growing ×Mult | none | | | **Missing, deferred (see Priorities)** |

Long-run growers today are all +Mult: Vintage (per jar), Hot Streak (per merge, resets each jar), Melon Fever (per size 8+), Compost (per fruit destroyed), Fat Wallet (coins held), Abacus (seed levels).

## Priorities

1. **Thin builds first, at common and uncommon.** Done: 11 charms (see below). Small fruit, seeds, gold, physics and position. Each one should link to an existing build so it is not a dead pick (gold to chance and economy, small fruit to destruction, seeds to economy, position to aim).
2. **Fusions that join the new pieces to old ones.** Done: 6 built (see below).
3. **Re-measure** with the bot (see `RSC` notes in `CLAUDE.md`). Target stays at the greedy bot winning about 1 run in 12.
4. **Then higher-powered cards:** one or two rares with ×Mult that grows over the run, so late depths have a goal. Only after 1 to 3, because a bigger pool is what keeps these from turning up every run. Done: Snowball and Old Oak (see Balance measurement).

Open question: rares are seen as often as uncommons. Fix by adding rares (step 4) or lowering the rare weight, not both.

## Thin-build charms (built)

All in `CH` except Trick Shot. Numbers changed from the first proposal where noted.

| Build | Name | Rarity | Effect | Links to |
|---|---|---|---|---|
| Small fruit | Small Fry | Common | Merges that make a size 4 fruit or smaller score ×2. | Opposite of Heavyweight, so the two compete for a run |
| Small fruit | Pip Collector | Uncommon | Gains +0.03 Mult every time you make a size 3 fruit or smaller. | Combo, Blender |
| Small fruit | Bite Size | Uncommon | Fruit you drop are never bigger than size 3. +4 points a merge. | Pet Caterpillar, Sieve. Clashes with Rich Soil |
| Seeds | Gardener | Common | +1 level to a random seed every time you beat a boss, mini bosses included (about 9 levels a run). | Abacus, slow scaling |
| Seeds | Seed Packet | Common | Seeds in the shop cost 1 coin less. | Economy |
| Seeds | Sprout | Uncommon | The first time you make each size in a jar, its seed counts double. | Rewards spreading levels over many sizes |
| Gold | Gold Leaf | Common | The first fruit you drop in each jar is gold. | Magpie, Midas |
| Gold | Prospector | Uncommon | 1 in 10 fruit you drop are gold (was 1 in 8: each gold fruit pays 2 coins, so 1 in 8 out-earned Scratch Card by a lot). | Chance (Horseshoe doubles it), Magpie |
| Gold | Alchemy | Uncommon | 1 in 3 times a gold fruit merges, the fruit it makes is gold too (was always: a gold fruit would then pay ×2 and 2 coins at every size up to a melon). | Magpie, chance. With Horseshoe it is 2 in 3, watch it |
| Position | Wallflower | Common | Merges touching a wall score +20 points (was +12: only some merges touch a wall, and Honey Pot gives +8 to all). | Aim |
| Position | Low Tide | Uncommon | Merges in the bottom third of the jar score ×2. | Opposite of High Wire |
| Position | Trick Shot | Uncommon | Not built. A fruit dropped at the edge slides down the wall, so "hits a wall" is free and it would just be "drop at the edge ×2.5". Needs a real bank-shot test first. | Bullseye, aim |

Gardener's level fires the `grow` event, which also counts for Green Fingers. Not re-measured with the bot yet: that waits for the fusions (step 3).

## Fusions for the thin-build charms (built)

Rules followed: a fusion is about both halves together plus a bit (budget table above). Every half used here is not in any existing recipe, so no charm is pulled two ways. Recipes stay hidden until the player holds both halves.

| Fusion | Recipe | Effect | Halves were | Note |
|---|---|---|---|---|
| Feeding Frenzy | Small Fry + Pet Caterpillar | Merges that make a size 4 fruit or smaller score ×3. Every 4 drops a caterpillar eats a small fruit (size 3 or less) for 60 points. | ×2, every 5 drops for 30 | Small fruit payoff |
| Snack Pack | Bite Size + Hoarder | Fruit you drop are never bigger than size 3. +0.25 Mult for every fruit in the jar. Every merge scores +6 points. | cap 3 and +4, +0.15 per fruit | Rewards a full jar of small fruit, risky near the line |
| Fine Mesh (tool) | Sieve + Pip Collector | Clears every size 1 and size 2 fruit out of the jar. Gains +0.05 Mult for each one cleared. | clears size 1, +0.03 per small fruit made | Keeps Pip's grown value. Feeds Compost and Ashes too |
| Greenhouse | Gardener + Abacus | Every boss you beat (mini bosses too) gives 2 random seed levels. +0.75 Mult for every seed level you hold. | 1 level, +0.5 per level | Seed payoff, slow start, strong late |
| Seed Vault | Sprout + Seed Packet | Seeds cost 2 coins less. The first time you make each fruit size in a jar, its seed counts triple. | double, 1 coin less | Rewards spreading levels across sizes |
| Bloom (tool) | Ripen + Sprout | Tap a fruit. It grows one size. The first use in each jar also gives the seed for its new size 1 level. | grow one size | Capped to once a jar, or Ripen would mint ~40 levels a run |
| Treasure Hunter | Prospector + Magpie | 1 in 6 fruit you drop are gold. +1.5 Mult for every gold fruit in the jar. | 1 in 10, +1 per gold | Gold payoff. Horseshoe makes it 1 in 3 |
| Philosopher's Stone | Gold Leaf + Alchemy | The first 2 fruit you drop in each jar are gold. 1 in 2 times a gold fruit merges, the fruit it makes is gold too. | first fruit, 1 in 3 | Watch: with Horseshoe the chain never breaks (×2 and 2 coins at every size). Option: say it ignores Horseshoe |
| Still Water | Low Tide + Clean Plate | Merges in the bottom third of the jar score ×2.5. ×2 more while the jar holds 8 fruit or fewer. | ×2 low, ×2 at 6 or fewer | Keep-it-low build, opposite of High Wire |
| Climbing Ivy | Wallflower + High Wire | Merges touching a wall score +30 points and ×1.5. ×3 Mult while the pile reaches the gold line. | +20 at the wall, ×3 at the line | Play-near-the-top build, opposite of Still Water |
| Keepsake | Pip Collector + Vintage | Gains +0.05 Mult every time you make a size 3 fruit or smaller, and +0.6 every time you clear a jar. | +0.03, +0.4 | Pure grower, keeps both halves' value. Competes with Fine Mesh for Pip |
| (after testing) | Slingshot + Trick Shot | Throws go further, bank shots score ×4 and refund 1 drop. | throw, ×3 | Only once the throwing feel is settled |

All built except the throwing fusion. Changes from the table: Fine Mesh scores 15 points per fruit cleared instead of growing Mult (a tool has nowhere to keep a grown value), Philosopher's Stone's 1 in 2 ignores Horseshoe. Snack Pack, Seed Vault and Philosopher's Stone are locked behind awards, with Big Appetite, Butterfly Garden and Menagerie.

Chain Reaction retuned: +0.5 Mult per combo step up to +4 (was +1 up to +8), Wildfire +1 up to +8 (was +2 up to +16). Solo it measured ×2.9 a jar, a common scoring like a rare. Now ×1.9, level with Juicer (×2.0).

## Pets (built)

Creatures that live in the jar and act every few drops, plus charms that pay off for them. Pet combos only turn up once a pet that fits is held (`req` lists in `rogue.js`: `CAT` caterpillar, `EAT` pets that eat), so they are never dead picks and do not dilute runs without pets.

| Name | Rarity | Effect |
|---|---|---|
| Pet Caterpillar | Uncommon, 6 | Every 5 drops eats a small fruit (size 3 or less) for 45 points (was 30) |
| Busy Bee | Uncommon, 6 | Every 4 drops pollinates a fruit (up to 3). Pollinated fruit score ×3 when they merge |
| Mole | Uncommon, 6 | Every 6 drops eats a fruit on the floor (size 4 or less) for 40 points, from below |
| Hedgehog | Uncommon, 6 | When the pile reaches the gold line, climbs up and eats the highest fruit (size 6 or less) for 50, at most every 3 drops. Was: rolled across the floor every 6 drops with a ×2 window, which players found disruptive and badly timed |
| Ladybird | Common, 4 | Rides one fruit. Its merges score ×2 and she moves to the new fruit |
| Pet Bowl | Common, 4 (eaters) | +0.3 Mult per fruit pets ate this jar |
| Pet Treats | Common, 4 (eaters) | Every fruit pets eat scores 30 more points |
| Chrysalis | Uncommon, 6 (caterpillar) | Every 4th caterpillar meal: butterfly, +0.5 Mult for the run |
| Big Appetite | Uncommon, 6 (eaters) | Pets eat up to size 5. Size 4 and 5 meals score ×3 |
| Whistle (tool) | 5, charge 6 (caterpillar) | Tap a fruit (size 3 or less), the caterpillar comes now and eats it |
| Butterfly Garden | Chrysalis + Busy Bee | Butterfly every 3rd meal. Bee every 3 drops, pollen ×4 |
| Menagerie | Pet Bowl + Mole | +0.5 Mult per meal this jar. Mole every 5 drops for 60 |
| Feeding Frenzy | Small Fry + Pet Caterpillar | Small merges ×3, caterpillar every 4 drops for 90 (was 60) |

Changes made while measuring:
- **Caterpillar fix.** It ate 0.6 fruit a jar, not the ~5 the first draft assumed: it walked slowly, the player merged its target on the way, and a visit with no target at that moment was lost. Now a pet caterpillar walks and eats faster, waits for a target, and a call while it is out is queued. It eats about 2 a jar, which is the real ceiling, since it needs small fruit that sit still. The same queueing applies to the bee and the mole.
- **Pet Treats** was "pets come 1 drop sooner". Measured: no gain at all, because pets are limited by targets, not by how often they are called. Now +30 points per meal.
- Caterpillar 30 → 45, Feeding Frenzy 60 → 90, Bee ×2 → ×3, Butterfly Garden ×2.5 → ×4, Ladybird ×1.5 → ×2. The bot never aims at pollinated fruit or the ladybird, so these two read low in the numbers below and a player who aims gets more.

The new Hedgehog cannot be measured with the bot: the bot ends 119 of 120 runs out of drops and almost never overflows, so a pet that guards against overflow shows no gain for it (runs started with it: average depth 3.4, against 3.7 with nothing, the cost of the slot). Judge it by play.

Watch: screen clutter with several pets (timers are spread out), Volcano/Compost/Ashes with eaters, and the Glutton boss (its caterpillar and a pet one take turns, the boss one keeps its old speed).

## Balance measurement (bot)

A Playwright bot, kept out of the repo. Aim: drop on the highest uncovered fruit of the same size, else the lowest spot. It scores ~190 a 24-drop jar with no items (the original bot ~230, so it aims a little worse). Greedy runs: buy the first affordable charm, take the first crate pick, use no tools.

Full greedy runs, 400 each:

| Pool | Wins | Usual death |
|---|---|---|
| Before this session's charms (thin builds, throwing, pets and their fusions removed) | 0 / 400 | depth 3 to 4 |
| Current pool, before the pet retune | 2 / 400 | depth 3 to 4 |
| Current pool, final (pets retuned) | 2 / 400 | depth 3 to 4 |
| Current pool, Chain Reaction nerfed, 5 more fusions | 1 / 400 | depth 3 to 4 |

The win rate is lower than the documented 1 in 12 because this bot aims worse, but the two pools match, so the new items did not make runs easier for a player who picks without thinking.

One jar at depth 7 with a fixed loadout, no tools, average of 25 to 40 jars. ×N is against no charms (~185):

| Single charm | ×N | | Single charm | ×N |
|---|---|---|---|---|
| Chain Reaction | 2.9 | | Pet Caterpillar | 1.45 |
| Hot Streak | 2.4 | | Mole | 1.6 |
| Juicer | 2.0 | | Hedgehog | 1.9 |
| Low Tide | 2.0 | | Busy Bee | 1.2 (aim-dependent) |
| Honey Pot | 1.75 | | Ladybird | 1.2 (aim-dependent) |
| Wallflower | 1.65 | | Pet Bowl, Treats, Appetite | ×1.25 to ×1.35 on top of a pet |

| 4-charm build | Jar score |
|---|---|
| Combo (Chain, Hot Streak, Metronome, Juicer) | ~1780 |
| Generic (Juicer, Honey, Hot Streak, Heavyweight) | ~1620 |
| Position (Clean Plate, Low Tide, Wallflower, Heavyweight) | ~1190 |
| Pets (Caterpillar, Mole, Bowl, Treats) | ~670 |
| Pets (Caterpillar, Bee, Hedgehog, Ladybird) | ~615 |
| Small fruit (Small Fry, Pip, Bite, Hoarder) | ~780 |
| Chance (Lucky, Snake Eyes, Horseshoe, Scratch) | ~760 |
| Gold (Gold Leaf, Prospector, Alchemy, Magpie) | ~400 (aim-dependent) |

Runs started with one charm, then greedy buying, 200 runs each (average depth reached, 9 = won):

| Starting charm | Avg depth | Wins |
|---|---|---|
| None | 3.69 | 1 |
| Old Oak (new rare) | 3.93 | 1 |
| Sweet Spot (rare) | 3.98 | 2 |
| Snowball (new rare) | 4.24 | 5 |
| Juicer | 4.33 | 1 |
| Melon Fever (rare) | 4.36 | 1 |
| Hot Streak | 4.58 | 0 |
| Blue Ribbon (rare) | 5.08 | 10 |

The two new rares sit with the existing ones. Blue Ribbon (×0.3 Mult per charm owned) was the strongest charm by this measure, so it now gives ×0.2 per charm: 400 runs, average depth 4.68, 2% wins. Still the best rare, no longer far ahead.

Pets land with small fruit and chance: real builds, not the strongest. Their extra value (clearing fruit, so fewer overflows) does not show in a single-jar score. Chain Reaction is a common that scores like a rare: worth a look on its own.

## Charm feedback

Every charm has its own trigger animation (`ANIM` in `index.html`): a move on its header icon (spin, slam, jiggle, swing...) and pixel particles of its own colour thrown from the slot. Charms tied to a spot also play an effect in the jar where the merge happened (`jfx` in `makeGame`): rings for Bullseye and Sweet Spot, clover bursts, petals off the wall for Wallflower, a flat ripple for Low Tide, dust and a shake for Heavyweight, bubbles for Small Fry, leaves for Sprout. Charms that add to every merge (Juicer, Hot Streak, Magpie, Pip Collector...) get a soft move and few particles, and nothing in the jar, so the screen does not fill up. Any new charm needs an `ANIM` entry, and a `jfx` effect if it is tied to a spot.

## Prototypes

Slingshot (throw fruit by flicking) and Trick Shot (a thrown fruit that banks off a wall into its match scores ×3) are in the shop and crates as uncommons for testing. Trick Shot has `req:'sling'`, so it only turns up once Slingshot is held and is never a dead pick. Questions to settle by playing: does an accidental flick happen too often (threshold 300·K px/s), is the throw too strong (first playtest: yes, halved to ×0.35 of the flick, cap 450·K), is ×3 right for a bank shot. If they ship: Slingshot uncommon, Trick Shot uncommon, both in a new Throwing build, and re-measure balance, since throwing makes merges easier.

## Things to avoid

- A charm that is a straight upgrade of another (Juicer +1 Mult, then "Big Juicer" +2 Mult at the same rarity).
- Unconditional ×Mult below rare. Flat ×Mult stacks multiplicatively with everything.
- Payoffs with no enabler in the pool, or enablers with no payoff.
- Showing fusion recipes before the player holds both halves (the user removed hints on purpose).
- Permanent power in the profile (pillar 7).
