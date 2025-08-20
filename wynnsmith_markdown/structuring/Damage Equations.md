Attack damage calculation:
1. Weapon and armour ids are added together
2. Radiance multiplies most ids by 1.2
3. Other buffs are added
	1. Consumables
	2. External buffs such as Raid and Lootrun boons
	3. Armour special %s
		1. Ignored by indirect damage sources
	4. Skill point %s
4. Powder base damage is added
5. Base Conversion:
	1. Base damage values are multiplied by the neutral conversion % retaining their type
	2. Base damage is summed and multiplied by each elemental conversion, converting to that type.
6. Raw damage Conversion:
	1. Only applied if its given type is present in the final build
	2. If it's elemental/damage, then it's split across all non-zero elements in the same ratio as they appear in the base conversion.
7. Powders convert neutral base damage into their element
8. damage percents factored in
9. Elemental Mastery Nodes
	1. Only affects non-zero post-conversion elements
	2. needs more testing to determine:
		1. is the base from this affected by % ids, and/or the % from the node itself
		2. is the % from the node added to %s from ids
		3. Effect of weapon base attack speed
10. Spells have their base damage multiplied by the weapon's **base** attack speed
11. raw Damage is added to base damage
12. Damage multipliers
	1. Does not apply to  Nightcloak Knife, Violent Vortex, Twisted Tether, Arrow Bomb Recoil Damage, Exploding, Thorns, Reflection, and Pet Damage.
		- Not Even affected by Str/Dex?
	2. Melee DPS specifically is multiplied by attack speed
	3. Strength/Dexterity+Crit Bonus
	4. Proficiencies
	5. Vulnerability, Damage Bonus, and all other damage multipliers.