import heapq
from data.sensor_store import SensorStore

class DisasterPredictor:
    def __init__(self):
        self.store = SensorStore()
        self.alerts = []  # min-heap

    def add_reading(self, rain, water, temp, hum, wind):
        self.store.add(rain, water, temp, hum, wind)
        self.evaluate()

    def evaluate(self):
        rain = self.store.get("rain")
        water = self.store.get("water")
        temp = self.store.get("temp")
        hum = self.store.get("humidity")
        wind = self.store.get("wind")

        # Flood rule
        if len(rain) == 5:
            if sum(rain)/5 > 50 and water[-1] > water[0]:
                heapq.heappush(self.alerts, (1, "FLOOD_ALERT"))

        # Wildfire rule
        if len(temp) == 5:
            if max(temp) > 40 and min(hum) < 20 and max(wind) > 30:
                heapq.heappush(self.alerts, (2, "WILDFIRE_ALERT"))

    def get_alert(self):
        if self.alerts:
            return heapq.heappop(self.alerts)
        return None
