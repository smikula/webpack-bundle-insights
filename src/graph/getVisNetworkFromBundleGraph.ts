import { Data, Edge, Node } from 'vis-network';
import { BundleGraph } from '../types/BundleGraph';

export function getVizNetworkFromBundleGraph(
    bundleGraph: BundleGraph,
    nodesToInclude?: Set<string>
): Data {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    for (const node of bundleGraph.nodes.values()) {
        if (!nodesToInclude || nodesToInclude.has(node.id)) {
            nodes.push({ id: node.id, label: node.name || node.id });
            for (const childId of node.children) {
                if (!nodesToInclude || nodesToInclude.has(childId)) {
                    edges.push({ from: node.id, to: childId });
                }
            }
        }
    }

    return { nodes, edges };
}
