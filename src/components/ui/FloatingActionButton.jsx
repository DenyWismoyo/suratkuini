import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useUI } from '../../contexts/UIContext';
import { PERMISSIONS } from '../../config/permissions';

export default function FloatingActionButton() {
    const { userInfo } = useAuth();
    const { openModal } = useUI();
    const location = useLocation();

    const fabConfig = useMemo(() => {
        const { peran } = userInfo || {};
        if (!peran) return { action: null, permission: false };

        // Tentukan aksi berdasarkan halaman saat ini
        switch (location.pathname) {
            case '/surat-masuk':
                return { action: 'suratMasuk', permission: PERMISSIONS.canManageSurat.includes(peran) };
            case '/surat-keluar':
                return { action: 'suratKeluar', permission: PERMISSIONS.canManageSurat.includes(peran) };
            case '/dashboard':
            case '/riwayat-disposisi':
                return { action: 'disposisi', permission: PERMISSIONS.canCreateDisposisi.includes(peran) };
            default:
                return { action: null, permission: false };
        }
    }, [location.pathname, userInfo]);

    const handleFabClick = () => {
        if (fabConfig.permission && fabConfig.action) {
            openModal(fabConfig.action);
        } else {
            alert("Anda tidak memiliki izin untuk melakukan aksi ini.");
        }
    };

    if (!fabConfig.permission) {
        return null;
    }

    return (
        <button id="fab-add" className="fab" onClick={handleFabClick}>
            <i data-lucide="plus" className="w-8 h-8"></i>
        </button>
    );
}
