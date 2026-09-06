"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Info } from "lucide-react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isBefore, startOfToday } from "date-fns";
import { id } from "date-fns/locale";

export default function BookingStudioPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  
  const today = startOfToday();

  return (
    <div className="container mx-auto px-4 py-12 lg:py-20 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 font-outfit">
          Booking <span className="text-ukmred">Studio Sekre</span>
        </h1>
        <p className="text-foreground/70 max-w-2xl mx-auto">
          Pilih tanggal untuk melihat jadwal kosong dan mem-booking studio untuk latihan band Anda.
        </p>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-ukmred" />
            {format(currentMonth, 'MMMM yyyy', { locale: id })}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-muted rounded-lg transition-colors border border-border"
              aria-label="Bulan sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-muted rounded-lg transition-colors border border-border"
              aria-label="Bulan selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
            <div key={day} className="text-center font-semibold text-sm text-foreground/60 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-3">
          {/* Empty slots for starting day of week */}
          {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="p-2" />
          ))}

          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const isPast = isBefore(day, today);
            
            return (
              <Link
                key={day.toString()}
                href={isPast ? "#" : `/booking-studio/${dateStr}`}
                className={`
                  flex flex-col items-center justify-center p-2 md:p-4 rounded-xl border transition-all
                  ${isPast 
                    ? 'bg-muted/50 border-transparent text-foreground/30 cursor-not-allowed' 
                    : 'bg-card border-border hover:border-ukmred hover:bg-ukmred/5 hover:text-ukmred cursor-pointer'
                  }
                  ${isToday(day) ? 'ring-2 ring-ukmred ring-offset-2 ring-offset-background' : ''}
                `}
                onClick={(e) => {
                  if (isPast) e.preventDefault();
                }}
              >
                <span className={`text-lg md:text-xl font-medium ${isToday(day) ? 'text-ukmred' : ''}`}>
                  {format(day, 'd')}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-8 bg-blue-500/10 border border-blue-500/20 text-blue-500 p-4 rounded-xl flex gap-3 items-start">
        <Info className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">Informasi Booking:</p>
          <ul className="list-disc pl-4 space-y-1 opacity-90">
            <li>Booking hanya dapat dilakukan untuk hari ini dan hari-hari berikutnya.</li>
            <li>Maksimal booking adalah 2 jam untuk setiap kelompok band.</li>
            <li>Status awal booking adalah <strong>Pending</strong> hingga disetujui admin.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
