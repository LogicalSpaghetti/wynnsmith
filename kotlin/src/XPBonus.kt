import api.getJSONFromAPI
import file.writeStringToFile
import org.json.JSONArray
import org.json.JSONObject

val subTypes = arrayOf(
    "bow",
    "dagger",
    "wand",
    "relik",
    "spear",
    "helmet",
    "chestplate",
    "leggings",
    "boots",
    "ring",
    "necklace",
    "bracelet"
)

fun findOptimalXPItems() {
    val apiObject = getJSONFromAPI("https://api.wynncraft.com/v3/item/database?fullResult")
    val items = apiToArray(apiObject)

    val bests = arrayListOf<List<XPEntry>>()
    var bestStr = "level, bonus, item"

    for (subType in subTypes) {
        val sortedItems = items
            .filter { item -> item.has("subType") && item.getString("subType") == subType }
            .filter { item -> item.has("identifications") && item.getJSONObject("identifications").has("xpBonus") }
            .map { item ->
                XPEntry(getXPBonus(item), getLevel(item), item.getString("name"))
            }
            .sortedWith(
                compareBy<XPEntry> { it.level }
                    .thenBy { it.xpBonus }
            )
            .let { sorted ->
                sorted
                    .groupBy { it.level }
                    .map { (_, entries) -> entries.maxBy { it.xpBonus } }
                    .sortedBy { it.level }
                    .let { bestPerLevel ->
                        val filtered = mutableListOf<XPEntry>()
                        var bestXpSoFar = Int.MIN_VALUE

                        for (e in bestPerLevel) {
                            if (e.xpBonus > bestXpSoFar) {
                                filtered.add(e)
                                bestXpSoFar = e.xpBonus
                            }
                        }

                        filtered
                    }
            }

        val jsonArray = JSONArray().apply {
            sortedItems.forEach {
                put(JSONArray().apply {
                    put(it.level)
                    put(it.xpBonus)
                    put(it.name)
                })
            }
        }

        bestStr += "\n$subType:${sortedItems.fold("") { acc, entry -> "$acc\n    ${entry.level}, ${entry.xpBonus}%, ${entry.name}" }}"

        bests.add(sortedItems)
    }

    val optimalItems = bests.flatten()

    val result = optimalItems
        .groupBy { it.level }
        .toSortedMap()
        .map {(level, entries) -> "level $level: " + entries
            .map { it.name}
            .reduce {acc, it -> "$acc, $it"}
        }
        .reduce {acc, it -> "$acc\n${it}"}

    writeStringToFile("database/optimalXPItemsByLevel.txt", result)
    writeStringToFile("database/optimalXPItems.txt", bestStr)
}

fun getLevel(item: JSONObject): Int {
    return item.getJSONObject("requirements").getInt("level")
}

fun getXPBonus(item: JSONObject): Int {
    return getIdMax(item.getJSONObject("identifications"), "xpBonus")
}

fun getIdMax(ids: JSONObject, id: String): Int {
    return idToMax(ids.get(id))
}

fun idToMax(id: Any): Int {
    return id as? Int ?: (id as JSONObject).getInt("max")
}

data class XPEntry(
    val xpBonus: Int,
    val level: Int,
    val name: String
)