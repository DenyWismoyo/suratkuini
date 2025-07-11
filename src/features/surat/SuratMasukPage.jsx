import { useData } from '../context/DataContext';
import Loader from '../components/UI/Loader';
import DataViewLayout from '../components/UI/DataViewLayout';
import SuratMasukCard from '../components/Surat/SuratMasukCard';

export default function SuratMasukPage() {
    const { appData, loading } = useData();

    if (loading) {
        return <Loader text="Memuat data surat masuk..." />;
    }

    const filterOptions = [
        { key: 'statusDisposisi', label: 'Status Disposisi', values: ['Belum Disposisi', 'Sudah Disposisi'] }
    ];

    return (
        <DataViewLayout
            title="Surat Masuk"
            data={appData.suratMasuk}
            CardComponent={SuratMasukCard}
            filterOptions={filterOptions}
        />
    );
}
