import React, { useState } from 'react';
import { MapPin, Camera, Navigation, ZoomIn, ZoomOut } from 'lucide-react';

interface Intersection {
  id: string;
  name: string;
  x: number;
  y: number;
  cameras: Camera[];
  status: 'active' | 'inactive' | 'maintenance';
}

interface Camera {
  id: string;
  name: string;
  type: 'traffic' | 'pedestrian' | 'overview';
  angle: string;
  status: 'online' | 'offline';
}

// Updated intersections based on the real map
const intersections: Intersection[] = [
  {
    id: 'int-1',
    name: 'Sector 55 - Vidya Path Junction',
    x: 45,
    y: 15,
    status: 'active',
    cameras: [
      { id: 'cam-1-1', name: 'North View', type: 'traffic', angle: 'North', status: 'online' },
      { id: 'cam-1-2', name: 'South View', type: 'traffic', angle: 'South', status: 'online' },
      { id: 'cam-1-3', name: 'East View', type: 'traffic', angle: 'East', status: 'online' },
      { id: 'cam-1-4', name: 'West View', type: 'traffic', angle: 'West', status: 'online' },
    ]
  },
  {
    id: 'int-2',
    name: 'Udyan Path - Shopping Complex',
    x: 70,
    y: 42,
    status: 'active',
    cameras: [
      { id: 'cam-2-1', name: 'North View', type: 'traffic', angle: 'North', status: 'online' },
      { id: 'cam-2-2', name: 'South View', type: 'traffic', angle: 'South', status: 'online' },
      { id: 'cam-2-3', name: 'Overview', type: 'overview', angle: 'Aerial', status: 'online' },
      { id: 'cam-2-4', name: 'Pedestrian Crossing', type: 'pedestrian', angle: 'East', status: 'online' },
    ]
  },
  {
    id: 'int-3',
    name: 'Stadium Road - Jan Marg Junction',
    x: 35,
    y: 55,
    status: 'active',
    cameras: [
      { id: 'cam-3-1', name: 'East View', type: 'traffic', angle: 'East', status: 'online' },
      { id: 'cam-3-2', name: 'West View', type: 'traffic', angle: 'West', status: 'online' },
      { id: 'cam-3-3', name: 'Stadium View', type: 'overview', angle: 'North', status: 'online' },
    ]
  },
  {
    id: 'int-4',
    name: 'Sector 25 - Dakshin Marg',
    x: 85,
    y: 25,
    status: 'maintenance',
    cameras: [
      { id: 'cam-4-1', name: 'North View', type: 'traffic', angle: 'North', status: 'offline' },
      { id: 'cam-4-2', name: 'South View', type: 'traffic', angle: 'South', status: 'offline' },
    ]
  },
  {
    id: 'int-5',
    name: 'Sector 36 Market Junction',
    x: 55,
    y: 48,
    status: 'active',
    cameras: [
      { id: 'cam-5-1', name: 'Market Overview', type: 'overview', angle: 'Aerial', status: 'online' },
      { id: 'cam-5-2', name: 'East View', type: 'traffic', angle: 'East', status: 'online' },
      { id: 'cam-5-3', name: 'West View', type: 'traffic', angle: 'West', status: 'online' },
      { id: 'cam-5-4', name: 'Pedestrian Zone', type: 'pedestrian', angle: 'South', status: 'online' },
    ]
  },
  {
    id: 'int-6',
    name: 'Chandigarh Hockey Stadium',
    x: 25,
    y: 48,
    status: 'active',
    cameras: [
      { id: 'cam-6-1', name: 'Stadium Entry', type: 'traffic', angle: 'North', status: 'online' },
      { id: 'cam-6-2', name: 'Parking Area', type: 'overview', angle: 'West', status: 'online' },
    ]
  },
  {
    id: 'int-7',
    name: 'Sector 23C Market - Udyog Path',
    x: 80,
    y: 60,
    status: 'active',
    cameras: [
      { id: 'cam-7-1', name: 'Market View', type: 'traffic', angle: 'North', status: 'online' },
      { id: 'cam-7-2', name: 'Udyog Path', type: 'traffic', angle: 'East', status: 'online' },
      { id: 'cam-7-3', name: 'Pedestrian Area', type: 'pedestrian', angle: 'South', status: 'online' },
    ]
  },
  {
    id: 'int-8',
    name: 'ISBT Sector 43',
    x: 15,
    y: 75,
    status: 'active',
    cameras: [
      { id: 'cam-8-1', name: 'Bus Terminal', type: 'overview', angle: 'Aerial', status: 'online' },
      { id: 'cam-8-2', name: 'Entry Gate', type: 'traffic', angle: 'North', status: 'online' },
      { id: 'cam-8-3', name: 'Exit Gate', type: 'traffic', angle: 'South', status: 'online' },
      { id: 'cam-8-4', name: 'Passenger Area', type: 'pedestrian', angle: 'East', status: 'online' },
    ]
  }
];

