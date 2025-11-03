import React from 'react';
import { MapPin, Navigation, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimpleMapProps {
  query: string;
  location: { lat: number; lng: number };
}

export default function SimpleMap({ query, location }: SimpleMapProps) {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}/@${location.lat},${location.lng},15z`;
    window.open(url, '_blank');
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir//${encodeURIComponent(query)}/@${location.lat},${location.lng},15z`;
    window.open(url, '_blank');
  };

  const openInAppleMaps = () => {
    const url = `http://maps.apple.com/?q=${encodeURIComponent(query)}&ll=${location.lat},${location.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="rounded-lg overflow-hidden border bg-background">
      <div className="p-3 bg-gradient-to-r from-blue-500/10 to-green-500/10 border-b">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-blue-600" />
          <h3 className="font-medium text-sm">Location Search Results</h3>
        </div>
      </div>
      
      <div className="p-4">
        {/* Visual Map Representation */}
        <div className="bg-gradient-to-br from-blue-50 via-green-50 to-blue-50 rounded-lg p-6 text-center border-2 border-dashed border-blue-200">
          <div className="relative">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-red-500 drop-shadow-lg" />
            <div className="absolute -top-1 -right-1">
              <div className="h-3 w-3 bg-red-500 rounded-full animate-ping"></div>
            </div>
          </div>
          
          <h4 className="font-semibold text-gray-800 mb-2">📍 {query}</h4>
          <p className="text-sm text-gray-600 mb-1">
            Coordinates: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </p>
          <p className="text-xs text-gray-500">
            Click below to view in your preferred map app
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          <Button 
            onClick={openInGoogleMaps}
            className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Google Maps
          </Button>
          
          <Button 
            onClick={getDirections}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <Navigation className="h-4 w-4" />
            Get Directions
          </Button>
          
          <Button 
            onClick={openInAppleMaps}
            variant="outline"
            className="w-full flex items-center gap-2"
          >
            <MapPin className="h-4 w-4" />
            Open in Apple Maps
          </Button>
        </div>

        {/* Accessibility Info */}
        <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-800 font-medium">♿ Accessibility Tip:</p>
          <p className="text-xs text-green-700 mt-1">
            When you open the map, look for accessibility features like wheelchair access, accessible parking, and entrance information.
          </p>
        </div>
      </div>
    </div>
  );
}