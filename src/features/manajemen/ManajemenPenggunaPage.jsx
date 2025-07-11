import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import Loader from '../../components/UI/Loader';
import TomSelectWrapper from '../../components/UI/TomSelectWrapper';

export default function ManajemenPenggunaPage() {
    const { userInfo } = useAuth();
    const { appData, loading } = useData();
    const { openModal } = useUI();

    const { jabatan: allUsers, opds } = appData.options;
    const [selectedOpd, setSelectedOpd] = useState(userInfo?.peran !== 'super_admin' ? userInfo?.opdId : '');

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [allUsers]);

    const usersInOpd = useMemo(() => {
        if (!selectedOpd) return [];
        return allUsers.filter(u => u.opdId === selectedOpd);
    }, [selectedOpd, allUsers]);

    const opdOptions = useMemo(() => opds.map(opd => ({ value: opd.id, text: opd.nama })), [opds]);

    const handleAddUser = () => {
        // Saat menambah, kita bisa teruskan opdId yang terpilih agar form terisi otomatis
        openModal('pengguna', { opdId: selectedOpd });
    };

    if (loading) {
        return <Loader text="Memuat data pengguna..." />;
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-text-primary">Manajemen Pengguna</h1>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    {userInfo.peran === 'super_admin' && (
                         <div className="w-full md:w-64">
                            <TomSelectWrapper options={opdOptions} value={selectedOpd} onChange={setSelectedOpd} placeholder="Pilih Unit Kerja..." />
                        </div>
                    )}
                    <button onClick={handleAddUser} className="elegant-btn p-2.5" disabled={!selectedOpd}>
                        <i data-lucide="plus" className="w-5 h-5"></i>
                    </button>
                </div>
            </div>

            <div className="bg-bg-surface rounded-lg border border-border-color overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-bg-muted/30">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-text-secondary">Nama</th>
                            <th className="p-4 text-sm font-semibold text-text-secondary hidden md:table-cell">Jabatan</th>
                            <th className="p-4 text-sm font-semibold text-text-secondary">Peran</th>
                            <th className="p-4 text-sm font-semibold text-text-secondary">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersInOpd.length > 0 ? usersInOpd.map(user => (
                            <tr key={user.id} className="border-t border-border-color">
                                <td className="p-4 align-top">
                                    <p className="font-semibold text-text-primary">{user.nama}</p>
                                    <p className="text-text-secondary text-xs">{user.email}</p>
                                    {user.nomorTelepon && <p className="text-text-secondary text-xs mt-1">{user.nomorTelepon}</p>}
                                </td>
                                <td className="p-4 text-text-secondary hidden md:table-cell align-top">{user.namaJabatan}</td>
                                <td className="p-4 align-top">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-accent-color/20 text-accent-color capitalize">{(user.peran || 'pengguna').replace(/_/g, ' ')}</span>
                                </td>
                                <td className="p-4 align-top">
                                    <button onClick={() => openModal('pengguna', user)} className="text-blue-accent hover:opacity-80 p-1"><i data-lucide="edit" className="w-4 h-4"></i></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center p-8 text-text-secondary">{selectedOpd ? 'Tidak ada pengguna di unit kerja ini.' : 'Pilih Unit Kerja untuk melihat pengguna.'}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
