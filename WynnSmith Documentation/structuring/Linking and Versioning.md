
For each version, changes to the tree are logged
when loading an old link, it applies all changes in reverse
every so often, log a full version of the tree
keep outdated information stored in a place that's only sent to the client if they try to load an old link
###### Link structure:
- `https://fiel.us/wynnsmith/?b=<str:base64>`

###### Base 64
- alphanumerics, "`'`", and "`_`".[^1]

###### binary link structure:
1. lead bit, (1)
	- allows the version to start with 0 without being cut off.
2. Build
	1. Version
		- 12 bits
			- 2048 possible versions
				- if the first bit is 1, it means the versioning standard has changed
		- used to ensure items and trees are read from that version of the database
	2. Player level
		- flag: max level
		- dynamic length by: max level
	3. Items
		1. 3 bits
			- number of offhands
		- weapon
		- offhands(?)
		- equipment
		- flag: hasTomes
		- tomes
		1. for each slot
			- flag: is normal, crafted, custom, or modified
			- normal:
				- dynamic length by: category.length + 1
				- 0..0 is an empty slot
			- flag: has powders
			 - per-powder encoding:
				 - 000-100 for `etwfa T6`
				 - 101 for element xxx and tier \_\_\_xxx (0-5)
				 - 110 and 111 unused
			 - flag: repeat powder
				 - flag: end powders for item, (only if not repeated)
	4. Abilities
		1. Aspects
			- flag: has aspects
			- for each aspect slot:
				- dynamic length by: class_aspect_count + 1
				- 0..0 is an empty slot
		2. Tree
			- dynamic length by: tree total node count
			- 1 bit per node
			- map from old links by ability id
	5. Modified SP
		- flag: SP modified
		- for each skill:
			- dynamic length by:  max SP assignable to skill (100) 
3. Comparison
	- flag: has comparison
	- secondary build
4. Cycle
	- TODO
### Crafted Encoding
1. TODO
### Modified Item Encoding
1. TODO
2. Note on rolls:
	1. `positive_roll = parseFloat((Math.round((Math.random() * (1.3 - 0.3) + 0.3) * 100) / 100).toFixed(2));`
	2. `let negative_roll = parseFloat((Math.round((Math.random() * (1.3 - 0.7) + 0.7) * 100) / 100).toFixed(2));`

[^1]: Should more need to be added to a ? parameter without affecting the binary, any of the following may be used: `-$.+!*(),`.  None are included when double-clicked, Comma is excluded if at the end of a link, and minus causes a line break.