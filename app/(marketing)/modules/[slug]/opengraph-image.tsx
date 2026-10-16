import { ImageResponse } from 'next/og';
import { ModuleSlugSchema } from '@/lib/content/module.schema';
import { getModuleBySlug } from '@/lib/content/modules';
import { getSiteHost } from '@/lib/seo/site';

export const runtime = 'nodejs';

export const alt = 'Pack EcoleDigitale';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function ModuleOpengraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsedSlug = ModuleSlugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    return defaultImage('EcoleDigitale', 'Logiciel de gestion scolaire');
  }

  const { frontmatter } = getModuleBySlug(parsedSlug.data);

  return defaultImage(frontmatter.name, frontmatter.tagline, frontmatter.type === 'socle');
}

function defaultImage(title: string, tagline: string, isSocle = false) {
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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

        <div
          style={{
            fontSize: 16,
            padding: '8px 16px',
            borderRadius: 999,
            background: isSocle ? '#ffffff' : 'rgba(255,255,255,0.18)',
            color: isSocle ? '#1f2d7a' : '#ffffff',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {isSocle ? 'Socle commun' : 'Pack'}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#ffe45c',
            fontWeight: 400,
            lineHeight: 1.3,
            maxWidth: 980,
          }}
        >
          {tagline}
        </div>
      </div>

      <div style={{ fontSize: 22, color: '#ffe45c' }}>{getSiteHost()}</div>
    </div>,
    { ...size },
  );
}
