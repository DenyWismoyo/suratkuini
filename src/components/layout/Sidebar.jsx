import { useMemo } from 'react';
import { ShieldCheck, LayoutDashboard, Inbox, Send, FileCheck2, History, Building2, Users, Settings, Sun, Moon, LogOut, X } from 'lucide-react';

// Izin bisa didefinisikan di sini atau diimpor dari file terpisah
const PERMISSIONS = {
    canManageSurat: ['super_admin', 'admin', 'tu_pimpinan', 'tu_opd'],
    canViewAllDisposisi: ['super_admin', 'pimpinan', 'admin'],
    canManageUsers: ['super_admin', 'admin'],
    canManageOPD: ['super_admin'],
    canViewSettings: ['super_admin', 'admin'],
};

// Komponen Navigasi Internal
const NavContent = ({ userInfo, activeTab, onTabChange, onLogout, theme, toggleTheme, sessionOpdName }) => {
    const navItems = useMemo(() => {
        // ... (logika navItems sama seperti sebelumnya)
        const { peran } = userInfo || {};
        if (!peran) return [];
        let tabs = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }];
        if (PERMISSIONS.canManageSurat.includes(peran)) {
            tabs.push({ id: 'surat-masuk', label: 'Surat Masuk', icon: Inbox });
            tabs.push({ id: 'surat-keluar', label: 'Surat Keluar', icon: Send });
        }
        tabs.push({ id: 'disposisi-saya', label: 'Tugas Saya', icon: FileCheck2 });
        if (PERMISSIONS.canViewAllDisposisi.includes(peran)) {
            tabs.push({ id: 'disposisi', label: 'Riwayat Disposisi', icon: History });
        }
        if (PERMISSIONS.canManageOPD.includes(peran)) {
            tabs.push({ id: 'manajemen-opd', label: 'Manajemen Unit Kerja', icon: Building2 });
        }
        if (PERMISSIONS.canManageUsers.includes(peran)) {
            tabs.push({ id: 'manajemen-pengguna', label: 'Manajemen Pengguna', icon: Users });
        }
        if (PERMISSIONS.canViewSettings.includes(peran)) {
            tabs.push({ id: 'pengaturan', label: 'Pengaturan', icon: Settings });
        }
        return tabs;
    }, [userInfo]);

    return (
        <div className="flex flex-col h-full bg-bg-surface">
            <div className="flex items-center justify-center gap-2 p-4 mb-4">
                <ShieldCheck className="w-10 h-10 text-accent-color" />
                <span className="text-2xl font-bold text-text-primary">ARKADIA</span>
            </div>
            <nav className="flex-1 space-y-2 px-4">
                {navItems.map(tab => (
                    <button 
                        key={tab.id} 
                        onClick={() => onTabChange(tab.id)} 
                        className={`sidebar-btn w-full ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <tab.icon className="w-5 h-5" />
                        <span>{tab.label}</span>
                    </button>
                ))}
            </nav>
            <div className="p-4 border-t border-border-color space-y-4">
                {sessionOpdName && (
                     <div className="p-2 text-center bg-bg-muted rounded-lg">
                        <p className="text-xs text-text-secondary">Sesi Aktif:</p>
                        <p className="font-semibold text-accent-color">{sessionOpdName}</p>
                     </div>
                )}
                <button onClick={toggleTheme} className="sidebar-btn w-full">
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    <span>Ganti Tema</span>
                </button>
                <div className="flex items-center gap-3">
                     <div className="user-avatar-button">
                        <span>{userInfo?.nama?.charAt(0) || 'U'}</span>
                     </div>
                     <div>
                        <p className="font-semibold text-text-primary">{userInfo?.nama || 'Pengguna'}</p>
                        <p className="text-xs text-text-secondary">{userInfo?.namaJabatan || 'Role'}</p>
                     </div>
                </div>
                <button onClick={onLogout} className="sidebar-btn w-full text-red-400 hover:bg-red-400/20">
                    <LogOut className="w-5 h-5" />
                    <span>Keluar</span>
                </button>
            </div>
        </div>
    );
};

// Komponen Sidebar Utama yang Adaptif
export default function Sidebar({ isOpen, onClose, ...props }) {
    return (
        <>
            {/* Sidebar untuk Desktop (selalu terlihat) */}
            <aside className="hidden md:block w-[var(--sidebar-width)] flex-shrink-0">
                <NavContent {...props} />
            </aside>

            {/* Sidebar untuk Mobile (Off-Canvas) */}
            <div 
                className={`fixed inset-0 z-40 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            >
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60"
                    onClick={onClose}
                ></div>
                
                {/* Konten Menu */}
                <aside 
                    className={`relative z-50 w-[var(--sidebar-width)] h-full transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <NavContent {...props} />
                </aside>
            </div>
        </>
    );
};