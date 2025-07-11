import { useState } from 'react'; // PERBAIKAN: 'React' tidak perlu diimpor secara eksplisit
import { X } from 'lucide-react';

// --- PATH DIPERBAIKI ---
import Loader from '../../components/ui/Loader.jsx';
import { useNotifier } from '../../contexts/NotificationContext.jsx';
import { db } from '../../services/firebase.js';
// ---

import { collection, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function OPDModal({ data, onClose }) {
    const [formData, setFormData] = useState({ nama: '', jenis: 'OPD', ...data });
    const [isLoading, setIsLoading] = useState(false);
    const notifier = useNotifier();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nama) return notifier.show('Nama Unit Kerja wajib diisi.', 'warning');
        setIsLoading(true);
        try {
            const payload = { ...formData, updatedAt: serverTimestamp() };
            if (data) {
                await updateDoc(doc(db, 'opds', data.id), payload);
            } else {
                payload.createdAt = serverTimestamp();
                await addDoc(collection(db, 'opds'), payload);
            }
            notifier.show('Data Unit Kerja berhasil disimpan.', 'success');
            onClose();
        } catch (error) {
            notifier.show('Gagal menyimpan data: ' + error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text="Menyimpan..." />}
                <button onClick={onClose} className="modal-close-button"><X /></button>
                <h2 className="text-xl font-bold mb-6 text-text-primary">{data ? 'Edit' : 'Tambah'} Unit Kerja</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Nama Unit Kerja" className="form-input-elegant" value={formData.nama} onChange={e => setFormData(p => ({...p, nama: e.target.value}))} required />
                    <select value={formData.jenis} onChange={e => setFormData(p => ({...p, jenis: e.target.value}))} className="form-input-elegant">
                        <option value="OPD">OPD</option>
                        <option value="Kecamatan">Kecamatan</option>
                        <option value="Kelurahan">Kelurahan</option>
                    </select>
                    <button type="submit" className="w-full elegant-btn mt-4" disabled={isLoading}>Simpan</button>
                </form>
            </div>
        </div>
    );
};
