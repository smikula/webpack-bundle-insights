import React from 'react';
import { BundleGraphExplorerPane } from './BundleGraphExplorerPane';
import { BundleGraphDiffPane } from './BundleGraphDiffPane';
import './App.css';

export const App: React.FC<{}> = () => {
    const [mode, setMode] = React.useState('none');

    const onSelectMode = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setMode(event.target.value);
    };

    return (
        <>
            {mode === 'explore' ? (
                <BundleGraphExplorerPane />
            ) : mode === 'diff' ? (
                <BundleGraphDiffPane />
            ) : null}
            <select className="selector" onChange={onSelectMode}>
                <option value="none">Select mode</option>
                <option value="explore">Bundle graph explorer</option>
                <option value="diff">Bundle graph diff</option>
            </select>
        </>
    );
};
