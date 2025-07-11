import { useUI } from "../../context/UIContext";
import SuratMasukModal from "../Surat/SuratMasukModal";
import SuratKeluarModal from "../Surat/SuratKeluarModal";
import DisposisiModal from "../Disposisi/DisposisiModal";
import TeruskanDisposisiModal from "../Disposisi/TeruskanDisposisiModal";
import LaporanSelesaiModal from "../Disposisi/LaporanSelesaiModal";
import PenggunaModal from "../Manajemen/PenggunaModal"; // 1. Import
import OPDModal from "../Manajemen/OPDModal";           // 2. Import

export default function ModalRenderer() {
    const { modal } = useUI();

    if (!modal.isOpen) {
        return null;
    }

    switch (modal.type) {
        case 'suratMasuk':
            return <SuratMasukModal />;
        case 'suratKeluar':
            return <SuratKeluarModal />;
        case 'disposisi':
            return <DisposisiModal />;
        case 'teruskanDisposisi':
            return <TeruskanDisposisiModal />;
        case 'laporanSelesai':
            return <LaporanSelesaiModal />;
        case 'pengguna': // 3. Tambahkan case
            return <PenggunaModal />;
        case 'opd': // 4. Tambahkan case
            return <OPDModal />;
        default:
            return null;
    }
}