import type {
    AttackSpeedType, BaseType,
    IdentificationsType,
    ItemSubType,
    ItemTypeType,
} from "./api_item_types.ts";

export type ItemData = NormalItemData | CraftedItemData | CustomItemData | ModifiedItemData

export type CraftedItemData = null // TODO
export type CustomItemData = null // TODO
export type ModifiedItemData = null // TODO

export type NormalItemData = {
    name: string
    internalName: string
    type: ItemTypeType
    subType?: ItemSubType
    icon: {
        value: {
            id: string
            name: string
            customModelData: string
        } | string
        format: string
    }
    identified?: true
    allowCraftsman?: true
    raidReward?: true
    dropMeta?: {
        coordinates: [number, number, number]
        name: string
        type: string
    }
    tier?: number
    craftable?: string[]
    rarity?: "common" | "unique" | "set" | "rare" | "legendary" | "fabled" | "mythic"
    majorIds?: { [key: string]: string }
    powderSlots?: number
    lore?: string
    dropRestriction?: string
    restrictions?: "untradable" | "quest item"
    base?: { [key in BaseType]: { min: number, max: number, raw: number } | number }
    identifications?: { [key in IdentificationsType]: { min: number, max: number, raw: number } | number }
    requirements?: {
        level: number
        levelRange: {
            min: number
            max: number
        }
        strength?: number
        dexterity?: number
        intelligence?: number
        defence?: number
        agility?: number
        quest?: string
        classRequirement?: string
        skills: [number, number, number, number, number, number]
    }
    armourMaterial?: string
    attackSpeed?: AttackSpeedType
    averageDPS?: number

    consumableOnlyIDs?: {
        duration: number
        charges: number
    }
    ingredientPositionModifiers?: {
        left: number
        right: number
        above: number
        under: number
        touching: number
        not_touching: number
    }
    itemOnlyIDs?: {
        durability_modifier: number
        strength_requirement: number
        dexterity_requirement: number
        intelligence_requirement: number
        defence_requirement: number
        agility_requirement: number
    }
}
