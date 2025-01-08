import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import PropTypes from 'prop-types';
import Mermaid from 'components/card/rendering/Mermaid';
import PlantUML from 'components/card/rendering/PlantUML';

const ContentRender = ({ content }) => {
    // Pre-process content to handle \( \) and \[ \] math delimiters
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

    // Custom component for rendering code blocks
    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (match) {
                switch (match[1]) {
                    case 'mermaid': // Mermaid diagrams
                        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                    case 'plantuml': // PlantUML diagrams
                        return <PlantUML content={String(children).replace(/\n$/, '')} />;
                    default:
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                }
            }
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    };

    const processedContent = preprocessContent(content);

    return (
        <ReactMarkdown
            components={MarkdownComponents}
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
        >
            {processedContent}
        </ReactMarkdown>
    );
};

ContentRender.propTypes = {
    content: PropTypes.string.isRequired,
};

export default ContentRender;
