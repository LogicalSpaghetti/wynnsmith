import java.awt.image.BufferedImage
import java.io.File
import javax.imageio.ImageIO

fun buildNodeSheet(
    inputDir: String,
    outputFile: String,
    tileSize: Int,
    prefixes: Array<String>,
    suffixes: Array<String>,
    prefixIsColumn: Boolean = true
) {
    val inputDir = File(inputDir)
    val outputFile = File(outputFile)

    val columns = if (prefixIsColumn) prefixes else suffixes
    val rows = if (prefixIsColumn) suffixes else prefixes

    val spriteSheet = BufferedImage(
        columns.size * tileSize,
        rows.size * tileSize,
        BufferedImage.TYPE_INT_ARGB
    )

    val g = spriteSheet.createGraphics()

    rows.forEachIndexed { row, rowName ->
        columns.forEachIndexed { col, colName ->
            val fileName = if (prefixIsColumn) "$colName$rowName.png" else "$rowName$colName.png"
            val file = File(inputDir, fileName)
            if (file.exists()) {
                val img = ImageIO.read(file)

                val x = col * tileSize + (tileSize - img.width) / 2
                val y = row * tileSize + (tileSize - img.height) / 2

                g.drawImage(img, x, y, null)
            }
        }
    }

    g.dispose()
    ImageIO.write(spriteSheet, "PNG", outputFile)

    println("Sprite sheet created: ${outputFile.absolutePath}")
}
