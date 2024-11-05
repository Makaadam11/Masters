import numpy as np

def CountSort(A):
    B = np.zeros(len(A))
    for j in range(1,len(A)):
        B[A[j]] += 1
    for i in range(2,len(A)):
        B[i] += B[i-1]
    for j in range(len(A),1,-1):
        A[B[A[j]]] = A[j]
        B[A[j]] -= 1

CountSort(np.array([1,5,2,5,1,2,5,3,4,2,5,34,5]))

def quickSort(arr):
    if len(arr) <=1:
        return arr
    else:
        pivot = arr[low]
        i = low - 1
        j = high + 1
        while True:
            j -= 1
            while arr[j] > pivot:
                i += 1
            while arr[i] < pivot:
                if i < j:
                    arr[i].swap(arr[j])
                else:
                    return j
            first_part =quickSort(arr[:i])
            second_part = quickSort(arr[i+1])
            first_part.append(arr[i])
    return first_part + second_part

def Hoare_partition(arr, low, high):
    pivot = arr[low]
    i = low - 1
    j = high + 1
    while True:
        j -= 1
        while arr[j] > pivot:
            i += 1
        while arr[i] < pivot:
            if i < j:
                arr[i].swap(arr[j])
            else:
                return j
print(quickSort(np.array([1,5,3,235,66,45,1,7,123,5,])))


