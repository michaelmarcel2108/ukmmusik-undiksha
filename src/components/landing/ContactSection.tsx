"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";

export default function ContactSection() {
  return (
    <section id="kontak" className="py-20 bg-card/50 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider mb-4">Hubungi <span className="text-ukmred">Kami</span></h2>
          <div className="h-1 w-20 bg-ukmred mx-auto rounded-full mb-6"></div>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Punya pertanyaan atau ingin bekerja sama? Jangan ragu untuk menghubungi kontak pengurus UKM Musik Undiksha di bawah ini.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {/* Penanggung Jawab */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-background rounded-2xl p-8 border border-border text-center hover:border-ukmred/30 transition-colors"
          >
            <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
              <Phone className="text-ukmred w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">Ketua Umum</h3>
            <p className="text-foreground/60 text-sm mb-4">Gede Budiarta</p>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-ukmred font-semibold hover:underline">
              +62 812 3456 7890
            </a>
          </motion.div>

          {/* Humas */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-2xl p-8 border border-border text-center hover:border-ukmred/30 transition-colors"
          >
            <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="text-ukmred w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">Humas</h3>
            <p className="text-foreground/60 text-sm mb-4">Kerjasama & Info</p>
            <a href="mailto:humas@ukmmusik-undiksha.ac.id" className="text-ukmred font-semibold hover:underline">
              Email Kami
            </a>
          </motion.div>

          {/* Inventaris */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-background rounded-2xl p-8 border border-border text-center hover:border-ukmred/30 transition-colors"
          >
            <div className="w-14 h-14 bg-card rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="text-ukmred w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-1">Inventaris</h3>
            <p className="text-foreground/60 text-sm mb-4">Sewa Alat & Studio</p>
            <a href="https://wa.me/6289876543210" target="_blank" rel="noreferrer" className="text-ukmred font-semibold hover:underline">
              +62 898 7654 3210
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
