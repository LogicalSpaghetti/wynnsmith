import api.getJSONFromAPI
import file.readStringFromFile
import file.writeStringToFile
import org.json.JSONArray
import org.json.JSONObject

fun item() {
    // get the new state of each item
    val allItems = getJSONFromAPI("https://api.wynncraft.com/v3/item/database?fullResult")
    transposeSubtyping(allItems)
    addNameToItems(allItems)

    val groups = getGroupArrays(allItems)

    updateItemIndexes(allItems, groups)

    val database = JSONObject(readStringFromFile("database/items.json"))

    updateDatabase(allItems, database)

    writeMaIds(allItems)
    writeFiles(allItems, groups, database)
}

fun writeFiles(newQuery: JSONObject, groups: JSONObject, database: JSONObject) {
    writeStringToFile("database/formatted/items.json", newQuery.toString(2))

    writeStringToFile("database/indexes/item_groups.json", "$groups")
    writeStringToFile("database/wynnsmith/indexed_names.js", "const indexedInternalNameGroups = $groups")

    writeStringToFile("database/items.json", "$database")
    writeStringToFile("database/wynnsmith/items.js", "const allItems = ${database.toJSONArray(database.names())}")
}

fun addNameToItems(allItems: JSONObject) {
    for (itemName in allItems.names()) {
        itemName as String
        allItems.getJSONObject(itemName).put("name", itemName)
    }
}

fun updateDatabase(allItems: JSONObject, database: JSONObject) {
    for (itemName in allItems.names()) {
        itemName as String
        val item = allItems.getJSONObject(itemName)
        val internalName = item.getString("internalName")
        database.put(internalName, item)
    }
}

fun getGroupArrays(allItems: JSONObject): JSONObject {
    val groupArrays = JSONObject(readStringFromFile("database/indexes/item_groups.json"))

    // find groups in the new data
    val groupNames = JSONArray()
    for (itemName in allItems.names()) {
        val item = allItems.getJSONObject(itemName as String)
        val type = item.getString("type")
        if (groupNames.indexOf(type) == -1) groupNames.put(type)
        if (item.has("subType")) {
            val subType = item.getString("subType")
            if (groupNames.indexOf(subType) == -1) groupNames.put(subType)
        }
    }

    // any groups that aren't already in the database are added
    for (groupName in groupNames)
        if (!groupArrays.has(groupName as String)) groupArrays.put(groupName, JSONArray())

    return groupArrays
}

fun updateItemIndexes(allItems: JSONObject, groups: JSONObject) {
    // loop over all items, crosschecking them with their type and subType databases
    for (itemName in allItems.names()) {
        itemName as String
        val item = allItems.getJSONObject(itemName)
        val internalName = item.getString("internalName")

        val type = item.getString("type")
        val typeArray = groups.getJSONArray(type)
        if (typeArray.indexOf(internalName) == -1)
            typeArray.put(internalName)

        if (item.has("subType")) {
            val subType = item.getString("subType")
            val subTypeArray = groups.getJSONArray(subType)
            if (subTypeArray.indexOf(internalName) == -1)
                subTypeArray.put(internalName)
        }
    }
}

fun writeMaIds(allItems: JSONObject) {
    val maIds = JSONArray(readStringFromFile("database/maIds.json"))
    for (name in allItems.names()) {
        name as String
        val item = allItems.getJSONObject(name)
        if (!item.has("majorIds")) continue
        val itemMaIds = item.getJSONObject("majorIds")
        for (maId in itemMaIds.names()) {
            maId as String
            if (maIds.indexOf(maId) == -1) {
                maIds.put(maId)
            }
        }
    }
    writeStringToFile("database/maIds.json", "$maIds")
}

fun transposeSubtyping(allItems: JSONObject) {
    for (name in allItems.names()) {
        val item = allItems.getJSONObject(name as String?)
        item.put("name", name)

        // reformat the subtype
        if (item.has("type")) {
            val subType = "${item.getString("type")}Type"

            if (item.has(subType)) {
                item.put("subType", item.getString(subType))
                item.remove(subType)
            }
        }
    }
}
