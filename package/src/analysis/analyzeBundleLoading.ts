import { BundleStats, ChunkGroup } from 'webpack-bundle-stats-plugin';
import { getChunkGroupMap } from '../utils/getChunkGroupMap';
import { getChunkMap } from '../utils/getChunkMap';

export function analyzeBundleLoading(stats: BundleStats, chunkGroupIds: string[]) {
    const chunkGroupMap = getChunkGroupMap(stats);
    const chunkMap = getChunkMap(stats);
    const loadedAssets = new Set<string>();
    const results: BundleLoadingDetails[] = [];

    for (let chunkGroupId of chunkGroupIds) {
        const chunkGroup = chunkGroupMap.get(chunkGroupId)!;
        const assetSizes = new Map<string, number>();
        let netSize = 0;

        for (let chunkId of chunkGroup.chunks) {
            const chunk = chunkMap.get(chunkId)!;
            for (const filename of chunk.files) {
                const addedSize = loadedAssets.has(filename) ? 0 : stats.assets[filename].size;
                assetSizes.set(filename, addedSize);
                loadedAssets.add(filename);
                netSize += addedSize;
            }
        }

        results.push({ chunkGroup, assetSizes, netSize });
    }

    return results;
}

export interface BundleLoadingDetails {
    chunkGroup: ChunkGroup;
    assetSizes: Map<string, number>;
    netSize: number;
}
