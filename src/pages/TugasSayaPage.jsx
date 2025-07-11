import { useMemo } from 'react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import Loader from '../components/UI/Loader';
import DataViewLayout from '../components/UI/DataViewLayout';
import DisposisiCard from '../components/Disposisi/DisposisiCard';

export default function TugasSayaPage() {
    const { appData, loading: dataLoading } = useData();
    const { userInfo, loading: authLoading } = useAuth();

    const disposisiSaya = useMemo(() => {
        if (!appData.disposisi || !userInfo) {
            return [];
        }
        return appData.disposisi.filter(d => d.tujuanJabatanId === userInfo.id);
    }, [appData.disposisi, userInfo]);
    
    if (dataLoading || authLoading) {
        return <Loader text="Memuat tugas Anda..." />;
    }

    const filterOptions = [
        { key: 'statusTindakLanjut', label: 'Status Tindak Lanjut', values: ['Baru', 'Dikerjakan', 'Selesai'] }
    ];

    return (
        <DataViewLayout
            title="Tugas Saya"
            data={disposisiSaya}
            CardComponent={(props) => <DisposisiCard {...props} isTugasSaya={true} />}
            filterOptions={filterOptions}
        />
    );
}
