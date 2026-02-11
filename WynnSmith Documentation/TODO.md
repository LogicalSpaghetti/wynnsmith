
# Feature:
- Reformat all images as sprite sheets so they don't need pre-loading or `public/`
- Things like Ability Tree, Aspects, MaIds, Ultimates, etc. should be abstracted as a dependency that can almost be imported and exported from, that way them and anything else added later already has a system in place of mutual reliance.
- Re-add `tsc &&` to the build script once TypeScript has been made happy.

# Bug-fix:

# Move:

### Small
1. comparison needs:
	1. An input for the link, and a selector for offhand
	2. A display of the build's items if different
	3. a section for sliders 
2. to get the input data, either:
	1. generate from link
		1. string class
		2. flag write to all inputs
		3. flag 
	2. use classes like `input_1` to locate the correct elements to read from
	3. give both, along with flags for which to draw from
3. to get the build data, either:
	1. grab from input
	2. grab from two inputs, along with flags for
4. second build needs toggles and sliders
5. init should have flags passed in for all values directing it to take from primary or secondary build.
6. empty slots
7. cap offhands to 7
8. we need to store old version's section length variables too.
9. repurpose `getabilities.html` for Aspects
10. Test if Radiance affects Skill Points.
11. Detailed damage
12. Tome SP doesn't work
	1. calc added SP per-build after Radiance applies.
13. Dynamic node displays, (Archetype requirements, required ability)
	1. Archetype highlighting
14. Identification editing
15. Small Tome selector
	1. popup Zen-style text box when tab selected
		1. tabbing from there cycles through aspects/tomes by icon
		2. Escape or tabbing after the end closes and returns selection to the original element
16.  Add more than just abilities to the effect builder
17. Melee display DPS and per-hit.
18. + sign on negative spell costs
### Major
1. Build link generation/parsing
2. Build comparison
3. Selector popups (Tomes, Aspects)
4. Item search
# General
### Fix
1. Cursor tooltip overflowing screen.
### Visual
1. UI Themes
    1. Neon
    2. Wynn (dusty grey, tan, popping colors)
    3. Light
    4. Customization
# Smith
### Feat
1. Effects:
	1. Tree-independent effects
		1. Major Ids, Aspect (tiers), and powders as sources for effects.
	2. Heals variant
	3. Display
		1. Shift-spell
		2. Heals
		3. Hover details
		4. Toggle details
		5. Comparison to other build
		6. Sub-displays
			- Display per-hit along-side DPS by tagging a sub-display to do so
		- Health-for-mana
			- Blood Pact
	4. Slider
	5. Radiance
	6. Powder Specials
		1. Armour powder specials don't apply to indirect damage
	7. 
2. Data:
	1. Write Aspect descriptions
	2. Write Powder Descriptions
