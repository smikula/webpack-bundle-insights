import prettyBytes from 'pretty-bytes';
import { BundleGroupDetails } from '../../../analysis/analyzeBundleGroup';
import { AssetDetails } from './AssetDetails';

export interface BundleDetailsProps {
    data: BundleGroupDetails;
}

export const BundleDetails: React.FC<BundleDetailsProps> = props => {
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
