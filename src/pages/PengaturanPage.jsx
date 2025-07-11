import PasteDataImporter from "../../components/Manajemen/PasteDataImporter";

export default function PengaturanPage() {
    return (
      <div>
        <h1 className="text-3xl font-bold text-text-primary mb-6">Pengaturan</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PasteDataImporter
            title="Impor Massal Klasifikasi"
            collectionName="klasifikasi"
            requiredFields={["kode", "keterangan"]}
            description="Tempel data dari spreadsheet (Excel, Google Sheets) di sini. Pastikan urutan kolom adalah: 'kode', lalu 'keterangan'."
          />
          <PasteDataImporter
            title="Impor Massal Tujuan / Pengirim"
            collectionName="tujuan"
            requiredFields={["nama"]}
            description="Tempel data dari spreadsheet di sini. Pastikan kolom pertama berisi 'nama' tujuan atau pengirim."
          />
        </div>
      </div>
    );
}
