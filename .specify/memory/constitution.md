# EcoleDigitale Web Constitution

## Core Principles

### I. Clarity Before Decoration
Every feature MUST make the EcoleDigitale offer easier to understand for school leaders, academic teams, administrative teams, and training-center operators. Marketing copy, layout, and navigation MUST prioritize scanability, business benefits, and conversion over decorative effects.

### II. Modular Offer Integrity
The five packaged modules MUST remain clear and commercially usable: Socle EcoleDigitale, Parcours BTS, Parcours Superieur, ProFormation, and Campus Live. Any new page, component, or content model that references modules MUST preserve the relationship between the base module and optional advanced modules, and MUST avoid promising functionality that is not represented in the PRD or approved product scope.

### III. Conversion and Lead Quality
The demo request path is the primary product outcome. Important pages MUST expose a clear demo/contact CTA, and form work MUST preserve lead qualification fields: identity, institution, role, location, contact details, modules of interest, institution size when available, and contact consent. Implementations MUST keep future CRM or email integration practical.

### IV. SEO, Accessibility, and Performance Gates
Each public page MUST be planned with readable URLs, SEO title/meta intent, semantic structure, keyboard usability, sufficient contrast, useful alt text for meaningful media, and responsive behavior across mobile, tablet, and desktop. MVP pages SHOULD target Lighthouse mobile performance of at least 85 unless a documented constraint prevents it.

### V. Maintainable Content and Analytics
Marketing content SHOULD be easy to update without deep code changes where the chosen stack permits it. CTA clicks, demo form submissions, module selections, email/WhatsApp clicks, and brochure requests MUST be measurable through the analytics approach selected in the implementation plan.

## Product Scope

The source of truth for the current MVP is `docs/PRD_SITE_MARKETING_ECOLEDIGITALE.md`.

MVP pages:
- Home
- Modules overview
- Socle EcoleDigitale module page
- Parcours BTS module page
- Parcours Superieur module page
- ProFormation module page
- Campus Live module page
- Contact / demo request page

Post-MVP items such as pricing, customer cases, blog/resources, FAQ expansion, security page, support page, public purchase flow, customer portal, full chatbot, and complete multilingual support require explicit specification before implementation.

## UX and Content Standards

The site MUST feel like a modern, serious SaaS experience for education and training organizations. Use simple French, short decision-oriented sections, visible CTAs, role-based benefits, module comparisons, and trustworthy product-oriented visuals or faithful mockups when available.

Do not let visual design obscure the buying decision. Avoid jargon, unsupported claims, and purely decorative layouts that make the offer harder to compare.

## Development Workflow

Spec Kit workflow is the default for new implementation work:
- `$speckit-specify` creates or updates feature requirements.
- `$speckit-clarify` is recommended when PRD questions remain open.
- `$speckit-plan` records stack, architecture, SEO, accessibility, analytics, and integration choices.
- `$speckit-tasks` breaks approved plans into implementation tasks.
- `$speckit-analyze` is recommended before implementation for cross-artifact consistency.
- `$speckit-implement` executes the approved task list.

Plans MUST call out any unanswered PRD questions, especially repository integration, pricing visibility, preferred contact channels, product screenshots, and final brand naming.

## Governance

This constitution overrides ad hoc implementation preferences for this project. Changes require updating this file and documenting why the change improves the EcoleDigitale marketing site outcome. Feature specs and plans MUST cite or comply with the PRD and this constitution before implementation begins.

**Version**: 1.0.0 | **Ratified**: 2026-05-18 | **Last Amended**: 2026-05-18
