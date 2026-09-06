import Link from "next/link";
import { Camera, Video, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Logo UKM Musik" className="h-10 w-auto object-contain" />
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-ukmred">UKM</span>
                <span className="text-2xl font-bold text-card-foreground">Musik Undiksha</span>
              </div>
            </Link>
            <p className="text-card-foreground/70 mb-4 max-w-sm">
              Unit Kegiatan Mahasiswa Musik Universitas Pendidikan Ganesha. 
              Wadah kreativitas mahasiswa dalam bidang seni musik dengan semangat "Salam Rock".
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-card-foreground/60 hover:text-ukmred transition-colors">
                <Camera className="h-5 w-5" />
              </a>
              <a href="#" className="text-card-foreground/60 hover:text-ukmred transition-colors">
                <Video className="h-5 w-5" />
              </a>
              <a href="#" className="text-card-foreground/60 hover:text-ukmred transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider mb-4">
              Tautan Cepat
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#galeri" className="text-card-foreground/70 hover:text-ukmred transition-colors">
                  Galeri Aktivitas
                </Link>
              </li>
              <li>
                <Link href="/#proker" className="text-card-foreground/70 hover:text-ukmred transition-colors">
                  Program Kerja
                </Link>
              </li>
              <li>
                <Link href="/#bidang" className="text-card-foreground/70 hover:text-ukmred transition-colors">
                  Bidang Organisasi
                </Link>
              </li>
              <li>
                <Link href="/katalog-sewa" className="text-card-foreground/70 hover:text-ukmred transition-colors">
                  Katalog Sewa Alat
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-card-foreground uppercase tracking-wider mb-4">
              Sekretariat
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-ukmred mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-card-foreground/70 text-sm">
                  Gedung Student Center Lt. 1, Universitas Pendidikan Ganesha, Singaraja, Bali.
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center">
          <p className="text-card-foreground/50 text-sm">
            &copy; {new Date().getFullYear()} UKM Musik Undiksha. All rights reserved.
          </p>
          <p className="text-card-foreground/50 text-sm mt-2 md:mt-0">
            Salam Rock! 🤘
          </p>
        </div>
      </div>
    </footer>
  );
}
