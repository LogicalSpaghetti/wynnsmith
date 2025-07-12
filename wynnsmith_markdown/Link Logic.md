allowed characters:

	alphaneumerics
		62 options
	-$_.+!*'(),
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
	version
		v00.00
	link type character
		default is b, used if I want to encode other things
	slot contents
		WWHHCCLLBBRRRRBBNN
	powders
		base 8
		0 for empty
		1-5 for etwfa
		6 for t3 of whatever's next
		7 for tier next of next-next
		length parsed based on the powder slots of the items(?)
			ceil(slots/6)
	tree
		1 bit for each node
		only 14 characters for trees 80 nodes long
		length parsed based on weapon class
			ceil(nodeCount/6)
	aspects
		1 bit for each aspect
			there are at most 18 aspects per class
		3 characters
			4 if more Aspects are ever added
	Tomes
		replaced with a single character if no tomes included
		all tomes given an id in their category
		32 or less tomes per category
		9 characters to represent all slots
	modified SP
		1 character per element
		some symbol means that it requires 2 characters instead of 1