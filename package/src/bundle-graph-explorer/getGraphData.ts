import { Data, Edge, Node } from 'vis-network';
import { DataSet } from 'vis-data';
import { BundleStats } from 'webpack-bundle-stats-plugin';
import { getEntryBundles } from './getEntryBundles';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

export interface GraphData {
    stats: EnhancedBundleStats;
    visData: Data;
}

// TODO:
// [ ] When deriving graph, if no nodes selected, show initial nodes
// [ ] Create enhancedStats separately
// [ ] Remove this
export function getGraphData(stats: BundleStats): GraphData {
    const enhancedStats = new EnhancedBundleStats(stats);
    const entryBundles = getEntryBundles(enhancedStats);

    const initialNodes = [...entryBundles].map<Node>(cg => ({
        id: cg.id,
        label: cg.name || cg.id,
    }));

    const nodes = new DataSet<Node>({});
    const edges = new DataSet<Edge>({});
    nodes.add(initialNodes);

    return {
        stats: enhancedStats,
        visData: { nodes, edges },
    };
}
