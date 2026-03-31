'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/contexts/authStore';
import { BookOpen, Users, LayoutDashboard, LogOut, RefreshCw } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Início',    icon: LayoutDashboard },
  { href: '/album',     label: 'Álbum',     icon: BookOpen },
  { href: '/repetidas', label: 'Repetidas', icon: RefreshCw },
  { href: '/matches',   label: 'Matches',   icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => { logout(); router.push('/login'); };

  return (
    <nav className="bg-galo-black border-b-2 border-galo-gold shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-lg overflow-hidden flex items-center justify-center bg-galo-gold">
            <Image src="/logo.png" alt="FroSócios" width={36} height={36}
                   className="object-cover w-full h-full"
                   onError={(e) => { (e.target as HTMLImageElement).style.display='none'; }} />
          </div>
          <div className="hidden sm:block">
            <span className="text-galo-gold font-black tracking-tight">FroSócios</span>
            <span className="text-white font-light ml-1.5 text-sm">Figurinhas</span>
          </div>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-0.5 overflow-x-auto">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                          transition-all whitespace-nowrap
                ${pathname === href
                  ? 'bg-galo-gold text-galo-black font-bold shadow-sm'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
              <Icon size={15} />
              <span className="hidden md:block">{label}</span>
            </Link>
          ))}
        </div>

        {/* Usuário */}
        <div className="flex items-center gap-2 shrink-0">
          {user && (
            <span className="hidden sm:block text-xs text-white/50 truncate max-w-[120px]">
              {user.name}
            </span>
          )}
          <button onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
                       text-white/60 hover:bg-white/10 hover:text-white transition-all">
            <LogOut size={15} />
            <span className="hidden sm:block">Sair</span>
          </button>
        </div>
      </div>
    </nav>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 20b2388ecb0775f0530872c0c9e0a3967706be07
