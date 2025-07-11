import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase.js';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setCurrentUser(user);
            if (user) {
                const userDocRef = doc(db, "jabatan", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    setUserInfo({ id: userDocSnap.id, ...userDocSnap.data() });
                } else {
                    console.error("User profile not found in Firestore for UID:", user.uid);
                    setUserInfo(null); 
                }
            } else {
                setUserInfo(null);
            }
            setLoading(false);
        });

        // Cleanup listener saat komponen tidak lagi digunakan
        return () => unsubscribe();
    }, []);

    const value = {
        currentUser,
        userInfo,
        loading,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
