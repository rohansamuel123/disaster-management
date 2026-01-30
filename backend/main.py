from fastapi import FastAPI
import threading
import time
from fastapi.middleware.cors import CORSMiddleware

from prediction.predictor import DisasterPredictor
from data.weather_fetcher import fetch_weather
from config import WEATHER_POLL_INTERVAL

from routing.road_graph import GRAPH, NODES
from routing.safest_path import safest_path
from routing.utils import nearest_node

# -------------------------------------------------
# APP SETUP
# -------------------------------------------------
app = FastAPI(title="Disaster Prediction & Evacuation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = DisasterPredictor()

# -------------------------------------------------
# WEATHER POLLING
# -------------------------------------------------
def weather_polling_loop():
    while True:
        try:
            data = fetch_weather()
            predictor.add_reading(
                rain=data["rain"],
                water=data["water"],
                temp=data["temp"],
                hum=data["humidity"],
                wind=data["wind"],
            )
            print("Weather update:", data)
        except Exception as e:
            print("Weather fetch error:", e)

        time.sleep(WEATHER_POLL_INTERVAL)

def is_inside_danger(start_node, simulate):
    if not simulate:
        return False

    # Nodes considered dangerous during simulation
    danger_nodes = {"A", "B", "C"}  # adjust based on your zones
    return start_node in danger_nodes



@app.on_event("startup")
def start_weather_polling():
    threading.Thread(target=weather_polling_loop, daemon=True).start()


# -------------------------------------------------
# BASIC ENDPOINTS
# -------------------------------------------------
@app.get("/")
def home():
    return {"status": "Backend running with live weather"}


@app.get("/alerts")
def get_alert(simulate: bool = False):
    if simulate:
        return {
            "alert": [
                "HIGH",
                "Severe flooding detected. Primary evacuation route blocked."
            ]
        }

    return {"alert": predictor.get_alert()}



# -------------------------------------------------
# DANGER ZONES
# -------------------------------------------------
@app.get("/zones")
def get_zones(simulate: bool = False):
    if simulate:
        return {
            "zones": [
                {"type": "flood", "center": NODES["B"], "radius": 900},
                {"type": "flood", "center": NODES["C"], "radius": 800},
                {"type": "landslide", "center": NODES["D"], "radius": 700},
            ]
        }
    else:
        return {
            "zones": [
                {"type": "flood", "center": NODES["C"], "radius": 400}
            ]
        }



# -------------------------------------------------
# SAFEST ROUTE (DSA CORE)
# -------------------------------------------------
@app.post("/route/safest")
def safest_route(payload: dict):
    simulate = payload.get("simulate", False)
    user_location = payload["start"]

    start_node = nearest_node(user_location, NODES)
    end_node = "S"

    parent = safest_path(GRAPH, start_node, end_node, simulate)

    if end_node not in parent and start_node != end_node:
        # 🔥 fallback evacuation
        return {
            "route": [
                list(user_location),
                list(NODES[end_node])
            ],
            "directions": [
                "⚠️ You are inside a high-risk zone",
                "Immediate evacuation advised",
                "Proceed directly to nearest shelter"
            ],
            "risk_reduced": "15%"
        }

    path_nodes = []
    cur = end_node

    while cur != start_node:
        path_nodes.append(cur)
        cur = parent[cur]

    path_nodes.append(start_node)
    path_nodes.reverse()

    route = [list(user_location)] + [list(NODES[n]) for n in path_nodes]

    directions = (
        [
            "⚠️ Disaster detected — evacuation initiated",
            "Flood-prone roads blocked",
            "Rerouted via safer residential roads",
            "Proceed to nearest shelter",
        ]
        if simulate
        else [
            "Normal conditions detected",
            "Proceed via shortest path to shelter",
        ]
    )

    return {
        "route": route,
        "directions": directions,
        "risk_reduced": "75%" if simulate else "30%",
    }
