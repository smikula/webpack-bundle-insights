import React, { useCallback, useEffect, useState } from 'react';
import type { Options } from 'vis-network';
import type { BundleStats } from 'webpack-bundle-stats-plugin';
import { Graph } from '../core/Graph';
import { GraphData, getGraphData } from './getGraphData';
import { addNodeChildren } from './addNodeChildren';

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
            shakeTowards: 'leaves',
        },
    },
};

export const BundleGraphExplorer: React.FC<BundleGraphExplorerProps> = props => {
    const [graphData, setGraphData] = useState<GraphData | undefined>(undefined);

    // Recreate the graphData state every time we get new stats
    useEffect(() => {
        setGraphData(props.stats && getGraphData(props.stats));
    }, [props.stats]);

    const onClick = useCallback(
        (params: any) => {
            if (params.nodes?.length === 1) {
                const chunkGroupId = params.nodes[0];
                console.log('Clicked on node:', chunkGroupId);
                addNodeChildren(graphData, params.nodes[0]);
            }
        },
        [graphData]
    );

    return (
        <Graph
            options={graphOptions}
            data={graphData?.visData}
            className={props.className}
            onClick={onClick}
        />
    );
};
