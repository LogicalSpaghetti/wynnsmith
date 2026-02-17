import punscake from "../../js_data/trees.js";
import {minecraftToHTML, stripMinecraftFormatting, TextSection, TextSections} from "./minecraft_html.js";

export function ability_html(abilityID, wynnClass) {
    const abilities = punscake[wynnClass].abilities;
    const ability = abilities[abilityID];

    const sections = new TextSections();

    sections.addByLine(ability.name);


    sections.addByLine(ability.description);

    if (ability.unlockingWillBlock.length) {
        let blockSection = new TextSection("§cUnlocking will block:");

        for (let id of ability.unlockingWillBlock)
            blockSection.add(`§c- §7${abilities[id]._plainname}`);
        sections.add(blockSection);
    }

    if (ability.archetype) sections.addByLine(`${ability.archetype} Archetype`);

    const footer = new TextSection(`§7Ability points: §f${ability.pointsRequired}`);

    if (ability.requires !== -1)
        footer.add(`§7Required Ability: §f${abilities[ability.requires]._plainname}`);
    if (ability.archetype !== "" && ability.archetypePointsRequired > 0)
        footer.add(`§7Min ${stripMinecraftFormatting(ability.archetype)} Archetype: §f${ability.archetypePointsRequired}`);

    sections.add(footer);

    return minecraftToHTML(sections.toString());
}