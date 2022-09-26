import { BundleData, ChunkId } from 'webpack-bundle-diff';

export function deriveBundleGraphV2(bundleData: BundleData) {
    const chunks = (bundleData as any).chunks as ChunkRecord[];
    const chunkGroups = new Map<string, ChunkGroup>();

    // Infer chunk groups based on the chunk origins
    for (const chunk of chunks) {
        if (chunk.origins.length > 1) {
            console.log(chunk.origins.length);
        }

        for (const origin of chunk.origins) {
            const chunkGroupKey = origin.loc + '|' + origin.moduleName;
            if (!chunkGroups.has(chunkGroupKey)) {
                chunkGroups.set(chunkGroupKey, {
                    name: chunkGroupKey,
                    chunks: [],
                });
            }

            chunkGroups.get(chunkGroupKey)!.chunks.push(chunk.id);
        }
    }

    console.log('chunkGroups', chunkGroups);

    // The same chunk group be accessed from multiple origins and so may be represented twice;
    // we'll dedupe them here
    const newChunkGroups = new Map<string, ChunkGroup>();
    for (const [key, chunkGroup] of chunkGroups) {
        // Sort the chunk IDs before we can compare them
        chunkGroup.chunks.sort();

        // Check if it is a duplicate
        // TODO: Factor this into isDuplicate()
        let isDuplicate = false;
        for (const newChunkGroup of newChunkGroups.values()) {
            if (areChunkGroupsSame(chunkGroup, newChunkGroup)) {
                isDuplicate = true;
                break;
            }
        }

        if (!isDuplicate) {
            newChunkGroups.set(key, chunkGroup);
        } else {
            console.log('Removing dupe', key);
        }
    }

    console.log('newChunkGroups', newChunkGroups);

    // Create a map so we can look up chunk by its ID
    const chunkMap = new Map<ChunkId, ChunkRecord>();
    for (const chunk of chunks) {
        chunkMap.set(chunk.id, chunk);
    }

    // Update the name to something more friendly
    for (const chunkGroup of newChunkGroups.values()) {
        const names = new Set<string>();
        for (const chunkId of chunkGroup.chunks) {
            const chunk = chunkMap.get(chunkId)!;
            if (chunk.names) {
                for (const name of chunk.names) {
                    names.add(name);
                }
            }
        }

        if (names.size > 1) {
            // This seems to happen in the case of vendor bundles...
            // What does it mean?  the overlap between those two roots?
            // TODO: why does same set of names show up multiple times??
            //    Is it diff set of chunks each time...?
            // Probably multiple names means its not an entry chunk and can be ignored
            console.log('Multiple names', [...names.values()]);
            chunkGroup.name = [...names.values()].join('+');
        } else if (names.size === 1) {
            chunkGroup.name = names.values().next().value;
        } else {
            // TODO: Look for the lazy root; will need module info in chunks to do this
            chunkGroup.chunks.sort();
            chunkGroup.name = chunkGroup.chunks.map(c => c.toString()).join('+');
        }
    }

    console.log('newChunkGroups named', newChunkGroups);

    // TODO: better to dedupe once we have ids... :)

    // TODO: derive chunk group graph based on chunk relationships
    // What does child chunk mean?  Is it always lazy, or...?
}

function areChunkGroupsSame(a: ChunkGroup, b: ChunkGroup) {
    if (a.chunks.length !== b.chunks.length) {
        return false;
    }

    for (let i = 0; i < a.chunks.length; i++) {
        if (a.chunks[i] !== b.chunks[i]) {
            return false;
        }
    }

    return true;
}

interface ChunkGroup {
    name: string;
    chunks: (number | string)[];
}

// TEMP
interface ChunkRecord {
    children: number[];
    entry: boolean;
    id: number | string;
    initial: boolean;
    names: string[];
    origins: Origin[];
    parents: number[];
    siblings: number[];
}

interface Origin {
    loc: string;
    moduleName: string;
}
