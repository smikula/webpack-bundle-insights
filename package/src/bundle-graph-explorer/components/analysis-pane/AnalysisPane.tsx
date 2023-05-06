import React, { useMemo } from 'react';
import { GraphData } from '../../getGraphData';
import { analyzeBundleGroup } from '../../../analysis/analyzeBundleGroup';
import { BundleDetails } from './BundleDetails';
import { TotalDetails } from './TotalDetails';

interface AnalysisPaneProps {
    graphData: GraphData;
    nodesInGraph: string[];
}

export const AnalysisPane: React.FC<AnalysisPaneProps> = props => {
    const { graphData, nodesInGraph } = props;

    const bundleAnalysis = useMemo(
        () => analyzeBundleGroup(graphData.stats, nodesInGraph),
        [graphData, nodesInGraph]
    );

    return (
        <div>
            <div>
                {bundleAnalysis.bundleDetails.map(x => (
                    <BundleDetails key={x.chunkGroup.id} data={x} />
                ))}
            </div>
            <TotalDetails bundleAnalysis={bundleAnalysis} />
        </div>
    );
};
