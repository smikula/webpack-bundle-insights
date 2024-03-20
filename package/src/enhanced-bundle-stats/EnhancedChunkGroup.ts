import { ChunkGroup } from 'webpack-bundle-stats-plugin';
import { EnhancedBundleStats } from './EnhancedBundleStats';

export class EnhancedChunkGroup {
    private chunkGroup: ChunkGroup;
    private stats: EnhancedBundleStats;

    constructor(chunkGroup: ChunkGroup, stats: EnhancedBundleStats) {
        this.chunkGroup = chunkGroup;
        this.stats = stats;
    }

    get rawChunkGroup() {
        return this.chunkGroup;
    }

    get id() {
        return this.chunkGroup.id;
    }

    get name() {
        return this.chunkGroup.name;
    }

    get readableName() {
        return this.chunkGroup.name || this.chunkGroup.id;
    }

    get children(): EnhancedChunkGroup[] {
        return this.chunkGroup.children.map(id => {
            const cg = this.stats.getChunkGroup(id);
            if (!cg) {
                throw new Error(`Could not find chunk group with id "${id}"`);
            }

            return cg;
        });
    }

    get chunks() {
        return this.chunkGroup.chunks;
    }

    get chunkGroupType() {
        return this.chunkGroup.chunkGroupType;
    }

    get parents(): EnhancedChunkGroup[] {
        return this.stats.getChunkGroups().filter(cg => cg.chunkGroup.children.includes(this.id));
    }
}
