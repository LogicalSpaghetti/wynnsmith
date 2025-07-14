
# Focus

- Alternate between something computational, and something visual.

1. Dynamic Weapon icon swapping 
2. All Shaman Nodes
	- Write detailed explanations of each node as I go
3. Powder eledefs
4. Overhaul Aspect Selector
5. Neutral Conversions
	- not removing neutral?
6. Powder Specials
	- Weapon
	- Armour
	- MaId
7. Build validation
	- Equip Order
		- Add Skill Points to Build
	- Set exclusions
8. Set Bonuses
	- Find a good source for this
9. Attack Display
10. Weapon slot icon
11. Full Id editor
12. All (Shaman) Aspects
13. Slider multipliers
14. All nodes
15. All Aspects
16. Attack Speed id
17. Item database
	- Ensure items are removable
# Eventual

## Features

- Separate input and display, minimize read/write from HTML
- Wynnbuilder link conversion, explained [here](https://discord.com/channels/819455894890872862/823070794686529577/1393454270594154546)
- proper build linking
- WynnAbility integration
    - Add aspect creator
    - Add ability equation interaction creator
- WynnMana
    - WynnCycler
- add fancy aspect icons like [these](https://discord.com/channels/143852930036924417/296377212939010050/1366799330534756423)
- Offhand weapons
- More buffs
	- Consumables
	- Charms :>
	- Trinkets
		- Well of Power, etc.
	- Raid buffs
	- Lootrun Boons
- Custom Identification Modifications
	- Within possible range indicator
	- a check for if the hpr is negative but can cancel and displaying that
- Show the time factor of attacks that hit over a duration (ie. Blood Sorrow Total Damage (/4s))
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
- a full dependency system should prevent attacks from showing up from an aspect who's node isn't selected
- Overhealth
	- Blood Sorrow
		- Lifestream affecting Overhealth gain
	- Paladin
	- Trickster
- "Healing" that ignores hef vs respects it
	- Sacrifical Shrine -hp
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

- ways to iterate over object:	 
	- also: https://stackoverflow.com/questions/14379274/how-to-iterate-over-a-javascript-object
```javascript
for (let key in yourobject) {...}; 
for (let [key, value] of Object.entries(yourobject)) {...}; 
// necessity of if statement unknown, investigate.
for (let key in yourobject) {
	if (yourobject.hasOwnProperty(key)) {
		console.log(key, yourobject[key]);
	}
};
```
- Use build.evaluate() for complex abstractions
    - try to make it allow user input without being a security flaw for equation sharing.
- Modified SP amount display+indication
	- save between build refreshes
- Use HTML templates?
- if an ability tree row is completely connections, mark it
- any marked row following a marked row should be hidden
- mobile support
### Settings
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
- Clicking the emoji on buffs doesn't toggle them
