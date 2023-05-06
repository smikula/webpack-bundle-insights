import React, { useMemo } from 'react';
import prettyBytes from 'pretty-bytes';
import { GraphData } from '../../getGraphData';
import { analyzeBundleGroup } from '../../../analysis/analyzeBundleGroup';
import { BundleDetails } from './BundleDetails';

interface AnalysisPaneProps {
    graphData: GraphData;
    nodesInGraph: string[];
}

export const AnalysisPane: React.FC<AnalysisPaneProps> = props => {
    const { graphData, nodesInGraph } = props;

    const bundleLoadingAnalysis = useMemo(
        () => analyzeBundleGroup(graphData.stats, nodesInGraph),
        [graphData, nodesInGraph]
    );

    const { totalAssetSize, totalRawSize, totalDuplicatedSize } = bundleLoadingAnalysis;
    const fraction = totalDuplicatedSize / totalRawSize;
    const totalDuplicatePercent = (100 * fraction).toFixed(2);

    return (
        <div>
            <div>
                {bundleLoadingAnalysis.bundleDetails.map(x => (
                    <BundleDetails key={x.chunkGroup.id} data={x} />
                ))}
            </div>
            <div style={{ fontWeight: 'bold', margin: '8px' }}>
                <div>Total asset size (minified): {prettyBytes(totalAssetSize)}</div>
                <div>
                    Duplicate code (unminified): {prettyBytes(totalDuplicatedSize)} /{' '}
                    {prettyBytes(totalRawSize)} ({totalDuplicatePercent}%)
                </div>
            </div>
        </div>
    );
};
