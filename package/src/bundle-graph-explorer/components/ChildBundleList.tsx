import React, { useMemo } from 'react';
import { GraphData } from '../getGraphData';
import { ChunkGroup } from 'webpack-bundle-stats-plugin';

export interface ChildBundleListProps {
    data: GraphData | undefined;
    selectedNode: string | undefined;
    nodesInGraph: string[];
    onClick: (chunkGroupId: string) => void;
}

export const ChildBundleList: React.FC<ChildBundleListProps> = props => {
    const { data, selectedNode, nodesInGraph, onClick } = props;

    const childIds = useMemo(() => {
        if (!data || !selectedNode) {
            return [];
        }

        const chunkGroup = data.chunkGroupMap.get(selectedNode)!;

        // Filter out duplicate children
        const childIds = [...new Set(chunkGroup.children)];
        return childIds;
    }, [data, selectedNode]);

    return (
        <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedNode}</div>
            <div>
                {childIds.map(c => (
                    <ChildBundle
                        key={c}
                        chunkGroup={data!.chunkGroupMap.get(c)!}
                        isInGraph={nodesInGraph.includes(c)}
                        onClick={onClick}
                    />
                ))}
            </div>
        </div>
    );
};

interface ChildBundleProps {
    chunkGroup: ChunkGroup;
    isInGraph: boolean;
    onClick: (chunkGroupId: string) => void;
}

const ChildBundle: React.FC<ChildBundleProps> = props => {
    const { id, name } = props.chunkGroup;

    return (
        <button
            disabled={props.isInGraph}
            onClick={() => {
                props.onClick(id);
            }}
            style={{
                display: 'block',
                margin: '4px',
            }}>
            {name || id}
        </button>
    );
};
