import { BundleStats, Chunk, ChunkGroup, ChunkId } from 'webpack-bundle-stats-plugin';
import { getChunkGroupMap } from '../utils/getChunkGroupMap';
import { getChunkMap } from '../utils/getChunkMap';

export function analyzeBundleLoading(stats: BundleStats, chunkGroupIds: string[]) {
    const chunkGroupMap = getChunkGroupMap(stats);
    const chunkMap = getChunkMap(stats);
    const results: BundleLoadingDetails[] = [];

    // Keep track of assets that are loaded as each bundle loads; only the first time an asset
    // loads counts towards the bundle's net size
    const loadedAssets = new Set<string>();

    // Keep track of modules and chunks that are loaded
    const loadedChunks = new Set<ChunkId>();
    const loadedModules = new Set<string>();

    // Process each bundle in order
    for (let chunkGroupId of chunkGroupIds) {
        const chunkGroup = chunkGroupMap.get(chunkGroupId)!;

        // Track the size of the bundle assets (netSize excludes any that have already been
        // downloaded as part of an earlier bundle)
        const assetSizes = new Map<string, number>();
        let netAssetSize = 0;

        // Track duplicated code (this is looking at the raw, unminified size of the modules)
        let rawSize = 0;
        let duplicatedSize = 0;

        // Process each chunk in the bundle
        for (let chunkId of chunkGroup.chunks) {
            const chunk = chunkMap.get(chunkId)!;

            // Accumulate chunk assets
            for (const filename of chunk.files) {
                const addedSize = loadedAssets.has(filename) ? 0 : stats.assets[filename].size;
                assetSizes.set(filename, addedSize);
                loadedAssets.add(filename);
                netAssetSize += addedSize;
            }

            // Check for duplicated code, but not in chunks that we've already loaded (we don't
            // want to double-count duplicated code)
            if (!loadedChunks.has(chunkId)) {
                const moduleSizes = getModuleSizes(chunk);
                for (let [moduleId, size] of moduleSizes.entries()) {
                    rawSize += size;
                    duplicatedSize += loadedModules.has(moduleId) ? size : 0;
                    loadedModules.add(moduleId);
                }

                loadedChunks.add(chunkId);
            }
        }

        results.push({ chunkGroup, assetSizes, netAssetSize, rawSize, duplicatedSize });
    }

    return results;
}

// Returns a map of chunkId -> raw size
function getModuleSizes(chunk: Chunk) {
    const modules = new Map<string, number>();

    for (let m of chunk.modules) {
        if (m.modules) {
            // This is a concatenated module, so accumulate the submodules
            for (let m2 of m.modules) {
                modules.set(m2.readableIdentifier, m2.size);
            }
        } else {
            // Just a single module
            modules.set(m.readableIdentifier, m.size);
        }
    }

    return modules;
}

export interface BundleLoadingDetails {
    chunkGroup: ChunkGroup;
    assetSizes: Map<string, number>;
    netAssetSize: number;
    rawSize: number;
    duplicatedSize: number;
}
