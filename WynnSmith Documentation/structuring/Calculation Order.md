# Attack damage:
1. Weapon and armour ids are added together
2. Radiance multiplies most ids by 1.2 if active
3. Other buffs are added
	1. Consumables
	2. External buffs such as Raid and Lootrun boons
	3. Armour special %s
		1. Ignored by indirect damage sources
	4. Skill point %s
	5. Powder base damage is added
4. Base Damage Conversion:
	1. Base damage values are multiplied by the neutral conversion % retaining their type
	2. Base damage is summed and multiplied by each elemental conversion, converting to that type.
5. Raw Damage Conversion:
	1. Only applied if its given type is present in the base conversion
	2. If it's elemental/damage, then it's split across all non-zero elements in the same ratio as they appear in the base conversion.
6. Powders convert neutral base damage into their element
7. damage percents apply
8. Elemental Mastery Nodes
	1. Only affects non-zero post-conversion elements
9. Spells have their base damage multiplied by the weapon's **base** attack speed
10. raw Damage is added to base damage
11. Damage multipliers
	1. Does not apply to  Nightcloak Knife, Violent Vortex, Twisted Tether, Arrow Bomb Recoil Damage, Exploding, Thorns, Reflection, and Pet Damage.
		- Not Even affected by Str/Dex?
	2. Melee DPS specifically is multiplied by attack speed
	3. Strength/Dexterity+Crit Bonus
	4. Proficiencies
	5. Vulnerability, Damage Bonus, and all other damage multipliers.
# Spell Cost:
1. Take the base cost of the spell
2. Multiply by the Intelligence Spell Cost modifier
	1. 1 - ( 0.5 \* ( `intelligenceMultiplier` / `maxSPMultiplier` ) )
3. Add the raw spell cost identification
4. Multiply by the percent spell cost identification
	1. 1 + x%
5. Add tree cost modifiers
6. Set to the max of itself and 1
7. Apply Mask multipliers


$$
\sum_{n=0}^\infty(\frac 1{n!}-4\frac{(-1)^n}{2n+1})
$$
