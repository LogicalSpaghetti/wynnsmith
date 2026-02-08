import java.awt.image.BufferedImage
import java.io.File
import javax.imageio.ImageIO

fun buildSpriteSheet(tileSize: Int, inputDir: String, outputFile: String) {
    val sheetSize = 4 * tileSize
    val spriteSheet =
        BufferedImage(sheetSize, sheetSize, BufferedImage.TYPE_INT_ARGB)

    val g = spriteSheet.createGraphics()

    for (a in 0..1) {
        for (b in 0..1) {
            for (c in 0..1) {
                for (d in 0..1) {
                    val filename = "${a*2}${b*2}${c*2}${d*2}.png"
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
