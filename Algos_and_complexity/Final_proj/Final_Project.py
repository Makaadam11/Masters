from sklearn.linear_model import Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from datetime import datetime
import pytz
import random as random
import pandas as pd
import numpy as np

df = pd.DataFrame(pd.read_csv('all-data_celan_modified.csv'))


def random_shuffle(df):
    # Convert the DataFrame to a list of rows
    rows = df.values.tolist()
    for i in range(200):
        j = random.randint(0,i)
        if(rows[i][9] > rows[j][9]):
            rows[i], rows[j] = rows[j], rows[i]
    # Create a new DataFrame with the shuffled rows
    shuffled_df = pd.DataFrame(rows, columns=df.columns)
    return shuffled_df


shuffled_df = random_shuffle(df)

# Using randomized divide and conquer algorithm to sort the distance column
def quicksort(df):
    if len(df) <= 1:
        return df
    else:
        # Select a random pivot from the "distance" column
        pivot_index = random.randint(0, len(df) - 1)
        pivot = df.iloc[pivot_index]['dist_meters']

        # Initialize two lists for elements less than and greater than the pivot
        less_than_pivot = []
        greater_than_pivot = []

        for index, row in df.iterrows():
            if row['dist_meters'] < pivot:
                less_than_pivot.append(row)
            elif row['dist_meters'] > pivot:
                greater_than_pivot.append(row)

        # Recursively sort the two partitions
        sorted_less = quicksort(pd.DataFrame(less_than_pivot))
        sorted_greater = quicksort(pd.DataFrame(greater_than_pivot))

        return pd.concat([sorted_less, sorted_greater])

# Assuming you have a DataFrame named 'df'
# Call the quicksort function to sort it by the 'distance' column
sorted_df = quicksort(shuffled_df)

print(sorted_df)
mean_trip_duration = sorted_df['trip_duration'].mean()
print("Mean Trip Duration:", mean_trip_duration/60.0)

def regression_time_prediction(df, dist_meters, wait_sec, pickup_datetime):

    starting_time = pd.to_datetime(pickup_datetime)
    starting_time_sec = (starting_time - datetime(1970, 1, 1)).total_seconds()
    # Konwersja kolumny pickup_datetime na wartości liczbowe
    df['pickup_datetime'] = pd.to_datetime(df['pickup_datetime'])
    df['pickup_datetime_numeric'] = (df['pickup_datetime'] - datetime(1970, 1, 1)).dt.total_seconds()

    # Konwersja kolumny dropoff_datetime na wartości liczbowe
    df['dropoff_datetime'] = pd.to_datetime(df['dropoff_datetime'])
    df['dropoff_datetime_numeric'] = (df['dropoff_datetime'] - datetime(1970, 1, 1)).dt.total_seconds()

    # Wybór zmiennych niezależnych
    X = df[['dist_meters', 'wait_sec', 'pickup_datetime_numeric']]
    y = df['dropoff_datetime_numeric']

    # Podział na zbiór treningowy i testowy
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Standaryzacja danych
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    # Utworzenie modelu regresji liniowej
    model = LinearRegression()

    # Dopasowanie modelu do danych treningowych
    model.fit(X_train_scaled, y_train)

    # Prognozowanie na danych testowych
    y_pred = model.predict(X_test_scaled)

    # Ocena wyników
    mse = mean_squared_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)

    print(f"Mean Squared Error: {mse}")
    print(f"Deterministic coeff (R-squared): {r2}")

    # Prognozowanie dla nowych danych
    new_data = pd.DataFrame({'dist_meters': dist_meters, 'wait_sec': wait_sec, 'pickup_datetime': pickup_datetime})
    new_data['pickup_datetime'] = pd.to_datetime(new_data['pickup_datetime'])
    new_data['pickup_datetime_numeric'] = (new_data['pickup_datetime'] - datetime(1970, 1, 1)).dt.total_seconds()
    new_data_scaled = scaler.transform(new_data[['dist_meters', 'wait_sec', 'pickup_datetime_numeric']])

    # Prognozowanie
    prediction = model.predict(new_data_scaled)
    mexico_timezone = pytz.timezone('America/Mexico_City')
    print(prediction[0])
    print(starting_time_sec[0])
    print(f"Expected trip duration in minutes: ", (prediction[0] - starting_time_sec[0])/60.0)
    predicted_datetime = pd.to_datetime(prediction[0], unit='s', utc=True).tz_convert(mexico_timezone)
    print(f"Expected date and time of arrival: {predicted_datetime}")

# Przykładowe użycie funkcji
regression_time_prediction(df, [11082], [358], ['2016-09-17 09:45:56'])

#power interations https://en.wikipedia.org/wiki/Power_iteration



