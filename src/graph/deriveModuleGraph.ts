import { BundleData } from 'webpack-bundle-diff';

export interface ModuleGraph {
    entries: Set<string>;
    nodes: Map<string, ModuleGraphNode>;
}

export interface ModuleGraphNode {
    id: string;
    directChildren: Set<string>;
    lazyChildren: Set<string>;
}

export function buildModuleGraph(bundleData: BundleData) {
    const modules = bundleData.graph;
    const moduleGraph: ModuleGraph = {
        entries: new Set(),
        nodes: new Map(),
    };

    // Create the bundle graph nodes
    for (const [moduleId, module] of Object.entries(modules)) {
        moduleGraph.nodes.set(moduleId, {
            id: moduleId,
            directChildren: new Set(),
            lazyChildren: new Set(),
        });

        if (module.directParents.length + module.lazyParents.length === 0) {
            moduleGraph.entries.add(moduleId);
        }
    }

    // Populate the edges
    for (const [moduleId, module] of Object.entries(modules)) {
        for (const directParent of module.directParents) {
            moduleGraph.nodes.get(directParent)!.directChildren.add(moduleId);
        }

        for (const lazyParent of module.lazyParents) {
            moduleGraph.nodes.get(lazyParent)!.lazyChildren.add(moduleId);
        }
    }

    return moduleGraph;
}
