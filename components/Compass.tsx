import React, { useEffect, useState } from 'react';

interface CompassProps {
  heading: number;
  className?: string;
}

export const Compass: React.FC<CompassProps> = ({ heading, className = "" }) => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Smooth rotation
    setRotation(heading);
  }, [heading]);

  return (
    <div className={`relative w-72 h-72 ${className}`}>
      {/* Static Background Ring with Ticks */}
      <div className="absolute inset-0 rounded-full border border-zinc-800 bg-[#0c0c0e]">
        
        {/* Cardinal Points - Static relative to the container, dial rotates */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `rotate(${-rotation}deg)` }}
        >
             {/* Large Ticks */}
            {[0, 90, 180, 270].map((deg) => (
                <div 
                key={deg}
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-0.5"
                style={{ transform: `rotate(${deg}deg)` }}
                >
                    <div className="h-4 bg-zinc-600 w-full"></div>
                    <div className="absolute bottom-0 h-4 bg-zinc-600 w-full"></div>
                </div>
            ))}
            
            {/* Small Ticks */}
            {[...Array(12)].map((_, i) => (
                <div 
                key={i} 
                className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px"
                style={{ transform: `rotate(${i * 30}deg)` }}
                >
                    <div className="h-2 bg-zinc-800 w-full"></div>
                    <div className="absolute bottom-0 h-2 bg-zinc-800 w-full"></div>
                </div>
            ))}

            <div className="absolute top-8 left-1/2 -translate-x-1/2 font-bold text-zinc-500 text-sm">N</div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-bold text-zinc-500 text-sm">S</div>
            <div className="absolute top-1/2 right-8 -translate-y-1/2 font-bold text-zinc-500 text-sm">E</div>
            <div className="absolute top-1/2 left-8 -translate-y-1/2 font-bold text-zinc-500 text-sm">W</div>
        </div>
      </div>

      {/* Center Pivot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-zinc-800 border-2 border-orange-600 z-20"></div>

      {/* The Needle - Fixed pointing 'Forward' visually, while the dial rotates. 
          Effectively, this means the needle always points to top of phone. 
          In the reference image, it points slightly off-center, likely indicating bearing. 
          For this generic compass, we'll keep a static needle indicating 'Target Direction' if we had bearing.
          For now, let's make it look cool.
      */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 pointer-events-none z-10"
           style={{ transform: 'rotate(45deg)' }} /* Simulated target bearing for style */
      >
        <div className="absolute top-1/2 left-1/2 w-0 h-0 
            border-t-[8px] border-t-transparent 
            border-b-[8px] border-b-transparent
            border-l-[60px] border-l-zinc-700
            -translate-y-1/2 -translate-x-full origin-right"
        ></div>
        <div className="absolute top-1/2 left-1/2 w-0 h-0 
            border-t-[8px] border-t-transparent 
            border-b-[8px] border-b-transparent
            border-r-[80px] border-r-orange-600
            -translate-y-1/2 origin-left filter drop-shadow-[0_0_8px_rgba(234,88,12,0.6)]"
        ></div>
      </div>

    </div>
  );
};