def calculate_eigenvalues(X):

    # X_array = X.to_numpy()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_meaned = X_scaled - np.mean(X_scaled , axis = 0)
    cov_matrix = np.cov(X_meaned, rowvar=False)

    # Calculate the eigenvalues and eigenvectors of the matrix
    eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)
    return eigenvalues, eigenvectors


def PCA(df):

    numerical_columns = ['dist_meters', 'dist_long_lat', 'trip_duration', 'wait_sec']
    X = df[numerical_columns]

    eigenvalues, eigenvectors = calculate_eigenvalues(X)

    explained_variance = np.var(X @ eigenvectors.T, axis=0) / sum(eigenvalues)

    print("Explained Vairance by eigen values:")
    for i, ratio in enumerate(explained_variance):
        eigenvalue_name = numerical_columns[i]
        print(f"Eigen value for {eigenvalue_name}: {ratio:.4f}")


PCA(sorted_df)

def calculate_travel_time(distance, avg_speed):
    return distance / avg_speed * 60

def find_closest_floats(target, df, num_closest=20):
    closest_drivers = []

    closest_drivers = df.loc[df.apply(lambda row: abs(row['pickup_longitude'] - target), axis=1).head(num_closest).index]
    return closest_drivers

def calculate_best_vendor_greedy(df, pickup_longitude):

    long_lat_df = df.sort_values(by=['pickup_longitude', 'pickup_latitude'])

    min_travel_time = float('inf')
    best_vendor = None
    closest_drivers = find_closest_floats(pickup_longitude, long_lat_df)
    for i in range(len(closest_drivers)):
        for vendor_id in closest_drivers['vendor_id'].unique():
            travel_time = calculate_travel_time(closest_drivers.iloc[i,14], closest_drivers.iloc[i,11])
            if travel_time < min_travel_time:
                min_travel_time = travel_time
                best_vendor = vendor_id
    print(f"For customer at index {i}, the best vendor is {best_vendor} with pick up time {min_travel_time} minutes.")
print(shuffled_df)
calculate_best_vendor_greedy(shuffled_df, 0.797677022839611)

# na podstawie prędkości drivera obliczyc kto najszybciej dojedzie na


def calculate_fuel_consumption(slope):

    uphill = 1.2
    downhill = 0.8
    if(slope > 0):
        return slope * uphill
    elif(slope < 0):
        return -slope * downhill
    else:
        return 0

def dynamic_calculate_min_fuel_cost(df):

    unique_vendors = pd.DataFrame({'vendor_id': df['vendor_id'].unique()})
    unique_vendors['minimum_total_fuel_cost'] = 0.0

    for i in range(len(df)):
        df.at[i, 'fuel_cost_coeff'] = calculate_fuel_consumption(df.at[i, 'slope']) * price_for_fuel

    for j in range(len(unique_vendors)):
        for i in range(len(df)):
            vendor_id = df.at[i, 'vendor_id']
            if vendor_id == unique_vendors.at[j, 'vendor_id']:
                unique_vendors.loc[unique_vendors['vendor_id'] == vendor_id, 'minimum_total_fuel_cost'] += df.at[i, 'fuel_cost_coeff']

    print(unique_vendors)
    return unique_vendors


price_for_fuel = 5
dynamic_calculate_min_fuel_cost(df)
# fuel_consumption(df)
print(df)


def cost_function(fuel_cost_coeff, distance_kilo_meters, driver_avg_speed):
    speed_weight = 1.5
    cost_weight = 0.7
    cost = fuel_cost_coeff * distance_kilo_meters * driver_avg_speed
    # Funkcja celu, w której chcemy minimalizować koszt, ale jednocześnie uwzględniać prędkość
    total_cost = cost_weight * cost - speed_weight * driver_avg_speed

    # Zdefiniuj minimalną wartość, która ma sens
    min_total_cost = cost_weight * cost

    return max(min_total_cost, total_cost)

def gradient_descent(speed, distance, fuel_coeff, learning_rate, iterations):
    for _ in range(iterations):
        # Calculate the partial derivatives
        partial_speed = cost_function(fuel_coeff, distance, 1)
        # partial_distance = cost_function(fuel_coeff, 1, speed)

        # Update parameters
        speed -= learning_rate * partial_speed
        # distance -= learning_rate * partial_distance
        cost = cost_function(speed, distance, fuel_coeff)


    return cost, speed

def minimize_cost(df):

    # Hyperparameters
    learning_rate = 0.001
    iterations = 25
    for i in range(len(df)):

        # Initial values
        init_speed = df.at[i, 'driver_avg_speed']
        init_distance = df.at[i, 'dist_kilometers']
        init_fuel_cost_coeff = df.at[i, 'fuel_cost_coeff']

        # Run gradient descent
        cost, speed = gradient_descent(init_speed, init_distance, init_fuel_cost_coeff, learning_rate, iterations)
        df.at[i, 'optimal_speed'] = speed
        df.at[i, 'total_cost'] = cost

    print(df)

minimize_cost(df)