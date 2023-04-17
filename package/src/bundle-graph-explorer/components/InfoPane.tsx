import React, { CSSProperties, useCallback } from 'react';
import { GraphData } from '../getGraphData';
import { ChildBundleList } from './ChildBundleList';
import { addChunkGroupToGraph } from '../addChunkGroupToGraph';

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
};

export const InfoPane: React.FC<InfoPaneProps> = props => {
    const { data, selectedNode } = props;

    const onClick = useCallback(
        (chunkGroupId: string) => {
            addChunkGroupToGraph(data!, chunkGroupId, selectedNode!);
            props.onNodeAdded(chunkGroupId);
        },
        [data, selectedNode]
    );

    return (
        <div style={paneStyles}>
            <ChildBundleList
                data={data}
                selectedNode={selectedNode}
                nodesInGraph={props.nodesInGraph}
                onClick={onClick}
            />
        </div>
    );
};
