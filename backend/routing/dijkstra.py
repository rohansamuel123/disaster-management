import heapq

def dijkstra(graph, start, end):
    pq = [(0, start)]
    dist = {start: 0}
    parent = {}

    while pq:
        cost, node = heapq.heappop(pq)

        if node == end:
            break

        for nxt, w in graph.neighbors(node):
            new_cost = cost + w
            if new_cost < dist.get(nxt, float('inf')):
                dist[nxt] = new_cost
                parent[nxt] = node
                heapq.heappush(pq, (new_cost, nxt))

    if end not in dist:
        return None

    path = []
    cur = end
    while cur != start:
        path.append(cur)
        cur = parent[cur]
    path.append(start)

    return path[::-1]
