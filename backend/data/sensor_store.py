from collections import deque

class SensorStore:
    def __init__(self, size=5):
        self.data = {
            "rain": deque(maxlen=size),
            "water": deque(maxlen=size),
            "temp": deque(maxlen=size),
            "humidity": deque(maxlen=size),
            "wind": deque(maxlen=size)
        }

    def add(self, rain, water, temp, hum, wind):
        self.data["rain"].append(rain)
        self.data["water"].append(water)
        self.data["temp"].append(temp)
        self.data["humidity"].append(hum)
        self.data["wind"].append(wind)

    def get(self, key):
        return list(self.data[key])
