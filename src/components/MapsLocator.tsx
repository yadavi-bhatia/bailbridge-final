import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  useMap, 
  useMapsLibrary,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';
import { MapPin, Navigation, Phone, Clock, Shield, Gavel, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

const API_KEY = process.env.GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== '';

// Default location: Bengaluru (Central)
const DEFAULT_CENTER = { lat: 12.9716, lng: 77.5946 };

export default function MapsLocator() {
  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-white/[0.02] border border-dashed border-white/10 rounded-[32px] p-10 text-center">
        <div className="max-w-md">
          <Shield className="w-10 h-10 text-slate-700 mx-auto mb-4" />
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">Google Maps API Key Required</h2>
          <p className="text-xs text-slate-500 leading-relaxed mb-6">
            To enable location services, find police stations, and locate legal aid offices, please provide a Google Maps Platform API Key in your app secrets.
          </p>
          <div className="text-[10px] text-slate-600 text-left space-y-2 bg-black/20 p-4 rounded-2xl">
            <p>1. Open Settings (⚙️ icon) → Secrets</p>
            <p>2. Add <code>GOOGLE_MAPS_PLATFORM_KEY</code></p>
            <p>3. Paste your key and wait for the app to rebuild.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <MapContainer />
    </APIProvider>
  );
}

function MapContainer() {
  const [center, setCenter] = useState(DEFAULT_CENTER);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.Place | null>(null);
  const [searchQuery, setSearchQuery] = useState('Police Station');
  const [category, setCategory] = useState<'police' | 'legal'>('police');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.warn("Geolocation permission denied. Using default center.")
      );
    }
  }, []);

  const handleCategoryChange = (newCategory: 'police' | 'legal') => {
    setCategory(newCategory);
    setSearchQuery(newCategory === 'police' ? 'Police Station' : 'Legal Aid Office NGO');
    setSelectedPlace(null);
    // Force a small pulse or reset if needed
  };

  return (
    <div className="flex flex-col h-[600px] rounded-[32px] overflow-hidden border border-white/5 bg-[#0d0f17]">
      <div className="p-6 border-b border-white/5 flex items-center justify-between gap-4">
        <div className="flex gap-2">
          <Button 
            variant={category === 'police' ? 'secondary' : 'ghost'}
            className={`text-[10px] font-black uppercase tracking-widest px-6 ${category === 'police' ? 'bg-rose-500/20 text-rose-500 hover:bg-rose-500/30' : ''}`}
            onClick={() => handleCategoryChange('police')}
          >
            <Shield className="w-3.5 h-3.5 mr-2" /> Police Stations
          </Button>
          <Button 
            variant={category === 'legal' ? 'secondary' : 'ghost'}
            className={`text-[10px] font-black uppercase tracking-widest px-6 ${category === 'legal' ? 'bg-teal-500/20 text-teal-400 hover:bg-teal-500/30' : ''}`}
            onClick={() => handleCategoryChange('legal')}
          >
            <Gavel className="w-3.5 h-3.5 mr-2" /> Legal Aid & NGOs
          </Button>
        </div>
        
        <div className="flex-1 max-w-sm relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search custom location..." 
            className="w-full bg-white/[0.03] border border-white/5 rounded-full py-4 pl-12 pr-6 text-xs text-white focus:outline-none focus:border-indigo-500/30 transition-all placeholder:text-slate-700"
            onKeyDown={(e) => {
              if (e.key === 'Enter') setSearchQuery((e.target as HTMLInputElement).value);
            }}
          />
        </div>
      </div>

      <div className="relative flex-1">
        <Map
          center={center}
          zoom={14}
          mapId="BAILBRIDGE_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
          gestureHandling={'greedy'}
          disableDefaultUI={true}
        >
          <PlaceMarkers 
            query={searchQuery} 
            onSelect={setSelectedPlace} 
          />
          
          <AdvancedMarker position={center} title="Your Location">
             <div className="relative">
                <div className="absolute -inset-4 bg-indigo-500/20 rounded-full animate-ping" />
                <div className="w-4 h-4 bg-indigo-500 rounded-full border-2 border-white shadow-lg" />
             </div>
          </AdvancedMarker>

          {selectedPlace && (
             <InfoWindow 
               position={selectedPlace.location} 
               onCloseClick={() => setSelectedPlace(null)}
               headerDisabled={true}
             >
                <div className="p-4 min-w-[200px] bg-[#0d0f17] text-white">
                   <h3 className="text-sm font-bold uppercase mb-1">{selectedPlace.displayName}</h3>
                   <p className="text-[10px] text-slate-400 mb-3">{selectedPlace.formattedAddress}</p>
                   {selectedPlace.nationalPhoneNumber && (
                     <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold mt-2">
                        <Phone className="w-3 h-3" /> {selectedPlace.nationalPhoneNumber}
                     </div>
                   )}
                   <Button 
                    className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-[9px] font-black uppercase h-8"
                    onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.location?.lat()},${selectedPlace.location?.lng()}`, '_blank')}
                   >
                     Get Directions
                   </Button>
                </div>
             </InfoWindow>
          )}
        </Map>
      </div>
    </div>
  );
}

function PlaceMarkers({ query, onSelect }: { query: string, onSelect: (p: google.maps.places.Place) => void }) {
  const placesLib = useMapsLibrary('places');
  const map = useMap();
  const [places, setPlaces] = useState<google.maps.places.Place[]>([]);

  useEffect(() => {
    if (!placesLib || !query || !map) return;
    
    placesLib.Place.searchByText({
      textQuery: query,
      fields: ['displayName', 'location', 'formattedAddress', 'id', 'nationalPhoneNumber', 'types'],
      locationBias: map.getCenter(),
      maxResultCount: 15,
    }).then(({ places }) => {
      setPlaces(places);
      if (places.length > 0) {
        // Optionally fit bounds to places
      }
    }).catch(err => console.error("Place search failed:", err));
  }, [placesLib, query, map]);

  return (
    <>
      {places.map(p => (
        <AdvancedMarker 
          key={p.id} 
          position={p.location} 
          onClick={() => onSelect(p)}
        >
          <Pin 
            background={p.types?.includes('police') ? '#f43f5e' : '#10b981'} 
            glyphColor="#fff" 
            borderColor="rgba(255,255,255,0.2)"
          />
        </AdvancedMarker>
      ))}
    </>
  );
}
