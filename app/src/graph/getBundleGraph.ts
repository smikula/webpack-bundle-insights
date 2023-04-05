import { BundleGraph } from '../types/BundleGraph';

export function getBundleGraph(stats: BetterStats): BundleGraph {
    // Create chunk group nodes
    const bundleGraph: BundleGraph = { nodes: new Map() };
    for (const chunkGroup of stats.chunkGroups) {
        if (bundleGraph.nodes.has(chunkGroup.id)) {
            // TODO: Understand why there are dupe chunk groups sometimes
            console.log(`Duplicate chunkGroup detected: ${chunkGroup.id}`);
        } else {
            bundleGraph.nodes.set(chunkGroup.id, {
                id: chunkGroup.id,
                name: chunkGroup.name,
                children: new Set(chunkGroup.children),
                parents: new Set(),
            });
        }
    }

    // Hook up parent edges
    for (const chunkGroupNode of bundleGraph.nodes.values()) {
        for (const childId of chunkGroupNode.children) {
            bundleGraph.nodes.get(childId)!.parents.add(chunkGroupNode.id);
        }
    }

    return bundleGraph;
}

// TODO: Get this from the other package once it's published
interface BetterStats {
    chunkGroups: ChunkGroup[];
    chunks: Chunk[];
}

interface ChunkGroup {
    id: string;
    name?: string;
    children: string[];
    chunks: ChunkId[];
}

interface Chunk {
    id: ChunkId;
    name?: string;
}

type ChunkId = string | number;
