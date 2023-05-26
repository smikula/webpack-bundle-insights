import React, { CSSProperties, useEffect, useRef } from 'react';
import { DataSet, DELETE } from 'vis-data';
import { Options, Network, Node, Edge, Data, IdType } from 'vis-network';

export type ClickHandler = (params?: any) => void;

export interface ReactiveGraphProps {
    nodes: Node[];
    edges: Edge[];
    options: Options;
    onClick?: ClickHandler;
}

const graphStyles: CSSProperties = {
    position: 'absolute',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
};

export const ReactiveGraph: React.FC<ReactiveGraphProps> = props => {
    const { nodes, edges, options, onClick } = props;
    const onClickRef = useRef<ClickHandler | undefined>(undefined);
    const networkRef = useRef<Network | undefined>(undefined);
    const divRef = useRef<HTMLDivElement>(null);

    const dataRef = useRef<Data>({
        nodes: new DataSet<Node>({}),
        edges: new DataSet<Edge>({}),
    });

    // Initialize the network at mount
    useEffect(() => {
        if (!networkRef.current) {
            networkRef.current = new Network(divRef.current!, dataRef.current, props.options);
        } else {
            networkRef.current.setOptions(options);
        }
    }, [options]);

    // Keep the onClick callback up to date
    useEffect(() => {
        // Remove the old click handler
        const network = networkRef.current!;
        if (onClickRef.current) {
            network.off('click', onClickRef.current);
        }

        // Add the new handler
        if (onClick) {
            network.on('click', onClick);
        }

        onClickRef.current = onClick;
    });

    // Reconcile nodes and edges any time they change
    useEffect(() => {
        if (dataRef.current) {
            reconcile(nodes, dataRef.current.nodes as DataSet<Node>);
            reconcile(edges, dataRef.current.edges as DataSet<Edge>);
        }
    }, [nodes, edges]);

    return <div ref={divRef} style={graphStyles} />;
};

// Update the data set to match the new data
function reconcile<T extends { id?: IdType }>(newData: T[], dataSet: DataSet<T>) {
    const itemsToAdd: T[] = [];
    const itemsToRemove: IdType[] = [];
    const itemUpdates: Partial<T>[] = [];

    // Add/update items
    for (let item of newData) {
        const dataSetItem = dataSet.get(item.id!);
        if (!dataSetItem) {
            itemsToAdd.push(item);
        } else {
            const patch = createItemPatch(dataSetItem, item) as Partial<T>;
            if (patch) {
                itemUpdates.push(patch);
            }
        }
    }

    // Remove items
    for (let id of dataSet.getIds()) {
        if (!newData.some(i => i.id === id)) {
            itemsToRemove.push(id);
        }
    }

    // Actually update the data set
    if (itemsToAdd.length) {
        dataSet.add(itemsToAdd);
    }

    if (itemsToRemove.length) {
        dataSet.remove(itemsToRemove);
    }
}

function createItemPatch(oldItem: DataItem, newItem: DataItem): DataItem | null {
    let isDirty = false;
    const patch: DataItem = { id: oldItem.id };

    // Add/update properties
    for (let key of Object.keys(newItem)) {
        if (newItem[key] !== oldItem[key]) {
            patch[key] = newItem[key];
            isDirty = true;
        }
    }

    // Remove properties
    for (let key of Object.keys(oldItem)) {
        if (!newItem.hasOwnProperty(key)) {
            patch[key] = DELETE;
            isDirty = true;
        }
    }

    return isDirty ? patch : null;
}

type DataItem = Record<string, any>;
