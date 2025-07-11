import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { db } from '../../config/firebase';
import { collection, doc, writeBatch, serverTimestamp } from 'firebase/firestore';
import Loader from '../UI/Loader';
import TomSelectWrapper from '../UI/TomSelectWrapper';

export default function DisposisiModal() {
    const { userInfo } = useAuth();
    const { appData } = useData();
    const { closeModal } = useUI();

    const [formData, setFormData] = useState({
        suratMasukId: '',
        tujuanJabatanId: '',
        isiDisposisi: '',
        catatan: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    // Filter surat masuk yang belum didisposisi
    const suratUntukDisposisi = useMemo(() => {
        return appData.suratMasuk
            .filter(s => s.statusDisposisi !== 'Sudah Disposisi')
            .map(s => ({ value: s.id, text: `${s.jenisSurat || 'Surat'} dari ${s.pengirim} - ${s.perihal}` }));
    }, [appData.suratMasuk]);

    // Filter jabatan tujuan disposisi (semua di OPD yang sama, kecuali diri sendiri)
    const jabatanUntukDisposisi = useMemo(() => {
        return appData.options.jabatan
            .filter(j => j.id !== userInfo.id && j.opdId === userInfo.opdId)
            .map(j => ({ value: j.id, text: `${j.namaJabatan} - ${j.nama}` }));
    }, [appData.options.jabatan, userInfo]);

    const handleSelectChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.suratMasukId || !formData.tujuanJabatanId || !formData.isiDisposisi) {
            alert("Surat, Tujuan, dan Instruksi wajib diisi.");
            return;
        }
        setIsLoading(true);

        try {
            const opdId = userInfo.opdId;
            if (!opdId) throw new Error("ID OPD pengguna tidak ditemukan.");

            // Gunakan batch write untuk memastikan kedua operasi (buat disposisi & update surat) berhasil atau gagal bersamaan
            const batch = writeBatch(db);

            // 1. Referensi untuk dokumen disposisi baru
            const disposisiRef = doc(collection(db, 'opds', opdId, 'disposisi'));
            const payload = {
                ...formData,
                pemberiDisposisiJabatanId: userInfo.id,
                statusTindakLanjut: 'Baru',
                logTindakLanjut: [],
                createdAt: serverTimestamp()
            };
            batch.set(disposisiRef, payload);

            // 2. Referensi untuk mengupdate status surat masuk
            const suratRef = doc(db, 'opds', opdId, 'suratMasuk', formData.suratMasukId);
            batch.update(suratRef, { statusDisposisi: 'Sudah Disposisi' });

            // Commit batch
            await batch.commit();

            alert('Disposisi berhasil dikirim!');
            closeModal();
        } catch (error) {
            console.error("Gagal mengirim disposisi:", error);
            alert("Gagal mengirim disposisi: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay active" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text="Mengirim..." />}
                <button onClick={closeModal} className="modal-close-button"><i data-lucide="x"></i></button>
                <h2 className="text-xl font-bold mb-6 text-text-primary">Buat Disposisi Baru</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TomSelectWrapper options={suratUntukDisposisi} value={formData.suratMasukId} onChange={v => handleSelectChange('suratMasukId', v)} placeholder="Pilih surat yang akan didisposisi..." />
                    <TomSelectWrapper options={jabatanUntukDisposisi} value={formData.tujuanJabatanId} onChange={v => handleSelectChange('tujuanJabatanId', v)} placeholder="Disposisikan ke..." />
                    <textarea name="isiDisposisi" placeholder="Isi Instruksi" rows="3" className="form-input-elegant" value={formData.isiDisposisi} onChange={handleInputChange} required></textarea>
                    <textarea name="catatan" placeholder="Catatan tambahan (opsional)" rows="2" className="form-input-elegant" value={formData.catatan} onChange={handleInputChange}></textarea>
                    <button type="submit" className="w-full elegant-btn mt-4" disabled={isLoading}>Kirim Disposisi</button>
                </form>
            </div>
        </div>
    );
}
