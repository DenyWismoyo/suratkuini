import { User, Calendar, FileEdit, History } from 'lucide-react';

export default function SuratMasukCard({ item, index, onEdit, openModal }) {
    const tglSurat = item.tanggalSurat?.toDate ? item.tanggalSurat.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
    
    const statusMap = {
        'Belum Disposisi': 'border-yellow-400/50 text-yellow-400',
        'Sudah Disposisi': 'border-green-400/50 text-green-400',
    };
    const statusClass = statusMap[item.statusDisposisi] || 'border-gray-400/50 text-gray-400';

    return (
        <div 
            className="bg-bg-surface border border-border-color rounded-lg p-4 flex flex-col gap-4 transition-all duration-300 hover:border-accent-color hover:shadow-lg hover:shadow-accent-color/10"
            style={{ animationDelay: `${index * 50}ms`, animation: 'slide-up-fade-in 0.5s ease-out forwards', opacity: 0 }}
        >
            {/* Header Kartu */}
            <div className="flex justify-between items-start gap-2">
                <h3 className="text-base font-bold text-text-primary leading-tight flex-1">{item.perihal}</h3>
                <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => openModal('detailSurat', item)} className="p-1.5 text-text-secondary hover:bg-bg-muted rounded-full transition" title="Lihat Riwayat">
                        <History className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(item)} className="p-1.5 text-text-secondary hover:bg-bg-muted rounded-full transition" title="Edit Surat">
                        <FileEdit className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap items-center text-xs text-text-secondary gap-x-4 gap-y-1">
                <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> {item.pengirim || 'N/A'}</span>
                <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {tglSurat}</span>
            </div>

            {/* Footer Kartu */}
            <div className="border-t border-border-color/50 pt-3 flex justify-between items-center">
                <span className={`text-xs font-semibold rounded-full px-2.5 py-1 border ${statusClass}`}>{item.statusDisposisi}</span>
                <a href={item.linkDokumen} target="_blank" rel="noopener noreferrer" className="text-accent-color hover:text-accent-hover font-semibold text-sm transition-colors">
                    Lihat File
                </a>
            </div>
        </div>
    );
};
