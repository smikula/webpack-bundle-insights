import prettyBytes from 'pretty-bytes';

export interface AssetDetailsProps {
    name: string;
    netAssetSize: number;
    bold?: boolean;
}

export const AssetDetails: React.FC<AssetDetailsProps> = props => {
    const { name, netAssetSize, bold } = props;
    const sizeToShow = netAssetSize > 0 ? prettyBytes(netAssetSize) : '';
    const color = netAssetSize > 0 ? undefined : '#aaaaaa';
    const fontWeight = bold ? 'bold' : undefined;

    return (
        <tr style={{ fontWeight }}>
            <td style={{ color }}>{name}</td>
            <td style={{ width: '150px' }}>{sizeToShow}</td>
        </tr>
    );
};
