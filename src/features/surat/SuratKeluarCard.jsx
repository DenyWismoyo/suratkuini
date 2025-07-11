import { FileEdit } from 'lucide-react';
// Impor React tidak dibutuhkan di Vite
// import React from 'react'; 

export default function SuratKeluarCard({ item, index, onEdit }) {
    const tglSurat = item.tanggalSurat?.toDate ? item.tanggalSurat.toDate().toLocaleDateString('id-ID') : 'N/A';
    
    return (
        <div className="elegant-card flex flex-col justify-between h-full" style={{ animationDelay: `${index * 50}ms` }}>
            <div>
                <div className="flex justify-between items-start gap-4">
                    <h3 className="font-bold text-text-primary text-md flex-1">{item.perihal}</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => onEdit(item)} className="p-1 text-text-secondary hover:text-text-primary transition">
                            <FileEdit className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <p className="text-sm text-text-secondary mt-2 font-mono">{item.nomorSurat}</p>
                <p className="text-sm text-text-secondary">Tujuan: <span className="font-medium text-text-primary">{item.tujuanId}</span></p>
            </div>
            <div className="mt-4 pt-4 border-t border-border-color text-right">
                <a href={item.linkDokumen} target="_blank" rel="noopener noreferrer" className="text-accent-color hover:underline font-semibold text-sm transition">
                    Lihat File
                </a>
            </div>
        </div>
    );
};
