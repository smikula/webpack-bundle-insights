import React, { useMemo } from 'react';
import prettyBytes from 'pretty-bytes';
import { GraphData } from '../getGraphData';
import { BundleLoadingDetails, analyzeBundleLoading } from '../../analysis/analyzeBundleLoading';

interface AnalysisPaneProps {
    graphData: GraphData;
    nodesInGraph: string[];
}

export const AnalysisPane: React.FC<AnalysisPaneProps> = props => {
    const { graphData, nodesInGraph } = props;

    const bundleLoadingAnalysis = useMemo(
        () => analyzeBundleLoading(graphData.stats, nodesInGraph),
        [graphData, nodesInGraph]
    );

    return (
        <div>
            {bundleLoadingAnalysis.map(x => (
                <BundleDetails data={x} />
            ))}
        </div>
    );
};

interface BundleDetailsProps {
    data: BundleLoadingDetails;
}

const BundleDetails: React.FC<BundleDetailsProps> = props => {
    const { chunkGroup, assetSizes } = props.data;
    const label = chunkGroup.name || chunkGroup.id;
    const assets = [...assetSizes.keys()].sort();

    return (
        <div>
            <div>{label}</div>
            <table style={{ margin: '6px', width: '100%' }}>
                {assets.map(asset => {
                    return (
                        <tr>
                            <td>{asset}</td>
                            <td style={{ width: '150px' }}>
                                {prettyBytes(assetSizes.get(asset)!)}
                            </td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
};
