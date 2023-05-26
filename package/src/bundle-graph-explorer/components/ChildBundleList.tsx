import React, { useCallback, useMemo } from 'react';
import { ChunkGroup } from 'webpack-bundle-stats-plugin';
import { EnhancedBundleStats } from '../../enhanced-bundle-stats/EnhancedBundleStats';

export interface ChildBundleListProps {
    stats: EnhancedBundleStats;
    selectedNode: string | undefined;
    nodesInGraph: string[];
    onNodeAdded: (chunkGroupId: string) => void;
}

export const ChildBundleList: React.FC<ChildBundleListProps> = props => {
    const { stats, selectedNode, nodesInGraph, onNodeAdded } = props;

    const childIds = useMemo(() => {
        if (!stats || !selectedNode) {
            return [];
        }

        const chunkGroup = stats.getChunkGroup(selectedNode)!;

        // Filter out duplicate children
        const childIds = [...new Set(chunkGroup.children)];

        // Sort by name first, then ID
        childIds.sort((a, b) => {
            const a2 = stats.getChunkGroup(a)!;
            const b2 = stats.getChunkGroup(b)!;
            if (a2.name) {
                return b2.name ? a2.name.localeCompare(b2.name) : -1;
            } else {
                return b2.name ? 1 : a2.id.localeCompare(b2.id);
            }
        });

        return childIds;
    }, [stats, selectedNode]);

    const onClick = useCallback(
        (chunkGroupId: string) => {
            onNodeAdded(chunkGroupId);
        },
        [onNodeAdded]
    );

    return (
        <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{selectedNode}</div>
            <div>
                {childIds.map(c => (
                    <ChildBundle
                        key={c}
                        chunkGroup={stats.getChunkGroup(c)!}
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
