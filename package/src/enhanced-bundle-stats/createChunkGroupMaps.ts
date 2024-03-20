import deepEqual from 'fast-deep-equal';
import { BundleStats, ChunkGroup } from 'webpack-bundle-stats-plugin';
import { EnhancedChunkGroup } from './EnhancedChunkGroup';
import { EnhancedBundleStats } from './EnhancedBundleStats';

export type ChunkGroupMap = Map<string, EnhancedChunkGroup>;

export function createChunkGroupMaps(stats: BundleStats, enhancedStats: EnhancedBundleStats) {
    const idMap: ChunkGroupMap = new Map();
    const nameMap: ChunkGroupMap = new Map();
    for (let cg of stats.chunkGroups) {
        if (idMap.has(cg.id)) {
            // Sanity check that these actually are duplicates
            if (!areChunkGroupsEqual(cg, idMap.get(cg.id)!.rawChunkGroup)) {
                throw new Error(`Found different chunk groups with same id (${cg.id})`);
            }
        } else {
            idMap.set(cg.id, new EnhancedChunkGroup(cg, enhancedStats));
        }

        if (cg.name) {
            if (nameMap.has(cg.name)) {
                // Sanity check that these actually are duplicates
                if (!areChunkGroupsEqual(cg, nameMap.get(cg.name)!.rawChunkGroup)) {
                    console.warn(
                        `Found different chunk groups with same name (${cg.name})`,
                        cg,
                        nameMap.get(cg.name)?.rawChunkGroup
                    );
                }
            } else {
                nameMap.set(cg.name, idMap.get(cg.id)!);
            }
        }
    }

    return { idMap, nameMap };
}

function areChunkGroupsEqual(a: ChunkGroup, b: ChunkGroup) {
    // Only compare a select set of properties; `name` may be different, e.g. if there is a name
    // specified in one dynamic import but not another; and  `origins` will certainly be
    // different, because the chunk groups are caused by diffent dynamic imports
    return (
        a.chunkGroupType === b.chunkGroupType &&
        deepEqual(a.children, b.children) &&
        deepEqual(a.chunks, b.chunks)
    );
}
