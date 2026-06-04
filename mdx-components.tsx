import type { MDXComponents } from 'mdx/types';

const proseText = 'max-w-prose text-base leading-8 text-ink-muted dark:text-neutral-300';
const proseLink =
  'font-semibold text-primary-700 underline decoration-primary-200 underline-offset-4 transition-colors hover:text-accent-700 hover:decoration-accent-300 dark:text-accent-300 dark:decoration-accent-500/40';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 className="font-display text-display-md font-semibold text-ink dark:text-white" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="mt-12 font-display text-3xl font-semibold text-ink dark:text-white" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mt-8 font-display text-xl font-semibold text-ink dark:text-white" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className={`mt-4 ${proseText}`} {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul className="mt-5 max-w-prose list-disc space-y-2 pl-6 text-ink-muted marker:text-accent-500 dark:text-neutral-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mt-5 max-w-prose list-decimal space-y-2 pl-6 text-ink-muted marker:text-accent-600 dark:text-neutral-300" {...props}>
        {children}
      </ol>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote className="mt-6 max-w-prose rounded-2xl border border-primary-100 bg-primary-50/70 px-5 py-4 text-ink-muted shadow-xs dark:border-primary-300/20 dark:bg-primary-400/10 dark:text-neutral-300" {...props}>
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => (
      <code className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-sm font-medium text-ink dark:bg-white/10 dark:text-neutral-100" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre className="mt-6 max-w-prose overflow-x-auto rounded-2xl border border-neutral-200 bg-neutral-950 p-4 text-sm leading-7 text-neutral-100 shadow-card dark:border-white/10" {...props}>
        {children}
      </pre>
    ),
    table: ({ children, ...props }) => (
      <div className="mt-6 max-w-full overflow-x-auto rounded-2xl border border-neutral-200 shadow-card dark:border-white/10">
        <table className="min-w-full divide-y divide-neutral-200 bg-white text-sm dark:divide-white/10 dark:bg-white/6" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="bg-neutral-50 px-4 py-3 text-left font-semibold text-ink dark:bg-white/8 dark:text-white" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border-t border-neutral-200 px-4 py-3 text-ink-muted dark:border-white/10 dark:text-neutral-300" {...props}>
        {children}
      </td>
    ),
    a: ({ children, ...props }) => (
      <a className={proseLink} {...props}>
        {children}
      </a>
    ),
    ...components,
  };
}
