"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { Calendar, Clock, CheckCircle2, XCircle, Clock4, Trash2 } from "lucide-react";

type Booking = {
  id: string;
  band_name: string;
  contact_info: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export default function AdminBookingStudioPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("studio_bookings")
      .select("*")
      .order("booking_date", { ascending: false })
      .order("start_time", { ascending: true });

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setBookings(data || []);
    }
    setLoading(false);
  };

  const updateStatus = async (bookingId: string, newStatus: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from("studio_bookings")
      .update({ status: newStatus })
      .eq("id", bookingId);

    if (error) {
      alert("Gagal mengupdate status: " + error.message);
    } else {
      setBookings(bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    }
  };

  const deleteBooking = async (bookingId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus booking ini?")) return;
    
    const { error } = await supabase
      .from("studio_bookings")
      .delete()
      .eq("id", bookingId);

    if (error) {
      alert("Gagal menghapus booking: " + error.message);
    } else {
      setBookings(bookings.filter(b => b.id !== bookingId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manajemen Booking Studio</h1>
          <p className="text-foreground/70 mt-1">Kelola persetujuan jadwal penggunaan studio sekre.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="p-4 font-semibold text-foreground/80">Band / Kontak</th>
                <th className="p-4 font-semibold text-foreground/80">Jadwal</th>
                <th className="p-4 font-semibold text-foreground/80">Status</th>
                <th className="p-4 font-semibold text-foreground/80 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/50">
                    Memuat data...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-foreground/50">
                    Belum ada pengajuan booking studio.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold">{booking.band_name}</div>
                      <div className="text-sm text-foreground/60">{booking.contact_info}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-ukmred" />
                        {format(parseISO(booking.booking_date), 'dd MMM yyyy', { locale: id })}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm text-foreground/70 mt-1">
                        <Clock className="w-4 h-4" />
                        {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
                      </div>
                    </td>
                    <td className="p-4">
                      {booking.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-600 border border-yellow-500/20">
                          <Clock4 className="w-3.5 h-3.5" /> Pending
                        </span>
                      )}
                      {booking.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-600 border border-green-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Disetujui
                        </span>
                      )}
                      {booking.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-600 border border-red-500/20">
                          <XCircle className="w-3.5 h-3.5" /> Ditolak
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {booking.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateStatus(booking.id, 'approved')}
                            className="p-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded-lg transition-colors border border-green-500/20"
                            title="Setujui Booking"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => updateStatus(booking.id, 'rejected')}
                            className="p-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 rounded-lg transition-colors border border-red-500/20"
                            title="Tolak Booking"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => deleteBooking(booking.id)}
                        className="p-2 bg-foreground/5 text-foreground/50 hover:bg-red-500/10 hover:text-red-600 rounded-lg transition-colors"
                        title="Hapus Data"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
