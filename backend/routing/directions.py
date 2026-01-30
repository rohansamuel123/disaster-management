def build_directions(path_nodes):
    directions = []
    for i in range(len(path_nodes) - 1):
        directions.append(
            f"Move from {path_nodes[i]} towards {path_nodes[i+1]} using the safest available road"
        )
    directions.append("You have reached a safe shelter")
    return directions
