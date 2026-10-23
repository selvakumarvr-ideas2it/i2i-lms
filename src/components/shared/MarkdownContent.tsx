import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

export function MarkdownContent({ markdown, className }: { markdown: string; className?: string }) {
  return (
    <div className={cn('prose-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: (props) => <h1 className="mb-4 mt-8 text-2xl font-bold text-ink first:mt-0" {...props} />,
          h2: (props) => <h2 className="mb-3 mt-7 text-xl font-bold text-ink first:mt-0" {...props} />,
          h3: (props) => <h3 className="mb-2 mt-5 text-base font-semibold text-ink" {...props} />,
          p: (props) => <p className="mb-4 text-sm leading-relaxed text-ink/90" {...props} />,
          ul: (props) => <ul className="mb-4 list-disc space-y-1.5 pl-5 text-sm text-ink/90" {...props} />,
          ol: (props) => <ol className="mb-4 list-decimal space-y-1.5 pl-5 text-sm text-ink/90" {...props} />,
          a: (props) => <a className="font-medium text-brand-600 underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />,
          img: ({ alt, ...props }) => (
            <img className="my-4 w-full rounded-lg border border-line" loading="lazy" alt={alt ?? ''} {...props} />
          ),
          blockquote: (props) => (
            <blockquote
              className="my-4 rounded-r-lg border-l-4 border-brand-400 bg-brand-50 px-4 py-3 text-sm text-brand-900 [&_p]:mb-0"
              {...props}
            />
          ),
          table: (props) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-line">
              <table className="w-full border-collapse text-sm" {...props} />
            </div>
          ),
          thead: (props) => <thead className="bg-slate-50 text-left text-xs font-semibold uppercase text-muted" {...props} />,
          th: (props) => <th className="border-b border-line px-3 py-2" {...props} />,
          td: (props) => <td className="border-b border-line px-3 py-2 align-top" {...props} />,
          code: ({ className: codeClassName, children, ...props }) => {
            const isBlock = /language-/.test(codeClassName ?? '')
            if (!isBlock) {
              return (
                <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-brand-700" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={cn(codeClassName, 'font-mono text-[13px]')} {...props}>
                {children}
              </code>
            )
          },
          pre: (props) => <pre className="my-4 overflow-x-auto rounded-lg bg-navy p-4 text-slate-100" {...props} />,
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
