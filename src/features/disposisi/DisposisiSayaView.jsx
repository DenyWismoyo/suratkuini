import React from 'react';
import DataViewLayout from '../../components/ui/DataViewLayout.jsx';
import DisposisiCard from './DisposisiCard.jsx';

export default function DisposisiSayaView({ disposisiSaya, allData, openModal, userInfo }) {
    const filterOptions = [
        { key: 'statusTindakLanjut', label: 'Status Tindak Lanjut', values: ['Baru', 'Dikerjakan', 'Selesai'] }
    ];
    return (
        <DataViewLayout 
            title="Tugas Saya" 
            data={disposisiSaya} 
            CardComponent={({ item, index }) => <DisposisiCard item={item} index={index} allData={allData} isTugasSaya={true} openModal={openModal} userInfo={userInfo} />} 
            filterOptions={filterOptions} 
        />
    );
};
