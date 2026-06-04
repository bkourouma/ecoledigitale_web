import type { ModuleSlug } from '@/lib/content/module.schema';
import type { ResourceType } from '@/lib/content/resource.schema';

export type CtaPlacement = 'header' | 'hero' | 'inline' | 'footer' | 'card';
export type ContactChannel = 'whatsapp' | 'email' | 'phone';
export type ContactPlacement = 'header' | 'footer' | 'inline';
export type SubmissionFailureReason = 'validation' | 'rate_limit' | 'server' | 'network';
export type ResourceCtaTarget = 'demo' | 'module' | 'external';

/**
 * Catalogue typé des événements Plausible.
 * Voir specs/001-site-marketing/contracts/analytics-events.contract.md
 */
export type AnalyticsEventMap = {
  'Demo CTA Clicked': { placement: CtaPlacement; sourcePage: string };
  'Modules CTA Clicked': { placement: 'hero' | 'inline' | 'card'; sourcePage: string };
  'Module Page Viewed': { moduleSlug: ModuleSlug };
  'Module Selected In Form': { moduleSlug: ModuleSlug; sourcePage: string };
  'Demo Form Submitted': {
    modulesCount: number;
    hasMessage: boolean;
    hasStudentCount: boolean;
    sourcePage: string;
  };
  'Demo Form Submission Failed': { reason: SubmissionFailureReason; sourcePage: string };
  'Contact Channel Clicked': {
    channel: ContactChannel;
    placement: ContactPlacement;
    sourcePage: string;
  };
  'Brochure Requested': { sourcePage: string };
  'Resource CTA Clicked': {
    resourceType: ResourceType;
    resourceSlug: string;
    ctaTarget: ResourceCtaTarget;
    sourcePage: string;
  };
};

export type AnalyticsEventName = keyof AnalyticsEventMap;
