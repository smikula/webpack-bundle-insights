import React from 'react';
import { BundleStats } from 'webpack-bundle-stats-plugin';
import { BundleGraphExplorer } from 'webpack-bundle-insights';
import { StatsPicker } from '../components/StatsPicker';
import './App.css';

export const App: React.FC<{}> = () => {
    const [stats, setStats] = React.useState<BundleStats>();

    const onFileChanged = (stats: BundleStats) => {
        if ((stats as any).bundleDataV2) {
            stats = (stats as any).bundleDataV2;
        }

        setStats(stats);
    };

    return (
        <div className="container">
            <div className="sidebar">
                <StatsPicker onFileChanged={onFileChanged} />
            </div>
            <BundleGraphExplorer stats={stats} className="graph" />
        </div>
    );
};
