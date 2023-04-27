import React from 'react';

interface InvalidVersionWarningProps {
    validRange: string;
}

export const InvalidVersionWarning: React.FC<InvalidVersionWarningProps> = props => {
    return (
        <div
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
            }}>
            The bundle stats provided is from an incompatible version. It should be produced by
            webpack-bundle-stats-plugin@{props.validRange}.
        </div>
    );
};
