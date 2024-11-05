import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
import pandas as pd

df = pd.read_csv('winequality-red.csv')

def normalize(x):
    max_value = x.max()
    min_value = x.min()
    x_n = (x - x.min()) / (x.max() - x.min())
    return max_value, min_value, x_n

def cost(B, X, y):
    y_pred = B.T @ X.T
    error = y_pred - np.array(y)
    error_mse = np.sum(error**2)/(2*len(error))
    return error_mse

def pd(B, X, y, h=1e-6):

    db = B.copy()
    for i in range(len(db)):
        B_temp = B.copy()
        B_temp[i] += h
        db[i] = (cost(B_temp, X, y) - cost(B, X, y)/h)
    return db

def Gradient_descent(df):

    X = df
    X = np.array(df.drop('alcohol', axis=1))
    y = df['alcohol'].values
    step = 1e-3
    reg_par =1e-2
    iter_n = 2000

    # Add a column of ones for the bias term
    X = np.c_[np.ones((X.shape[0], 1)), X]

    train_num = int(len(X)*4/5)
    X_train = X[:train_num]
    X_test = X[train_num:]
    y_train = y[:train_num]
    y_test = y[train_num:]
    B = np.linalg.inv(np.dot(X.T,X))
    B = B @ X.T
    B = B @ y

    B = 0.5 * np.ones((10))
    for i in range(iter_n):

        B_prev = B.copy()
        B = B_prev - step*pd(B, X_train, y_train) - 2*reg_par*B_prev

        if i % 250 == 0 or i == iter_n-1:
            print (cost(B, X_test, y_test))
Gradient_descent(df)


