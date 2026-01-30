import requests
from config import WEATHER_API_KEY, CITY, COUNTRY_CODE
from config import SIMULATION_MODE


def fetch_weather():
    if SIMULATION_MODE:
        return {
            "rain": 95,        # heavy rain
            "water": 80,       # flooding
            "temp": 22,
            "humidity": 90,
            "wind": 45
        }
    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={CITY},{COUNTRY_CODE}&appid={WEATHER_API_KEY}&units=metric"
    )

    response = requests.get(url)
    data = response.json()

    # 🔴 SAFETY CHECK
    if "main" not in data:
        raise Exception(f"Weather API error: {data}")

    rain = data.get("rain", {}).get("1h", 0)
    temp = data["main"]["temp"]
    humidity = data["main"]["humidity"]
    wind = data["wind"]["speed"] * 3.6  # m/s → km/h

    # Simulated water level
    water_level = rain * 2

    return {
        "rain": rain,
        "water": water_level,
        "temp": temp,
        "humidity": humidity,
        "wind": wind
    }
