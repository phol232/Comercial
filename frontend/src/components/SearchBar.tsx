import React from 'react';
import { useStore } from '@nanostores/react';
import { searchTerm } from '@/stores/searchStore';
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export const SearchBar = () => {
  const $searchTerm = useStore(searchTerm);

  return (
    <div className="container mx-auto px-4 -mt-7 mb-20 relative z-10 max-w-[1400px]">
      <div className="w-full relative">
        <Input 
          type="text" 
          placeholder="Buscar en esta página..." 
          className="w-full h-14 pl-6 pr-12 border border-slate-400 bg-white text-lg shadow-sm placeholder:text-slate-500 rounded-sm focus-visible:ring-[#a855f7]"
          value={$searchTerm}
          onChange={(e) => searchTerm.set(e.target.value)}
        />
        {$searchTerm && (
          <button 
            onClick={() => searchTerm.set('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
