
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

(a "flag" is one bit to mark for a boolean state used to simplify common cases down)
###### link structure:
1. Link type
	- flag: is build
	- if 0, don't interpret as a build
		- ambiguous
2. Version
	- 12 bits
		- 2048 possible versions
			- if the first bit is 1, it means the versioning standard has changed
	- used to ensure items and trees are read from that version of the database
3. Player level
	- flag: max level
	- dynamic length by: max level
4. Items
	- for each slot
		- dynamic length by: category.length + 2
		- 0..0 is an empty slot
		- 0..1 is a crafted/custom item
			- flag: custom item
5. Powders
	 - for each non-zero item:
		 - flag: item has powders:
			 - per-powder encoding:
				 - 000-100 = etwfa
				 - 101 for tier 3 of next xxx
				 - 110 for element xxx and tier \_\_\_xxx
				 - 111 unused, might use later
			 - flag: repeat powder
				 - flag: end powders for item
6. Modified SP
	- flag: SP modified
	- for each skill:
		- dynamic length by:  max SP assignable to skill (100) 
7. Aspects
	- flag: has aspects
	- for each aspect slot:
		- dynamic length by: class_aspect_count + 1
8. Tomes
	- flag: has tomes
		- flag: just guild tome
	- for each tome slot:
		- identical to item slot encoding
			- including technically having room for custom tomes
9. Tree
	- dynamic length by: until the end of the build
	- capped off with zeros so that the total length of everything is 0 mod 6
	- propagate through the tree (~~up~~ down left right)
		- when a selected node is encountered, append "1"
			- re-propagate from here immediately
				- this way it goes straight down the tree, and left/right branches break the tree less
		- when an deselected node is encountered, append "0"
	- when parsing, run using the old tree
		- map to the new tree either using location, or node ID
10. Section delimiter
	- will likely use equals sign "="
		- safer options: `-$.+!*(),`
			- allowed in all URL standards
			- not used for base_64
			- not part of any URL standards as a special character
	- separates different builds to be encoded within one link
### Crafted Encoding
1. TODO

