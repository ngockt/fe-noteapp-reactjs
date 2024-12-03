import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Mermaid from './Mermaid';

const HomePage = () => {
  const [notes] = useState([
    { id: 1, content: 'This is a sample note. $E = mc^2$' },
    { id: 2, content: '# Hello World\nThis is another note with **markdown**.' },
    {
      id: 3,
      content: '```mermaid\ngraph TD;\nA-->B;\nB-->C;\nC-->D;\n```',
    },
  ]);

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      if (match && match[1] === 'mermaid') {
        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
      }
      return <code className={className} {...props}>{children}</code>;
    },
  };

  return (
    <div>
      <h1>View Notes</h1>
      {notes.map((note) => (
        <div key={note.id} style={{ marginBottom: '20px', padding: '10px', border: '1px solid #ccc' }}>
          <ReactMarkdown
            components={MarkdownComponents}
            children={note.content}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
          />
          <Link to={`/edit/${note.id}`}>Edit Note</Link>
        </div>
      ))}
    </div>
  );
};

export default HomePage;
