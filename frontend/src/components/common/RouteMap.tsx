/**
 * RouteMap - Interactive map component using Leaflet
 * Displays routes with GeoJSON paths and markers
 * Shows navigation route from user location to selected route
 */

import { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CollectorRoute } from "../../services/collectorPortalService";

// Fix for default marker icons in Leaflet with bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icons
const createCustomIcon = (color: string) =>
  L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

const routeIcon = createCustomIcon("#22c55e"); // green for route
const selectedRouteIcon = createCustomIcon("#3b82f6"); // blue for selected
const userLocationIcon = createCustomIcon("#ef4444"); // red for user

// Navigation route info
interface NavigationInfo {
  distance: number; // in meters
  duration: number; // in seconds
  path: Array<[number, number]>;
}

// Fetch route from OSRM (Open Source Routing Machine)
const fetchNavigationRoute = async (
  from: [number, number],
  to: [number, number]
): Promise<NavigationInfo | null> => {
  try {
    // OSRM expects [lng, lat] format
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.code === "Ok" && data.routes?.[0]) {
      const route = data.routes[0];
      // Convert [lng, lat] to [lat, lng] for Leaflet
      const path = route.geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
      );

      return {
        distance: route.distance,
        duration: route.duration,
        path,
      };
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch navigation route:", error);
    return null;
  }
};

// Format distance for display
const formatDistance = (meters: number): string => {
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  return `${(meters / 1000).toFixed(1)} km`;
};

// Format duration for display
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }
  return `${minutes} min`;
};

// Component to recenter map when route changes
interface MapControllerProps {
  center: [number, number] | null;
  zoom?: number;
}

const MapController = ({ center, zoom = 14 }: MapControllerProps) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 0.5 });
    }
  }, [center, zoom, map]);

  return null;
};

// Component for locating user
interface LocateButtonProps {
  onLocate: (position: [number, number]) => void;
}

const LocateButton = ({ onLocate }: LocateButtonProps) => {
  const map = useMap();
  const [locating, setLocating] = useState(false);

  const handleLocate = () => {
    setLocating(true);
    map.locate({ setView: true, maxZoom: 16 });

    map.once("locationfound", (e) => {
      onLocate([e.latlng.lat, e.latlng.lng]);
      setLocating(false);
    });

    map.once("locationerror", () => {
      setLocating(false);
      alert("Could not find your location");
    });
  };

  return (
    <button
      onClick={handleLocate}
      disabled={locating}
      className="absolute bottom-4 right-4 z-1000 w-12 h-12 bg-success text-white rounded-full shadow-lg flex items-center justify-center hover:bg-success/90 transition-colors disabled:opacity-50"
      title="Find my location"
    >
      {locating ? (
        <svg
          className="w-6 h-6 animate-spin"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
    </button>
  );
};

// Parse GeoJSON LineString for route path
const parseGeoJSONPath = (geoJson: any): Array<[number, number]> | null => {
  if (!geoJson) return null;

  try {
    const data = typeof geoJson === "string" ? JSON.parse(geoJson) : geoJson;

    if (data.type === "LineString" && data.coordinates) {
      // GeoJSON uses [lng, lat], Leaflet uses [lat, lng]
      return data.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
      );
    }

    if (data.type === "Feature" && data.geometry?.type === "LineString") {
      return data.geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]] as [number, number]
      );
    }

    return null;
  } catch (e) {
    console.error("Failed to parse GeoJSON:", e);
    return null;
  }
};

interface RouteMapProps {
  routes: CollectorRoute[];
  selectedRoute: CollectorRoute | null;
  onRouteSelect?: (routeId: string) => void;
}

