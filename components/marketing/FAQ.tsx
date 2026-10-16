import Link from 'next/link';
import { FaqAccordion } from '@/components/marketing/FaqAccordion';
import { Reveal } from '@/components/ui/Reveal';
import { HOME_FAQ, type FaqEntry } from '@/lib/marketing/faq';

const LINK_CLASS =
  'text-primary-700 hover:bg-marker-soft font-bold underline decoration-2 underline-offset-4';

/** Réponse en texte brut, avec l'expression `link.phrase` rendue comme un lien. */
function renderAnswer({ answer, link }: FaqEntry): React.ReactNode {
  if (!link) return answer;
  const index = answer.indexOf(link.phrase);
  if (index === -1) return answer;
  return (
    <>
      {answer.slice(0, index)}
      <Link href={link.href} className={LINK_CLASS}>
        {link.phrase}
      </Link>
      {answer.slice(index + link.phrase.length)}
    </>
  );
}

export function FAQ() {
  return (
    <section aria-labelledby="faq-heading" className="container-wide py-16 md:py-20">
      <Reveal className="max-w-2xl">
        <h2 id="faq-heading" className="font-display text-display-sm text-primary-800 font-bold">
          Les réponses aux <span className="marker">questions</span> des directeurs
        </h2>
        <p className="text-ink-muted mt-3 text-lg leading-relaxed">
          Pas la réponse à votre question ? Posez-la directement à notre équipe via le formulaire de
          démonstration.
        </p>
      </Reveal>

      <FaqAccordion
        items={HOME_FAQ.map((entry) => ({
          question: entry.question,
          answer: renderAnswer(entry),
        }))}
      />
    </section>
  );
}
