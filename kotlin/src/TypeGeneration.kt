import api.getJSONFromAPI
import file.writeStringToFile
import org.json.JSONArray
import org.json.JSONObject

// TODO: make the generated file not have random ordering.
fun typeGen() {
    val data = JSONObject()

    // metadata:

    val metadata = getJSONFromAPI("https://api.wynncraft.com/v3/item/metadata")
    val filters = metadata.getJSONObject("filters")
    val advanced = filters.getJSONObject("advanced")
    val itemType = filters.getJSONArray("type")

    data.put("item", itemType)
    for (key in itemType.filter { it as String !== "tool" && advanced.has(it) })
        data.put((key as String), advanced.getJSONArray(key))

    data.put("attackSpeed", advanced.getJSONArray("attackSpeed"))
    data.put("crafting", advanced.getJSONArray("crafting"))

    // base/ids:

    val itemAPI = getJSONFromAPI("https://api.wynncraft.com/v3/item/database?fullResult")

    val base = JSONArray()
    val ids = JSONArray()

    for (key in itemAPI.names()) {
        val item = itemAPI.getJSONObject(key as String)
        if (item.has("identifications"))
            item.getJSONObject("identifications").names()
                .forEach { if (ids.indexOf(it as String) == -1) ids.put(it) }
        if (item.has("base"))
            item.getJSONObject("base").names()
                .forEach { if (base.indexOf(it as String) == -1) base.put(it) }
    }

    data.put("base", base)
    data.put("identifications", ids)

    // file creation:

    var str = "// File contents generated automatically in TypeGeneration.kt, do not modify.\n"
    for (key in data.names()) {
        val entry = data.getJSONArray(key as String)
        val typeName = "${key.replaceFirstChar { if (it.isLowerCase()) it.titlecase() else it.toString() }}Type"
        val typeData = entry.joinToString(" | ") { "\"$it\"" }

        str += "const ${key}Types = $entry\n"
        str += "type $typeName = $typeData\n"
    }


    writeStringToFile("database/item_types.ts", str)
}