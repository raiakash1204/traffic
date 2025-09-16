import React from 'react';
import { Camera, Signal, AlertTriangle, Clock } from 'lucide-react';

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

interface CameraFeedProps {
  selectedIntersection: Intersection | null;
  selectedCamera: Camera | null;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({ selectedIntersection, selectedCamera }) => {
  const generateTrafficData = () => ({
    vehicleCount: Math.floor(Math.random() * 15) + 5,
    pedestrianCount: Math.floor(Math.random() * 8) + 2,
    avgSpeed: Math.floor(Math.random() * 20) + 25,
    congestionLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
  });

  const trafficData = generateTrafficData();

  if (!selectedIntersection) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 h-96 flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-medium mb-2">Feed of all cameras installed at the intersection</p>
          <p>Select an intersection from the map to view all camera feeds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">
          Feed of all cameras installed at the intersection - {selectedIntersection.name}
        </h3>
        <div className="flex items-center space-x-2">
          <Signal className="w-4 h-4 text-green-400" />
          <span className="text-sm text-green-400">
            {selectedIntersection.cameras.filter(c => c.status === 'online').length} of {selectedIntersection.cameras.length} online
          </span>
        </div>
      </div>

      {/* All Camera Feeds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {selectedIntersection.cameras.map((camera) => (
          <div key={camera.id} className="bg-gray-800 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">{camera.name}</span>
              <div className={`w-2 h-2 rounded-full ${
                camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
            </div>
            
            <div className="aspect-video bg-gray-700 rounded-lg flex items-center justify-center mb-3">
              {camera.status === 'online' ? (
                <div className="relative w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg overflow-hidden">
                  {/* Simulated traffic elements */}
                  <div className="absolute inset-0">
                    <div className="absolute top-2 left-2 w-4 h-2 bg-red-500 rounded opacity-80"></div>
                    <div className="absolute top-2 right-2 w-3 h-2 bg-blue-500 rounded opacity-80"></div>
                    <div className="absolute bottom-4 left-4 w-5 h-3 bg-yellow-500 rounded opacity-80"></div>
                    <div className="absolute bottom-2 right-4 w-2 h-4 bg-green-500 rounded opacity-80"></div>
                    
                    {/* Traffic light simulation */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-2 h-6 bg-gray-800 rounded-full flex flex-col items-center justify-around py-1">
                        <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                        <div className="w-1 h-1 bg-yellow-300 rounded-full opacity-30"></div>
                        <div className="w-1 h-1 bg-green-400 rounded-full opacity-30"></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Camera className="w-6 h-6 mx-auto mb-1" />
                      <div className="text-xs">Live Feed</div>
                    </div>
                  </div>
                  
                  {/* Timestamp overlay */}
                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 py-0.5 rounded">
                    <Clock className="w-2 h-2 inline mr-1" />
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-xs">Camera Offline</div>
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Direction</span>
                <span className="text-white">{camera.angle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span className="text-white capitalize">{camera.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className={`capitalize ${
                  camera.status === 'online' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {camera.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};