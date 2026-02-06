import type {NormalItemType} from "../item/item_types.ts";

const latestDBVersion = 0;

type ItemsModule = {
    default: NormalItemType[]
}

const lazyModules = import.meta.glob<ItemsModule>(
    '../../../data/*/items.json', {eager: false});

// necessary for testing
const eagerModules = import.meta.glob<ItemsModule>(
    '../../../data/*/items.json', {eager: true});

const itemJsonModules =
    import.meta.env.MODE === 'test' ? eagerModules : lazyModules;

export async function loadItems(version: number = latestDBVersion): Promise<NormalItemType[]> {
    const path = `../../../data/${version}/items.json`;
    const entry = itemJsonModules[path];
    if (!entry) throw new Error('Missing items.json');

    return typeof entry === 'function'
        ? (await entry()).default
        : entry.default;
}