import React, { CSSProperties, useEffect, useRef } from 'react';
import { DataSet, DELETE } from 'vis-data';
import { Options, Network, Node, Edge, Data, IdType } from 'vis-network';

export interface ReactiveGraphProps {
    nodes: Node[];
    edges: Edge[];
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

export const ReactiveGraph: React.FC<ReactiveGraphProps> = props => {
    const { nodes, edges, options, onClick } = props;
    const divRef = useRef<HTMLDivElement>(null);
    const dataRef = useRef<Data | null>(null);

    // Initialize the network on mount
    useEffect(() => {
        if (divRef.current) {
            dataRef.current = {
                nodes: new DataSet<Node>({}),
                edges: new DataSet<Edge>({}),
            };

            const network = new Network(divRef.current, dataRef.current, props.options);
            if (props.onClick) {
                network.on('click', props.onClick);
            }
        }
    }, [options, onClick]);

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
