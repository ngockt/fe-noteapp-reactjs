import React from 'react';
import EditableText from './TextBlock';
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
  - Step 1
  - Step 2
  - Step 3
`;

// Function to group related lines into blocks
const parseBlocks = (content) => {
  const lines = content.trim().split('\n');
  const blocks = [];
  let currentBlock = [];

  lines.forEach((line) => {
    if (line.trim() === '') {
      // Empty line denotes the end of a block
      if (currentBlock.length > 0) {
        blocks.push(currentBlock.join('\n')); // Merge lines into a single block
        currentBlock = [];
      }
    } else {
      currentBlock.push(line); // Add line to the current block
    }
  });

  // Push the last block if it exists
  if (currentBlock.length > 0) {
    blocks.push(currentBlock.join('\n'));
  }

  return blocks;
};

const NotionPage = () => {
  const blocks = parseBlocks(sampleContent);

  return (
    <div className="notion-page">
      {blocks.map((block, index) => (
        <EditableText key={index} initialText={block} />
      ))}
    </div>
  );
};

export default NotionPage;
