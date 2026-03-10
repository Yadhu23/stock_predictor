export function RecentSearches({ searches, onSelect }) {
    if (!searches || searches.length === 0) return null;

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem', minHeight: '32px' }}>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center' }}>
                Recent:
            </span>
            {searches.map((symbol) => (
                <span
                    key={symbol}
                    onClick={() => onSelect(symbol)}
                    style={{
                        background: 'rgba(255, 255, 255, 0.1)', color: 'var(--text-secondary)',
                        padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.85rem',
                        cursor: 'pointer', transition: 'all 0.2s ease', userSelect: 'none'
                    }}
                    onMouseEnter={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.2)'; e.target.style.color = 'var(--text-primary)'; }}
                    onMouseLeave={(e) => { e.target.style.background = 'rgba(255, 255, 255, 0.1)'; e.target.style.color = 'var(--text-secondary)'; }}
                >
                    {symbol}
                </span>
            ))}
        </div>
    );
}
