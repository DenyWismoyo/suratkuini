import React from 'react';
import { Plus } from 'lucide-react';

export default function Fab({ onClick, permission }) {
    if (!permission) {
        return null;
    }
    
    return (
        <button 
            id="fab-add" 
            className="fab" 
            onClick={onClick}
        >
            <Plus className="w-8 h-8" />
        </button>
    );
};