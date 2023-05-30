import prettyBytes from 'pretty-bytes';
import { BundleAnalysis } from '../../../analysis/analyzeBundleGroup';

export interface TotalDetailsProps {
    bundleAnalysis: BundleAnalysis;
}

export const TotalDetails: React.FC<TotalDetailsProps> = props => {
    const { totalAssetSize, totalRawSize, totalDuplicatedSize, assetSizesByType } =
        props.bundleAnalysis;

    const fraction = totalDuplicatedSize / totalRawSize;
    const totalDuplicatePercent = (100 * fraction).toFixed(2);

    return (
        <div style={{ fontWeight: 'bold', margin: '8px' }}>
            <div>Total asset size (minified): {prettyBytes(totalAssetSize)}</div>
            {[...assetSizesByType.keys()].map(t => {
                const { size, count } = assetSizesByType.get(t)!;

                return (
                    <div key={t} style={{ margin: '6px 12px' }}>
                        {t}: {prettyBytes(size)} ({count})
                    </div>
                );
            })}
            <div>
                Duplicate code (unminified): {prettyBytes(totalDuplicatedSize)} /{' '}
                {prettyBytes(totalRawSize)} ({totalDuplicatePercent}%)
            </div>
        </div>
    );
};
