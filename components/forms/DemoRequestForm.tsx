'use client';

import { useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LeadSchema, type Lead } from '@/lib/leads/lead.schema';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { FormField } from '@/components/forms/FormField';
import { ModuleMultiSelect, type ModuleOption } from '@/components/forms/ModuleMultiSelect';
import { ContactChannels } from '@/components/marketing/ContactChannels';
import { track } from '@/lib/analytics/track';

const MODULE_OPTIONS: ModuleOption[] = [
  { slug: 'socle-ecoledigitale', label: 'Socle EcoleDigitale', description: 'Module de base' },
  { slug: 'parcours-bts', label: 'Parcours BTS', description: 'Cycle BTS' },
  {
    slug: 'parcours-superieur',
    label: 'Parcours Supérieur',
    description: 'Post-BTS, bachelors, masters',
  },
  { slug: 'proformation', label: 'ProFormation', description: 'Formation professionnelle' },
  { slug: 'campus-live', label: 'Campus Live', description: 'Cours en direct & hybride' },
];

const GOOGLE_APPS_SCRIPT_ENDPOINT = process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL?.trim();
const DEMO_FORM_ENDPOINT = GOOGLE_APPS_SCRIPT_ENDPOINT || '/api/leads';

type FormValues = Lead & { website?: string };

type SubmissionState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; correlationId: string }
  | { kind: 'error'; message: string };

