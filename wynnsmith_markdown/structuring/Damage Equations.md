Spell:
Attack damage calculation:
=>
Radiance multiplies most ids by 1.2x
=>
+Consus and other external buffs
+Tomes
=>
Powders add a bit of base elemental damage to their element
=>
For spells, the damage values are then multiplied by a value based on the weapon's **base** attack speed
=>
All damage values are multiplied by the neutral conversion % and retain their type.
the sum of all damage values (before the neutral scaling) is multiplied by any elemental conversions, and becomes that type.
=>
Powders convert a % of the neutral damage into their element, up to 100% of it.
=>
Masteries Node base values are added to any non-zero damage values.
Mastery multipliers are applied.
Proficiencies are applied, damage is multiplicative
=>
Armour Powder Specials add to ids as standard %s
All elemental damages are multiplied by their corresponding % multiplier
=>
Raw damage values undergo attack conversions, and are then added on.
    If the base damage post-conversion is zero for an element, raw doesn't apply for that element
        This applies to pre-power conversion ratios
=>
Apply Skill Points, Strength, Dexterity, and any other final multipliers.
