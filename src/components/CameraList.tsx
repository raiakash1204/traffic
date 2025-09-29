import React from 'react';
import { Camera, Eye, EyeOff, Video, Users, Navigation2 } from 'lucide-react';

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
  x: number;
  y: number;
  cameras: Camera[];
  status: 'active' | 'inactive' | 'maintenance';
}

interface CameraListProps {
  selectedIntersection: Intersection | null;
  selectedCamera: Camera | null;
  onCameraSelect: (camera: Camera) => void;
  isDarkMode?: boolean;
}

export const CameraList: React.FC<CameraListProps> = ({ 
  selectedIntersection, 
  selectedCamera, 
  onCameraSelect,
  isDarkMode = true
}) => {
  const getCameraIcon = (type: string) => {
    switch (type) {
      case 'traffic': return Video;
      case 'pedestrian': return Users;
      case 'overview': return Navigation2;
      default: return Camera;
    }
  };

  const getCameraTypeColor = (type: string) => {
    switch (type) {
      case 'traffic': return 'text-blue-400';
      case 'pedestrian': return 'text-green-400';
      case 'overview': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  if (!selectedIntersection) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'} rounded-lg p-6 h-full flex items-center justify-center`}>
        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No Intersection Selected</p>
          <p className="text-sm">Click on an intersection on the map to view its cameras</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'} rounded-lg p-6 h-full`}>
      <div className="mb-6">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
          {selectedIntersection.name}
        </h3>
        <div className="flex items-center justify-between text-sm">
          <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            {selectedIntersection.cameras.length} cameras available
          </span>
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              selectedIntersection.status === 'active' ? 'bg-green-500' :
              selectedIntersection.status === 'maintenance' ? 'bg-yellow-500' : 'bg-gray-500'
            }`}></div>
            <span className={`capitalize ${
              selectedIntersection.status === 'active' ? 'text-green-400' :
              selectedIntersection.status === 'maintenance' ? 'text-yellow-400' : 'text-gray-400'
            }`}>
              {selectedIntersection.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {selectedIntersection.cameras.map((camera) => {
          const IconComponent = getCameraIcon(camera.type);
          const isSelected = selectedCamera?.id === camera.id;
          const isOnline = camera.status === 'online';
          
          return (
            <button
              key={camera.id}
              onClick={() => onCameraSelect(camera)}
              className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                isSelected 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : isDarkMode 
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600 hover:bg-gray-750'
                    : 'border-gray-200 bg-gray-50 hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <IconComponent className={`w-5 h-5 mr-3 ${getCameraTypeColor(camera.type)}`} />
                  <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{camera.name}</span>
                </div>
                <div className="flex items-center">
                  {isOnline ? (
                    <Eye className="w-4 h-4 text-green-400" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                    {camera.angle} • {camera.type}
                  </span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  isOnline 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {camera.status}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {selectedIntersection.cameras.length === 0 && (
        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-8`}>
          <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No cameras installed at this intersection</p>
        </div>
      )}
    </div>
  );
};