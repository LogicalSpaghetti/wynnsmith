fun main() {
//    item()
//    tree()
//    typeGen()
//    buildConnectionSheet(18, "images/connections", "connections.png")
    buildNodeSheet(
        "images/connections",
        "active_connections.png",
        18,
        arrayOf("00","02","20", "22"),
        arrayOf("00","02","20", "22"),
        false
        )
    buildNodeSheet(
        "images/nodes",
        "ability_icons.png",
        32,
        arrayOf("white", "yellow", "purple", "blue", "red", "archer", "assassin", "mage", "shaman", "warrior"),
        arrayOf("_blocked", "", "_open", "_error", "_active")
    )
}
