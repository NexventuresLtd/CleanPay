/**
 * CollectorPortalRoutes - Map view of collector's assigned routes
 * Interactive map showing routes and customer locations
 */

import { useState, useEffect, useMemo } from "react";
import { Card } from "../../components/common/Card";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { RouteMap } from "../../components/common/RouteMap";
import {
  useCollectorRoutes,
  useCollectorSchedules,
} from "../../hooks/useCollectorPortal";
import type {
  CollectorRoute,
  CollectorSchedule,
} from "../../services/collectorPortalService";

interface RouteCardProps {
  route: CollectorRoute;
  isSelected: boolean;
  onClick: () => void;
  todaySchedule?: CollectorSchedule | null;
}

const RouteCard = ({
  route,
  isSelected,
  onClick,
  todaySchedule,
}: RouteCardProps) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected
          ? "border-success bg-success/5 ring-2 ring-success/20"
          : "border-border-base bg-bg-base hover:border-success/50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
            isSelected
              ? "bg-success text-white"
              : "bg-primary-light text-primary"
          }`}
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
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-text-primary truncate">
              {route.name}
            </h3>
            {todaySchedule && (
              <span
                className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${
                  todaySchedule.status === "in_progress"
                    ? "bg-warning-light text-warning"
                    : todaySchedule.status === "completed"
                    ? "bg-success-light text-success"
                    : "bg-primary-light text-primary"
                }`}
              >
                {todaySchedule.status === "in_progress"
                  ? "Active"
                  : todaySchedule.status === "completed"
                  ? "Done"
                  : "Today"}
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary truncate">
            {route.service_area_name}
          </p>

          <div className="flex items-center gap-3 mt-2 text-xs text-text-secondary">
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {route.customers_count}
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
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
              {route.estimated_distance_km} km
            </span>
            <span className="flex items-center gap-1">
              <svg
                className="w-3.5 h-3.5"
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
              {route.estimated_duration_minutes} min
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export const CollectorPortalRoutes = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);
  const [showList, setShowList] = useState(true);

  const {
    data: routesData,
    isLoading: routesLoading,
    error: routesError,
  } = useCollectorRoutes();
  const { data: todaySchedules } = useCollectorSchedules({ date: "today" });

  const routes = routesData?.results || [];
  const selectedRoute = useMemo(
    () => routes.find((r) => r.id === selectedRouteId) || null,
    [routes, selectedRouteId]
  );

  // Map schedule to route for "today" indicator
  const routeScheduleMap = useMemo(() => {
    const map = new Map<string, CollectorSchedule>();
    todaySchedules?.results?.forEach((schedule) => {
      map.set(schedule.route_id, schedule);
    });
    return map;
  }, [todaySchedules]);

  // Auto-select first route
  useEffect(() => {
    if (routes.length > 0 && !selectedRouteId) {
      setSelectedRouteId(routes[0].id);
    }
  }, [routes, selectedRouteId]);

  if (routesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (routesError) {
    return (
      <div className="p-4">
        <Card className="text-center py-8">
          <div className="text-danger mb-4">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-text-secondary">Failed to load routes</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-3.5rem-4rem)] lg:h-[calc(100vh-4rem)] flex flex-col lg:flex-row">
      {/* Mobile Toggle */}
      <div className="lg:hidden p-2 bg-bg-base border-b border-border-base flex gap-2">
        <button
          onClick={() => setShowList(true)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            showList
              ? "bg-success text-white"
              : "bg-bg-subtle text-text-secondary"
          }`}
        >
          <svg
            className="w-4 h-4 inline mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
          Routes
        </button>
        <button
          onClick={() => setShowList(false)}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
            !showList
              ? "bg-success text-white"
              : "bg-bg-subtle text-text-secondary"
          }`}
        >
          <svg
            className="w-4 h-4 inline mr-2"
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
          Map
        </button>
      </div>

      {/* Routes List */}
      <div
        className={`${
          showList ? "flex" : "hidden"
        } lg:flex flex-col w-full lg:w-80 bg-bg-subtle border-r border-border-base`}
      >
        <div className="p-4 bg-bg-base border-b border-border-base">
          <h1 className="text-lg font-bold text-text-primary">My Routes</h1>
          <p className="text-sm text-text-secondary">
            {routes.length} assigned route{routes.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {routes.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="w-16 h-16 mx-auto text-text-secondary opacity-50 mb-2"
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
              <p className="text-text-secondary">No routes assigned yet</p>
            </div>
          ) : (
            routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                isSelected={selectedRouteId === route.id}
                onClick={() => {
                  setSelectedRouteId(route.id);
                  // On mobile, switch to map view when route is selected
                  if (window.innerWidth < 1024) {
                    setShowList(false);
                  }
                }}
                todaySchedule={routeScheduleMap.get(route.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Map View */}
      <div className={`${showList ? "hidden" : "flex"} lg:flex flex-1 p-4`}>
        <RouteMap
          routes={routes}
          selectedRoute={selectedRoute}
          onRouteSelect={(routeId) => setSelectedRouteId(routeId)}
        />
      </div>
    </div>
  );
};

export default CollectorPortalRoutes;
