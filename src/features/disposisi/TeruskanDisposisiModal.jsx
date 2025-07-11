import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import Loader from '../UI/Loader';
import TomSelectWrapper from '../UI/TomSelectWrapper';

export default function TeruskanDisposisiModal() {
    const { userInfo } = useAuth();
    const { appData } = useData();
    const { closeModal, modal } = useUI();
    const { data: disposisiInduk } = modal; // Data disposisi yang akan diteruskan

    const [formData, setFormData] = useState({ tujuanJabatanId: '', isiDisposisi: '', catatan: '' });
    const [isLoading, setIsLoading] = useState(false);

    // Filter untuk mendapatkan daftar bawahan langsung dari pengguna yang login
    const bawahanLangsung = useMemo(() => {
        if (!userInfo || !appData.options.jabatan) return [];
        return appData.options.jabatan
            .filter(j => j.atasanId === userInfo.id)
            .map(j => ({ value: j.id, text: `${j.namaJabatan} - ${j.nama}` }));
    }, [appData.options.jabatan, userInfo]);

    const handleSelectChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.tujuanJabatanId || !formData.isiDisposisi) {
            alert("Tujuan dan Instruksi wajib diisi.");
            return;
        }
        setIsLoading(true);
        try {
            const opdId = userInfo.opdId;
            if (!opdId) throw new Error("ID OPD pengguna tidak ditemukan.");

            const payload = {
                ...formData,
                suratMasukId: disposisiInduk.suratMasukId,
                indukDisposisiId: disposisiInduk.id, // Menandakan ini adalah turunan
                instruksiAsal: disposisiInduk.isiDisposisi,
                pemberiDisposisiJabatanId: userInfo.id,
                statusTindakLanjut: 'Baru',
                logTindakLanjut: [],
                createdAt: serverTimestamp()
            };

            await addDoc(collection(db, 'opds', opdId, 'disposisi'), payload);
            alert('Disposisi berhasil diteruskan!');
            closeModal();
        } catch (error) {
            console.error("Gagal meneruskan disposisi:", error);
            alert("Gagal meneruskan disposisi: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay active" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text="Meneruskan Disposisi..." />}
                <button onClick={closeModal} className="modal-close-button"><i data-lucide="x"></i></button>
                <h2 className="text-xl font-bold mb-2 text-text-primary">Teruskan Disposisi</h2>
                <div className="mb-6 p-3 bg-bg-muted/50 rounded-lg">
                    <p className="text-sm text-text-secondary">Instruksi Asal dari Pimpinan:</p>
                    <p className="font-semibold text-text-primary">{disposisiInduk.isiDisposisi}</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TomSelectWrapper options={bawahanLangsung} value={formData.tujuanJabatanId} onChange={v => handleSelectChange('tujuanJabatanId', v)} placeholder="Teruskan ke..." />
                    <textarea name="isiDisposisi" placeholder="Instruksi atau arahan tambahan untuk staf" rows="3" className="form-input-elegant" value={formData.isiDisposisi} onChange={handleInputChange} required></textarea>
                    <textarea name="catatan" placeholder="Catatan tambahan (opsional)" rows="2" className="form-input-elegant" value={formData.catatan} onChange={handleInputChange}></textarea>
                    <button type="submit" className="w-full elegant-btn mt-4" disabled={isLoading}>Teruskan ke Staf</button>
                </form>
            </div>
        </div>
    );
}
