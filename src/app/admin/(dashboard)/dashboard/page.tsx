export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Stats Cards Placeholder */}
        <div className="bg-card p-6 rounded-2xl border border-border">
          <h3 className="text-sm font-medium text-foreground/60 mb-1">Total Proker</h3>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border">
          <h3 className="text-sm font-medium text-foreground/60 mb-1">Total Galeri</h3>
          <p className="text-3xl font-bold">45</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border">
          <h3 className="text-sm font-medium text-foreground/60 mb-1">Barang Sewa</h3>
          <p className="text-3xl font-bold">18</p>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border">
          <h3 className="text-sm font-medium text-foreground/60 mb-1">Pengurus</h3>
          <p className="text-3xl font-bold">34</p>
        </div>
      </div>

      <div className="bg-card p-8 rounded-2xl border border-border">
        <h2 className="text-xl font-bold mb-4">Selamat Datang di Admin Panel!</h2>
        <p className="text-foreground/70 mb-4">
          Gunakan menu di sebelah kiri untuk mulai mengelola konten website UKM Musik Undiksha.
        </p>
        <p className="text-foreground/70">
          <strong>Perhatian:</strong> Pastikan gambar yang Anda unggah memiliki ukuran yang optimal (direkomendasikan di bawah 1MB) agar website tetap cepat dimuat.
        </p>
      </div>
    </div>
  );
}
