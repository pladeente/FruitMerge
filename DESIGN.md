# Rogue design notes

The design view of Rogue mode: which build each item feeds, where the gaps are, and the rules for adding more. Item text and numbers live in `rogue.js` (`CH`, `TL`, `UPG`, seeds) and are not copied here, so this file cannot drift on them. Read this before proposing new items, update it when items land.

## Balance goals

1. **No item is clearly better.** Every charm pays for its power with a condition, a slot, or a clash with another build. If one pick is always right, the choice is gone.
2. **Builds should be earned, not handed out.** RNG is what makes a build hard to assemble. A small pool makes the same strong combo turn up almost every run, which flattens runs into one shape.
3. **Mult grows over the run, from the build.** Targets rise ×180 by depth 8 (`RSC`), so a winning run needs multiplying power, but it should come from combining pieces, not from one card.
4. **Fill thin builds before adding power.** New common and uncommon charms for thin builds do two jobs: they give those builds a real chance, and they dilute the pool so every existing combo turns up less often. Higher-powered cards (scaling ×Mult rares) come after.

## How often things turn up

Since v1.24 boss crates give fewer rares, on the user's call that a rare in a crate pushes the run towards one build: gold crates 45/45/10 (was 30/55/15), melon crates 0/70/30 (was 0/30/70, which often offered two rares at once). Measured the same way as below: rares offered from crates went from 2.9 a run to 1.5, total from about 5.7 to 4.4. Since v1.29 that is done: melon crates are 0/65/30/5, the 5 being Legendary.

Since v1.20 rares are rarer, on the user's call that a rare did not feel rare: shop rolls 70% common, 26% uncommon, 4% rare (Good Taste: 7% at one level, 10% at two since v1.30.3, halved on the user's call from 10% and 16%, which offered about 11 rares a run from the shop), wooden crates 70/26/4, gold crates 30/55/15 (was 20/50/30), melon crates unchanged. Measured with the real stock and crate code over 400 runs (24 shops, 8 boss crates, no rerolls or wooden crates): rares offered per run went from 11.1 (shop 7.2, crates 3.8) to 5.7 (shop 2.8, crates 2.9), so each of the 10 rares now turns up about once every two runs. A rare on offer shines (`.tile.r2::after`) and plays `snd('rare')` once (`rareCue`). The greedy bot was not re-run: its numbers below show several rares score about like no charm, so the win rate barely depends on them. Weak rares (Sweet Spot, Old Oak, Melon Fever) are the next thing to look at if rares should also feel stronger.

Before v1.20: shop stock (`RG.stock`): 3 charms per visit, rarity rolled 60% common, 30% uncommon, 10% rare (Good Taste shifts it), then a random charm of that rarity the run does not own. About 24 shops per full run (one after every jar), so roughly 72 charm offers before rerolls, crates and Bigger Shelf.

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
| Legendary | breaks one rule of the game outright, or an unconditional × that grows every jar. About two rares | Phoenix, Stowaway, Heirloom |

## Builds and what feeds them

Every charm, tool and upgrade sits in one or more builds. A build is thin when it has fewer than four pieces, or no payoff (something that scores because the build is happening).

| Build | Charms | Tools | Upgrades | State |
|---|---|---|---|---|
| Flat Mult and points | Juicer, Honey Pot, Blue Ribbon, Full House, Smoothie | | Hot Sauce, Fertiliser | Fine, the default |
| Chance | Lucky Clover, Snake Eyes, Scratch Card, Horseshoe, Four-Leaf Clover, The Mint, Rabbit's Foot | | | Fine |
| Combo | Chain Reaction, Hot Streak, Metronome, Wildfire, Crescendo | Blender, Cyclone | Tambourine | Fine |
| Timing in the jar | Early Bird, Photo Finish, Marathon | Free Sample, Double Down | Watering Can, Big Basket | Fine |
| Big fruit | Heavyweight, Melon Fever, Golden Touch, Rich Soil, Melon Mania | Ripen | Trellis | Fine |
| Economy | Piggy Bank, Savings Account, Fat Wallet, Coupon, Golden Touch, Scratch Card, Golden Goose, The Mint, Big Spender | Cash Out | Vault, Packed Lunch, Haggler, Ledger, Overtime, Signing Bonus, Back Road, Crate Key | Plenty |
| Tools | Juggler, Spark Plug, Showman, Overdrive, Crowd Pleaser, Encore, Battery, Dynamo, Headliner, Stage Fright (rewards not using them) | all, Sleight of Hand | Tool Belt, Whetstone | Plenty |
| Destruction | Fireworks, Pet Caterpillar, Compost, Ashes, Volcano, Safety Net, Bonfire | Cherry Bomb, Sieve, Harvest | Scrub | Fine |
| Aim | Bullseye, Lodestone, Sharpshooter | Lodestar, Swap, Rewind, Twin, Shears | | Fine |
| Full jar | Hoarder, High Wire, Brinkmanship | Anchor, Harvest | Slow Fuse, Raised Rim, Spring Clean | Filled in v1.40, needs play (the bot never plays at the line) |
| Small fruit | Small Fry, Pip Collector, Bite Size, Pet Caterpillar, Hoarder, Crumbs | Sieve | Scrub | Filled, measured (v1.26, see Small fruit measurement) |
| Seeds | Abacus, Gardener, Seed Packet, Sprout, Polyculture, Family Tree | | Seed Bag | Seeds cut back in v1.23, see Seeds measurement. Needs play |
| Gold fruit | Magpie, Gold Leaf, Prospector, Alchemy, Hallmark | Midas, Golden Hand | Gold Scales | Filled, needs play |
| Physics and position | Bullseye, Clean Plate, High Wire, Wallflower, Low Tide | Shake, Whirl, Rumble, Lead Weight | | Better, still the most room to grow |
| Families (v1.34) | Zest, Berry Picker, Cherry Pit, Cider Press, Medley, Tiki Bar, Marmalade, Jam, Cider Mill, Family Tree | | Raised Bed | New. Orchard items shape the queue, these score it |
| Growing ×Mult | none | | | **Missing, deferred (see Priorities)** |

