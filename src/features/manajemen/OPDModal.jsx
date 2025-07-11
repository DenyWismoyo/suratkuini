import { useState, useEffect } from 'react';
import { useUI } from '../../context/UIContext';
import { db } from '../../config/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import Loader from '../UI/Loader';

export default function OPDModal() {
    const { closeModal, modal } = useUI();
    const { data } = modal;
    const isEdit = !!data?.id;

    const [formData, setFormData] = useState({ nama: '', jenis: 'OPD' });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData({ nama: data.nama, jenis: data.jenis || 'OPD' });
        }
    }, [data]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.nama) return alert('Nama Unit Kerja wajib diisi.');
        setIsLoading(true);
        try {
            const payload = { ...formData, updatedAt: serverTimestamp() };
            if (isEdit) {
                await updateDoc(doc(db, 'opds', data.id), payload);
            } else {
                payload.createdAt = serverTimestamp();
                await addDoc(collection(db, 'opds'), payload);
            }
            alert('Data Unit Kerja berhasil disimpan.');
            closeModal();
        } catch (error) {
            console.error(error);
            alert('Gagal menyimpan data: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay active" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text="Menyimpan..." />}
                <button onClick={closeModal} className="modal-close-button"><i data-lucide="x"></i></button>
                <h2 className="text-xl font-bold mb-6 text-text-primary">{isEdit ? 'Edit' : 'Tambah'} Unit Kerja</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Nama Unit Kerja (e.g., Dinas Pendidikan)" className="form-input-elegant" value={formData.nama} onChange={e => setFormData(p => ({...p, nama: e.target.value}))} required />
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
}