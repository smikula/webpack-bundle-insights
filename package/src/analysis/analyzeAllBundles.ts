import { BundleStats } from 'webpack-bundle-stats-plugin';
import { analyzeBundleLoading } from './analyzeBundleLoading';

export function analyzeAllBundles(stats: BundleStats) {
    // Use a set to avoid duplicates
    const allChunkGroupIds = new Set(stats.chunkGroups.map(cg => cg.id));
    const results = analyzeBundleLoading(stats, [...allChunkGroupIds]);
    console.log(results);
}
