import { useData } from '../context/DataContext';
import Loader from '../components/UI/Loader';
import DataViewLayout from '../components/UI/DataViewLayout';
import SuratKeluarCard from '../components/Surat/SuratKeluarCard';

export default function SuratKeluarPage() {
    const { appData, loading } = useData();

    if (loading) {
        return <Loader text="Memuat data surat keluar..." />;
    }

    // Opsi filter bisa ditambahkan di sini jika diperlukan di masa depan
    // const filterOptions = [ ... ];

    return (
        <DataViewLayout
            title="Surat Keluar"
            data={appData.suratKeluar}
            CardComponent={SuratKeluarCard}
            // filterOptions={filterOptions}
        />
    );
}
