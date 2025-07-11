import React from 'react';

export default function Loader({ text = 'Memuat...' }) {
    return (
        <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-[2000]">
            <div className="w-12 h-12 border-4 border-gray-600 border-t-teal-400 rounded-full animate-spin"></div>
            <p className="text-gray-400 mt-4 font-medium">{text}</p>
        </div>
    );
};