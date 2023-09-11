import { BundleStats } from 'webpack-bundle-stats-plugin';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

// Given a set of assets, makes a best effort to determine what bundles were loaded
export function getBundlesFromAssets(stats: BundleStats, assets: string[]) {
    const enhancedStats = new EnhancedBundleStats(stats);
    const assetToBundleMap = createAssetToBundleMap(enhancedStats);

    const bundles = new Set<string>();
    const unknownAssets = new Set<string>();

    // Look for assets that are only in one bundle
    for (let asset of assets) {
        const assetBundles = assetToBundleMap.get(asset);
        if (!assetBundles) {
            unknownAssets.add(asset);
        } else if (assetBundles.size === 1) {
            bundles.add(assetBundles.values().next().value);
        }
    }

    // Figure out which assets are leftover after accounting for the bundles we know about
    const leftoverAssets = new Set<string>(assets);
    for (let chunkGroupId of bundles) {
        const chunkGroup = enhancedStats.getChunkGroup(chunkGroupId)!;
        for (let chunkId of chunkGroup.chunks) {
            const chunk = enhancedStats.getChunk(chunkId)!;
            for (let asset of chunk.files) {
                if (leftoverAssets.has(asset)) {
                    leftoverAssets.delete(asset);
                }
            }
        }
    }

    return {
        bundles: [...bundles].map(id => enhancedStats.getChunkGroup(id)),
        leftoverAssets,
        unknownAssets,
    };
}

function createAssetToBundleMap(stats: EnhancedBundleStats) {
    const assetToBundleMap = new Map<string, Set<string>>();

    for (let chunkGroup of stats.getChunkGroups()) {
        for (let chunkId of chunkGroup.chunks) {
            const chunk = stats.getChunk(chunkId)!;
            for (let asset of chunk?.files) {
                if (!assetToBundleMap.has(asset)) {
                    assetToBundleMap.set(asset, new Set());
                }

                assetToBundleMap.get(asset)!.add(chunkGroup.id);
            }
        }
    }

    return assetToBundleMap;
}
