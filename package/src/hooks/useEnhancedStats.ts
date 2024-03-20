import { useMemo } from 'react';
import { BundleStats } from 'webpack-bundle-stats-plugin';
import { EnhancedBundleStats } from '../enhanced-bundle-stats/EnhancedBundleStats';

export function useEnhancedBundleStats(stats: BundleStats | undefined) {
    return useMemo(() => stats && new EnhancedBundleStats(stats), [stats]);
}
