import { describe, it, expect, beforeEach, vi } from 'vitest';
import { track } from '@/lib/analytics/track';

describe('track()', () => {
  beforeEach(() => {
    delete (window as unknown as { umami?: unknown }).umami;
  });

  it("no-op si window.umami n'est pas défini", () => {
    expect(() => track('Demo CTA Clicked', { placement: 'hero', sourcePage: '/' })).not.toThrow();
  });

  it('appelle window.umami.track avec event + propriétés', () => {
    const spy = vi.fn();
    (window as unknown as { umami: { track: typeof spy } }).umami = { track: spy };

    track('Demo CTA Clicked', { placement: 'hero', sourcePage: '/' });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('Demo CTA Clicked', {
      placement: 'hero',
      sourcePage: '/',
    });
  });

  it('transmet les propriétés numériques et booléennes', () => {
    const spy = vi.fn();
    (window as unknown as { umami: { track: typeof spy } }).umami = { track: spy };

    track('Demo Form Submitted', {
      modulesCount: 3,
      hasMessage: true,
      hasStudentCount: false,
      sourcePage: '/demander-demo',
    });

    expect(spy).toHaveBeenCalledWith('Demo Form Submitted', {
      modulesCount: 3,
      hasMessage: true,
      hasStudentCount: false,
      sourcePage: '/demander-demo',
    });
  });

  it('ignore si window.umami est défini mais sans fonction track', () => {
    (window as unknown as { umami: unknown }).umami = { track: 'not-a-function' };
    expect(() =>
      track('Modules CTA Clicked', { placement: 'hero', sourcePage: '/' }),
    ).not.toThrow();
  });

  it('ignore si window.umami est défini mais vide', () => {
    (window as unknown as { umami: unknown }).umami = {};
    expect(() =>
      track('Modules CTA Clicked', { placement: 'hero', sourcePage: '/' }),
    ).not.toThrow();
  });

  it('transmet un moduleSlug pour Module Page Viewed', () => {
    const spy = vi.fn();
    (window as unknown as { umami: { track: typeof spy } }).umami = { track: spy };

    track('Module Page Viewed', { moduleSlug: 'ecoledigitale-higher' });

    expect(spy).toHaveBeenCalledWith('Module Page Viewed', { moduleSlug: 'ecoledigitale-higher' });
  });

  it('transmet un canal pour Contact Channel Clicked', () => {
    const spy = vi.fn();
    (window as unknown as { umami: { track: typeof spy } }).umami = { track: spy };

    track('Contact Channel Clicked', {
      channel: 'whatsapp',
      placement: 'footer',
      sourcePage: '/',
    });

    expect(spy).toHaveBeenCalledWith('Contact Channel Clicked', {
      channel: 'whatsapp',
      placement: 'footer',
      sourcePage: '/',
    });
  });
});
