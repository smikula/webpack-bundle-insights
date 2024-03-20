import { BundleStats, ChunkId } from 'webpack-bundle-stats-plugin';
import { ChunkGroupMap, createChunkGroupMaps } from './createChunkGroupMaps';
import { ChunkMap, createChunkMap } from './createChunkMap';

export class EnhancedBundleStats {
    private chunkMap: ChunkMap;
    private chunkGroupIdMap: ChunkGroupMap;
    private chunkGroupNameMap: ChunkGroupMap;

    constructor(public stats: BundleStats) {
        this.chunkMap = createChunkMap(stats);
        const { idMap, nameMap } = createChunkGroupMaps(stats, this);
        this.chunkGroupIdMap = idMap;
        this.chunkGroupNameMap = nameMap;
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
        return this.chunkGroupIdMap.has(id);
    }

    getChunkGroup(id: string) {
        return this.chunkGroupIdMap.get(id);
    }

    getChunkGroupByName(name: string) {
        return this.chunkGroupNameMap.get(name);
    }

    getChunkGroups() {
        return [...this.chunkGroupIdMap.values()];
    }

    getChunkGroupNames() {
        return [...this.chunkGroupNameMap.keys()];
    }
}
