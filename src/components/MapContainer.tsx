import React, { useEffect } from 'react';
import { MapContainer as LeafletMap, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useBooking } from '../context/BookingContext';
import { MOCK_DRIVERS, MAP_CENTER } from '../mock-data';
import type { VehicleType } from '../types';


// Fix for default Leaflet icon paths
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Custom Leaflet DivIcons utilizing inline SVG for pixel-perfect styled pins
const createHtmlIcon = (htmlContent: string, className = '') => {
  return new L.DivIcon({
    html: htmlContent,
    className: `custom-leaflet-icon ${className}`,
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
};

const pickupIcon = createHtmlIcon(`
  <div class="relative flex items-center justify-center w-8 h-8">
    <div class="absolute w-6 h-6 bg-emerald-500/30 rounded-full animate-ping"></div>
    <div class="relative w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
      <div class="w-1.5 h-1.5 bg-white rounded-full"></div>
    </div>
  </div>
`);

const dropIcon = createHtmlIcon(`
  <div class="relative flex items-center justify-center w-8 h-8">
    <div class="absolute w-6 h-6 bg-red-500/30 rounded-full animate-ping"></div>
    <div class="relative w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
      <div class="w-1.5 h-1.5 bg-white rounded-sm"></div>
    </div>
  </div>
`);

// Vehicle SVGs
const getVehicleSvg = (type: VehicleType) => {
  switch (type) {
    case 'bike':
      return `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
          <path d="M19.5 9.5c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm0 4c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM6 12c0 1.38-1.12 2.5-2.5 2.5S1 13.38 1 12s1.12-2.5 2.5-2.5S6 10.62 6 12zm-4.5 0c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm10.37-3h1.8c.4 0 .75.25.88.63L16 14.5h-2.12l-.5-1.5H9.62l-.5 1.5H7l2.87-8.62c.13-.38.48-.63.88-.63h1.8L11.87 9z"/>
        </svg>
      `;
    case 'auto':
      return `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
          <path d="M19 15c-.83 0-1.5-.67-1.5-1.5S18.17 12 19 12s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 15c-.83 0-1.5-.67-1.5-1.5S4.17 12 5 12s1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM17.42 5H6.58L3 11v5h18v-5l-3.58-6z"/>
        </svg>
      `;
    case 'cab':
      return `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg>
      `;
    case 'parcel':
    default:
      return `
        <svg viewBox="0 0 24 24" width="18" height="18" fill="black">
          <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 11L4 8V6l8 5 8-5v2l-8 7z"/>
        </svg>
      `;
  }
};

const getDriverIcon = (type: VehicleType, heading = 0) => {
  return createHtmlIcon(`
    <div class="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#FFE600] border-2 border-black shadow-lg" style="transform: rotate(${heading}deg); transition: transform 0.25s linear;">
      ${getVehicleSvg(type)}
    </div>
  `);
};

// Component to handle map center changes dynamically
const RecenterMap: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (map) {
      try {
        map.setView(center, zoom);
      } catch (e) {
        // Safe fallback if map is not fully initialized or already unmounted
      }
    }
  }, [center, zoom, map]);
  return null;
};

// Component to fit map bounds to route
const FitRouteBounds: React.FC<{ coordinates: [number, number][] }> = ({ coordinates }) => {
  const map = useMap();
  useEffect(() => {
    if (map && coordinates.length > 0) {
      try {
        const bounds = L.latLngBounds(coordinates);
        map.fitBounds(bounds, { padding: [40, 40] });
      } catch (e) {
        // Safe fallback if map is not fully initialized or already unmounted
      }
    }
  }, [coordinates, map]);
  return null;
};

export const MapContainer: React.FC = () => {
  const {
    pickup,
    drop,
    selectedCategory,
    bookingStatus,
    assignedDriver,
    driverLocation,
    driverHeading,
    routeCoordinates
  } = useBooking();

  // Determine map view center and zoom
  let mapCenter: [number, number] = [MAP_CENTER.lat, MAP_CENTER.lng];
  let zoom = 14;

  if (driverLocation && (bookingStatus === 'arriving' || bookingStatus === 'started')) {
    mapCenter = [driverLocation.lat, driverLocation.lng];
    zoom = 16;
  } else if (pickup) {
    mapCenter = [pickup.lat, pickup.lng];
  }

  // Determine drivers to show
  const currentCategory = selectedCategory?.id || 'bike';
  const showAllDrivers = bookingStatus === 'idle' || bookingStatus === 'searching';

  return (
    <div className="w-full h-full relative">
      <LeafletMap
        center={mapCenter}
        zoom={zoom}
        zoomControl={false}
        className="w-full h-full dark-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <RecenterMap center={mapCenter} zoom={zoom} />

        {/* Pickup Pin */}
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
        )}

        {/* Drop Pin */}
        {drop && (
          <Marker position={[drop.lat, drop.lng]} icon={dropIcon} />
        )}

        {/* Route Line */}
        {routeCoordinates.length > 0 && (
          <>
            <FitRouteBounds coordinates={routeCoordinates} />
            <Polyline
              positions={routeCoordinates}
              color="#FFE600"
              weight={4}
              opacity={0.8}
              dashArray="6, 8"
            />
          </>
        )}

        {/* Assigned Driver Live Marker */}
        {assignedDriver && driverLocation && (
          <Marker
            position={[driverLocation.lat, driverLocation.lng]}
            icon={getDriverIcon(assignedDriver.vehicleType, driverHeading)}
          />
        )}

        {/* Idle / Searching Drivers */}
        {showAllDrivers &&
          MOCK_DRIVERS.filter(d => d.vehicleType === currentCategory).map((d) => (
            <Marker
              key={d.id}
              position={[d.lat, d.lng]}
              icon={getDriverIcon(d.vehicleType, d.angle || 0)}
            />
          ))}
      </LeafletMap>
    </div>
  );
};

export default MapContainer;
