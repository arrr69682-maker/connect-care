import { useState, useEffect } from 'react';
import { MapPin, ZoomIn, ZoomOut, Compass, Navigation } from 'lucide-react';
import { VolunteerProfile } from '../types';

interface MockMapProps {
  volunteers: VolunteerProfile[];
  elderGps: { lat: number; lng: number };
  activeVolunteerId?: string;
  onSelectVolunteer?: (volunteer: VolunteerProfile) => void;
  showRoute?: boolean;
}

export default function MockMap({
  volunteers,
  elderGps,
  activeVolunteerId,
  onSelectVolunteer,
  showRoute = false,
}: MockMapProps) {
  const [zoom, setZoom] = useState(14);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [selectedVol, setSelectedVol] = useState<VolunteerProfile | null>(null);

  // Convert GPS coordinates to local SVG coords for visualization
  // Center is around (13.75, 100.55)
  const centerLat = 13.75;
  const centerLng = 100.55;
  const scale = zoom * 1200;

  const getCoords = (lat: number, lng: number) => {
    const x = (lng - centerLng) * scale + 150 + offset.x;
    const y = -(lat - centerLat) * scale + 150 + offset.y;
    return { x, y };
  };

  const elderCoords = getCoords(elderGps.lat, elderGps.lng);

  useEffect(() => {
    if (activeVolunteerId) {
      const vol = volunteers.find(v => v.id === activeVolunteerId);
      if (vol) {
        setSelectedVol(vol);
        // Center on the active volunteer and elder
        const dLat = (vol.gps.lat + elderGps.lat) / 2;
        const dLng = (vol.gps.lng + elderGps.lng) / 2;
        setOffset({
          x: -(dLng - centerLng) * scale,
          y: (dLat - centerLat) * scale,
        });
      }
    }
  }, [activeVolunteerId, volunteers, elderGps.lat, elderGps.lng, scale]);

  const handleMarkerClick = (vol: VolunteerProfile) => {
    setSelectedVol(vol);
    if (onSelectVolunteer) {
      onSelectVolunteer(vol);
    }
  };

  return (
    <div className="relative w-full h-[240px] md:h-[300px] bg-slate-100 rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
      {/* Map Background SVG representing streets and green areas */}
      <svg className="absolute inset-0 w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
        {/* Background Land */}
        <rect width="100%" height="100%" fill="#EBF3EB" />
        
        {/* Simulated Parks */}
        <circle cx={elderCoords.x - 120} cy={elderCoords.y + 80} r="90" fill="#D3EAD3" />
        <circle cx={elderCoords.x + 200} cy={elderCoords.y - 100} r="140" fill="#D3EAD3" />
        
        {/* Chao Phraya River Simulation */}
        <path
          d={`M ${elderCoords.x - 300} -50 C ${elderCoords.x - 200} 100, ${elderCoords.x - 350} 300, ${elderCoords.x - 250} 500`}
          fill="none"
          stroke="#C5DCEB"
          strokeWidth="35"
          strokeLinecap="round"
        />

        {/* Major Roads (Grid pattern) */}
        <line x1="-100" y1={elderCoords.y - 40} x2="600" y2={elderCoords.y - 40} stroke="#FFFFFF" strokeWidth="12" />
        <line x1="-100" y1={elderCoords.y - 40} x2="600" y2={elderCoords.y - 40} stroke="#E2E2E2" strokeWidth="1" />

        <line x1="-100" y1={elderCoords.y + 60} x2="600" y2={elderCoords.y + 60} stroke="#FFFFFF" strokeWidth="14" />
        <line x1="-100" y1={elderCoords.y + 60} x2="600" y2={elderCoords.y + 60} stroke="#E2E2E2" strokeWidth="1" />

        <line x1={elderCoords.x - 60} y1="-50" x2={elderCoords.x - 60} y2="500" stroke="#FFFFFF" strokeWidth="12" />
        <line x1={elderCoords.x - 60} y1="-50" x2={elderCoords.x - 60} y2="500" stroke="#E2E2E2" strokeWidth="1" />

        <line x1={elderCoords.x + 100} y1="-50" x2={elderCoords.x + 100} y2="500" stroke="#FFFFFF" strokeWidth="14" />
        <line x1={elderCoords.x + 100} y1="-50" x2={elderCoords.x + 100} y2="500" stroke="#E2E2E2" strokeWidth="1" />

        {/* Diagonal high speed highway */}
        <line x1="-100" y1="-50" x2="600" y2="450" stroke="#FFE0B2" strokeWidth="8" />

        {/* If route is shown, draw connecting path */}
        {showRoute && selectedVol && (
          <path
            d={`M ${elderCoords.x} ${elderCoords.y} 
                L ${elderCoords.x} ${getCoords(selectedVol.gps.lat, selectedVol.gps.lng).y} 
                L ${getCoords(selectedVol.gps.lat, selectedVol.gps.lng).x} ${getCoords(selectedVol.gps.lat, selectedVol.gps.lng).y}`}
            fill="none"
            stroke="#4CAF7A"
            strokeWidth="5"
            strokeDasharray="8,6"
            strokeLinecap="round"
            className="animate-[dash_1s_linear_infinite]"
          />
        )}
      </svg>

      {/* Styled animation for path dash */}
      <style>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -14;
          }
        }
      `}</style>

      {/* Map Labels */}
      <div className="absolute top-2 left-2 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-lg text-[10px] font-medium text-gray-500 flex items-center gap-1 shadow-xs">
        <Compass className="w-3 h-3 text-emerald-600 animate-pulse" />
        <span>แผนที่จำลองบริเวณกรุงเทพฯ</span>
      </div>

      {/* Map Interactive Pins */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Elder Pin */}
        <div
          style={{ left: `${elderCoords.x}px`, top: `${elderCoords.y}px` }}
          className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-auto"
        >
          <div className="bg-red-500 text-white p-1.5 rounded-full shadow-md animate-bounce ring-4 ring-red-200">
            <MapPin className="w-4 h-4 fill-white" />
          </div>
          <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold shadow-xs mt-1 border border-red-200">
            คุณ (ผู้สูงอายุ)
          </span>
        </div>

        {/* Volunteer Pins */}
        {volunteers.map(vol => {
          const coords = getCoords(vol.gps.lat, vol.gps.lng);
          const isSelected = selectedVol?.id === vol.id;
          return (
            <div
              key={vol.id}
              style={{ left: `${coords.x}px`, top: `${coords.y}px` }}
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center pointer-events-auto cursor-pointer"
              onClick={() => handleMarkerClick(vol)}
            >
              <div
                className={`p-1 rounded-full shadow-md transition-all duration-300 ${
                  isSelected ? 'bg-emerald-600 ring-4 ring-emerald-200 scale-125 z-10' : 'bg-orange-500 hover:scale-110'
                }`}
              >
                <img
                  src={vol.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=60'}
                  alt={vol.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-white"
                />
              </div>
              <span
                className={`px-1.5 py-0.5 rounded text-[9px] font-semibold mt-1 shadow-xs border transition-all ${
                  isSelected
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                {vol.name} ({Math.round(Math.abs(vol.gps.lat - elderGps.lat) * 111300)}ม.)
              </span>
            </div>
          );
        })}
      </div>

      {/* Map Controls */}
      <div className="absolute right-2 bottom-2 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => setZoom(z => Math.min(18, z + 1))}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 active:scale-95 text-gray-600 border border-gray-100"
          title="ซูมเข้า"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(z => Math.max(10, z - 1))}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 active:scale-95 text-gray-600 border border-gray-100"
          title="ซูมออก"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setOffset({ x: 0, y: 0 });
            setZoom(14);
          }}
          className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 active:scale-95 text-gray-600 border border-gray-100"
          title="ตำแหน่งเริ่มต้น"
        >
          <Navigation className="w-4 h-4 rotate-45 text-emerald-600" />
        </button>
      </div>

      {/* Info Overlay at the bottom when a volunteer pin is selected */}
      {selectedVol && !showRoute && (
        <div className="absolute bottom-2 left-2 right-12 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl shadow-md border border-gray-100 flex items-center justify-between text-xs pointer-events-auto animate-[fadeIn_0.2s_ease-out]">
          <div className="flex items-center gap-2">
            <img
              src={selectedVol.profileImage}
              alt={selectedVol.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-emerald-100"
            />
            <div>
              <p className="font-bold text-gray-800">อาสา: {selectedVol.name} {selectedVol.surname}</p>
              <p className="text-[10px] text-gray-500">⭐ {selectedVol.rating} • {selectedVol.organization}</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (onSelectVolunteer) onSelectVolunteer(selectedVol);
            }}
            className="bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-600 text-[11px] active:scale-95"
          >
            ดูโปรไฟล์
          </button>
        </div>
      )}
    </div>
  );
}
