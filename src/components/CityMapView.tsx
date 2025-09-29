import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Map, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface TrafficNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: 'intersection' | 'highway' | 'bridge' | 'tunnel';
  status: 'normal' | 'congested' | 'blocked';
  flow: number; // vehicles per hour
}

interface TrafficRoute {
  id: string;
  name: string;
  points: [number, number][];
  status: 'normal' | 'heavy' | 'congested';
  avgSpeed: number;
}

// Sample traffic data for NYC
const trafficNodes: TrafficNode[] = [
  { id: 'n1', name: 'Times Square', lat: 40.7580, lng: -73.9855, type: 'intersection', status: 'congested', flow: 2500 },
  { id: 'n2', name: 'Brooklyn Bridge', lat: 40.7061, lng: -73.9969, type: 'bridge', status: 'normal', flow: 1800 },
  { id: 'n3', name: 'Lincoln Tunnel', lat: 40.7614, lng: -74.0055, type: 'tunnel', status: 'heavy', flow: 3200 },
  { id: 'n4', name: 'FDR Drive & 42nd', lat: 40.7505, lng: -73.9707, type: 'highway', status: 'normal', flow: 2100 },
  { id: 'n5', name: 'Holland Tunnel', lat: 40.7267, lng: -74.0134, type: 'tunnel', status: 'blocked', flow: 500 },
  { id: 'n6', name: 'Manhattan Bridge', lat: 40.7072, lng: -73.9903, type: 'bridge', status: 'normal', flow: 1600 },
];

const trafficRoutes: TrafficRoute[] = [
  {
    id: 'r1',
    name: 'Broadway Corridor',
    points: [[40.7831, -73.9712], [40.7580, -73.9855], [40.7353, -73.9906], [40.7128, -74.0060]],
    status: 'congested',
    avgSpeed: 15
  },
  {
    id: 'r2',
    name: 'FDR Drive South',
    points: [[40.7831, -73.9442], [40.7505, -73.9707], [40.7128, -73.9776], [40.6892, -73.9442]],
    status: 'normal',
    avgSpeed: 45
  },
  {
    id: 'r3',
    name: 'West Side Highway',
    points: [[40.7831, -74.0134], [40.7614, -74.0055], [40.7267, -74.0134], [40.7047, -74.0134]],
    status: 'heavy',
    avgSpeed: 25
  },
];

interface CityMapViewProps {
  isDarkMode?: boolean;
}

// Custom marker icons for different node types and statuses
const createNodeIcon = (type: string, status: string) => {
  const getColor = () => {
    switch (status) {
      case 'normal': return '#10B981';
      case 'congested': return '#F59E0B';
      case 'blocked': return '#EF4444';
      case 'heavy': return '#F97316';
      default: return '#6B7280';
    }
  };

  const getSymbol = () => {
    switch (type) {
      case 'intersection': return '⊕';
      case 'bridge': return '🌉';
      case 'tunnel': return '🚇';
      case 'highway': return '🛣️';
      default: return '●';
    }
  };

  return L.divIcon({
    html: `
      <div style="
        background-color: ${getColor()};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      ">
        ${getSymbol()}
      </div>
    `,
    className: 'custom-node-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

// Get route color based on status
const getRouteColor = (status: string) => {
  switch (status) {
    case 'normal': return '#10B981';
    case 'heavy': return '#F97316';
    case 'congested': return '#EF4444';
    default: return '#6B7280';
  }
};

export const CityMapView: React.FC<CityMapViewProps> = ({ isDarkMode = true }) => {
  const [selectedNode, setSelectedNode] = useState<TrafficNode | null>(null);

  return (
    <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-white border border-gray-200'} rounded-lg p-6 h-full`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} flex items-center`}>
          <Map className="w-5 h-5 mr-2" />
          City Traffic Network
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Normal</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Heavy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Congested</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
            <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Blocked</span>
          </div>
        </div>
      </div>
      
      <div className="h-96 rounded-lg overflow-hidden">
        <MapContainer
          center={[40.7505, -73.9934]} // NYC center
          zoom={12}
          style={{ height: '100%', width: '100%' }}
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
          
          {/* Traffic Routes */}
          {trafficRoutes.map((route) => (
            <Polyline
              key={route.id}
              positions={route.points}
              color={getRouteColor(route.status)}
              weight={6}
              opacity={0.8}
            />
          ))}
          
          {/* Traffic Nodes */}
          {trafficNodes.map((node) => (
            <Marker
              key={node.id}
              position={[node.lat, node.lng]}
              icon={createNodeIcon(node.type, node.status)}
              eventHandlers={{
                click: () => setSelectedNode(node),
              }}
            >
              <Popup>
                <div className="p-2">
                  <h4 className="font-semibold text-gray-900 mb-2">{node.name}</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium text-gray-900 capitalize">{node.type}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium capitalize ${
                        node.status === 'normal' ? 'text-green-600' :
                        node.status === 'congested' ? 'text-yellow-600' :
                        node.status === 'blocked' ? 'text-red-600' : 'text-orange-600'
                      }`}>
                        {node.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Flow:</span>
                      <span className="font-medium text-gray-900">{node.flow} veh/hr</span>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      
      {selectedNode && (
        <div className={`mt-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-4`}>
          <h4 className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium mb-2`}>Selected Location</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Name:</span>
              <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{selectedNode.name}</div>
            </div>
            <div>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Type:</span>
              <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium capitalize`}>{selectedNode.type}</div>
            </div>
            <div>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Status:</span>
              <div className={`font-medium capitalize ${
                selectedNode.status === 'normal' ? 'text-green-400' :
                selectedNode.status === 'congested' ? 'text-yellow-400' :
                selectedNode.status === 'blocked' ? 'text-red-400' : 'text-orange-400'
              }`}>
                {selectedNode.status}
              </div>
            </div>
            <div>
              <span className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>Traffic Flow:</span>
              <div className={`${isDarkMode ? 'text-white' : 'text-gray-900'} font-medium`}>{selectedNode.flow} veh/hr</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};