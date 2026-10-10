import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

export const alt = 'EcoleDigitale — Plateforme de gestion d’établissements de formation';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Image Open Graph par défaut, utilisée pour toutes les routes qui n'ont
 * pas leur propre `opengraph-image.tsx`.
 */
export default function OpengraphImage() {
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
            width: 56,
            height: 56,
            borderRadius: 16,
            background: '#ffffff',
            color: '#1f2d7a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 32,
            fontWeight: 700,
          }}
        >
          E
        </div>
        <div style={{ fontSize: 28, fontWeight: 600 }}>EcoleDigitale</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            fontSize: 60,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: 980,
          }}
        >
          Plateforme de gestion d&apos;établissements de formation
        </div>
        <div style={{ fontSize: 28, color: '#ffe45c', fontWeight: 400, lineHeight: 1.4 }}>
          Académique · Pédagogique · Financier · Formation pro
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          fontSize: 22,
          color: '#ffe45c',
        }}
      >
        <span>5 modules</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>Multi-établissement</span>
        <span style={{ opacity: 0.5 }}>·</span>
        <span>Espaces dédiés par profil</span>
      </div>
    </div>,
    { ...size },
  );
}
