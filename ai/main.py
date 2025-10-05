import time
import requests
import pandas as pd
import numpy as np
import joblib
from sklearn.linear_model import LinearRegression

# ----- CONFIGURE FIREBASE URLS -----
FIREBASE_SENSOR_URL = "https://nasa-buoy-project-default-rtdb.europe-west1.firebasedatabase.app/sensorData.json"
FIREBASE_ML_URL = "https://nasa-buoy-project-default-rtdb.europe-west1.firebasedatabase.app/mlResults.json"

# ----- LOAD OR CREATE MODEL -----
try:
    model = joblib.load("buoy_model.pkl")
    print("Loaded existing model.")
except:
    model = LinearRegression()
    print("Created new model.")

def fetch_sensor_data():
    """Fetch sensor data from Firebase and return as DataFrame."""
    try:
        response = requests.get(FIREBASE_SENSOR_URL, timeout=10)
        response.raise_for_status()
        data = response.json()
    except requests.RequestException as e:
        print("Failed to fetch sensor data:", e)
        return pd.DataFrame()
    
    if not data:
        return pd.DataFrame()
    
    df = pd.DataFrame(data).transpose()
    
    # Some data uses 'prediction_temp' instead of 'temperature'
    if 'temperature' not in df.columns and 'prediction_temp' in df.columns:
        df['temperature'] = df['prediction_temp']
    
    # Ensure all expected columns exist
    expected_columns = ['temperature','ax','ay','az','gx','gy','gz']
    for col in expected_columns:
        if col not in df.columns:
            df[col] = 0.0
    
    return df

def calculate_wave_index(ax, ay, az):
    """Calculate wave index from accelerometer values."""
    return np.sqrt(ax**2 + ay**2 + az**2)

def push_ml_results(pred_temp, wave_index):
    """Push prediction to Firebase."""
    ml_result = {
        "predicted_temp": float(pred_temp),
        "predicted_wave_index": float(wave_index),
        "timestamp": int(time.time())
    }
    try:
        response = requests.post(
            FIREBASE_ML_URL,
            json=ml_result,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        response.raise_for_status()
        print("Pushed ML result:", ml_result)
    except requests.RequestException as e:
        print("Failed to push ML result:", e)

def main_loop():
    while True:
        df = fetch_sensor_data()
        if df.empty or len(df) < 2:
            print("Not enough data to train/predict. Waiting 1 minute...")
            time.sleep(60)
            continue
        
        # Prepare features and target
        X = df[['ax','ay','az','gx','gy','gz']]
        y = df['temperature']
        
        # Train or update model
        try:
            model.fit(X, y)
            joblib.dump(model, "buoy_model.pkl")  # Save updated model
        except Exception as e:
            print("Error training model:", e)
            time.sleep(60)
            continue
        
        # Predict latest row
        try:
            latest = X.iloc[-1].values.reshape(1, -1)
            pred_temp = model.predict(latest)[0]
            wave_index = calculate_wave_index(*latest[0][:3])  # ax, ay, az
            
            # Push to Firebase
            push_ml_results(pred_temp, wave_index)
        except Exception as e:
            print("Error predicting or pushing ML results:", e)
        
        print("Waiting a  minute until next update...")
        time.sleep(60)  # 5 minutes

if __name__ == "__main__":
    print("Starting Buoy ML System...")
    main_loop()

