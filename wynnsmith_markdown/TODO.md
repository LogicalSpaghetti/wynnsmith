# Focus
1. Get basic conversions working with the effect builder.
	1. After detecting all effects, first go through, merging them into proper effects, i.e. adding up conversions
2. Effect Application order
	1. (within category)
3. Once new conversion structure is done, get offhand computation working
	1. have an array where each entry is the data for a given weapon
		1. for display, just do grab `[0]` for now
# General
### Feat
1. Switch to a functional model instead of using `build` for everything
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
1. only add validly selected nodes to build
2. powder specials
	1. Armour powder specials don't apply to indirect damage
3. +Napalm applies after +Fallout
4. Embed Search in a popup
	1. Clicking the icon next to a slot opens the search
		1. Ctrl+Click or a button in that popup both link to the `/item` page
5. Split trigger, read, clean, permute, and write into discrete steps in the logic flow.
6. WynnBuilder link conversion
	1. explained [here](https://discord.com/channels/819455894890872862/823070794686529577/1393454270594154546) ([GitHub](https://github.com/wynnbuilder/wynnbuilder.github.io/blob/master/ENCODING.md))
7. Build Linking
8. WynnMana
	1. Wynn-Cycle
9. Offhand weapons
10. Consumables
11. Charms :>
12. Trinkets
	1. Well of Power, etc.
13. Raid buffs
14. Lootrun Boons
15. Id Modifier
	1. notes range available given the build
16. Attack details
17. Attack grouping
18. Sub-attacks
19. Str/Dex auto-balance button
20. Crafted Items
21. Custom Items
	1. Modified items
22. Advanced export
	1. select specific sections to save
	2. Save to/read from file or local storage
23. Menu to import section of another build
24. Tome short-hands
25. Blood Pact effective Mana/Mana Regen from hpr/ls/rally
    1. [hpr is complicated](https://forums.wynncraft.com/threads/the-health-regen-formula-has-been-reverse-engineered.292017/)
    1. Outdated values confirmed by author
        1. remaining Mana and remaining hp likely both have an effect.
26. Over-Health
    1. Blood Sorrow
        1. Lifestream affecting Over-Health gain
    2. Paladin
    3. Trickster
27. "Healing" that ignores hef vs respects it
    1. Sacrificial Shrine -hp
28.  Use build.evaluate() for complex abstractions
    1. try to make it allow user input without being a security flaw for equation sharing.
29. Modified SP amount display+indication
    1. save between build refreshes
30. Make external toggles a collapsed tab, and include many more effects.
31. Indirect damage
	1. Ignoring armour powders, strength/dexterity, and all multipliers
32. Speed
	1. Speed I (Trinkets)
	2. Speed II (Windy Feet)
	3. Speed III(?) (Stormy Feet)
	4. Affects bps
33. Toggle for duration factoring for buffs
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
### Fix
1. use Object.freeze() on all database objects
2. Data isn't saved if a tab gets unloaded
	1. use `sessionStorage`
3. Toggle order isn't consistent
4. Handle items removed from database
5. Tree propagation is wrong, once it's gone down, it can't go left or right
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
### Test
1. Does Frog Dance proc Nature's Jolt?
2. Does -hpr proc Twisted Tether?
3. Shaman -1 melee damage per attack?
4. Verify that Damage Bonus and Vuln don't self-stack
5. Verify that def modifiers stack
6. Is Twisted Tether affected by Vengeful Spirit, Lunatic, or any other buffs?
7. Is raw damage affected by attack speed?
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
        1. Santas during December
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
	1. grey out useless aspects given tree
5. `html2canvas` can't handle the dynamically colored item text shadows
6. untradable
# Effect Builder
### Feat
1. Aspects
2. Major Ids
3. Powder Specials
4. NOT requires
	1. i.e. Haunting Memory toggles when Flaming Tongue is taken.
# Notes (move)
1. ways to iterate over object:
    1. also: https://stackoverflow.com/questions/14379274/how-to-iterate-over-a-javascript-object
```javascript
for (let key in yourobject) {/*...*/}
for (let [key, value] of Object.entries(yourobject)) {/*...*/}
// necessity of if statement unknown, investigate.
for (let key in yourobject) {if (yourobject.hasOwnProperty(key)) {/*...*/}}
```
# Post-release planned features
1. Extended information inclusion
    1. alternate tree options
    2. slot alternatives
    3. full builds (comparison mode)
    4. folders of builds
    5. build author notes
    6. mobile support
