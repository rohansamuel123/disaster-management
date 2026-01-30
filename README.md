# Disaster Prediction & Smart Evacuation System

A DSA-based disaster management web application that predicts potential disasters
using live weather data and computes the safest evacuation route by avoiding
danger zones such as floods and landslides. The system provides real-time alerts,
visual risk zones, and safe navigation using Google Maps.

--------------------------------------------------

PROJECT OBJECTIVES

- Predict disasters using live environmental data
- Alert users before conditions become dangerous
- Compute the safest evacuation route (not just the shortest)
- Avoid flood-prone and high-risk areas dynamically
- Demonstrate Data Structures and Algorithms in a real-world system
- Provide real navigation support using Google Maps

--------------------------------------------------

HIGH LEVEL WORKFLOW

1. Weather data is continuously fetched from a weather API
2. Disaster risk is predicted using a rule-based predictor
3. If risk increases:
   - Danger zones are generated
   - Road risks are increased or blocked
4. A graph-based algorithm computes the safest evacuation route
5. The route is displayed on a map and can be opened in Google Maps

--------------------------------------------------

SYSTEM ARCHITECTURE

Weather API
    ↓
Disaster Predictor
    ↓
Danger Zones & Risk Levels
    ↓
Graph + Dijkstra’s Algorithm
    ↓
FastAPI Backend
    ↓
React + Leaflet Frontend
    ↓
Google Maps Navigation

--------------------------------------------------

APIs AND LIBRARIES USED

MAP AND VISUALIZATION
- Leaflet.js (map rendering engine)
- React-Leaflet (React wrapper for Leaflet)
- OpenStreetMap (map tiles)

NAVIGATION
- Google Maps Directions URL API
  Used only for final navigation

WEATHER AND DATA
- Weather API (rain, water level, wind, humidity, temperature)

BACKEND
- FastAPI (Python REST framework)

BROWSER APIs
- Geolocation API (live user location)
- Notifications API (disaster alerts)

--------------------------------------------------

BACKEND API ENDPOINTS

GET /alerts
- Returns disaster severity and alert message

GET /zones
- Returns danger zones with center and radius

POST /route/safest
Input:
{
  "start": [latitude, longitude],
  "simulate": true
}

Output:
{
  "route": [[lat, lon], ...],
  "directions": [...],
  "risk_reduced": "75%"
}

--------------------------------------------------

DATA STRUCTURES USED

1. Graph (Adjacency List)
   Represents the road network

   GRAPH = {
     "A": [("B", distance, risk), ("C", distance, risk)],
     "B": [("D", distance, risk)],
     ...
   }

2. Priority Queue (Min-Heap)
   Used in Dijkstra’s Algorithm to always expand the safest path

3. HashMap / Dictionary
   - Stores shortest (safest) distance to each node
   - Stores parent mapping for path reconstruction

4. Lists
   - Store route coordinates
   - Store directions shown in UI

--------------------------------------------------

EDGE WEIGHT DESIGN

Each edge in the graph stores:
- Distance (physical length of road)
- Risk (flood / danger level)

Total cost calculation:
cost = distance + (risk × penalty)

This ensures dangerous roads are avoided even if they are shorter.

--------------------------------------------------

DANGER ZONES

- Zones represent flood or landslide-prone regions
- Each zone has:
  - center (latitude, longitude)
  - radius (meters)
- Zones are dynamically generated based on disaster severity
- During simulation:
  - High-risk roads are blocked
  - Alternative safer paths are chosen

--------------------------------------------------

SIMULATION MODE

The system supports multiple scenarios:
- Live GPS (real-world user location)
- Normal conditions
- Flood in city center
- Landslide-prone region

Simulation mode:
- Increases road risk values
- Blocks dangerous edges
- Forces rerouting through safer paths

--------------------------------------------------

NAVIGATION FLOW

1. User clicks "Find Safe Route"
2. Backend computes safest path
3. Route is drawn on the map
4. User clicks "Navigate via Google Maps"
5. Google Maps opens with safe waypoints

--------------------------------------------------

FRONTEND TECH STACK

- React.js
- React-Leaflet
- Leaflet
- Fetch API
- Browser Notifications API

--------------------------------------------------

HOW TO RUN THE PROJECT

BACKEND SETUP

cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload

Backend runs at:
http://127.0.0.1:8000

--------------------------------------------------

FRONTEND SETUP

cd frontend
npm install
npm start

Frontend runs at:
http://localhost:3000

--------------------------------------------------

ACADEMIC RELEVANCE

- Real-world application of Graph data structure
- Implementation of Dijkstra’s Algorithm
- Dynamic edge-weight modification
- Risk-based optimization instead of shortest path
- Integration of DSA with real-time data

--------------------------------------------------

KEY TAKEAWAY

This project demonstrates how Data Structures and Algorithms can be applied
to real-life safety-critical systems, transforming theoretical concepts into
a practical disaster evacuation solution.
