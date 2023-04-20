import React, { useCallback, useMemo } from 'react';
import { GraphData } from '../getGraphData';
import { ChunkGroup } from 'webpack-bundle-stats-plugin';
import { addChunkGroupToGraph } from '../addChunkGroupToGraph';

export interface ChildBundleListProps {
    data: GraphData | undefined;
    selectedNode: string | undefined;
    nodesInGraph: string[];
    onNodeAdded: (chunkGroupId: string) => void;
}

export const ChildBundleList: React.FC<ChildBundleListProps> = props => {
    const { data, selectedNode, nodesInGraph, onNodeAdded } = props;

    const childIds = useMemo(() => {
        if (!data || !selectedNode) {
            return [];
        }

        const chunkGroup = data.chunkGroupMap.get(selectedNode)!;

        // Filter out duplicate children
        const childIds = [...new Set(chunkGroup.children)];

        // Sort by name first, then ID
        childIds.sort((a, b) => {
            const a2 = data.chunkGroupMap.get(a)!;
            const b2 = data.chunkGroupMap.get(b)!;
            if (a2.name) {
                return b2.name ? a2.name.localeCompare(b2.name) : -1;
            } else {
                return b2.name ? 1 : a2.id.localeCompare(b2.id);
            }
        });

        return childIds;
    }, [data, selectedNode]);

    const onClick = useCallback(
        (chunkGroupId: string) => {
            addChunkGroupToGraph(data!, chunkGroupId, selectedNode!);
            onNodeAdded(chunkGroupId);
        },
        [data, selectedNode, onNodeAdded]
    );

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
