import { BundleStats, ChunkGroup } from 'webpack-bundle-stats-plugin';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

export function analyzeShadowedModules(stats: BundleStats, bundle: string, modulePattern: string) {
    const enhancedBundleStats = new EnhancedBundleStats(stats);
    const chunkGroup = enhancedBundleStats.getChunkGroupByName(bundle);

    // Verify the bundle contains the given module
    if (!containsModule(enhancedBundleStats, chunkGroup, modulePattern)) {
        throw new Error(`Bundle ${bundle} contains no module that matches ${modulePattern}`);
    }

    // Walk up the graph
    visit(enhancedBundleStats, chunkGroup, modulePattern, []);
}

function visit(
    stats: EnhancedBundleStats,
    chunkGroup: ChunkGroup,
    modulePattern: string,
    path: string[]
) {
    // If we hit an ancestor that contains the module, this is a dead end
    if (path.length && containsModule(stats, chunkGroup, modulePattern)) {
        return;
    }

    // If we hit a root, we want to report this path
    const newPath = [chunkGroup.name ?? 'ANONYMOUS_CHUNK', ...path];
    const parents = stats.getChunkGroupParents(chunkGroup.id);
    if (!parents.length) {
        console.log(newPath.join(' -> '));
    }

    // Otherwise visit each parent
    for (let parentChunkGroup of parents) {
        visit(stats, parentChunkGroup, modulePattern, newPath);
    }
}

function containsModule(stats: EnhancedBundleStats, chunkGroup: ChunkGroup, modulePattern: string) {
    return stats
        .getChunkGroupModules(chunkGroup.id)
        .some(moduleId => moduleId.includes(modulePattern));
}
