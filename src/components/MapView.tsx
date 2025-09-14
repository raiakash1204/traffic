import React, { useState } from 'react';
import { MapPin, Camera, Navigation } from 'lucide-react';

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

const intersections: Intersection[] = [
  {
    id: 'int-1',
    name: 'Main St & 1st Ave',
    x: 25,
    y: 30,
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
    name: 'Broadway & 2nd Ave',
    x: 60,
    y: 45,
    status: 'active',
    cameras: [
      { id: 'cam-2-1', name: 'North View', type: 'traffic', angle: 'North', status: 'online' },
      { id: 'cam-2-2', name: 'South View', type: 'traffic', angle: 'South', status: 'online' },
      { id: 'cam-2-3', name: 'Overview', type: 'overview', angle: 'Aerial', status: 'online' },
    ]
  },
  {
    id: 'int-3',
    name: 'Oak St & 3rd Ave',
    x: 40,
    y: 70,
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
    name: 'Pine St & 4th Ave',
    x: 75,
    y: 25,
    status: 'maintenance',
    cameras: [
      { id: 'cam-4-1', name: 'North View', type: 'traffic', angle: 'North', status: 'offline' },
      { id: 'cam-4-2', name: 'South View', type: 'traffic', angle: 'South', status: 'offline' },
    ]
  },
  {
    id: 'int-5',
    name: 'Elm St & 5th Ave',
    x: 20,
    y: 60,
    status: 'active',
    cameras: [
      { id: 'cam-5-1', name: 'Overview', type: 'overview', angle: 'Aerial', status: 'online' },
      { id: 'cam-5-2', name: 'East View', type: 'traffic', angle: 'East', status: 'online' },
      { id: 'cam-5-3', name: 'West View', type: 'traffic', angle: 'West', status: 'online' },
    ]
  }
];

interface MapViewProps {
  selectedIntersection: Intersection | null;
  onIntersectionSelect: (intersection: Intersection) => void;
}

export const MapView: React.FC<MapViewProps> = ({ selectedIntersection, onIntersectionSelect }) => {
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
    <div className="bg-gray-900 rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Navigation className="w-5 h-5 mr-2" />
          Traffic Intersection Map
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Maintenance</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
            <span className="text-gray-300">Inactive</span>
          </div>
        </div>
      </div>
      
      <div className="relative bg-gray-800 rounded-lg h-96 overflow-hidden">
        {/* Grid lines for street layout */}
        <svg className="absolute inset-0 w-full h-full">
          {/* Horizontal streets */}
          <line x1="0" y1="25%" x2="100%" y2="25%" stroke="#374151" strokeWidth="2" />
          <line x1="0" y1="45%" x2="100%" y2="45%" stroke="#374151" strokeWidth="2" />
          <line x1="0" y1="70%" x2="100%" y2="70%" stroke="#374151" strokeWidth="2" />
          
          {/* Vertical streets */}
          <line x1="25%" y1="0" x2="25%" y2="100%" stroke="#374151" strokeWidth="2" />
          <line x1="40%" y1="0" x2="40%" y2="100%" stroke="#374151" strokeWidth="2" />
          <line x1="60%" y1="0" x2="60%" y2="100%" stroke="#374151" strokeWidth="2" />
          <line x1="75%" y1="0" x2="75%" y2="100%" stroke="#374151" strokeWidth="2" />
        </svg>
        
        {/* Street labels */}
        <div className="absolute top-2 left-4 text-xs text-gray-400">Main St</div>
        <div className="absolute top-2 left-1/3 text-xs text-gray-400">Broadway</div>
        <div className="absolute top-2 left-1/2 text-xs text-gray-400">Oak St</div>
        <div className="absolute top-2 right-4 text-xs text-gray-400">Pine St</div>
        
        <div className="absolute left-2 top-1/4 text-xs text-gray-400 transform -rotate-90">1st Ave</div>
        <div className="absolute left-2 top-1/2 text-xs text-gray-400 transform -rotate-90">2nd Ave</div>
        <div className="absolute left-2 bottom-1/4 text-xs text-gray-400 transform -rotate-90">3rd Ave</div>
        
        {/* Intersection markers */}
        {intersections.map((intersection) => (
          <button
            key={intersection.id}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
              selectedIntersection?.id === intersection.id ? 'scale-125' : ''
            }`}
            style={{ left: `${intersection.x}%`, top: `${intersection.y}%` }}
            onClick={() => onIntersectionSelect(intersection)}
          >
            <div className={`relative ${getStatusBg(intersection.status)} rounded-full p-2 shadow-lg ${
              selectedIntersection?.id === intersection.id ? 'ring-4 ring-blue-400' : ''
            }`}>
              <MapPin className="w-4 h-4 text-white" />
              {intersection.cameras.length > 0 && (
                <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {intersection.cameras.length}
                </div>
              )}
            </div>
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {intersection.name}
            </div>
          </button>
        ))}
      </div>
      
      {selectedIntersection && (
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <h4 className="text-white font-medium mb-2">Selected Intersection</h4>
          <div className="flex items-center justify-between">
            <span className="text-gray-300">{selectedIntersection.name}</span>
            <div className="flex items-center">
              <div className={`w-2 h-2 ${getStatusBg(selectedIntersection.status)} rounded-full mr-2`}></div>
              <span className={`text-sm capitalize ${getStatusColor(selectedIntersection.status)}`}>
                {selectedIntersection.status}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {selectedIntersection.cameras.length} cameras installed
          </div>
        </div>
      )}
    </div>
  );
};