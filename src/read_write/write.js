function displayPrimaryBuild(build) {
    addDamageDisplays(build);
    displayBuildStats(build);
    setToggles(build);

    displayForDevelopment(build);

    resetCopyText();
}

function display(input, builds) {
    if (!builds[0]) return;
    displaySkillPoints(input);
    displayBuilds(builds);
    validateTree(input.level, input.wynnClass);
    renderHighlights();
}

function displayBuilds(builds) {
    displayPrimaryBuild(builds[0])
}

function displaySkillPoints(input) {
    const spClusters = document.getElementById("sp_section").querySelectorAll(".sp_cluster");

    const firstItemAdded = getItemAddedSP(getItem(input.items.weapons[0].name));
    const assigned = input.sp_assigned;
    const totals = input.sp_assigned.map((sp, i) =>
        sp + input.sp_added[i] + input.sp_modified[i] + firstItemAdded[i]);

    for (let cluster of spClusters) {
        const index = damageTypePrefixes.indexOf(cluster.dataset.element) - 1;

        cluster.querySelector(".total_display").textContent = String(totals[index]);
        cluster.querySelector(".assigned_display").textContent = assigned[index];
    }
}
