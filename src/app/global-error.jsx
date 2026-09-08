'use client';

import { useEffect } from 'react';

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error('Global application error:', error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 16px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #F4F2FF 100%)',
          }}
        >
          <div style={{ maxWidth: '480px', width: '100%', textAlign: 'center' }}>
            <div
              style={{
                margin: '0 auto 20px',
                height: '72px',
                width: '72px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '9999px',
                background: 'rgba(239,68,68,0.1)',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <h1 style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.02em', color: '#000', margin: 0 }}>
              Something Went Wrong
            </h1>
            <p style={{ marginTop: '10px', fontSize: '14px', lineHeight: 1.6, color: '#666' }}>
              A critical error occurred. Please try reloading the page.
            </p>

            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: '28px',
                borderRadius: '14px',
                border: 'none',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #6C63FF 0%, #8B83FF 100%)',
                padding: '13px 28px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#fff',
                boxShadow: '0 10px 24px rgba(108,99,255,0.22)',
              }}
            >
              Reload Page
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
