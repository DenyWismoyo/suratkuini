import { useNotifier } from '../../contexts/NotificationContext.jsx'; // PATH DIPERBAIKI
import { db } from '../../services/firebase.js';
import { doc, updateDoc } from 'firebase/firestore';

const PERMISSIONS = {
    canForwardDisposisi: ['pejabat_struktural'],
};

export default function DisposisiCard({ item, index, allData, isTugasSaya = false, openModal, userInfo }) {
    const surat = (allData.suratMasuk || []).find(s => s.id === item.suratMasukId);
    const pemberi = (allData.options.jabatan || []).find(j => j.id === item.pemberiDisposisiJabatanId);
    const penerima = (allData.options.jabatan || []).find(j => j.id === item.tujuanJabatanId);
    const notifier = useNotifier();

    if (!surat) return <div className="elegant-card text-text-secondary">Data sumber surat tidak ditemukan.</div>;
    
    const handleUpdateStatus = async (newStatus) => {
        const opdId = userInfo.opdId;
        if (!opdId) return notifier.show("ID OPD tidak ditemukan.", "error");

        if (newStatus === 'Selesai') {
            openModal('laporanSelesai', item);
            return;
        }
        
        const disposisiRef = doc(db, "opds", opdId, "disposisi", item.id);
        await updateDoc(disposisiRef, { statusTindakLanjut: newStatus });
        notifier.show(`Status berhasil diubah menjadi ${newStatus}`, 'success');
    };

    const status = item.statusTindakLanjut;
    let statusColor = 'bg-slate-500'; let progressWidth = '10%';
    if (status === 'Dikerjakan') { statusColor = 'bg-blue-accent'; progressWidth = '50%'; }
    else if (status === 'Selesai') { statusColor = 'bg-green-accent'; progressWidth = '100%'; }

    const canForward = isTugasSaya && PERMISSIONS.canForwardDisposisi.includes(userInfo.peran) && status !== 'Selesai';

    return (
        <div className="elegant-card flex flex-col justify-between h-full" style={{ animationDelay: `${index * 50}ms` }}>
            <div>
                <h3 className="font-bold text-text-primary text-md">{surat.perihal}</h3>
                <p className="text-sm text-text-secondary mt-2">Dari: <span className="font-medium text-text-primary">{pemberi?.namaJabatan || 'N/A'}</span></p>
                {!isTugasSaya && <p className="text-sm text-text-secondary">Ke: <span className="font-medium text-text-primary">{penerima?.namaJabatan || 'N/A'}</span></p>}
                <p className="text-sm text-text-primary mt-3 bg-bg-base/50 p-3 rounded-md">Instruksi: <span className="font-semibold">{item.isiDisposisi}</span></p>
                {item.catatan && <p className="text-sm text-text-secondary italic mt-2">Catatan: {item.catatan}</p>}
            </div>
            <div className="mt-4">
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-text-primary">{status}</span>
                    <a href={surat.linkDokumen} target="_blank" rel="noopener noreferrer" className="text-accent-color hover:underline font-semibold text-sm transition">Lihat File</a>
                </div>
                <div className="w-full bg-bg-base rounded-full h-1.5">
                    <div className={`${statusColor} h-1.5 rounded-full transition-all duration-500`} style={{width: progressWidth}}></div>
                </div>
            </div>
            {isTugasSaya && (
                <div className="mt-4 pt-4 border-t border-border-color text-right space-x-2">
                    {status === 'Baru' && <button onClick={() => handleUpdateStatus('Dikerjakan')} className="elegant-btn text-xs py-1 px-3 bg-blue-600 hover:bg-blue-500">Mulai</button>}
                    {status === 'Dikerjakan' && <button onClick={() => handleUpdateStatus('Selesai')} className="elegant-btn text-xs py-1 px-3 bg-green-600 hover:bg-green-500">Selesai</button>}
                    {canForward && <button onClick={() => openModal('teruskanDisposisi', item)} className="elegant-btn text-xs py-1 px-3 bg-purple-600 hover:bg-purple-500">Teruskan</button>}
                    {status !== 'Selesai' && <button onClick={() => openModal('tindakLanjut', item)} className="elegant-btn text-xs py-1 px-3 bg-gray-600 hover:bg-gray-500">Catat</button>}
                </div>
            )}
        </div>
    );
};
