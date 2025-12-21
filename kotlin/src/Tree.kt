import api.getJSONFromAPI
import file.readStringFromFile
import file.writeStringToFile
import org.json.JSONArray
import org.json.JSONObject

fun tree() {
    writeTrees()
    indexAspects()
}

val classNames = arrayOf("archer", "warrior", "assassin", "mage", "shaman")

fun writeTrees(): JSONObject {
    val classes = JSONObject()

    for (name in classNames) {
        val wynnClass = JSONObject()
        wynnClass.put("tree", getJSONFromAPI("https://api.wynncraft.com/v3/ability/tree/$name"))
        wynnClass.put("map", dePageMap(getJSONFromAPI("https://api.wynncraft.com/v3/ability/map/$name")))
        wynnClass.put("aspects", getJSONFromAPI("https://api.wynncraft.com/v3/aspects/$name"))
        classes.put(name, wynnClass)
    }

    writeStringToFile("database/formatted/class_trees.json", classes.toString(2))

    return classes
}

fun dePageMap(map: JSONObject): JSONArray {
    val unPagedMap = JSONArray()
    for (i: Int in 0..<map.length()) {
        val pageName = map.names().getString(i)
        val page = map.getJSONArray(pageName)

        for (j: Int in 0..<page.length()) {
            unPagedMap.put(page.getJSONObject(j))
        }
    }
    return unPagedMap
}

fun indexAspects() {
    val aspectsDatabases = JSONObject(readStringFromFile("database/indexes/aspects.json"))

    for (name in classNames) {
        val classAspects = getJSONFromAPI("https://api.wynncraft.com/v3/aspects/$name")
        val aspectsDatabase = aspectsDatabases.getJSONArray(name)

        for (aspectName in classAspects.names()) {
            if (aspectsDatabase.indexOf(aspectName) == -1)
                aspectsDatabase.put(aspectName)
        }
    }

    writeStringToFile("database/indexes/aspects.json", "$aspectsDatabases")
    writeStringToFile("database/wynnsmith/indexed_aspects.js", "const aspect_indexes = $aspectsDatabases")
}