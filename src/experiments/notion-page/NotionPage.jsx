import React from 'react';
import EditableText from './EditableText';
import './NotionPage.css';

const sampleContent = `
# Notion Style Page
A simple React component inspired by Notion.

## 📝 Notes
This is an example of a text block. You can write and organize your ideas here.

## 📋 Tasks
- Task 1: Set up React environment ✅
- Task 2: Create NotionPage.jsx component
- Task 3: Add inline editing functionality

## 💡 Ideas
- Build a to-do app
- Add drag-and-drop functionality
- Create custom themes for the page
`;

const NotionPage = () => {
  const lines = sampleContent.trim().split('\n');

  return (
    <div className="notion-page">
      {lines.map((line, index) => (
        <EditableText key={index} initialText={line} />
      ))}
    </div>
  );
};

export default NotionPage;
