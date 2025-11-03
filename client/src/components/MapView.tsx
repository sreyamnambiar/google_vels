import { APIProvider, Map, Marker, InfoWindow } from '@vis.gl/react-google-maps';
import { useState } from 'react';

interface Location {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
}

interface MapViewProps {
  locations: Location[];
  center: { lat: number; lng: number };
  onLocationClick?: (location: Location) => void;
}

export default function MapView({ locations, center, onLocationClick }: MapViewProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-96 bg-gray-100 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
          <p className="text-gray-600">Google Maps API key required</p>
          <div className="mt-4 space-y-2">
            {locations.map(location => (
              <div key={location.id} className="p-2 bg-white rounded shadow">
                <strong>{location.name}</strong> - {location.type}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden">
      <APIProvider apiKey={apiKey}>
        <Map
          center={center}
          zoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => {
                setSelectedLocation(location);
                onLocationClick?.(location);
              }}
            />
          ))}
          
          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="p-2">
                <h3 className="font-semibold">{selectedLocation.name}</h3>
                <p className="text-sm text-gray-600">{selectedLocation.type}</p>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
