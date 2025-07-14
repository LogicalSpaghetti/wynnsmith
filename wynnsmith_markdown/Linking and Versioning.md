
For each version, changes to the tree are logged
when loading an old link, it applies all changes in reverse
every so often, log a full version of the tree
keep outdated information stored in a place that's only sent to the client if they try to load an old link

###### allowed link characters:
	alphaneumerics
		62 options
	-$_.+!*'(),
		source: http://www.faqs.org/rfcs/rfc1738.html
		11 options
		on discord
			"-" causes a newline
			"," at the end of a link gets excluded
		only "'" and "_" get included when double-clicked
			use for base_64

?

	version
	-slots, 2 chars per slot.
	-powders, * means the rest of an open slot is filled
	-tree, binary representing selected nodes
	-aspects, 5 slots, optional tiers appended with stars as filler
	-oTomes, one character per slot
	-k modified SP, cannot be negative, * added if it requires 2 digits to hold.

?

	v00.00
	-WWHHCCLLBBRRRRBBNN
	-pff*ff**f3fe
	-tTTTTTTTTTTTTTTTT
	-aAAAAA**23
	-oOOOOOOOOOOOOOO
	-kETWF*AA

Have a bunch of optional ways to make the link values more explicit

	?
	type of link character
		1ch
		build is S, used if I want to encode other things
	version
		12 bits
			if that's no longer enough
				use a character not part of base 64 to extend it
				or just change the link type character
	player level
		flag max level
		dynamic
	slot contents
		WHCLBRRBN
		dynamic length for each slot
		0 is an empty slot
		1 is a crafted item
		2 is a custom item
	powders 
		base 8
		0 for empty
		1-5 for etwfa
		6 for t3 of whatever's next
		7 for tier next of next-next
		length parsed based on the powder slots of the items(?)
			ceil(slots/6)
	aspects
		flag aspects included?
		1 bit for each aspect
			there are at most 18 aspects per class
		3 characters
			4 if more Aspects are ever added
	Tomes
		flag tomes included
		all tomes given an id in their category
		32 or less tomes per category
		9 characters to represent all slots
	modified SP
		flag unmodified SP
		7 bits each, 
		1 character per element
		some symbol means that it requires 2 characters instead of 1
	other nonsense
		flag for if it has other nonsense
		stuff like scroll buffs or whatever other insanity I want to add
		4 bit identifier for each type
	tree
		just propagate down
			add 1 each time a selected node is found
			add 0 otherwise, and don't repropagate
### Crafted Encoding

1. Crafting type
	- Implied in build linking
2. ingredients
	- different id system for each recipe type
	- some ings have multiple ids to keep links shorter