import deepEqual from 'fast-deep-equal';
import { BundleStats } from 'webpack-bundle-stats-plugin';
import { EnhancedChunkGroup } from './EnhancedChunkGroup';
import { EnhancedBundleStats } from './EnhancedBundleStats';

export type ChunkGroupMap = Map<string, EnhancedChunkGroup>;

export function createChunkGroupMap(stats: BundleStats, enhancedStats: EnhancedBundleStats) {
    const chunkGroupMap: ChunkGroupMap = new Map();
    for (let cg of stats.chunkGroups) {
        if (chunkGroupMap.has(cg.id)) {
            // Sanity check that these actually are duplicates
            if (!deepEqual(cg, chunkGroupMap.get(cg.id)?.rawChunkGroup)) {
                throw new Error(`Found different chunk groups with same id (${cg.id})`);
            }

            continue;
        }

        chunkGroupMap.set(cg.id, new EnhancedChunkGroup(cg, enhancedStats));
    }

    return chunkGroupMap;
}
