// src/components/contents/rendering/Mermaid.jsx
import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

const Mermaid = ({ chart }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        mermaid.initialize({ startOnLoad: true });
        if (chartRef.current) {
            try {
                mermaid.contentLoaded();
            } catch (error) {
                console.error('Mermaid diagram rendering error:', error);
            }
        }
    }, [chart]);

    return (
        <div ref={chartRef}>
            <div className="mermaid">{chart}</div>
        </div>
    );
};

export default Mermaid;
