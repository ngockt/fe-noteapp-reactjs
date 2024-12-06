import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { FiEdit, FiSave, FiArrowLeft } from 'react-icons/fi'; // Icons
import Mermaid from '../components/Core/Mermaid';

const MyFeed = () => {
  const [notes, setNotes] = useState([
    { id: 1, content: 'This is a sample note. $E = mc^2$' },
    { id: 2, content: '# Hello World\nThis is another note with **markdown**.' },
    {
      id: 3,
      content: '```mermaid\ngraph TD;\nA-->B;\nB-->C;\nC-->D;\n```',
    },
  ]);

  const [editingNote, setEditingNote] = useState(null); // Track the note being edited
  const [editContent, setEditContent] = useState(''); // Temporary content for editing

  const MarkdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      if (match && match[1] === 'mermaid') {
        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
      }
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  const handleEdit = (note) => {
    setEditingNote(note.id); // Set the note being edited
    setEditContent(note.content); // Load the content for editing
  };

  const handleSave = () => {
    setNotes(
      notes.map((note) =>
        note.id === editingNote ? { ...note, content: editContent } : note
      )
    );
    setEditingNote(null); // Exit editing mode
    setEditContent('');
  };

  const handleCancel = () => {
    setEditingNote(null); // Exit editing mode without saving
    setEditContent('');
  };

  return (
    <div>
      <h1>My Notes</h1>
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            marginBottom: '20px',
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '8px',
          }}
        >
          {editingNote === note.id ? (
            <div>
              {/* Live Preview */}
              <div
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '10px',
                  backgroundColor: '#f9f9f9',
                  marginBottom: '10px',
                }}
              >
                <h3>Live Preview:</h3>
                <ReactMarkdown
                  components={MarkdownComponents}
                  children={editContent}
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                />
              </div>

              {/* Editor */}
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                style={{
                  width: '100%',
                  height: '100px',
                  padding: '10px',
                  fontSize: '16px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginBottom: '10px',
                }}
              />

              {/* Buttons */}
              <div>
                <button
                  onClick={handleSave}
                  style={{
                    marginRight: '10px',
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <FiSave style={{ marginRight: '5px' }} />
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  <FiArrowLeft style={{ marginRight: '5px' }} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              <ReactMarkdown
                components={MarkdownComponents}
                children={note.content}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              />
              <button
                onClick={() => handleEdit(note)}
                style={{
                  marginTop: '10px',
                  padding: '8px 16px',
                  backgroundColor: '#007BFF',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <FiEdit style={{ marginRight: '5px' }} />
                Edit
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyFeed;
