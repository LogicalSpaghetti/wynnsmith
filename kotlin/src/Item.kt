import api.getJSONFromAPI
import file.readStringFromFile
import file.writeStringToFile
import org.json.JSONArray
import org.json.JSONObject

fun item() {
    // get the new state of each item
    val apiObject = getJSONFromAPI("https://api.wynncraft.com/v3/item/database?fullResult")
    writeStringToFile("database/api/items.json", apiObject.toString())

    val apiItems = apiToArray(apiObject)

    val nonApiItems = JSONArray(readStringFromFile("database/manually_added.json"))
    val itemData = JSONArray(readStringFromFile("database/items.json"))
    val groupIndexes = JSONObject(readStringFromFile("database/group_indexes.json"))
    val majorIds = JSONArray(readStringFromFile("database/majorIds.json"))

    removeItems(apiItems, nonApiItems, itemData, groupIndexes)
    for (item in nonApiItems)
        addItem(item as JSONObject, itemData, groupIndexes, majorIds)
    for (item in apiItems)
        addItem(item, itemData, groupIndexes, majorIds)

    writeStringToFile("database/items.json", "$itemData")
    writeStringToFile("database/group_indexes.json", "$groupIndexes")
    writeStringToFile("database/majorIds.json", "$majorIds")
}

fun removeItems(apiItems: List<JSONObject>, nonApiItems: JSONArray, itemData: JSONArray, groupIndexes: JSONObject) {
    val apiNames = apiItems.map { item -> item.getString("internalName") }
    val nonApiNames = nonApiItems.map { item -> (item as JSONObject).getString("internalName") }

    for (i in 0..<itemData.length()) {
        val item = itemData.getJSONObject(i)
        val itemName = item.getString("internalName")
        if (apiNames.indexOf(itemName) > -1 || nonApiNames.indexOf(itemName) > -1) continue
        val emptyItem = JSONObject()
        emptyItem.put("internalItem", itemName)
        if (item.has("name"))
            emptyItem.put("name", item.getString("name"))
        itemData.put(i, emptyItem)
    }
}

fun addItem(item: JSONObject, itemData: JSONArray, groupIndexes: JSONObject, majorIds: JSONArray) {
    val internalName = item.getString("internalName")
    // adding to itemData
    var index = itemData.indexOfFirst { x -> (x as JSONObject).getString("internalName") == internalName }
    if (index < 0) index = itemData.length()
    itemData.put(index, item)

    // adding to groupIndexes
    for (groupKey in arrayOf("type", "subType")) {
        if (!item.has(groupKey)) continue
        val groupName = item.getString(groupKey)
        if (!groupIndexes.has(groupName)) groupIndexes.put(groupName, JSONArray())
        val groupArray = groupIndexes.getJSONArray(groupName)
        if (groupArray.indexOf(internalName) == -1)
            groupArray.put(internalName)
    }

    // adding to and updating majorIds
    if (item.has("majorIds")) {
        val itemMajorIds = item.getJSONObject("majorIds")
        for (majorIdName in itemMajorIds.names()) {
            majorIdName as String
            var index = majorIds.indexOfFirst { majorId -> (majorId as JSONObject).getString("name") == majorIdName }
            if (index == -1) {
                index = majorIds.length()
                majorIds.put(
                    JSONObject().put("name", majorIdName).put("description", "§kMajor Id Description incomplete!")
                )
            }
            majorIds.getJSONObject(index).put(
                "apiDescription", itemMajorIds.getString(majorIdName)
                    .replace("(<[^>]*>)|(\\+[^:]*: )".toRegex(), "")
            )
        }
    }
}

fun apiToArray(apiObject: JSONObject): List<JSONObject> {
    return apiObject.names()
        .map { name ->
            val item = apiObject.getJSONObject(name as String).put("name", name)
            if (!item.has("type")) return@map item

            val subType = "${item.getString("type")}Type"
            if (!item.has(subType)) return@map item

            item.put("subType", item.getString(subType))
            item.remove(subType)

            return@map item
        }.filter { !it.has("type") || it.getString("type") !== "tool" }
}
