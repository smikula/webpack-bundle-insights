import React, { useEffect, useRef } from 'react';
import { Data, Options, Network } from 'vis-network';

export interface GraphProps {
    data?: Data;
    options: Options;
    className?: string;
    onClick?: (params?: any) => void;
}

export const Graph: React.FC<GraphProps> = props => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (ref.current && props.data) {
            const network = new Network(ref.current, props.data, props.options);
            network.on('click', props.onClick);
        }
    }, [props.data, props.options, props.onClick]);

    return <div ref={ref} className={props.className} />;
};
