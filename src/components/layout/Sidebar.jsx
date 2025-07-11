// ... (import lainnya)
import { useMemo, useEffect } from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { PERMISSIONS } from '../../config/permissions'; // Buat file ini nanti

export default function Sidebar({ userInfo, onLogout, theme, toggleTheme, sessionOpdName }) {
    const navItems = useMemo(() => {
        const { peran } = userInfo || {};
        if (!peran) return [];

        let tabs = [{ id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' }];

        if (PERMISSIONS.canManageSurat.includes(peran)) {
            tabs.push({ id: 'surat-masuk', path: '/surat-masuk', label: 'Surat Masuk', icon: 'inbox' });
            tabs.push({ id: 'surat-keluar', path: '/surat-keluar', label: 'Surat Keluar', icon: 'send' });
        }

        tabs.push({ id: 'disposisi-saya', path: '/tugas-saya', label: 'Tugas Saya', icon: 'file-check-2' });

        if (PERMISSIONS.canViewAllDisposisi.includes(peran)) {
            tabs.push({ id: 'disposisi', path: '/riwayat-disposisi', label: 'Riwayat Disposisi', icon: 'history' });
        }

        if (PERMISSIONS.canManageOPD.includes(peran)) {
            tabs.push({ id: 'manajemen-opd', path: '/manajemen-opd', label: 'Manajemen Unit Kerja', icon: 'building-2' });
        }
        if (PERMISSIONS.canManageUsers.includes(peran)) {
            tabs.push({ id: 'manajemen-pengguna', path: '/manajemen-pengguna', label: 'Manajemen Pengguna', icon: 'users' });
        }
        if (PERMISSIONS.canViewSettings.includes(peran)) {
            tabs.push({ id: 'pengaturan', path: '/pengaturan', label: 'Pengaturan', icon: 'settings' });
        }
        
        return tabs;
    }, [userInfo]);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [navItems, theme]);

    return (
        <aside className="sidebar">
            <div className="flex flex-col h-full">
                {/* ... (Header Sidebar) ... */}
                <div className="flex items-center justify-center gap-2 p-4 mb-4">
                    <i data-lucide="shield-check" className="w-10 h-10 text-accent-color"></i>
                    <span className="text-2xl font-bold text-text-primary">ARKADIA</span>
                </div>
                <nav className="flex-1 space-y-2 px-2">
                    {navItems.map(tab => (
                        <NavLink 
                            key={tab.id} 
                            to={tab.path} 
                            className={({ isActive }) => `sidebar-btn ${isActive ? 'active' : ''}`}
                        >
                            <i data-lucide={tab.icon}></i>
                            <span>{tab.label}</span>
                        </NavLink>
                    ))}
                </nav>
                {/* ... (Footer Sidebar) ... */}
            </div>
        </aside>
    );
}
