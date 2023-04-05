import React, { CSSProperties } from 'react';
import { Data } from 'vis-network';
import { Graph } from 'webpack-bundle-insights';
import { StatsPicker } from '../components/StatsPicker';
import { getAncestorFilter } from '../graph/getAncestorFilter';
import { getBundleGraph } from '../graph/getBundleGraph';
import { getVizNetworkFromBundleGraph } from '../graph/getVisNetworkFromBundleGraph';
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
    const [graphData, setGraphData] = React.useState<Data>();

    const onFileChanged = (data: any) => {
        console.log('Deriving bundle graph');
        const bundleGraph = getBundleGraph(data);

        console.log('Generating filter');
        const filter = getAncestorFilter(bundleGraph, 'ReadingPane');

        console.log('Getting viz network');
        const newGraphData = getVizNetworkFromBundleGraph(bundleGraph, filter);

        console.log('Updating graph');
        setGraphData(newGraphData);
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
            <Graph data={graphData} options={graphOptions} styles={contentStyles} />
        </div>
    );
};
