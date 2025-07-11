import { useData } from '../../context/DataContext';

export default function TugasCard({ tugas }) {
    const { appData } = useData();

    // Cari data surat dan pemberi disposisi dari appData
    const surat = appData.suratMasuk.find(s => s.id === tugas.suratMasukId);
    const pemberi = appData.options.jabatan.find(j => j.id === tugas.pemberiDisposisiJabatanId);

    // Jika data surat tidak ditemukan, jangan render apa-apa
    if (!surat) return null;

    return (
        <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-bg-base/50 transition-colors">
           <div className="w-10 h-10 rounded-full bg-yellow-accent/20 text-yellow-accent flex items-center justify-center font-bold flex-shrink-0">
               {pemberi?.nama?.charAt(0) || '?'}
           </div>
           <div>
               <h4 className="font-semibold text-text-primary">{surat.perihal}</h4>
               <p className="text-sm text-text-secondary">Instruksi: {tugas.isiDisposisi}</p>
           </div>
       </div>
   );
}
