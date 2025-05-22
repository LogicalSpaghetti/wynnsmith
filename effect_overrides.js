function removeOverridenEffects(build) {
    if (
        build.nodes.includes("maskOfTheLunatic") ||
        build.nodes.includes("maskOfTheFanatic") ||
        build.nodes.includes("maskOfTheCoward")
    ) {
        build.nodes[build.nodes.indexOf("uproot")] = "";
    }
}
