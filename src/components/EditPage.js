import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import Mermaid from './Mermaid';

const EditPage = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();

  const [content, setContent] = useState('');

  useEffect(() => {
    // Load the existing content - for simplicity, using mock data.
    if (noteId === '1') {
      setContent('This is a sample note. $E = mc^2$');
    } else if (noteId === '2') {
      setContent('# Hello World\nThis is another note with **markdown**.');
    } else if (noteId === '3') {
      setContent('```mermaid\ngraph TD;\nA-->B;\nB-->C;\nC-->D;\n```');
    }
  }, [noteId]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleSave = () => {
    // Save logic can be added here.
    alert('Note saved!');
    navigate('/');
  };

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
      <h1>Edit Note</h1>
      <textarea
        value={content}
        onChange={handleContentChange}
        rows="10"
        cols="50"
        style={{ display: 'block', width: '100%', marginBottom: '20px' }}
      />
      <button onClick={handleSave}>Save</button>
      <h2>Live Preview</h2>
      <div style={{ border: '1px solid #ccc', padding: '10px' }}>
        <ReactMarkdown
          components={MarkdownComponents}
          children={content}
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        />
      </div>
    </div>
  );
};

export default EditPage;
