import type { MDXComponents } from 'mdx/types';

const proseText = 'max-w-prose text-lg leading-8 text-ink-muted';
const proseLink =
  'font-bold text-primary-700 underline decoration-primary-300 decoration-2 underline-offset-4 transition-colors hover:bg-marker-soft';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children, ...props }) => (
      <h1 className="font-display text-display-md text-primary-800 font-bold" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2
        className="font-display text-primary-800 mt-12 text-4xl leading-none font-bold"
        {...props}
      >
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="font-display text-primary-700 mt-8 text-3xl leading-none font-bold" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }) => (
      <p className={`mt-4 ${proseText}`} {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }) => (
      <ul
        className="text-ink-muted marker:text-pen-500 mt-5 max-w-prose list-disc space-y-2 pl-6"
        {...props}
      >
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol
        className="text-ink-muted marker:text-pen-500 mt-5 max-w-prose list-decimal space-y-2 pl-6"
        {...props}
      >
        {children}
      </ol>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote
        className="border-primary-100 bg-primary-50/70 text-ink-muted mt-6 max-w-prose rounded-md border px-5 py-4 shadow-xs"
        {...props}
      >
        {children}
      </blockquote>
    ),
    code: ({ children, ...props }) => (
      <code
        className="text-ink rounded-md bg-neutral-100 px-1.5 py-0.5 text-sm font-medium"
        {...props}
      >
        {children}
      </code>
    ),
    pre: ({ children, ...props }) => (
      <pre
        className="border-line shadow-card mt-6 max-w-prose overflow-x-auto rounded-md border bg-neutral-950 p-4 text-sm leading-7 text-neutral-100"
        {...props}
      >
        {children}
      </pre>
    ),
    table: ({ children, ...props }) => (
      <div className="border-line shadow-card mt-6 max-w-full overflow-x-auto rounded-md border">
        <table className="min-w-full divide-y divide-neutral-200 bg-white text-sm" {...props}>
          {children}
        </table>
      </div>
    ),
    th: ({ children, ...props }) => (
      <th className="text-ink bg-white/70 px-4 py-3 text-left font-semibold" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="border-line text-ink-muted border-t px-4 py-3" {...props}>
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
