import { createContext, useContext, useState, useEffect } from 'react';

const UIContext = createContext();

export function useUI() {
    return useContext(UIContext);
}

export function UIProvider({ children }) {
    const [modal, setModal] = useState({
        isOpen: false,
        type: null,
        data: null,
    });

    const openModal = (type, data = null) => {
        setModal({ isOpen: true, type, data });
    };

    const closeModal = () => {
        setModal({ isOpen: false, type: null, data: null });
    };

    const [theme, setTheme] = useState(localStorage.getItem('arkadia-theme') || 'dark');
    
    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('arkadia-theme', newTheme);
    };

    // Gunakan useEffect untuk menjalankan side effect (mengubah DOM)
    useEffect(() => {
        document.body.className = ''; // Hapus kelas lama
        document.body.classList.add(theme === 'light' ? 'light-theme' : 'dark-theme');
    }, [theme]); // Jalankan efek ini setiap kali 'theme' berubah


    const value = {
        modal,
        openModal,
        closeModal,
        theme,
        toggleTheme,
    };

    return (
        <UIContext.Provider value={value}>
            {children}
        </UIContext.Provider>
    );
}
