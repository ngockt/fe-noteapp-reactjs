// TextBlockParse.jsx

// Function to parse text into blocks with content types
export const parseTextBlocks = (content) => {
  const blocks = [];
  const regex = /```([\s\S]*?)```/g; // Match content inside triple backticks including newlines
  let lastIndex = 0; // Tracks the end of the last match

  let match;

  while ((match = regex.exec(content)) !== null) {
    // Process content before the current block
    const beforeBlock = content.substring(lastIndex, match.index).trim();
    if (beforeBlock) {
      // Split by double newlines and filter out empty blocks
      beforeBlock.split(/\n\n+/).filter(block => block.trim()).forEach(block => {
        blocks.push({ type: 'markdown', content: block });
      });
    }

    // Process the matched block inside ```
    let codeBlock = match[1].trim();
    if (codeBlock) { // Ignore empty code blocks
      let type = 'markdown'; // Default type is 'code'

      if (codeBlock.startsWith('mermaid')) {
        type = 'mermaid';
        codeBlock = codeBlock.replace(/^mermaid/, '').trim(); // Remove 'mermaid' keyword
      } else if (codeBlock.startsWith('plantuml')) {
        type = 'plantuml';
        codeBlock = codeBlock.replace(/^plantuml/, '').trim(); // Remove 'plantuml' keyword
      } else {
        // Wrap other code blocks inside triple backticks
        codeBlock = `\`\`\`\n${codeBlock}\n\`\`\``;
      }

      // Add block with type and content
      blocks.push({
        type,
        content: codeBlock
      });
    }

    // Update the lastIndex to the end of the current match
    lastIndex = regex.lastIndex;
  }

  // Process any remaining content after the last block
  const afterBlock = content.substring(lastIndex).trim();
  if (afterBlock) {
    afterBlock.split(/\n\n+/).filter(block => block.trim()).forEach(block => {
      blocks.push({ type: 'markdown', content: block });
    });
  }

  return blocks;
};
