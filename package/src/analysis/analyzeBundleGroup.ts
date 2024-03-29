import { Chunk, ChunkGroup, ChunkId } from 'webpack-bundle-stats-plugin';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

export function analyzeBundleGroup(
    stats: EnhancedBundleStats,
    chunkGroupIds: string[]
): BundleAnalysis {
    const bundleDetails: BundleGroupDetails[] = [];

    // Keep track of assets that are loaded as each bundle loads; only the first time an asset
    // loads counts towards the bundle's net size
    const loadedAssets = new Set<string>();

    // Keep track of modules and chunks that are loaded
    const loadedChunks = new Set<ChunkId>();
    const loadedModules = new Set<string>();

    // Keep track of total stats for the session
    let totalRawSize = 0;
    let totalDuplicatedSize = 0;
    let totalAssetSize = 0;
    const assetSizesByType = new Map<string, AssetTotals>();

    // Process each bundle in order
    for (let chunkGroupId of chunkGroupIds) {
        const chunkGroup = stats.getChunkGroup(chunkGroupId)!;

        // Track the size of the bundle assets (netAssetSize excludes any that have already been
        // downloaded as part of an earlier bundle).  This also tracks duplcated code per asset
        // (the raw, unminified module sizes).
        const assetDetails = new Map<string, AssetDetails>();
        let netAssetSize = 0;

        // Track total duplicated code (this is looking at the raw, unminified size of the modules)
        let rawSize = 0;
        let duplicatedSize = 0;

        // Process each chunk in the bundle
        for (let chunkId of chunkGroup.chunks) {
            const chunk = stats.getChunk(chunkId)!;
            const jsAsset = getJsAsset(chunk);

            // Accumulate chunk assets
            for (const filename of chunk.files) {
                const addedSize = loadedAssets.has(filename) ? 0 : stats.getAsset(filename).size;
                assetDetails.set(filename, { netSize: addedSize, duplicatedCode: new Map() });
                loadedAssets.add(filename);
                netAssetSize += addedSize;
                totalAssetSize += addedSize;

                // Keep track of totals per asset type
                const assetType = getAssetType(filename);
                if (!assetSizesByType.has(assetType)) {
                    assetSizesByType.set(assetType, { count: 0, size: 0 });
                }

                const assetTotals = assetSizesByType.get(assetType)!;
                assetTotals.size += addedSize;
                assetTotals.count += 1;
            }

            // Check for duplicated code, but not in chunks that we've already loaded (we don't
            // want to double-count duplicated code)
            if (!loadedChunks.has(chunkId)) {
                const moduleSizes = getModuleSizes(chunk);
                for (let [moduleId, size] of moduleSizes.entries()) {
                    rawSize += size;
                    totalRawSize += size;

                    if (loadedModules.has(moduleId)) {
                        duplicatedSize += size;
                        totalDuplicatedSize += size;
                        assetDetails.get(jsAsset)?.duplicatedCode.set(moduleId, size);
                    }

                    loadedModules.add(moduleId);
                }

                loadedChunks.add(chunkId);
            }
        }

        bundleDetails.push({
            chunkGroup: chunkGroup.rawChunkGroup,
            assetDetails,
            netAssetSize,
            rawSize,
            duplicatedSize,
        });
    }

    return {
        bundleDetails,
        totalAssetSize,
        totalRawSize,
        totalDuplicatedSize,
        assetSizesByType,
    };
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

function getJsAsset(chunk: Chunk) {
    const jsAssets = chunk.files.filter(f => f.endsWith('.js'));
    if (jsAssets.length > 1) {
        throw new Error(`Expected 0 or 1 JS assets for chunk ${chunk.id}`);
    }

    return jsAssets[0];
}

function getAssetType(filename: string) {
    const split = filename.split('.');
    return split.length < 2 ? 'Unknown' : split[split.length - 1].toUpperCase();
}

export interface BundleAnalysis {
    bundleDetails: BundleGroupDetails[];
    totalAssetSize: number;
    totalRawSize: number;
    totalDuplicatedSize: number;
    assetSizesByType: Map<string, AssetTotals>;
}

export interface BundleGroupDetails {
    chunkGroup: ChunkGroup;
    assetDetails: Map<string, AssetDetails>;
    netAssetSize: number;
    rawSize: number;
    duplicatedSize: number;
}

export interface AssetDetails {
    netSize: number;
    duplicatedCode: Map<string, number>; // moduleId -> raw size
}

export interface AssetTotals {
    count: number;
    size: number;
}
