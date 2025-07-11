// ========================================================================
// FILE: src/App.jsx (VERSI FINAL & LENGKAP)
// FUNGSI: Komponen "otak" yang merakit seluruh aplikasi, mengatur
//         state, otentikasi, dan menampilkan komponen yang sesuai.
// ========================================================================
import { useState, useEffect, useMemo } from 'react';

// Firebase Services & Functions
import { auth, db } from './services/firebase.js';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, onSnapshot, query, orderBy } from 'firebase/firestore';

// Layout & UI Components
import Sidebar from './components/layout/Sidebar.jsx';
import Header from './components/layout/Header.jsx';
import Loader from './components/ui/Loader.jsx';
import Fab from './components/ui/Fab.jsx';

// Feature Views
import LoginView from './features/auth/LoginView.jsx';
import OPDSelectionModal from './features/auth/OPDSelectionModal.jsx';
import DashboardView from './features/dashboard/DashboardView.jsx';
import SuratMasukView from './features/surat/SuratMasukView.jsx';
import SuratKeluarView from './features/surat/SuratKeluarView.jsx';
import DisposisiView from './features/disposisi/DisposisiView.jsx';
import DisposisiSayaView from './features/disposisi/DisposisiSayaView.jsx';
import ManajemenOPDView from './features/manajemen/ManajemenOPDView.jsx';
import ManajemenPenggunaView from './features/manajemen/ManajemenPenggunaView.jsx';

// Feature Modals
import SuratMasukModal from './features/surat/SuratMasukModal.jsx';
import SuratKeluarModal from './features/surat/SuratKeluarModal.jsx';
import DisposisiModal from './features/disposisi/DisposisiModal.jsx';
import OPDModal from './features/manajemen/OPDModal.jsx';
import PenggunaModal from './features/manajemen/PenggunaModal.jsx';

// Context & Notifier
import { useNotifier } from './contexts/NotificationContext.jsx';

// Permissions
const PERMISSIONS = {
    canManageSurat: ['super_admin', 'admin', 'tu_pimpinan', 'tu_opd'],
    canCreateDisposisi: ['super_admin', 'pimpinan'],
    canDisposisiLintasOPD: ['super_admin'],
};

