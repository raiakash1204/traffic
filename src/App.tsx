import React, { useState } from 'react';
import { MapView } from './components/MapView';
import { CameraFeed } from './components/CameraFeed';
import { CameraList } from './components/CameraList';
import { 
  Activity, 
  Camera, 
  MapPin, 
  Users, 
  Car, 
  AlertTriangle,
  Sun,
  Moon,
  Settings,
  Bell
} from 'lucide-react';

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

function App() {
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleIntersectionSelect = (intersection: Intersection) => {
    setSelectedIntersection(intersection);
    setSelectedCamera(null);
  };

  const handleCameraSelect = (camera: Camera) => {
    setSelectedCamera(camera);
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Mock statistics
  const stats = {
    totalIntersections: 8,
    activeCameras: 28,
    totalVehicles: 1247,
    avgSpeed: 32,
    alerts: 3
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Traffic Management System
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Chandigarh Smart City Initiative
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} transition-colors`}>
              <Bell className="w-5 h-5" />
            </button>
            <button className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} transition-colors`}>
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} transition-colors`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} px-6 py-4 border-b ${isDarkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500/20 p-2 rounded-lg">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalIntersections}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Intersections</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-green-500/20 p-2 rounded-lg">
              <Camera className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.activeCameras}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Cameras</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-purple-500/20 p-2 rounded-lg">
              <Car className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalVehicles}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Vehicles Tracked</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <Activity className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.avgSpeed} km/h</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Speed</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="bg-red-500/20 p-2 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.alerts}</p>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Alerts</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-280px)]">
          {/* Map View - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <MapView 
              selectedIntersection={selectedIntersection}
              onIntersectionSelect={handleIntersectionSelect}
              isDarkMode={isDarkMode}
            />
          </div>
          
          {/* Camera List - Takes up 1 column */}
          <div className="lg:col-span-1">
            <CameraList 
              selectedIntersection={selectedIntersection}
              selectedCamera={selectedCamera}
              onCameraSelect={handleCameraSelect}
              isDarkMode={isDarkMode}
            />
          </div>
          
          {/* Camera Feed - Takes up 1 column */}
          <div className="lg:col-span-1">
            <CameraFeed 
              selectedIntersection={selectedIntersection}
              selectedCamera={selectedCamera}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;