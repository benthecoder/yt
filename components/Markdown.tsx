import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import remarkToc from 'remark-toc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
interface MarkdownProps {
  content: string;
}

const Markdown = ({ content }: MarkdownProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[[remarkGfm, { singleTilde: false }], [remarkToc]]}
      // @ts-expect-error
      rehypePlugins={[rehypeRaw, rehypeSlug, rehypeAutolinkHeadings]}
      components={{
        a: ({ node, ...props }) => (
          <a
            href={props.href}
            {...props}
            className="text-blue-500 hover:underline"
          />
        ),
        h1: ({ node, ...props }) => (
          <h1 {...props} className="text-3xl font-bold mt-8 mb-4" />
        ),
        h2: ({ node, ...props }) => (
          <h2 {...props} className="text-2xl font-bold mt-6 mb-4" />
        ),
        h3: ({ node, ...props }) => (
          <h3 {...props} className="text-xl font-bold mt-4 mb-2" />
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
