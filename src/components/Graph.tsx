import React, { useEffect, useRef } from 'react';
import { Data, Options, Network } from 'vis-network';

export interface GraphProps {
    data: Data;
    options: Options;
}

export const Graph: React.FC<GraphProps> = props => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current) {
            new Network(ref.current, props.data, props.options);
        }
    });

    const style = { width: '1000px', height: '800px' };
    return <div ref={ref} style={style} />;
};
