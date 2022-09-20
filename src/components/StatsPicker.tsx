import React, { ChangeEvent } from 'react';
import { readJsonFile } from '../utils/readJsonFile';

export interface StatsPickerProps {
    onFileChanged: (data: any) => void;
}

export const StatsPicker: React.FC<StatsPickerProps> = props => {
    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !files[0]) {
            props.onFileChanged(null);
        } else {
            readJsonFile(files[0]).then(props.onFileChanged);
        }
    };

    return <input type="file" onChange={onFileChange} />;
};
