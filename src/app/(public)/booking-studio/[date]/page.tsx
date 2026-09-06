"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";
import { ArrowLeft, Clock, CheckCircle2, User, Phone, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

const TIME_SLOTS = [
  { id: 1, start: "14:00", end: "15:00", value: "14:00:00" },
  { id: 2, start: "15:00", end: "16:00", value: "15:00:00" },
  { id: 3, start: "16:00", end: "17:00", value: "16:00:00" },
  { id: 4, start: "17:00", end: "18:00", value: "17:00:00" },
  { id: 5, start: "18:00", end: "19:00", value: "18:00:00" },
  { id: 6, start: "19:00", end: "20:00", value: "19:00:00" },
  { id: 7, start: "20:00", end: "21:00", value: "20:00:00" },
];

export default function BookingDetailPage({ params }: { params: Promise<{ date: string }> }) {
  // Gunakan React.use() untuk unwrap params jika menggunakan Next.js 15, 
  // karena warning dari Next.js tentang async params.
  const resolvedParams = use(params);
  const { date } = resolvedParams;

  const router = useRouter();
  const supabase = createClient();

  const [existingBookings, setExistingBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedSlots, setSelectedSlots] = useState<number[]>([]);
  const [bandName, setBandName] = useState("");
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [date]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("studio_bookings")
      .select("*")
      .eq("booking_date", date)
      .in("status", ["pending", "approved"]);

    if (error) {
      console.error("Error fetching bookings:", error);
    } else {
      setExistingBookings(data || []);
    }
    setLoading(false);
  };

  const isSlotBooked = (startTime: string) => {
    return existingBookings.some((b) => {
      // Bandingkan prefix time HH:MM:SS
      return b.start_time.startsWith(startTime.substring(0, 5));
    });
  };

  const handleSlotClick = (slotId: number) => {
    if (selectedSlots.includes(slotId)) {
      setSelectedSlots(selectedSlots.filter((id) => id !== slotId));
    } else {
      if (selectedSlots.length >= 2) {
        setError("Maksimal booking adalah 2 jam (2 slot).");
        return;
      }

      // Memastikan slot yang dipilih berurutan jika 2 jam
      if (selectedSlots.length === 1) {
        const existing = selectedSlots[0];
        if (Math.abs(existing - slotId) !== 1) {
          setError("Pilihan slot lebih dari 1 jam harus berurutan.");
          return;
        }
      }

      setError(null);
      setSelectedSlots([...selectedSlots, slotId].sort((a, b) => a - b));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSlots.length === 0) {
      setError("Silakan pilih minimal 1 slot waktu.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const selectedTimeSlots = selectedSlots.map(id => TIME_SLOTS.find(t => t.id === id)!);

      // Cek satu-satu untuk insert per slot atau gabungkan start-end
      // Kita gabungkan menjadi satu row untuk 1 atau 2 jam sekaligus
      const startTime = selectedTimeSlots[0].value;
      const endTime = selectedTimeSlots.length > 1
        ? `${selectedTimeSlots[1].end}:00`
        : `${selectedTimeSlots[0].end}:00`;

      const { error: insertError } = await supabase
        .from("studio_bookings")
        .insert([
          {
            band_name: bandName,
            contact_info: contact,
            booking_date: date,
            start_time: startTime,
            end_time: endTime,
            status: "pending",
          }
        ]);

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Gagal melakukan booking. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
        <div className="bg-card border border-border p-12 rounded-2xl shadow-xl flex flex-col items-center">
          <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
          <h2 className="text-3xl font-bold mb-4 font-outfit">Booking Berhasil Diajukan!</h2>
          <p className="text-foreground/70 mb-8">
            Jadwal Anda ({bandName}) pada {format(parseISO(date), 'dd MMMM yyyy', { locale: id })} sedang menunggu persetujuan admin. Kami akan menghubungi Anda melalui kontak yang diberikan.
          </p>
          <Link
            href="/booking-studio"
            className="bg-ukmred text-white px-6 py-3 rounded-xl font-semibold hover:bg-ukmred-dark transition-colors"
          >
            Kembali ke Kalender
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
      <Link href="/booking-studio" className="inline-flex items-center text-ukmred hover:underline mb-8 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Kembali ke Kalender
      </Link>

      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 font-outfit">
          Jadwal <span className="text-ukmred">Studio</span>
        </h1>
        <p className="text-foreground/70 text-lg">
          {format(parseISO(date), 'EEEE, dd MMMM yyyy', { locale: id })}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Kolom Pilihan Jam */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-ukmred" />
            Pilih Jam Latihan
          </h3>

          {loading ? (
            <div className="space-y-3 animate-pulse">
              {[1, 2, 3, 4, 5, 6, 7].map(i => (
                <div key={i} className="h-14 bg-muted rounded-xl w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {TIME_SLOTS.map((slot) => {
                const booked = isSlotBooked(slot.start);
                // Jika booking menempati lebih dari 1 jam (misal 14:00-16:00), maka start_time 14:00 dan end_time 16:00.
                // Logika `isSlotBooked` di atas mungkin perlu dicek jika end_time lebih dari 1 jam, tapi karena ini sistem slot per jam, 
                // ini pendekatan paling sederhana. Kita juga cek apakah waktu slot diapit oleh start/end booking.
                const bookingInSlot = existingBookings.find(b => {
                  const bStart = parseInt(b.start_time.substring(0, 2));
                  const bEnd = parseInt(b.end_time.substring(0, 2));
                  const sStart = parseInt(slot.start.substring(0, 2));
                  return sStart >= bStart && sStart < bEnd;
                });

                const disabled = !!bookingInSlot;
                const selected = selectedSlots.includes(slot.id);

                let statusText = "Tersedia";
                if (disabled) {
                  if (bookingInSlot.status === "approved") {
                    statusText = `${bookingInSlot.band_name}`;
                  } else {
                    statusText = "Pending";
                  }
                } else if (selected) {
                  statusText = "Dipilih";
                }

                return (
                  <button
                    key={slot.id}
                    disabled={disabled}
                    onClick={() => handleSlotClick(slot.id)}
                    className={`
                      w-full flex flex-col sm:flex-row justify-between items-start sm:items-center px-4 py-3 rounded-xl border transition-all text-left gap-2
                      ${disabled
                        ? "bg-muted text-foreground/40 border-transparent cursor-not-allowed"
                        : selected
                          ? "bg-ukmred text-white border-ukmred shadow-md"
                          : "bg-background border-border hover:border-ukmred"
                      }
                    `}
                  >
                    <span className="font-medium whitespace-nowrap">{slot.start} - {slot.end}</span>
                    <span className={`text-sm font-semibold text-left sm:text-right ${disabled && bookingInSlot?.status === 'approved' ? 'text-ukmred/70 max-w-[200px] truncate' : ''}`} title={disabled && bookingInSlot?.status === 'approved' ? bookingInSlot.band_name : ''}>
                      {statusText}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Kolom Form Input */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-xl sticky top-24">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <User className="w-5 h-5 text-ukmred" />
            Detail Booking
          </h3>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg flex items-start gap-2 mb-6">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80">Nama Kelompok Band</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={bandName}
                  onChange={(e) => setBandName(e.target.value)}
                  className="block w-full px-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ukmred/50 focus:border-ukmred transition-colors"
                  placeholder="Misal: UKM Musik Band"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-foreground/80">Kontak (WhatsApp / HP)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-foreground/40" />
                </div>
                <input
                  type="text"
                  required
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-ukmred/50 focus:border-ukmred transition-colors"
                  placeholder="08123456789"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="flex justify-between items-center mb-4 text-sm font-medium">
                <span className="text-foreground/70">Total Waktu:</span>
                <span className="text-lg text-ukmred font-bold">{selectedSlots.length} Jam</span>
              </div>
              <button
                type="submit"
                disabled={submitting || loading || selectedSlots.length === 0}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-ukmred hover:bg-ukmred-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ukmred focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {submitting ? "Memproses..." : "Konfirmasi Booking"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
