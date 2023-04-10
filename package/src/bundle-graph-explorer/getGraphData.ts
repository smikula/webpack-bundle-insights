import { Data, Edge, Node } from 'vis-network';
import { DataSet } from 'vis-data';
import { BundleStats, ChunkGroup } from 'webpack-bundle-stats-plugin';
import { getChunkGroupMap } from './getChunkGroupMap';
import { getEntryBundles } from './getEntryBundles';

export interface GraphData {
    chunkGroupMap: Map<string, ChunkGroup>;
    stats: BundleStats;
    visData: Data;
}

export function getGraphData(stats: BundleStats): GraphData {
    const chunkGroupMap = getChunkGroupMap(stats);
    const entryBundles = getEntryBundles(chunkGroupMap);

    const initialNodes = [...entryBundles].map<Node>(cg => ({
        id: cg.id,
        label: cg.name || cg.id,
    }));

    const nodes = new DataSet<Node>({});
    const edges = new DataSet<Edge>({});
    nodes.add(initialNodes);

    return {
        chunkGroupMap,
        stats,
        visData: { nodes, edges },
    };
}
