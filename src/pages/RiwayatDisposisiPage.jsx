import { useData } from '../contexts/DataContext';
import Loader from '../components/UI/Loader';
import DataViewLayout from '../components/UI/DataViewLayout';
import DisposisiCard from '../components/Disposisi/DisposisiCard';

export default function RiwayatDisposisiPage() {
    const { appData, loading } = useData();

    if (loading) {
        return <Loader text="Memuat riwayat disposisi..." />;
    }

    const filterOptions = [
        { key: 'statusTindakLanjut', label: 'Status Tindak Lanjut', values: ['Baru', 'Dikerjakan', 'Selesai'] }
    ];

    return (
        <DataViewLayout
            title="Riwayat Disposisi"
            data={appData.disposisi}
            CardComponent={DisposisiCard}
            filterOptions={filterOptions}
        />
    );
}
