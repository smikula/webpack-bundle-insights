import React, { CSSProperties, useEffect, useRef } from 'react';
import { Data, Options, Network } from 'vis-network';

export interface GraphProps {
    data?: Data;
    options: Options;
    styles?: CSSProperties;
}

export const Graph: React.FC<GraphProps> = props => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && props.data) {
            new Network(ref.current, props.data, props.options);
        }
    }, [props.data, props.options]);

    return <div ref={ref} style={props.styles} />;
};
