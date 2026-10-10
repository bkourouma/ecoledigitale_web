'use client';

import { Mail, Phone, MessageCircle } from 'lucide-react';
import { track } from '@/lib/analytics/track';
import type { ContactPlacement } from '@/lib/analytics/events';
import { cn } from '@/lib/ui/cn';

export interface ContactChannelsProps {
  placement: ContactPlacement;
  className?: string;
  variant?: 'inline' | 'stacked';
}

/**
 * Liens vers les canaux de contact alternatifs (FR-017).
 * Émet `Contact Channel Clicked` sur chaque clic.
 */
export function ContactChannels({
  placement,
  className,
  variant = 'inline',
}: ContactChannelsProps) {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
  const phone = process.env.NEXT_PUBLIC_CONTACT_PHONE;
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  if (!email && !phone && !whatsapp) return null;

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
      {whatsapp && (
        <li>
          <a
            href={`https://wa.me/${whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClick('whatsapp')}
            className="text-ink-muted hover:text-ink inline-flex items-center gap-2 decoration-2 underline-offset-4 hover:underline"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>WhatsApp</span>
          </a>
        </li>
      )}
      {email && (
        <li>
          <a
            href={`mailto:${email}`}
            onClick={onClick('email')}
            className="text-ink-muted hover:text-ink inline-flex items-center gap-2 decoration-2 underline-offset-4 hover:underline"
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            <span>{email}</span>
          </a>
        </li>
      )}
      {phone && (
        <li>
          <a
            href={`tel:${phone.replace(/\s+/g, '')}`}
            onClick={onClick('phone')}
            className="text-ink-muted hover:text-ink inline-flex items-center gap-2 decoration-2 underline-offset-4 hover:underline"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            <span>{phone}</span>
          </a>
        </li>
      )}
    </ul>
  );
}
