import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

// TODO: remove this
export function getEntryBundles(stats: EnhancedBundleStats) {
    return stats
        .getChunkGroups()
        .filter(
            cg => cg.chunkGroupType === 'Entrypoint' && cg.name && !cg.name.includes('node_modules')
        );
}
