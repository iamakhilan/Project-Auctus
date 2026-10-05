# Citadel Mechanics & Prestige Architecture

The Citadel serves as the core meta-progression layer in Auctus, translating consistent daily productivity into compounding game-wide passive buffs.

## Power Calculation Formula

Citadel Power accumulates dynamically based on aggregate player milestones:

$$\text{Power} = (15 \times \text{Completed Quests}) + (0.8 \times \text{Focus Minutes}) + (25 \times \text{Streak Days})$$

## Tier Progression & Multipliers

Each Citadel Tier increases XP yields across all activities and expands the player's maximum Energy Heart reservoir:

| Tier | Landmark Name | Unlock Threshold | Energy Cap | XP Multiplier | Special Perks |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **I** | Outpost Haven | Base (0 Power) | 5 Hearts | 1.0x | Base focus session yields |
| **II** | Bastion Outpost | 500 Power | 6 Hearts | 1.2x | +20% Quest XP and gold yields |
| **III** | Iron Vanguard | 750 Power | 7 Hearts | 1.4x | +40% XP and +1 heart reservoir |
| **IV** | Aether Archon | 1,125 Power | 8 Hearts | 1.6x | +60% XP and accelerated chest cooldowns |
| **V** | Apex Sovereign | 1,688 Power | 10 Hearts | 1.8x | Maximum prestige multiplier |

## Ascension Protocol

When Citadel Power reaches 100% of the current tier's threshold:
1. The ascension trigger activates in the Citadel View.
2. Triggering ascension consumes accumulated power, promotes the player to the next Citadel Tier, and awards 300 XP and 30 Gems.
3. The next tier's maximum power requirement scales by a factor of 1.5x.
