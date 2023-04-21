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
    const { chunkGroup, assetSizes, netSize } = props.data;
    const label = chunkGroup.name || chunkGroup.id;
    const assets = [...assetSizes.keys()].sort();

    return (
        <div style={{ borderBottom: 'solid 1px #aaaaaa', margin: '8px' }}>
            <div style={{ fontWeight: 'bold' }}>{label}</div>
            <table style={{ margin: '6px', width: '100%' }}>
                <tbody>
                    {assets.map(asset => (
                        <AssetDetails key={asset} name={asset} netSize={assetSizes.get(asset)!} />
                    ))}
                    <AssetDetails name="Total" netSize={netSize} bold />
                </tbody>
            </table>
        </div>
    );
};

interface AssetDetailsProps {
    name: string;
    netSize: number;
    bold?: boolean;
}

const AssetDetails: React.FC<AssetDetailsProps> = props => {
    const { name, netSize, bold } = props;
    const sizeToShow = netSize > 0 ? prettyBytes(netSize) : '';
    const color = netSize > 0 ? undefined : '#aaaaaa';
    const fontWeight = bold ? 'bold' : undefined;

    return (
        <tr style={{ fontWeight }}>
            <td style={{ color }}>{name}</td>
            <td style={{ width: '150px' }}>{sizeToShow}</td>
        </tr>
    );
};
