import { createContext, useContext, useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
// Menggunakan alias '@' dengan ekstensi file lengkap
import { db } from '@/config/firebase.js';
import { useAuth } from '@/context/AuthContext';

const DataContext = createContext();

export function useData() {
    return useContext(DataContext);
}

export function DataProvider({ children }) {
    const { userInfo } = useAuth();
    const [appData, setAppData] = useState({
        suratMasuk: [],
        suratKeluar: [],
        disposisi: [],
        notifications: [],
        options: { jabatan: [], klasifikasi: [], tujuan: [], jenisSurat: [], opds: [] },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userInfo) {
            setLoading(false);
            return;
        }
        setLoading(true);

        const listeners = [];

        const globalCollections = {
            'jabatan': 'jabatan', 'klasifikasi': 'klasifikasi',
            'tujuan': 'tujuan', 'jenisSurat': 'jenisSurat', 'opds': 'opds',
        };

        Object.entries(globalCollections).forEach(([key, collectionName]) => {
            const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
            const unsub = onSnapshot(q, (snapshot) => {
                const dataList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setAppData(prev => ({ ...prev, options: { ...prev.options, [key]: dataList } }));
            }, (error) => console.error(`Gagal memuat ${collectionName}:`, error));
            listeners.push(unsub);
        });

        const opdId = userInfo.opdId;
        if (userInfo.peran !== 'super_admin' && opdId) {
            const opdCollections = {
                suratMasuk: `opds/${opdId}/suratMasuk`,
                suratKeluar: `opds/${opdId}/suratKeluar`,
                disposisi: `opds/${opdId}/disposisi`,
            };
            Object.entries(opdCollections).forEach(([key, path]) => {
                const q = query(collection(db, path), orderBy("createdAt", "desc"));
                const unsub = onSnapshot(q, (snapshot) => {
                    const dataList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setAppData(prev => ({ ...prev, [key]: dataList }));
                }, (error) => console.error(`Gagal memuat ${path}:`, error));
                listeners.push(unsub);
            });
        } else if (userInfo.peran === 'super_admin') {
            setAppData(prev => ({ ...prev, suratMasuk: [], suratKeluar: [], disposisi: [] }));
        }

        setLoading(false);

        return () => {
            listeners.forEach(unsub => unsub());
        };
    }, [userInfo]);

    const value = { appData, loading };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
}
