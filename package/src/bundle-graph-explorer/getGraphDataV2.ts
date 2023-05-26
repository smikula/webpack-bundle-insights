import { Edge, Node } from 'vis-network';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

export function getGraphDataV2(stats: EnhancedBundleStats, chunkGroupsToShow: string[]) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // If we haven't selected any bundles yet, show the entry bundles
    if (chunkGroupsToShow.length === 0) {
        chunkGroupsToShow = getEntryBundleIds(stats);
    }

    for (let chunkGroupId of chunkGroupsToShow) {
        // TODO: Create nodes, follow edges to other shown bundles
    }

    return { nodes, edges };
}

function getEntryBundleIds(stats: EnhancedBundleStats) {
    return stats
        .getChunkGroups()
        .filter(
            cg => cg.chunkGroupType === 'Entrypoint' && cg.name && !cg.name.includes('node_modules')
        )
        .map(cg => cg.id);
}
