import React, { ChangeEvent } from 'react';
import { readJsonFile } from '../utils/readJsonFile';

export const StatsPicker: React.FC<{}> = () => {
    const onFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || !files[0]) {
            return;
        } else {
            readJsonFile(files[0]).then(json => {
                console.log(json);
            });
        }
    };

    return <input type="file" onChange={onFileChange} />;
};
