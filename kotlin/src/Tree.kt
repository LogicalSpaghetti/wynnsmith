import api.getJSONFromAPI
import file.writeStringToFile
import org.json.JSONObject

val classNames = arrayOf("archer", "assassin", "mage", "shaman", "warrior")

fun tree() {
    for (name in classNames) {
        val wynnClass = JSONObject()
        wynnClass.put("tree", getJSONFromAPI("https://api.wynncraft.com/v3/ability/tree/$name"))
        wynnClass.put("map", getJSONFromAPI("https://api.wynncraft.com/v3/ability/map/$name"))
        wynnClass.put("aspects", getJSONFromAPI("https://api.wynncraft.com/v3/aspects/$name"))

        writeStringToFile("database/trees/$name.json", wynnClass.toString(2))
    }
}
