import { BundleGraphExplorerPane } from './BundleGraphExplorerPane';
import './App.css';

export const App: React.FC<{}> = () => {
    return (
        <>
            <BundleGraphExplorerPane />
            <select className="selector">
                <option>Hi</option>
                <option>Bye</option>
            </select>
        </>
    );
};
