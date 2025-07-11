import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loader from '../UI/Loader';
import TomSelectWrapper from '../UI/TomSelectWrapper';

export default function SuratMasukModal() {
    const { userInfo } = useAuth();
    const { appData } = useData();
    const { closeModal, modal } = useUI();
    const { data } = modal; // Data surat jika dalam mode edit

    const initialState = {
        nomorSurat: '',
        tanggalSurat: '',
        pengirim: '',
        perihal: '',
        sifatSurat: 'Biasa',
        jenisSurat: '',
        waktuPelaksanaan: '',
        tempatPelaksanaan: '',
    };

    const [formData, setFormData] = useState(initialState);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Jika ada data (mode edit), isi form dengan data tersebut
        if (data) {
            const formattedData = { ...initialState, ...data };
            if (data.tanggalSurat?.toDate) {
                formattedData.tanggalSurat = data.tanggalSurat.toDate().toISOString().split('T')[0];
            }
            if (data.waktuPelaksanaan?.toDate) {
                const d = data.waktuPelaksanaan.toDate();
                d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
                formattedData.waktuPelaksanaan = d.toISOString().slice(0, 16);
            }
            setFormData(formattedData);
        } else {
            setFormData(initialState);
        }
    }, [data]);

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSelectChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const opdId = userInfo.opdId;
            if (!opdId) throw new Error("ID OPD pengguna tidak ditemukan.");

            let fileInfo = { url: data?.linkDokumen || null, path: data?.storagePath || null };
            if (file) {
                const storagePath = `${opdId}/surat-masuk/${Date.now()}-${file.name}`;
                const storageRef = ref(storage, storagePath);
                await uploadBytes(storageRef, file);
                fileInfo = { url: await getDownloadURL(storageRef), path: storagePath };
            }

            const payload = {
                ...formData,
                tanggalSurat: new Date(formData.tanggalSurat),
                waktuPelaksanaan: formData.jenisSurat === 'Undangan' && formData.waktuPelaksanaan ? new Date(formData.waktuPelaksanaan) : null,
                linkDokumen: fileInfo.url,
                storagePath: fileInfo.path,
                updatedAt: serverTimestamp()
            };

            const collectionRef = collection(db, 'opds', opdId, 'suratMasuk');

            if (data) { // Mode Edit
                const docRef = doc(db, 'opds', opdId, 'suratMasuk', data.id);
                await updateDoc(docRef, payload);
            } else { // Mode Tambah
                payload.createdAt = serverTimestamp();
                payload.statusDisposisi = 'Belum Disposisi';
                payload.diinputOleh = { id: userInfo.id, nama: userInfo.nama, jabatan: userInfo.namaJabatan };
                await addDoc(collectionRef, payload);
            }
            
            alert('Data berhasil disimpan!'); // Ganti dengan notifikasi
            closeModal();
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan data: " + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const { tujuan, jenisSurat } = appData.options;
    const sifatOptions = [{nama: "Biasa"}, {nama: "Rahasia"}, {nama: "Segera"}, {nama: "Penting"}];

    return (
        <div className="modal-overlay active" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text="Menyimpan..." />}
                <button onClick={closeModal} className="modal-close-button"><i data-lucide="x"></i></button>
                <h2 className="text-xl font-bold mb-6 text-text-primary">{data ? 'Edit' : 'Tambah'} Surat Masuk</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="nomorSurat" placeholder="Nomor Surat" className="form-input-elegant" value={formData.nomorSurat} onChange={handleInputChange} />
                    <input type="date" name="tanggalSurat" className="form-input-elegant" value={formData.tanggalSurat} onChange={handleInputChange} required />
                    <TomSelectWrapper options={tujuan.map(t => ({value: t.nama, text: t.nama}))} value={formData.pengirim} onChange={v => handleSelectChange('pengirim', v)} placeholder="Cari pengirim..." allowCreate={true} />
                    <textarea name="perihal" placeholder="Perihal" rows="3" className="form-input-elegant" value={formData.perihal} onChange={handleInputChange} required></textarea>
                    <TomSelectWrapper options={sifatOptions.map(t => ({value: t.nama, text: t.nama}))} value={formData.sifatSurat} onChange={v => handleSelectChange('sifatSurat', v)} placeholder="Pilih sifat..." />
                    <TomSelectWrapper options={jenisSurat.map(t => ({value: t.nama, text: t.nama}))} value={formData.jenisSurat} onChange={v => handleSelectChange('jenisSurat', v)} placeholder="Pilih jenis..." allowCreate={true} />
                    {formData.jenisSurat === 'Undangan' && (
                        <div className="space-y-4 border-t border-border-color pt-4 mt-4">
                            <input type="datetime-local" name="waktuPelaksanaan" className="form-input-elegant" value={formData.waktuPelaksanaan} onChange={handleInputChange} />
                            <input type="text" name="tempatPelaksanaan" placeholder="Lokasi acara" className="form-input-elegant" value={formData.tempatPelaksanaan} onChange={handleInputChange} />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">File Surat (Kosongkan jika tidak berubah)</label>
                        <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-color/20 file:text-accent-color hover:file:bg-accent-color/30 transition cursor-pointer" />
                    </div>
                    <button type="submit" className="w-full elegant-btn mt-4" disabled={isLoading}>Simpan</button>
                </form>
            </div>
        </div>
    );
}
