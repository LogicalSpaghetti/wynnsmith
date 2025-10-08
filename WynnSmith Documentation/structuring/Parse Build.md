Input -> Read -> Permute -> Write
###### Listeners
1. Modify a specific element.
	- Extremely small modifications, anything complex should instead just toggle a flag which will be read and handled later.
		- i.e. Clear tree errors just adds dataset.clear_errors="true" to the ability tree Element.
2. Call `refreshBuild()`.
###### `refreshBuild()`
1. read()
2. permute()
3. write()
###### read()
1. Gather all data from HTML elements into discrete objects within an Input object.
	- Never passes on an Element, only strings bools and numbers. 
2. Pass the Input into permute() and get back the modified versions.
###### permute(\_:Input)
1. Generate the primary Build given the Input.
	- Generating a build returns a fully permuted build.
	- Each build comes with a Warnings object.
2. Generate the secondary Build given the Input.
	- build.comparison = secondary Build
3. Pass the Build into write()
###### write(\_:Build)
1. fix(\_:Build). 
	1. Modifies inputs 
		- i.e. Changing tree class, showing error messages/indicators, capping SP, changing toggles...
2. display(\_:Build).
	1. Display stats 
	2. Display attacks
	3. Display tree highlighting
	4. ...
