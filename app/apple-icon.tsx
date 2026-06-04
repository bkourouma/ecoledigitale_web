import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #102655 0%, #1641b1 60%, #2f81fa 100%)',
          color: '#ffffff',
          fontSize: 110,
          fontWeight: 700,
          fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
          letterSpacing: '-0.02em',
        }}
      >
        E
      </div>
    ),
    { ...size },
  );
}
