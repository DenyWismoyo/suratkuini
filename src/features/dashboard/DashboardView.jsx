import React, { useState, useEffect, useMemo } from 'react';
import { CalendarCheck, BarChart2, FileCheck2, Clock, Inbox, Send, FileClock } from 'lucide-react';

// --- Sub-komponen untuk Dashboard ---

const DashboardSection = ({ icon: Icon, title, date, children }) => (
    <div className="elegant-card h-full">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-text-primary flex items-center">
                <Icon className="w-5 h-5 mr-3 text-accent-color" />
                {title}
            </h2>
            {date && <span className="text-sm font-normal text-text-secondary">{date}</span>}
        </div>
        <div className="space-y-2">{children}</div>
    </div>
);

const StatItem = ({ label, value, icon: Icon, color }) => (
    <div className="flex items-center gap-4 p-2">
        <div className="p-2 bg-black/10 dark:bg-white/5 rounded-lg">
            <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div>
            <p className="text-text-secondary text-sm font-medium">{label}</p>
            <p className="text-xl font-bold text-text-primary">{value}</p>
        </div>
    </div>
);

const AgendaCard = ({ agenda }) => {
    const waktu = agenda.waktuPelaksanaan.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':');
    return (
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-bg-base/50 transition-colors">
            <div className="agenda-time-box">
                <Clock className="w-4 h-4" />
                <span>{waktu}</span>
            </div>
            <div className="flex-grow">
                <h4 className="font-semibold text-text-primary">{agenda.perihal}</h4>
                <p className="text-sm text-text-secondary">Tempat: {agenda.tempatPelaksanaan || 'N/A'}</p>
            </div>
        </div>
    );
};

const TugasCard = ({ tugas, appData }) => {
    const surat = appData.suratMasuk.find(s => s.id === tugas.suratMasukId);
    const pemberi = appData.options.jabatan.find(j => j.id === tugas.pemberiDisposisiJabatanId);
    if (!surat) return null;
    return (
         <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-bg-base/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-yellow-accent/20 text-yellow-accent flex items-center justify-center font-bold flex-shrink-0">
                {pemberi?.nama.charAt(0) || '?'}
            </div>
            <div>
                <h4 className="font-semibold text-text-primary">{surat.perihal}</h4>
                <p className="text-sm text-text-secondary">Instruksi: {tugas.isiDisposisi}</p>
            </div>
        </div>
    );
};


// --- Komponen Utama DashboardView ---

export default function DashboardView({ appData, userInfo }) {
    const { suratMasuk, disposisi } = appData;
    const { peran } = userInfo;
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        const date = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        setCurrentDate(date.toLocaleDateString('id-ID', options));
    }, []);
    
    const agendaHariIni = useMemo(() => {
        const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(); todayEnd.setHours(23, 59, 59, 999);
        
        return suratMasuk
            .filter(s => s.jenisSurat === 'Undangan' && s.waktuPelaksanaan?.toDate)
            .filter(s => {
                const agendaDate = s.waktuPelaksanaan.toDate();
                return agendaDate >= todayStart && agendaDate <= todayEnd;
            })
            .sort((a, b) => a.waktuPelaksanaan.toDate() - b.waktuPelaksanaan.toDate());
    }, [suratMasuk]);

    const tugasMendesak = useMemo(() => {
        return disposisi
            .filter(d => d.tujuanJabatanId === userInfo.id && d.statusTindakLanjut === 'Baru')
            .slice(0, 5);
    }, [disposisi, userInfo.id]);

    const isPimpinan = peran === 'pimpinan' || peran === 'super_admin';

    return (
        <div className="space-y-6">
            <div className={`grid grid-cols-1 ${isPimpinan ? 'lg:grid-cols-3' : 'lg:grid-cols-1'} gap-6`}>
                <div className={`${isPimpinan ? 'lg:col-span-2' : 'lg:col-span-1'}`}>
                    <DashboardSection icon={CalendarCheck} title="Agenda Hari Ini" date={currentDate}>
                        {agendaHariIni.length > 0 ? (
                            agendaHariIni.map(agenda => <AgendaCard key={agenda.id} agenda={agenda} />)
                        ) : (
                            <p className="text-text-secondary text-center py-4">Tidak ada agenda hari ini.</p>
                        )}
                    </DashboardSection>
                </div>

                {isPimpinan && (
                    <div className="lg:col-span-1">
                         <DashboardSection icon={BarChart2} title="Statistik">
                            <StatItem label="Surat Masuk" value={appData.suratMasuk.length} icon={Inbox} color="text-blue-accent" />
                            <StatItem label="Surat Keluar" value={appData.suratKeluar.length} icon={Send} color="text-green-accent" />
                            <StatItem label="Total Disposisi" value={appData.disposisi.length} icon={FileClock} color="text-yellow-accent" />
                         </DashboardSection>
                    </div>
                )}
            </div>
            <div>
                <DashboardSection icon={FileCheck2} title="Tugas Mendesak Saya">
                    {tugasMendesak.length > 0 ? (
                        tugasMendesak.map(tugas => <TugasCard key={tugas.id} tugas={tugas} appData={appData} />)
                    ) : (
                        <p className="text-text-secondary text-center py-4">Tidak ada tugas baru.</p>
                    )}
                </DashboardSection>
            </div>
        </div>
    );
};

