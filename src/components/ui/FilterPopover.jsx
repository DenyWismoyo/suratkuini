import { useState } from 'react';

export default function FilterPopover({ options, onApply, onReset }) {
    const [filters, setFilters] = useState({});

    const handleSetFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="filter-popover">
            <h4 className="font-bold mb-2 text-text-primary">Filter Lanjutan</h4>
            {options.map(opt => (
                <div key={opt.key} className="mb-3">
                    <label className="text-xs font-medium text-text-secondary">{opt.label}</label>
                    <select
                        onChange={(e) => handleSetFilter(opt.key, e.target.value)}
                        className="form-input-elegant text-sm p-2 mt-1"
                        value={filters[opt.key] || ''}
                    >
                        <option value="">Semua</option>
                        {opt.values.map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
            ))}
            <div className="flex gap-2 mt-4">
                <button onClick={() => onApply(filters)} className="elegant-btn text-sm py-1 px-3 flex-1">Terapkan</button>
                <button onClick={() => { setFilters({}); onReset(); }} className="elegant-btn bg-bg-muted text-text-primary hover:bg-border-color text-sm py-1 px-3">Reset</button>
            </div>
        </div>
    );
}
