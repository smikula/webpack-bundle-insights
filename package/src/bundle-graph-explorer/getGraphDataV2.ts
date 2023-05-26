import { Edge, Node } from 'vis-network';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

// TODO: Rename
export function getGraphDataV2(stats: EnhancedBundleStats, chunkGroupsToShow: string[]) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // If we haven't selected any bundles yet, show the entry bundles
    if (chunkGroupsToShow.length === 0) {
        chunkGroupsToShow = getEntryBundleIds(stats);
    }

    for (let chunkGroupId of chunkGroupsToShow) {
        const chunkGroup = stats.getChunkGroup(chunkGroupId)!;
        nodes.push({
            id: chunkGroupId,
            label: chunkGroup.name || chunkGroup.id,
        });

        for (let childId of chunkGroup.children) {
            if (chunkGroupsToShow.includes(childId)) {
                const edgeId = `${chunkGroupId}->${childId}`;
                edges.push({
                    id: edgeId,
                    from: chunkGroupId,
                    to: childId,
                });
            }
        }
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
