import React, { useMemo } from 'react';
import type { Options } from 'vis-network';
import type { BundleStats } from 'webpack-bundle-stats-plugin';
import { InvalidVersionWarning } from '../../core/InvalidVersionWarning';
import { isSupported } from '../../core/isSupported';
import { ReactiveGraph } from '../../core/ReactiveGraph';
import { useEnhancedBundleStats } from '../../hooks/useEnhancedStats';
import { deriveGraphDiff } from '../deriveGraphDiff';

export interface BundleGraphDiffProps {
    baselineStats: BundleStats | undefined;
    comparisonStats: BundleStats | undefined;
    className?: string;
}

const SUPPORTED_RANGE = '~0.3.0';

const graphOptions: Options = {
    layout: {
        hierarchical: {
            enabled: true,
            levelSeparation: 75,
            nodeSpacing: 150,
            blockShifting: true,
            edgeMinimization: true,
            direction: 'UD',
            sortMethod: 'directed',
            shakeTowards: 'roots',
        },
    },
};

export const BundleGraphDiff: React.FC<BundleGraphDiffProps> = props => {
    const statsA = useEnhancedBundleStats(props.baselineStats);
    const statsB = useEnhancedBundleStats(props.comparisonStats);

    // Derive the graph we want to show
    const { nodes, edges } = useMemo(() => {
        if (statsA && statsB) {
            return deriveGraphDiff(statsA, statsB);
        } else {
            return { nodes: [], edges: [] };
        }
    }, [statsA, statsB]);

    const isInvalidVersion =
        (statsA && !isSupported(statsA.stats, SUPPORTED_RANGE)) ||
        (statsB && !isSupported(statsB.stats, SUPPORTED_RANGE));

    return (
        <div className={props.className}>
            {isInvalidVersion ? (
                <InvalidVersionWarning validRange={SUPPORTED_RANGE} />
            ) : (
                <ReactiveGraph nodes={nodes} edges={edges} options={graphOptions} />
            )}
        </div>
    );
};
