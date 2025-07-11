import { Routes, Route, Navigate } from 'react-router-dom';
// Gunakan path relatif dari file ini
import { useAuth } from './context/AuthContext.js';
import { useUI } from './context/UIContext.js';
import { auth } from './config/firebase.js';

// Layout & Halaman
import MainLayout from './components/Layout/MainLayout.jsx';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import SuratMasukPage from './pages/SuratMasukPage.jsx';
import SuratKeluarPage from './pages/SuratKeluarPage.jsx';
import TugasSayaPage from './pages/TugasSayaPage.jsx';
import RiwayatDisposisiPage from './pages/RiwayatDisposisiPage.jsx';
import ManajemenOpdPage from './pages/ManajemenOpdPage.jsx';
import ManajemenPenggunaPage from './pages/ManajemenPenggunaPage.jsx';
import PengaturanPage from './pages/PengaturanPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import Loader from './components/UI/Loader.jsx';

function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();
    if (loading) return <Loader text="Memverifikasi sesi..." />;
    if (!currentUser) return <Navigate to="/login" replace />;
    return children;
}

export default function App() {
    const { currentUser, userInfo, loading: authLoading } = useAuth();
    const { theme, toggleTheme } = useUI();

    if (authLoading) return <Loader text="Inisialisasi Aplikasi..." />;

    const layoutProps = {
        userInfo: userInfo,
        handleLogout: () => auth.signOut(),
        theme: theme,
        toggleTheme: toggleTheme,
    };

    return (
        <Routes>
            <Route path="/" element={<ProtectedRoute><MainLayout {...layoutProps} /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="surat-masuk" element={<SuratMasukPage />} />
                <Route path="surat-keluar" element={<SuratKeluarPage />} />
                <Route path="tugas-saya" element={<TugasSayaPage />} />
                <Route path="riwayat-disposisi" element={<RiwayatDisposisiPage />} />
                <Route path="manajemen-opd" element={<ManajemenOpdPage />} />
                <Route path="manajemen-pengguna" element={<ManajemenPenggunaPage />} />
                <Route path="pengaturan" element={<PengaturanPage />} />
            </Route>
            <Route path="/login" element={currentUser ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
}
