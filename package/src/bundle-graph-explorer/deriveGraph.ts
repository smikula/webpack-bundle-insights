import { Edge, Node } from 'vis-network';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

export function deriveGraph(stats: EnhancedBundleStats, chunkGroupsToShow: string[]) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // If we haven't selected any bundles yet, show the entry bundles
    if (chunkGroupsToShow.length === 0) {
        chunkGroupsToShow = getEntryBundleIds(stats);
    }

    // Add each chunk group as a node
    for (let chunkGroupId of chunkGroupsToShow) {
        const chunkGroup = stats.getChunkGroup(chunkGroupId)!;
        nodes.push({
            id: chunkGroupId,
            label: chunkGroup.readableName,
        });

        // Add edges to nodes that are in the graph
        for (let child of chunkGroup.children) {
            if (chunkGroupsToShow.includes(child.id)) {
                const edgeId = `${chunkGroupId}->${child.id}`;
                edges.push({
                    id: edgeId,
                    from: chunkGroupId,
                    to: child.id,
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
