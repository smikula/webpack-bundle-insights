import type { ChunkGroupMap } from './getChunkGroupMap';

export function getEntryBundles(chunkGroupMap: ChunkGroupMap) {
    return [...chunkGroupMap.values()].filter(
        cg => cg.chunkGroupType === 'Entrypoint' && cg.name && !cg.name.includes('node_modules')
    );
}
