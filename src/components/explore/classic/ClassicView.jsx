import React, { useEffect, useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FiArrowUpRight } from 'react-icons/fi';

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
        setExpandedNodes(new Set(nodesToExpand));

        // Delay the scroll slightly to ensure the DOM updates
        setTimeout(() => scrollToNode(node.id), 0);
    };

    const scrollToNode = (nodeId) => {
        const nodeElement = nodeRefs.current[nodeId];
        if (nodeElement) {
            nodeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                window.scrollBy(0, -100); // Adjust this value to scroll more or less
            }, 300);
        }
    };

    const handleToggleExpand = (item) => {
        setExpandedNodes(prev => {
            const updated = new Set(prev);
            if (updated.has(item.id)) {
                updated.delete(item.id);
            } else {
                updated.add(item.id);
            }
            return updated;
        });
    };

    const renderTree = (items) => (
        <ul className="list-group list-group-flush ps-0">
            {items.map(item => (
                <li
                    key={item.id}
                    ref={el => (nodeRefs.current[item.id] = el)}
                    className={`list-group-item ps-0${item.id === selectedNode?.id ? ' text-dark' : ''
                        }${expandedNodes.has(item.id) ? ' border rounded' : ''
                        }`}
                >
                    <div className="d-flex align-items-center">
                        <button
                            className="btn btn-sm me-2"
                            onClick={() => handleToggleExpand(item)}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                cursor: 'pointer',
                                fontSize: '18px',
                            }}
                            aria-label={expandedNodes.has(item.id) ? 'Collapse' : 'Expand'}
                        >
                            {expandedNodes.has(item.id) ? '−' : '+'}
                        </button>
                        <button
                            onClick={() => handleToggleExpand(item)}
                            className={`btn btn-link p-0 ${item.id === selectedNode?.id ? 'text-primary fw-bold' : 'text-decoration-none text-dark'}`}
                            aria-pressed={expandedNodes.has(item.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {item.name}
                        </button>
                        <span className="badge bg-light text-dark ms-1">{item.category}</span>
                        {/* <FiArrowUpRight /> */}
                        <button className="btn btn-secondary btn-sm">
                            <FiArrowUpRight />
                            Open Cards
                        </button>
                    </div>

                    {expandedNodes.has(item.id) && (
                        item.children && item.children.length > 0 ? (
                            <div className="ps-3">{renderTree(item.children)}</div>
                        ) : <></>
                    )}
                </li>
            ))}
        </ul>
    );


    return (
        <div className="container-fluid mt-3">
            {hierarchy.length > 0 ? (
                renderTree(hierarchy)
            ) : (
                <div className="alert alert-info">No data available</div>
            )}
        </div>
    );
};

export default PageView;
