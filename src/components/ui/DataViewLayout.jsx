import React, { useState, useMemo, useEffect } from 'react';
import { Filter, ChevronLeft, ChevronRight } from 'lucide-react';

// Sub-komponen untuk Filter Popover
const FilterPopover = ({ options, onApply, onReset }) => {
    const [filters, setFilters] = useState({});
    const handleSetFilter = (key, value) => setFilters(prev => ({...prev, [key]: value}));
    
    return (
        <div className="filter-popover">
            <h4 className="font-bold mb-2 text-text-primary">Filter Lanjutan</h4>
            {options.map(opt => (
                <div key={opt.key} className="mb-3">
                    <label className="text-xs font-medium text-text-secondary">{opt.label}</label>
                    <select onChange={(e) => handleSetFilter(opt.key, e.target.value)} className="form-input-elegant text-sm p-2 mt-1">
                        <option value="">Semua</option>
                        {opt.values.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
            ))}
            <div className="flex gap-2 mt-4">
                <button onClick={() => onApply(filters)} className="elegant-btn text-sm py-1 px-3 flex-1">Terapkan</button>
                <button onClick={onReset} className="elegant-btn bg-bg-muted text-text-primary hover:bg-border-color text-sm py-1 px-3">Reset</button>
            </div>
        </div>
    );
};

// Sub-komponen untuk Kontrol Paginasi
const PaginationControls = ({ data, currentPage, setCurrentPage, rowsPerPage, setRowsPerPage }) => {
    const pageCount = Math.ceil(data.length / rowsPerPage);
    
    return (
        <div className="flex items-center justify-center sm:justify-end text-sm mt-6 text-text-secondary gap-2">
            <span>Baris per Hal:</span>
            <select value={rowsPerPage} onChange={e => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}} className="form-input-elegant p-1 w-20 bg-white dark:bg-gray-700">
                <option value="6">6</option>
                <option value="9">9</option>
                <option value="12">12</option>
            </select>
            <span className="mx-2 hidden sm:inline">Hal {currentPage} dari {pageCount || 1}</span>
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">
                <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setCurrentPage(p => Math.min(pageCount, p + 1))} disabled={currentPage >= pageCount} className="p-2 rounded-md hover:bg-black/10 dark:hover:bg-white/10 disabled:opacity-50">
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};


// Komponen Utama DataViewLayout
export default function DataViewLayout({ title, data, CardComponent, filterOptions, ...props }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);
    const [isFilterOpen, setFilterOpen] = useState(false);
    const [activeFilters, setActiveFilters] = useState({});

    const filteredData = useMemo(() => {
        return (data || []).filter(item => {
            // Logika Pencarian
            const searchMatch = Object.values(item).some(val => 
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );
            if (!searchMatch) return false;

            // Logika Filter
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
    
    const handleApplyFilter = (filters) => {
        setActiveFilters(filters);
        setFilterOpen(false);
    };

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
                                <Filter className="w-5 h-5" />
                            </button>
                            {isFilterOpen && <FilterPopover options={filterOptions} onApply={handleApplyFilter} onReset={() => setActiveFilters({})} />}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedData.length > 0 ? 
                    paginatedData.map((item, index) => <CardComponent key={item.id} item={item} index={index} {...props} />) : 
                    <div className="lg:col-span-2 xl:col-span-3 text-center p-8 bg-bg-surface/50 rounded-lg border border-border-color text-text-secondary">
                        Tidak ada data yang cocok dengan pencarian atau filter Anda.
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
};
