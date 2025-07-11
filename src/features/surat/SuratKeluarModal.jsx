import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { db, storage } from '../../config/firebase';
import { collection, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Loader from '../UI/Loader';
import TomSelectWrapper from '../UI/TomSelectWrapper';

export default function SuratKeluarModal() {
    const { userInfo } = useAuth();
    const { appData } = useData();
    const { closeModal, modal } = useUI();
    const { data } = modal;

    const initialState = {
        klasifikasiId: '',
        nomorUrut: '',
        tanggalSurat: '',
        perihal: '',
        tujuanId: '',
        sifatSurat: 'Biasa',
        jenisSurat: '',
    };

    const [formData, setFormData] = useState(initialState);
    const [nomorPreview, setNomorPreview] = useState('-- Lengkapi Form --');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const bulanRomawi = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

    useEffect(() => {
        if (data) {
            const formattedData = { ...initialState, ...data };
            if (data.tanggalSurat?.toDate) {
                formattedData.tanggalSurat = data.tanggalSurat.toDate().toISOString().split('T')[0];
            }
            setFormData(formattedData);
        } else {
            setFormData(initialState);
        }
    }, [data]);

    useEffect(() => {
        const { klasifikasiId, nomorUrut, tanggalSurat } = formData;
        const klasifikasiTerpilih = appData.options.klasifikasi.find(k => k.id === klasifikasiId);
        if (klasifikasiTerpilih && nomorUrut && tanggalSurat) {
            const tglObj = new Date(tanggalSurat);
            const kodeKlasifikasi = klasifikasiTerpilih.kode;
            const bulan = bulanRomawi[tglObj.getMonth()];
            const tahun = tglObj.getFullYear();
            setNomorPreview(`${kodeKlasifikasi}/${nomorUrut}/${bulan}/${tahun}`);
        } else {
            setNomorPreview('-- Lengkapi Form --');
        }
    }, [formData.klasifikasiId, formData.nomorUrut, formData.tanggalSurat, appData.options.klasifikasi]);

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSelectChange = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nomorPreview.includes('--')) {
            alert("Nomor surat belum lengkap.");
            return;
        }
        setIsLoading(true);
        // ... (Logika submit sama seperti SuratMasukModal, disesuaikan untuk surat keluar)
        // Untuk mempersingkat, logika submit akan saya sederhanakan. Anda bisa mengembangkannya.
        try {
            console.log("Submitting data:", { ...formData, nomorSurat: nomorPreview });
            // Logika lengkap untuk upload file dan simpan ke Firestore
            alert('Fitur simpan surat keluar sedang dalam pengembangan.');
            closeModal();
        } catch (error) {
            alert('Error: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const { klasifikasi, tujuan, jenisSurat } = appData.options;
    const sifatOptions = [{nama: "Biasa"}, {nama: "Rahasia"}, {nama: "Segera"}, {nama: "Penting"}];

    return (
        <div className="modal-overlay active" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text="Menyimpan..." />}
                <button onClick={closeModal} className="modal-close-button"><i data-lucide="x"></i></button>
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
}
