import React, { CSSProperties, useEffect, useRef } from 'react';
import { Data, Options, Network } from 'vis-network';

export interface GraphProps {
    data?: Data;
    options: Options;
    onClick?: (params?: any) => void;
}

const graphStyles: CSSProperties = {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
};

export const Graph: React.FC<GraphProps> = props => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && props.data) {
            const network = new Network(ref.current, props.data, props.options);
            if (props.onClick) {
                network.on('click', props.onClick);
            }
        }
    }, [props.data, props.options, props.onClick]);

    return <div ref={ref} style={graphStyles} />;
};
