import React, { useState, useMemo } from 'react';
// import TomSelectWrapper from '../../components/ui/TomSelectWrapper'; // Asumsi TomSelect dipecah

export default function OPDSelectionModal({ opdList, onSelect, onSkip }) {
    const [selectedOpdId, setSelectedOpdId] = useState('');
    
    // TomSelectWrapper belum kita buat, jadi kita gunakan select biasa untuk sementara
    const opdOptions = useMemo(() => opdList.map(opd => ({ value: opd.id, text: opd.nama })), [opdList]);

    const handleContinue = () => {
        if (selectedOpdId) {
            const selected = opdList.find(opd => opd.id === selectedOpdId);
            onSelect(selected);
        }
    };

    return (
        <div className="modal-overlay active" style={{ zIndex: 3000 }}>
            <div className="modal-content">
                <h2 className="text-xl font-bold mb-2 text-text-primary">Pilih Sesi Kerja</h2>
                <p className="text-text-secondary mb-6">Sebagai Super Admin, Anda dapat memilih untuk mengelola satu Unit Kerja spesifik atau bekerja di level Pusat.</p>
                <div className="space-y-4">
                    <select 
                        value={selectedOpdId} 
                        onChange={(e) => setSelectedOpdId(e.target.value)}
                        className="form-input-elegant"
                    >
                        <option value="">Pilih Unit Kerja...</option>
                        {opdOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.text}</option>)}
                    </select>
                    
                    <button onClick={handleContinue} className="w-full elegant-btn mt-2" disabled={!selectedOpdId}>
                        Masuk ke OPD
                    </button>
                    <div className="relative flex py-3 items-center">
                        <div className="flex-grow border-t border-border-color"></div>
                        <span className="flex-shrink mx-4 text-text-secondary text-sm">ATAU</span>
                        <div className="flex-grow border-t border-border-color"></div>
                    </div>
                    <button onClick={onSkip} className="w-full elegant-btn bg-bg-muted text-text-primary hover:bg-border-color">
                        Masuk ke Sesi Pusat
                    </button>
                </div>
            </div>
        </div>
    );
};