import heapq

def safest_path(graph, start, end, simulate=False):
    pq = [(0, start)]
    dist = {node: float("inf") for node in graph}
    parent = {}

    dist[start] = 0

    while pq:
        cost, node = heapq.heappop(pq)

        if node == end:
            break

        for neighbor, distance, risk in graph[node]:

            if simulate and risk >= 5:
                penalty = 10000   # 🔥 escape-from-disaster logic
            else:
                penalty = risk * 1000

            new_cost = cost + distance + penalty

            if new_cost < dist[neighbor]:
                dist[neighbor] = new_cost
                parent[neighbor] = node
                heapq.heappush(pq, (new_cost, neighbor))

    return parent
