import React from 'react';
import DataViewLayout from '../../components/ui/DataViewLayout.jsx';
import SuratKeluarCard from './SuratKeluarCard.jsx';

export default function SuratKeluarView({ data, onEdit, userInfo }) {
    return (
        <DataViewLayout 
            title="Surat Keluar" 
            data={data} 
            onEdit={onEdit} 
            CardComponent={SuratKeluarCard} 
            userInfo={userInfo} 
        />
    );
};