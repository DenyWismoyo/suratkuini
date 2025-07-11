import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import Loader from '../components/UI/Loader';
import DashboardSection from '../components/Dashboard/DashboardSection';
import AgendaCard from '../components/Dashboard/AgendaCard';
import TugasCard from '../components/Dashboard/TugasCard';
import StatItem from '../components/Dashboard/StatItem';

export default function DashboardPage() {
    const { userInfo } = useAuth();
    const { appData, loading } = useData();
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(date.toLocaleDateString('id-ID', options));
    }, []);

    const agendaHariIni = useMemo(() => {
        if (!appData.suratMasuk) return [];
        
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);
        
        return appData.suratMasuk
            .filter(s => s.jenisSurat === 'Undangan' && s.waktuPelaksanaan?.toDate)
            .filter(s => {
                const agendaDate = s.waktuPelaksanaan.toDate();
                return agendaDate >= todayStart && agendaDate <= todayEnd;
            })
            .sort((a, b) => a.waktuPelaksanaan.toDate() - b.waktuPelaksanaan.toDate());
    }, [appData.suratMasuk]);

    const tugasMendesak = useMemo(() => {
        if (!appData.disposisi || !userInfo) return [];
        
        return appData.disposisi
            .filter(d => d.tujuanJabatanId === userInfo.id && d.statusTindakLanjut === 'Baru')
            .slice(0, 5); // Ambil 5 tugas teratas
    }, [appData.disposisi, userInfo]);

    if (loading) {
        return <Loader text="Memuat data dashboard..." />;
    }

    const isPimpinan = userInfo?.peran === 'pimpinan' || userInfo?.peran === 'super_admin';

    return (
        <div className="space-y-6">
            <div className={`grid grid-cols-1 ${isPimpinan ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
                {/* Bagian Agenda untuk semua pengguna */}
                <div className={`${isPimpinan ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                    <DashboardSection icon="calendar-check" title="Agenda Hari Ini" date={currentDate}>
                        {agendaHariIni.length > 0 ? (
                            agendaHariIni.map(agenda => <AgendaCard key={agenda.id} agenda={agenda} />)
                        ) : (
                            <p className="text-text-secondary text-center py-4">Tidak ada agenda hari ini.</p>
                        )}
                    </DashboardSection>
                </div>

                {/* Bagian Statistik HANYA untuk Pimpinan & Super Admin */}
                {isPimpinan && (
                    <div className="lg:col-span-1">
                         <DashboardSection icon="bar-chart-2" title="Statistik">
                            <StatItem label="Surat Masuk" value={appData.suratMasuk.length} icon="inbox" color="text-blue-accent" />
                            <StatItem label="Surat Keluar" value={appData.suratKeluar.length} icon="send" color="text-green-accent" />
                            <StatItem label="Total Disposisi" value={appData.disposisi.length} icon="file-clock" color="text-yellow-accent" />
                         </DashboardSection>
                    </div>
                )}
            </div>
            
            {/* Bagian Tugas Mendesak untuk semua pengguna */}
            <div>
                <DashboardSection icon="file-check-2" title="Tugas Mendesak Saya">
                    {tugasMendesak.length > 0 ? (
                        tugasMendesak.map(tugas => <TugasCard key={tugas.id} tugas={tugas} />)
                    ) : (
                        <p className="text-text-secondary text-center py-4">Tidak ada tugas baru untuk Anda.</p>
                    )}
                </DashboardSection>
            </div>
        </div>
    );
}
