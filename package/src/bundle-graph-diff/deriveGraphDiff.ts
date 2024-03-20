import { Edge, Node } from 'vis-network';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';
import { EnhancedChunkGroup } from '../enhanced-bundle-stats/EnhancedChunkGroup';

export function deriveGraphDiff(statsA: EnhancedBundleStats, statsB: EnhancedBundleStats) {
    const diffGraph = createDiffGraph(statsA, statsB);
    const nodesToShow = getNodesToShow(diffGraph);
    const vizGraph = createVizGraph(diffGraph, nodesToShow);
    return vizGraph;
}

function createDiffGraph(statsA: EnhancedBundleStats, statsB: EnhancedBundleStats) {
    const nodes: DiffGraph = new Map();

    // We're only going to deal with named chunk groups
    const names = new Set([...statsA.getChunkGroupNames(), ...statsB.getChunkGroupNames()]);
    for (const name of names) {
        // Diff the edges (filtering out edges to unnamed nodes)
        const cgA = statsA.getChunkGroupByName(name);
        const cgB = statsB.getChunkGroupByName(name);

        if (cgA && !cgB) {
            // The whole node was removed
            nodes.set(name, {
                change: 'removed',
                edges: createEdges(cgA, 'removed'),
            });
        } else if (!cgA && cgB) {
            // The whole node was added
            nodes.set(name, {
                change: 'added',
                edges: createEdges(cgB, 'added'),
            });
        } else {
            // The node was in both, so we need to compare edges
            nodes.set(name, {
                change: 'none',
                edges: diffEdges(cgA, cgB),
            });
        }
    }

    return nodes;
}

function createEdges(chunkGroup: EnhancedChunkGroup, change: 'added' | 'removed') {
    // Filter out unnamed children and duplicates
    const children = [...new Set(chunkGroup.children.map(cg => cg.name).filter(child => child))];

    // Create edges
    return children.map(child => ({ child, change } as DiffEdge));
}

function diffEdges(
    chunkGroupA: EnhancedChunkGroup | undefined,
    chunkGroupB: EnhancedChunkGroup | undefined
) {
    const edgesA = getNamedChildren(chunkGroupA);
    const edgesB = getNamedChildren(chunkGroupB);
    const edges: DiffEdge[] = [];

    // Find edges that are common or removed
    for (const child of edgesA) {
        edges.push({
            child,
            change: edgesB.has(child) ? 'none' : 'removed',
        });
    }

    // Find edges that were added
    for (const child of edgesB) {
        if (!edgesA.has(child)) {
            edges.push({ child, change: 'added' });
        }
    }

    return edges;
}

function getNamedChildren(chunkGroup: EnhancedChunkGroup | undefined): Set<string> {
    return new Set(
        chunkGroup ? (chunkGroup.children.map(cg => cg.name).filter(n => n) as string[]) : []
    );
}

function getNodesToShow(diffGraph: DiffGraph) {
    const nodesToShow = new Set<string>();
    for (const [nodeName, node] of diffGraph) {
        // If the node changed, show it
        if (node.change != 'none') {
            nodesToShow.add(nodeName);
        }

        // If an edge changed, show the related nodes
        for (const edge of node.edges) {
            if (edge.change !== 'none') {
                nodesToShow.add(nodeName);
                nodesToShow.add(edge.child);
            }
        }
    }

    return nodesToShow;
}

function createVizGraph(diffGraph: DiffGraph, nodesToShow: Set<string>) {
    const edges: Edge[] = [];
    const nodes: Node[] = [];

    for (const nodeName of nodesToShow) {
        const node = diffGraph.get(nodeName)!;
        nodes.push({
            id: nodeName,
            label: nodeName.substring(0, 30),
            color: { background: getChangeColor(node.change, 'white') },
            title: 'yo',
        });

        // Render edges between shown nodes
        for (const edge of node.edges) {
            if (nodesToShow.has(edge.child)) {
                const edgeId = `${nodeName}->${edge.child}`;
                edges.push({
                    id: edgeId,
                    from: nodeName,
                    to: edge.child,
                    color: getChangeColor(edge.change, 'black'),
                });
            }
        }
    }

    return { nodes, edges };
}

function getChangeColor(change: Change, defaultColor: string) {
    if (change === 'added') {
        return 'yellow';
    } else if (change === 'removed') {
        return 'red';
    } else {
        return defaultColor;
    }
}

type Change = 'added' | 'removed' | 'none';
type DiffGraph = Map<string, DiffNode>;

interface DiffNode {
    change: Change;
    edges: DiffEdge[];
}

interface DiffEdge {
    child: string;
    change: Change;
}
