import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './i18n/i18n';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050505',
        color: '#FFD700',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: '1.2rem',
        letterSpacing: '0.15em',
      }}>
        <span style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
          INITIALIZING_SECURE_SESSION...
        </span>
      </div>
    }>
      <App />
    </Suspense>
  </React.StrictMode>
);
