import java.awt.image.BufferedImage
import java.io.File
import javax.imageio.ImageIO

fun buildConnectionSheet(tileSize: Int, inputDir: String, outputFile: String) {
    val sheetSize = 4 * tileSize
    val spriteSheet =
        BufferedImage(sheetSize, sheetSize, BufferedImage.TYPE_INT_ARGB)

    val g = spriteSheet.createGraphics()

    for (a in 0..1) {
        for (b in 0..1) {
            for (c in 0..1) {
                for (d in 0..1) {
                    val filename = "${a * 2}${b * 2}${c * 2}${d * 2}.png"
                    val file = File(inputDir, filename)

                    if (!file.exists())
                        continue

                    val tile = ImageIO.read(file)

                    val x = (a + 2 * b) * tileSize
                    val y = (c + 2 * d) * tileSize

                    g.drawImage(tile, x, y, null)
                }
            }
        }
    }

    g.dispose()
    ImageIO.write(spriteSheet, "png", File(outputFile))
}

fun buildNodeSheet(inputDir: String, outputFile: String) {
    val tileSize = 32

    val inputDir = File(inputDir)
    val outputFile = File(outputFile)

    val states = listOf("_blocked", "", "_open", "_error", "_active")
    val baseNames =
        listOf("white", "yellow", "purple", "blue", "red", "archer", "assassin", "mage", "shaman", "warrior")

    val columns = baseNames.size
    val rows = states.size

    val spriteSheet = BufferedImage(
        columns * tileSize,
        rows * tileSize,
        BufferedImage.TYPE_INT_ARGB
    )

    val g = spriteSheet.createGraphics()

    states.forEachIndexed { row, suffix ->
        baseNames.forEachIndexed { col, baseName ->
            val file = File(inputDir, "$baseName$suffix.png")
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
