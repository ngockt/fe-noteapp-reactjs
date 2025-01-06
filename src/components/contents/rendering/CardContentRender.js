// src/components/contents/rendering/CardContentRender.js
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import PropTypes from 'prop-types'; 

import Mermaid from './Mermaid';
import PlantUML from './PlantUML';

const CardContentRender = ({ content, imageMap, isEditing }) => {
    const preprocessContent = (text) => {
        text = text
            .replace(/\\\(([\s\S]*?)\\\)/g, function (match, p1) {
                return `$${p1}$`;
            })
            .replace(/\\\[([\s\S]*?)\\\]/g, function (match, p1) {
                return `$$${p1}$$`;
            });
        return text;
    };

    const ImageRenderer = ({ src, alt }) => {
        const dataURL = imageMap && imageMap[src] ? imageMap[src] : '';
        return dataURL ? (
            <img src={dataURL} alt={alt} style={{ maxWidth: '100%' }} />
        ) : null;
    };

    const MarkdownComponents = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            if (match) {
                switch (match[1]) {
                    case 'mermaid':
                        return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                    case 'plantuml':
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
        img: ImageRenderer,
    };

    const processedContent = preprocessContent(content);

    return (
        <div className="card-content-container">
            {isEditing && content && content.trim() && (
                <>
                    <h6 className="mt-2">Live Preview:</h6>
                    <div className="live-preview">
                        <ReactMarkdown
                            components={MarkdownComponents}
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        >
                            {processedContent}
                        </ReactMarkdown>
                    </div>
                </>
            )}

            {!isEditing && (
                <ReactMarkdown
                    components={MarkdownComponents}
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                >
                    {processedContent}
                </ReactMarkdown>
            )}
        </div>
    );
};

CardContentRender.propTypes = {  // Define propTypes
    content: PropTypes.string,
    imageMap: PropTypes.objectOf(PropTypes.string),
    isEditing: PropTypes.bool,
};
export default CardContentRender;