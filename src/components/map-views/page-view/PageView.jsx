import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PageView = ({ data, selectedNode }) => {
    const [hierarchy, setHierarchy] = useState([]);
    const [expandedNodes, setExpandedNodes] = useState(new Set());
    const nodeRefs = useRef({}); // Store references to node elements

    useEffect(() => {
        if (data) {
            const { nodes, edges } = data;
            const builtHierarchy = buildHierarchy(nodes, edges);
            setHierarchy(builtHierarchy);
        }
    }, [data]);

    useEffect(() => {
        if (selectedNode) {
            expandToNode(selectedNode); // Expand path to the selected node
            scrollToNode(selectedNode.id); // Scroll to the selected node
        }
    }, [selectedNode]);

    const buildHierarchy = (nodes, edges) => {
        const nodeMap = new Map();
        nodes.forEach(node => nodeMap.set(node.id, { ...node, children: [] }));

        edges
            .filter(edge => edge.category === 'contains')
            .forEach(edge => {
                const parent = nodeMap.get(edge.src_node_id);
                const child = nodeMap.get(edge.dst_node_id);
                if (parent && child) {
                    parent.children.push(child);
                }
            });

        return nodes
            .filter(node => !edges.some(edge => edge.dst_node_id === node.id))
            .map(node => nodeMap.get(node.id));
    };

    const expandToNode = (node) => {
        const nodesToExpand = new Set();
        const traverseUp = (nodeId, edges) => {
            const parentEdge = edges.find(edge => edge.dst_node_id === nodeId);
            if (parentEdge) {
                nodesToExpand.add(parentEdge.src_node_id);
                traverseUp(parentEdge.src_node_id, edges);
            }
        };
        traverseUp(node.id, data.edges);
        nodesToExpand.add(node.id);
        setExpandedNodes(nodesToExpand);
    };

    const scrollToNode = (nodeId) => {
        const nodeElement = nodeRefs.current[nodeId];
        if (nodeElement) {
            nodeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const renderTree = (items) => (
        <ul className="list-group list-group-flush ps-0">
            {items.map(item => (
                <li
                    key={item.id}
                    ref={el => (nodeRefs.current[item.id] = el)}
                    className={`list-group-item ps-4${
                        item.id === selectedNode?.id ? 'bg-warning text-dark' : ''
                    }`}
                >
                    <details open={expandedNodes.has(item.id)}>
                        <summary>
                            <strong
                                className={item.id === selectedNode?.id ? 'text-primary' : ''}
                            >
                                {item.name}
                            </strong>{' - '}
                            <span className="text-muted">{item.category}</span>
                        </summary>
                        {item.children && item.children.length > 0 && renderTree(item.children)}
                    </details>
                </li>
            ))}
        </ul>
    );

    return (
        <div className="container mt-3 ps-0">
            {hierarchy.length > 0 ? (
                renderTree(hierarchy)
            ) : (
                <div className="alert alert-info">No data available</div>
            )}
        </div>
    );
};

export default PageView;
