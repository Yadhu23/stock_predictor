import json
import numpy as np
import yfinance as yf
import pickle
import urllib.parse
from http.server import BaseHTTPRequestHandler, HTTPServer
from tensorflow.keras.models import load_model

# Load artifacts once when server starts
print("Loading model and scaler...")
model = load_model('lstm_model.h5')
with open('scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

# Global configuration
LOOK_BACK = 60

class APIHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        if parsed_path.path == '/predict':
            query = urllib.parse.parse_qs(parsed_path.query)
            if 'stock' not in query:
                self.send_error(400, "Missing 'stock' parameter")
                return
            
            symbol = query['stock'][0].upper()
            
            try:
                print(f"Fetching recent data for {symbol}...")
                # Fetch recent data. We need at least look_back days. Fetching ~3 months to be safe on trading days
                df = yf.download(symbol, period="3mo")
                if df.empty or len(df) < LOOK_BACK:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": f"Not enough historical data for {symbol}"}).encode())
                    return
                
                # Get the last 60 closing prices
                recent_data = df[['Close']].tail(LOOK_BACK)
                
                # Scale the data using our pre-fitted scaler
                scaled_recent = scaler.transform(recent_data)
                
                # Shape it for the LSTM model: (1 sequence, 60 time steps, 1 feature)
                X_input = np.reshape(scaled_recent, (1, LOOK_BACK, 1))
                
                # Predict
                scaled_prediction = model.predict(X_input)
                
                # Inverse scale back to $ value
                predicted_price = scaler.inverse_transform(scaled_prediction)[0][0]
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                
                response_data = {
                    "symbol": symbol,
                    "predicted_price": float(predicted_price)
                }
                
                self.wfile.write(json.dumps(response_data).encode())
                
            except Exception as e:
                print(f"Error predicting for {symbol}: {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
        else:
            self.send_error(404, "Not Found")

def run(server_class=HTTPServer, handler_class=APIHandler):
    import os
    port = int(os.environ.get('PORT', 8000))
    server_address = ('0.0.0.0', port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run()
