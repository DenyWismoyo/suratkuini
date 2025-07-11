import React, { useRef, useEffect } from 'react';
import TomSelect from 'tom-select';

export default function TomSelectWrapper({ 
    options, 
    value, 
    onChange, 
    placeholder, 
    allowCreate = false, 
    multiple = false 
}) {
    const selectRef = useRef(null);
    const tomSelectInstance = useRef(null);

    useEffect(() => {
        const el = selectRef.current;
        if (!el) return;
        
        // Inisialisasi TomSelect
        tomSelectInstance.current = new TomSelect(el, { 
            options, 
            items: Array.isArray(value) ? value : [value], 
            placeholder, 
            onChange, 
            create: allowCreate,
            // Opsi lain bisa ditambahkan di sini
        });

        // Hancurkan instance saat komponen di-unmount untuk mencegah memory leak
        return () => {
            if (tomSelectInstance.current) {
                tomSelectInstance.current.destroy();
                tomSelectInstance.current = null;
            }
        };
    }, []); // Hanya dijalankan sekali saat komponen pertama kali mount

    // Efek untuk mengupdate options dan value jika ada perubahan dari props
    useEffect(() => {
        if (tomSelectInstance.current) {
            tomSelectInstance.current.clearOptions();
            tomSelectInstance.current.addOptions(options);
            tomSelectInstance.current.setValue(value, true); // true = silent update
        }
    }, [options, value]);

    return <select ref={selectRef} placeholder={placeholder} multiple={multiple} />;
};
