import React from 'react';
import GoComfortyQuoteCalculator from '../components/GoComfortyQuoteCalculator';

export default function Home() {
  return (
    <div>
      {/* Header */}
      <header style={{
        background: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <img 
            src="/logo-gocomforty-h.png" 
            alt="GoComforty - Clean Spaces, Comfortable Living" 
            style={{ height: '60px', width: 'auto' }}
          />
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 2rem 2rem',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: '#1f2937',
          marginBottom: '1rem',
          lineHeight: 1.2
        }}>
          Get Your Free Cleaning Quote
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: '#6b7280',
          marginBottom: '2rem',
          maxWidth: '600px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Professional cleaning services for your home, office, or vacation rental in West Knoxville. Instant estimate in less than 2 minutes.
        </p>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          flexWrap: 'wrap',
          marginTop: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00b3b3', fontSize: '0.95rem', fontWeight: 500 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            100% Eco-Friendly
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00b3b3', fontSize: '0.95rem', fontWeight: 500 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Free In-Home Estimate
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#00b3b3', fontSize: '0.95rem', fontWeight: 500 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            No Commitment Required
          </div>
        </div>
      </section>

      {/* Calculator */}
      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 1rem' }}>
        <GoComfortyQuoteCalculator />
      </div>

      {/* Footer */}
      <footer style={{
        background: '#f9fafb',
        borderTop: '1px solid #e5e7eb',
        marginTop: '4rem',
        padding: '2rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', color: '#6b7280', fontSize: '0.875rem' }}>
          <img src="/logo-gocomforty-h.png" alt="GoComforty" style={{ height: '40px', marginBottom: '1rem', opacity: 0.7 }} />
          <p>&copy; 2024 GoComforty. All rights reserved.</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>Serving West Knoxville, TN</p>
        </div>
      </footer>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          background: linear-gradient(135deg, #f0fdfa 0%, #ffffff 50%, #ecfeff 100%);
          min-height: 100vh;
        }
        
        @media (max-width: 768px) {
          h1 {
            font-size: 1.875rem !important;
          }
        }
      `}</style>
    </div>
  );
}
