import React from 'react';
import { BundleStats } from 'webpack-bundle-stats-plugin';
import { BundleGraphDiff } from 'webpack-bundle-insights';
import { StatsPicker } from '../components/StatsPicker';
import './BundleGraphDiffPane.css';

export const BundleGraphDiffPane: React.FC<{}> = () => {
    const [baselineStats, setBaselineStats] = React.useState<BundleStats>();
    const [comparisonStats, setComparisonStats] = React.useState<BundleStats>();

    const onBaselineFileChanged = (stats: BundleStats) => {
        setBaselineStats(normalizeStats(stats));
    };

    const onComparisonFileChanged = (stats: BundleStats) => {
        setComparisonStats(normalizeStats(stats));
    };

    return (
        <div className="container">
            <div className="pickers">
                <div>
                    <StatsPicker onFileChanged={onBaselineFileChanged} />
                </div>
                <div>
                    <StatsPicker onFileChanged={onComparisonFileChanged} />
                </div>
            </div>
            <BundleGraphDiff />
        </div>
    );
};

function normalizeStats(stats: BundleStats): BundleStats {
    if ((stats as any).bundleDataV2) {
        return (stats as any).bundleDataV2;
    } else {
        return stats;
    }
}
