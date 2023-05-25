import { BundleStats } from 'webpack-bundle-stats-plugin';
import { analyzeBundleGroup } from './analyzeBundleGroup';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

export function analyzeBundles(stats: BundleStats, bundleNames?: string[]) {
    const enhancedBundleStats = new EnhancedBundleStats(stats);

    const chunkGroupIds = bundleNames
        ? getChunkGroupIds(stats, bundleNames)
        : getAllChunkGroupIds(enhancedBundleStats);

    return analyzeBundleGroup(enhancedBundleStats, chunkGroupIds);
}

function getChunkGroupIds(stats: BundleStats, bundleNames: string[]) {
    return bundleNames.map(n => getBundleIdFromName(stats, n));
}

function getBundleIdFromName(stats: BundleStats, bundleName: string) {
    // This is kind of clunky, but necessary to handle the case where there are two bundles with
    // the same name.  Webpack should never produce this, but there are cases it can happen when
    // the stats are post-processed to patch names back in.
    const filteredChunkGroups = stats.chunkGroups.filter(cg => cg.name === bundleName);
    if (filteredChunkGroups.length < 1) {
        throw new Error(`Bundle '${bundleName}' does not exist.`);
    } else if (filteredChunkGroups.length > 1) {
        throw new Error(`There are multiple bundles named '${bundleName}'.`);
    }

    return filteredChunkGroups[0].id;
}

function getAllChunkGroupIds(stats: EnhancedBundleStats) {
    return stats.getChunkGroups().map(cg => cg.id);
}
