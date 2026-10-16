import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';

interface Step {
  index: number;
  title: string;
  description: string;
  duration: string;
}

const STEPS: Step[] = [
  {
    index: 1,
    title: 'Échange de qualification',
    description:
      'Un conseiller analyse votre contexte avec vous : cycles accueillis, packs pertinents, contraintes spécifiques. Nous validons ensemble la configuration cible.',
    duration: '30 minutes',
  },
  {
    index: 2,
    title: 'Configuration et import',
    description:
      'Nous paramétrons votre instance EcoleDigitale, importons vos données existantes (élèves, classes, programmes) et formons vos équipes clés.',
    duration: '1 à 3 semaines',
  },
  {
    index: 3,
    title: 'Lancement et suivi',
    description:
      'Vos équipes utilisent la plateforme au quotidien. Notre support reste accessible et nous activons de nouveaux packs au fil de vos besoins.',
    duration: 'Continu',
  },
];

export function HowItWorks() {
  return (
    <section aria-labelledby="steps-heading" className="container-wide py-16 md:py-20">
      <Reveal className="max-w-2xl">
        <h2 id="steps-heading" className="font-display text-display-sm text-primary-800 font-bold">
          De la première discussion à la <span className="marker">mise en service</span>
        </h2>
        <p className="text-ink-muted mt-3 text-lg leading-relaxed">
          Un parcours simple en trois étapes. Vous ne vous engagez qu&apos;après avoir validé la
          configuration cible avec notre équipe.
        </p>
      </Reveal>

      <RevealGroup className="mt-14 grid gap-12 md:grid-cols-3 md:gap-8">
        {STEPS.map(({ index, title, description, duration }) => (
          <RevealItem key={index}>
            <article className="relative h-full">
              <p
                aria-hidden="true"
                className="font-display text-primary-200 text-8xl leading-[0.85] font-bold"
              >
                {index}
              </p>
              <h3 className="font-display text-primary-800 mt-1 text-3xl leading-none font-bold">
                {title}
              </h3>
              <p className="text-ink-muted mt-3 text-base leading-relaxed">{description}</p>
              <p className="red-note mt-4 inline-block text-xl">{duration}</p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
