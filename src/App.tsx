import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  MapPin, 
  Car, 
  Clock, 
  TrendingUp, 
  Settings,
  Power,
  AlertCircle,
  CheckCircle,
  Home,
  Camera,
  BarChart3,
  Menu,
  X,
  Navigation,
  Zap,
  Sun,
  Moon
} from 'lucide-react';
import { MapView } from './components/MapView';
import { CameraList } from './components/CameraList';
import { CameraFeed } from './components/CameraFeed';

// Chart.js types
declare var Chart: any;

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

interface TrafficData {
  kpis: {
    avgCommuteTime: number;
    totalVehicles: number;
    congestionIndex: number;
    commuteReduction: number;
    activeIntersections: number;
    systemUptime: number;
  };
  systemStatus: 'active' | 'manual' | 'offline';
  intersections: {
    [key: string]: {
      id: string;
      name: string;
      coordinates: { x: number; y: number };
      status: 'optimal' | 'congested' | 'critical';
      queues: {
        northSouth: number;
        eastWest: number;
        westEast: number;
        southNorth: number;
      };
      signalTiming: {
        currentPhase: 'ns-green' | 'ew-green' | 'transition';
        timeRemaining: number;
      };
      aiOptimization: number;
    };
  };
  performance: {
    aiWaitTimes: number[];
    fixedWaitTimes: number[];
    efficiencyGain: number;
    throughputImprovement: number;
  };
}

