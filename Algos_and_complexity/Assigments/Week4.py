import networkx as nx
import random as random

# Assigment1
G = nx.Graph()
G.add_edge(0, 1)
G.add_edge(0, 2)
G.add_edge(1, 2)
G.add_edge(1, 3)
G.add_edge(2, 3)
print("Nodes: ", G.nodes)
print("E: ", G.edges)

def kargers(G):

    while(G.size() > 1):
        x = random.randint(0,2)
        y = random.randint(1,3)
        G.remove_edge(x, y)
        G.add_node(x)
        cycles = list(nx.cycle_basis(G))
        if cycles:
            print("Cykle w grafie:", cycles)
        for cycle in cycles:
            for i in range(len(cycle)):
                G.remove_edge(cycle[i], cycle[(i+1) % len(cycle)])

kargers(G)

print("Nodes: ", G.nodes)
print("E: ", G.edges)

# Assigment 2

inputs = [random.randint(0,9) for _ in range(7)]
LRU = [] * 3

def lru(inputs, LRU):
    swamped = False
    for i in range(len(inputs)):
        if(i < len(LRU)):
            LRU[i] = inputs[i]
        else:
            for j in range(len(LRU)-1):
                LRU[j] = LRU[j+1]
                if(LRU[j] == inputs[i] and swamped == False):
                    LRU[j].swamp(LRU[len(LRU)-1])
                    swamped = True
            LRU[len(LRU)-1] = inputs[i]

    return LRU


def lru2(inputs, LRU):
    for i in range(len(inputs)):
        print(f"Input {i}: {inputs[i]}")
        if inputs[i] in LRU:
            # Element jest już w pamięci LRU, przenosimy go na początek
            print(f"Cache hit for input {inputs[i]}")
            LRU.remove(inputs[i])
            LRU.insert(0, inputs[i])
        else:
            # Element nie jest w pamięci LRU, dodajemy go na początek
            print(f"Cache miss for input {inputs[i]}. Adding to cache.")
            if len(LRU) == len(inputs):
                # Usuwamy ostatni element, jeśli cache jest pełny
                removed = LRU.pop()
                print(f"Removed {removed} from cache.")
            LRU.insert(0, inputs[i])
        print(f"LRU Cache: {LRU}")

    return LRU

# Przykład użycia
LRU_cache2 = []
inputs = [1, 2, 3, 4, 5, 1, 2, 6]
result = lru2(inputs, LRU_cache2)
print("Final LRU Cache:", result)

print("****************")
LRU_cache = []
inputs = [1, 2, 3, 4, 5, 1, 2, 6]
result = lru(inputs, LRU)
print("Final LRU Cache:", result)