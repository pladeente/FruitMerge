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
| Chance | Lucky Clover, Snake Eyes, Scratch Card, Horseshoe, Four-Leaf Clover, The Mint | | | Fine |
| Combo | Chain Reaction, Hot Streak, Metronome, Wildfire | Blender, Cyclone | Tambourine | Fine |
| Timing in the jar | Early Bird, Photo Finish, Marathon | Free Sample, Double Down | Watering Can, Big Basket | Fine |
| Big fruit | Heavyweight, Melon Fever, Golden Touch, Rich Soil, Melon Mania | Ripen | Trellis | Fine |
| Economy | Piggy Bank, Savings Account, Fat Wallet, Coupon, Golden Touch, Scratch Card, Golden Goose, The Mint | Cash Out | Vault, Packed Lunch, Haggler, Ledger, Overtime, Signing Bonus, Back Road, Crate Key | Plenty |
| Tools | Juggler, Spark Plug, Showman, Overdrive, Crowd Pleaser, Encore, Battery, Dynamo, Headliner | all, Sleight of Hand | Tool Belt, Whetstone | Plenty |
| Destruction | Fireworks, Pet Caterpillar, Compost, Ashes, Volcano, Safety Net | Cherry Bomb, Sieve | Scrub | Fine |
| Aim | Bullseye, Lodestone, Sharpshooter | Lodestar, Swap, Rewind, Twin | | Fine |
| Full jar | Hoarder, High Wire | Anchor | Slow Fuse, Raised Rim, Spring Clean | Thin |
| Small fruit | Small Fry, Pip Collector, Bite Size, Pet Caterpillar, Hoarder, Crumbs | Sieve | Scrub | Filled, measured (v1.26, see Small fruit measurement) |
| Seeds | Abacus, Gardener, Seed Packet, Sprout | | Seed Bag | Seeds cut back in v1.23, see Seeds measurement. Needs play |
| Gold fruit | Magpie, Gold Leaf, Prospector, Alchemy | Midas, Golden Hand | Gold Scales | Filled, needs play |
| Physics and position | Bullseye, Clean Plate, High Wire, Wallflower, Low Tide | Shake, Whirl, Rumble, Lead Weight | | Better, still the most room to grow |
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
| Combo | none (Chain Reaction, Hot Streak are +Mult. Cyclone is a tool fusion) |
| Destruction | none (Compost is +Mult, the rest flat points) |
| Economy | none (Fat Wallet is +Mult) |
| Seeds | none (Abacus is +Mult) |
| Gold | none as a charm (gold fruit ×2 is a one-off, Magpie is +Mult) |
| Tools | Encore only |
| Aim, timing, chance, big fruit, small fruit, position, pets | have one or more |

**Direction (the user's call, not started):** fill these with new items, mainly fusions that pair pieces which plainly belong together, each giving the build a conditional ×Mult payoff. Keep to the fusion budget (both halves plus a bit: Smoothie was 2.35 times its halves before v1.23) and to Things to avoid (no unconditional ×Mult below rare). Two commons as halves means the fusion is ready in ~37% of runs by shop 9, so prefer a common + uncommon or two uncommons for the strong ones. Measure each against its halves held together before shipping.

**To do: Fat Wallet.** Not changed. ×3.0 at 20 coins, ×5.9 at 50, ×11 at 100 from one uncommon, and bots that stop spending end runs on 50 to 75 coins. Options: +0.05 Mult a coin, or a cap (say +4 Mult at 40 coins). Check Golden Hand (its fusion) at the same time.

## Legendaries (built, v1.29)

Five charms above rare, never sold. They are what makes the shop's Charm Crate worth its price, and a reason to look forward to a melon crate.

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
| Shatter | Tool, 4, charge 6 | Tap a rock: it becomes a fruit of the same size. An answer to The Quarry and Melon King's rock |
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

Sizes get names, with the number kept: Cherry (1), Strawberry (2), Grape (3), Mandarin (4), Orange (5), Apple (6), Pear (7), Pineapple (8), Peach (9), Rockmelon (10), Watermelon (11). Since v1.31 the Mandarin is the Lemon (4) (feedback: the sprite reads as a lemon) and the Watermelon is the Watermelon Queen (11), with a new sprite from the user. Mandarin and Rockmelon were the Australian names, on purpose. A single size is written "Orange (5)", a range stays numeric ("size 3 or smaller"). Touches item texts, seed labels and the Almanac. Keep names short where cards are small.

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

- Titles: a tag before the player's name, shown on the leaderboard. First choice for hard awards.
- Jar skins (8): one for a win with each starting jar (Pink Ceramic, Deep Glass, Velvet, Steel, Planks), Golden for Ripeness 4, Melon Rind for Ripeness 8, Crystal for a full Almanac.
- Backgrounds (7): one per final boss beaten (Throne Room, Orchard Sky, Midnight), The Deep for the depth 12 boss, Melon Patch for 10 Watermelons, Sunset for 10 wins, Notebook for half the Almanac.
- Fruit skins (3): Solid Gold (200 gold merges), Past It (25 mouldy fruit), Black and White (a depth 3 boss with no charms). Each is a colour ramp applied to the sprites by brightness, so they need no new drawings. Past It is brown, not green, so mould still shows on it.
- Sound sets (3): Chiptune (1,500 merges), Marimba (6,000 merges), Wood Block (50 crates). Only the merge sound changes.
- Almanac stamps: a dated seal on earned awards, and a completion bar. Half and full completion are awards.

Animated (v1.30), for the six that are hardest to earn, so a moving look is a mark of skill: Melon Rind (Ripeness 8), Crystal (full Almanac), Golden (Ripeness 4), The Deep (depth 12 boss), Sunset (10 wins), Black and White (a boss with no charms). A new look from a hard award should move too, one from a count of things done should not.

The lifetime numbers are guesses, not measured against real play. The jar frame is only 6 pixels wide, so skins read mostly through colour. Ideas not built: skins for the tool bar and HUD, a second sound per set (land, combo), animated fruit skins.

Normal-play awards can keep unlocking charms, tools and jars as now. Obscure awards should not lock gameplay content.
