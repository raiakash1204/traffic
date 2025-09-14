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
      <div className="bg-gray-900 rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center text-gray-400">
          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-medium mb-2">No Camera Feed Available</p>
          <p>Select an intersection from the map to view camera feeds</p>
        </div>
      </div>
    );
  }

  if (!selectedCamera) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 h-full">
        <h3 className="text-lg font-semibold text-white mb-4">
          Camera Feeds - {selectedIntersection.name}
        </h3>
        <div className="grid grid-cols-2 gap-4 h-full">
          {selectedIntersection.cameras.slice(0, 4).map((camera, index) => (
            <div key={camera.id} className="bg-gray-800 rounded-lg p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium text-sm">{camera.name}</span>
                <div className={`w-2 h-2 rounded-full ${
                  camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>
              </div>
              <div className="flex-1 bg-gray-700 rounded-lg flex items-center justify-center">
                {camera.status === 'online' ? (
                  <div className="text-center">
                    <div className="w-full h-32 bg-gradient-to-br from-gray-600 to-gray-800 rounded-lg mb-2 flex items-center justify-center">
                      <div className="text-gray-400">
                        <Camera className="w-8 h-8 mx-auto mb-2" />
                        <div className="text-xs">Live Feed</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{camera.angle} View</div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500">
                    <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-xs">Camera Offline</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">
          {selectedCamera.name} - {selectedIntersection.name}
        </h3>
        <div className="flex items-center space-x-2">
          <Signal className={`w-4 h-4 ${selectedCamera.status === 'online' ? 'text-green-400' : 'text-red-400'}`} />
          <span className={`text-sm ${selectedCamera.status === 'online' ? 'text-green-400' : 'text-red-400'}`}>
            {selectedCamera.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 h-full">
        {/* Main Camera Feed */}
        <div className="col-span-2">
          <div className="bg-gray-800 rounded-lg h-full p-4">
            {selectedCamera.status === 'online' ? (
              <div className="h-full bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* Simulated traffic elements */}
                <div className="absolute inset-0">
                  <div className="absolute top-4 left-4 w-8 h-4 bg-red-500 rounded opacity-80"></div>
                  <div className="absolute top-4 right-4 w-6 h-3 bg-blue-500 rounded opacity-80"></div>
                  <div className="absolute bottom-8 left-8 w-10 h-5 bg-yellow-500 rounded opacity-80"></div>
                  <div className="absolute bottom-4 right-8 w-4 h-8 bg-green-500 rounded opacity-80"></div>
                  
                  {/* Traffic light simulation */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="w-3 h-8 bg-gray-800 rounded-full flex flex-col items-center justify-around py-1">
                      <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-yellow-300 rounded-full opacity-30"></div>
                      <div className="w-2 h-2 bg-green-400 rounded-full opacity-30"></div>
                    </div>
                  </div>
                </div>
                
                <div className="text-center text-gray-400 z-10">
                  <Camera className="w-12 h-12 mx-auto mb-2" />
                  <div className="text-sm">Live Camera Feed</div>
                  <div className="text-xs mt-1">{selectedCamera.angle} View • {selectedCamera.type}</div>
                </div>
                
                {/* Timestamp overlay */}
                <div className="absolute bottom-4 left-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {new Date().toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="h-full bg-gray-800 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Camera Offline</p>
                  <p className="text-sm">Unable to connect to camera feed</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Traffic Analytics */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Traffic Analytics</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Vehicles</span>
                <span className="text-white font-medium">{trafficData.vehicleCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Pedestrians</span>
                <span className="text-white font-medium">{trafficData.pedestrianCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Avg Speed</span>
                <span className="text-white font-medium">{trafficData.avgSpeed} mph</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">Congestion</span>
                <span className={`font-medium ${
                  trafficData.congestionLevel === 'Low' ? 'text-green-400' :
                  trafficData.congestionLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {trafficData.congestionLevel}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Camera Info</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Type</span>
                <span className="text-white capitalize">{selectedCamera.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Direction</span>
                <span className="text-white">{selectedCamera.angle}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Resolution</span>
                <span className="text-white">1080p</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">FPS</span>
                <span className="text-white">30</span>
              </div>
            </div>
          </div>

          {/* Other intersection cameras */}
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Other Cameras</h4>
            <div className="space-y-2">
              {selectedIntersection.cameras
                .filter(cam => cam.id !== selectedCamera.id)
                .slice(0, 3)
                .map((camera) => (
                <div key={camera.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{camera.name}</span>
                  <div className={`w-2 h-2 rounded-full ${
                    camera.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};