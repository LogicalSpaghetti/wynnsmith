package api

import org.json.JSONObject
import java.io.InputStreamReader
import java.net.URI
import javax.net.ssl.HttpsURLConnection

fun getJSONFromAPI(address: String): JSONObject {
    val connection = URI.create(address).toURL().openConnection() as HttpsURLConnection
    connection.setRequestProperty("Accept", "application/json")
    if (connection.responseCode != 200) { // 200 indicates OK, no errors detected
        throw RuntimeException("Failed : HTTP Error code : ${connection.responseCode}")
    }
    val text = InputStreamReader(connection.inputStream).readText()
    connection.disconnect()
    return JSONObject(text)
}
