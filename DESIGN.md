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
4. **Then higher-powered cards:** one or two rares with ×Mult that grows over the run, so late depths have a goal. Only after 1 to 3, because a bigger pool is what keeps these from turning up every run.

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

## Fusions for the thin-build charms

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

Built: Feeding Frenzy, Greenhouse, Treasure Hunter, Still Water, Climbing Ivy and Bloom (tool), as in the table. Still drafts: Snack Pack, Fine Mesh, Seed Vault, Philosopher's Stone, Keepsake, and the throwing fusion. Next: re-measure with the bot.

## Pets (proposed, not built)

A Pets build: creatures that live in the jar and act every few drops, plus charms that pay off for them. Today it is one charm (Pet Caterpillar) and one fusion (Feeding Frenzy), with Compost and Ashes as side payoffs, since every meal destroys a fruit.

**Yardstick.** Pet Caterpillar is about 5 meals a jar × 30 points = ~150 base points, plus it clears small fruit. That is close to Honey Pot (+8 on ~18 merges = ~145). New pets aim for the same ~150, each with a different job in the jar, so two pets are a build and not a stack of the same thing.

**Pet combos only show up once you hold a pet** (`req` widened to "any pet"). That keeps them from being dead picks, and it means committing to pets pulls the support into the shop, while a run without pets never sees them, so they do not dilute anything else.

### New pets

| Name | Rarity, price | Effect | Job in the jar | Why it is balanced |
|---|---|---|---|---|
| Busy Bee | Uncommon, 6 | Every 4 drops a bee lands on a fruit and pollinates it. A pollinated fruit scores ×2 when it merges. Up to 3 at a time. | Marks targets, rewards aiming at them | ~4 marked merges a jar. ×2 on a merge of ~20 base is ~+80, plus aim skill. Below the yardstick on its own, strong with Ladybird and big Mult |
| Mole | Uncommon, 6 | Every 6 drops a mole pops up under a fruit on the floor (size 4 or less) and eats it for 40 points. | Clears from the bottom, the pile drops and settles into new merges | 4 meals × 40 = 160. The pile shift is the real value, and it can also wreck a set-up |
| Hedgehog | Uncommon, 6 | Every 6 drops a hedgehog rolls across the floor, bumping fruit. Merges in the next 2 seconds score ×2. | A small timed Shake on the bottom row, with a scoring window | 4 windows a jar, 1 to 2 merges each. Pairs with Metronome and combo charms |
| Ladybird | Common, 4 | A ladybird rides one fruit. When that fruit merges, the merge scores ×1.5 and she hops onto the new fruit. | One lucky fruit you grow on purpose | ×1.5 on ~4 merges of a growing fruit. Common budget. Big-fruit link |

### Pet combos (need a pet)

| Name | Rarity, price | Effect | Why it is balanced |
|---|---|---|---|
| Pet Bowl | Common, 4 | +0.3 Mult for every meal your pets have eaten this jar. | Hot Streak for pets: ~5 meals, so about +0.75 Mult on average over a jar. Resets each jar |
| Pet Treats | Common, 4 | Every pet acts 1 drop sooner (caterpillar every 4, mole every 5, bee every 3, hedgehog every 5). | ~+25% pet output. With Feeding Frenzy: every 3 drops |
| Chrysalis | Uncommon, 6 | Every 4th meal your caterpillar eats, it turns into a butterfly: +0.5 Mult for the rest of the run. | Grows ~+0.5 a jar, like Vintage (+0.4), but needs a caterpillar. Brings Wild's butterfly into Rogue |
| Big Appetite | Uncommon, 6 | Pets can eat fruit up to size 5. Meals of a size 4 or 5 fruit score 3 times as much. | Risk for reward (pillar 5): pets may eat the fruit you were building |
| Whistle (tool) | 5, charge 6 | Your caterpillar comes out now and eats the fruit you tap (size 3 or less). | Active pet play (pillar 8). Offered only with a caterpillar |

### Pet fusions

| Name | Recipe | Effect |
|---|---|---|
| Butterfly Garden | Chrysalis + Busy Bee | Every 3rd caterpillar meal makes a butterfly: +0.5 Mult for the run. Every 3 drops a bee pollinates a fruit, and pollinated fruit score ×2.5. |
| Menagerie | Pet Bowl + Mole | +0.5 Mult for every meal this jar. The mole comes every 5 drops and meals score 60. |

### Watch

- Screen clutter with 3 or 4 creatures at once. Each gets its own timer, so they rarely act on the same drop. Cap at one creature on screen if it gets busy.
- Mole, Big Appetite and Feeding Frenzy all destroy fruit, so Compost and Ashes get stronger. Fine, that is the build, but check Volcano + pets.
- Pets act on boss jars too. The Glutton already uses the caterpillar, so a pet caterpillar and the boss one take turns.

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