Upgrades added in v1.31 (10, on the user's call that the shelf showed the same few: five upgrades never leave the pool and nine had a cap of 1 or 2, so a late shop was mostly Fertiliser, Hot Sauce, Watering Can, Scrub and Bribe). Each was checked against every charm, tool, skip reward and award name first: Pip Jar, Gold Pan, Seed Tray, Pet Food and Seed Mix were dropped as copies of Crumbs, Gold Leaf, Seed Packet, Pet Treats and the Seeds shelf. Thick Skin (bosses) sits in no build. See Upgrades measurement below. The shop shows 2 upgrades since v1.30.3 (3 with Catalogue), and Good Taste is the first Uncommon upgrade (weight 0.4 on the shelf).

### Upgrades measurement (14 Nov, v1.31.1)

A quick bot through the real engine and rules: aims each fruit at an open match, else the lowest spot, buys any charm with a score hook, the cheapest seed for sizes 3 to 7, Hot Sauce, Fertiliser and Charm Pouch, uses no tools, signs no contracts, never skips. It wins 48 runs in 800 and clears 15.7 jars a run, in line with the earlier greedy bots. Upgrades were handed over at the start of the run.

| Start with | Runs | Jars cleared | Notes |
|---|---|---|---|
| Nothing | 800 | 15.66 ± 0.16 | 9 runs ended by overflow, the rest ran out of drops |
| 3 Fertiliser | 400 | 16.60 ± 0.21 | the reference |
| 3 Trellis at +15 | 400 | 15.76 ± 0.25 | no measurable gain: 0.5 merges a jar make size 7+, against 9.8 merges in all |
| Overtime + Ledger (per 4) | 400 | 16.33 ± 0.23 | about 10 coins a run |
| Raised Rim | 400 | 15.98 ± 0.24 | within noise, 0 overflow endings |
| 2 Thick Skin | 400 | 15.44 ± 0.25 | within noise |

Coins a run, counted from the baseline runs: Overtime 5.6 (a jar leaves 16 or more drops 28% of the time), Ledger at 1 per 4 coins 4.5, at 1 per 3 coins 8.9 (the bot holds 9 coins on average and is paid 17.5 interest a run). Packed Lunch pays 15.7 for 5 coins. Of 375 failed boss jars, 334 had reached half the target, 36 ended below 60% and 66 below 70%, so Thick Skin could only have helped in about 1 in 6.

Changes made: Trellis +30 (was +15), Ledger 1 per 3 coins and 5 coins (was per 4, 6 coins), Overtime 3 coins (was 4), Back Road pays 3 (was 2), Thick Skin 4 coins (was 5). Not measured: Spring Clean (this bot almost never overflows; watch it with Compost, each fruit cleared is +0.05 Mult and an instant upgrade's price never rises), Signing Bonus (9.3 jars a run offer a contract), Crate Key, Gold Scales (0.03 gold merges a jar without gold items). The retuned numbers were not re-run.

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
| Small fruit | Crumbs (v1.26) | Uncommon | Every merge that makes a size 4 fruit or smaller adds +2 points to every merge for the rest of the jar. | The points side the build lacked: Small Fry and Hoarder multiply it, Bite Size feeds it |
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
| Nectar | Busy Bee + Pet Treats | Bee as Busy Bee. Pets eat pollinated fruit first and a pollinated meal scores ×3 (its pollen). +30 per meal. Without it, pets leave pollinated fruit alone (v1.26: they used to eat it and waste the pollen) |
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

## Small fruit measurement (13 Nov, v1.26)

Question asked: do small fruit builds work. Bot as in the Seeds measurement (aims at the highest uncovered match, no tools), three jars of a depth in a row with the pile carried, quota and drops lifted so every jar plays 24 drops, 20 to 30 runs per loadout. Growers set to a fair value for the depth: at depth 2 Pip +0.4, Keepsake +0.8; at depth 7 Pip +3, Keepsake +9 (Pip gains about +0.2 a jar, so about 7 small fruit made a jar).

Single charms at depth 2 (no charms ~250 a jar): Juicer ×2.0, Hot Streak ×2.7, Hoarder ×2.4, Heavyweight ×1.7, Pip ×1.8, Pet Caterpillar ×1.45, **Small Fry ×1.34, Bite Size ×1.23**. Small Fry and Bite Size were the weak pieces: a merge that makes size 2 to 4 is worth 3 to 10 points against 21 to 66 for big fruit, so ×2 on small merges multiplies very little, and nothing in the build raised the points of small merges.

| Loadout | Depth 2 | Depth 7 |
|---|---|---|
| Generic (Juicer, Honey, Hot Streak, Heavyweight, Chain) | ~3,040 | ~2,940 |
| Big fruit (Heavyweight, Melon Mania, Juicer, Honey, Hot Streak) | ~5,830 | ~5,670 |
| Small, raw (Small Fry, Pip, Bite Size, Hoarder, Caterpillar) | ~1,540 | ~2,990 |
| Small, raw with Crumbs in place of the Caterpillar | | ~5,850 |
| Small with fusions (Feeding Frenzy, Snack Pack, Keepsake, Hot Streak, Juicer) | ~6,240 | ~14,040 |
| The same with Crumbs in place of Hot Streak | | ~21,150 |

Four-charm comparison at depth 2: Small Fry, Bite Size, Hoarder plus Juicer ~1,520; plus Crumbs instead ~2,330; generic four ~2,290.

Conclusion: the build was weak early (half the generic score at depth 2) and only caught up once Pip had grown, which is what players felt. Crumbs fixes the early game and keeps raw small fruit level with the big fruit build late. With its fusions and a grown Keepsake the build is the strongest measured, but that needs two uncommon + uncommon fusions (both halves offered in only ~28% of runs). Keepsake's +0.6 per jar cleared is the biggest single source late: watch it. No overflow deaths in these runs (the bot's 24-drop jars rarely fill the jar).

## Seeds measurement (13 Nov, fixed in v1.23)

Question asked: is one build far ahead and easy to get. Answer: seeds. Earlier bots never bought a seed, so `RSC` was tuned without them.

Bot as above (no tools, no rerolls), rebuilt, Ripeness 1, Classic Jar, everything unlocked. It scores ~250 a jar with no items, measured over a whole depth (3 jars, pile carried), so ×N here is not comparable with the single-jar tables above.

Full runs, 200 per buying policy (9 = won):

| Policy | Wins | Avg depth |
|---|---|---|
| Any charm, no seeds | 0 | 3.16 |
| Only ×Mult charms, no seeds | 1 | 3.42 |
| Any charm + Hot Sauce, Fertiliser, Watering Can | 3 | 3.83 |
| Seeds only, no charms bought | 0 | 4.34 |
| Any charm + seeds for sizes 4 to 7 | 3 | 5.11 |
| Any charm + every seed offered | 4 | 5.44 |
| Any charm + every seed + those upgrades | 9 | 5.80 |
| Only ×Mult charms + seeds for sizes 4 to 7 | 25 | 6.27 |

A run that buys no charms gets deeper than one that buys only charms. Rows with 0 to 4 wins are within noise of each other, the 25 is not.

Fixed loadouts, score per jar against no items:

| Loadout | Coins | Slots | ×N |
|---|---|---|---|
| Juicer | 5 | 1 | 1.9 |
| Fertiliser ×5 | 35 | 0 | 1.8 |
| Hot Sauce ×5 | 40 | 0 | 2.2 |
| Seed level 3 on Apple (6) | 12 | 0 | 2.4 |
| Seeds level 2 on Orange, Apple, Pear | 21 | 0 | 3.4 |
| Seeds level 4 on the same three | 54 | 0 | 7.5 |
| Seeds level 6 on the same three | 99 | 0 | 13.6 |
| Juicer, Honey Pot, Hot Streak, Heavyweight | 23 | 4 | 9.1 |
| Those four + Blue Ribbon | 32 | 5 | 18 |
| Those four + the level 4 seeds | 77 | 4 | 31 |
| Heavyweight, Early Bird, Photo Finish, Lucky Clover, Snake Eyes | 22 | 5 | 6.0 |
| Those five + the level 4 seeds | 76 | 5 | 47 |
| Marathon, Heavyweight, Lucky Clover, Snake Eyes + the level 4 seeds | | 4 | 72 |
| Abacus + the level 4 seeds | 62 | 1 | 24 |

Why seeds lead:
- Each level adds points and Mult to the same merge, so a size's value grows with the level squared while its price rises 1 coin a level.
- The Mult they add is multiplied by every ×Mult charm, and many ×Mult charms are common.
- No slot, no unlock, two offered in every shop, so RNG never denies the build (goal 2 above).

Fusions against their two halves held together:

| Fusion | Alone | Halves together | Ratio |
|---|---|---|---|
| Smoothie | 7.7 | 3.3 | 2.35 |
| Wildfire | 6.0 | 3.6 | 1.66 |
| Marathon | 2.35 | 1.53 | 1.53 |

Smoothie + Marathon in two slots: ×19, more than any five-charm loadout measured without seeds. Both halves offered (real stock code, 3000 runs, no rerolls) by shop 6 / 9 / 15 / 24: two commons (Smoothie, Marathon, Sharpshooter) 22 / 37 / 62 / 85%, common + uncommon 6 / 12 / 24 / 42%, two uncommons 2 / 4 / 10 / 19%, common + rare 3 / 6 / 13 / 23%.

Fat Wallet alone: ×3.0 at 20 coins, ×5.9 at 50, ×11 at 100. The strongest single charm that is not a fusion, and interest already pays for holding coins.

Options at the time (what was built is in the next part):
1. Seeds, one of: points only with Mult cut to 0.25 a level, a price that rises 2 a level, or a cap of about 5 levels per size.
2. Re-measure `RSC` with a bot that buys seeds. The two are coupled: without seeds the best loadout measured scores about 4,600 a jar against depth 7 targets of 10,000 to 16,000, so a seed nerf alone makes late depths very hard.
3. Smoothie to about +1.5 Mult and +12 points. Marathon is an unconditional ×2 below rare (see Things to avoid).

Not judged: tool, pet, gold and aim builds (the bot uses no tools and aims simply).

### The fix (v1.23)

- **Seeds:** +0.25 Mult a level (`SDM`, was 0.5), price 3 plus 2 per level held (`SDS`, was 1). Points unchanged. Two other tunings were tried over 200 runs each: Mult halved alone left ×Mult charms + seeds at 9 wins, points only (no Mult) dropped it to 4 with seeds-only at depth 2.7, below charms-only. The one built puts seeds-only level with charms-only, so `RSC` was left alone.
- **Smoothie:** +1.5 Mult and +12 points (was +2 and +20).
- **Marathon:** ×3 for the first 7 and last 6 drops, nothing in between (was ×2 always, ×3 for the first 6 and last 5).

Full runs after the fix, 400 each (before: 200 each):

| Policy | Before | After |
|---|---|---|
| Any charm, no seeds | 0 wins, depth 3.16 | 1 win, depth 3.18 |
| Seeds only, no charms bought | 0, 4.34 | 0, 3.46 |
| Any charm + every seed offered | 4 (2%), 5.44 | 4 (1%), 4.57 |
| Only ×Mult charms + seeds for sizes 4 to 7 | 25 (12.5%), 6.27 | 13 (3.25%), 5.55 |

Fixed loadouts after the fix (base ~256):

| Loadout | Coins | ×N |
|---|---|---|
| Seeds level 2 on Orange, Apple, Pear | 24 | 2.6 |
| Seeds level 3 on the same three | 45 | 3.9 |
| Seeds level 5 on the same three | 105 | 6.7 |
| Juicer, Honey Pot, Hot Streak, Heavyweight + the level 3 seeds | 68 | 21 |
| Heavyweight, Early Bird, Photo Finish, Lucky Clover, Snake Eyes + the level 3 seeds | 67 | 24 |
| Abacus + the level 3 seeds | 53 | 14 |
| Smoothie (halves together 3.2) | | 4.9 |
| Marathon (halves together 1.5) | | 2.0 |
| Smoothie + Marathon | | 9.9 |

Seeds are still the best place for spare coins (Hot Sauce ×5 for 40 coins is ×2.2), on purpose: they are a build with its own charms. Watch in play whether they still feel required.

### Ripeness check (after the fix)

Everything above is Ripeness 1, Classic Jar. A smarter buyer was added for this: ×Mult charms plus Abacus, Sprout and Big Basket, seeds for sizes 4 to 7, Charm Pouch, Seed Bag, cheap Watering Can and Hot Sauce, up to 3 rerolls while it holds 14 coins or more, and the best crate pick (fusion, ×Mult charm, seed, coins). Still no tools and the same aim. 400 runs each:

| Ripeness | Numbers | Wins | Avg depth |
|---|---|---|---|
| 1 | old | 214 (53.5%) | 7.81 |
| 1 | v1.23 | 77 (19%) | 6.91 |
| 2 | v1.23 | 50 (12.5%) | 6.26 |
| 3 | v1.23 | 26 (6.5%) | 5.09 |
| 4 | v1.23 | 10 (2.5%) | 3.42 |
| 5 | v1.23 | 4 (1%) | 2.75 |
| 8 | old | 2 (0.5%) | 3.13 |
| 8 | v1.23 | 2 (0.5%) | 2.58 |

- Ripeness 8 is beatable with the v1.23 numbers, by a bot that uses no tools. The simpler buyer (×Mult charms + seeds, no rerolls) also won it 1 time in 300, and 0 in 300 on the old numbers.
- From Ripeness 4 (3 fewer drops) about a quarter of bot runs die on depth 1 with no items, because it scores ~220 in 21 drops against targets of 125 to 200. That is the bot's aim, not a build problem, and it is why the high Ripeness rates say little about builds.
- With the old numbers a careful buyer won over half its Ripeness 1 runs, so the fix was needed more than the first tables showed.
- There is no cap on seed levels, before or after.

### +Mult against ×Mult (finding, 13 Nov)

Question: are ×Mult charms close to required. Five-charm loadouts, score per jar against no items (~250), v1.23 numbers, seeds = level 3 on Orange, Apple, Pear:

| Charms | No seeds | With seeds |
|---|---|---|
| +Mult and points: Juicer, Honey Pot, Hot Streak, Chain Reaction, Vintage at +2 | 10.8 | 22.5 |
| ×Mult: Heavyweight, Early Bird, Photo Finish, Lucky Clover, Snake Eyes | 5.5 | 24 |
| Mixed: Juicer, Hot Streak, Heavyweight, Lucky Clover, Snake Eyes | 13.5 | 42 |

- A mix wins by a wide margin. Neither kind alone is enough, and no single kind is required.
- On the old seed numbers ×Mult led +Mult by ×47 to ×27 with seeds. The v1.23 seed cut closed most of that gap, because seeds were supplying the +Mult for free.
- Mult is (1 + all +Mult) × every ×Mult, so +Mult charms dilute each other and ×Mult charms never do. With targets rising ×180, every winning build needs a few ×Mult pieces (pillar 2, on purpose).

The real gap: some builds have no ×Mult of their own below rare or fusion, so they borrow the generic ones (Lucky Clover, Snake Eyes, Heavyweight, Early Bird, Photo Finish) and end up alike.

| Build | Its own ×Mult today |
|---|---|
| Combo | none (Chain Reaction, Hot Streak are +Mult. Cyclone is a tool fusion). v1.40: Crescendo |
| Destruction | none (Compost is +Mult, the rest flat points). v1.40: Bonfire |
| Economy | none (Fat Wallet is +Mult). v1.40: Big Spender |
| Seeds | none (Abacus is +Mult). v1.40: Polyculture, Family Tree (more seed, not ×) |
| Gold | none as a charm (gold fruit ×2 is a one-off, Magpie is +Mult). v1.40: Hallmark |
| Tools | Encore only (v1.40: Stage Fright, which pays for not using them) |
| Aim, timing, chance, big fruit, small fruit, position, pets | have one or more |

**Direction (the user's call, not started):** fill these with new items, mainly fusions that pair pieces which plainly belong together, each giving the build a conditional ×Mult payoff. Keep to the fusion budget (both halves plus a bit: Smoothie was 2.35 times its halves before v1.23) and to Things to avoid (no unconditional ×Mult below rare). Two commons as halves means the fusion is ready in ~37% of runs by shop 9, so prefer a common + uncommon or two uncommons for the strong ones. Measure each against its halves held together before shipping.

**Fat Wallet (done in v1.39: capped at +4 Mult).** Before the cap: ×3.0 at 20 coins, ×5.9 at 50, ×11 at 100 from one uncommon, and bots that stop spending end runs on 50 to 75 coins. Options: +0.05 Mult a coin, or a cap (say +4 Mult at 40 coins). Check Golden Hand (its fusion) at the same time.

## Tool bot and v1.39 fixes (17 Nov)

Fixes: a tool hands charge to the others once per drop (Sleight of Hand at charge 1, a second Juggler, Battery and Cash Out with 2 Whetstones recharged each other with no merge: a depth 5 jar cleared with 24 of 24 drops left). The Orchard Queen and the Ripeness 8 extra rule carry the target discount of the rules they run, and The Swarm no longer pairs with The Pruner or The Collector. Fat Wallet caps at +4, Slow Cook at +2. Sweet Spot every 5th merge (was 7th), Old Oak ×0.06 (was ×0.04).

Bot rebuilt once more (kept out of the repo). It runs in the page and steps the engine 70 frames (1.1 seconds) per drop. Aim: for 33 columns and the x of every fruit of the held size, find the first fruit the drop would touch. A same-size first contact wins (the highest one, more if a fruit one size bigger touches it), else the lowest landing spot. It scores about 194 on a fresh 24-drop jar and 250 a jar over a depth, like the earlier bots. Buyer B as in Stage 2 measurement. Tool policy: Swap or Sleight of Hand when the held fruit has no match and Next has one, Shake, Rumble, Whirl or Cyclone when there is no match in a jar of 10 or more fruit or the pile is near the line, Cash Out, Free Sample, Blender and Sieve when charged, Twin, Lodestar, Ripen or Bloom on a fruit touching one a size bigger, Midas, Double Down and Twin Drop on a sure merge, Cherry Bomb near the line, Shatter on a rock. It buys those tools into free slots and one Tool Belt. It never throws, never uses toggles, Tilt, Anchor, Lead Weight, Petrify or Rewind, signs no contracts and never skips.

Classic Jar, 400 runs each (wins ±1.8 points, depth ±0.09):

| Ripeness | Build | No tools | With tools |
|---|---|---|---|
| 1 | v1.38 | 14.5%, depth 6.51 | 15.5%, depth 6.67 |
| 1 | v1.39 | 14.5%, depth 6.64 | 20.1%, depth 6.87 (800 runs: 19.3% and 21.0%) |
| 4 | v1.38 | | 2.3%, depth 4.27 |
| 4 | v1.39 | | 1.5%, depth 4.36 |
| 8 | v1.39 | | 0 in 300, depth 3.04 |

- The no-tools number matches the 15.3% measured for buyer B in v1.37.1, so this bot is comparable with the last one.
- Tools are worth little to this bot: 2 uses a jar, 3 in 4 of them Swap. A player who times Shake or sets up Double Down gets more.
- With tools the fixed build reads 4 to 5 points above v1.38, about twice the noise. The likely cause is the two buffed rares and the Queen's lower targets, since the bot never ran the charge loop.
- What ended 316 lost runs (v1.39, tools, one batch of 400): a normal jar 66, The Melon Queen 36, The Collector 35, The Pruner 28, The Orchard Queen 16, The Swarm 15, The Thief 12, The Reaper 11. 296 ran out of drops, 20 overflowed.

One charm given free at the start, then the same bot with tools, 300 runs each. No charm given: 20.1%, depth 6.87. The bot never sells, so a charm that scores below that line is worse than the slot left open for a ×Mult charm.

| Charm from jar 1 | Wins | Depth |
|---|---|---|
| Vintage (uncommon) | 65.7% | 8.03 |
| Snowball | 58.3% | 7.94 |
| Melon Fever | 42.3% | 7.41 |
| Blue Ribbon | 35.0% | 7.48 |
| Old Oak at ×0.06 (400 runs) | 30.5% | 7.19 |
| Full House | 29.3% | 7.29 |
| Hot Streak | 27.3% | 7.38 |
| Sweet Spot, every 5th merge | 25.0% | 7.40 |
| Heavyweight | 20.0% | 7.01 |
| Fat Wallet, capped | 18.7% | 6.80 |
| High Wire | 16.0% | 6.52 |
| Juicer | 13.7% | 6.88 |
| Tiki Bar | 10.3% | 6.26 |

- Before the change: Sweet Spot every 7th merge 20.0% (7.06), Old Oak at ×0.04 23.3% (6.96). Old Oak at ×0.08 measured 38.7% (7.46), above Blue Ribbon, so it went to ×0.06.
- Melon Fever was listed as a weak rare from the greedy bot's numbers. With a bot that buys seeds it is the third best charm here, so it was left alone. A buff tried first (+1 Mult per size 7+ fruit) measured 66.7%.
- **Done in v1.40.1 (see Vintage, Snowball and Keepsake below). Was open: Vintage and Snowball.** A grower that pays every jar, held from jar 1, wins most runs. Vintage is an uncommon at 7 coins and Keepsake builds on it. A real run finds it later, so this overstates it, but it is the strongest early find by a wide margin. Options: +0.3 a jar, or make it rare.
- High Wire reads low because the bot never plays at the line. Tiki Bar is a dead slot for a bot that makes no Pineapple pairs.

## v1.40 charms and tools (built, 17 Nov)

Nine charms that give the builds in "+Mult against ×Mult" a ×Mult of their own, two tools, and five awards that open five of the charms. Text and numbers in `rogue.js`.

| Build | New piece | Rarity | Open from the start |
|---|---|---|---|
| Combo | Crescendo | Uncommon | yes |
| Destruction | Bonfire | Uncommon | yes |
| Economy | Big Spender | Uncommon | Big Night Out |
| Seeds | Polyculture | Uncommon | yes |
| Seeds, families | Family Tree | Uncommon | Family Reunion |
| Gold | Hallmark | Uncommon | yes |
| Tools | Stage Fright (pays for not using them) | Rare | Jailbreak |
| Chance | Rabbit's Foot (needs a chance charm) | Common | Superstitious |
| Full jar | Brinkmanship | Rare | On the Brink |
| Aim, small fruit | Shears (tool) | | yes |
| Full jar, destruction | Harvest (tool) | | yes |

Also fixed: Headliner +0.5 Mult per tool use (was +1) and Sleight of Hand at 2 charge (was 1). The Collector asks for one size smaller on a Bite Size or Snack Pack run.

### Measurement (bot, 17 Nov)

The bot from "Tool bot and v1.39 fixes" was rebuilt the same way (kept out of the repo): same aim, same tool policy, buyer B. It buys none of the v1.40 charms or tools, so the new pool only dilutes its offers. Classic Jar, Ripeness 1.

| Build | Runs | With tools | No tools |
|---|---|---|---|
| v1.39, documented | 400 | 20.1%, depth 6.87 | 14.5% |
| v1.39, rebuilt bot | 400 | 22.3%, depth 6.92 | |
| v1.40 | 400 | 18.0%, depth 6.67 | 18.8%, depth 6.74 (300 runs: 18.0%) |
| v1.40 with the old Headliner and Sleight of Hand | 400 | 19.5%, depth 6.80 | |

- The rebuilt bot matches the documented with-tools number within noise (±2 points at 400 runs) and loses to the same bosses (a normal jar, then The Collector, The Melon Queen, The Pruner). Its no-tools number reads higher than the documented 14.5%, so its buyer is not an exact copy. Tools are worth almost nothing to it.
- v1.40 first read 4 points under v1.39. Rechecked with 800 more runs each (18 Nov): v1.40 22.5%, v1.39 19.0%. All runs together: v1.39 20.1% (1,200), v1.40 21.0% (1,200). No real difference, the first reading was noise.

One charm given free at the start, tools on, 300 runs each (±2.5 points). No charm: 18.0%. The bot never sells, so a charm below that line is worse than an open slot. Targets: commons and uncommons 20 to 30%, rares 25 to 35%, nothing above 40%.

| Charm from jar 1 | As first written | Final | Change |
|---|---|---|---|
| Crescendo | ×2 from the 4th merge of a combo: 11.7%. From the 3rd: 14.0% | ×2 from the 2nd merge: 22.7%, again 20.0% | The bot rarely makes combos of 3 or more. ×3 from the 3rd measured 24.0% but is a rare's budget |
| Bonfire, with Pet Caterpillar as the helper (caterpillar alone 21.7%) | next merge ×2: 19.7% (alone, no helper: 9.0%) | next 3 merges ×2: 22.7% | One merge every 5 drops was about ×1.2 a jar |
| Big Spender | ×0.1 per 5 coins: 15.0%. Per 3: 16.3% | ×0.1 per 2 coins (up to ×2): 20.0% | The bot spends about 10 to 15 coins a shop |
| Polyculture | 21.3% | unchanged | |
| Family Tree | 25.3% | unchanged | |
| Hallmark, with Prospector as the helper (Prospector alone 27.7%) | ×0.25 per gold merge: 20.0% | ×0.5 per gold merge (up to ×3): 30.7% | About 1 or 2 gold merges a jar with Prospector |
| Stage Fright, tools off (no charm, tools off: 18.0%) | 33.7% | unchanged | |
| Rabbit's Foot, with Lucky Clover (Lucky Clover alone 25.0%) | +0.1 a miss: 18.0% | +0.15: 25.0% | +0.2 and +0.25 both measured 34.3%, too high for a common |
| Brinkmanship | 10.7% | unchanged, **not measured**: the bot never plays at the line, so this only shows a dead slot | |

- Fireworks was tried first as Bonfire's helper and is useless here: alone it drops the bot to 3.0% (depth 4.82), with Bonfire 0.3% (4.87). This bot can not play Boom fruit.
- Not measured: Shears and Harvest (the bot's tool policy predates them and never buys them), Brinkmanship, the five awards' difficulty, and anything above Ripeness 1. Stage Fright was measured with tools off. With tools used it sits at ×1 after each use until the merges charge them again.
- Big Spender and Stage Fright pull against interest and against using tools, on purpose. Both need play.

## Vintage, Snowball and Keepsake (v1.40.1, 18 Nov)

The open point from the v1.39 run: growers that pay every jar won most runs when held from jar 1. Same bot as the v1.40 measurement, Classic Jar, Ripeness 1, tools on, 300 runs each, the charm given at the start. No charm: 21.0% (1,200 runs). Targets: uncommon 20 to 30%, rare 25 to 35%.

| Charm | Growth | Wins | Depth |
|---|---|---|---|
| Vintage (uncommon) | +0.4 a jar (old) | 63.3% | 7.99 |
| | +0.25 | 56.0% | 7.89 |
| | +0.2 | 45.3% | 7.74 |
| | +0.15 | 40.7% | 7.60 |
| | +0.1 | 33.3% | 7.36 |
| | **+0.08 (shipped)** | 27.3%, again 28.0% | 7.23 |
| Snowball (rare) | ×0.1 a jar with 5+ drops left (old) | 56.7% | 7.96 |
| | ×0.07 | 42.7% | 7.50 |
| | ×0.05 | 37.0% | 7.40 |
| | **×0.04 (shipped)** | 33.7%, again 31.3% | 7.35 |
| | ×0.03 | 29.0% | 7.13 |
| Keepsake (fusion: Pip Collector + Vintage) | +0.05 a small fruit, +0.6 a jar (old) | 68.0% | 8.15 |
| | +0.05, +0.15 | 51.3% | 7.82 |
| | **+0.04, +0.12 (shipped)** | 43.3% | 7.51 |
| | +0.03, +0.12 | 44.3% | 7.73 |
| | +0.03, +0.08 (its halves exactly) | 44.0% | 7.72 |
| Pip Collector alone | +0.03 a small fruit | 22.3% | 7.08 |
| Pip Collector + Vintage, two slots | new numbers | 48.3% | 7.86 |

- Making Vintage rare was the other option. It was kept uncommon, the power table's "+Mult that grows slowly". At +0.08 it ends a full run near +1.9.
- Snowball at ×0.04 sits near the top of the rare band, on purpose: held from jar 1 overstates a grower a real run finds later.
- Keepsake stays above 40%. Even at exactly its halves in one slot it measures 44%, because Pip Collector and Vintage together are that strong (48% in two slots). Cutting it below its halves would make fusing a trap, so it keeps "both halves plus a bit" and the freed slot.

## Legendaries (built, v1.29, reworked v1.41: see Legendaries rework below)

Five charms above rare, never sold (nine since v1.41). The table is the v1.29 version. They are what makes the shop's Charm Crate worth its price, and a reason to look forward to a melon crate.

| Charm | What it does | The rule it breaks |
|---|---|---|
| Phoenix | An overflow clears the top half of the jar instead, once every jar | Overflow ends the run |
| Cornucopia | A merge that makes an Orange (5) or bigger gives 1 drop back | Drops only go down |
| Heirloom | ×1.5 Mult, gains ×0.2 every jar cleared | The growing ×Mult the Builds table lists as missing below rare |
| Stowaway | ×1.5 Mult, takes no charm slot | Slots are scarce |
| White Flag | Bosses never reach phase 2 | Bosses get worse at half the target |

- Odds: 2 in 100 for each charm in a bought Charm Crate (about 6 in 100 crates), 5 in 100 for each charm in a melon crate (about 6 in 100 crates, measured over 4,000 of each). A player who buys every Charm Crate offered sees one in roughly 1 run in 3, one who buys none in about 1 run in 8. Gold and wooden boss crates never hold one.
- Cornucopia can not loop: a drop adds about 3.75 units of fruit and it takes 8 to 16 units per merge of size 5 or bigger, so it returns about 0.3 to 0.45 drops per drop. With Rich Soil or on The Gambler it gets close to 1, and the jar fills before it gets there.
- Heirloom found at the depth 4 melon crate ends a run at about ×3.7. Snowball (rare, with a condition) ends near ×3 when found early.
- White Flag also cancels Ripeness 8's "bosses start in phase 2". The second boss rule on the final boss still applies.
- Not measured with the bot. They are rare enough not to move the average run, but a run that finds one early is plainly stronger.
- Ideas not built: a Legendary tool, crate-only items for the Tool Crate and Seed Crate, a sixth one for the Tools build (a tool keeps half its charge when used).

### Legendaries rework (v1.41, 18 Nov)

The user found them weak for their rarity. Bot, Classic Jar, Ripeness 1, tools on, the Legendary held from jar 1, 300 runs each. No charm: 20.3% (400 runs). Before the rework: Phoenix 9.7%, Cornucopia 25.7%, Heirloom 67.0%, Stowaway 38.3%, White Flag 20.0%. On Ripeness 4 (no charm 2.0%): Heirloom 53.0%, Stowaway 12.3%, White Flag 2.3%. Target for a Legendary, "about two rares": 45 to 60%. Every suggestion was built first, then the numbers were cut to the target.

| Legendary | Shipped | Wins | What was cut, and why |
|---|---|---|---|
| Phoenix | No slot. On a save the cleared fruit score ×2 and it gains ×0.5 | 24.0% | **Not measured**: the bot almost never overflows. Left as built |
| Cornucopia | ×1.5, an Orange (5) or bigger gives 1 drop back | 52.3%, again 48.0% | With growth per drop left (×0.05, ×0.02 or ×0.01) and drops from a Lemon or 2 from a Pineapple: 80 to 88%. Drops left snowball the growth. Both cut |
| Heirloom | ×1.25, ×0.1 per jar | 59.7% | ×0.2 measured 66% under the old Auditor and 75.7% after its fix |
| Stowaway | No slot, ×1.75, +1 Orchard slot, the rightmost other charm scores twice | 60.0%, after the Auditor fix 63.0% | ×2: 62.3 to 63.7% |
| White Flag | No phase 2, no curses, boss targets −10%, ×0.08 per boss beaten | 52.3% | All four at −25% and ×0.25: 92.3%. −25% with ×0.1: 74%. −10% with ×0.1: 60.7% |
| Golden Rain (new, active) | 10 charge: every fruit gold, at ×3 and 4 coins | 50.7% | 16 charge with plain gold: 27%. 10 or 8 charge: 37 to 38%, so the gold was raised, not the charge |
| Supernova (new, active) | 8 charge: every pair merges at once, those merges ×10 | 54.0% | Plain: 9.3%. ×3: 18%. ×6: 33%. A drop back per merge did nothing (18.7%) |
| Limelight (new, active) | 10 charge: next 8 merges ×4 | 58.7% | 15 charge for 5 merges: 28% |
| Passerby (new, active) | 6 charge: the cat carries the next 6 drops to a match, free | 49.3% | 12 charge for 3: 18.7%. 8 for 5: 36%. 8 for 5 with ×2 merges: 58.3%, not taken (more text) |

- The bot uses an active Legendary the moment it is charged. A player who saves Supernova for a full jar or Limelight for big fruit gets more.
- The Auditor fix (v1.41) moved every grower up: under the hard ×6 cap it ended many runs that held a growing ×Mult. Heirloom went from 66% to 75.7% with nothing else changed.
- White Flag's second boss rule on a Ripeness 8 final boss still applies. Ripeness 8 was not measured.
- Charm Crates hold a Legendary 4 times in 100 per charm (was 2). Legendaries sell for their full 15.

## Contracts and skip rewards (built, v1.28)

Aim: jars 1 and 2 of a depth all played the same. Contracts give each one a choice (pillar 5, risk for reward) without adding power to the item pool.

- Every contract is a handicap. A side goal with no cost ("finish with 8 drops left for 4 coins") would be free coins on every jar, about 60 a run, and the target curve was set against a player without them. A handicap is paid for with risk, and a player who never signs plays the old game exactly.
- Pay: 3 to 5 coins (a plain jar pays 3 or 4), 1 seed level, or a wooden crate. Coins for rules that cost a known amount (drops, target, tools), a crate for the two that hurt most (Big Game, Rubble, whose rocks stay in the pile for the rest of the depth).
- Not measured. A good player who signs most contracts earns maybe 30 to 40 more coins a run. If runs get too rich, cut the pay before cutting the offers. Hands Off is free value for a build with no tools worth using, Big Game for a big-fruit build: that is intended, a contract that suits the build is a small reward for having one.
- Skip rewards: the crate is always one of the two, so skipping is never worse than before. The other four are tempo (Extra Drops, Free Rolls) or greed (Double Pay, Bigger Haul).
- Ideas not built: a second contract to choose between, contracts on boss jars for a better crate, contracts in the Almanac.

## Stone (built)

For the play-near-the-top build (High Wire, Climbing Ivy), which had nothing to make it safer.

| Item | Kind | Effect |
|---|---|---|
| Petrify | Tool, 5, charge 8 | Tap a fruit: stone, can not move or merge, never counts as over the line, crumbles when the next jar starts (counts as destroyed for Compost and Ashes) |
| Shatter | Tool, 4, charge 6 | Tap a rock: it becomes a fruit of the same size. An answer to The Quarry and the Melon Queen's rock |
| Gargoyle | Charm, uncommon, 6 | Rocks never count as over the line. +0.5 Mult per rock in the jar |
| Medusa | Fusion, Petrify + High Wire | Petrifies the tapped fruit and every fruit touching it |

Fruit resting on stone still counts for overflow, so stone props a pile up but does not make the top free. Not measured with the bot (it uses no tools).

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

## Fruit names (built, v1.19)

Sizes get names, with the number kept: Cherry (1), Strawberry (2), Grape (3), Mandarin (4), Orange (5), Apple (6), Pear (7), Pineapple (8), Peach (9), Rockmelon (10), Watermelon (11). Since v1.31 the Mandarin is the Lemon (4) (feedback: the sprite reads as a lemon) and the Watermelon (11) has a new sprite from the user (it was named Watermelon Queen from v1.31 to v1.32.1 by mistake: the user meant the boss, now The Melon Queen). Mandarin and Rockmelon were the Australian names, on purpose. A single size is written "Orange (5)", a range stays numeric ("size 3 or smaller"). Touches item texts, seed labels and the Almanac. Keep names short where cards are small.

## Hard awards (built, v1.19)

Hard or obscure, not earned by accident. The hard ones give a **title** shown before the player's name ("Bugtester (name)"), the rest are badges. Titles need a field on leaderboard scores, so `database.rules.json` changes and the user re-publishes it by hand. Titles in brackets.

1. Bugtest: hold Pet Caterpillar (or Feeding Frenzy), Pet Bowl, Pet Treats, Chrysalis and Big Appetite at once. All 5 slots, so Ripeness 7 needs the Charm Jar or Charm Pouch. (Bugtester)
2. Butterfly Effect: Chrysalis (or Butterfly Garden) reaches +5 Mult (10 butterflies) in one run. (Lepidopterist)
3. Rainbow Jar: one fruit of every size from Cherry (1) to Rockmelon (10) in the jar at once. (Rainbow)
4. Golden Melon: make a Watermelon out of a gold Rockmelon (10). (Golden)
5. Exact Change: reach a jar's target exactly with the last merge. (Accountant)
6. Close Shave: clear a jar while the pile is over the line and the overflow timer runs. (Daredevil)
7. Southpaw: clear a jar of 10 or more drops dropping every fruit in the left half. (Southpaw)
8. Full Ladder: one combo that makes every size from Strawberry (2) to Watermelon (11). (Climber)
9. Untouchable: beat a boss at depth 5 or deeper without the pile ever going over the line. The gold line idea was dropped: it is only drawn with High Wire or Climbing Ivy. (Untouchable)
10. Medusa's Garden: petrify 5 Oranges (5) in one run. (Medusa)
11. Rock Bottom: 6 rocks in the jar at once. (Geologist)
12. Mouldy Oldie: let 3 fruit go mouldy in one jar and still clear it (The Rot). Badge.
13. Seller's Remorse: sell a charm and buy the same charm back before the next jar. Badge.
14. Empty Pockets: beat a final boss holding 0 coins (before the payout). (Pauper)
15. Not Interested: leave 5 crates unopened in one run. Badge.
16. Pear-Shaped (secret): lose a run with a Pear (7) as the fruit over the line. (Pear-Shaped)
17. Fruit Fly: keep a fruit in the air for 2.5 seconds without touching anything. Measured: 3s never happened in 60 Whirl uses, 2.5s about 1 in 20, Shake under 1s. (Fruit Fly)

Tracking added for them: drop side, airtime, pile over the line this jar, the fruit over the line at game over, sizes made in the current combo (see `CLAUDE.md`, Awards).

## Cosmetic rewards (built, v1.27)

For awards that should not unlock power (pillar 7). Called Looks in the game, data in `COS`, worn from Options.

- Titles: a tag before the player's name, shown on the leaderboard. First choice for hard awards. Since v1.49 most awards carry one, with a rarity by how hard the award is: Common (first steps), Uncommon, Rare (a run goal or a tricky feat), Epic (long-haul or hard boss goals), Legendary (Overripe, Golden, Climber, Professor).
- Jar skins (8): one for a win with each starting jar (Pink Ceramic, Deep Glass, Velvet, Steel, Planks), Golden for Ripeness 4, Melon Rind for Ripeness 8, Crystal for a full Almanac.
- Backgrounds (7): one per final boss beaten (Throne Room, Orchard Sky, Midnight), The Deep for the depth 12 boss, Melon Patch for 10 Watermelons, Sunset for 10 wins, Notebook for half the Almanac.
- Fruit skins (3): Solid Gold (200 gold merges), Past It (25 mouldy fruit), Black and White (a depth 3 boss with no charms). Each is a colour ramp applied to the sprites by brightness, so they need no new drawings. Past It is brown, not green, so mould still shows on it.
- Sound sets (3): Chiptune (1,500 merges), Marimba (6,000 merges), Wood Block (50 crates). Only the merge sound changes.
- Almanac stamps: a dated seal on earned awards, and a completion bar. Half and full completion are awards.

Animated (v1.30), for the six that are hardest to earn, so a moving look is a mark of skill: Melon Rind (Ripeness 8), Crystal (full Almanac), Golden (Ripeness 4), The Deep (depth 12 boss), Sunset (10 wins), Black and White (a boss with no charms). A new look from a hard award should move too, one from a count of things done should not.

The lifetime numbers are guesses, not measured against real play. The jar frame is only 6 pixels wide, so skins read mostly through colour. Ideas not built: skins for the tool bar and HUD, a second sound per set (land, combo), animated fruit skins.

Normal-play awards can keep unlocking charms, tools and jars as now. Obscure awards should not lock gameplay content.

## Families and the Orchard row (doing: stage 1 layout v1.33, stage 2 families and the Orchard v1.34)

Why: Rogue feels less strategic than Balatro. Builds hang off narrow pieces (fusions need two exact halves, ~28% of runs see both uncommon halves), so a loss often comes down to the shop. Balatro has broad axes (suits) and lets you shape what you draw. A fruit bag (deck) was considered and turned down by the user: the random queue is what gives tools their job. This keeps the random queue and lets the player tilt it.

### Plan summary (read first, 16 Nov)
Decided by the user:
1. Fruit families as a second axis (list below). No fruit bag.
2. Orchard row: a separate row of 2 slots (3 with an upgrade) for items that only shape drops. Green outer border, far right of the top row above Next.
3. Bosses gain stream enchantments (phase 1) and Orchard disenchantments (phase 2), shown under the boss picture.
4. Hidden weight towards the missing half of a held fusion (soft pity, below). Steer players to fusions over rares.
5. Style items: no Style slot. Throwing and speed items are charms, physics and placement items are tools. Tools can be timed (counted in drops) or toggles (tap on/off, 1 charge per drop while on, several can run at once). Slingshot can become a toggle.
6. Bouncy fruit (new state) from the Orchard item Rubber Tree, and a rare bounce ×Mult charm for throwing builds.
7. Layout: pause folds into one i button that opens a tabbed screen (Run info first, Almanac, Options, Resume, Quit run at the bottom). Drops bar moves to just above the tool bar, the jar keeps its size and moves up.

Still open: the charm/Orchard/tool rule and whether Lodestone, Rich Soil and Prospector move to Orchard; where the i button sits; item names and numbers; family wildcard (Pineapple).

Suggested order: layout first (i screen, drops bar, top row with Orchard space, screenshots at 360 and 412px), then families + Orchard row + family scorers, then fusion weight, then style items and toggles, then the boss stream layer. Rebalance with the bot after scoring changes. Each stage asked for separately, one commit series each.

### Stage 2 as built (v1.34)
User calls (16 Nov): Lodestone, Rich Soil and Prospector moved to the Orchard. Pineapple is Tropical only, no wildcard. The Apple and Pear family is called Pome, so "Orchard" only names the row. More Orchard items than first proposed, and more dynamic ones that tie into existing builds.

Family merge = two fruit of that family merging (so two Cherries count as Stone fruit). Measured with the aiming bot, fresh 24-drop jar: Stone 1.7, Berries 5.2, Citrus 4.1, Pome 0.1, Tropical about 0 merges a jar. Pome, Tropical and Melons grow as the pile carries over.

| Orchard item | Rarity, price | Does | Feeds |
|---|---|---|---|
| Lodestone (moved) | Common 4 | Every 5th drop is a Magnet | Aim, Sharpshooter |
| Citrus Grove | Common 4 | Lemons drop twice as often | Zest, Marmalade |
| Berry Patch | Common 4 | Strawberries and Grapes drop twice as often | Berry Picker, Jam, small fruit |
| Forecast | Common 4 | Shows the 2 fruit after Next | Aim, Fortune Teller |
| Morning Dew | Common 4 | First 6 fruit of each jar are Cherries | Early Bird, Cherry Pit, Small Fry, pets |
| Crop Rotation | Common 4 | Drops cycle Cherry, Strawberry or Grape, Lemon | Medley, aim |
| Rock Garden | Common 3 | Every 8th fruit is a rock | Gargoyle, Zen Garden, Shatter, Compost |
| Prospector (moved) | Uncommon 6 | 1 in 10 drops gold | Gold, Treasure Hunter |
| Weeding | Uncommon 6 | Cherries never drop | Big fruit |
| Hothouse | Uncommon 6 | 1 in 12 drops an Apple (Horseshoe doubles it) | Pome, Cider Mill, big fruit, chance |
| Second Helping | Uncommon 6 | Every 5th fruit copies the one before | Aim, combos, Fortune Teller |
| Beehive | Uncommon 6 | Every 6th drop arrives pollinated (×3, ×4 with Butterfly Garden) | Pets (Nectar eats pollinated first) |
| Golden Hour | Uncommon 7 | Last 4 drops of each jar arrive gold | Gold, Photo Finish, Magpie |
| Hot Bed | Uncommon 6 | A combo's 3rd merge turns Next into a Magnet | Combo |
| Rich Soil (moved) | Rare 9 | Every drop one size bigger | Big fruit |

| Charm | Rarity, price | Does |
|---|---|---|
| Zest | Common 5 | +0.3 Mult per Citrus merge this jar |
| Berry Picker | Common 5 | Berry merges +15 points |
| Cherry Pit | Uncommon 6 | +0.5 Mult per Stone fruit merge this jar, two Peaches ×5 |
| Cider Press | Uncommon 7 | Pome merges ×3 |
| Medley | Uncommon 7 | ×0.15 more per family merged this jar |
| Tiki Bar | Rare 9 | ×0.25 per Pineapple merge, for the run |

Fusions: Marmalade (Zest + Citrus Grove: the Grove's effect, +0.5 Mult per Citrus merge), Jam (Berry Picker + Berry Patch: the Patch's effect, Berry merges +25 points and ×1.5), Cider Mill (Cider Press + Hothouse: the Hothouse's effect, Pome ×4), Zen Garden (Gargoyle + Rock Garden: a rock every 6th fruit, rocks safe, ×0.25 per rock) are charms. Fortune Teller (Forecast + Second Helping: 3 fruit after Next, every 4th copies the one before) is an Orchard item. Raised Bed: upgrade, 10 coins, +1 Orchard slot.

Shop: 1 Orchard item a visit. Crates: 1 charm pick in 5 becomes an Orchard pick.

### Stage 2 measurement (16 Nov, v1.34)
Bot rebuilt (kept out of the repo): aims at the highest fruit of the same size, else the lowest column. Buyer A is the smart buyer from "Ripeness check" (×Mult charms, Abacus, Sprout, Big Basket, seeds 4 to 7, Charm Pouch, Seed Bag, cheap Watering Can and Hot Sauce, up to 3 rerolls at 14+ coins, best crate pick, no tools, no Orchard). Buyer B is A plus the family scorers, Orchard items that pair with a held scorer (Citrus Grove with Zest, Berry Patch with Berry Picker, Hothouse with Cider Press, Rock Garden with Gargoyle) and the general ones (Weeding, Beehive, Golden Hour, Second Helping, Prospector). 400 runs each, Classic Jar:

| Ripeness | main (v1.32.4), A | v1.34, A | v1.34, B |
|---|---|---|---|
| 1 | 14.0%, depth 6.78 | 11.3%, depth 6.45 | 25.5%, depth 7.22 |
| 4 | 1.8%, depth 3.89 | | 3.3%, depth 4.22 |
| 8 | 0.3% (1 win), depth 2.81 | | 0%, depth 2.99 |

- The Orchard is two free slots of power, so a buyer that uses it wins about twice as often on Ripeness 1. Higher Ripeness barely moves: it is the drop and target rules there that kill runs, not the build. The user's call (16 Nov): Ripeness 1 is meant to be the easy level.
- Before the retune below, B won 27.5% on Ripeness 1.
- One jar at depth 7, base loadout Juicer, Honey Pot, Hot Streak, Heavyweight, 40 jars, fresh pile (noise about ±15%): Zest first measured ×1.50 at +0.6 (a common, Juicer ×1.2 to ×1.4), now +0.3 at ×1.42 against Juicer ×1.38 on the same run. Cherry Pit ×1.04 as ×2/×6, now +0.5 per Stone merge ×1.39. Medley ×1.06 as "last 3 merges 3 families", now ×0.15 per family ×1.54. Marmalade ×2.33 at +0.6, now +0.5. Jam ×1.77, Cider Mill ×2.05, Zest + Citrus Grove ×1.83, Cider Press + Hothouse ×1.82. Hive and Weeding ×1.2. Rich Soil ×1.63 (unchanged, but no longer takes a charm slot). Golden Hour and Prospector pay about 4.4 coins a jar.
- Zen Garden measured ×1.0 on a fresh pile: its rocks pile up over a depth in a real run, so it needs play. Forecast, Morning Dew, Crop Rotation, Second Helping and Lodestone score ×0.9 for a bot that can not use them: they are aim tools.

### Families
A tag on each size, on top of size. They jump across sizes, so a family build rewards a pattern, not a block (unlike Small Fry and the size-range charms).
- Stone fruit: Cherry (1), Peach (9)
- Berries: Strawberry (2), Grape (3)
- Citrus: Lemon (4), Orange (5)
- Orchard: Apple (6), Pear (7)
- Tropical: Pineapple (8), one member, could count as any family (wildcard)
- Melons: Rockmelon (10), Watermelon (11)

### Orchard row
- A second charm row, separate from the 5 scoring slots. 2 slots, a 3rd from an upgrade. Shown near Next, its own shop section.
- Orchard charms only change what drops and what state a drop arrives in. Never the score maths.
- Examples: Citrus Grove (Lemons drop twice as often), Weeding (Cherries never drop), Hothouse (1 drop in 12 is an Apple), Gilded Crate (every 8th drop arrives gold), Second Helping (every 5th drop matches the one before), Forecast (shows 2 more fruit after Next).
- Gilded Crate and Second Helping are the "deck enhancement" layer without a bag: the stream is upgraded, not a list of cards.

### Family scorers (main 5 slots)
- Charms that read families: +1 Mult per Citrus merge this jar, ×2 on Peach merges, Fruit Salad (×1.5 when the last 3 merges were 3 different families).
- Fusions join an Orchard charm with its scorer (Citrus Grove + a citrus scorer), so a build has a spine: shape the queue, then score what you shaped.
- A family is a broad axis, so more of each shop is partly useful.

### Bosses on the stream (built in v1.37)
Built as recommended (16 Nov): every boss jar draws one drop curse and one Orchard curse per depth. Sour Graft, on the user's call, makes each Orchard item work in the opposite direction (Citrus Grove: Lemons half as often; Weeding: Cherries twice as often; Rich Soil: one size smaller; Morning Dew: Lemons first; Hothouse: 1 in 12 a Cherry; Forecast: Next hidden; Second Helping: never the same; Beehive, Golden Hour, Prospector: mouldy drops; Hot Bed: a rock; Rubber Tree: Sticky; Lodestone and Crop Rotation, which have no plain opposite: rocks every 5th / 4th; Rock Garden: no rocks). Hardy and Pesticide are upgrades. The Ripeness curse was skipped, since every boss already brings two.

Curse retune (v1.37.1, after testing the merge): the first numbers were far too harsh. One depth 1 boss jar (The Taxman), no items, 60 to 80 jars, jar score against no curse: Blight on Berries or Citrus −52% (half of all drops became rocks), Frost −23% (it used the Frozen boss special, which freezes the fruit around it and shrinks it), Worms every 7th −19%, Blight on Stone −10%, Overgrowth −7%, Bramble −3%. Now: Blight hits one size, Cherry to Grape, every 3rd one (−6 to −10%), Worms every 12th, Frost freezes the drop itself where it lands for 3 seconds every 4th drop (−4%), Overgrowth −7%. Bot, buyer B, 400 runs: Ripeness 1 7.0% wins with the harsh curses, 15.3% (depth 6.66) after the retune; Ripeness 4 0.3% (depth 3.32, was 3.3% in v1.34); Ripeness 8 0% (depth 2.50). The curses take back about what the Orchard gave at Ripeness 1 (main was 14% before this series) and make the high levels harder. Boss preview (next depth's boss and its curses in the hub and shop) and the Detour skip reward are in; Bribe stays the paid reroll.
Phase 1 enchants the stream, phase 2 disenchants the player's Orchard row.
- Enchantments: Blight (one family stops dropping, replaced by rocks), Overgrowth (1 drop in 5 is a Cherry whatever the Orchard row says), Worms (every 7th drop arrives mouldy), Frost (every 6th drop is stuck in place for 2s), Bramble (Next hidden, Forecast too).
- Disenchantments: Uproot (Orchard charms switched off, the Thief's twin), Sour Graft (Orchard charms work backwards, its slot must show an obvious red flipped look or it is unreadable), Pest (steals the leftmost Orchard charm for the jar and uses it against you).
- Contracts can offer stream curses as handicaps. A Ripeness level could add a stream curse to every boss.
- Counter items: Hardy (Orchard charms can't be switched off), Pesticide (no mouldy drops). Only worth buying once the boss is seen coming.

### RNG relief to go with it
- Show the next depth's boss early, and a boss reroll (upgrade or skip reward). Required once bosses hit the Orchard row. Origin: a Sleight of Hand + Battery + Juggler + Cash Out + Fat Wallet money loop was ended by The Padlock with no answer available.
- Pity for fusion halves: superseded by the hidden weight in "Steering to fusions".
- Score table in Run info: what each size is worth with the current build, so the target can be planned against.
- Charm editions (already under Later).

### First slice and open points
- Family tags, the Orchard row with 2 slots, ~8 Orchard charms, ~6 family scorers, a few fusions. Boss layer after.
- Run save gains an Orchard list: version bump (`RV`) with a migration.
- Queue shaping makes runs more consistent, so re-run the balance bot, and give it a policy for Orchard charms or it will undervalue them.
- Each new item needs an icon grid, `ANIM` entry, Almanac rows, dev panel support and events through `rgEv`.

### Steering to fusions (added 15 Nov, built in v1.35)
Built: the hidden weight as below (rarity is rolled first, the weight only acts within the half's rarity), Grafter (uncommon, 7: +2 Mult per fusion held, started below the +3 first suggested), Rootstock (common, 5: a fusion made gives a random seed 2 levels). The user kept recipes in the Almanac only and turned down the mark on halves in later runs (16 Nov). Measured over 400 runs of 24 shops, one half held, nothing bought: an uncommon half (Hot Streak) never offered in 60% of runs before, 0.5% after, first offered at shop 18.7 on average before, 7.1 after; a common half (Juicer) 8% never before, 0% after, first at 9.0 before, 2.4 after; a rare half (Melon Fever) 75% never before, 14% after.
Bot, buyer B (now also buying Grafter and Rootstock), Ripeness 1, 400 runs: v1.34 23.0% wins, depth 7.22, 0.69 fusions made a run; v1.35 27.0% wins, depth 7.13, 1.01 fusions a run. The win rate moved within noise, the fusion count by about half.

Goal: stop "drop this for a rare". Recipes stay hidden until both halves are held.
- Hidden weight (user accepted it on 15 Nov, was turned down before): while one half is held, the missing half's shop and crate weight starts at ×2 and gains +1 per shop it fails to show, resetting when it shows. Soft pity in place of a hard guarantee.
- Fusions should beat any rare on the power budget, so holding a half is a real bet.
- Found recipes stay in the Almanac. In later runs their halves carry a small mark in the shop. Undiscovered ones stay hidden.
- Fusion payoff charms: Grafter (+3 Mult per fusion held), Rootstock (making a fusion gives a random seed level).
- Optional: halves grow a little per jar held.

### Style items (added 15 Nov, built in v1.36)
Built, on the user's go (16 Nov): Ricochet (common 5, +0.2 Mult per thrown wall bounce this jar), Curveball (uncommon 6), Pinball (rare 9, ×1.25 per bounce up to 4 if the thrown fruit merges before resting 0.4s), Quick Hands (common 4, drop gap 0.3s), Slow Cook (uncommon 6, +0.5 Mult per second waited before the last drop, up to +4), Lingering (uncommon 6). Toggles: Slingshot (charge 6, now a tool, saves migrate), Moon Boots (8), Long Arm (6). Timed: Tilt (8, 3 drops), Twin Drop (10, 2 drops). Rubber Tree (Orchard, uncommon 6, every 5th drop bouncy for 4 bounces). Bank Shot dropped as a copy of Trick Shot. Lead Weight may target the held fruit (user, 16 Nov). The bot does not throw or wait, so none of this is measured: needs human playtests, above all Slow Cook (+4 for waiting 8 seconds a drop may be too generous) and Moon Boots with bouncy fruit.

Items that change how you play, like Slingshot and long combos played fast. No separate Style slot (the user found it narrows builds).
- As charms (change every drop): Ricochet (+1 Mult per wall bounce of a thrown fruit), Bank Shot (thrown fruit merging after a bounce ×2), Curveball (thrown fruit curve towards the nearest match), Quick Hands (drop gap 0.55s to 0.3s), Slow Cook (+Mult per second since the last drop, capped).
- As timed tools (bursts, counted in drops, shown with the countdown badge): Moon Boots (low gravity), Tilt (tip the jar), Long Arm (drop from any height; built as a toggle in v1.36, a timed tool of 3 drops since v1.40), Twin Drop (two fruit at once). Tune each with charge cost and length in drops. Tool charm Lingering: timed tools last 2 more drops.
- Needs human playtests, a bot can't judge feel.
- Toggle tools (third tool kind beside fire and armed): tap on, tap off. While on, each drop costs 1 charge; it switches off when charge runs out. Slingshot as a toggle: drags only throw while it is on, so a stray flick never throws by accident. Padlock switches toggles off. Fits Moon Boots and Long Arm too, letting the player pick the moment instead of a fixed length.
- Bouncy fruit (new fruit state, does not exist yet): high restitution, bounces off walls and fruit. Feeds Slingshot, Trick Shot, Ricochet and Bank Shot. Source: an Orchard charm, Rubber Tree (1 in 5 drops arrives bouncy), so the throwing build gets a queue-shaping piece like the family builds.
- Bounce ×Mult (rare charm, name open, e.g. Pinball): a thrown fruit gains ×1.25 per wall bounce, paid only if it merges before settling, lost on a miss. Accuracy traded for points. Cap the bounces counted (about 4), or bouncy fruit in low gravity farms it. Target combo: Rubber Tree + Slingshot + Moon Boots + Heavyweight.
- Several toggles may run at once (up to the 4 tool slots). Each drains its own charge per drop, merges refill all of them, so the limits are slots and charge. Check that Moon Boots + bouncy fruit still settle in reasonable time.

### Charm, Orchard or tool (rule proposed 15 Nov, not decided)
- Charm: has a scoring effect (points, Mult, ×), even if it also changes drops.
- Orchard: only changes what drops or the state it arrives in, no scoring text.
- Tool: the player chooses when (fire, armed, or toggle).
- Existing drop-shaping charms under this rule: Lodestone, Rich Soil, Prospector are pure and would move to Orchard. Fireworks, Bite Size, Volcano, Snack Pack, Sharpshooter, Treasure Hunter score, so stay charms. Alternative: leave every existing charm where it is and use Orchard only for new items (no migration, less tidy).
- Moving charms needs an `RV` bump: a migration moves them from `ch` to the Orchard list (overflow beyond the Orchard slots stays as a charm or is refunded).
- Orchard fusions: cross-row like tool fusions. Orchard + charm makes a charm when the result scores (Sharpshooter would become Lodestone + Bullseye, freeing the Orchard slot), Orchard + Orchard makes an Orchard item (e.g. Rubber Tree + Prospector: bouncy gold drops).

### Layout for the Orchard row (open)
- Worst case to fit at 360px CSS width: charms 5 + Charm Pouch + Charm jar + Stowaway (8), tools 4, Orchard 3, plus pause, i, Next, boss icon.
- (Superseded by the user's layout below.) Proposal: Orchard slots sit beside the Next preview, small, since they act on Next. The boss icon moves or shares that cluster. Header charm row and tool bar unchanged.
- Fallbacks if it crowds: header charms shrink past 6, or the Orchard cluster collapses into one icon that opens a card (like `tipShow`).
- Mock up with Playwright screenshots at phone widths (360 and 412) before building.
- User's layout (15 Nov, replaces the proposal above): pause and i leave the top row. The top row holds charms and, on the far right above Next, the Orchard slots with a green outer border (about 10 spots in all). Under the boss picture: the boss's stream enchantments and disenchantments.
- Pause and i merge (user, 15 Nov): one i button. It pauses the jar and opens a tabbed screen: Run info (default tab), Almanac, Options. Resume (and the sticky ×) returns to the jar, Quit run sits at the bottom of the screen. Replaces the pause screen, `#infoB` and the `G.inf` route. The empty-header tap opens the same screen. Where the i button sits is open (left end of the HUD score line suggested).
- Drops bar moves from the HUD to just above the tool bar (user, 15 Nov). The jar keeps its size and moves up into the space the drops bar leaves in the HUD, so play is unchanged.
- User's HUD draft (16 Nov, mock-up over the live game at 360px): top-left the depth and boss name, with the boss icon under it and the stream badges (orange = on the drops, red = on the Orchard row) beside the icon. Score and target centred with the score bar under them. Mult top right, Next under it. Drops bar and the single i button above the tool bar, as above. Under the score bar, centred: the Last line (points × Mult = score, kept for pillar 1), then the boss tag line (`bossIn`, e.g. "Make a Pear (7)") under it (user, 16 Nov). Layout decided.

### Parked ideas from the same talk (not adopted, not rejected)
- Consumables: cheap one-shot items (like tarot cards) that change a seed level or the next few drops.
- Online (feasibility only, 15 Nov): public profiles and a friends list fit the existing Firebase setup (a public `pub/$uid` slice, friend requests, a heartbeat for online status, rules change by hand). Multiplayer: async seeded challenges are easy and give the daily seeded run, live versus with separate jars (send rocks to the opponent) is moderate, a shared jar is hard and not recommended.
- Turned down: a fruit bag (deck) in place of the random queue; a separate single Style slot; a hold slot (overlaps Swap and weakens the random queue).


## Limbo (v1.42)

Rare, 8 coins, the user's idea. ×3 Mult with no condition, paid for with the line sitting 25% of the jar lower (The Lid is 14%, 22% in phase 2, and they stack). Builds: anything that wants a big ×, and the near-the-line pieces, since the gold line comes down with it: Hedgehog (climbs sooner, its gold line is 30% of the room below the line), Phoenix and Safety Net (they clear the top half of the room below the line, so they catch the overflows Limbo causes), High Wire, Brinkmanship, Harvest. The user named Hedgehog and Phoenix as its build. Its risk is a carried pile: bought with a tall pile, the jar starts over the line. Not measured by the bot yet.

## Pool expansion plan (agreed 18 Nov)

The user's call after a build-variety check: late runs converge on the same general rares and Legendaries, pets rarely come together, and fusions should open more builds, hybrids included. Measured over 4,000 simulated runs (shop only): any one uncommon is offered 0.4 times a run, a common 1.8, a rare 0.2. An eating pet (Caterpillar, Mole, Hedgehog) is offered by depth 3 in 41% of runs, and only 36% of those then see a pet payoff by depth 5. 54% of rares offered are build-neutral ×Mult. The Orchard was ruled out as the cause: it has its own shop slot and row.

Order of work: shop changes, editions, pet levels, then items in batches of about 12 (pets and bombs first), each batch with icons, ANIM entries and a bot check.

**Built in v1.43 (18 Nov):** shop 5 slots and rare 2.4%, shop crate fusions, editions, pet levels, batch 1 (the 7 pet and 6 bomb items, fusions Alpha, Feast, Honeycomb, Cluster Bomb). Changes from the plan: Alpha triples XP instead of starting pets at Lv2; Lv5 Bee is 5 at a time with no pollen carry-over and Lv5 Ladybird is ×2.5 with no second ladybird (both left for later); Zest Bomb hits up to 3 Citrus anywhere in the blast, since only touching Citrus would rarely fire; Shrapnel also hits 5 fruit instead of 3. Not bot-measured yet.

**Built in v1.44 (18 Nov), batch 2:** the 3 Wildcard items, the 5 family items, the 3 boss counters, fusions Full Deck, Carnival, Citrus Blast, Fondue. Changes from the plan: Fruit Salad and Carnival pay on the merge that brings a combo to 3 families (the last merge of a combo is not known when it scores); Citrus Blast keeps Citrus Squeeze's merge charge too; Blue Cheese merges mouldy with mouldy only, Fondue opens mouldy and frozen fruit to any fruit of their size. The bot pass waits for the end of the expansion (the user's call).

**Built in v1.45 (18 Nov), batch 3:** small fruit, big fruit, combo and the gold trio (pulled forward so the gold award had an item to open), fusions Playground, Skyscraper, Avalanche, Grand Finale, Big Bang, Fort Knox, Gold Digger. Changes from the plan: Piggyback became Golden Berry (1 in 8 Strawberries made are gold), Gold Rush became Pay Dirt (an award is already called Gold Rush), Rapid Fire gives +0.3 Mult for the jar each time 3 drops land within 2 s, Finisher pays when a combo ends (+25 per merge in it). Gold Standard is capped at +5, Fort Knox at +7, like Fat Wallet.

**Award locks (v1.45, the user's ask):** 11 awards each open one new item: Good Boy (clear a jar holding a pet) Pet Collar, The Very Hungry Caterpillar (Caterpillar level 5) Well Fed, Top of the Food Chain (4 level 5 pets at once) Alpha, Golden Thread (a fruit gold through 6 merges) Gold Standard, Kaboom (5 fruit from one Boom) Chain Blast, Wild Night (3 Wildcard merges in a jar) Masquerade, Cheese Course (beat The Rot) Blue Cheese, Thaw (beat Cold Snap) Ice Sculptor, Tiny Army (20 fruit of size 2 to 4 in a jar) Nursery, High Rise (3 fruit of size 8+ at once) Skyline, Domino Effect (a combo of 7) Domino. The items from before the expansion stay open (standing decision 2).

**Built in v1.46 (18 Nov), batch 4:** seeds, tools, position and rocks, economy and chance, Lob, fusions Harvest Festival, Workshop, Amphitheatre, Crystal Cave, Hedge Fund, All In, Catapult. Changes from the plan: Recycler makes every 4th tool use in a jar free (a tool can only be used at full charge, so "refund 1 when used at full charge" would always fire); Toolsmith makes targeted tools 2 charge cheaper instead of two uses at 1.5× (Workshop: every 3rd use free); Compost Bin reads the jar just played; Compound Interest is capped at +5, Hedge Fund at +7. Double or Nothing counts as a chance charm for Horseshoe and Rabbit's Foot; its chance (and All In's) is capped at 3 in 4 since v1.47, so Horseshoe can not make it certain.

## Orchard expansion (built in v1.47, 18 Nov)

The user's call: the Orchard was thin (17 items, mostly Common) and should grow by about 20, more Uncommons, each quietly feeding one of the new builds. 6 Common, 12 Uncommon, 2 Rare. Every one has a Sour Graft text (`rv`): the periodic ones become a rock, the size ones a Cherry (or a Lemon for Seed Rain). The Orchard shop roll moved from 70/26/4 to 55/41/4.

| Item | Rarity | Does | Feeds |
|---|---|---|---|
| Maple Tap | C | every 7th fruit Sticky | Sweet Tooth |
| Sugar Maple | C | every 10th fruit Candied: +40 points on its merge | any |
| Cherry Orchard | C | Cherries twice as often | Nursery, Small Fry, Playground |
| Mushroom Ring | C | every 12th drop mouldy | Blue Cheese, Fondue |
| Frost Pocket | C | every 10th drop freezes for 3 s | Ice Sculptor, Fondue |
| Wind Sock | C (needs Slingshot) | throws 25% further | Ricochet, Pinball |
| Grafting Vine | U | every 12th fruit a Wildcard | Wild Card, Masquerade (no Joker Seed needed) |
| Gunpowder Tree | U | every 9th fruit a Boom fruit | the bomb charms (no Fireworks needed) |
| Treat Tree | U (needs a pet) | every 8th fruit a Treat: pets eat it first, +1 XP | pet levels |
| Double Blossom | U | every 10th drop comes with a free copy | combo, small fruit |
| Spark Bush | U | every 8th fruit Charged: its merge gives every tool +1 | tools, Stage Fright |
| Money Tree | U | every 10th fruit carries a coin | economy, Compound Interest |
| Volunteer Seedlings | U | every 8th fruit one size below the best-seeded size | seeds, Harvest Moon |
| Termite Mound | U | every 12th fruit Brittle: crumbles 6 s after landing | Bonfire, Demolition, Compost |
| Tropical Breeze | U | every 20th fruit a Pineapple | Tiki Bar, Tropical Punch |
| Firefly Glade | U | every 6th fruit Glows: its merge always continues the combo | Finisher, Drumroll, Domino |
| Sinkhole | U | every 8th drop Heavy | Low Tide, Floor Show, Ballast |
| Seed Rain | U | every 6th fruit a Cherry or Strawberry | small fruit, Tiny Army |
| Gourd Vine | R | every 15th fruit a Pear | big fruit, Skyline |
| Golden Apple Tree | R | every 12th fruit a gold Apple | gold, big fruit |

### Shop and crates
- 5 charm slots in the shop (was 3), 6 with Bigger Shelf. The rare chance per slot goes from 4% to 2.4%, so rares offered per run stay at about 2.9. With the pool at about 52 commons and 79 uncommons, per-item offer rates come back to today's.
- Shop crates offer a ready fusion as their first pick, like boss crates: the Charm Crate a charm fusion, the Tool Crate a tool fusion, the Seed Crate a fusion with a seed half (Seed Vault, Greenhouse, Bloom, Honeycomb, Harvest Festival). Fusions free a slot, so getting them sooner eases slot pressure.
- Build steering (×2 weight on build-mates, like fusion steering) was the other option. Not built: 5 slots chosen instead.

### Editions (the user's idea, Balatro's foil and holographic)
Any charm, Orchard item or tool can come with an edition, rolled on shop and crate offers. Bonuses are passive and count towards every merge's score while the item is held and working (The Thief's switched-off charms lose it).
- **Candied** (the foil): +15 points on every merge. Sugar-glaze sheen. 2% of offers (4% until v1.47.2), +2 to the price.
- **Juiced** (the holographic): +1.5 Mult. Rainbow shimmer. 0.8% of offers (2% until v1.47.2), +3 to the price.
- **Ambrosia** (the polychrome, v1.48): ×1.5 Mult, joins the × product. Pale gold glow with drifting sparkles. 0.3% of offers (about 0.6 seen in a full run), +5 to the price. Legendaries never carry an edition.
  Bot check (v1.48, new bot kept out of the repo, weaker than the v1.39 one: aims at the lowest uncovered match, else the lowest column beside a size ±1, 75 frames a drop, buys ×Mult then +Mult charms, seeds 4 to 7, Charm Pouch, Seed Bag, Hot Sauce, Fertiliser, up to 3 rerolls at 14+ coins, no tools bought. Ripeness 1, Classic Jar, 100 runs each, wins ±4 points): no item 1% (depth 5.59). Juicer 3% (6.24), Juiced 11% (6.72), Ambrosia 17% (7.04). Tip Jar 3% (5.43), Ambrosia 12% (6.24). Limbo 20% (6.97), Ambrosia 40% (7.64). Ambrosia is about 1.5 times what Juiced adds on the same item and doubles a strong rare.
The point is to make a player take an item they would pass on. v1.47.2: the rates were set per offer when the shop held 3 charms. With 8 offers a shop (5 charms, 1 Orchard item, 2 tools) plus rerolls and crate picks, a full run showed about 8 Candied and 4 Juiced, and Juiced turned up more often than a rare charm (0.16 a shop against 0.12). Cut to 2% and 0.8%: about one Candied every 6 shops and 1.5 Juiced a full run. Bonuses unchanged. A fusion keeps the better edition of its halves (Ambrosia over Juiced over Candied). Sell value includes the edition's price.

### Pet levels (Vampire Survivors)
A pet gains 1 XP per jar cleared while held and 1 per 5 actions (meals, pollinations, ladybird hops). Levels at 2, 5, 9 and 14 XP (Lv1 to Lv5). Selling loses the level. Kept in the charm (`v` style field), no save bump. Level pip on the slot, sound and flash on level-up. Every pet at Lv5 also gives ×1.25 Mult (the ×Mult pets lack, earned over time like Snowball). Lv5 effects change how a pet behaves and never copy a fusion (Butterfly Garden's ×4 pollen, Feeding Frenzy, Truffle Hunt's coin). A fusion keeps its pet's level.

| Pet | Lv1 | Lv5 |
|---|---|---|
| Caterpillar | size ≤3 every 5 drops, 45 pts | size ≤4 every 4 drops, 70 pts |
| Mole | size ≤4 every 6 drops, 40 pts | size ≤5 every 4 drops, 65 pts |
| Hedgehog | size ≤6, at most every 3 drops | size ≤7, at most every 2 drops |
| Busy Bee | every 4 drops, 3 at a time | every 3 drops, 5 at a time, pollen survives one merge |
| Ladybird | ×2 | ×2.5 and a second ladybird |

Optional later: evolutions (a Lv5 pet plus a set charm becomes its fusion at the next crate without the other half).

### New items (C common, U uncommon). 24 C, 34 U
Checked against the pool on 18 Nov for crossovers. Fourteen first ideas clashed and were replaced (Powder Keg/Fireworks, Leftovers/Pet Treats, Cherry Picker/Cherry Pit, Pocket Change/Scratch Card, Swarm/Hoarder, Gold Dust/Alchemy, Aftershock/Cyclone, Overclock/Stage Fright, Corner Pocket/Wallflower, Bank Shot/Trick Shot, Mulch/Abacus, Spare Battery/Battery, Jam Jar/Jam, Hot Hands/Quick Hands).

- **Bombs**: Short Fuse C (Boom fruit go off on landing, +10 per fruit hit), Shrapnel C (blasts 50% further), Demolition C (+3 points to every merge per fruit destroyed this jar), Zest Bomb U (Boom fruit only hit Citrus, each gives +0.3 Mult for the jar), Bloom Bomb U (Boom fruit grow what they hit one size instead, those score half on their next merge), Chain Blast U (a fruit a Boom destroys has 1 in 3 to explode too).
- **Wildcards** (new special fruit: merges with any size, makes one size up from the bigger, scores half): Joker Seed U (every 10th fruit is a Wildcard), Wild Card C (Wildcard merges score full), Masquerade U (Wildcards count as every family).
- **Pets**: Pet Collar C (XP ×2), Doggy Bag C (each meal +0.1 Mult for the jar), Pollen Count C (+0.5 Mult per pollinated fruit in the jar), Truffle Hunt C (each Mole meal pays 1 coin), Well Fed U (after 3 meals in a jar, ×2 Mult for the rest of it), Pack Leader U (×1 Mult, +0.25 per pet held), Cross-Pollination U (a pollinated merge levels its size's seed, once per jar).
- **Small fruit**: Pip Squeak C (merges making a size 2 nudge nearby fruit apart), Piggyback C (the fruit Rewind or Swap puts back is gold 1 in 4), Kindling U (merges making size 2 or 3 give +1 tool charge, once per drop), Nursery U (+0.25 Mult per Cherry and Strawberry in the jar, Cherry merges ×2).
- **Big fruit**: Big Break C (the first size 7+ merge each jar ×3 Mult), Ballast C (Apples and up sink faster and push harder), Skyline U (×1, +0.25 per different size 6+ in the jar), Landslide U (making a size 8+ settles the pile and gives +2 Mult for the jar).
- **Combo**: Finisher C (the last merge of a combo +25 points per merge in it), Rapid Fire C (three drops within 2 s, the third +20 points), Domino U (a combo of 4+ gives 1 drop back), Drumroll U (every combo of 3+ gives +0.2 Mult for the jar).
- **Seeds**: Compost Bin C (a seed level costs 1 less per fruit destroyed this jar, up to 3), Harvest Moon U (the first time each jar you make a size with seed level 3+, ×3), Seed Bank U (seed prices stop rising after level 3).
- **Gold**: Gold Rush C (the first gold merge each jar pays 3 more), Gold Plating U (gold fruit never count as over the line), Gold Standard U (+0.1 Mult per coin earned from gold this run).
- **Tools**: Jump Start C (the first merge each jar gives every tool +2 charge), Tremor C (Shake and Rumble give +1 charge to the other tools), Recycler U (a tool used at full charge refunds 1), Toolsmith U (targeted tools can be used twice, at 1.5× the charge).
- **Position and rocks**: Floor Show C (floor merges +15 points), Balcony C (merges above the gold line +40 points), Pebble Polish C (each rock touching a merge +15), Centre Stage U (middle third ×2 Mult), Geode U (a rock touched by 3 merges cracks into a gold fruit).
- **Families**: Citrus Squeeze C (Citrus merges +1 tool charge), Tropical Punch C (Pineapple merges pay 3 coins), Berry Bowl C (Berry merges in a combo +20 points), Fruit Salad U (a combo with 3 families ×3 on its last merge), Orchardist U (+0.5 Mult per Orchard item held).
- **Economy and chance**: Tip Jar C (+1 coin every 10 merges), Loose Change C (selling a charm gives 2 more), Compound Interest U (+0.05 Mult per coin of interest this run), Double or Nothing U (each merge 1 in 2 ×2 Mult, else ×0.75).
- **Boss counters**: Blue Cheese U (mouldy fruit merge with each other at ×2), Ice Sculptor U (fruit that were frozen ×2 on their next merge), Sweet Tooth C (Sticky fruit +20 points when they merge).
- **Throwing**: Lob C (thrown fruit fly higher and land 0.5 s later).

Pack Leader, Skyline and the Lv5 pet ×1.25 break the "no unconditional ×Mult below rare" rule on purpose, each earned or gated. Bot-check them.

### New fusions (22)
New + new: Cluster Bomb (Shrapnel + Chain Blast), Citrus Blast (Zest Bomb + Citrus Squeeze), Big Bang (Bloom Bomb + Landslide), Full Deck (Joker Seed + Wild Card), Carnival (Masquerade + Fruit Salad), Alpha (Pack Leader + Pet Collar), Feast (Well Fed + Doggy Bag), Gold Digger (Truffle Hunt + Gold Rush), Honeycomb (Pollen Count + Cross-Pollination), Playground (Nursery + Kindling), Skyscraper (Skyline + Big Break), Avalanche (Domino + Drumroll), Harvest Festival (Harvest Moon + Seed Bank), Fort Knox (Gold Plating + Gold Standard), Workshop (Recycler + Toolsmith), Amphitheatre (Centre Stage + Floor Show), Crystal Cave (Geode + Pebble Polish), Hedge Fund (Compound Interest + Tip Jar), Fondue (Blue Cheese + Ice Sculptor).
New + existing: Grand Finale (Finisher + Crescendo), All In (Double or Nothing + Lucky Clover), Catapult (Lob + Curveball).
Each is about both halves plus a bit. Still without a recipe: Short Fuse, Demolition, Wild Card, Ballast, Rapid Fire, Compost Bin, Jump Start, Tremor, Balcony, Tropical Punch, Berry Bowl, Loose Change, Sweet Tooth, Pip Squeak.


## Bot pass for the pool expansion (v1.47.1, 18 Nov)

Run once at the end of the expansion, on the user's call. Bot rebuilt the same way as "Tool bot and v1.39 fixes" (kept out of the repo): 33-column aim (about 200 on a fresh jar, like before; it now pre-flips its aim under The Mirror), the same tool policy, Classic Jar, Ripeness 1. Its buyer values a charm or seed by how much it raises the score of a typical merge for sizes 2 to 8, leans 1.3× towards ×Mult charms like buyer B, takes the Orchard items buyer B took, sells its weakest charm for one clearly better, and never takes a crate pick worth nothing to it. The same bot was run on v1.42 (just before the expansion) and on main, so its quirks cancel out.

| Build | Runs | Wins | Depth |
|---|---|---|---|
| v1.42 | 800 | 25.6% | 7.09 |
| v1.47 | 1,100 | 21.6% | 7.03 |

The gap is about 2 standard errors and depth is the same: no real change in power. A small drop would fit the bigger pool thinning out this bot's best buys.

One item given at the start, 50 runs each (±6 points), confirmed at 150 (±3.7) where marked. No item: about 22%. Targets as before: commons and uncommons 20 to 30%, rares 25 to 35%, nothing above 40% (fusions may sit higher).

- **Pets now carry a run**, which was the point: Pet Caterpillar 35.3% (150; was 21.7% before levels), Mole 24.7% (150), Busy Bee 16%. With the Caterpillar: Pet Collar 34%, Doggy Bag 32%, Well Fed 28%, Pack Leader 36%, Demolition 38%, Feast 46%. Bee: Pollen Count 26%, Cross-Pollination 28%. Mole: Truffle Hunt 30%. The Caterpillar sits at the top of the band; watch it in human play before touching it.
- **Editions**: Juiced Juicer 38% (150) against a plain Juicer 28%; Candied Honey Pot 44% (150) against Honey Pot 28% (150). Candied cut from +15 to +10 points: 32.7% (150). Juiced left at +1.5. Both only turn up on 2 to 4% of offers.
- **Fusions**: Feast 46%, Skyscraper 38%, All In 32% (150), Grand Finale 32%, Hedge Fund 30%, Amphitheatre 28%.
- **Charms at or above the line**: Centre Stage 32%, Domino 30%, Drumroll 30%, Recycler 28%, Pip Squeak 28%, Golden Berry 28%, Double or Nothing 26.7% (150), Ballast 26%, Finisher 26%, Pay Dirt 26%, Nursery 24%, Compost Bin 24%, Jump Start 24%, Tremor 24%, Balcony 22%. Lucky Clover for comparison 20% (150).
- **Low for this bot, and why**: Rapid Fire 14% (it drops every 1.2 s, so 3 drops never land within 2 s), Joker Seed alone 14% (half points; with Wild Card 28%), Kindling 12% and Toolsmith 18% (the bot's tools are worth little to it), Big Break, Landslide, Skyline and Tropical Punch 16 to 18% (the bot rarely makes size 7+ fruit early), Pebble Polish 14% and Geode 10% (with Rock Garden, which alone drops it to 8%), Citrus Squeeze, Berry Bowl, Fruit Salad, Tip Jar, Compound Interest, Gold Plating 16 to 20%. Gold Standard with Prospector 44% = Prospector alone 44%: the bot earns too little gold for it to show.
- **Orchard, given at the start**: Volunteer Seedlings 34%, Golden Apple Tree 32%, Money Tree 29.3% (150), Seed Rain 28%, Sugar Maple, Frost Pocket, Grafting Vine, Double Blossom, Termite Mound 22%, Spark Bush, Firefly Glade 20%, Maple Tap 18%, Mushroom Ring, Treat Tree (no pet), Gourd Vine 16%, Cherry Orchard, Tropical Breeze, Sinkhole 14%, Gunpowder Tree 10% (the bot can not play Boom fruit, like Fireworks).
- **Not measured**: the bomb charms (the bot can not play Boom fruit), the boss counters (they need their boss), throwing (the bot never throws), Ripeness above 1, award difficulty.
