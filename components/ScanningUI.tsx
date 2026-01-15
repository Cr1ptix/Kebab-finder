import React from 'react';
import { Crosshair } from 'lucide-react';

export const ScanningUI: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full animate-in fade-in duration-700">
      <div className="relative w-72 h-72 flex items-center justify-center mb-8">
        {/* Outer Circle */}
        <div className="absolute inset-0 rounded-full border border-orange-900/30"></div>
        <div className="absolute inset-8 rounded-full border border-orange-900/50"></div>
        <div className="absolute inset-16 rounded-full border border-orange-900/70"></div>
        
        {/* Radar Sweep */}
        <div className="absolute inset-0 rounded-full radar-sweep opacity-50"></div>
        
        {/* Center Icon */}
        <div className="relative z-10 w-24 h-24 rounded-full border-4 border-orange-500 flex items-center justify-center bg-black shadow-[0_0_30px_rgba(234,88,12,0.4)]">
           <div className="w-16 h-16 rounded-full border-2 border-dashed border-orange-400 animate-spin-slow"></div>
           <Crosshair className="absolute text-orange-500 w-8 h-8" />
        </div>
      </div>

      <h2 className="text-orange-500 text-xl font-bold tracking-widest uppercase mb-2">Expanding Search Radius...</h2>
      <p className="text-zinc-500 text-sm tracking-wide mb-8">Locating the nearest rotating meat...</p>

      {/* Progress Bar */}
      <div className="w-full max-w-xs relative">
        <div className="flex justify-between text-[10px] text-zinc-600 font-bold tracking-widest mb-1">
          <span>SCANNING AREA</span>
          <span>25KM RADIUS</span>
        </div>
        <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
          <div className="h-full bg-orange-600 w-2/3 animate-[pulse_2s_ease-in-out_infinite]"></div>
        </div>
      </div>
    </div>
  );
};