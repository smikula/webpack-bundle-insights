import React, { CSSProperties } from 'react';
import { GraphData } from '../getGraphData';
import { ChildBundleList } from './ChildBundleList';

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

export const InfoPane: React.FC<InfoPaneProps> = props => {
    const { data, selectedNode } = props;

    return (
        <div style={paneStyles}>
            <ChildBundleList
                data={data}
                selectedNode={selectedNode}
                nodesInGraph={props.nodesInGraph}
                onNodeAdded={props.onNodeAdded}
            />
        </div>
    );
};
