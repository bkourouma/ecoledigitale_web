import Link from 'next/link';
import { splitInlineLinks } from '@/lib/marketing/inline-links';

const LINK_CLASS =
  'text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4';

/** Texte brut dont les `[libellé](/chemin)` deviennent des liens internes. */
export function InlineText({ text }: { text: string }) {
  return (
    <>
      {splitInlineLinks(text).map((part, index) =>
        part.href ? (
          <Link key={index} href={part.href} className={LINK_CLASS}>
            {part.text}
          </Link>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}
