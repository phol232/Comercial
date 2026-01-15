import React from 'react';
import { useStore } from '@nanostores/react';
import { authToken, logout } from '@/stores/authStore';
import { Button } from "@/components/ui/button";

export const Header = () => {
  const $token = useStore(authToken);

  return (
    <div className="container mx-auto pt-6 px-4">
      <header className="w-full py-3 px-8 rounded-full bg-white shadow-lg flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center select-none">
          <span className="text-2xl font-bold text-[#1e293b]">Lara</span>
          <span className="text-2xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">igo</span>
        </div>

        {/* Navigation */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium text-[#334155]">
          <a href="#" className="hover:text-[#1e293b] transition-colors">Agentes IA</a>
          <a href="#" className="hover:text-[#1e293b] transition-colors">Funcionalidades</a>
          <a href="#" className="hover:text-[#1e293b] transition-colors">Casos de éxito</a>
          <a href="#" className="hover:text-[#1e293b] transition-colors">Planes y Precios</a>
          <a href="#" className="hover:text-[#1e293b] transition-colors">Blog</a>
          <a href="#" className="hover:text-[#1e293b] transition-colors">Nosotros</a>
        </nav>

        {/* Auth Buttons */}
        <div>
          {$token ? (
            <Button 
              onClick={logout}
              className="rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium px-6 h-10 border border-slate-200 shadow-sm"
            >
              Cerrar sesión
            </Button>
          ) : (
            <Button 
              onClick={() => window.location.href = '/login'}
              className="rounded-full bg-gradient-to-r from-[#ec4899] to-[#be185d] hover:from-[#db2777] hover:to-[#9d174d] text-white font-medium px-6 h-10 border border-white/20 shadow-sm"
            >
              Iniciar sesión
            </Button>
          )}
        </div>
      </header>
    </div>
  );
};
