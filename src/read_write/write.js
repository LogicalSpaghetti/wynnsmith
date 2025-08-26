function displayBuild(build) {
    addDamageDisplays(build);
    displayBuildStats(build);
    setToggles(build);
    displaySkillPoints(build);

    displayForDevelopment(build);

    resetCopyText();
}

function displaySkillPoints(build) {
    const spClusters = document.getElementById("sp_section").querySelectorAll(".sp_cluster");

    for (let cluster of spClusters) {
        // TODO
    }
}
