import numpy as np

def generate_tsp_input(num_cities, seed=None):
    if seed is not None:
        np.random.seed(seed)

    # Generate a random distance matrix (symmetric)
    distance_matrix = np.random.randint(1, 100, size=(num_cities, num_cities))
    np.fill_diagonal(distance_matrix, 10000)  # Set diagonal elements to zero
    distance_matrix = (distance_matrix + distance_matrix.T) // 2  # Ensure symmetry

    return distance_matrix

# Example: Generate TSP input for 5 cities

num_cities = 5

def genetic_TSP():

    distance_matrix = generate_tsp_input(num_cities)
    # Example: Generate TSP input for 5 cities
    print(distance_matrix)

    # Find the minimum value and its indices
    min_value = np.min(distance_matrix)
    min_indices = np.unravel_index(np.argmin(distance_matrix), distance_matrix.shape)

    print("Minimum Value:", min_value)
    print("Indices of Minimum Value:", min_indices)

    # Initialize variables
    iterations = 0
    path = 0
    min_path = 0
    index = min_indices[0]
    print(index)  # Note: Changed to 0-based indexing
    visited = [False] * num_cities

    # Ensure that the starting city is visited
    visited[index] = True

    while iterations < num_cities - 1:  # The loop should run for num_cities - 1 iterations
        min_path = np.inf  # Set the minimum path to positive infinity for comparison
        for i in range(num_cities):
            if not visited[i]:
                if distance_matrix[index, i] < min_path:
                    min_path = distance_matrix[index, i]
                    next_index = i

        path += min_path
        visited[next_index] = True
        index = next_index
        iterations += 1

    return path


result = genetic_TSP()
print("Total Distance of the Path:", result)


'''
We start by picking a random route.
Pick a neighboring route as a new candidate.
One way to do this is to randomly pick two cities on our original route and reverse a path between them.
If a candidate route is better, select it as a new current route.
If a candidate route is worse, select it as a new current route with a low probability.
The higher the temperature is the higher the chance of selecting the worse route.
Repeat from step two, until stoppage criteria.

'''

def simulated_annealing_tsp(distance_matrix, temperature=100, cooling_rate=0.95, stopping_temperature=1):
    num_cities = distance_matrix.shape[0]

    current_route = np.random.permutation(num_cities)
    current_cost = calculate_route_cost(current_route, distance_matrix)

    while temperature > stopping_temperature:
        new_route = get_neighbor_route(current_route)
        new_cost = calculate_route_cost(new_route, distance_matrix)

        if new_cost < current_cost or np.random.rand() < acceptance_probability(current_cost, new_cost, temperature):
            current_route = new_route
            current_cost = new_cost

        temperature *= cooling_rate

    return current_route, current_cost

def get_neighbor_route(route):
    # Swap two random cities in the route to create a neighboring route
    new_route = route.copy()
    idx1, idx2 = np.random.choice(len(route), size=2, replace=False)
    new_route[idx1], new_route[idx2] = new_route[idx2], new_route[idx1]
    return new_route

def acceptance_probability(current_cost, new_cost, temperature):
    if new_cost < current_cost:
        return 1
    return np.exp((current_cost - new_cost) / temperature)

def calculate_route_cost(route, distance_matrix):
    cost = 0
    for i in range(len(route) - 1):
        cost += distance_matrix[route[i], route[i + 1]]
    cost += distance_matrix[route[-1], route[0]]  # Return to the starting city
    return cost

# Example usage:
num_cities = 5
distance_matrix = generate_tsp_input(num_cities)

final_route, final_cost = simulated_annealing_tsp(distance_matrix)
print("Final Route:", final_route)
print("Final Cost:", final_cost)