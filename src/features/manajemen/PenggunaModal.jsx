import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import TomSelectWrapper from '../../components/ui/TomSelectWrapper.jsx';
import Loader from '../../components/ui/Loader.jsx';
// --- PATH DIPERBAIKI ---
import { useNotifier } from '../../contexts/NotificationContext.jsx';
import { auth, db } from '../../services/firebase.js';
// ---
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export default function PenggunaModal({ data, onClose, allOptions, currentUser }) {
    const isEdit = !!data?.id;
    const [formData, setFormData] = useState({ 
        email: '', password: '', nama: '', namaJabatan: '', peran: 'staf', 
        opdId: data?.opdId || '', atasanId: '', nomorTelepon: '', ...data 
    });
    const [isLoading, setIsLoading] = useState(false);
    const notifier = useNotifier();
    const { jabatan: allUsers = [], opds = [] } = allOptions;

    const atasanOptions = useMemo(() => {
        if (!formData.opdId) return [];
        return allUsers
            .filter(u => u.opdId === formData.opdId && u.id !== formData.id)
            .map(u => ({ value: u.id, text: `${u.nama} (${u.namaJabatan})` }));
    }, [formData.opdId, allUsers, formData.id]);

    const opdOptions = useMemo(() => opds.map(opd => ({ value: opd.id, text: opd.nama })), [opds]);

    const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSelectChange = (key, value) => setFormData(p => ({...p, [key]: value}));
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || (!isEdit && !formData.password) || !formData.nama || !formData.namaJabatan) {
            return notifier.show("Email, Nama, Jabatan, dan Password (baru) wajib diisi.", "warning");
        }
        if (formData.peran !== 'super_admin' && !formData.opdId) {
            return notifier.show("Unit Kerja (OPD) wajib dipilih.", "warning");
        }
        setIsLoading(true);
        
        try {
            if (isEdit) {
                const updatePayload = {
                    nama: formData.nama,
                    namaJabatan: formData.namaJabatan,
                    peran: formData.peran,
                    opdId: formData.peran === 'super_admin' ? null : formData.opdId,
                    atasanId: formData.peran === 'super_admin' ? null : (formData.atasanId || null),
                    nomorTelepon: formData.nomorTelepon || null,
                    updatedAt: serverTimestamp()
                };
                await updateDoc(doc(db, "jabatan", data.id), updatePayload);
                notifier.show("Data pengguna berhasil diperbarui.", "success");
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const newUser = userCredential.user;
                
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
                notifier.show("Pengguna baru berhasil ditambahkan!", "success");
            }
            onClose();
        } catch (error) {
            let friendlyMessage = "Terjadi kesalahan: " + error.message;
            if (error.code === 'auth/email-already-in-use') friendlyMessage = 'Email ini sudah terdaftar.';
            if (error.code === 'auth/weak-password') friendlyMessage = 'Password terlalu lemah (min. 6 karakter).';
            notifier.show(friendlyMessage, "error");
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

    const peranOptions = currentUser.peran === 'super_admin' 
        ? allPeranOptions 
        : allPeranOptions.filter(p => p.value !== 'super_admin');

    return (
        <div className="modal-overlay active" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isLoading && <Loader text={isEdit ? "Memperbarui..." : "Menambahkan..."} />}
                <button onClick={onClose} className="modal-close-button"><X /></button>
                <h2 className="text-xl font-bold mb-6 text-text-primary">{isEdit ? 'Edit' : 'Tambah'} Pengguna</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="nama" placeholder="Nama Lengkap" className="form-input-elegant" value={formData.nama} onChange={handleInputChange} required />
                    <input type="text" name="namaJabatan" placeholder="Nama Jabatan" className="form-input-elegant" value={formData.namaJabatan} onChange={handleInputChange} required />
                    <input type="email" name="email" placeholder="Alamat Email" className="form-input-elegant" value={formData.email} onChange={handleInputChange} required disabled={isEdit} />
                    {!isEdit && <input type="password" name="password" placeholder="Password (min. 6 karakter)" className="form-input-elegant" value={formData.password} onChange={handleInputChange} required />}
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Peran</label>
                        <TomSelectWrapper options={peranOptions} value={formData.peran} onChange={v => handleSelectChange('peran', v)} />
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
};
