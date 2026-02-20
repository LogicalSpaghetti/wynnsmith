import {stripMinecraftFormatting, TextSection, SectionedText} from "./minecraft_html.ts";
import type {TreeAbilities, TreeAbility} from "../ability/ability_tree.ts";

export function getHoverTextForAbility(abilities: TreeAbilities, ability: TreeAbility) {
    const needsArchetypeLine = ability.archetype !== "" && ability.archetypePointsRequired > 0;

    const sections = new SectionedText();

    sections
        .addSection(ability.name)
        .addSection(ability.description)
        .addIf(ability.unlockingWillBlock.length, () => TextSection.of(
            "§cUnlocking will block:",
            ...(ability.unlockingWillBlock.map(id => `§c- §7${abilities[id]._plainname}`)),
        ))
        .addIf(ability.archetype, () => `${ability.archetype} Archetype`)
        .addSection(TextSection.of(`§7Ability points: §f${ability.pointsRequired}`)
            .addIf(ability.requires !== -1, () =>
                `§7Required Ability: §f${abilities[ability.requires]._plainname}`)
            .addIf(needsArchetypeLine, () =>
                `§7Min ${stripMinecraftFormatting(ability.archetype)} Archetype: §f${ability.archetypePointsRequired}`),
        );

    return sections.toMinecraftHTML();
}
