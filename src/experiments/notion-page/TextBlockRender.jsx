import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import PropTypes from 'prop-types';
import Mermaid from 'components/card/rendering/Mermaid';
import PlantUML from 'components/card/rendering/PlantUML';

// TextBlockRender Component
const TextBlockRender = ({ content, type }) => {
    const extractContent = (block) => {
        // Match triple backticks and optional type
        const regex = /^```(\w+)?\n([\s\S]*?)\n```$/;
        const match = block.match(regex);

        if (match) {
            return match[2].trim(); // Return only the content inside the block
        }
        return block.trim(); // Return original block if no match
    };
    const preprocessContent = (text) => {
        text = text
            .replace(/\\\(([\s\S]*?)\\\)/g, function (match, p1) {
                return `$${p1}$`; // Inline math
            })
            .replace(/\\\[([\s\S]*?)\\\]/g, function (match, p1) {
                return `$$${p1}$$`; // Block math
            });
        return text;
    };
    // Render Mermaid diagrams
    if (type === 'mermaid') {
        
        return <Mermaid chart={extractContent(content)} />;
    }

    // Render PlantUML diagrams
    if (type === 'plantuml') {
        return <PlantUML content={extractContent(content)} />;
    }

    // Render Markdown content with math support
    if (type === 'markdown' || type === "code") {
        return (
            <ReactMarkdown
                components={{
                    code({ node, inline, className, children, ...props }) {
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
            >
                {preprocessContent(content)}
            </ReactMarkdown>
        );
    }

    // Default: Render as plain text
    return <pre>{content}</pre>;
};

// PropTypes validation
TextBlockRender.propTypes = {
    content: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['markdown', 'mermaid', 'plantuml']).isRequired,
};

export default TextBlockRender;
