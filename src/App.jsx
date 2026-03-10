import { useState, useEffect } from 'react';
import { SearchBox } from './components/SearchBox';
import { RecentSearches } from './components/RecentSearches';
import { PredictionResult } from './components/PredictionResult';
import { Activity } from 'lucide-react';
import './index.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [symbol, setSymbol] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentStocks');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('recentStocks', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handlePredict = async (searchSymbol) => {
    const targetSymbol = searchSymbol.trim().toUpperCase();
    if (!targetSymbol) {
      setError("Please enter a valid stock symbol.");
      return;
    }

    setSymbol(targetSymbol);
    setError(null);
    setPrediction(null);
    setLoading(true);

    try {
      // Use environment variable for backend URL in production, fallback to local dev server
      const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
      const response = await fetch(`${baseUrl}/predict?stock=${targetSymbol}`);

      if (!response.ok) {
        throw new Error("Unable to fetch prediction. The backend might be down.");
      }

      const data = await response.json();

      if (data.error || !data.predicted_price) {
        throw new Error(data.error || "Invalid response from server.");
      }

      setPrediction(parseFloat(data.predicted_price));

      setRecentSearches(prev => {
        const filtered = prev.filter(s => s !== targetSymbol);
        return [targetSymbol, ...filtered].slice(0, 5);
      });

    } catch (err) {
      setError(err.message || "Failed to fetch prediction.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="animated-bg"></div>
      <div className="container">
        <header style={{ textAlign: 'center', marginBottom: '2.5rem', animation: 'fadeInDown 0.8s ease-out' }}>
          <h1 style={{
            fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem',
            background: 'linear-gradient(to right, #60a5fa, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>
            AI LSTM Stock Price Predictor
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            Predict future stock prices instantly with our advanced machine learning model.
          </p>
        </header>

        <main className="glass-card">
          <SearchBox onPredict={handlePredict} disabled={loading} currentSymbol={symbol} />
          <RecentSearches searches={recentSearches} onSelect={handlePredict} />

          {loading && (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div className="spinner"></div>
              <p>Analyzing market data...</p>
            </div>
          )}

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)', color: 'var(--error-color)',
              padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(239, 68, 68, 0.2)',
              marginBottom: '1.5rem', textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {prediction !== null && !loading && !error && (
            <PredictionResult symbol={symbol} price={prediction} />
          )}
        </main>
      </div>
    </>
  );
}

export default App;
