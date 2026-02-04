for every dataset, i.e. indexed ingredients, crafted attack speed tiers, etc., that needs to be encoded, automatically generate the encoding parameters for that data.
Example: indexed ingredients:
```json
[
	{
		"path": "groups/ingredient",
		"reserve_zero": true,
		"extra_reservations": 36, // Powders
	}
]
```
would generate: 
```json
[
	{
		"path": "groups/ingredient",
		"binary_length": ceil(log_2(groups.ingredient.length+1+36))
	}
]
```

The version needs to change if a tree's layout changes, or the number of bits for a field changes, otherwise it should just be modified.