import { BundleStats, ChunkId } from 'webpack-bundle-stats-plugin';
import { ChunkGroupMap, createChunkGroupMap } from './createChunkGroupMap';
import { ChunkMap, createChunkMap } from './createChunkMap';

export class EnhancedBundleStats {
    private chunkMap: ChunkMap;
    private chunkGroupMap: ChunkGroupMap;

    constructor(public stats: BundleStats) {
        this.chunkMap = createChunkMap(stats);
        this.chunkGroupMap = createChunkGroupMap(stats);
    }

    getAsset(filename: string) {
        return this.stats.assets[filename];
    }

    hasChunk(id: ChunkId) {
        return this.chunkMap.has(id);
    }

    getChunk(id: ChunkId) {
        return this.chunkMap.get(id);
    }

    hasChunkGroup(id: string) {
        return this.chunkGroupMap.has(id);
    }

    getChunkGroup(id: string) {
        return this.chunkGroupMap.get(id);
    }

    getChunkGroups() {
        return [...this.chunkGroupMap.values()];
    }
}
