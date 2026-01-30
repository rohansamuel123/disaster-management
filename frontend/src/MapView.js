import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";

import Header from "./components/Header";
import RoutePanel from "./components/RoutePanel";
import StatusPanel from "./components/StatusPanel";

/* ---------------- LEAFLET ICON FIX ---------------- */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

/* ---------------- AUTO FIT MAP TO ROUTE ---------------- */
function FitMapToRoute({ route, center }) {
  const map = useMap();

  useEffect(() => {
    if (Array.isArray(route) && route.length > 1) {
      map.fitBounds(route, { padding: [60, 60] });
    } else if (center) {
      map.setView(center, 13);
    }
  }, [route, center, map]);

  return null;
}

const SCENARIOS = {
  live_gps: {
    label: "📍 Live GPS (Real World)",
    simulate: false,
    useGps: true,
  },
  normal: {
    label: "Normal Conditions (Demo)",
    simulate: false,
    position: [12.9716, 77.5946],
    useGps: false,
  },
  flood_core: {
    label: "Flood – City Center",
    simulate: true,
    position: [12.9725, 77.6],
    useGps: false,
  },
  landslide_zone: {
    label: "Landslide Area",
    simulate: true,
    position: [12.968, 77.605],
    useGps: false,
  },
};

function MapView() {
  const [position, setPosition] = useState(null);
  const [gpsReady, setGpsReady] = useState(false);

  const [route, setRoute] = useState([]);
  const [zones, setZones] = useState([]);

  const [alertMsg, setAlertMsg] = useState(null);
  const [directions, setDirections] = useState([]);
  const [riskReduced, setRiskReduced] = useState(null);
  const [simulate, setSimulate] = useState(false);
  const [routeKey, setRouteKey] = useState(0);
  const [scenario, setScenario] = useState("live_gps");

  /* ---------------- GET USER LOCATION ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      setPosition([12.9716, 77.5946]);
      setGpsReady(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setGpsReady(true);
      },
      () => {
        setPosition([12.9716, 77.5946]);
        setGpsReady(true);
      },
    );
  }, []);

  useEffect(() => {
    const s = SCENARIOS[scenario];

    setSimulate(s.simulate);

    if (!s.useGps && s.position) {
      // Demo scenarios override location
      setPosition(s.position);
    }
    // else → Live GPS remains untouched

    setRoute([]);
    setDirections([]);
    setRiskReduced(null);
  }, [scenario]);

  useEffect(() => {
    if (!navigator.geolocation) return;

    if (scenario !== "live_gps") return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setGpsReady(true);
      },
      () => setGpsReady(true),
    );
  }, [scenario]);

  /* ---------------- FETCH SAFE ROUTE ---------------- */
  const fetchRoute = async () => {
    if (!gpsReady || !position) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/route/safest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: position,
          simulate: simulate,
        }),
      });

      const data = await res.json();

      // 🔥 HARD VALIDATION
      if (!Array.isArray(data.route) || data.route.length < 2) {
        console.error("Invalid route from backend:", data.route);
        setRoute([]);
        return;
      }

      // 🔥 FORCE NUMBER FORMAT
      const cleanedRoute = data.route.map((p) => [Number(p[0]), Number(p[1])]);

      setRoute(cleanedRoute);

      // 🔥 FORCE LEAFLET REMOUNT
      setRouteKey((prev) => prev + 1);

      setDirections(data.directions || []);
      setRiskReduced(data.risk_reduced || null);

      console.log("ROUTE DRAWN:", cleanedRoute);
    } catch (err) {
      console.error("Route fetch failed", err);
    }
  };

  /* ---------------- ALERTS ---------------- */
  useEffect(() => {
    const fetchAlerts = async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/alerts?simulate=${simulate}`,
      );
      const data = await res.json();
      if (data.alert) setAlertMsg(data.alert[1]);
    };

    fetchAlerts();
  }, [simulate]);

  /* ---------------- ZONES ---------------- */
  useEffect(() => {
    const fetchZones = async () => {
      const res = await fetch(
        `http://127.0.0.1:8000/zones?simulate=${simulate}`,
      );
      const data = await res.json();
      setZones(Array.isArray(data.zones) ? data.zones : []);
    };

    fetchZones();
  }, [simulate]);

  /* ---------------- GOOGLE MAPS ---------------- */
  const openInGoogleMaps = () => {
    if (!route || route.length < 2) return;

    const origin = route[0].join(",");
    const destination = route[route.length - 1].join(",");

    const waypoints = route
      .slice(1, -1)
      .map((p) => p.join(","))
      .join("|");

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=driving`;
    window.open(url, "_blank");
  };

  if (!position) return null;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header alertMsg={alertMsg} />

      <div style={{ flex: 1, display: "flex" }}>
        {/* LEFT PANEL */}
        <div style={{ width: "260px", borderRight: "1px solid #ddd" }}>
          <StatusPanel alertMsg={alertMsg} riskReduced={riskReduced} />
        </div>

        {/* MAP */}
        <div style={{ flex: 1, position: "relative" }}>
          <div style={controlBox}>
            <select
              value={scenario}
              onChange={(e) => setScenario(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                fontWeight: "bold",
                border: "1px solid #ccc",
              }}>
              {Object.entries(SCENARIOS).map(([key, s]) => (
                <option key={key} value={key}>
                  {s.label}
                </option>
              ))}
            </select>

            <button onClick={fetchRoute} style={btnStyle}>
              🚑 Find Safe Route
            </button>

            <button
              onClick={() => setSimulate(!simulate)}
              style={{
                ...btnStyle,
                background: simulate ? "#dc2626" : "#16a34a",
              }}>
              {simulate
                ? "Simulation ON (Recalculate Route)"
                : "Simulation OFF"}
            </button>

            {route.length > 1 && (
              <button
                onClick={openInGoogleMaps}
                style={{ ...btnStyle, background: "#0f172a" }}>
                🧭 Navigate via Google Maps
              </button>
            )}
          </div>

          <MapContainer
            key={route.length} // 🔥 FORCE REDRAW
            center={position}
            zoom={13}
            style={{ height: "100%", width: "100%" }}>
            <TileLayer
              attribution="© OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={position}>
              <Popup>You are here</Popup>
            </Marker>

            {route.length > 1 && (
              <Polyline
                key={routeKey} // 🔥 THIS FIXES EVERYTHING
                positions={route}
                color="blue"
                weight={6}
                opacity={0.9}
              />
            )}

            {zones.map((z, idx) => (
              <Circle
                key={idx}
                center={z.center}
                radius={z.radius}
                pathOptions={{
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.4,
                }}
              />
            ))}

            <FitMapToRoute route={route} center={position} />
          </MapContainer>
          {route.length > 0 && (
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                background: "white",
                padding: 8,
                zIndex: 3000,
                fontSize: 12,
              }}>
              Route points: {route.length}
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: "320px", borderLeft: "1px solid #ddd" }}>
          <RoutePanel directions={directions} riskReduced={riskReduced} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const btnStyle = {
  padding: "12px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const controlBox = {
  position: "absolute",
  top: "15px",
  left: "15px",
  zIndex: 2000,
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export default MapView;