3. Build Encoding:
	1. Linking:
		1. Advanced linking
			1. Choose sections to link, only link one section
	2. Versioning:
		1. Updating old builds
		2. Changelog
	3. Local history:
		1. compress to link, if link is different from previous, add to history
		2. max history storage is a config that defaults to around 25
	4. Comparison:
		1. Compare to offhands, or to another build('s offhand)
4. Errors:
	1. Add error system
	2. Tree errors
			1. Not enough Skill Points
			2. Invalidly selected node
	3. Item errors
			1. Offhand types not matching
5. Stats:
	1. Stat value editor
	2. Effective health regeneration
	3. Extra id sources:
		1. Consumables
		2. Charms :>
		3. Trinkets
			1. Well of Power, etc.
		4. Raid buffs
		5. Lootrun Boons
6. Items:
	1. Crafted items
	2. Custom items
	3. Items modified within range
7. `notWynnData`:
	1. Move all data files into `notWynnData`
		1. in `WynnSmith` they should be minified together.
			1. All should be accessed from a unified database object
				1. i.e. `database.items`, `database.indexes.aspects`, `database.effects.major_ids`, `database.trees.shaman.abilities`, `database.powders.f6`, `database.indexes.items.helmet`, `database.player.max_level`
8. Tree:
	1. only add validly selected nodes to build
9. Embed Search in a popup
	1. Clicking the icon next to a slot opens the search
		1. Ctrl+Click or a button in that popup both link to the `/item` page
10. WynnBuilder integration: 
	1. link conversion
		1. explained [here](https://discord.com/channels/819455894890872862/823070794686529577/1393454270594154546) ([GitHub](https://github.com/wynnbuilder/wynnbuilder.github.io/blob/master/ENCODING.md))
11. WynnMana:
	1. Wynn-Cycle
12. Advanced export
	1. select specific sections to save
	2. Save to/read from file or local storage
13. Menu to import section of another build
14. Tome short-hands
15. Blood Pact health cost next to mana cost
	1. Generalize as a health-for-mana effect
16. Blood Pact effective Mana/Mana Regen from hpr/ls/rally
    1. [hpr is complicated](https://forums.wynncraft.com/threads/the-health-regen-formula-has-been-reverse-engineered.292017/)
    1. Outdated values confirmed by author
        1. remaining Mana and remaining hp likely both have an effect.
17.  Use build.evaluate() for complex abstractions
    1. try to make it allow user input without being a security flaw for equation sharing.
18. Modified SP amount display+indication
    1. save between build refreshes
19. Make external toggles a collapsed tab, and include many more effects.
20. Speed
	1. Speed I (Trinkets)
	2. Speed II (Windy Feet)
	3. Speed III(?) (Stormy Feet)
	4. Affects bps
21. Toggle for duration factoring for buffs
	1. For overriding
		1. loop through the buffs from highest to lowest
			1. multiply the damage by the multiplier and its up-time, and the percent of up-time remaining, (starts at 100%).
			2. divide the remaining up-time by the up-time of this multiplier.
		2. example:
			1. state:
				1. (Fortitude AB and VS)
					1. 40% damage buff with 66% up-time
					2. 30% damage buff with 50% up-time
					3. 20% damage buff with 100% up-time
				2. 100 damage attack
			2. calculation:
				1. new_damage += 100\*(1 + 40%)\*66%\*remaining_time
				2. remaining_time \*= 1 - 66%
				3. new_damage += 100\*(1 + 30%)\*50%\*remaining_time
				4. remaining_time \*= 1 - 50%
				5. new_damage += 100\*(1 + 20%)\*100%\*remaining_time
				6. remaining_time \*= 1 - 100%
					1. new_damage = 135
22. 
23. Blockers that kill children properly
24. -Skill Point modifier warning
25. Set Bonuses aren't accounted for when calculating SP
	1. to each item, assign an array called set which is an array of the SP gained for each tier
	2. between recursions, pass a list of sets and the number of members.
### Fix
1. Attacks aren't ordered
2. Effect toggles aren't ordered
3. use Object.freeze() on all database objects
4. Data isn't saved if a tab gets unloaded
	1. use `sessionStorage`
5. Handle items removed from database
6. Block offhands from other classes
7. Balance SP can exceed 100 assigned
8. When reading from HTML, the slot order is assumed instead of being read.
	- within an "Items" object, the order should always be consistent and empty slots should always be indicated, that way it can easily encode and decode without worrying about order.
9. Assassin Aspect icon is the generic Aspect icon instead of the purple one it's meant to have.
10. Attack Speed for spells is base attack speed
### Visual
1. make elements look clickable or not
    1. pointer-events: none/initial;
        1. fill, `.svg` only, but proper circle detection
2. expanded keyboard support and functions
    1. `tabindex: 0/-1;`
        1. sets whether an element can be tabbed to
3. better powder input, (indicate if more slots available, color...)
	1. show error for invalid powders
4. hpr canceling guide
	1. dynamically generated for a build when the need and possibility is detected
5. consider fancy aspect icons like [these](https://discord.com/channels/143852930036924417/296377212939010050/1366799330534756423)
6. Jump Height in blocks, (assuming it's not linear, otherwise note it on the wiki)
7. Find a better design for the buff toggles
8. Investigate Discord rich embeds
    1. `oEmbed`?
    2. `OpenGraph`?
    3. Consult father
9. Use HTML templates?
10. background images are kinda mid
11. Ability Tree shrinks a bit if the screen isn't wide enough
12. Effect Toggle suffixes like this: ![[Active Boosts Example.png]]
13. Slot icons next to items in the equip order
### Test
1. Does Frog Dance proc Nature's Jolt?
2. Does -hpr proc Twisted Tether?
3. Shaman -1 melee damage per attack?
4. Verify that Damage Bonus and Vuln don't self-stack
5. Verify that def modifiers stack
6. Verify that "indirect damage" isn't affected by ***any*** multipliers
	- Is Twisted Tether affected by Vengeful Spirit, Mask of the Lunatic, Eldritch Call, Str/Dex, or Skill Point %s?
7. Is raw damage affected by attack speed?
8. +Napalm applies after +Fallout
9. Trickster: Confused enemies taking 30% more thunder damage?
	- Other similar effects, hopefully just ele%s
10. Does Finality increase the damage of the first hit?
11. Verify that the Finality equation is working
12. Does Radiance affect Fluid Healing
	- Test with Mage since it doesn't have health drain
# Settings
1. Ability to re-arrange GUI
2. Change color theme
3. customize how each stat displays
4. Add a Christmas theme (Selvs -> Santas)
5. rounding options
    1. .xx
    2. .xxxx\*n
    3. x.
    4. Full rounding, i.e. 10k, 25.2m, 2.5k
    5. Selvs
        - Santas during December
# Search/Item
### Feat
1. Search
	1. Items
	2. Tomes
	3. Aspects
2. Add a question mark icon to `/item`, with hotkeys and any other info
	1. maybe also a settings gear
	2. maybe also a burger or kebab or something for extra doodads like roll chances
3. hpr canceling guide
4. Dynamic Search that works within the context of a build.
	- grey out useless aspects given tree
5. `html2canvas` can't handle the dynamically colored item text shadows
6. untradable
# Effect Builder
### Feat
1. Effect parents
	1. Aspects
	2. Major Ids
	3. Powder Specials
2. Effect types
	1. Variant sums
	2. Attack Displays
		1. (ordered) damages sums
			1. array pointing to per-spells
		2. per-spell damage displays
		3. heal
		4. spell
	3. Radiance
	4. Sliders
	5. Cost modifiers
	6. Self-damage
		1. Sacrificial Shrine health drain
	7. Over-health?
	8. Identification provider
	9. Identification for identification
	10. Id for healing
		1. Fluid healing
3. Effect toggles disabling each other
4. External toggles
	1. Take from other trees
5. allow for selecting (attack) ids instead of manually typing them in
6. Sort effects by the average of their parent locations or something
### Effect Examples:
1. `Haunting Memory`
	1. Blocks `Uproot`'s conversion when taken
	2. Only blocks the conversions, display and such. The effect Flaming Tongue has with it still applies.
2. `Arrow Hurricane`
	1. a "variant" of `Arrow Storm`, tripling its damage
3. `Backstab`
	1. a new "conversion" which blocks `Multihit`
4. `Commander`
	1. A 3% slider multiplier linked to `Melee` and the puppet count slider.
# Post-release planned features
1. Extended information inclusion
    1. alternate tree options
    2. slot alternatives
    3. full builds (comparison mode)
    4. folders of builds
    5. build author notes
    6. mobile support
    7. Full damage equations dynamically generated with labels
	    1. [MathQuill](http://mathquill.com/)
