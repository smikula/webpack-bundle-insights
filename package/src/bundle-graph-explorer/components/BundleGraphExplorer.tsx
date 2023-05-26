import React, { useCallback, useEffect, useReducer, useState, useMemo } from 'react';
import type { Options } from 'vis-network';
import type { BundleStats } from 'webpack-bundle-stats-plugin';
import { InfoPane } from './InfoPane';
import { InvalidVersionWarning } from '../../core/InvalidVersionWarning';
import { isSupported } from '../../core/isSupported';
import { ReactiveGraph } from '../../core/ReactiveGraph';
import { EnhancedBundleStats } from '../../enhanced-bundle-stats/EnhancedBundleStats';
import { getGraphDataV2 } from '../getGraphDataV2';

export interface BundleGraphExplorerProps {
    stats?: BundleStats;
    className?: string;
}

const SUPPORTED_RANGE = '~0.3.0';

const graphOptions: Options = {
    layout: {
        hierarchical: {
            enabled: true,
            levelSeparation: 75,
            nodeSpacing: 150,
            blockShifting: true,
            edgeMinimization: true,
            direction: 'UD',
            sortMethod: 'directed',
            shakeTowards: 'roots',
        },
    },
};

export const BundleGraphExplorer: React.FC<BundleGraphExplorerProps> = props => {
    const [stats, setStats] = useState<EnhancedBundleStats | undefined>(undefined);
    const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);
    const [nodesInGraph, addNodeInGraph] = useReducer(
        (state: string[], action: string) => [...state, action],
        []
    );

    // Recreate the enhanced stats every time we get new bundle stats
    useEffect(() => {
        setStats(props.stats && new EnhancedBundleStats(props.stats));
    }, [props.stats]);

    // Derive the graph we want to show
    const { nodes, edges } = useMemo(() => {
        if (stats) {
            return getGraphDataV2(stats, nodesInGraph);
        } else {
            return { nodes: [], edges: [] };
        }
    }, [stats, nodesInGraph]);

    // Handle clicks on nodes
    const onClick = useCallback(
        (params: any) => {
            if (params.nodes?.length === 1) {
                // Keep track of the selected node
                const chunkGroupId = params.nodes[0];
                setSelectedNode(chunkGroupId);

                // If this is the first node selected, add it to the graph
                if (nodesInGraph.length === 0) {
                    addNodeInGraph(chunkGroupId);
                }
            }
        },
        [nodesInGraph]
    );

    const isInvalidVersion = stats && !isSupported(stats.stats, SUPPORTED_RANGE);

    return (
        <div className={props.className}>
            {isInvalidVersion ? (
                <InvalidVersionWarning validRange={SUPPORTED_RANGE} />
            ) : (
                <>
                    <ReactiveGraph
                        nodes={nodes}
                        edges={edges}
                        options={graphOptions}
                        onClick={onClick}
                    />
                    {stats && (
                        <InfoPane
                            stats={stats}
                            selectedNode={selectedNode}
                            nodesInGraph={nodesInGraph}
                            onNodeAdded={addNodeInGraph}
                        />
                    )}
                </>
            )}
        </div>
    );
};
