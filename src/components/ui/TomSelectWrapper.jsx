import { useRef, useEffect } from 'react';
import TomSelect from 'tom-select';

// Komponen ini membungkus pustaka TomSelect agar mudah digunakan di dalam React
export default function TomSelectWrapper({ options, value, onChange, placeholder, allowCreate = false, multiple = false, ...props }) {
    const selectRef = useRef(null);
    const tomSelectInstance = useRef(null);

    useEffect(() => {
        const el = selectRef.current;
        if (!el) return;

        // Inisialisasi TomSelect saat komponen pertama kali dirender
        tomSelectInstance.current = new TomSelect(el, {
            options,
            items: Array.isArray(value) ? value : [value],
            placeholder,
            onChange,
            create: allowCreate,
            ...props
        });

        // Hancurkan instance TomSelect saat komponen dibongkar untuk mencegah memory leak
        return () => {
            if (tomSelectInstance.current) {
                tomSelectInstance.current.destroy();
                tomSelectInstance.current = null;
            }
        };
    }, []); // Array dependensi kosong agar hanya berjalan sekali

    // Efek ini berjalan setiap kali ada perubahan pada 'options' atau 'value' dari luar
    useEffect(() => {
        if (tomSelectInstance.current) {
            // Perbarui daftar opsi
            tomSelectInstance.current.clearOptions();
            tomSelectInstance.current.addOptions(options);
            // Perbarui nilai yang dipilih tanpa memicu event onChange
            tomSelectInstance.current.setValue(value, true);
        }
    }, [options, value]);

    return <select ref={selectRef} placeholder={placeholder} multiple={multiple} />;
}
