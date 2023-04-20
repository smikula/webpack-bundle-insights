import React, { useCallback, useEffect, useReducer, useState } from 'react';
import type { Options } from 'vis-network';
import type { BundleStats } from 'webpack-bundle-stats-plugin';
import { Graph } from '../../core/Graph';
import { GraphData, getGraphData } from '../getGraphData';
import { InfoPane } from './InfoPane';
import { removeOtherEntryBundleNodes } from '../removeOtherEntryBundleNodes';

export interface BundleGraphExplorerProps {
    stats?: BundleStats;
    className?: string;
}

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
    const [graphData, setGraphData] = useState<GraphData | undefined>(undefined);
    const [selectedNode, setSelectedNode] = useState<string | undefined>(undefined);
    const [nodesInGraph, addNodeInGraph] = useReducer(
        (state: string[], action: string) => [...state, action],
        []
    );

    // Recreate the graphData state every time we get new stats
    useEffect(() => {
        setGraphData(props.stats && getGraphData(props.stats));
    }, [props.stats]);

    // Handle clicks on nodes
    const onClick = useCallback(
        (params: any) => {
            if (params.nodes?.length === 1) {
                // Keep track of the selected node
                const chunkGroupId = params.nodes[0];
                setSelectedNode(chunkGroupId);

                // If this is the first node selected, remove the other entry nodes
                if (nodesInGraph.length === 0) {
                    addNodeInGraph(chunkGroupId);
                    removeOtherEntryBundleNodes(graphData!, chunkGroupId);
                }
            }
        },
        [graphData, nodesInGraph]
    );

    return (
        <div className={props.className}>
            <Graph options={graphOptions} data={graphData?.visData} onClick={onClick} />
            {graphData && (
                <InfoPane
                    graphData={graphData}
                    selectedNode={selectedNode}
                    nodesInGraph={nodesInGraph}
                    onNodeAdded={addNodeInGraph}
                />
            )}
        </div>
    );
};
