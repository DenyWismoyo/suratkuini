import { useMemo } from 'react';
import { Bell, Menu } from 'lucide-react';

export default function Header({ pageTitle, notifications, onNotifClick, onMenuClick }) {
    const tabInfo = { 
        'dashboard': 'Dashboard', 
        'surat-masuk': 'Surat Masuk', 
        'surat-keluar': 'Surat Keluar', 
        'disposisi-saya': 'Tugas Saya', 
        'disposisi': 'Riwayat Disposisi', 
        'manajemen-opd': 'Manajemen Unit Kerja', 
        'manajemen-pengguna': 'Manajemen Pengguna', 
        'pengaturan': 'Pengaturan' 
    };
    
    const unreadCount = useMemo(() => (notifications || []).filter(n => !n.isRead).length, [notifications]);

    return (
        <header className="main-header h-[var(--header-height)] flex items-center justify-between px-4 md:px-6 bg-bg-surface border-b border-border-color flex-shrink-0 transition-colors duration-300">
            <div className="flex items-center gap-4">
                {/* Tombol Hamburger hanya muncul di mobile */}
                <button onClick={onMenuClick} className="header-icon-btn md:hidden">
                    <Menu />
                </button>
                <h2 className="text-xl md:text-2xl font-bold text-text-primary">{tabInfo[pageTitle] || 'Dashboard'}</h2>
            </div>
            <button onClick={onNotifClick} className="header-icon-btn relative">
                <Bell />
                {unreadCount > 0 && 
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                        {unreadCount}
                    </span>
                }
            </button>
        </header>
    );
};
