import { BundleStats, ChunkGroup, ChunkId } from 'webpack-bundle-stats-plugin';
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

    // TODO: prebuild map
    getChunkGroupByName(name: string): ChunkGroup {
        const chunkGroupsWithName = this.getChunkGroups().filter(cg => cg.name === name);
        if (chunkGroupsWithName.length !== 1) {
            throw new Error(`Found ${chunkGroupsWithName.length} chunk groups with name ${name}`);
        }

        return chunkGroupsWithName[0];
    }

    // TODO: Implement EnhancedBundleGroup
    getChunkGroupParents(chunkGroupId: string) {
        return this.getChunkGroups().filter(cg => cg.children.includes(chunkGroupId));
    }

    // TODO: Implement EnhancedBundleGroup
    getChunkGroupModules(chunkGroupId: string) {
        const modules: string[] = [];
        const cg = this.getChunkGroup(chunkGroupId)!;
        for (let chunkId of cg.chunks) {
            const chunk = this.getChunk(chunkId)!;
            for (let m of chunk.modules) {
                modules.push(m.readableIdentifier);
            }
        }

        return modules;
    }
}
