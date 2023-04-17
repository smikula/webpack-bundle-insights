import { DataSet } from 'vis-data';
import { Edge, Node } from 'vis-network';
import { GraphData } from './getGraphData';

export function addChunkGroupToGraph(graphData: GraphData, chunkGroupId: string, parentId: string) {
    const nodes = graphData.visData.nodes as DataSet<Node>;
    const edges = graphData.visData.edges as DataSet<Edge>;

    // Add the node
    if (!nodes.get(chunkGroupId)) {
        const chunkGroup = graphData.chunkGroupMap.get(chunkGroupId);
        nodes.add({
            id: chunkGroupId,
            label: chunkGroup!.name || chunkGroupId,
        });
    }

    // Add the edge
    const edgeId = `${parentId}->${chunkGroupId}`;
    if (!edges.get(edgeId)) {
        edges.add({
            id: edgeId,
            from: parentId,
            to: chunkGroupId,
        });
    }
}
