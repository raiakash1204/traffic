import React, { useState } from 'react';
import { 
  Activity, 
  BarChart3, 
  Camera, 
  Settings, 
  Shield, 
  Users, 
  Car, 
  AlertTriangle, 
  TrendingUp, 
  Clock,
  Sun,
  Moon,
  LogOut
} from 'lucide-react';
import { MapView } from './components/MapView';
import { CameraList } from './components/CameraList';
import { CameraFeed } from './components/CameraFeed';
import { LoginPage } from './components/LoginPage';

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
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Intersections</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>24</p>
            </div>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Camera className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Online Cameras</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>89</p>
            </div>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Alerts</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>3</p>
            </div>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Flow Rate</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>1,247</p>
            </div>
          </div>
        </div>
      </div>

      {/* City Map */}
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>City Traffic Overview</h3>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg h-64 flex items-center justify-center relative overflow-hidden`}>
          {/* Simulated city grid */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Roads */}
            <line x1="0" y1="25%" x2="100%" y2="25%" stroke={isDarkMode ? "#4B5563" : "#9CA3AF"} strokeWidth="3" />
            <line x1="0" y1="50%" x2="100%" y2="50%" stroke={isDarkMode ? "#4B5563" : "#9CA3AF"} strokeWidth="4" />
            <line x1="0" y1="75%" x2="100%" y2="75%" stroke={isDarkMode ? "#4B5563" : "#9CA3AF"} strokeWidth="3" />
            
            <line x1="20%" y1="0" x2="20%" y2="100%" stroke={isDarkMode ? "#4B5563" : "#9CA3AF"} strokeWidth="3" />
            <line x1="40%" y1="0" x2="40%" y2="100%" stroke={isDarkMode ? "#4B5563" : "#9CA3AF"} strokeWidth="3" />
            <line x1="60%" y1="0" x2="60%" y2="100%" stroke={isDarkMode ? "#4B5563" : "#9CA3AF"} strokeWidth="4" />
            <line x1="80%" y1="0" x2="80%" y2="100%" stroke={isDarkMode ? "#4B5563" : "#9CA3AF"} strokeWidth="3" />
          </svg>
          
          {/* Buildings */}
          <div className="absolute inset-0">
            <div className={`absolute top-4 left-4 w-12 h-16 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
            <div className={`absolute top-8 left-24 w-8 h-12 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
            <div className={`absolute top-2 right-16 w-16 h-20 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
            <div className={`absolute bottom-8 left-8 w-10 h-14 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
            <div className={`absolute bottom-4 right-8 w-14 h-18 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-300'} rounded`}></div>
          </div>
          
          {/* Traffic indicators */}
          <div className="absolute top-1/4 left-1/5 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 left-2/5 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <div className="absolute top-3/4 right-1/5 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <div className="absolute top-1/2 right-2/5 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

      {/* Intersection Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Recent Alerts</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-red-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-red-800">High congestion detected</p>
                <p className="text-xs text-red-600">Main St & 5th Ave - 2 min ago</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-5 h-5 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-yellow-800">Camera maintenance scheduled</p>
                <p className="text-xs text-yellow-600">Broadway & 2nd Ave - 5 min ago</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>System Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>System Health</span>
              <span className="text-sm font-medium text-green-500">98.5%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Network Latency</span>
              <span className="text-sm font-medium text-blue-500">12ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Data Processing</span>
              <span className="text-sm font-medium text-purple-500">1.2TB/day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCameraFeeds = () => (
    <div className="space-y-6">
      {/* Top Row: Map and Camera List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <MapView 
            selectedIntersection={selectedIntersection}
            onIntersectionSelect={setSelectedIntersection}
            isDarkMode={isDarkMode}
          />
        </div>
        <div>
          <CameraList 
            selectedIntersection={selectedIntersection}
            selectedCamera={selectedCamera}
            onCameraSelect={setSelectedCamera}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>
      
      {/* Bottom: Camera Feeds */}
      <CameraFeed 
        selectedIntersection={selectedIntersection}
        selectedCamera={selectedCamera}
        isDarkMode={isDarkMode}
      />
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Traffic Analytics</h3>
        <div className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-lg h-64 flex items-center justify-center`}>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Analytics charts will be displayed here</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Peak Hours</h4>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>8-9 AM</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Highest traffic volume</p>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Average Speed</h4>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>32 mph</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>City-wide average</p>
        </div>
        
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
          <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>Incidents Today</h4>
          <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>7</p>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>-2 from yesterday</p>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white border border-gray-200'} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>System Settings</h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Alert Threshold
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="75"
              className="slider w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Refresh Rate (seconds)
            </label>
            <select className={`w-full p-2 border rounded-md ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}>
              <option value="5">5 seconds</option>
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Navigation */}
      <nav className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>TrafficAI Control</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'dashboard'
                    ? 'bg-blue-100 text-blue-700'
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Activity className="w-4 h-4 mr-2" />
                Dashboard
              </button>
              
              <button
                onClick={() => setActiveTab('cameras')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'cameras'
                    ? 'bg-blue-100 text-blue-700'
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Camera className="w-4 h-4 mr-2" />
                Camera Feeds
              </button>
              
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'analytics'
                    ? 'bg-blue-100 text-blue-700'
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-blue-100 text-blue-700'
                    : isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-md transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button
                onClick={handleLogout}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
                title="Logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'cameras' && renderCameraFeeds()}
          {activeTab === 'analytics' && renderAnalytics()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </main>
    </div>
  );
}

export default App;