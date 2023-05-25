import deepEqual from 'fast-deep-equal';
import { BundleStats, ChunkGroup } from 'webpack-bundle-stats-plugin';

export type ChunkGroupMap = Map<string, ChunkGroup>;

export function createChunkGroupMap(stats: BundleStats) {
    const chunkGroupMap: ChunkGroupMap = new Map();
    for (let cg of stats.chunkGroups) {
        if (chunkGroupMap.has(cg.id)) {
            // Sanity check that these actually are duplicates
            if (!deepEqual(cg, chunkGroupMap.get(cg.id))) {
                throw new Error(`Found different chunk groups with same id (${cg.id})`);
            }

            continue;
        }

        chunkGroupMap.set(cg.id, cg);
    }

    return chunkGroupMap;
}
