import { ImageResponse } from 'next/og';
import { getAuthor } from '@/lib/content/authors';
import { getSiteHost } from '@/lib/seo/site';

export const runtime = 'nodejs';

export const alt = 'Auteur EcoleDigitale';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function AuthorOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = getAuthor(slug);
  const name = author?.frontmatter.name ?? 'Auteur EcoleDigitale';
  const role = author?.frontmatter.role ?? 'Rédaction EcoleDigitale';

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

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            fontSize: 20,
            color: '#ffe45c',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}
        >
          Auteur
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            maxWidth: 1000,
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: 28, color: '#ffe45c', fontWeight: 400, maxWidth: 1000 }}>
          {role}
        </div>
      </div>

      <div style={{ fontSize: 22, color: '#ffe45c' }}>{getSiteHost()}</div>
    </div>,
    { ...size },
  );
}
