import React from 'react';
import { StatsPicker } from '../components/StatsPicker';
import './App.css';

export const App: React.FC<{}> = () => {
    const onFileChanged = (data: any) => {
        console.log(data);
    };

    return (
        <div>
            <StatsPicker onFileChanged={onFileChanged} />
        </div>
    );
};
