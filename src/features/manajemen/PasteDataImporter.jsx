import { useState } from 'react';
import { db } from '../../config/firebase';
import { collection, writeBatch, serverTimestamp } from 'firebase/firestore';

export default function PasteDataImporter({ title, collectionName, requiredFields, description }) {
    const [textData, setTextData] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handlePaste = async () => {
        if (!textData.trim()) {
            return alert("Silakan tempel data di dalam kotak teks.");
        }
        setIsLoading(true);
        const lines = textData.trim().split('\n');
        const dataToImport = lines.map(line => {
            const values = line.split('\t'); // Data dipisah dengan Tab
            let obj = {};
            requiredFields.forEach((field, index) => {
                obj[field] = values[index] || "";
            });
            return obj;
        });

        if (dataToImport.some(item => !item[requiredFields[0]])) {
            setIsLoading(false);
            return alert(`Data tidak valid. Pastikan setiap baris memiliki data untuk kolom '${requiredFields[0]}'.`);
        }

        try {
          const batch = writeBatch(db);
          dataToImport.forEach((row) => {
            const docRef = collection(db, collectionName).doc();
            const payload = { ...row, createdAt: serverTimestamp() };
            batch.set(docRef, payload);
          });
          await batch.commit();
          alert(`${dataToImport.length} data berhasil diimpor ke koleksi '${collectionName}'.`);
          setTextData("");
        } catch (error) {
          alert("Terjadi kesalahan saat mengimpor data: " + error.message);
        } finally {
          setIsLoading(false);
        }
    };

    return (
      <div className="elegant-card">
        <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
        <p className="text-sm text-text-secondary mb-4">{description}</p>
        <textarea placeholder="Tempel data dari Excel/Sheets di sini..." rows="5" className="form-input-elegant w-full mb-4" value={textData} onChange={(e) => setTextData(e.target.value)}></textarea>
        <button onClick={handlePaste} className="w-full elegant-btn" disabled={isLoading || !textData.trim()}>
          {isLoading ? "Memproses..." : "Impor Data"}
        </button>
      </div>
    );
};
