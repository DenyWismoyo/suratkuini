import { useEffect } from 'react';

export default function PaginationControls({ data, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage }) {
    const pageCount = Math.ceil(data.length / rowsPerPage);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [currentPage, pageCount]);

    return (
        <div className="flex items-center justify-center sm:justify-end text-sm mt-6 text-text-secondary gap-2">
            <span>Baris per Hal:</span>
            <select
                value={rowsPerPage}
                onChange={e => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="form-input-elegant p-1 w-20 bg-white dark:bg-gray-700"
            >
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
            </select>
            <span className="mx-2 hidden sm:inline">Hal {currentPage} dari {pageCount || 1}</span>
            <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50"
            >
                <i data-lucide="chevron-left" className="w-4 h-4 pointer-events-none"></i>
            </button>
            <button
                onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))}
                disabled={currentPage >= pageCount}
                className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50"
            >
                <i data-lucide="chevron-right" className="w-4 h-4 pointer-events-none"></i>
            </button>
        </div>
    );
}
