package file

import java.io.*

fun writeStringToFile(fileName: String, text: String) {
    File(fileName).parentFile.mkdirs()
    println(fileName)
    val writer = BufferedWriter(FileWriter(fileName))
    writer.write(text)
    writer.close()
}

fun readStringFromFile(fileName: String): String {
    val reader = BufferedReader(FileReader(fileName))
    val text = reader.readText()
    reader.close()
    return text
}
