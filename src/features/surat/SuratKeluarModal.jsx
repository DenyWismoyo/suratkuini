import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import TomSelectWrapper from '../../components/ui/TomSelectWrapper.jsx';
import Loader from '../../components/ui/Loader.jsx';
import { useNotifier } from '../../contexts/NotificationContext.jsx'; // PATH DIPERBAIKI
import { db, storage } from '../../services/firebase.js';
import { doc, addDoc, updateDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function SuratKeluarModal({ data, onClose, allOptions, userInfo }) {
    const [formData, setFormData] = useState({ 
        klasifikasiId: '', nomorUrut: '', tanggalSurat: '', perihal: '', 
        tujuanId: '', sifatSurat: 'Biasa', jenisSurat: '', ...data 
    });
    const [nomorPreview, setNomorPreview] = useState('-- Lengkapi Form --');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const notifier = useNotifier();
    const bulanRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

    useEffect(() => {
        const { klasifikasiId, nomorUrut, tanggalSurat } = formData;
        const klasifikasiTerpilih = (allOptions.klasifikasi || []).find(k => k.id === klasifikasiId);
        if (klasifikasiTerpilih && nomorUrut && tanggalSurat) {
            const tglObj = new Date(tanggalSurat);
            const kodeKlasifikasi = klasifikasiTerpilih.kode;
            const bulan = bulanRomawi[tglObj.getMonth()];
            const tahun = tglObj.getFullYear();
            setNomorPreview(`${kodeKlasifikasi}/${nomorUrut}/${bulan}/${tahun}`);
        } else {
            setNomorPreview('-- Lengkapi Form --');
        }
    }, [formData.klasifikasiId, formData.nomorUrut, formData.tanggalSurat, allOptions.klasifikasi]);

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSelectChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nomorPreview.includes('--')) {
            notifier.show("Nomor surat belum lengkap.", 'warning');
            return;
        }
        setIsLoading(true);
        try {
            const opdId = userInfo.opdId;
            if (!opdId) throw new Error("ID OPD pengguna tidak ditemukan.");

            let fileInfo = { url: data?.linkDokumen || null, path: data?.storagePath || null };
            if (file) {
                const storagePath = `${opdId}/surat-keluar/${Date.now()}-${file.name}`;
                const storageRef = ref(storage, storagePath);
                await uploadBytes(storageRef, file);
                fileInfo = { url: await getDownloadURL(storageRef), path: storagePath };
            }

            const payload = { 
                ...formData, 
                nomorSurat: nomorPreview,
                tanggalSurat: new Date(formData.tanggalSurat), 
                linkDokumen: fileInfo.url, 
                storagePath: fileInfo.path, 
                updatedAt: serverTimestamp() 
            };
            
            const collectionRef = collection(db, 'opds', opdId, 'suratKeluar');

            if (!data) {
                payload.createdAt = serverTimestamp();
                await addDoc(collectionRef, payload);
            } else {
                const docRef = doc(db, 'opds', opdId, 'suratKeluar', data.id);
                await updateDoc(docRef, payload);
            }
            notifier.show('Surat keluar berhasil disimpan!', 'success');
            onClose();
        } catch (error) {
            console.error(error);
            notifier.show("Gagal menyimpan surat keluar: " + error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const { klasifikasi = [], tujuan = [], jenisSurat = [] } = allOptions;
    const sifatOptions = [{nama: "Biasa"}, {nama: "Rahasia"}, {nama: "Segera"}, {nama: "Penting"}];
    
    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text="Menyimpan..." />}
                <button onClick={onClose} className="modal-close-button"><X /></button>
                <h2 className="text-xl font-bold mb-6 text-text-primary">{data ? 'Edit' : 'Tambah'} Surat Keluar</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <TomSelectWrapper options={klasifikasi.map(k => ({value: k.id, text: `${k.kode} - ${k.keterangan}`}))} value={formData.klasifikasiId} onChange={v => handleSelectChange('klasifikasiId', v)} placeholder="Cari klasifikasi..." />
                    <input type="text" name="nomorUrut" placeholder="e.g., 098" className="form-input-elegant" value={formData.nomorUrut} onChange={handleInputChange} required />
                    <input type="date" name="tanggalSurat" className="form-input-elegant" value={formData.tanggalSurat} onChange={handleInputChange} required />
                    <div className="p-3 bg-bg-base rounded-md text-center font-mono text-text-secondary border border-border-color">{nomorPreview}</div>
                    <textarea name="perihal" placeholder="Perihal" rows="3" className="form-input-elegant" value={formData.perihal} onChange={handleInputChange} required></textarea>
                    <TomSelectWrapper options={tujuan.map(t => ({value: t.nama, text: t.nama}))} value={formData.tujuanId} onChange={v => handleSelectChange('tujuanId', v)} placeholder="Cari tujuan..." allowCreate={true} />
                    <TomSelectWrapper options={sifatOptions.map(t => ({value: t.nama, text: t.nama}))} value={formData.sifatSurat} onChange={v => handleSelectChange('sifatSurat', v)} placeholder="Pilih sifat..." />
                    <TomSelectWrapper options={jenisSurat.map(t => ({value: t.nama, text: t.nama}))} value={formData.jenisSurat} onChange={v => handleSelectChange('jenisSurat', v)} placeholder="Pilih jenis..." allowCreate={true} />
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">File Surat (Kosongkan jika tidak berubah)</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-color/20 file:text-accent-color hover:file:bg-accent-color/30 transition cursor-pointer" />
                    </div>
                    <button type="submit" className="w-full elegant-btn mt-4" disabled={isLoading}>Simpan</button>
                </form>
            </div>
        </div>
    );
};
