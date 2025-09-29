import React, { useState } from 'react';
import {
  BarChart3,
  Camera,
  Settings,
  Activity,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { LoginPage } from './components/LoginPage';
import { MapView } from './components/MapView';
import { RealMapView } from './components/RealMapView';
import { CityMapView } from './components/CityMapView';
import { CameraList } from './components/CameraList';
import { CameraFeed } from './components/CameraFeed';

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
  lat?: number;
  lng?: number;
  cameras: Camera[];
  status: 'active' | 'inactive' | 'maintenance';
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeView, setActiveView] = useState<'map' | 'real-map' | 'city-map' | 'cameras' | 'analytics'>('map');
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedIntersection(null);
    setSelectedCamera(null);
    setActiveView('map');
  };

  const handleIntersectionSelect = (intersection: Intersection) => {
    setSelectedIntersection(intersection);
    setSelectedCamera(null);
  };

  const handleCameraSelect = (camera: Camera) => {
    setSelectedCamera(camera);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  const renderMainContent = () => {
    switch (activeView) {
      case 'real-map':
        return (
          <RealMapView
            selectedIntersection={selectedIntersection}
            onIntersectionSelect={handleIntersectionSelect}
            isDarkMode={isDarkMode}
          />
        );
      case 'city-map':
        return <CityMapView isDarkMode={isDarkMode} />;
      case 'cameras':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            <div className="lg:col-span-1">
              <CameraList
                selectedIntersection={selectedIntersection}
                selectedCamera={selectedCamera}
                onCameraSelect={handleCameraSelect}
                isDarkMode={isDarkMode}
              />
            </div>
            <div className="lg:col-span-2">
              <CameraFeed
                selectedIntersection={selectedIntersection}
                selectedCamera={selectedCamera}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'} rounded-lg p-6 h-full flex items-center justify-center`}>
            <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl font-medium mb-2">Analytics Dashboard</p>
              <p>Traffic analytics and insights coming soon</p>
            </div>
          </div>
        );
      default:
        return (
          <MapView
            selectedIntersection={selectedIntersection}
            onIntersectionSelect={handleIntersectionSelect}
            isDarkMode={isDarkMode}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'} rounded-lg`}>
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                AI Traffic Management
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Real-time traffic monitoring and control
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleLogout}
              className={`p-2 rounded-lg transition-colors ${
                isDarkMode 
                  ? 'bg-red-900 hover:bg-red-800 text-red-300' 
                  : 'bg-red-100 hover:bg-red-200 text-red-700'
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className={`w-64 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-r`}>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveView('map')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'map'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Intersection Map</span>
            </button>
            
            <button
              onClick={() => setActiveView('real-map')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'real-map'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Real Map View</span>
            </button>
            
            <button
              onClick={() => setActiveView('city-map')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'city-map'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>City Network</span>
            </button>
            
            <button
              onClick={() => setActiveView('cameras')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'cameras'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Camera className="w-4 h-4" />
              <span>Camera Feeds</span>
            </button>
            
            <button
              onClick={() => setActiveView('analytics')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeView === 'analytics'
                  ? 'bg-blue-600 text-white'
                  : isDarkMode
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {renderMainContent()}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 w-96`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>Dark Mode</span>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDarkMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;