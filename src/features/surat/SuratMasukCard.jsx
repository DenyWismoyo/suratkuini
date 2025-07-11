import { useEffect } from 'react';
import { useUI } from '../../context/UIContext';

export default function SuratMasukCard({ item, index }) {
    const { openModal } = useUI();

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [item]);

    const statusClass = item.statusDisposisi === 'Sudah Disposisi' ? 'text-green-accent border-green-accent/50' : 'text-yellow-accent border-yellow-accent/50';
    const tglSurat = item.tanggalSurat?.toDate ? item.tanggalSurat.toDate().toLocaleDateString('id-ID') : 'N/A';
    
    const waktuPelaksanaan = item.waktuPelaksanaan?.toDate 
        ? item.waktuPelaksanaan.toDate().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) 
        : null;

    return (
        <div className="elegant-card flex flex-col justify-between h-full" style={{ animationDelay: `${index * 50}ms` }}>
            <div>
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-text-primary text-md flex-1">{item.perihal}</h3>
                    <div className="flex items-center gap-2">
                         <button className="p-1 text-text-secondary hover:text-text-primary transition" title="Lihat Riwayat">
                            <i data-lucide="history" className="w-4 h-4 pointer-events-none"></i>
                        </button>
                        <button onClick={() => openModal('suratMasuk', item)} className="p-1 text-text-secondary hover:text-text-primary transition" title="Edit Surat">
                            <i data-lucide="file-edit" className="w-4 h-4 pointer-events-none"></i>
                        </button>
                    </div>
                </div>
                <p className="text-sm text-text-secondary mt-2">Dari: <span className="font-medium text-text-primary">{item.pengirim}</span></p>
                <p className="text-sm text-text-secondary">Tgl: <span className="font-medium text-text-primary">{tglSurat}</span></p>
                
                {item.jenisSurat === 'Undangan' && waktuPelaksanaan && (
                    <div className="mt-3 pt-3 border-t border-border-color/50 text-sm">
                        <p className="font-semibold text-blue-accent flex items-center">
                            <i data-lucide="calendar-clock" className="w-4 h-4 mr-2"></i>Agenda
                        </p>
                        <p className="text-text-secondary pl-6">Waktu: {waktuPelaksanaan} WIB</p>
                        <p className="text-text-secondary pl-6">Tempat: {item.tempatPelaksanaan || 'N/A'}</p>
                    </div>
                )}
            </div>
            <div className="mt-4 pt-4 border-t border-border-color flex justify-between items-center">
                <span className={`text-xs font-semibold rounded-full px-2 py-0.5 border ${statusClass}`}>{item.statusDisposisi}</span>
                <a href={item.linkDokumen} target="_blank" rel="noopener noreferrer" className="text-accent-color hover:underline font-semibold text-sm transition">Lihat File</a>
            </div>
        </div>
    );
}
