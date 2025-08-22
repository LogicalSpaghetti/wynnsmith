`use strict`;

function readBuild(build) {
    readOldClass(build);
    readPlayerLevel(build);
    readItems(build);
    readSkillPointMultipliers(build);
    readAbilities(build);
}

function readOldClass(build) {
    build.previousClass = document.getElementById("ability_tree").dataset.class;
}

function readPlayerLevel(build) {
    build.level =
        Math.min(maxPlayerLevel,
            Math.max(1,
                parseInt(document.getElementById("level_input").value) || 0));
}
