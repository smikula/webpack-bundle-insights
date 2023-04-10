import type { DataSet } from 'vis-data';
import type { Edge, Node } from 'vis-network';
import { GraphData } from './getGraphData';

export function addNodeChildren(graphData: GraphData, chunkGroupId: string) {
    const nodes = graphData.visData.nodes as DataSet<Node>;
    const edges = graphData.visData.edges as DataSet<Edge>;

    // Add the child nodes to graph
    const chunkGroup = graphData.chunkGroupMap.get(chunkGroupId);
    const nodesToAdd = new Map<string, Node>();
    const edgesToAdd = new Map<string, Edge>();
    for (let childId of chunkGroup.children) {
        // Add the child node; sometimes webpack lists duplicate children, so make sure to only add
        // each once
        if (!nodes.get(childId) && !nodesToAdd.has(childId)) {
            const childChunkGroup = graphData.chunkGroupMap.get(childId);
            nodesToAdd.set(childId, {
                id: childId,
                label: childChunkGroup.name || childId,
            });
        }

        // Add the edge to the child node
        const edgeId = `${chunkGroupId}->${childId}`;
        if (!edges.get(edgeId) && !edgesToAdd.has(edgeId)) {
            edgesToAdd.set(edgeId, {
                id: edgeId,
                from: chunkGroupId,
                to: childId,
            });
        }
    }

    nodes.add([...nodesToAdd.values()]);
    edges.add([...edgesToAdd.values()]);
}
