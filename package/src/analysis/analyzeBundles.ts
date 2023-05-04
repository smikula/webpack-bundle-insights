import { BundleStats } from 'webpack-bundle-stats-plugin';
import { analyzeBundleGroup } from './analyzeBundleGroup';

export function analyzeBundles(stats: BundleStats) {
    const allChunkGroupIds = new Set(stats.chunkGroups.map(cg => cg.id));
    const results = analyzeBundleGroup(stats, [...allChunkGroupIds]);
    const { totalAssetSize, totalRawSize, totalDuplicatedSize } = results;
    return { totalAssetSize, totalRawSize, totalDuplicatedSize };
}
