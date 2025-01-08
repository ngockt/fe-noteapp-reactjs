// TextBlockParse.jsx

// Function to parse text into blocks
export const parseTextBlocks = (content) => {
    const lines = content.trim().split('\n');
    const blocks = [];
    let currentBlock = [];
  
    lines.forEach((line) => {
      if (line.trim() === '') {
        if (currentBlock.length > 0) {
          blocks.push(currentBlock.join('\n'));
          currentBlock = [];
        }
      } else {
        currentBlock.push(line);
      }
    });
  
    if (currentBlock.length > 0) {
      blocks.push(currentBlock.join('\n'));
    }
  
    return blocks;
  };
  