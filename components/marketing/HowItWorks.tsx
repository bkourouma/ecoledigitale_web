'use client';

import { ClipboardCheck, MessagesSquare, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/Reveal';

interface Step {
  index: number;
  icon: LucideIcon;
  title: string;
  description: string;
  duration: string;
}

const STEPS: Step[] = [
  {
    index: 1,
    icon: MessagesSquare,
    title: 'Échange de qualification',
    description:
      "Un conseiller analyse votre contexte avec vous : type d'établissement, modules pertinents, contraintes spécifiques. Nous validons ensemble la configuration cible.",
    duration: '30 minutes',
  },
  {
    index: 2,
    icon: ClipboardCheck,
    title: 'Configuration et import',
    description:
      'Nous paramétrons votre instance EcoleDigitale, importons vos données existantes (étudiants, classes, programmes) et formons vos équipes clés.',
    duration: '1 à 3 semaines',
  },
  {
    index: 3,
    icon: Rocket,
    title: 'Lancement et suivi',
    description:
      'Vos équipes utilisent la plateforme au quotidien. Notre support reste accessible et nous activons de nouveaux modules au fil de vos besoins.',
    duration: 'Continu',
  },
];

export function HowItWorks() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="border-y border-neutral-200 bg-neutral-50 py-20 dark:border-white/10 dark:bg-neutral-950">
      <div className="container-wide">
        <Reveal className="max-w-2xl">
          <p className="section-kicker">Comment ça marche</p>
          <h2 className="mt-3 font-display text-display-sm font-semibold text-ink dark:text-white">
            De la première discussion à la mise en service
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-ink-muted dark:text-neutral-300">
            Un parcours simple en trois étapes. Vous ne vous engagez qu'après avoir validé la
            configuration cible avec notre équipe.
          </p>
        </Reveal>

        <div className="relative mt-12">
          {/* Animated connector line — desktop only */}
          {!reduceMotion && (
            <motion.div
              aria-hidden
              className="hidden md:block absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary-300/70 to-transparent dark:via-primary-600/60"
              style={{ top: '3.25rem', transformOrigin: 'center', zIndex: 0 }}
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.4, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.25 }}
            />
          )}

          <RevealGroup className="grid gap-6 md:grid-cols-3 relative" style={{ zIndex: 1 }}>
            {STEPS.map(({ index, icon: Icon, title, description, duration }) => (
              <RevealItem key={index}>
                <article className="relative h-full rounded-2xl border border-neutral-200/80 bg-white p-7 shadow-card dark:border-white/10 dark:bg-white/6">
                  <div className="flex items-start justify-between gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-sm font-bold text-white shadow-xs dark:from-primary-400 dark:to-primary-700">
                      {index}
                    </span>
                    <Icon className="mt-1 h-5 w-5 text-ink-soft dark:text-neutral-400" aria-hidden="true" />
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-ink dark:text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted dark:text-neutral-300">
                    {description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-ink-soft dark:bg-white/8 dark:text-neutral-300">
                    <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                    {duration}
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
