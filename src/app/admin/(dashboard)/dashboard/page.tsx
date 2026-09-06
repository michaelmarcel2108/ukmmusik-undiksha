import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Calendar, Clock4 } from "lucide-react";

export default async function DashboardHome() {
  const supabase = await createClient();
  
  // Ambil data booking untuk ringkasan
  const { data: bookings } = await supabase
    .from("studio_bookings")
    .select("status");

  const pendingBookings = bookings?.filter(b => b.status === "pending").length || 0;
  const approvedBookings = bookings?.filter(b => b.status === "approved").length || 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Panel Booking Studio */}
        <div className="bg-card p-6 rounded-2xl border border-border lg:col-span-1 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-ukmred" />
              <h2 className="text-lg font-bold">Booking Studio</h2>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl">
                <span className="flex items-center gap-2 text-yellow-600 text-sm font-medium">
                  <Clock4 className="w-4 h-4" /> Menunggu Persetujuan
                </span>
                <span className="font-bold text-yellow-700">{pendingBookings}</span>
              </div>
              <div className="flex justify-between items-center bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                <span className="text-green-600 text-sm font-medium">Jadwal Disetujui</span>
                <span className="font-bold text-green-700">{approvedBookings}</span>
              </div>
            </div>
          </div>
          
          <Link 
            href="/admin/booking-studio"
            className="block text-center w-full py-2.5 bg-foreground/5 hover:bg-foreground/10 rounded-xl text-sm font-semibold transition-colors"
          >
            Kelola Booking
          </Link>
        </div>

        {/* Panel Welcome */}
        <div className="bg-card p-8 rounded-2xl border border-border lg:col-span-2 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Selamat Datang di Admin Panel!</h2>
          <p className="text-foreground/70 mb-4">
            Gunakan menu di sebelah kiri untuk mulai mengelola konten website UKM Musik Undiksha.
          </p>
          <p className="text-foreground/70">
            <strong>Perhatian:</strong> Pastikan gambar yang Anda unggah memiliki ukuran yang optimal (direkomendasikan di bawah 1MB) agar website tetap cepat dimuat.
          </p>
        </div>
      </div>
    </div>
  );
}
