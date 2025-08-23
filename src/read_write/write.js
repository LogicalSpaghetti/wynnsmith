function displayBuild(build) {
    addDamageDisplays(build);
    displayBuildStats(build);
    setToggles(build);

    displayForDevelopment(build);

    resetCopyText();
}