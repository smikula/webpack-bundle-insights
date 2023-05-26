import React, { useState, CSSProperties } from 'react';
import { ChildBundleList } from './ChildBundleList';
import { AnalysisPane } from './analysis-pane/AnalysisPane';
import { EnhancedBundleStats } from '../../enhanced-bundle-stats/EnhancedBundleStats';

export interface InfoPaneProps {
    stats: EnhancedBundleStats;
    selectedNode: string | undefined;
    nodesInGraph: string[];
    onNodeAdded: (chunkGroupId: string) => void;
}

const paneStyles: CSSProperties = {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    width: '20%',
    minWidth: '200px',
    backgroundColor: 'rgba(255,255,255,0.5)',
    overflow: 'auto',
};

const tabStyles: CSSProperties = {
    margin: '4px',
};

export const InfoPane: React.FC<InfoPaneProps> = props => {
    const { stats, selectedNode } = props;
    const [paneState, setPaneState] = useState<PaneState>('LOAD');

    return (
        <div style={paneStyles}>
            <div>
                <button style={tabStyles} onClick={() => setPaneState('LOAD')}>
                    Load bundles
                </button>
                <button style={tabStyles} onClick={() => setPaneState('ANALYZE')}>
                    Analyze
                </button>
            </div>
            <hr />

            {paneState === 'LOAD' && (
                <ChildBundleList
                    stats={stats}
                    selectedNode={selectedNode}
                    nodesInGraph={props.nodesInGraph}
                    onNodeAdded={props.onNodeAdded}
                />
            )}

            {paneState === 'ANALYZE' && (
                <AnalysisPane stats={stats} nodesInGraph={props.nodesInGraph} />
            )}
        </div>
    );
};

type PaneState = 'LOAD' | 'ANALYZE';
