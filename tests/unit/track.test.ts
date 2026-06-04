import { describe, it, expect, beforeEach, vi } from 'vitest';
import { track } from '@/lib/analytics/track';

declare global {
  // eslint-disable-next-line no-var
  var __plausibleSpy: ReturnType<typeof vi.fn> | undefined;
}

describe('track()', () => {
  beforeEach(() => {
    globalThis.__plausibleSpy = undefined;
    delete (window as unknown as { plausible?: unknown }).plausible;
  });

  it("no-op si window.plausible n'est pas défini", () => {
    expect(() =>
      track('Demo CTA Clicked', { placement: 'hero', sourcePage: '/' }),
    ).not.toThrow();
  });

  it('appelle window.plausible avec event + props', () => {
    const spy = vi.fn();
    (window as unknown as { plausible: typeof spy }).plausible = spy;

    track('Demo CTA Clicked', { placement: 'hero', sourcePage: '/' });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Demo CTA Clicked', {
      props: { placement: 'hero', sourcePage: '/' },
    });
  });

  it('transmet les propriétés numériques et booléennes', () => {
    const spy = vi.fn();
    (window as unknown as { plausible: typeof spy }).plausible = spy;

    track('Demo Form Submitted', {
      modulesCount: 3,
      hasMessage: true,
      hasStudentCount: false,
      sourcePage: '/demander-demo',
    });

    expect(spy).toHaveBeenCalledWith('Demo Form Submitted', {
      props: {
        modulesCount: 3,
        hasMessage: true,
        hasStudentCount: false,
        sourcePage: '/demander-demo',
      },
    });
  });

  it('ignore si window.plausible est défini mais non fonction', () => {
    (window as unknown as { plausible: unknown }).plausible = 'not-a-function';
    expect(() =>
      track('Modules CTA Clicked', { placement: 'hero', sourcePage: '/' }),
    ).not.toThrow();
  });

  it("transmet un moduleSlug pour Module Page Viewed", () => {
    const spy = vi.fn();
    (window as unknown as { plausible: typeof spy }).plausible = spy;

    track('Module Page Viewed', { moduleSlug: 'parcours-bts' });

    expect(spy).toHaveBeenCalledWith('Module Page Viewed', {
      props: { moduleSlug: 'parcours-bts' },
    });
  });

  it('transmet un canal pour Contact Channel Clicked', () => {
    const spy = vi.fn();
    (window as unknown as { plausible: typeof spy }).plausible = spy;

    track('Contact Channel Clicked', {
      channel: 'whatsapp',
      placement: 'footer',
      sourcePage: '/',
    });

    expect(spy).toHaveBeenCalledWith('Contact Channel Clicked', {
      props: { channel: 'whatsapp', placement: 'footer', sourcePage: '/' },
    });
  });
});
