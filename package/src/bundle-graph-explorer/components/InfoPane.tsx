import React, { useState, CSSProperties } from 'react';
import { GraphData } from '../getGraphData';
import { ChildBundleList } from './ChildBundleList';
import { AnalysisPane } from './AnalysisPane';

export interface InfoPaneProps {
    data: GraphData | undefined;
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
    overflow: 'hidden',
};

const tabStyles: CSSProperties = {
    margin: '4px',
};

export const InfoPane: React.FC<InfoPaneProps> = props => {
    const { data, selectedNode } = props;
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
                    data={data}
                    selectedNode={selectedNode}
                    nodesInGraph={props.nodesInGraph}
                    onNodeAdded={props.onNodeAdded}
                />
            )}

            {paneState === 'ANALYZE' && <AnalysisPane />}
        </div>
    );
};

type PaneState = 'LOAD' | 'ANALYZE';
