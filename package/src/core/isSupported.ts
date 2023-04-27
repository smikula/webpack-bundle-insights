import { satisfies } from 'compare-versions';
import { BundleStats } from 'webpack-bundle-stats-plugin';

export function isSupported(stats: BundleStats, range: string) {
    return (
        stats.webpackBundleStatsPluginVersion &&
        satisfies(stats.webpackBundleStatsPluginVersion, range)
    );
}
