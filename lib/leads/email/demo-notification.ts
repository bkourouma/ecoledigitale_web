import type { Lead } from '@/lib/leads/lead.schema';
import type { ModuleSlug } from '@/lib/content/module.schema';

const MODULE_LABELS: Record<ModuleSlug, string> = {
  'socle-ecoledigitale': 'Socle EcoleDigitale',
  'parcours-bts': 'Parcours BTS',
  'parcours-superieur': 'Parcours Supérieur',
  proformation: 'ProFormation',
  'campus-live': 'Campus Live',
};

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

/**
 * Construit l'email de notification d'un nouveau lead.
 * Sujet : "[Demo] {institution} — {modules}"
 */
export function renderDemoNotification(lead: Lead, correlationId: string): RenderedEmail {
  return {
    subject: buildSubject(lead),
    html: buildHtml(lead, correlationId),
    text: buildText(lead, correlationId),
  };
}

function buildSubject(lead: Lead): string {
  const modules = lead.modulesOfInterest.map((slug) => MODULE_LABELS[slug]).join(' + ');
  return `[Demo] ${lead.institutionName} — ${modules}`;
}

function buildText(lead: Lead, correlationId: string): string {
  const lines = [
    `Nouvelle demande de démonstration — EcoleDigitale`,
    ``,
    `Établissement : ${lead.institutionName}`,
    `Rôle : ${lead.role}`,
    `Localisation : ${lead.location}`,
    ``,
    `Contact :`,
    `  ${lead.fullName}`,
    `  ${lead.email}`,
    `  ${lead.phone}`,
    ``,
    `Modules d'intérêt :`,
    ...lead.modulesOfInterest.map((slug) => `  • ${MODULE_LABELS[slug]}`),
    ``,
  ];

  if (lead.studentCount) lines.push(`Taille : ${lead.studentCount} étudiants/apprenants`);
  if (lead.institutionType) lines.push(`Type : ${lead.institutionType}`);
  if (lead.preferredChannel) lines.push(`Canal préféré : ${lead.preferredChannel}`);
  if (lead.message) lines.push(``, `Message :`, lead.message);

  lines.push(``, `---`, `Source : ${lead.sourcePage}`, `ID corrélation : ${correlationId}`);
  return lines.join('\n');
}

function buildHtml(lead: Lead, correlationId: string): string {
  const modulesList = lead.modulesOfInterest
    .map((slug) => `<li>${escapeHtml(MODULE_LABELS[slug])}</li>`)
    .join('');

  const optionalRows: string[] = [];
  if (lead.studentCount) optionalRows.push(row('Taille', String(lead.studentCount)));
  if (lead.institutionType) optionalRows.push(row('Type d’établissement', lead.institutionType));
  if (lead.preferredChannel) optionalRows.push(row('Canal préféré', lead.preferredChannel));

  const messageBlock = lead.message
    ? `<h3 style="font:600 14px/1.4 sans-serif;color:#0f172a;margin:24px 0 8px;">Message</h3>
       <p style="font:14px/1.6 sans-serif;color:#334155;white-space:pre-wrap;">${escapeHtml(lead.message)}</p>`
    : '';

  return `<!doctype html>
<html lang="fr">
  <body style="margin:0;padding:24px;background:#f8fafc;font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#0f172a;">
    <div style="max-width:640px;margin:0 auto;background:#fff;border-radius:8px;padding:32px;box-shadow:0 1px 4px rgba(15,23,42,0.06);">
      <h1 style="font:600 20px/1.3 sans-serif;color:#0f172a;margin:0 0 8px;">Nouvelle demande de démonstration</h1>
      <p style="font:14px/1.5 sans-serif;color:#475569;margin:0 0 24px;">Reçue via le site marketing EcoleDigitale.</p>

      <table style="width:100%;border-collapse:collapse;">
        ${row('Établissement', lead.institutionName)}
        ${row('Rôle', lead.role)}
        ${row('Localisation', lead.location)}
        ${row('Nom', lead.fullName)}
        ${row('Email', lead.email)}
        ${row('Téléphone', lead.phone)}
        ${optionalRows.join('')}
      </table>

      <h3 style="font:600 14px/1.4 sans-serif;color:#0f172a;margin:24px 0 8px;">Modules d’intérêt</h3>
      <ul style="font:14px/1.6 sans-serif;color:#334155;margin:0;padding-left:20px;">${modulesList}</ul>

      ${messageBlock}

      <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0 16px;" />
      <p style="font:12px/1.5 sans-serif;color:#94a3b8;margin:0;">
        Source : <code>${escapeHtml(lead.sourcePage)}</code><br />
        ID corrélation : <code>${escapeHtml(correlationId)}</code>
      </p>
    </div>
  </body>
</html>`;
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="font:600 13px/1.5 sans-serif;color:#64748b;padding:6px 12px 6px 0;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
    <td style="font:14px/1.5 sans-serif;color:#0f172a;padding:6px 0;">${escapeHtml(value)}</td>
  </tr>`;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
