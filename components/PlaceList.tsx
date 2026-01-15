import React from 'react';
import { KebabPlace } from '../types';
import { Compass } from './Compass';
import { MapPin, FlaskConical } from 'lucide-react'; // Beaker replacement

interface TargetDisplayProps {
  place: KebabPlace;
  heading: number;
}

export const TargetDisplay: React.FC<TargetDisplayProps> = ({ place, heading }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-md animate-in zoom-in-95 duration-500">
      
      {/* Status Badge */}
      <div className="mb-6 px-4 py-1.5 rounded-full bg-[#1c130d] border border-orange-900/40">
        <span className="text-orange-500 text-xs font-bold tracking-[0.2em] uppercase">Contact Confirmed</span>
      </div>

      {/* Place Info */}
      <div className="text-center mb-6 px-4">
        <h1 className="text-3xl font-bold text-white mb-2 leading-tight drop-shadow-lg">{place.name}</h1>
        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">{place.address}</p>
      </div>

      {/* Compass */}
      <div className="mb-8 scale-90 md:scale-100">
        <Compass heading={heading} />
      </div>

      {/* Distance Metric */}
      <div className="text-center mb-8">
        <div className="text-6xl font-black text-orange-500 tracking-tighter drop-shadow-[0_0_15px_rgba(234,88,12,0.3)]">
          {place.distance}
        </div>
        <div className="text-zinc-600 text-[10px] font-bold tracking-[0.3em] uppercase mt-1">
          Distance to Kebab
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 w-full px-6">
        {/* Secondary Action */}
        <button className="w-16 h-14 rounded-xl bg-[#111] border border-zinc-800 flex items-center justify-center text-orange-600 hover:bg-zinc-900 active:scale-95 transition-all">
          <FlaskConical size={24} strokeWidth={1.5} />
        </button>

        {/* Primary Action */}
        <a 
          href={place.uri} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 h-14 bg-gradient-to-r from-orange-700 to-orange-600 rounded-xl flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <MapPin className="text-black" size={20} fill="currentColor" />
          <span className="text-black font-bold tracking-widest text-sm uppercase">Tactical Route</span>
        </a>
      </div>

    </div>
  );
};