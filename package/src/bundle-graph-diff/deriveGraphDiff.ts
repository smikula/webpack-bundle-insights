import { Edge, Node } from 'vis-network';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

export function deriveGraphDiff(statsA: EnhancedBundleStats, statsB: EnhancedBundleStats) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    return { nodes, edges };
}
