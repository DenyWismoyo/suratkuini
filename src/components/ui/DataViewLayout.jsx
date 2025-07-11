import { useState, useMemo, useEffect } from 'react';
import FilterPopover from './FilterPopover';
import PaginationControls from './PaginationControls';

export default function DataViewLayout({ title, data, CardComponent, filterOptions, ...props }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});

    const filteredData = useMemo(() => {
        if (!data) return [];
        return data.filter(item => {
            // Pencocokan berdasarkan kata kunci pencarian
            const searchMatch = Object.values(item).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (!searchMatch) return false;

            // Pencocokan berdasarkan filter aktif
            for (const key in activeFilters) {
                if (activeFilters[key] && item[key] !== activeFilters[key]) {
                    return false;
                }
            }
            return true;
        });
    }, [data, searchTerm, activeFilters]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * rowsPerPage;
        return filteredData.slice(start, start + rowsPerPage);
    }, [filteredData, currentPage, rowsPerPage]);

    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [paginatedData, isFilterOpen]);

    const handleApplyFilter = (filters) => {
        setActiveFilters(filters);
        setFilterOpen(false);
    };
    
    const handleResetFilter = () => {
        setActiveFilters({});
        setFilterOpen(false);
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-text-primary">{title}</h1>
                <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder={`Cari di ${title}...`}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="form-input-elegant w-full max-w-xs"
                    />
                    {filterOptions && (
                        <div className="relative">
                            <button onClick={() => setFilterOpen(v => !v)} className="elegant-btn bg-bg-muted text-text-primary hover:bg-border-color p-2.5">
                                <i data-lucide="filter" className="w-5 h-5"></i>
                            </button>
                            {isFilterOpen && (
                                <FilterPopover
                                    options={filterOptions}
                                    onApply={handleApplyFilter}
                                    onReset={handleResetFilter}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedData.length > 0 ?
                    paginatedData.map((item, index) => (
                        <CardComponent key={item.id || index} item={item} index={index} {...props} />
                    )) :
                    <div className="lg:col-span-2 xl:col-span-3 text-center p-8 bg-bg-surface/50 rounded-lg border border-border-color text-text-secondary">
                        Tidak ada data yang cocok dengan kriteria Anda.
                    </div>
                }
            </div>
            <PaginationControls
                data={filteredData}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                rowsPerPage={rowsPerPage}
                setRowsPerPage={setRowsPerPage}
            />
        </div>
    );
}
