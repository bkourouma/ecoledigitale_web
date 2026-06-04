<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan:

- Active feature: `specs/002-hub-ressources/`
- Plan: [specs/002-hub-ressources/plan.md](specs/002-hub-ressources/plan.md)
- Spec: [specs/002-hub-ressources/spec.md](specs/002-hub-ressources/spec.md)
- Research (Phase 0): [specs/002-hub-ressources/research.md](specs/002-hub-ressources/research.md)
- Data model (Phase 1): [specs/002-hub-ressources/data-model.md](specs/002-hub-ressources/data-model.md)
- Contracts (Phase 1): [specs/002-hub-ressources/contracts/](specs/002-hub-ressources/contracts/)
- Quickstart (Phase 1): [specs/002-hub-ressources/quickstart.md](specs/002-hub-ressources/quickstart.md)

Previous feature: `specs/001-site-marketing/` (site marketing MVP — livré, base technique du projet).

Stack résumé : Next.js 15 (App Router) + TypeScript + Tailwind CSS 4 + MDX,
Resend (email), Plausible (analytics), Vercel (hosting). Application standalone.

Sprint 1 SEO technique (mai 2026) livré entre la feature 001 et la 002 :
helpers `lib/seo/jsonld.ts` (Organization, WebSite, BreadcrumbList, Course, FAQPage, Article),
composant `components/seo/JsonLd.tsx`, icônes natives `app/icon.tsx`/`app/apple-icon.tsx`/`app/manifest.ts`.
<!-- SPECKIT END -->
