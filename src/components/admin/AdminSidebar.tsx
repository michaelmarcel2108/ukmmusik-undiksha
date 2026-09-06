"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  Image as ImageIcon, 
  FileText, 
  Users, 
  Package, 
  Phone,
  LogOut,
  Calendar
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Booking Studio", href: "/admin/booking-studio", icon: Calendar },
  { name: "Pengaturan Utama", href: "/admin/settings", icon: Settings },
  { name: "Galeri Aktivitas", href: "/admin/gallery", icon: ImageIcon },
  { name: "Program Kerja", href: "/admin/proker", icon: FileText },
  { name: "Bidang & Anggota", href: "/admin/bidang", icon: Users },
  { name: "Barang Sewa", href: "/admin/rental", icon: Package },
  { name: "Kontak", href: "/admin/contact", icon: Phone },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="w-64 bg-card border-r border-border h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-border">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-ukmred">Admin</span>
          <span className="text-xl font-bold text-foreground">Panel</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors ${
                  isActive 
                    ? "bg-ukmred text-white" 
                    : "text-foreground/70 hover:bg-background hover:text-foreground"
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? "text-white" : "text-foreground/50"}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center px-4 py-3 text-sm font-medium rounded-xl text-foreground/70 hover:bg-red-500/10 hover:text-ukmred transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-foreground/50 group-hover:text-ukmred" />
          Logout
        </button>
      </div>
    </div>
  );
}
