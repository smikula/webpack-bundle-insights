import { BundleGraph, ChunkGroupNode } from '../types/BundleGraph';

// Filter graph to a named bundle and all its ancestors
export function getAncestorFilter(bundleGraph: BundleGraph, name: string): Set<string> {
    const visited = new Set<string>();
    const node = findNodeByName(bundleGraph, name);
    visit(bundleGraph, node, visited);
    return visited;
}

function visit(bundleGraph: BundleGraph, node: ChunkGroupNode, visited: Set<string>) {
    if (visited.has(node.id)) {
        return;
    }

    visited.add(node.id);

    for (const parentId of node.parents) {
        visit(bundleGraph, bundleGraph.nodes.get(parentId)!, visited);
    }
}

function findNodeByName(bundleGraph: BundleGraph, name: string) {
    for (const node of bundleGraph.nodes.values()) {
        if (node.name === name) {
            return node;
        }
    }

    throw new Error(`Unable to find node with name "${name}".`);
}
