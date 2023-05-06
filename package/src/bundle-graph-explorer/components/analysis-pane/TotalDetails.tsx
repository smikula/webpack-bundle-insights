import prettyBytes from 'pretty-bytes';
import { BundleAnalysis } from '../../../analysis/analyzeBundleGroup';

export interface TotalDetailsProps {
    bundleAnalysis: BundleAnalysis;
}

export const TotalDetails: React.FC<TotalDetailsProps> = props => {
    const { totalAssetSize, totalRawSize, totalDuplicatedSize } = props.bundleAnalysis;
    const fraction = totalDuplicatedSize / totalRawSize;
    const totalDuplicatePercent = (100 * fraction).toFixed(2);

    return (
        <div style={{ fontWeight: 'bold', margin: '8px' }}>
            <div>Total asset size (minified): {prettyBytes(totalAssetSize)}</div>
            <div>
                Duplicate code (unminified): {prettyBytes(totalDuplicatedSize)} /{' '}
                {prettyBytes(totalRawSize)} ({totalDuplicatePercent}%)
            </div>
        </div>
    );
};
