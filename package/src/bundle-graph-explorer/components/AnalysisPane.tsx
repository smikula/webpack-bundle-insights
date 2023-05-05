import React, { useMemo } from 'react';
import prettyBytes from 'pretty-bytes';
import { GraphData } from '../getGraphData';
import { BundleGroupDetails, analyzeBundleGroup } from '../../analysis/analyzeBundleGroup';

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

    return (
        <div>
            {bundleLoadingAnalysis.bundleDetails.map(x => (
                <BundleDetails key={x.chunkGroup.id} data={x} />
            ))}
        </div>
    );
};

interface BundleDetailsProps {
    data: BundleGroupDetails;
}

const BundleDetails: React.FC<BundleDetailsProps> = props => {
    const { chunkGroup, assetDetails, netAssetSize, rawSize, duplicatedSize } = props.data;
    const label = chunkGroup.name || chunkGroup.id;
    const assets = [...assetDetails.keys()].sort();

    return (
        <div style={{ borderBottom: 'solid 1px #aaaaaa', margin: '8px' }}>
            <div style={{ fontWeight: 'bold' }}>{label}</div>
            <div style={{ margin: '6px' }}>
                <table style={{ width: '100%' }}>
                    <tbody>
                        {assets.map(asset => (
                            <AssetDetails
                                key={asset}
                                name={asset}
                                netAssetSize={assetDetails.get(asset)!.netSize}
                            />
                        ))}
                        <AssetDetails name="Total" netAssetSize={netAssetSize} bold />
                    </tbody>
                </table>
                <div style={{ fontWeight: 'bold', marginTop: '6px' }}>
                    Duplicated code: {prettyBytes(duplicatedSize)} / {prettyBytes(rawSize)} (
                    {((100 * duplicatedSize) / rawSize).toFixed(2)}%)
                </div>
            </div>
        </div>
    );
};

interface AssetDetailsProps {
    name: string;
    netAssetSize: number;
    bold?: boolean;
}

const AssetDetails: React.FC<AssetDetailsProps> = props => {
    const { name, netAssetSize, bold } = props;
    const sizeToShow = netAssetSize > 0 ? prettyBytes(netAssetSize) : '';
    const color = netAssetSize > 0 ? undefined : '#aaaaaa';
    const fontWeight = bold ? 'bold' : undefined;

    return (
        <tr style={{ fontWeight }}>
            <td style={{ color }}>{name}</td>
            <td style={{ width: '150px' }}>{sizeToShow}</td>
        </tr>
    );
};
