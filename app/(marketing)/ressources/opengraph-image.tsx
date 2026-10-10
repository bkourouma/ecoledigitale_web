import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const alt = 'Ressources EcoleDigitale — guides, études de cas et glossaire';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function ResourcesHubOpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '80px',
        background: '#1f2d7a',
        color: '#ffffff',
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#ffffff',
            color: '#1f2d7a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 28,
            fontWeight: 700,
          }}
        >
          E
        </div>
        <div style={{ fontSize: 24, fontWeight: 600 }}>EcoleDigitale</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: 1000,
          }}
        >
          Ressources
        </div>
        <div style={{ fontSize: 30, color: '#ffe45c', fontWeight: 400 }}>
          Guides · Études de cas · Glossaire
        </div>
      </div>

      <div style={{ fontSize: 22, color: '#ffe45c' }}>ecoledigitale.com</div>
    </div>,
    { ...size },
  );
}
