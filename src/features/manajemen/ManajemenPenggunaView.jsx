import React, { useState, useMemo } from 'react';
import { Plus, Edit } from 'lucide-react';
import TomSelectWrapper from '../../components/ui/TomSelectWrapper.jsx';

export default function ManajemenPenggunaView({ appData, openModal, userInfo }) {
    const { jabatan: allUsers = [], opds = [] } = appData.options;
    const [selectedOpd, setSelectedOpd] = useState(userInfo.peran === 'super_admin' ? '' : userInfo.opdId);

    const usersInOpd = useMemo(() => {
        if (!selectedOpd) return [];
        return allUsers.filter(u => u.opdId === selectedOpd);
    }, [selectedOpd, allUsers]);

    const opdOptions = useMemo(() => opds.map(opd => ({ value: opd.id, text: opd.nama })), [opds]);
    
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
                    <button onClick={() => openModal('pengguna', { opdId: selectedOpd })} className="elegant-btn p-2.5" disabled={!selectedOpd}>
                        <Plus className="w-5 h-5" />
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
                                </td>
                                <td className="p-4 text-text-secondary hidden md:table-cell align-top">{user.namaJabatan}</td>
                                <td className="p-4 align-top">
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-accent-color/20 text-accent-color capitalize">{(user.peran || 'pengguna').replace(/_/g, ' ')}</span>
                                </td>
                                <td className="p-4 align-top">
                                    <button onClick={() => openModal('pengguna', user)} className="text-blue-accent hover:opacity-80 p-1"><Edit className="w-4 h-4" /></button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center p-8 text-text-secondary">{selectedOpd ? 'Tidak ada pengguna.' : 'Pilih Unit Kerja.'}</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};