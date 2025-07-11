import React, { useState, useMemo, useContext, createContext, useEffect } from 'react';
import { CheckCircle2, AlertTriangle, Info, AlertOctagon, X } from 'lucide-react';

const NotificationContext = createContext(null);

const NotificationToast = ({ id, message, type, onRemove }) => {
    const [exiting, setExiting] = useState(false);
    const icons = { success: CheckCircle2, error: AlertTriangle, info: Info, warning: AlertOctagon };
    const colors = { success: 'bg-green-accent text-white', error: 'bg-red-accent text-white', info: 'bg-blue-accent text-white', warning: 'bg-yellow-accent text-black' };
    
    const Icon = icons[type];

    const handleRemove = () => {
        setExiting(true);
        setTimeout(onRemove, 300);
    };

    return (
        <div className={`notification-toast ${colors[type]} ${exiting ? 'exit' : ''}`}>
            <Icon className="w-5 h-5 mr-3 flex-shrink-0" />
            <p className="flex-grow text-sm font-medium">{message}</p>
            <button onClick={handleRemove} className="ml-4 flex-shrink-0 opacity-70 hover:opacity-100">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

const NotificationContainer = ({ toasts, onRemove }) => {
    return (
        <div className="notification-container">
            {toasts.map(n => <NotificationToast key={n.id} {...n} onRemove={() => onRemove(n.id)} />)}
        </div>
    );
};

export const NotificationProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const show = (message, type = 'info', duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), duration);
    };
    
    const removeToast = (id) => setToasts(prev => prev.filter(n => n.id !== id));
    
    const value = useMemo(() => ({ show }), []);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationContainer toasts={toasts} onRemove={removeToast} />
        </NotificationContext.Provider>
    );
};

export const useNotifier = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotifier harus digunakan di dalam NotificationProvider');
    return context;
};
