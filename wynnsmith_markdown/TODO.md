# Focus
1. Get basic conversions working with the effect builder.
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
1. powder specials
2. +Napalm applies after +Fallout
3. Embed Search in a popup
	1. Clicking the icon next to a slot opens the search
		1. Ctrl+Click or a button in that popup both link to the `/item` page
4. Split trigger, read, clean, permute, and write into discrete steps in the logic flow.
5. WynnBuilder link conversion
	1. explained [here](https://discord.com/channels/819455894890872862/823070794686529577/1393454270594154546) ([GitHub](https://github.com/wynnbuilder/wynnbuilder.github.io/blob/master/ENCODING.md))
6. Build Linking
7. WynnMana
	1. Wynn-Cycle
8. Offhand weapons
9. Consumables
10. Charms :>
11. Trinkets
	1. Well of Power, etc.
12. Raid buffs
13. Lootrun Boons
14. Id Modifier
	1. notes range available given the build
15. Attack details
16. Attack grouping
17. Sub-attacks
18. Str/Dex auto-balance button
19. Crafted Items
20. Custom Items
	1. Modified items
21. Advanced export
	1. select specific sections to save
	2. Save to/read from file or local storage
22. Menu to import section of another build
23. Tome short-hands
24. Blood Pact effective Mana/Mana Regen from hpr/ls/rally
    1. [hpr is complicated](https://forums.wynncraft.com/threads/the-health-regen-formula-has-been-reverse-engineered.292017/)
    1. Outdated values confirmed by author
        1. remaining Mana and remaining hp likely both have an effect.
25. Over-Health
    1. Blood Sorrow
        1. Lifestream affecting Over-Health gain
    2. Paladin
    3. Trickster
26. "Healing" that ignores hef vs respects it
    1. Sacrificial Shrine -hp
27.  Use build.evaluate() for complex abstractions
    1. try to make it allow user input without being a security flaw for equation sharing.
28. Modified SP amount display+indication
    1. save between build refreshes
29. Make external toggles a collapsed tab, and include many more effects.
### Fix
1. use Object.freeze() on all database objects
2. Data isn't saved if a tab gets unloaded
	1. use `sessionStorage`
3. Toggle order isn't consistent
4. Handle items removed from database
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
9. Use HTML templates?
10. background images are kinda mid
11. Ability Tree shrinks a bit if the screen isn't wide enough
### Test
1. Does Frog Dance proc Nature's Jolt?
2. Does -hpr proc Twisted Tether?
3. Shaman -1 melee damage per attack?
4. Verify that Damage Bonus and Vuln don't self-stack
5. Verify that def modifiers stack
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
