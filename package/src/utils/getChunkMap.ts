import { BundleStats, Chunk, ChunkId } from 'webpack-bundle-stats-plugin';

export function getChunkMap(stats: BundleStats) {
    const chunkMap = new Map<ChunkId, Chunk>();
    for (let chunk of stats.chunks) {
        chunkMap.set(chunk.id, chunk);
    }

    return chunkMap;
}
