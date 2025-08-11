
# Focus

1. Get tree effect creator functional.
# Eventual

## Features

- Add Major Id Effects to Ability Effect Editor
- does Nature's Jolt combo with Frog Dance at all?
- sort powders in order of elements appearing
	- mention that powders get re-ordered with a little "i" hover note if it's relevant 
- powder special
- Add a question mark icon to `/item`, with hotkeys and any other info
	- maybe also a settings gear
	- maybe also a burger or kebab or something for extra doodads like roll chances
- +Napalm applies after +Fallout
- add spacing between id categories
- hpr canceling guide
	- hidden in a menu
	- also dynamically generated for a build when the need and possibility is detected 
- Clicking any item icon will generate a popup search/selector for that category
	- ctrl+click opens item page link
		- ctrl+shift+click opens `/search` with every param for that item pre-inputted
	- Items ((advanced) item search)
	- tomes (list)
	- aspects (list, marks out already selected, clicking a selected swaps positions)
- Separate input and display, minimize read/write from HTML
- WynnBuilder link conversion, explained [here](https://discord.com/channels/819455894890872862/823070794686529577/1393454270594154546) ([GitHub](https://github.com/wynnbuilder/wynnbuilder.github.io/blob/master/ENCODING.md))
- proper build linking
- WynnAbility integration
    - Add aspect creator
    - Add ability equation interaction creator
- WynnMana
    - WynnCycle
- add fancy aspect icons like [these](https://discord.com/channels/143852930036924417/296377212939010050/1366799330534756423)
- Offhand weapons
- More buffs
	- Consumables
	- Charms :>
	- Trinkets
		- Well of Power, etc.
	- Raid buffs
	- Loot-run Boons
- Custom Identification Modifications
	- Within possible range indicator
	- a check for if the hpr is negative but can cancel and displaying that
- Show the time factor of attacks that hit over a duration (i.e. Blood Sorrow Total Damage (/4s))
- Attack conversion display
- Indicate partially filled powder slots
    - Indicate if it has half a powder inputted, or an invalid powder
- add Str/Dex auto-balance button
- Custom items
- Crafted items
- Advanced export button, choose what optional categories to import
	- Save builds locally and to/from a file.
- Menu to import section of another build
- easy tome selector when clicking the tome icon.
- Tome short-hands
- Jump Height in blocks, (assuming it's not linear, otherwise note it on the wiki)
- Blood Pact effective Mana/Mana Regen from hpr/ls/rally
    - [hpr is complicated](https://forums.wynncraft.com/threads/the-health-regen-formula-has-been-reverse-engineered.292017/)
    - Outdated values confirmed by author
	    - remaining Mana and remaining hp likely both have an effect.
- UI Themes
    - Neon
    - Wynn (dusty grey, tan, popping colors)
    - Light
    - Customization
- Improve Tome selector
- Improve Aspect selector
	- Grey out if useless
	- Aspect name display
	    - Sexier Aspect Tier selector
- searching
	- slot search
	- ./search page
- mr/ls displayed in the melee hover
- a full dependency system should prevent attacks from showing up from an aspect whose node isn't selected
- Over-Health
	- Blood Sorrow
		- Lifestream affecting Over-Health gain
	- Paladin
	- Trickster
- "Healing" that ignores hef vs respects it
	- Sacrificial Shrine -hp
- Find a better design for the buff toggles
- more node textures based on the exact state
- Investigate Discord rich embeds
	- `oEmbed`?
	- `OpenGraph`?
- expanded keyboard support and functions
	- `tabindex: 0/-1;`
		- sets whether an element can be tabbed to
- make elements look clickable or not 
	- pointer-events: none/initial;
		- fill, `.svg` only, but proper circle detection
- Add MaIds to items
  - Strip the included HTML tags from the API's results (they don't even look right, i.e. with Hero)

- ways to iterate over object:	 
	- also: https://stackoverflow.com/questions/14379274/how-to-iterate-over-a-javascript-object
```javascript
for (let key in yourobject) {/*...*/}; 
for (let [key, value] of Object.entries(yourobject)) {/*...*/}; 
// necessity of if statement unknown, investigate.
for (let key in yourobject) {
	if (yourobject.hasOwnProperty(key)) {/*...*/}
};
```
- Use build.evaluate() for complex abstractions
    - try to make it allow user input without being a security flaw for equation sharing.
- Modified SP amount display+indication
	- save between build refreshes
- Use HTML templates?
- mobile support
## Post-release planned features
- Extended information inclusion
	- alternate tree options
	- slot alternatives
	- full builds (comparison mode)
	- folders of builds
	- author notes
## Settings
- Re-arrange GUI
- Change color theme
- customize how each stat displays
- Add a Christmas theme (Selvs -> Santas)

- rounding options
	- .xx
	- .xxxx\*n
	- x.
	- Full rounding, i.e. 10k, 25.2m, 2.5k
	- Selvs
		- Santas during December

## Fixes
- Images for other trees aren't loaded until the weapon switched, 
    - if the user went offline, they aren't able to render
- Shaman -1 melee damage per attack?
	- Study thoroughly
- `sessionStorage` to preserve build data within a tab
	- Tree, Aspects, Custom SP...
- Make ability effects tied to the source instead of being all checked for each refresh
- Proficiencies
	- Test if their damage is additive with %s
	- Test if their other effects add or multiply
- Verify how all damage and defense multipliers interact with each other
- Toggle ordering isn't consistent
    - Have all toggles from a tree be loaded on initialization of a tree, and just hidden until available
- Hide Haunting Memory effects if Flaming Tongue is taken.
	- Some should be persistent effects visible from any class
- Item Database should use internal name when updating
  - If an item is ever removed, keep all its data, but tag it is removed
    - Removed tag triggers an error
    - there's no handling for removed items right now
      - loop over all current items making sure they exist in the new
      - loop over all new items making sure they exist in the current
- Ability Tree shrinks a bit if the screen isn't wide enough
  - Set up the resizing logic
    - Nice and simple, all columns should have equal width
- Making images as backgrounds is less functional
- Figure out why html2canvas can't parse punscake items