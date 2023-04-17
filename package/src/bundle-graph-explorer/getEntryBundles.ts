import type { ChunkGroupMap } from './getChunkGroupMap';

export function getEntryBundles(chunkGroupMap: ChunkGroupMap) {
    const possibleEntryBundles = new Set([...chunkGroupMap.values()].filter(cg => cg.name));

    // Filter out those that are the child of another
    for (let cg of chunkGroupMap.values()) {
        for (let childId of cg.children) {
            possibleEntryBundles.delete(chunkGroupMap.get(childId)!);
        }
    }

    return possibleEntryBundles;
}
