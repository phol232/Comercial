import React from 'react';
import { Header } from './Header';

export const Hero = () => {
  return (
    <div className="relative w-full pb-24" style={{ background: 'radial-gradient(circle at 50% 45%, #E3E8F4 0%, #D8D4EE 55%, #CFCAEF 100%)' }}>
      {/* Header */}
      <Header />

      {/* Hero Content */}
      <div className="flex flex-col items-center justify-center pt-20 pb-12 px-4">
        <h1 className="text-3xl md:text-5xl lg:text-5xl font-extrabold text-[#0f172a] text-center max-w-4xl tracking-tight leading-tight">
          Potencia tu trabajo con estas herramientas
        </h1>
      </div>
    </div>
  );
};
