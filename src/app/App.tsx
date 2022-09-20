import React, { CSSProperties } from 'react';
import { Graph } from '../components/Graph';
import { StatsPicker } from '../components/StatsPicker';
import { deriveChunkGraph } from '../graph/deriveChunkGraph';
import './App.css';

const containerStyles: CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
};

const sidebarStyles: CSSProperties = {
    position: 'absolute',
    top: '0',
    left: '0',
    backgroundColor: 'rgba(255,255,255,0.5)',
    border: '1px solid #aaaaaa',
    zIndex: 1,
};

const contentStyles: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
};

export const App: React.FC<{}> = () => {
    const onFileChanged = (data: any) => {
        const chunkGraph = deriveChunkGraph(data.bundleData);
        console.log(chunkGraph);
    };

    const graph = {
        nodes: [
            { id: 1, label: 'Node 1' },
            { id: 2, label: 'Node 2' },
            { id: 3, label: 'Node 3' },
            { id: 4, label: 'Node 4' },
            { id: 5, label: 'Node 5' },
        ],
        edges: [
            { from: 1, to: 3 },
            { from: 1, to: 2 },
            { from: 2, to: 4 },
            { from: 2, to: 5 },
            { from: 3, to: 3 },
        ],
    };

    const graphOptions = {
        layout: {
            hierarchical: {
                enabled: true,
                levelSeparation: 75,
                nodeSpacing: 150,
                blockShifting: true,
                edgeMinimization: true,
                direction: 'DU',
                sortMethod: 'directed',
                shakeTowards: 'leaves',
            },
        },
    };

    return (
        <div style={containerStyles}>
            <div style={sidebarStyles}>
                <StatsPicker onFileChanged={onFileChanged} />
            </div>
            <Graph data={graph} options={graphOptions} styles={contentStyles} />
        </div>
    );
};
