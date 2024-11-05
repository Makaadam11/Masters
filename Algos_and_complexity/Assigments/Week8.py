import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pandas as pd

df = pd.read_csv('muschrooms.csv')

label_encoder = LabelEncoder()
for column in df.columns:
    df[column] = label_encoder.fit_transform(df[column])

def sigmoid(z):
    return 1 / (1 + np.exp(-z))

def cost(y_pred, y_true):
    m = len(y_true)
    return -1/m * np.sum(y_true * np.log(y_pred) + (1 - y_true) * np.log(1 - y_pred))

def stochastic_gradient_descent(X, y, w, b, learning_rate, iterations):
    m = len(y)

    for i in range(iterations):
        for j in range(m):
            # Randomly select a single data point
            random_index = np.random.randint(m)
            xi = X[random_index, :].reshape(1, -1)
            yi = y[random_index]

            # Compute the prediction
            zi = np.dot(xi, w) + b
            yi_pred = sigmoid(zi)

            # Compute gradients
            dz = yi_pred - yi
            dw = xi.T.dot(dz)
            db = dz

            # Update weights and bias
            w -= learning_rate * dw
            b -= learning_rate * db
        if i % 100 == 0 or i % 999 == 0:
            z = np.dot(X, w) + b
            y_pred = sigmoid(z)
            cost_value = cost(y_pred, y)
            print(f"Iteration {i}, Cost: {cost_value}")


def Binary_Linear_Classification_model(df):

    x = df.drop('poisonous', axis=1)
    y = df['poisonous']
    learning_rate = 0.01
    iterations = 1000
    # Assuming 'poisonous' is your target variable
    X = df.drop('poisonous', axis=1)
    y = df['poisonous'].values

    # Add a column of ones for the bias term
    X = np.c_[np.ones((X.shape[0], 1)), X]

    # Initialize weights and bias
    weights = np.zeros(X.shape[1])
    bias = 0

    # Split data into training and testing sets
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=23)

    # Train the model using stochastic gradient descent
    stochastic_gradient_descent(X_train, y_train, weights, bias, learning_rate, iterations)

Binary_Linear_Classification_model(df)