export default function App() {
    // State for authentication and user profile
    const [authState, setAuthState] = useState({ user: null, userInfo: null, loading: true });
    
    // State for all application data fetched from Firestore
    const [appData, setAppData] = useState({
        suratMasuk: [], suratKeluar: [], disposisi: [], notifications: [],
        options: { jabatan: [], klasifikasi: [], tujuan: [], jenisSurat: [], opds: [] },
    });
    
    // State for UI controls (active tab, modals, etc.)
    const [uiState, setUiState] = useState({
        activeTab: 'dashboard',
        modal: { isOpen: false, type: null, data: null },
        isNotifPanelOpen: false,
    });

    // State for UI theme (dark/light)
    const [theme, setTheme] = useState(() => localStorage.getItem('arkadia-theme') || 'dark');
    
    // State for Super Admin's OPD session
    const [sessionOpd, setSessionOpd] = useState(null);
    const [opdSelection, setOpdSelection] = useState({ required: false, opdList: [] });

    // State to handle data loading screen
    const [isDataLoading, setIsDataLoading] = useState(true);
    
    const notifier = useNotifier();

    // Effect to manage UI theme
    useEffect(() => {
        document.body.className = '';
        document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme');
        localStorage.setItem('arkadia-theme', theme);
    }, [theme]);

    // Effect to handle user authentication state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userDoc = await getDoc(doc(db, "jabatan", user.uid));
                if (userDoc.exists()) {
                    const userInfo = { id: userDoc.id, ...userDoc.data() };
                    setAuthState({ user, userInfo, loading: false });
                    if (userInfo.peran === 'super_admin') {
                        const opdsSnapshot = await getDocs(collection(db, 'opds'));
                        setOpdSelection({ required: true, opdList: opdsSnapshot.docs.map(d => ({ id: d.id, ...d.data() })) });
                    } else if (userInfo.opdId) {
                        const opdDoc = await getDoc(doc(db, 'opds', userInfo.opdId));
                        setSessionOpd(opdDoc.exists() ? { id: opdDoc.id, ...opdDoc.data() } : null);
                    }
                } else {
                    notifier.show('Profil pengguna tidak ditemukan.', 'error');
                    await signOut(auth);
                }
            } else {
                setAuthState({ user: null, userInfo: null, loading: false });
                setSessionOpd(null);
            }
        });
        return unsubscribe;
    }, [notifier]);

    // Effect to fetch Firestore data based on user role and session
    useEffect(() => {
        if (!authState.userInfo) return;
        setIsDataLoading(true);

        const targetOpdId = authState.userInfo.peran === 'super_admin' ? sessionOpd?.id : authState.userInfo.opdId;
        
        const listeners = Object.entries({
            jabatan: 'jabatan', klasifikasi: 'klasifikasi', tujuan: 'tujuan', jenisSurat: 'jenisSurat', opds: 'opds'
        }).map(([key, col]) => onSnapshot(query(collection(db, col)), snap => {
            setAppData(prev => ({...prev, options: {...prev.options, [key]: snap.docs.map(d=>({id:d.id,...d.data()}))}}));
        }));

        if (targetOpdId) {
            const opdCollections = ['suratMasuk', 'suratKeluar', 'disposisi'];
            const opdListeners = opdCollections.map(col => 
                onSnapshot(query(collection(db, `opds/${targetOpdId}/${col}`)), snap => {
                    setAppData(prev => ({...prev, [col]: snap.docs.map(d=>({id:d.id,...d.data()}))}));
                })
            );
            listeners.push(...opdListeners);
            
            // Assume loading is finished after a short delay to allow all listeners to attach
            setTimeout(() => setIsDataLoading(false), 1500); 
        } else {
            setIsDataLoading(false);
        }
        
        return () => listeners.forEach(unsub => unsub());
    }, [authState.userInfo, sessionOpd]);

    // --- Handlers ---
    const handleLogin = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            notifier.show('Email atau password salah.', 'error');
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setUiState({ ...uiState, activeTab: 'dashboard' });
        notifier.show('Anda telah berhasil keluar.', 'info');
    };
    
    const openModal = (type, data = null) => setUiState(s => ({ ...s, modal: { isOpen: true, type, data } }));
    const closeModal = () => setUiState(s => ({ ...s, modal: { isOpen: false, type: null, data: null } }));

    // --- Render Logic ---
    const renderContent = () => {
        if (isDataLoading && authState.userInfo) {
            return (
                <div className="flex items-center justify-center h-full pt-20">
                    <Loader text="Mengambil data..." />
                </div>
            );
        }

        const { activeTab } = uiState;
        const { userInfo } = authState;
        const props = { appData, userInfo, openModal, onEdit: (item) => openModal(activeTab, item) };

        switch(activeTab) {
            case 'dashboard': return <DashboardView {...props} />;
            case 'surat-masuk': return <SuratMasukView data={appData.suratMasuk} {...props} />;
            case 'surat-keluar': return <SuratKeluarView data={appData.suratKeluar} {...props} />;
            case 'disposisi': return <DisposisiView data={appData.disposisi} allData={appData} {...props} />;
            case 'disposisi-saya': return <DisposisiSayaView disposisiSaya={appData.disposisi.filter(d => d.tujuanJabatanId === userInfo.id)} allData={appData} {...props} />;
            case 'manajemen-opd': return <ManajemenOPDView {...props} />;
            case 'manajemen-pengguna': return <ManajemenPenggunaView {...props} />;
            default: return <DashboardView {...props} />;
        }
    };

    const renderModal = () => {
        const { modal } = uiState;
        if (!modal.isOpen) return null;
        const props = { data: modal.data, onClose: closeModal, allOptions: appData.options, userInfo: authState.userInfo, currentUser: authState.userInfo };
        
        switch(modal.type) {
            case 'suratMasuk': return <SuratMasukModal {...props} />;
            case 'suratKeluar': return <SuratKeluarModal {...props} />;
            case 'disposisi': return <DisposisiModal {...props} />;
            case 'opd': return <OPDModal {...props} />;
            case 'pengguna': return <PenggunaModal {...props} />;
            // Add other modals here as needed
            default: return null;
        }
    };

    // --- Main Return ---
    if (authState.loading) return <Loader text="Inisialisasi Aplikasi..." />;
    
    if (!authState.user) return <LoginView onLogin={handleLogin} />;
    
    if (opdSelection.required && !sessionOpd) {
        return <OPDSelectionModal opdList={opdSelection.opdList} onSelect={setSessionOpd} onSkip={() => setSessionOpd({ id: 'pusat', nama: 'Pusat' })} />;
    }

    return (
        <div id="app-wrapper" className="flex h-screen bg-bg-base overflow-hidden">
            <Sidebar 
                userInfo={authState.userInfo} 
                activeTab={uiState.activeTab} 
                onTabChange={(tab) => setUiState(s => ({...s, activeTab: tab}))} 
                onLogout={handleLogout} 
                theme={theme} 
                toggleTheme={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} 
                sessionOpdName={sessionOpd?.nama}
            />
            
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    pageTitle={uiState.activeTab} 
                    notifications={appData.notifications} 
                    onNotifClick={() => setUiState(s => ({...s, isNotifPanelOpen: !s.isNotifPanelOpen}))}
                    onMenuClick={() => {}} // Placeholder, Sidebar now handles its own state
                />
                <main id="main-content" className="flex-1 overflow-y-auto">
                    <div className="content-wrapper p-4 md:p-6">
                        {renderContent()}
                    </div>
                </main>
            </div>
            
            {renderModal()}
        </div>
    );
}
