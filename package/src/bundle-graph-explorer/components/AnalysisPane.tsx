import React from 'react';
import { GraphData } from '../getGraphData';

interface AnalysisPaneProps {
    graphData: GraphData;
    nodesInGraph: string[];
}

export const AnalysisPane: React.FC<AnalysisPaneProps> = props => {
    return <div>AnalysisPane</div>;
};
