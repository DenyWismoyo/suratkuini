import { useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useUI } from '../../context/UIContext';
import Loader from '../../components/UI/Loader';

export default function ManajemenOpdPage() {
    const { appData, loading } = useData();
    const { openModal } = useUI();
    const opds = appData.options?.opds || [];

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [opds]);

    if (loading) {
        return <Loader text="Memuat data unit kerja..." />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-text-primary">Manajemen Unit Kerja</h1>
                <button onClick={() => openModal('opd')} className="elegant-btn flex items-center gap-2">
                    <i data-lucide="plus-circle" className="w-5 h-5"></i>
                    <span>Tambah Unit Kerja</span>
                </button>
            </div>
            <div className="bg-bg-surface rounded-lg border border-border-color overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-bg-muted/30">
                        <tr>
                            <th className="p-4 text-sm font-semibold text-text-secondary">Nama Unit Kerja</th>
                            <th className="p-4 text-sm font-semibold text-text-secondary">Jenis</th>
                            <th className="p-4 text-sm font-semibold text-text-secondary">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {opds.map(opd => (
                            <tr key={opd.id} className="border-t border-border-color">
                                <td className="p-4 font-medium text-text-primary">{opd.nama}</td>
                                <td className="p-4 text-text-secondary">{opd.jenis || 'OPD'}</td>
                                <td className="p-4">
                                    <button onClick={() => openModal('opd', opd)} className="text-blue-accent hover:opacity-80 p-1">
                                        <i data-lucide="edit" className="w-4 h-4"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
