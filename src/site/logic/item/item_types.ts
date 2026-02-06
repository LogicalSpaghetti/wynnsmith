import type {
    AccessorySubType,
    ArmourSubType,
    AttackSpeedType, BaseType,
    IdentificationsType,
    ItemSubType,
    ItemTypeType, TomeSubType,
    WeaponSubType,
} from "../../../generated/item_types.ts";

export type AnyItemType = NonEmptyItemType | EmptyItemType

export type NonEmptyItemType = NormalItemType | CraftedItemType | CustomItemType | ModifiedItemType
export type EmptyItemType = null

export type NormalItemType = WeaponItemType | ArmourItemType | AccessoryItemType | TomeItemType | IngredientType | CharmType | MaterialType
export type CraftedItemType = null // TODO
export type CustomItemType = null // TODO
export type ModifiedItemType = null // TODO

export type GenericItemType = {
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
}


export type GenericGearItemType = GenericItemType & {
    rarity: string
    majorIds?: { [key: string]: string }
    powderSlots?: number
    lore?: string
    dropRestriction: string
    restrictions?: "untradable" | "quest item"
    base?: { [key in BaseType]: { min: number, max: number, raw: number } | number }
    identifications?: { [key in IdentificationsType]: { min: number, max: number, raw: number } | number }
    requirements: {
        level: number
        strength?: number
        dexterity?: number
        intelligence?: number
        defence?: number
        agility?: number
        quest?: string
        class_requirement?: string
    }
}

export type WeaponItemType = GenericGearItemType & {
    type: "weapon"
    subType: WeaponSubType
    attackSpeed: AttackSpeedType
    averageDPS: number
}

export type ArmourItemType = GenericGearItemType & {
    type: "armour"
    subType: ArmourSubType
    armourMaterial: string
}

export type AccessoryItemType = GenericGearItemType & {
    type: "accessory"
    subType: AccessorySubType
}

export type TomeItemType = GenericGearItemType & {
    type: "tome"
    subType: TomeSubType
}

export type IngredientType = GenericItemType & {
    type: "ingredient"
    tier: number
    consumableOnlyIDs: {
        duration: number
        charges: number
    }
    ingredientPositionModifiers: {
        left: number
        right: number
        above: number
        under: number
        touching: number
        not_touching: number
    }
    itemOnlyIDs: {
        durability_modifier: number
        strength_requirement: number
        dexterity_requirement: number
        intelligence_requirement: number
        defence_requirement: number
        agility_requirement: number
    }
    requirements: {
        skills: [number, number, number, number, number, number]
    }
}

export type MaterialType = GenericItemType & {
    tier: number
    craftable: string[]
}

export type CharmType = GenericItemType & {
    type: "charm"
    requirements: {
        levelRange: {
            min: number
            max: number
        }
    }
}
