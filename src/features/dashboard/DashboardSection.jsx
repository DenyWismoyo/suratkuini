import { useEffect } from 'react';

export default function DashboardSection({ icon, title, date, children }) {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [icon]);

    return (
        <div className="elegant-card h-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text-primary flex items-center">
                    <i data-lucide={icon} className="w-5 h-5 mr-3 text-accent-color"></i>
                    {title}
                </h2>
                {date && <span className="text-sm font-normal text-text-secondary">{date}</span>}
            </div>
            <div className="space-y-2">{children}</div>
        </div>
    );
}
