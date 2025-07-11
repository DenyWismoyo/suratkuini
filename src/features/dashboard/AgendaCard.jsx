import { useEffect } from 'react';

export default function AgendaCard({ agenda }) {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, []);

    // Mengonversi timestamp Firebase ke objek Date jika ada
    const agendaDate = agenda.waktuPelaksanaan?.toDate ? agenda.waktuPelaksanaan.toDate() : null;
    
    // Format waktu ke format HH:MM
    const waktu = agendaDate 
        ? agendaDate.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace('.', ':')
        : 'N/A';

    return (
        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-bg-base/50 transition-colors">
            <div className="agenda-time-box">
                <i data-lucide="clock" className="w-4 h-4"></i>
                <span>{waktu}</span>
            </div>
            <div className="flex-grow">
                <h4 className="font-semibold text-text-primary">{agenda.perihal}</h4>
                <p className="text-sm text-text-secondary">Tempat: {agenda.tempatPelaksanaan || 'N/A'}</p>
            </div>
        </div>
    );
}