export function DemoRequestForm() {
  const router = useRouter();
  const pathname = usePathname() || '/demander-demo';
  const [state, setState] = useState<SubmissionState>({ kind: 'idle' });
  // Verrou synchrone : deux clics rapprochés se produisent avant que React ne
  // désactive le bouton, l'état seul ne suffit donc pas à éviter un double envoi.
  const sendingRef = useRef(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(LeadSchema),
    defaultValues: {
      modulesOfInterest: [],
      consent: undefined as unknown as true,
      sourcePage: pathname,
    },
    mode: 'onSubmit',
  });

  const onSubmit = handleSubmit(
    async (values) => {
      if (sendingRef.current) return;
      sendingRef.current = true;
      setState({ kind: 'submitting' });

      try {
        const response = await fetch(DEMO_FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8', Accept: 'application/json' },
          body: JSON.stringify({ ...values, sourcePage: pathname }),
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok && data.ok) {
          track('Demo Form Submitted', {
            modulesCount: values.modulesOfInterest.length,
            hasMessage: Boolean(values.message),
            hasStudentCount: Boolean(values.studentCount),
            sourcePage: pathname,
          });
          setState({ kind: 'success', correlationId: data.id });
          router.push('/demander-demo/merci');
          return;
        }

        sendingRef.current = false;
        const reason =
          response.status === 429 ? 'rate_limit' : response.status >= 500 ? 'server' : 'validation';
        track('Demo Form Submission Failed', { reason, sourcePage: pathname });
        setState({
          kind: 'error',
          message:
            data?.message ??
            (response.status === 429
              ? 'Trop de tentatives. Réessayez dans quelques minutes ou contactez-nous directement.'
              : 'Une erreur technique nous empêche de transmettre votre demande. Réessayez ou contactez-nous par WhatsApp / email.'),
        });
      } catch {
        sendingRef.current = false;
        track('Demo Form Submission Failed', { reason: 'network', sourcePage: pathname });
        setState({
          kind: 'error',
          message:
            'Connexion impossible. Vérifiez votre réseau ou contactez-nous par WhatsApp / email.',
        });
      }
    },
    () => {
      track('Demo Form Submission Failed', { reason: 'validation', sourcePage: pathname });
    },
  );

  const formError = state.kind === 'error' ? state.message : null;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6" data-testid="demo-form">
      {/* Honeypot — masqué visuellement et aux lecteurs d'écran */}
      <div
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
        style={{ left: '-9999px' }}
      >
        <label>
          Ne pas remplir
          <input tabIndex={-1} autoComplete="off" {...register('website')} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="fullName" label="Nom complet" required error={errors.fullName?.message}>
          <Input
            id="fullName"
            autoComplete="name"
            invalid={Boolean(errors.fullName)}
            {...register('fullName')}
          />
        </FormField>

        <FormField id="role" label="Votre rôle" required error={errors.role?.message}>
          <Input
            id="role"
            placeholder="Directeur, responsable BTS…"
            invalid={Boolean(errors.role)}
            {...register('role')}
          />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField id="email" label="Email professionnel" required error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            invalid={Boolean(errors.email)}
            {...register('email')}
          />
        </FormField>

        <FormField id="phone" label="Téléphone" required error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            invalid={Boolean(errors.phone)}
            {...register('phone')}
          />
        </FormField>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <FormField
          id="institutionName"
          label="Nom de l'établissement"
          required
          error={errors.institutionName?.message}
        >
          <Input
            id="institutionName"
            autoComplete="organization"
            invalid={Boolean(errors.institutionName)}
            {...register('institutionName')}
          />
        </FormField>

        <FormField id="location" label="Ville et pays" required error={errors.location?.message}>
          <Input
            id="location"
            placeholder="Abidjan, Côte d'Ivoire"
            invalid={Boolean(errors.location)}
            {...register('location')}
          />
        </FormField>
      </div>

      {/*
        Champ de type "groupe" : ModuleMultiSelect rend un <fieldset>/<legend>
        accessible et chaque case a son propre <label>. On désactive donc
        label-has-associated-control — la règle ne peut pas tracer le contrôle
        à travers le render prop de <Controller> (faux positif).
      */}
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <FormField
        id="modulesOfInterest"
        label="Modules qui vous intéressent"
        required
        as="group"
        error={errors.modulesOfInterest?.message as string | undefined}
      >
        <Controller
          control={control}
          name="modulesOfInterest"
          render={({ field, fieldState }) => (
            <ModuleMultiSelect
              options={MODULE_OPTIONS}
              value={field.value}
              onChange={field.onChange}
              invalid={Boolean(fieldState.error)}
              errorId={fieldState.error ? 'modulesOfInterest-error' : undefined}
              sourcePage={pathname}
            />
          )}
        />
      </FormField>

      <details className="border-line bg-surface-subtle rounded-md border p-4">
        <summary className="text-ink cursor-pointer text-sm font-medium">
          Informations optionnelles
        </summary>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField
            id="studentCount"
            label="Nombre d'étudiants ou apprenants"
            error={errors.studentCount?.message}
          >
            <Input
              id="studentCount"
              type="number"
              inputMode="numeric"
              min={1}
              max={999999}
              invalid={Boolean(errors.studentCount)}
              {...register('studentCount', {
                // Champ optionnel : vide => absent (et non NaN, que le schéma refuserait).
                setValueAs: (value: string) =>
                  value === '' || Number.isNaN(Number(value)) ? undefined : Number(value),
              })}
            />
          </FormField>

          <FormField
            id="institutionType"
            label="Type d'établissement"
            error={errors.institutionType?.message}
          >
            <Input
              id="institutionType"
              placeholder="Institut privé post-bac, centre de formation…"
              invalid={Boolean(errors.institutionType)}
              {...register('institutionType')}
            />
          </FormField>

          <FormField id="preferredChannel" label="Canal de contact préféré">
            <Select
              id="preferredChannel"
              {...register('preferredChannel', {
                // « Aucune préférence » (valeur vide) => absent, le schéma n'accepte que les trois canaux.
                setValueAs: (value: string) => value || undefined,
              })}
            >
              <option value="">— Aucune préférence —</option>
              <option value="email">Email</option>
              <option value="phone">Téléphone</option>
              <option value="whatsapp">WhatsApp</option>
            </Select>
          </FormField>

          <FormField id="message" label="Votre message" className="md:col-span-2">
            <Textarea
              id="message"
              rows={4}
              maxLength={2000}
              invalid={Boolean(errors.message)}
              {...register('message')}
            />
          </FormField>
        </div>
      </details>

      <FormField id="consent" label="" error={errors.consent?.message as string | undefined}>
        <label className="flex items-start gap-3">
          <Checkbox id="consent" invalid={Boolean(errors.consent)} {...register('consent')} />
          <span className="text-ink-muted text-sm">
            J'accepte d'être recontacté(e) par l'équipe EcoleDigitale au sujet de ma demande de
            démonstration. Voir notre{' '}
            <a
              href="/confidentialite"
              className="text-brand-700 font-medium underline-offset-4 hover:underline"
            >
              politique de confidentialité
            </a>
            .
          </span>
        </label>
      </FormField>

      {formError && (
        <div
          role="alert"
          className="rounded-md border border-red-300 bg-red-50 p-4 text-sm text-red-800"
        >
          <p>{formError}</p>
          <div className="mt-3">
            <ContactChannels placement="inline" />
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting || state.kind === 'submitting' || state.kind === 'success'}
        >
          {state.kind === 'submitting' ? 'Envoi en cours…' : 'Envoyer ma demande'}
        </Button>
        <p className="text-ink-soft text-xs">Réponse de notre équipe sous 48 heures ouvrées.</p>
      </div>
    </form>
  );
}
