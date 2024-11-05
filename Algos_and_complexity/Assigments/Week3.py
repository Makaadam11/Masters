import networkx as nx

def Djikstra(graph, source):
    N = len(graph.nodes)
    dist = [-float('inf')] * N
    visited = [False] * N

    dist[source] = 0
    visited[source] = True


    for _ in range(1,N):
        for u, v, j in graph.edges(data='weight'):
            if (dist[u] != [-float('inf')]) and (dist[u] + j > dist[v]):
                dist[v] = dist[u] + j

    return dist

# Przykład użycia:
G = nx.Graph()
G.add_edge(0, 1, weight=4)
G.add_edge(0, 2, weight=2)
G.add_edge(1, 2, weight=1)
G.add_edge(1, 3, weight=5)
G.add_edge(2, 3, weight=8)


result = Djikstra(G, 0)
print(result)  # Wyświetlenie odległości od źródła do wszystkich wierzchołków


def min_Coins(Coilns,n):
    result_sum = 0
    result= [0] * len(Coilns)
    i= 0
    while result_sum != n:
        for j in range(len(Coilns)):
            if (Coilns[j] <= abs(result_sum - n) ):
                i = j
        for j in range(len(Coilns)):
            if(n >= Coilns[i] + result_sum):
                result[i] = Coilns[i]
                result_sum += Coilns[i]
                Coilns.pop(Coilns[i])
                i = 0
                break

    return result

C = [1,1,1,1,2,2,2,5,5,5,10,10]
print(min_Coins(C,27))