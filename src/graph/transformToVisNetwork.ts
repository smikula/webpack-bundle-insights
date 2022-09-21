import { Data } from 'vis-network';
import { BundleGraph } from './deriveBundleGraph';

export function transformToVisNetwork(bundleGraph: BundleGraph): Data {
    const nodes: any[] = [];
    const edges: any[] = [];

    for (const bundle of bundleGraph.values()) {
        if (!shouldExcludeBundle(bundle.id)) {
            nodes.push({ id: bundle.id, label: bundle.id });

            for (const child of bundle.children) {
                if (!shouldExcludeBundle(child)) {
                    edges.push({ from: bundle.id, to: child });
                }
            }
        }
    }

    return {
        nodes,
        edges,
    };
}

function shouldExcludeBundle(bundleId: string) {
    if (bundleId.includes(`webpack/runtime/webpack-subresource-integrity lazy hashes`)) {
        return true;
    }

    if (bundleId.startsWith(`./node_modules/`)) {
        return true;
    }

    return false;
}
