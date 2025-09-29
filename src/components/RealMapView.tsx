import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navigation, MapPin, Camera, Signal } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Camera {
  id: string;
  name: string;
  type: 'traffic' | 'pedestrian' | 'overview';
  angle: string;
  status: 'online' | 'offline';
}

interface Intersection {
  id: string;
  name: string;
  lat: number;
  lng: number;
  cameras: Camera[];
  status: 'active' | 'inactive' | 'maintenance';
}

// Sample intersections with real coordinates (using New York City as example)
const intersections: Intersection[] = [
  {
    id: 'int-1',
    name: 'Times Square & Broadway',
    lat: 40.7580,
    lng: -73.9855,
    status: 'active',
    cameras: [
      { id: 'cam-1-1', name: 'North View', type: 'traffic', angle: 'North', status: 'online' },
      { id: 'cam-1-2', name: 'South View', type: 'traffic', angle: 'South', status: 'online' },
      { id: 'cam-1-3', name: 'East View', type: 'traffic', angle: 'East', status: 'online' },
      { id: 'cam-1-4', name: 'West View', type: 'traffic', angle: 'West', status: 'offline' },
    ]
  },
  {
    id: 'int-2',
    name: '5th Ave & 42nd St',
    lat: 40.7516,
    lng: -73.9776,
    status: 'active',
    cameras: [
      { id: 'cam-2-1', name: 'North View', type: 'traffic', angle: 'North', status: 'online' },
      { id: 'cam-2-2', name: 'South View', type: 'traffic', angle: 'South', status: 'online' },
      { id: 'cam-2-3', name: 'Overview', type: 'overview', angle: 'Aerial', status: 'online' },
    ]
  },
  {
    id: 'int-3',
    name: 'Madison Ave & 23rd St',
    lat: 40.7424,
    lng: -73.9882,
    status: 'active',
    cameras: [
      { id: 'cam-3-1', name: 'East View', type: 'traffic', angle: 'East', status: 'online' },
      { id: 'cam-3-2', name: 'West View', type: 'traffic', angle: 'West', status: 'online' },
      { id: 'cam-3-3', name: 'Pedestrian Crossing', type: 'pedestrian', angle: 'North', status: 'online' },
      { id: 'cam-3-4', name: 'Pedestrian Crossing', type: 'pedestrian', angle: 'South', status: 'online' },
    ]
  },
  {
    id: 'int-4',
    name: 'Park Ave & 59th St',
    lat: 40.7648,
    lng: -73.9731,
    status: 'maintenance',
    cameras: [
      { id: 'cam-4-1', name: 'North View', type: 'traffic', angle: 'North', status: 'offline' },
      { id: 'cam-4-2', name: 'South View', type: 'traffic', angle: 'South', status: 'offline' },
    ]
  },
  {
    id: 'int-5',
    name: 'Broadway & 14th St',
    lat: 40.7353,
    lng: -73.9906,
    status: 'active',
    cameras: [
      { id: 'cam-5-1', name: 'Overview', type: 'overview', angle: 'Aerial', status: 'online' },
      { id: 'cam-5-2', name: 'East View', type: 'traffic', angle: 'East', status: 'online' },
      { id: 'cam-5-3', name: 'West View', type: 'traffic', angle: 'West', status: 'online' },
    ]
  }
];

interface RealMapViewProps {
  selectedIntersection: Intersection | null;
  onIntersectionSelect: (intersection: Intersection) => void;
  isDarkMode?: boolean;
}

// Custom marker icons for different statuses
const createCustomIcon = (status: string) => {
  const color = status === 'active' ? '#10B981' : status === 'maintenance' ? '#F59E0B' : '#6B7280';
  
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          background-color: white;
          width: 8px;
          height: 8px;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: 'custom-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

export const RealMapView: React.FC<RealMapViewProps> = ({ 
  selectedIntersection, 
  onIntersectionSelect, 
  isDarkMode = true 
}) => {
  const [mapReady, setMapReady] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-500';
      case 'inactive': return 'text-gray-500';
      case 'maintenance': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'inactive': return 'bg-gray-500';
      case 'maintenance': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'} rounded-lg p-6 h-full`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <Navigation className="w-5 h-5 mr-2" />
          Traffic Intersection Map
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Maintenance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Inactive</span>
          </div>
        </div>
      </div>
      
      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={[40.7505, -73.9934]} // NYC center
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          whenReady={() => setMapReady(true)}
        >
          <TileLayer
            url={isDarkMode 
              ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={isDarkMode 
              ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          />
          
          {intersections.map((intersection) => (
            <Marker
              key={intersection.id}
              position={[intersection.lat, intersection.lng]}
              icon={createCustomIcon(intersection.status)}
              eventHandlers={{
                click: () => onIntersectionSelect(intersection),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-gray-900 mb-2">{intersection.name}</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`text-sm capitalize font-medium ${
                      intersection.status === 'active' ? 'text-green-600' :
                      intersection.status === 'maintenance' ? 'text-yellow-600' : 'text-gray-600'
                    }`}>
                      {intersection.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Cameras:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {intersection.cameras.length} installed
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm text-gray-600">Online:</span>
                    <span className="text-sm font-medium text-green-600">
                      {intersection.cameras.filter(c => c.status === 'online').length}
                    </span>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {selectedIntersection && (
        <div className={`mt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4`}>
          <h4 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium mb-2`}>Selected Intersection</h4>
          <div className="flex items-center justify-between">
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedIntersection.name}</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 ${getStatusBg(selectedIntersection.status)} rounded-full mr-2`}></div>
              <span className={`text-sm capitalize ${getStatusColor(selectedIntersection.status)}`}>
                {selectedIntersection.status}
              </span>
            </div>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
            {selectedIntersection.cameras.length} cameras installed • {' '}
            {selectedIntersection.cameras.filter(c => c.status === 'online').length} online
          </div>
        </div>
      )}
    </div>
  );
};