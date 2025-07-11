import { useEffect } from 'react';

export default function StatItem({ label, value, icon, color }) {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [icon]);

    return (
        <div className="flex items-center gap-4 p-2">
            <div className="p-2 bg-black/10 dark:bg-white/5 rounded-lg">
                <i data-lucide={icon} className={`w-6 h-6 ${color}`}></i>
            </div>
            <div>
                <p className="text-text-secondary text-sm font-medium">{label}</p>
                <p className="text-xl font-bold text-text-primary">{value}</p>
            </div>
        </div>
    );
}
