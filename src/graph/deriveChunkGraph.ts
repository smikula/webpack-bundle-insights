import { BundleData } from 'webpack-bundle-diff';
import { buildModuleGraph, ModuleGraph } from './deriveModuleGraph';

export type BundleGraph = Map<string, BundleGraphNode>;

export interface BundleGraphNode {
    id: string;
    children: Set<string>;
    parents: Set<string>;
}

export function deriveChunkGraph(bundleData: BundleData) {
    const moduleGraph = buildModuleGraph(bundleData);
    const bundleGraph: BundleGraph = new Map();

    // Process each bundle, starting with the entry points; each lazy import we encounter will
    // add another
    const bundlesToProcess = [...moduleGraph.entries];
    while (bundlesToProcess.length) {
        const bundleId = bundlesToProcess.shift()!;
        if (bundleGraph.has(bundleId)) {
            continue;
        }

        // Create the node for this bundle
        console.log(`Processing bundle ${bundleId}`);
        const childBundles = getChildBundles(bundleId, moduleGraph);
        bundleGraph.set(bundleId, {
            id: bundleId,
            children: childBundles,
            parents: new Set(),
        });

        // Queue up child bundles to process
        for (const childBundleId of childBundles) {
            bundlesToProcess.push(childBundleId);
        }
    }

    addParents(bundleGraph);
    return bundleGraph;
}

// Walk the module graph to find all child bundles
function getChildBundles(nodeId: string, moduleGraph: ModuleGraph, visited = new Set<string>()) {
    const node = moduleGraph.nodes.get(nodeId)!;
    const childBundles = new Set(node.lazyChildren);
    visited.add(nodeId);

    for (const directChild of node.directChildren) {
        if (!visited.has(directChild)) {
            getChildBundles(directChild, moduleGraph, visited).forEach(v => {
                childBundles.add(v);
            });
        }
    }

    return childBundles;
}

function addParents(bundleGraph: BundleGraph) {
    for (const node of bundleGraph.values()) {
        for (const childId of node.children) {
            bundleGraph.get(childId)!.parents.add(node.id);
        }
    }
}
