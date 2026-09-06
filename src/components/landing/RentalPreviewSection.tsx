"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Package } from "lucide-react";

const mockBarang = [
  { id: 1, name: "Gitar Elektrik Fender Stratocaster", price: "Rp 50.000", image: "https://images.unsplash.com/photo-1564186763535-ebb21ef5277f?q=80&w=800&auto=format&fit=crop" },
  { id: 2, name: "Drum Set Yamaha Stage Custom", price: "Rp 150.000", image: "https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?q=80&w=800&auto=format&fit=crop" },
  { id: 3, name: "Amplifier Marshall JCM800", price: "Rp 75.000", image: "https://images.unsplash.com/photo-1588665793086-444a1405a7be?q=80&w=800&auto=format&fit=crop" },
  { id: 4, name: "Keyboard Korg Kross 2", price: "Rp 100.000", image: "https://images.unsplash.com/photo-1552422535-c45813c61732?q=80&w=800&auto=format&fit=crop" },
];

export default function RentalPreviewSection() {
  return (
    <section id="rental" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">Sewa <span className="text-ukmred">Alat Musik</span></h2>
            <div className="h-1 w-20 bg-ukmred rounded-full mb-4"></div>
            <p className="text-foreground/70 max-w-xl">
              UKM Musik Undiksha menyewakan berbagai alat musik dan sound system berkualitas untuk menunjang kebutuhan acara Anda.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link 
              href="/katalog-sewa" 
              className="inline-flex items-center gap-2 bg-card hover:bg-card/80 border border-border text-foreground font-medium py-2.5 px-6 rounded-full transition-colors"
            >
              <Package size={18} />
              Lihat Katalog Lengkap
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockBarang.map((barang, index) => (
            <motion.div
              key={barang.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-xl overflow-hidden border border-border hover:border-ukmred/50 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${barang.image}')` }}
                />
              </div>
              <div className="p-5">
                <h3 className="font-semibold text-lg mb-2 line-clamp-1">{barang.name}</h3>
                <p className="text-ukmred font-bold">{barang.price} <span className="text-foreground/50 text-xs font-normal">/ hari</span></p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
