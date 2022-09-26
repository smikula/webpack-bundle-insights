import { Data, Edge, Node } from 'vis-network';

export function transformChunkGroupGraphToVisNetwork(stats: BetterStats): Data {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    for (const chunkGroup of stats.chunkGroups) {
        nodes.push({ id: chunkGroup.id, label: chunkGroup.name || chunkGroup.id });

        for (const child of chunkGroup.children) {
            edges.push({ from: chunkGroup.id, to: child });
        }
    }

    return { nodes, edges };
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