export const RouteMap = ({
  routes,
  selectedRoute,
  onRouteSelect,
}: RouteMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [navigationRoute, setNavigationRoute] = useState<NavigationInfo | null>(
    null
  );
  const [isLoadingNavigation, setIsLoadingNavigation] = useState(false);

  // Default center (can be adjusted based on your service area)
  // Using a default location - you might want to change this
  const defaultCenter: [number, number] = [
    selectedRoute?.latitude || routes[0]?.latitude || -1.2921, // Nairobi default
    selectedRoute?.longitude || routes[0]?.longitude || 36.8219,
  ];

  // Get center based on selected route
  const mapCenter: [number, number] | null =
    selectedRoute?.latitude && selectedRoute?.longitude
      ? [selectedRoute.latitude, selectedRoute.longitude]
      : null;

  // Fetch navigation route when user location and selected route are available
  useEffect(() => {
    const getNavigationRoute = async () => {
      if (!userLocation || !selectedRoute) {
        setNavigationRoute(null);
        return;
      }

      // Get destination from selected route
      const routePath = parseGeoJSONPath(selectedRoute.path_geojson);
      const destination: [number, number] | null =
        selectedRoute.latitude && selectedRoute.longitude
          ? [selectedRoute.latitude, selectedRoute.longitude]
          : routePath
          ? routePath[0]
          : null;

      if (!destination) {
        setNavigationRoute(null);
        return;
      }

      setIsLoadingNavigation(true);
      const navRoute = await fetchNavigationRoute(userLocation, destination);
      setNavigationRoute(navRoute);
      setIsLoadingNavigation(false);
    };

    getNavigationRoute();
  }, [userLocation, selectedRoute]);

  // Route colors
  const getRouteColor = (route: CollectorRoute) => {
    if (selectedRoute?.id === route.id) return "#3b82f6"; // blue
    return "#22c55e"; // green
  };

  return (
    <div className="relative h-full w-full rounded-lg overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className="h-full w-full"
        ref={mapRef}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Map controller for fly-to animations */}
        <MapController center={mapCenter} />

        {/* Navigation route from user to selected destination */}
        {navigationRoute && userLocation && (
          <Polyline
            positions={navigationRoute.path}
            pathOptions={{
              color: "#8b5cf6", // purple for navigation
              weight: 6,
              opacity: 0.8,
              dashArray: "10, 10",
            }}
          />
        )}

        {/* User location marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route paths and markers */}
        {routes.map((route) => {
          const path = parseGeoJSONPath(route.path_geojson);
          const isSelected = selectedRoute?.id === route.id;
          const routeCenter: [number, number] | null =
            route.latitude && route.longitude
              ? [route.latitude, route.longitude]
              : path
              ? path[0]
              : null;

          return (
            <div key={route.id}>
              {/* Route path line */}
              {path && (
                <Polyline
                  positions={path}
                  pathOptions={{
                    color: getRouteColor(route),
                    weight: isSelected ? 5 : 3,
                    opacity: isSelected ? 1 : 0.7,
                  }}
                  eventHandlers={{
                    click: () => onRouteSelect?.(route.id),
                  }}
                />
              )}

              {/* Route marker */}
              {routeCenter && (
                <Marker
                  position={routeCenter}
                  icon={isSelected ? selectedRouteIcon : routeIcon}
                  eventHandlers={{
                    click: () => onRouteSelect?.(route.id),
                  }}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <h3 className="font-bold text-gray-900">{route.name}</h3>
                      <p className="text-sm text-gray-600">
                        {route.service_area_name}
                      </p>
                      <div className="mt-2 text-sm text-gray-700">
                        <div>📍 {route.customers_count} customers</div>
                        <div>📏 {route.estimated_distance_km} km</div>
                        <div>⏱️ {route.estimated_duration_minutes} min</div>
                      </div>
                      {route.collection_days && (
                        <div className="mt-2 text-xs text-gray-500">
                          Days: {route.collection_days.join(", ")}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              )}
            </div>
          );
        })}

        {/* Locate button */}
        <LocateButton onLocate={setUserLocation} />
      </MapContainer>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-1000 flex flex-col gap-2">
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-10 h-10 bg-bg-base rounded-lg shadow-md flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          title="Zoom in"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-10 h-10 bg-bg-base rounded-lg shadow-md flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
          title="Zoom out"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>
      </div>

      {/* Route info overlay */}
      {selectedRoute && (
        <div className="absolute top-4 left-4 z-1000 bg-bg-base rounded-lg shadow-lg p-3 max-w-[220px]">
          <h4 className="font-semibold text-text-primary text-sm truncate">
            {selectedRoute.name}
          </h4>
          <p className="text-xs text-text-secondary truncate">
            {selectedRoute.service_area_name}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-text-secondary">
            <span>{selectedRoute.customers_count} stops</span>
            <span>•</span>
            <span>{selectedRoute.estimated_distance_km} km</span>
          </div>

          {/* Navigation info */}
          {userLocation && (
            <div className="mt-3 pt-3 border-t border-border-base">
              {isLoadingNavigation ? (
                <div className="flex items-center gap-2 text-xs text-text-secondary">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Calculating route...</span>
                </div>
              ) : navigationRoute ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-purple-600">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    <span>Navigation</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-text-primary">
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      {formatDistance(navigationRoute.distance)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDuration(navigationRoute.duration)}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-text-tertiary">
                  Unable to calculate route
                </p>
              )}
            </div>
          )}

          {!userLocation && (
            <p className="mt-2 text-xs text-text-tertiary italic">
              Tap locate button to get directions
            </p>
          )}
        </div>
      )}

      {/* No routes message */}
      {routes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-1000">
          <div className="bg-bg-base rounded-lg shadow-lg p-6 text-center">
            <svg
              className="w-12 h-12 mx-auto text-text-secondary opacity-50 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
            <p className="text-text-secondary">No routes assigned</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
