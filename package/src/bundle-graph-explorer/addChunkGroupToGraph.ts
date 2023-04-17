import { DataSet } from 'vis-data';
import { Edge, Node } from 'vis-network';
import { GraphData } from './getGraphData';

export function addChunkGroupToGraph(graphData: GraphData, chunkGroupId: string, parentId: string) {
    const nodes = graphData.visData.nodes as DataSet<Node>;
    const edges = graphData.visData.edges as DataSet<Edge>;
    const chunkGroup = graphData.chunkGroupMap.get(chunkGroupId)!;

    // Add the node
    if (!nodes.get(chunkGroupId)) {
        nodes.add({
            id: chunkGroupId,
            label: chunkGroup!.name || chunkGroupId,
        });
    }

    // Fill in edges to/from this node
    nodes.forEach(node => {
        const otherChunkGroupId = node.id! as string;
        const otherChunkGroup = graphData.chunkGroupMap.get(otherChunkGroupId)!;

        // Check for edge from parent
        if (otherChunkGroup.children.includes(chunkGroupId)) {
            addEdge(edges, otherChunkGroupId, chunkGroupId);
        }

        // Check for edge to child
        if (chunkGroup.children.includes(otherChunkGroupId)) {
            addEdge(edges, chunkGroupId, otherChunkGroupId);
        }
    });
}

function addEdge(edges: DataSet<Edge>, parentId: string, childId: string) {
    const edgeId = `${parentId}->${childId}`;
    if (!edges.get(edgeId)) {
        edges.add({
            id: edgeId,
            from: parentId,
            to: childId,
        });
    }
}
