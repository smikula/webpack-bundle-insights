import { BundleStats, Chunk, ChunkId } from 'webpack-bundle-stats-plugin';

export type ChunkMap = Map<ChunkId, Chunk>;

export function createChunkMap(stats: BundleStats) {
    const chunkMap: ChunkMap = new Map();
    for (let chunk of stats.chunks) {
        chunkMap.set(chunk.id, chunk);
    }

    return chunkMap;
}
