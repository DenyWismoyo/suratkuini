import React, { useMemo } from 'react';
import { LayoutDashboard, Inbox, Send, FileCheck2, History } from 'lucide-react';

// Definisikan izin di sini juga untuk konsistensi
const DOCK_PERMISSIONS = {
    canManageSurat: ['super_admin', 'admin', 'tu_pimpinan', 'tu_opd'],
    canViewAllDisposisi: ['super_admin', 'pimpinan', 'admin'],
};

export default function FloatingDock({ userInfo, activeTab, onTabChange }) {
    const navItems = useMemo(() => {
        const { peran } = userInfo || {};
        let tabs = [{ id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }];
        
        if (DOCK_PERMISSIONS.canManageSurat.includes(peran)) {
            tabs.push({ id: 'surat-masuk', label: 'Masuk', icon: Inbox });
            tabs.push({ id: 'surat-keluar', label: 'Keluar', icon: Send });
        }
        
        tabs.push({ id: 'disposisi-saya', label: 'Tugas', icon: FileCheck2 });
        
        if (DOCK_PERMISSIONS.canViewAllDisposisi.includes(peran)) {
            tabs.push({ id: 'disposisi', label: 'Riwayat', icon: History });
        }
        return tabs;
    }, [userInfo]);

    return (
        <nav className="floating-dock md:hidden">
            {navItems.map(tab => (
                <button 
                    key={tab.id} 
                    onClick={() => onTabChange(tab.id)} 
                    className={`dock-btn ${activeTab === tab.id ? 'active' : ''}`} 
                    title={tab.label}
                >
                    <tab.icon className={`w-6 h-6 ${activeTab === tab.id ? 'text-accent-text' : 'text-text-secondary'}`} />
                </button>
            ))}
        </nav>
    );
};
