import React, { useState } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css'; // Import KaTeX CSS

const LatexRenderer = () => {
    const [blockInput, setBlockInput] = useState('c = \\pm\\sqrt{a^2 + b^2}'); // Example block formula
    const [inlineInput, setInlineInput] = useState('E = mc^2'); // Example inline formula

    const handleBlockChange = (event) => {
        setBlockInput(event.target.value);
    };

    const handleInlineChange = (event) => {
        setInlineInput(event.target.value);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>LaTeX Renderer</h2>

            {/* Block Math Input */}
            <h3>Block Math Input:</h3>
            <textarea
                value={blockInput}
                onChange={handleBlockChange}
                rows="4"
                cols="50"
                placeholder="Enter LaTeX code for block math"
                style={{ padding: '10px', marginBottom: '20px' }}
            />
            <h3>Block Output:</h3>
            <div style={{ border: '1px solid #ccc', padding: '10px', minHeight: '50px' }}>
                <BlockMath math={blockInput} />
            </div>

            {/* Inline Math Input */}
            <h3>Inline Math Input:</h3>
            <input
                type="text"
                value={inlineInput}
                onChange={handleInlineChange}
                placeholder="Enter LaTeX code for inline math"
                style={{ padding: '10px', width: '400px', marginBottom: '20px' }}
            />
            <h3>Inline Output:</h3>
            <p>
                Here is an example of inline math: <InlineMath math={inlineInput} />
            </p>
        </div>
    );
};

export default LatexRenderer;
