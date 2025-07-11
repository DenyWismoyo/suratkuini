import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';

// --- PATH DIPERBAIKI ---
import TomSelectWrapper from '../../components/ui/TomSelectWrapper.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useNotifier } from '../../contexts/NotificationContext.jsx'; 
import { db } from '../../services/firebase.js';
// ---

import { writeBatch, doc, collection, serverTimestamp } from 'firebase/firestore';

export default function DisposisiModal({ data, onClose, allData, currentUser }) {
    const [formData, setFormData] = useState({ suratMasukId: '', tujuanJabatanId: '', isiDisposisi: '', catatan: '' });
    const [isLoading, setIsLoading] = useState(false);
    const notifier = useNotifier();
    const { suratMasuk, options } = allData;
    const { jabatan } = options;

    const suratUntukDisposisi = useMemo(() => 
        (suratMasuk || []).filter(s => s.statusDisposisi !== 'Sudah Disposisi')
                  .map(s => ({ value: s.id, text: `${s.jenisSurat || 'Surat'} dari ${s.pengirim} - ${s.perihal}` })), 
        [suratMasuk]
    );

    const jabatanUntukDisposisi = useMemo(() => 
        (jabatan || []).filter(j => j.id !== currentUser.id && j.opdId === currentUser.opdId), 
        [jabatan, currentUser]
    );

    const handleSelectChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.suratMasukId || !formData.tujuanJabatanId || !formData.isiDisposisi) {
            return notifier.show("Surat, Tujuan, dan Instruksi wajib diisi.", "warning");
        }
        setIsLoading(true);
        try {
            const opdId = currentUser.opdId;
            if (!opdId) throw new Error("ID OPD pengguna tidak ditemukan.");

            const batch = writeBatch(db);
            const disposisiRef = doc(collection(db, 'opds', opdId, "disposisi"));
            const suratRef = doc(db, 'opds', opdId, "suratMasuk", formData.suratMasukId);
            
            const payload = { 
                ...formData, 
                pemberiDisposisiJabatanId: currentUser.id, 
                statusTindakLanjut: 'Baru', 
                logTindakLanjut: [], 
                createdAt: serverTimestamp() 
            };
            batch.set(disposisiRef, payload);
            batch.update(suratRef, { statusDisposisi: 'Sudah Disposisi' });
            
            await batch.commit();
            
            notifier.show('Disposisi berhasil dikirim!', 'success');
            onClose();
        } catch (error) {
            notifier.show("Gagal mengirim disposisi: " + error.message, "error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text="Mengirim..." />}
                <button onClick={onClose} className="modal-close-button"><X /></button>
                <h2 className="text-xl font-bold mb-6 text-text-primary">Buat Disposisi Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TomSelectWrapper options={suratUntukDisposisi} value={formData.suratMasukId} onChange={v => handleSelectChange('suratMasukId', v)} placeholder="Pilih surat yang akan didisposisi..." />
                    <TomSelectWrapper options={jabatanUntukDisposisi.map(j => ({value: j.id, text: `${j.namaJabatan} - ${j.nama}`}))} value={formData.tujuanJabatanId} onChange={v => handleSelectChange('tujuanJabatanId', v)} placeholder="Disposisikan ke..." />
                    <textarea name="isiDisposisi" placeholder="Isi Instruksi" rows="3" className="form-input-elegant" value={formData.isiDisposisi} onChange={handleInputChange} required></textarea>
                    <textarea name="catatan" placeholder="Catatan tambahan (opsional)" rows="2" className="form-input-elegant" value={formData.catatan} onChange={handleInputChange}></textarea>
                    <button type="submit" className="w-full elegant-btn mt-4" disabled={isLoading}>Kirim Disposisi</button>
                </form>
            </div>
        </div>
    );
};