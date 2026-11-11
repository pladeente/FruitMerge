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
| Common | 15 | ~43 | ~2.9 |
| Uncommon | 21 | ~22 | ~1.0 |
| Rare | 8 | ~7 | ~0.9 |

What this means:
- Any two-common combo is near certain each run. That covers the halves of most fusions (Lucky Clover, Juicer, Honey Pot, Early Bird, Photo Finish, Bullseye, Lodestone, Scratch Card, Piggy Bank are all common).
- Each rare is seen about as often as each uncommon, because the rare pool is so small. Rare means "rare slot", not "rare charm".
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
| **Small fruit** | Pet Caterpillar (eats them), Hoarder (counts them) | Sieve (clears them) | Scrub | **Thin, no payoff for making sizes 1 to 4** |
| **Seeds** | Abacus | | Seed Bag | **Thin, one payoff** |
| **Gold fruit** | Magpie | Midas, Golden Hand | | **Thin, one way to make gold** |
| **Physics and position** | Bullseye, Clean Plate, High Wire | Shake, Whirl, Rumble | | **Thin, and the most "this game" build** |
| Growing ×Mult | none | | | **Missing, deferred (see Priorities)** |

Long-run growers today are all +Mult: Vintage (per jar), Hot Streak (per merge, resets each jar), Melon Fever (per size 8+), Compost (per fruit destroyed), Fat Wallet (coins held), Abacus (seed levels).

## Priorities

1. **Thin builds first, at common and uncommon.** Small fruit, seeds, gold, physics and position. Roughly 8 to 12 charms. Each one should link to an existing build so it is not a dead pick (gold to chance and economy, small fruit to destruction, seeds to economy, position to aim).
2. **Fusions that join the new pieces to old ones,** 2 or 3, once the new charms have been played.
3. **Re-measure** with the bot (see `RSC` notes in `CLAUDE.md`). Target stays at the greedy bot winning about 1 run in 12.
4. **Then higher-powered cards:** one or two rares with ×Mult that grows over the run, so late depths have a goal. Only after 1 to 3, because a bigger pool is what keeps these from turning up every run.

Open question: rares are seen as often as uncommons. Fix by adding rares (step 4) or lowering the rare weight, not both.

## Candidate charms for thin builds (proposed, not built)

None of these is in the game. They are a starting list for the user to pick from, priced against the budget above.

| Build | Name | Rarity | Effect | Links to |
|---|---|---|---|---|
| Small fruit | Small Fry | Common | Merges that make a size 4 fruit or smaller score ×2. | Opposite of Heavyweight, so the two compete for a run |
| Small fruit | Pip Collector | Uncommon | Gains +0.03 Mult every time you make a size 3 fruit or smaller. | Combo, Blender |
| Small fruit | Bite Size | Uncommon | Fruit you drop are never bigger than size 3. +4 points a merge. | Pet Caterpillar, Sieve. Clashes with Rich Soil |
| Seeds | Gardener | Common | +1 level to a random seed every time you beat a boss. | Abacus, slow scaling |
| Seeds | Seed Packet | Common | Seeds in the shop cost 1 coin less. | Economy |
| Seeds | Sprout | Uncommon | The first time you make each size in a jar, its seed counts double. | Rewards spreading levels over many sizes |
| Gold | Gold Leaf | Common | The first fruit you drop in each jar is gold. | Magpie, Midas |
| Gold | Prospector | Uncommon | 1 in 8 fruit you drop is gold. | Chance (Horseshoe doubles it), Magpie |
| Gold | Alchemy | Uncommon | When a gold fruit merges, the fruit it makes is gold too. | Magpie, Golden Touch. Watch: can chain ×2 every merge |
| Position | Wallflower | Common | Merges touching a wall score +12 points. | Aim |
| Position | Low Tide | Uncommon | Merges in the bottom third of the jar score ×2. | Opposite of High Wire |
| Position | Trick Shot | Uncommon | A dropped fruit that hits a wall and then merges scores ×2.5. | Bullseye, aim. Needs wall-contact tracking in the engine |

Pairs that could become fusions later: Small Fry + Pet Caterpillar, Prospector + Magpie, Gardener + Abacus, Low Tide + Clean Plate.

## Things to avoid

- A charm that is a straight upgrade of another (Juicer +1 Mult, then "Big Juicer" +2 Mult at the same rarity).
- Unconditional ×Mult below rare. Flat ×Mult stacks multiplicatively with everything.
- Payoffs with no enabler in the pool, or enablers with no payoff.
- Showing fusion recipes before the player holds both halves (the user removed hints on purpose).
- Permanent power in the profile (pillar 7).