type PageType = 'dashboard' | 'cameras' | 'analytics' | 'controls';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedIntersection, setSelectedIntersection] = useState<Intersection | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [showAiAlert, setShowAiAlert] = useState(false);
  const [manualTiming, setManualTiming] = useState({ 
    nsGreen: 30, 
    ewGreen: 25, 
    snGreen: 28, 
    weGreen: 22,
    nsRed: 35,
    ewRed: 40,
    snRed: 37,
    weRed: 43
  });
  
  const waitTimeChartRef = useRef<any>(null);
  const efficiencyChartRef = useRef<any>(null);
  const throughputChartRef = useRef<any>(null);

  const [trafficData, setTrafficData] = useState<TrafficData>({
    kpis: {
      avgCommuteTime: 18.5,
      totalVehicles: 24750,
      congestionIndex: 4.2,
      commuteReduction: 23,
      activeIntersections: 12,
      systemUptime: 99.7
    },
    systemStatus: 'active',
    intersections: {
      '1': {
        id: '1',
        name: 'Downtown Core - Main St & 1st Ave',
        coordinates: { x: 320, y: 180 },
        status: 'optimal',
        queues: { northSouth: 8, eastWest: 12, westEast: 6, southNorth: 4 },
        signalTiming: { currentPhase: 'ns-green', timeRemaining: 25 },
        aiOptimization: 87
      },
      '2': {
        id: '2', 
        name: 'Business District - Commerce Blvd & 2nd Ave',
        coordinates: { x: 480, y: 140 },
        status: 'congested',
        queues: { northSouth: 18, eastWest: 22, westEast: 15, southNorth: 11 },
        signalTiming: { currentPhase: 'ew-green', timeRemaining: 18 },
        aiOptimization: 92
      },
      '3': {
        id: '3',
        name: 'Highway Junction - I-95 & Central Pkwy',
        coordinates: { x: 200, y: 120 },
        status: 'critical',
        queues: { northSouth: 35, eastWest: 28, westEast: 31, southNorth: 19 },
        signalTiming: { currentPhase: 'transition', timeRemaining: 3 },
        aiOptimization: 78
      },
      '4': {
        id: '4',
        name: 'Residential Hub - Oak St & Park Ave',
        coordinates: { x: 380, y: 280 },
        status: 'optimal',
        queues: { northSouth: 5, eastWest: 8, westEast: 3, southNorth: 7 },
        signalTiming: { currentPhase: 'ns-green', timeRemaining: 32 },
        aiOptimization: 94
      },
      '5': {
        id: '5',
        name: 'Shopping Center - Mall Dr & Retail Rd',
        coordinates: { x: 520, y: 240 },
        status: 'congested',
        queues: { northSouth: 24, eastWest: 16, westEast: 20, southNorth: 13 },
        signalTiming: { currentPhase: 'ew-green', timeRemaining: 12 },
        aiOptimization: 85
      },
      '6': {
        id: '6',
        name: 'University District - College Ave & Academic Way',
        coordinates: { x: 160, y: 220 },
        status: 'optimal',
        queues: { northSouth: 9, eastWest: 6, westEast: 11, southNorth: 8 },
        signalTiming: { currentPhase: 'ns-green', timeRemaining: 28 },
        aiOptimization: 91
      }
    },
    performance: {
      aiWaitTimes: [32, 28, 25, 22, 19, 17, 15, 14],
      fixedWaitTimes: [45, 44, 43, 42, 41, 40, 39, 38],
      efficiencyGain: 38,
      throughputImprovement: 42
    }
  });

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTrafficData(prevData => {
        const variation = () => (Math.random() - 0.5) * 0.2;
        
        return {
          ...prevData,
          kpis: {
            ...prevData.kpis,
            avgCommuteTime: Math.max(12, prevData.kpis.avgCommuteTime + variation() * 3),
            totalVehicles: Math.floor(prevData.kpis.totalVehicles + Math.random() * 200 - 100),
            congestionIndex: Math.max(1, Math.min(10, prevData.kpis.congestionIndex + variation() * 1.5)),
            commuteReduction: Math.max(15, Math.min(35, prevData.kpis.commuteReduction + variation() * 2))
          },
          intersections: Object.fromEntries(
            Object.entries(prevData.intersections).map(([key, intersection]) => [
              key,
              {
                ...intersection,
                queues: {
                  northSouth: Math.max(0, Math.floor(intersection.queues.northSouth + variation() * 8)),
                  eastWest: Math.max(0, Math.floor(intersection.queues.eastWest + variation() * 8)),
                  westEast: Math.max(0, Math.floor(intersection.queues.westEast + variation() * 8)),
                  southNorth: Math.max(0, Math.floor(intersection.queues.southNorth + variation() * 8))
                },
                signalTiming: {
                  ...intersection.signalTiming,
                  timeRemaining: Math.max(1, intersection.signalTiming.timeRemaining - 1)
                }
              }
            ])
          )
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Initialize charts
  useEffect(() => {
    if (currentPage === 'analytics') {
      setTimeout(() => {
        initializeCharts();
      }, 100);
    }
  }, [currentPage, trafficData]);

  const initializeCharts = () => {
    // Wait Time Chart
    if (waitTimeChartRef.current) {
      const ctx = waitTimeChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['8h ago', '7h ago', '6h ago', '5h ago', '4h ago', '3h ago', '2h ago', '1h ago'],
          datasets: [
            {
              label: 'AI System',
              data: trafficData.performance.aiWaitTimes,
              borderColor: '#3B82F6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#3B82F6',
              pointBorderColor: '#1E40AF',
              pointRadius: 4
            },
            {
              label: 'Fixed Timing',
              data: trafficData.performance.fixedWaitTimes,
              borderColor: '#EF4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              tension: 0.4,
              fill: true,
              pointBackgroundColor: '#EF4444',
              pointBorderColor: '#DC2626',
              pointRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { 
                color: '#E5E7EB',
                font: { size: 12, family: 'Inter' }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(75, 85, 99, 0.3)' },
              ticks: { 
                color: '#9CA3AF',
                font: { family: 'Inter' }
              }
            },
            x: {
              grid: { color: 'rgba(75, 85, 99, 0.3)' },
              ticks: { 
                color: '#9CA3AF',
                font: { family: 'Inter' }
              }
            }
          }
        }
      });
    }

    // Efficiency Chart
    if (efficiencyChartRef.current) {
      const ctx = efficiencyChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['AI Efficiency', 'Traditional'],
          datasets: [{
            data: [trafficData.performance.efficiencyGain, 100 - trafficData.performance.efficiencyGain],
            backgroundColor: ['#10B981', '#374151'],
            borderColor: ['#059669', '#4B5563'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { 
                color: '#E5E7EB',
                font: { size: 12, family: 'Inter' }
              }
            }
          }
        }
      });
    }

    // Throughput Chart
    if (throughputChartRef.current) {
      const ctx = throughputChartRef.current.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [{
            label: 'Throughput Improvement (%)',
            data: [42, 38, 45, 41, 47, 35, 29],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: '#3B82F6',
            borderWidth: 1,
            borderRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              labels: { 
                color: '#E5E7EB',
                font: { family: 'Inter' }
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: 'rgba(75, 85, 99, 0.3)' },
              ticks: { 
                color: '#9CA3AF',
                font: { family: 'Inter' }
              }
            },
            x: {
              grid: { color: 'rgba(75, 85, 99, 0.3)' },
              ticks: { 
                color: '#9CA3AF',
                font: { family: 'Inter' }
              }
            }
          }
        }
      });
    }
  };

  const handleIntersectionSelect = (intersection: Intersection) => {
    setSelectedIntersection(intersection);
    setSelectedCamera(null); // Reset camera selection when intersection changes
  };

  const handleCameraSelect = (camera: Camera) => {
    setSelectedCamera(camera);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500';
      case 'manual': return 'bg-amber-500';
      case 'offline': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  const getIntersectionStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return '#10B981';
      case 'congested': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'cameras', label: 'Camera Feeds', icon: Camera },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'controls', label: 'System Controls', icon: Settings }
  ];

  const renderNavigation = () => (
    <nav className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-gray-200'} border-b`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Activity className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>TrafficAI Control</h1>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentPage(item.id as PageType)}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : isDarkMode 
                          ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="flex items-center">
            {/* Theme Toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-colors mr-4 ${
                isDarkMode 
                  ? 'text-slate-300 hover:text-white hover:bg-slate-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            <div className="flex items-center space-x-3 mr-4">
              <div className={`w-2 h-2 rounded-full ${getStatusColor(trafficData.systemStatus)}`}></div>
              <span className={`text-sm capitalize ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>{trafficData.systemStatus}</span>
            </div>
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`p-2 ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} border-t`}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentPage(item.id as PageType);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    currentPage === item.id
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                        ? 'text-slate-300 hover:text-white hover:bg-slate-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );

  const renderCityMap = (showIntersectionDetails = false) => (
    <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <MapPin className="w-5 h-5 mr-2 text-blue-400" />
          City Traffic Network
        </h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
            <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>Optimal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>Congested</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className={isDarkMode ? 'text-slate-300' : 'text-gray-600'}>Critical</span>
          </div>
        </div>
      </div>
      
      <div className={`relative ${isDarkMode ? 'bg-slate-900' : 'bg-gray-100'} rounded-lg overflow-hidden`} style={{ height: '400px' }}>
        <img src="/img.png" alt="City Traffic Network" className="absolute inset-0 w-full h-full object-cover" />
        {Object.entries(trafficData.intersections).map(([key, intersection]) => {
          const leftPercent = (intersection.coordinates.x / 640) * 100;
          const topPercent = (intersection.coordinates.y / 400) * 100;
          return (
            <button
              key={key}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${leftPercent}%`, top: `${topPercent}%` }}
              onClick={() => setSelectedIntersection(key as any)}
              title={intersection.name}
            >
              <span className={`block w-4 h-4 rounded-full ring-2 ${
                intersection.status === 'optimal' ? 'bg-emerald-500 ring-white' :
                intersection.status === 'congested' ? 'bg-amber-500 ring-white' :
                'bg-red-500 ring-white'
              }`} />
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm font-medium`}>Avg Commute</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{trafficData.kpis.avgCommuteTime.toFixed(1)}m</p>
              <p className="text-emerald-400 text-sm font-medium">-{trafficData.kpis.commuteReduction.toFixed(2)}%</p>
            </div>
            <Clock className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm font-medium`}>Vehicles Today</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{trafficData.kpis.totalVehicles.toLocaleString()}</p>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>+2.3% vs yesterday</p>
            </div>
            <Car className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm font-medium`}>Congestion Index</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{trafficData.kpis.congestionIndex.toFixed(1)}/10</p>
              <p className="text-amber-400 text-sm">Moderate</p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-400" />
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm font-medium`}>Active Intersections</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{trafficData.kpis.activeIntersections}</p>
              <p className="text-emerald-400 text-sm">All operational</p>
            </div>
            <Navigation className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm font-medium`}>System Uptime</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{trafficData.kpis.systemUptime}%</p>
              <p className="text-emerald-400 text-sm">Excellent</p>
            </div>
            <Zap className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm font-medium`}>AI Efficiency</p>
              <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{trafficData.performance.efficiencyGain}%</p>
              <p className="text-emerald-400 text-sm">vs traditional</p>
            </div>
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Map and Live Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {renderCityMap(true)}
        </div>
        
        <div className="space-y-6">
          {/* Live Intersection Details */}
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>
              Intersection Details
            </h3>
            {selectedIntersection && trafficData.intersections[selectedIntersection] && (
              <div className="space-y-4">
                <div>
                  <h4 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} text-sm mb-2`}>
                    {trafficData.intersections[selectedIntersection].name}
                  </h4>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      trafficData.intersections[selectedIntersection].status === 'optimal' ? 'bg-emerald-500' :
                      trafficData.intersections[selectedIntersection].status === 'congested' ? 'bg-amber-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm capitalize`}>
                      {trafficData.intersections[selectedIntersection].status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>North-South</div>
                    <div className="text-lg font-semibold text-blue-400">
                      {trafficData.intersections[selectedIntersection].queues.northSouth}
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>East-West</div>
                    <div className="text-lg font-semibold text-emerald-400">
                      {trafficData.intersections[selectedIntersection].queues.eastWest}
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>West-East</div>
                    <div className="text-lg font-semibold text-amber-400">
                      {trafficData.intersections[selectedIntersection].queues.westEast}
                    </div>
                  </div>
                  <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'} mb-1`}>South-North</div>
                    <div className="text-lg font-semibold text-purple-400">
                      {trafficData.intersections[selectedIntersection].queues.southNorth}
                    </div>
                  </div>
                </div>

                <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg p-3`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>Current Signal</span>
                    <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>
                      {trafficData.intersections[selectedIntersection].signalTiming.timeRemaining}s remaining
                    </span>
                  </div>
                  <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} capitalize`}>
                    {trafficData.intersections[selectedIntersection].signalTiming.currentPhase.replace('-', ' ')}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>System Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Optimal Intersections</span>
                <span className="text-emerald-400 font-medium">
                  {Object.values(trafficData.intersections).filter(i => i.status === 'optimal').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Congested Intersections</span>
                <span className="text-amber-400 font-medium">
                  {Object.values(trafficData.intersections).filter(i => i.status === 'congested').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Critical Intersections</span>
                <span className="text-red-400 font-medium">
                  {Object.values(trafficData.intersections).filter(i => i.status === 'critical').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`${isDarkMode ? 'text-slate-400' : 'text-gray-600'} text-sm`}>Average AI Optimization</span>
                <span className="text-blue-400 font-medium">
                  {Math.round(Object.values(trafficData.intersections).reduce((acc, i) => acc + i.aiOptimization, 0) / Object.values(trafficData.intersections).length)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCameras = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Camera Feeds</h2>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} text-sm`}>Live</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2">
          <MapView 
            selectedIntersection={selectedIntersection}
            onIntersectionSelect={handleIntersectionSelect}
          />
        </div>

        {/* Camera List */}
        <div className="lg:col-span-1">
          <CameraList 
            selectedIntersection={selectedIntersection}
            selectedCamera={selectedCamera}
            onCameraSelect={handleCameraSelect}
          />
        </div>
      </div>

      {/* Camera Feed - Full Width */}
      <div className="w-full">
        <CameraFeed 
          selectedIntersection={selectedIntersection}
          selectedCamera={selectedCamera}
        />
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Performance Analytics</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Wait Time Comparison</h3>
          <div className="h-64">
            <canvas ref={waitTimeChartRef}></canvas>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>AI Efficiency</h3>
          <div className="h-64">
            <canvas ref={efficiencyChartRef}></canvas>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Weekly Throughput Improvement</h3>
          <div className="h-64">
            <canvas ref={throughputChartRef}></canvas>
          </div>
        </div>

        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Performance Metrics</h3>
          <div className="space-y-4">
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
              <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Average Wait Time Reduction</span>
              <span className="text-emerald-400 font-semibold">
                {((trafficData.performance.fixedWaitTimes[7] - trafficData.performance.aiWaitTimes[7]) / trafficData.performance.fixedWaitTimes[7] * 100).toFixed(1)}%
              </span>
            </div>
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
              <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Throughput Improvement</span>
              <span className="text-blue-400 font-semibold">{trafficData.performance.throughputImprovement}%</span>
            </div>
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
              <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>Fuel Savings Estimate</span>
              <span className="text-emerald-400 font-semibold">2,340L/day</span>
            </div>
            <div className={`flex justify-between items-center p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
              <span className={isDarkMode ? 'text-slate-300' : 'text-gray-700'}>CO2 Reduction</span>
              <span className="text-emerald-400 font-semibold">5.2 tons/day</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderControls = () => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>System Controls</h2>
      
      {/* AI Alert Modal */}
      {showAiAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6 max-w-md w-full mx-4`}>
            <div className="flex items-center mb-4">
              <AlertCircle className="w-6 h-6 text-amber-400 mr-3" />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Traffic Management</h3>
            </div>
            <p className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} mb-6`}>
              {aiEnabled 
                ? 'Are you sure you want to disable AI traffic management? This will switch the system to manual control mode.'
                : 'Enable AI traffic management? The system will automatically optimize signal timing based on real-time traffic conditions.'
              }
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setAiEnabled(!aiEnabled);
                  setShowAiAlert(false);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                {aiEnabled ? 'Disable AI' : 'Enable AI'}
              </button>
              <button
                onClick={() => setShowAiAlert(false)}
                className={`flex-1 ${isDarkMode ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gray-300 hover:bg-gray-400'} ${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium py-2 px-4 rounded-lg transition-colors`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI System Control */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>AI System Control</h3>
          
          <div className="space-y-4">
            <div className={`flex items-center justify-between p-4 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
              <div>
                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AI Traffic Management</div>
                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-600'}`}>
                  {aiEnabled ? 'AI is actively managing traffic signals' : 'Manual control is active'}
                </div>
              </div>
              <button
                onClick={() => setShowAiAlert(true)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  aiEnabled ? 'bg-blue-600' : isDarkMode ? 'bg-slate-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    aiEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className={`p-4 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>System Status</span>
                <div className="flex items-center space-x-2">
                  {trafficData.systemStatus === 'active' ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  ) : trafficData.systemStatus === 'manual' ? (
                    <Settings className="w-5 h-5 text-amber-400" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-400" />
                  )}
                  <span className={`${isDarkMode ? 'text-slate-300' : 'text-gray-600'} capitalize`}>{trafficData.systemStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Manual Override */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Manual Override</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Green Light Controls */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-emerald-400 mb-3">Green Light Timing</h4>
              
              <div className={`p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
                <label className={`block text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  North-South: {manualTiming.nsGreen}s
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={manualTiming.nsGreen}
                  onChange={(e) => setManualTiming({...manualTiming, nsGreen: parseInt(e.target.value)})}
                  className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} rounded-lg appearance-none cursor-pointer slider`}
                  disabled={aiEnabled}
                />
              </div>

              <div className={`p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
                <label className={`block text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  East-West: {manualTiming.ewGreen}s
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={manualTiming.ewGreen}
                  onChange={(e) => setManualTiming({...manualTiming, ewGreen: parseInt(e.target.value)})}
                  className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} rounded-lg appearance-none cursor-pointer slider`}
                  disabled={aiEnabled}
                />
              </div>

              <div className={`p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
                <label className={`block text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  South-North: {manualTiming.snGreen}s
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={manualTiming.snGreen}
                  onChange={(e) => setManualTiming({...manualTiming, snGreen: parseInt(e.target.value)})}
                  className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} rounded-lg appearance-none cursor-pointer slider`}
                  disabled={aiEnabled}
                />
              </div>

              <div className={`p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
                <label className={`block text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  West-East: {manualTiming.weGreen}s
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={manualTiming.weGreen}
                  onChange={(e) => setManualTiming({...manualTiming, weGreen: parseInt(e.target.value)})}
                  className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} rounded-lg appearance-none cursor-pointer slider`}
                  disabled={aiEnabled}
                />
              </div>
            </div>

            {/* Red Light Controls */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-red-400 mb-3">Red Light Timing</h4>
              
              <div className={`p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
                <label className={`block text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  North-South: {manualTiming.nsRed}s
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={manualTiming.nsRed}
                  onChange={(e) => setManualTiming({...manualTiming, nsRed: parseInt(e.target.value)})}
                  className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} rounded-lg appearance-none cursor-pointer slider`}
                  disabled={aiEnabled}
                />
              </div>

              <div className={`p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
                <label className={`block text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  East-West: {manualTiming.ewRed}s
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={manualTiming.ewRed}
                  onChange={(e) => setManualTiming({...manualTiming, ewRed: parseInt(e.target.value)})}
                  className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} rounded-lg appearance-none cursor-pointer slider`}
                  disabled={aiEnabled}
                />
              </div>

              <div className={`p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
                <label className={`block text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  South-North: {manualTiming.snRed}s
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={manualTiming.snRed}
                  onChange={(e) => setManualTiming({...manualTiming, snRed: parseInt(e.target.value)})}
                  className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} rounded-lg appearance-none cursor-pointer slider`}
                  disabled={aiEnabled}
                />
              </div>

              <div className={`p-3 ${isDarkMode ? 'bg-slate-700' : 'bg-gray-100'} rounded-lg`}>
                <label className={`block text-xs font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  West-East: {manualTiming.weRed}s
                </label>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={manualTiming.weRed}
                  onChange={(e) => setManualTiming({...manualTiming, weRed: parseInt(e.target.value)})}
                  className={`w-full h-2 ${isDarkMode ? 'bg-slate-600' : 'bg-gray-300'} rounded-lg appearance-none cursor-pointer slider`}
                  disabled={aiEnabled}
                />
              </div>
            </div>
          </div>

            {aiEnabled && (
              <div className={`mt-4 p-3 ${isDarkMode ? 'bg-amber-900 bg-opacity-20' : 'bg-amber-50'} border border-amber-500 rounded-lg`}>
                <div className="flex items-center">
                  <AlertCircle className="w-4 h-4 text-amber-400 mr-2" />
                  <span className={`${isDarkMode ? 'text-amber-400' : 'text-amber-700'} text-sm`}>
                    Manual controls disabled while AI is active
                  </span>
                </div>
              </div>
            )}
        </div>

        {/* Emergency Controls */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Emergency Controls</h3>
          
          <div className="space-y-3">
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Emergency Stop All Signals
            </button>
            <button className="w-full bg-amber-600 hover:bg-amber-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Switch to Manual Mode
            </button>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors">
              Reset AI System
            </button>
          </div>
        </div>

        {/* System Information */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>System Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Version</span>
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>v2.1.4</span>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Last Update</span>
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>2 hours ago</span>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Uptime</span>
              <span className="text-emerald-400">99.7%</span>
            </div>
            <div className="flex justify-between">
              <span className={isDarkMode ? 'text-slate-400' : 'text-gray-600'}>Active Connections</span>
              <span className={isDarkMode ? 'text-white' : 'text-gray-900'}>12/12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return renderDashboard();
      case 'cameras':
        return renderCameras();
      case 'analytics':
        return renderAnalytics();
      case 'controls':
        return renderControls();
      default:
        return renderDashboard();
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950' : 'bg-gray-50'}`}>
      {renderNavigation()}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
}

export default App;