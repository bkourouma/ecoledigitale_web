import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#1f2d7a',
        color: '#ffe45c',
        fontSize: 22,
        fontWeight: 700,
        fontFamily: 'system-ui, -apple-system, "Segoe UI", sans-serif',
        letterSpacing: '-0.02em',
        borderRadius: 6,
      }}
    >
      E
    </div>,
    { ...size },
  );
}
