export interface BundleGraph {
    nodes: Map<string, ChunkGroupNode>;
}

export interface ChunkGroupNode {
    id: string;
    name?: string;
    children: Set<string>;
    parents: Set<string>;
}
