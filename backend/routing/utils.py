import math

def distance(a, b):
    return math.sqrt((a[0] - b[0])**2 + (a[1] - b[1])**2)

def nearest_node(user_location, nodes):
    ux, uy = user_location

    min_dist = float("inf")
    nearest = None

    for node, (x, y) in nodes.items():
        if node.startswith("S"):   # 🔥 prevent start at shelter
            continue

        dist = (ux - x) ** 2 + (uy - y) ** 2
        if dist < min_dist:
            min_dist = dist
            nearest = node

    return nearest

