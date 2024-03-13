import React from 'react';
import { BundleStats } from 'webpack-bundle-stats-plugin';
import { BundleGraphExplorer } from 'webpack-bundle-insights';
import { StatsPicker } from '../components/StatsPicker';
import './BundleGraphExplorerPane.css';

export const BundleGraphExplorerPane: React.FC<{}> = () => {
    const [stats, setStats] = React.useState<BundleStats>();

    const onFileChanged = (stats: BundleStats) => {
        if ((stats as any).bundleDataV2) {
            stats = (stats as any).bundleDataV2;
        }

        setStats(stats);
    };

    return (
        <div className="container">
            <div className="picker">
                <StatsPicker onFileChanged={onFileChanged} />
            </div>
            <BundleGraphExplorer stats={stats} className="graph" />
        </div>
    );
};