interface MapViewProps {
  selectedIntersection: Intersection | null;
  onIntersectionSelect: (intersection: Intersection) => void;
  isDarkMode?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({ selectedIntersection, onIntersectionSelect, isDarkMode = true }) => {
  const [zoomLevel, setZoomLevel] = useState(1);

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

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.8));
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'} rounded-lg p-6 h-full`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <Navigation className="w-5 h-5 mr-2" />
          Chandigarh Traffic Management Map
        </h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className={`p-1 rounded ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomIn}
              className={`p-1 rounded ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>
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
      </div>
      
      <div className={`relative ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg h-96 overflow-hidden`}>
        {/* Real map background */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
          style={{ 
            backgroundImage: 'url(/image copy.png)',
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'center center'
          }}
        >
          {/* Dark overlay for better contrast */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        {/* Intersection markers */}
        {intersections.map((intersection) => (
          <button
            key={intersection.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 z-10 ${
              selectedIntersection?.id === intersection.id ? 'scale-125' : ''
            }`}
            style={{ 
              left: `${intersection.x}%`, 
              top: `${intersection.y}%`,
              transform: `translate(-50%, -50%) scale(${zoomLevel})`
            }}
            onClick={() => onIntersectionSelect(intersection)}
          >
            <div className={`relative ${getStatusBg(intersection.status)} rounded-full p-3 shadow-lg border-2 border-white ${
              selectedIntersection?.id === intersection.id ? 'ring-4 ring-blue-400' : ''
            }`}>
              <MapPin className="w-5 h-5 text-white" />
              {intersection.cameras.length > 0 && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold border-2 border-white">
                  {intersection.cameras.length}
                </div>
              )}
            </div>
            <div className={`absolute top-12 left-1/2 transform -translate-x-1/2 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900 border border-gray-300'} text-xs px-3 py-2 rounded-lg whitespace-nowrap shadow-lg max-w-48 text-center font-medium`}>
              {intersection.name}
            </div>
          </button>
        ))}
        
        {/* Map info overlay */}
        <div className="absolute bottom-4 left-4 bg-black/70 text-white text-xs px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <Camera className="w-3 h-3" />
            <span>{intersections.reduce((total, int) => total + int.cameras.length, 0)} cameras deployed</span>
          </div>
        </div>
      </div>
      
      {selectedIntersection && (
        <div className={`mt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4`}>
          <h4 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium mb-2`}>Selected Location</h4>
          <div className="flex items-center justify-between">
            <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'} font-medium`}>{selectedIntersection.name}</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 ${getStatusBg(selectedIntersection.status)} rounded-full mr-2`}></div>
              <span className={`text-sm capitalize ${getStatusColor(selectedIntersection.status)}`}>
                {selectedIntersection.status}
              </span>
            </div>
          </div>
          <div className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1 flex items-center justify-between`}>
            <span>{selectedIntersection.cameras.length} cameras installed</span>
            <span>{selectedIntersection.cameras.filter(c => c.status === 'online').length} online</span>
          </div>
        </div>
      )}
    </div>
  );
};