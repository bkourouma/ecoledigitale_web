import { ImageResponse } from 'next/og';
import { ModuleSlugSchema } from '@/lib/content/module.schema';
import { getModuleBySlug, getAllModuleSlugs } from '@/lib/content/modules';

export const runtime = 'nodejs';

export const alt = 'Module EcoleDigitale';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export function generateImageMetadata() {
  return getAllModuleSlugs().map((slug) => ({
    id: slug,
    alt: `Module EcoleDigitale — ${slug}`,
    size,
    contentType,
  }));
}

export default function ModuleOpengraphImage({ params }: { params: { slug: string } }) {
  const parsedSlug = ModuleSlugSchema.safeParse(params.slug);
  if (!parsedSlug.success) {
    return defaultImage('Module EcoleDigitale', 'Plateforme de gestion d’établissements');
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
          {isSocle ? 'Module socle' : 'Module optionnel'}
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

      <div style={{ fontSize: 22, color: '#ffe45c' }}>ecoledigitale.com</div>
    </div>,
    { ...size },
  );
}
