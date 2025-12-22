import api.getJSONFromAPI
import file.readStringFromFile
import file.writeStringToFile
import org.json.JSONArray
import org.json.JSONObject
import java.lang.Integer.parseInt
import kotlin.math.max

fun item() {
    // get the new state of each item
    val apiItems = getJSONFromAPI("https://api.wynncraft.com/v3/item/database?fullResult")
    writeStringToFile("database/api/items.json", apiItems.toString())

    transposeSubtyping(apiItems)
    addNameToItems(apiItems)

    val itemData = JSONObject(readStringFromFile("database/items.json"))
    val groupData = JSONObject(readStringFromFile("database/groups.json"))
    // major ids are in an array since the descriptions have to be manually updated, and this is just to auto-index them.
    val majorIds = JSONArray(readStringFromFile("database/majorIds.json"))

    var nextIndex: Int = parseInt(
        itemData.names()
            .reduce { x, y ->
                max(parseInt(x as String), parseInt(y as String)).toString()
            } as String) + 1
    for (fakeName in apiItems.names()) {
        val item = apiItems.getJSONObject(fakeName as String)
        val internalName = item.getString("internalName")

        val id = parseInt(
            itemData.names().find { id ->
                itemData.getJSONObject(id as String).getString("internalName") == internalName
            } as String?
                ?: nextIndex.toString())
        itemData.put(id.toString(), item)
        if (id == nextIndex) nextIndex++

        for (groupTag in arrayOf("type", "subType")) {
            if (!item.has(groupTag)) continue
            val group = item.getString(groupTag)
            if (!groupData.has(group)) groupData.put(group, JSONArray())
            val groupArray = groupData.getJSONArray(group)
            if (groupArray.indexOf(internalName) == -1) groupArray.put(internalName)
        }

        if (item.has("majorIds")) {
            for (majorId in item.getJSONObject("majorIds").names())
                if (majorIds.indexOf(majorId as String) == -1) majorIds.put(majorId)

            item.put("majorIds", item.getJSONObject("majorIds").names().map {name -> majorIds.indexOf(name)})
        }
    }

    writeStringToFile("database/items.json", "$itemData")
    writeStringToFile("database/js/items.js", "export default $itemData")
    writeStringToFile("database/formatted/items.json", itemData.toString(2))
    writeStringToFile("database/groups.json", "$groupData")
    writeStringToFile("database/js/groups.js", "export default $groupData")
    writeStringToFile("database/formatted/groups.json", groupData.toString(2))
    writeStringToFile("database/majorIds.json", "$majorIds")
    writeStringToFile("database/formatted/majorIds.json", majorIds.toString(2))
}

fun addNameToItems(allItems: JSONObject) {
    for (itemName in allItems.names())
        allItems.getJSONObject(itemName as String).put("name", itemName)
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
