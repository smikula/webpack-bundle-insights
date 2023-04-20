import React, { useState, CSSProperties } from 'react';
import { GraphData } from '../getGraphData';
import { ChildBundleList } from './ChildBundleList';
import { AnalysisPane } from './AnalysisPane';

export interface InfoPaneProps {
    graphData: GraphData;
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
    const { graphData, selectedNode } = props;
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
                    data={graphData}
                    selectedNode={selectedNode}
                    nodesInGraph={props.nodesInGraph}
                    onNodeAdded={props.onNodeAdded}
                />
            )}

            {paneState === 'ANALYZE' && (
                <AnalysisPane graphData={graphData} nodesInGraph={props.nodesInGraph} />
            )}
        </div>
    );
};

type PaneState = 'LOAD' | 'ANALYZE';
