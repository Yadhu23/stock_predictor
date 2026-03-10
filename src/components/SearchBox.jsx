import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

export function SearchBox({ onPredict, disabled, currentSymbol }) {
    const [inputVal, setInputVal] = useState('');

    useEffect(() => {
        if (currentSymbol) {
            setInputVal(currentSymbol);
        }
    }, [currentSymbol]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onPredict(inputVal);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Enter stock symbol (e.g., AAPL)"
                disabled={disabled}
                autoComplete="off"
                style={{
                    flex: 1, padding: '1rem 1.5rem', fontSize: '1.1rem', borderRadius: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)', background: 'rgba(15, 23, 42, 0.5)',
                    color: 'var(--text-primary)', transition: 'all 0.3s ease', textTransform: 'uppercase'
                }}
            />
            <button
                type="submit"
                disabled={disabled}
                style={{
                    padding: '1rem 2rem', fontSize: '1.1rem', fontWeight: 600, borderRadius: '0.75rem',
                    border: 'none', background: 'var(--accent-color)', color: 'white', cursor: disabled ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: disabled ? 0.7 : 1
                }}
            >
                <Search size={20} /> Predict
            </button>
        </form>
    );
}
