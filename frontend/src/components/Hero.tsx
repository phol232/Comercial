import React from 'react';
import { useStore } from '@nanostores/react';
import { searchTerm } from '@/stores/searchStore';
import { Search } from 'lucide-react';
import { Header } from './Header';

export const Hero = () => {
  const $searchTerm = useStore(searchTerm);

  return (
    <div className="relative w-full pb-24" style={{ background: 'radial-gradient(circle at 50% 45%, #E3E8F4 0%, #D8D4EE 55%, #CFCAEF 100%)' }}>
      {/* Header */}
      <Header />

      {/* Hero Content */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-4">
        <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-[#0f172a] text-center max-w-4xl tracking-tight leading-tight mb-8">
          Potencia tu trabajo con estas herramientas
        </h1>

        <div className="relative w-full max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-full leading-5 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#A43E8A] focus:border-transparent sm:text-sm shadow-md"
            placeholder="Buscar recursos, demos, cápsulas..."
            value={$searchTerm}
            onChange={(e) => searchTerm.set(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
