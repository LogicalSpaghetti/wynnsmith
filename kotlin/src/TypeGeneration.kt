import api.getJSONFromAPI
import file.writeStringToFile
import org.json.JSONObject

fun typeGen() {
    val metadata = getJSONFromAPI("https://api.wynncraft.com/v3/item/metadata")
    val filters = metadata.getJSONObject("filters")
    val advanced = filters.getJSONObject("advanced")
    val itemType = filters.getJSONArray("type")

    val data = JSONObject()

    data.put("item", itemType)
    for (key in itemType.filter { it as String !== "tool" && advanced.has(it) }) {
        data.put((key as String), advanced.getJSONArray(key))
    }

    data.put("attackSpeed", advanced.getJSONArray("attackSpeed"))
    data.put("crafting", advanced.getJSONArray("crafting"))

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