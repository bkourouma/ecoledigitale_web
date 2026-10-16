'use client';

import { Mail, Phone, MessageCircle } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import type { ContactPlacement } from '@/lib/analytics/events';
import { cn } from '@/lib/ui/cn';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
  CONTACT_WHATSAPP_NUMBER,
} from '@/lib/site/contact';

export interface ContactChannelsProps {
  placement: ContactPlacement;
  className?: string;
  variant?: 'inline' | 'stacked';
}

/**
 * Liens vers les canaux de contact alternatifs (FR-017) : WhatsApp, e-mail et téléphone.
 * Les coordonnées viennent de `lib/site/contact.ts`.
 * Émet `Contact Channel Clicked` sur chaque clic.
 */
export function ContactChannels({
  placement,
  className,
  variant = 'inline',
}: ContactChannelsProps) {
  const onClick = (channel: 'whatsapp' | 'email' | 'phone') => () => {
    track('Contact Channel Clicked', {
      channel,
      placement,
      sourcePage: typeof window !== 'undefined' ? window.location.pathname : '/',
    });
  };

  return (
    <ul
      className={cn(
        'flex gap-4 text-base',
        variant === 'stacked' ? 'flex-col' : 'flex-wrap items-center',
        className,
      )}
    >
      <li>
        <a
          href={`https://wa.me/${CONTACT_WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick('whatsapp')}
          className="text-ink-muted hover:text-ink inline-flex items-center gap-2 decoration-2 underline-offset-4 hover:underline"
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
          <span>WhatsApp</span>
        </a>
      </li>
      <li>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          onClick={onClick('email')}
          className="text-ink-muted hover:text-ink inline-flex items-center gap-2 decoration-2 underline-offset-4 hover:underline"
        >
          <Mail className="h-4 w-4" aria-hidden="true" />
          <span>{CONTACT_EMAIL}</span>
        </a>
      </li>
      <li>
        <a
          href={`tel:${CONTACT_PHONE_E164}`}
          onClick={onClick('phone')}
          className="text-ink-muted hover:text-ink inline-flex items-center gap-2 decoration-2 underline-offset-4 hover:underline"
        >
          <Phone className="h-4 w-4" aria-hidden="true" />
          <span>{CONTACT_PHONE_DISPLAY}</span>
        </a>
      </li>
    </ul>
  );
}
