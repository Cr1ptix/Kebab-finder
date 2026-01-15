import React, { useState, useEffect, useCallback } from 'react';
import { Compass } from './components/Compass';
import { TargetDisplay } from './components/PlaceList';
import { ScanningUI } from './components/ScanningUI';
import { findKebabs } from './services/geminiService';
import { Coordinates, KebabPlace, AppState } from './types';
import { AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [target, setTarget] = useState<KebabPlace | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [heading, setHeading] = useState<number>(0);

  // Initialize and get location
  useEffect(() => {
    if (!navigator.geolocation) {
      setErrorMsg("Geolocation hardware not found.");
      setAppState(AppState.ERROR);
      return;
    }

    setAppState(AppState.LOCATING);
    
    const success = (position: GeolocationPosition) => {
      setCoords({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });
      setAppState(AppState.IDLE);
    };

    const error = (err: GeolocationPositionError) => {
      console.warn("GPS Signal failed:", err.message);
      
      let msg = "GPS Signal Lost.";
      switch(err.code) {
        case err.PERMISSION_DENIED:
          msg = "Access Denied. Enable Location Services.";
          break;
        case err.POSITION_UNAVAILABLE:
          msg = "Position Unavailable. Check Signal.";
          break;
        case err.TIMEOUT:
          msg = "Connection Timed Out. Retry Scan.";
          break;
        default:
          msg = `GPS Error: ${err.message}`;
      }
      
      setErrorMsg(msg);
      setAppState(AppState.ERROR);
    };

    // Request high accuracy, strictly use real GPS
    navigator.geolocation.getCurrentPosition(success, error, {
      enableHighAccuracy: true,
      timeout: 10000, 
      maximumAge: 0
    });

    const handleOrientation = (event: DeviceOrientationEvent) => {
        // iOS requires non-standard property, standard uses alpha
        let compass = (event as any).webkitCompassHeading || Math.abs((event.alpha || 0) - 360);
        setHeading(compass);
    };

    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation);
    }
    return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const handleSearch = useCallback(async () => {
    if (!coords) {
        setErrorMsg("No GPS Fix. Cannot Scan.");
        setAppState(AppState.ERROR);
        return;
    }

    setAppState(AppState.SEARCHING);
    setTarget(null);
    setErrorMsg(null);

    try {
      // Cinematic delay for the scanning animation
      await new Promise(r => setTimeout(r, 3000));
      
      const results = await findKebabs(coords);
      
      if (results.length === 0) {
        setErrorMsg("Sector clear. No kebab signatures detected.");
        setAppState(AppState.IDLE);
      } else {
        setTarget(results[0]); // Take the best one
        setAppState(AppState.RESULTS);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Comms Link Failed (API Error).");
      setAppState(AppState.ERROR);
    }
  }, [coords]);

  const reset = () => {
    // If we have coords, go to IDLE, otherwise try locating again or stay in ERROR
    if (coords) {
        setAppState(AppState.IDLE);
        setTarget(null);
        setErrorMsg(null);
    } else {
        window.location.reload(); // Hard reset to try fetching GPS again
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center relative font-sans selection:bg-orange-500 selection:text-black overflow-hidden">
      
      {/* Top Bar */}
      <header className="w-full px-6 py-6 flex justify-between items-start z-10">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-orange-600 tracking-tighter leading-none">KEBAB COMPASS</h1>
          <span className="text-[10px] text-zinc-600 font-bold tracking-[0.2em] uppercase mt-1">Tactical Gastronomy Unit</span>
        </div>
        
        <button 
          onClick={appState === AppState.RESULTS ? reset : handleSearch}
          disabled={appState === AppState.SEARCHING || appState === AppState.LOCATING || (!coords && appState !== AppState.ERROR)}
          className="w-10 h-10 rounded-full border border-zinc-800 bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-orange-500 hover:border-orange-900 transition-colors disabled:opacity-50"
        >
           <RefreshCw size={16} className={appState === AppState.SEARCHING ? "animate-spin" : ""} />
        </button>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 w-full flex flex-col items-center justify-center relative z-0">
        
        {appState === AppState.SEARCHING && (
          <ScanningUI />
        )}

        {appState === AppState.RESULTS && target && (
          <TargetDisplay place={target} heading={heading} />
        )}

        {(appState === AppState.IDLE || appState === AppState.LOCATING || appState === AppState.ERROR) && (
           <div className="flex flex-col items-center animate-in fade-in duration-500">
              {/* Idle State Compass */}
              <div className="relative mb-12">
                 <div className={`absolute inset-0 bg-orange-500 blur-[80px] opacity-10 rounded-full transition-opacity duration-1000 ${appState === AppState.LOCATING ? 'opacity-20 animate-pulse' : ''}`}></div>
                 <Compass heading={heading} />
              </div>

              {appState === AppState.LOCATING && (
                 <p className="text-zinc-500 text-sm tracking-widest animate-pulse">ACQUIRING SATELLITE LOCK...</p>
              )}

              {appState === AppState.IDLE && (
                 <div className="flex flex-col items-center gap-4">
                   <button 
                     onClick={handleSearch}
                     className="px-8 py-4 bg-orange-600 text-black font-bold text-lg tracking-widest uppercase rounded-sm hover:bg-orange-500 transition-colors shadow-[0_0_20px_rgba(234,88,12,0.3)]"
                   >
                     Initiate Scan
                   </button>
                 </div>
              )}

              {appState === AppState.ERROR && (
                 <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-3 text-red-500 bg-red-950/20 px-6 py-3 border border-red-900/50 rounded-lg max-w-xs text-center">
                        <AlertCircle size={20} className="shrink-0" />
                        <span className="text-xs font-bold tracking-wider uppercase">{errorMsg}</span>
                    </div>
                    <button 
                         onClick={() => window.location.reload()}
                         className="text-zinc-500 text-xs uppercase tracking-widest hover:text-white mt-2"
                    >
                        Retry Connection
                    </button>
                 </div>
              )}
           </div>
        )}

      </main>

      {/* Footer Vignette */}
      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent pointer-events-none"></div>
    </div>
  );
};

export default App;