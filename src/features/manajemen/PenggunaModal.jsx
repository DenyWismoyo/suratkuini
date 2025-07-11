import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import { db, auth as firebaseAuth } from '../../config/firebase';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import Loader from '../UI/Loader';
import TomSelectWrapper from '../UI/TomSelectWrapper';

export default function PenggunaModal() {
    const { userInfo: currentUserInfo } = useAuth();
    const { appData } = useData();
    const { closeModal, modal } = useUI();
    const { data } = modal;
    const isEdit = !!data?.id;

    const initialState = {
        email: '', password: '', nama: '', namaJabatan: '', peran: 'staf', 
        opdId: data?.opdId || '', atasanId: '', nomorTelepon: '',
    };

    const [formData, setFormData] = useState(initialState);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData({ ...initialState, ...data });
        } else {
            setFormData(initialState);
        }
    }, [data]);

    const { opds, jabatan: allUsers } = appData.options;

    const atasanOptions = useMemo(() => {
        if (!formData.opdId) return [];
        return allUsers
            .filter(u => u.opdId === formData.opdId && u.id !== formData.id)
            .map(u => ({ value: u.id, text: `${u.nama} (${u.namaJabatan})` }));
    }, [formData.opdId, allUsers, formData.id]);

    const opdOptions = useMemo(() => opds.map(opd => ({ value: opd.id, text: opd.nama })), [opds]);

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSelectChange = (key, value) => {
        const newState = { ...formData, [key]: value };
        if (key === 'peran' && value === 'super_admin') {
            newState.opdId = '';
            newState.atasanId = '';
        }
        setFormData(newState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validasi form
        if (!formData.email || (!isEdit && !formData.password) || !formData.nama || !formData.namaJabatan) {
            return alert("Field Email, Nama, Jabatan, dan Password (saat tambah baru) wajib diisi.");
        }
        if (formData.peran !== 'super_admin' && !formData.opdId) {
            return alert("Unit Kerja (OPD) wajib dipilih untuk peran selain Super Admin.");
        }
        if (!isEdit && formData.password.length < 6) {
            return alert("Password minimal harus 6 karakter.");
        }
        setIsLoading(true);

        try {
            if (isEdit) {
                const updatePayload = {
                    nama: formData.nama,
                    namaJabatan: formData.namaJabatan,
                    peran: formData.peran,
                    atasanId: formData.peran === 'super_admin' ? null : (formData.atasanId || null),
                    opdId: formData.peran === 'super_admin' ? null : formData.opdId,
                    nomorTelepon: formData.nomorTelepon || null,
                    updatedAt: serverTimestamp()
                };
                await updateDoc(doc(db, "jabatan", data.id), updatePayload);
                alert("Data pengguna berhasil diperbarui.");
            } else {
                // Buat user di Firebase Auth
                const userCredential = await createUserWithEmailAndPassword(firebaseAuth, formData.email, formData.password);
                const newUser = userCredential.user;
                
                // Simpan profil user di Firestore
                const userPayload = {
                    nama: formData.nama,
                    namaJabatan: formData.namaJabatan,
                    peran: formData.peran,
                    email: formData.email,
                    opdId: formData.peran === 'super_admin' ? null : formData.opdId,
                    atasanId: formData.peran === 'super_admin' ? null : (formData.atasanId || null),
                    nomorTelepon: formData.nomorTelepon || null,
                    createdAt: serverTimestamp()
                };
                await setDoc(doc(db, "jabatan", newUser.uid), userPayload);
                alert("Pengguna baru berhasil ditambahkan!");
            }
            closeModal();
        } catch (error) {
            console.error("Gagal menyimpan pengguna:", error);
            let friendlyMessage = error.message;
            if (error.code === 'auth/email-already-in-use') {
                friendlyMessage = 'Alamat email ini sudah terdaftar.';
            } else if (error.code === 'auth/weak-password') {
                friendlyMessage = 'Password terlalu lemah.';
            }
            alert(friendlyMessage);
        } finally {
            setIsLoading(false);
        }
    };
    
    const allPeranOptions = [
        { value: 'super_admin', text: 'Super Admin' }, { value: 'admin', text: 'Admin' },
        { value: 'pimpinan', text: 'Pimpinan' }, { value: 'tu_pimpinan', text: 'TU Pimpinan' },
        { value: 'tu_opd', text: 'TU OPD' }, { value: 'pejabat_struktural', text: 'Pejabat Struktural' },
        { value: 'staf', text: 'Staf' }
    ];

    return (
        <div className="modal-overlay active" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text={isEdit ? "Memperbarui..." : "Menambahkan..."} />}
                <button onClick={closeModal} className="modal-close-button"><i data-lucide="x"></i></button>
                <h2 className="text-xl font-bold mb-6 text-text-primary">{isEdit ? 'Edit' : 'Tambah'} Pengguna</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="nama" placeholder="Nama Lengkap" className="form-input-elegant" value={formData.nama} onChange={handleInputChange} required />
                    <input type="text" name="namaJabatan" placeholder="Nama Jabatan" className="form-input-elegant" value={formData.namaJabatan} onChange={handleInputChange} required />
                    <input type="email" name="email" placeholder="Alamat Email" className="form-input-elegant" value={formData.email} onChange={handleInputChange} required disabled={isEdit} />
                    <input type="tel" name="nomorTelepon" placeholder="Nomor Telepon (Opsional)" className="form-input-elegant" value={formData.nomorTelepon} onChange={handleInputChange} />
                    {!isEdit && <input type="password" name="password" placeholder="Password (min. 6 karakter)" className="form-input-elegant" value={formData.password} onChange={handleInputChange} required />}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Peran</label>
                        <TomSelectWrapper options={allPeranOptions} value={formData.peran} onChange={v => handleSelectChange('peran', v)} />
                    </div>
                    {formData.peran !== 'super_admin' && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Unit Kerja (OPD)</label>
                                <TomSelectWrapper options={opdOptions} value={formData.opdId} onChange={v => handleSelectChange('opdId', v)} placeholder="Pilih OPD..."/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Atasan Langsung</label>
                                <TomSelectWrapper options={atasanOptions} value={formData.atasanId} onChange={v => handleSelectChange('atasanId', v)} placeholder="Pilih atasan... (opsional)" />
                            </div>
                        </>
                    )}
                    <button type="submit" className="w-full elegant-btn mt-4" disabled={isLoading}>Simpan</button>
                </form>
            </div>
        </div>
    );
}
