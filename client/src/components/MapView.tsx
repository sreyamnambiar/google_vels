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
  const [mapError, setMapError] = useState<string | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-96 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 flex items-center justify-center rounded-lg border-2 border-dashed border-blue-200 dark:border-blue-800">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Interactive Map</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Google Maps will be displayed here once the API key is configured</p>
          <div className="text-sm text-gray-500 dark:text-gray-500 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
            <p>To enable maps: Configure <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> in your environment</p>
          </div>
          {locations.length > 0 && (
            <div className="mt-6">
              <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Available Locations:</h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {locations.map(location => (
                  <div 
                    key={location.id} 
                    className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={() => onLocationClick?.(location)}
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">{location.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{location.type}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const handleApiError = (error: any) => {
    console.error('Google Maps API Error:', error);
    setMapError('Failed to load Google Maps. Please check your API key configuration.');
  };

  if (mapError) {
    return (
      <div className="h-96 bg-red-50 dark:bg-red-900/20 flex items-center justify-center rounded-lg border border-red-200 dark:border-red-800">
        <div className="text-center p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2 text-red-900 dark:text-red-100">Map Loading Error</h3>
          <p className="text-red-700 dark:text-red-300 text-sm">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-96 w-full rounded-lg overflow-hidden shadow-lg">
      <APIProvider 
        apiKey={apiKey}
        onLoad={() => console.log('Google Maps API loaded successfully')}
        onError={handleApiError}
      >
        <Map
          center={center}
          zoom={13}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onCameraChanged={(ev) => console.log('Camera changed:', ev.detail)}
        >
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={{ lat: location.lat, lng: location.lng }}
              onClick={() => {
                setSelectedLocation(location);
                onLocationClick?.(location);
              }}
              title={location.name}
            />
          ))}
          
          {selectedLocation && (
            <InfoWindow
              position={{ lat: selectedLocation.lat, lng: selectedLocation.lng }}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="p-3 min-w-[200px]">
                <h3 className="font-semibold text-gray-900 mb-1">{selectedLocation.name}</h3>
                <p className="text-sm text-gray-600 capitalize mb-2">{selectedLocation.type}</p>
                <div className="flex gap-2">
                  <button className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700">
                    Directions
                  </button>
                  <button className="text-xs bg-gray-600 text-white px-2 py-1 rounded hover:bg-gray-700">
                    Details
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </Map>
      </APIProvider>
    </div>
  );
}
