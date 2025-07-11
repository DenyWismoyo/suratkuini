/**
 * File ini mendefinisikan hak akses untuk setiap peran pengguna.
 * Logika di dalam aplikasi (misalnya di Sidebar) akan menggunakan objek ini
 * untuk menentukan apakah seorang pengguna boleh melihat menu atau tombol tertentu.
 */
export const PERMISSIONS = {
    canManageSurat: ['super_admin', 'admin', 'tu_pimpinan', 'tu_opd'],
    canCreateDisposisi: ['super_admin', 'pimpinan'],
    canDisposisiLintasOPD: ['super_admin'],
    canForwardDisposisi: ['pejabat_struktural'],
    canViewAllDisposisi: ['super_admin', 'pimpinan', 'admin'],
    canManageUsers: ['super_admin', 'admin'],
    canManageOPD: ['super_admin'],
    canViewSettings: ['super_admin', 'admin'],
};
