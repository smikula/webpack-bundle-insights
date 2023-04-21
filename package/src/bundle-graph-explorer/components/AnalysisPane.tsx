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
                <BundleDetails key={x.chunkGroup.id} data={x} />
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
                <tbody>
                    {assets.map(asset => (
                        <AssetDetails key={asset} name={asset} netSize={assetSizes.get(asset)!} />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface AssetDetailsProps {
    name: string;
    netSize: number;
}

const AssetDetails: React.FC<AssetDetailsProps> = props => {
    const { name, netSize } = props;
    const sizeToShow = netSize > 0 ? prettyBytes(netSize) : '';
    const color = netSize > 0 ? undefined : '#aaaaaa';

    return (
        <tr>
            <td style={{ color }}>{name}</td>
            <td style={{ width: '150px' }}>{sizeToShow}</td>
        </tr>
    );
};
