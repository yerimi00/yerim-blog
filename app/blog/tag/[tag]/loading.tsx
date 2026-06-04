export default function TagLoading() {
  return (
    <main style={{ maxWidth: '780px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ height: '2.5rem', width: '160px', background: 'var(--bg-secondary)', borderRadius: '6px', marginBottom: '0.5rem' }} />
      <div style={{ height: '1rem', width: '70px', background: 'var(--bg-secondary)', borderRadius: '4px', marginBottom: '2rem' }} />
      {[...Array(5)].map((_, i) => (
        <div key={i} style={{ padding: '1.5rem 0', borderBottom: '1px solid var(--border)' }}>
          <div style={{ height: '0.9rem', width: '35%', background: 'var(--bg-secondary)', borderRadius: '4px', marginBottom: '0.6rem' }} />
          <div style={{ height: '1.1rem', width: '75%', background: 'var(--bg-secondary)', borderRadius: '4px', marginBottom: '0.4rem' }} />
          <div style={{ height: '0.875rem', width: '55%', background: 'var(--bg-secondary)', borderRadius: '4px' }} />
        </div>
      ))}
    </main>
  )
}
