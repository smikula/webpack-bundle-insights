import React, { useMemo } from 'react';
import { analyzeBundleGroup } from '../../../analysis/analyzeBundleGroup';
import { BundleDetails } from './BundleDetails';
import { TotalDetails } from './TotalDetails';
import { EnhancedBundleStats } from '../../../enhanced-bundle-stats/EnhancedBundleStats';

interface AnalysisPaneProps {
    stats: EnhancedBundleStats;
    nodesInGraph: string[];
}

export const AnalysisPane: React.FC<AnalysisPaneProps> = props => {
    const { stats, nodesInGraph } = props;

    const bundleAnalysis = useMemo(
        () => analyzeBundleGroup(stats, nodesInGraph),
        [stats, nodesInGraph]
    );

    return (
        <div>
            <div>
                {bundleAnalysis.bundleDetails.map(x => (
                    <BundleDetails key={x.chunkGroup.id} data={x} />
                ))}
            </div>
            <TotalDetails bundleAnalysis={bundleAnalysis} />
        </div>
    );
};
