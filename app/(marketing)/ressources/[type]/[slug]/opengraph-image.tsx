import { ImageResponse } from 'next/og';
import { ResourceTypeSchema, RESOURCE_TYPE_LABELS } from '@/lib/content/resource.schema';
import { getResourceBySlug } from '@/lib/content/resources';
import { getAuthor } from '@/lib/content/authors';

export const runtime = 'nodejs';

export const alt = 'Ressource EcoleDigitale';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function ResourceOpengraphImage({
  params,
}: {
  params: { type: string; slug: string };
}) {
  const parsedType = ResourceTypeSchema.safeParse(params.type);
  const bundle = parsedType.success ? getResourceBySlug(parsedType.data, params.slug) : undefined;

  if (!bundle) {
    return renderImage('Ressource', 'EcoleDigitale', 'ecoledigitale.com');
  }

  const { frontmatter } = bundle;
  const badge = RESOURCE_TYPE_LABELS[frontmatter.type].singular;
  const title = frontmatter.type === 'glossaire' ? frontmatter.term : frontmatter.title;
  const author = getAuthor(frontmatter.author);
  const footer = author?.frontmatter.name ?? 'ecoledigitale.com';

  return renderImage(badge, title, footer);
}

function renderImage(badge: string, title: string, footer: string) {
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
            background: 'rgba(255,255,255,0.18)',
            color: '#ffffff',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          {badge}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          fontSize: 64,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          maxWidth: 1000,
        }}
      >
        {title}
      </div>

      <div style={{ fontSize: 22, color: '#ffe45c' }}>{footer}</div>
    </div>,
    { ...size },
  );
}
