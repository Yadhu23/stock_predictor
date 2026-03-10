import numpy as np
import pandas as pd
import yfinance as yf
import pickle
import os

from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM

def train_and_save_model(stock_symbol="AAPL", look_back=60, epochs=10):
    print(f"Downloading historical data for {stock_symbol}...")
    # Get enough history to train a robust general model
    data = yf.download(stock_symbol, start="2015-01-01", end="2024-01-01")
    data = data[['Close']]
    
    # We will fit the scaler ONLY on the training data to prevent data leakage
    train_size = int(len(data) * 0.8)
    train_data = data.iloc[:train_size].copy()
    
    scaler = MinMaxScaler(feature_range=(0,1))
    # Fit the scaler only on the training set
    scaler.fit(train_data)
    
    # Scale entire dataset using the training scaler
    scaled_data = scaler.transform(data)
    
    # We will only use the training portion to train
    train_scaled = scaled_data[:train_size]
    
    X_train = []
    y_train = []
    
    for i in range(look_back, len(train_scaled)):
        X_train.append(train_scaled[i-look_back:i, 0])
        y_train.append(train_scaled[i, 0])
        
    X_train, y_train = np.array(X_train), np.array(y_train)
    X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))
    
    print("Building LSTM model...")
    model = Sequential()
    model.add(LSTM(units=50, return_sequences=True, input_shape=(X_train.shape[1], 1)))
    model.add(LSTM(units=50))
    model.add(Dense(25))
    model.add(Dense(1))
    
    model.compile(optimizer='adam', loss='mean_squared_error')
    
    print("Training model...")
    model.fit(X_train, y_train, batch_size=32, epochs=epochs)
    
    print("Saving model and scaler...")
    model.save('lstm_model.h5')
    with open('scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
        
    print("Training complete! Saved lstm_model.h5 and scaler.pkl")

if __name__ == "__main__":
    # If the model doesn't exist, train it.
    if not os.path.exists('lstm_model.h5'):
        train_and_save_model("AAPL", epochs=5) # Reduced epochs for faster execution in this demo
    else:
        print("Model already exists. Skipping training.")
