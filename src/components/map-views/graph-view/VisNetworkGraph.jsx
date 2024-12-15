import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import getVisProperties from './VisNetworkGraph.properties';

const VisNetworkGraph = ({ data, selectedNode }) => {
    const networkRef = useRef(null);
    const [nodesData, setNodesData] = useState([]);
    const [edgesData, setEdgesData] = useState([]);
    const networkInstanceRef = useRef(null); // Reference to store the network instance

    useEffect(() => {
        if (data) {
            setNodesData(data.nodes || []);
            setEdgesData(data.edges || []);
        }
    }, [data]);

    useEffect(() => {
        if (nodesData.length === 0 && edgesData.length === 0) return; // Wait until data is available

        const nodes = new DataSet(
            nodesData.map(d => {
                const visProperties = getVisProperties(d.category);
                return {
                    id: d.id,
                    color: visProperties.node.color,
                    size: visProperties.node.size,
                    label: d.name || `Node ${d.id}`,
                    font: {
                        size: visProperties.node.fontsize,
                        color: 'rgba(0, 0, 0, 0.7)',
                        background: 'none',
                    },
                    hidden: false,
                };
            })
        );

        const edges = new DataSet(
            edgesData.map(edge => ({
                id: edge.id,
                from: edge.src_node_id,
                to: edge.dst_node_id,
                label: edge.name || '',
                arrows: edge.category === 'related' ? 'to,from' : 'to',
                width: 0.8,
                font: {
                    size: 8,
                    color: 'rgba(0, 0, 0, 0.3)',
                },
            }))
        );

        const container = networkRef.current;

        const options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            physics: {
                enabled: true,
                solver: 'barnesHut',
                barnesHut: {
                    gravitationalConstant: -500,
                    centralGravity: 0.3,
                    springLength: 60,
                    springConstant: 0.05,
                    damping: 0.1,
                    avoidOverlap: 0.3,
                },
                timestep: 0.5,
                stabilization: {
                    iterations: 100,
                    updateInterval: 0.01,
                },
            },
            interaction: {
                dragNodes: true,
                zoomView: true,
            },
            edges: {
                color: '#ccc',
                width: 2,
                arrows: {
                    to: { scaleFactor: 0.5, type: 'arrow' },
                },
            },
            layout: {
                randomSeed: 2,
                improvedLayout: true,
            },
            nodes: {
                shape: 'dot',
                font: {
                    size: 10,
                    color: 'rgba(0, 0, 0, 0.5)',
                },
            },
            manipulation: {
                enabled: true,
                initiallyActive: false,
                addNode: (data, callback) => {
                    const newNode = {
                        id: nodesData.length + 1, // Ensure a unique id
                        label: `Node ${nodesData.length + 1}`,
                        type: 'topic', // Default node type
                    };
                    setNodesData([...nodesData, newNode]);
                    callback(newNode);
                },
                deleteNode: (data) => {
                    const newNodesData = nodesData.filter(node => node.id !== data.nodes[0]);
                    const newEdgesData = edgesData.filter(edge => edge.from !== data.nodes[0] && edge.to !== data.nodes[0]);
                    setNodesData(newNodesData);
                    setEdgesData(newEdgesData);
                },
                addEdge: (data, callback) => {
                    const newEdge = {
                        id: edgesData.length + 1, // Ensure a unique id
                        src_node_id: data.from,
                        dst_node_id: data.to,
                        label: data.label || '',
                        bidirectional: false, // Default to unidirectional
                    };
                    setEdgesData([...edgesData, newEdge]);
                    callback(newEdge);
                },
                deleteEdge: (data) => {
                    const newEdgesData = edgesData.filter(edge => edge.id !== data.edges[0]);
                    setEdgesData(newEdgesData);
                },
                editNode: (data, callback) => {
                    data.label = prompt("Enter new label for the node", data.label);
                    const updatedNodesData = nodesData.map(node =>
                        node.id === data.id ? { ...node, label: data.label || node.label } : node
                    );
                    setNodesData(updatedNodesData);
                    callback(data);
                },
                editEdge: (data, callback) => {
                    data.label = prompt("Enter new label for the edge", data.label);

                    const updatedEdgesData = edgesData.map(edge =>
                        edge.id === data.id
                            ? { ...edge, label: data.label || edge.label }
                            : edge
                    );
                    setEdgesData(updatedEdgesData);
                    callback(data);
                }
            }
        };

        const network = new Network(container, { nodes, edges }, options);
        networkInstanceRef.current = network; // Store the network instance for later use

        // Handle double-click event to toggle node visibility
        const nodeVisibility = Object.fromEntries(nodes.map(node => [node.id, node.hidden]));
        network.on('doubleClick', (event) => {
            const clickedNodes = event.nodes;
            const clickedEdges = event.edges;
            if (clickedNodes.length > 0) {
                const nodeId = clickedNodes[0];
                const childNodes = edges.get().filter(edge => edge.from === nodeId).map(edge => edge.to);
                childNodes.forEach((nodeid) => {
                    nodeVisibility[nodeid] = !nodeVisibility[nodeid];
                });

                nodes.update(childNodes.map(cnodeId => ({
                    id: cnodeId,
                    hidden: nodeVisibility[cnodeId],
                })));

            } else if (clickedEdges.length > 0) {
                const edgeId = clickedEdges[0];
                const edge = edgesData.find(e => e.id === edgeId);
                if (edge) {
                    const newLabel = prompt('Edit edge label:', edge.label || '');
                    if (newLabel !== null) {
                        const updatedEdgesData = edgesData.map(e =>
                            e.id === edgeId
                                ? { ...e, label: newLabel }
                                : e
                        );
                        setEdgesData(updatedEdgesData);
                    }
                }
            }
        });

        // Clean up when the component unmounts
        return () => {
            network.destroy();
        };

    }, [nodesData, edgesData]);

    useEffect(() => {
        // Focus on the selected node if the parameter has a value
        if (selectedNode?.id && networkInstanceRef.current) {
            const network = networkInstanceRef.current;
    
            // Focus on the selected node
            network.focus(selectedNode.id, {
                scale: 1.5, // Zoom scale for focus
                animation: {
                    duration: 500,
                    easingFunction: 'easeInOutQuad',
                },
            });
    
            // Select the node
            network.selectNodes([selectedNode.id]);
        }
    }, [selectedNode]);

    return (
        <div>
            <div ref={networkRef} style={{ height: '90vh', width: '100%' }}></div>
        </div>
    );
};

export default VisNetworkGraph;
