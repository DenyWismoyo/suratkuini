import React from 'react';
import DataViewLayout from '../../components/ui/DataViewLayout.jsx';
import DisposisiCard from './DisposisiCard.jsx';

export default function DisposisiView({ data, allData, openModal, userInfo }) {
    const filterOptions = [
        { key: 'statusTindakLanjut', label: 'Status Tindak Lanjut', values: ['Baru', 'Dikerjakan', 'Selesai'] }
    ];
    return (
        <DataViewLayout 
            title="Riwayat Disposisi" 
            data={data} 
            CardComponent={({ item, index }) => <DisposisiCard item={item} index={index} allData={allData} isTugasSaya={false} openModal={openModal} userInfo={userInfo} />} 
            filterOptions={filterOptions} 
        />
    );
};