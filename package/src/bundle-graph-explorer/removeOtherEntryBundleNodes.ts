import { DataSet } from 'vis-data';
import { Node } from 'vis-network';
import { GraphData } from './getGraphData';

export function removeOtherEntryBundleNodes(graphData: GraphData, chunkGroupId: string) {
    const nodes = graphData.visData.nodes as DataSet<Node>;
    const nodesToRemove = nodes.getIds({ filter: node => node.id !== chunkGroupId });
    nodes.remove(nodesToRemove);
}
