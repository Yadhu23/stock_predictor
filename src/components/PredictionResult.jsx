import { StockChart } from './StockChart';

export function PredictionResult({ symbol, price }) {
    return (
        <div style={{ animation: 'fadeInUp 0.5s ease-out' }}>
            <div style={{
                textAlign: 'center', margin: '2rem 0', padding: '1.5rem',
                background: 'rgba(0, 0, 0, 0.2)', borderRadius: '1rem'
            }}>
                <h2 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                    Predicted Price
                </h2>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--success-color)' }}>
                    ${price.toFixed(2)}
                </div>
            </div>

            <div style={{ position: 'relative', height: '300px', width: '100%', marginTop: '2rem' }}>
                <StockChart symbol={symbol} predictedPrice={price} />
            </div>
        </div>
    );
}
