Prioritized:
All Shaman Nodes
Weapon slot icon
Full Id editor
All Shaman Aspects
Conflicts
    separate SP into calculated and custom
Slider multipliers
Finish powders
    Specials
    Neutral Conversions
All nodes
Aspects


Eventual:
Fixes:
improve build linking
Optimize the images https://websemantics.uk/tools/image-to-data-uri-converter/
Images for other trees aren't loaded until the weapon switched, 
    if the user went offline, they aren't able to render
Shaman -1 melee damage per attack.
sessionStorage for things that aren't shared between builds
    Tree
    Aspects
    Custom SP
localStorage for user preferences
Attack speed modifiers don't have an effect.
Slot images being 16x16 instead of 18x18
Make ability effects tied to the source instead of being all checked for each refresh
Some buffs overriding or adding instead of all applying multiplicatively
Proficiencies
    Test if their damage is additive with %s
    Test if their other effects add or multiply
Let items be removed from the item database
Verify how all damage and defense multipliers interact with each other
-SP
Make toggle ordering consistent
    Have all toggles from a tree be loaded on initialization of a tree, and just hidden until available
Test if Radiance applies per-item, or after summation.
Hide Haunting Memory effects if Flaming Tongue is taken.
Use templates.
Clicking the emoji on buffs doesn't toggle them

Settings:
Re-arrange GUI
Change color theme
customize how each stat displays
Add a christmas theme (selvs -> santas)

Features:
Locked node icons
Wynnability
    Update trees to match game
    Update format
    Add aspect creator
    Add ability equation interaction creator
Wynnmana
    Wynncycler
https://discord.com/channels/143852930036924417/296377212939010050/1366799330534756423
Offhand weapons
Consumables
Charms :>
Trinkets
Show the time factor of attacks that hit over a duration (ie. Blood Sorrow Total Damage (/4s))
Custom Identification modifications
Indicate partially filled powder slots
    Indicate if it has half a powder inputted, or an invalid powder
add back Str/Dex auto-balance button
a check for if the hpr is negative but can cancel and displaying that
Raid buffs
Lootrun Boons
Custom items
Crafted items
The equivalent mana gained from hpr, ls, and rally.
Complex export button, choose what optional categories to import
Import section button
Save builds locally and to/from a file.
ez tome selector when clicking the tome icon.
Tome shorthands
Jump Height in blocks, (assuming it's not linear, otherwise note it on the wiki)
Fallen effective mr from hpr/ls/rally
    https://forums.wynncraft.com/threads/the-health-regen-formula-has-been-reverse-engineered.292017/
    Outdated values, but remaining mana and remaining hp likely both have an effect.
UI Themes
    Neon
    Wynn (dusty grey, tan, popping colors)
    L*ght
    Custom
Improve
    Tome selector
    Aspect selector
        Grey out if useless
    Aspect name display
    Aspect Tier selector
Slot search functions
Rarity tinting
Tree relation logic
Alternate rounding options for people who don't care about .xx
    Full rounding, i.e. 10k, 25.2m, 2.5k
mana/ls displayed in the melee hover
add an "important" system like CSS, (maybe a proper customizable priority system if I'm feeling insane), to resolve load-order dependance.
    for now, just nodes -> aspects is enough
    just making Aspects/Aspect parts have dependancies is enough
    also, having a distinction between defining and modifying an ability will also work. (only have the display name and such on the source, etc.)
Overhealth
    Blood Sorrow
        Lifestream affecting Overhealth gain
    Paladin
    Trickster
Healing that ignores hef
    Sacrifical Shrine -hp
Find a better design for the buff toggles
grey out Aspects whose node requirement(s) aren't met.

Rich embeds if it's possible to generate them based on the provided build
    oEmbed?
tabindex: 0/-1;
pointer-events: none/initial;
build.heals.map((heal) => {});
ways to iterate over object:
for (let key in yourobject) { console.log(key, yourobject[key]);}; for (let [key, value] of Object.entries(yourobject)) { console.log(key, value); }; for (let key in yourobject) {if (yourobject.hasOwnProperty(key)) {console.log(key, yourobject[key]);}} also: https://stackoverflow.com/questions/14379274/how-to-iterate-over-a-javascript-object

https://api.wynncraft.com/v3/ability/map/shaman
https://api.wynncraft.com/v3/ability/tree/shaman
https://api.wynncraft.com/v3/aspects/shaman
https://api.wynncraft.com/v3/item/database?fullResult

https://github.com/RawFish69/Nori/blob/main/src/web/js_global/item_rerolling.js

Use build.evaluate() for complex abstractions
    try to make it allow user input without being a security flaw for equation sharing.
Shaman missing:
Shatter Healing
Bullwhip + Aspect
Exploding Puppets DPS
Invig
Commander
Hummingbirds + Aspect   
Powder Specials
    MaId Powder Specials
Attack Display