import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Loader from '../UI/Loader';

export default function LaporanSelesaiModal() {
    const { userInfo } = useAuth();
    const { closeModal, modal } = useUI();
    const { data: disposisi } = modal; // Data disposisi yang akan diselesaikan

    const [laporan, setLaporan] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!laporan) {
            alert("Laporan tidak boleh kosong.");
            return;
        }
        setIsLoading(true);
        try {
            const opdId = userInfo.opdId;
            if (!opdId) throw new Error("ID OPD pengguna tidak ditemukan.");

            const disposisiRef = doc(db, 'opds', opdId, 'disposisi', disposisi.id);

            const laporanPayload = {
                user: userInfo.namaJabatan,
                laporan: laporan,
                timestamp: new Date().toISOString()
            };

            await updateDoc(disposisiRef, {
                statusTindakLanjut: 'Selesai',
                laporanTindakLanjut: laporanPayload
            });

            alert("Tugas telah diselesaikan dan laporan terkirim.");
            closeModal();
        } catch (error) {
            console.error("Gagal menyelesaikan tugas:", error);
            alert("Gagal menyelesaikan tugas: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay active" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text="Menyelesaikan Tugas..." />}
                <button onClick={closeModal} className="modal-close-button"><i data-lucide="x"></i></button>
                <h2 className="text-xl font-bold mb-6 text-text-primary">Laporan Hasil Tindak Lanjut</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea placeholder="Tuliskan laporan hasil pekerjaan Anda di sini..." rows="6" className="form-input-elegant" value={laporan} onChange={e => setLaporan(e.target.value)} required></textarea>
                    <button type="submit" className="w-full elegant-btn mt-4" disabled={isLoading}>Selesaikan & Kirim Laporan</button>
                </form>
            </div>
        </div>
    );
}
