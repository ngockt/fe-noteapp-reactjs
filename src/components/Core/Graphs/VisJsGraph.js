import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import getVisProperties from './VisJsGraph.properties';

const VisNetworkGraph = ({ data }) => {
    const networkRef = useRef(null);
    const [nodesData, setNodesData] = useState([]);
    const [edgesData, setEdgesData] = useState([]);
    const [isInteractive, setIsInteractive] = useState(true);


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
                const visProperties = getVisProperties(d.category)
                return {
                    id: d.id,
                    color: visProperties.node.color, // Set color based on type
                    size: visProperties.node.size,  // Set size based on type
                    label: d.name || `Node ${d.id}`, // Ensure nodes have a label
                    font: {
                        size: visProperties.node.fontsize,  // Reduced font size
                        color: 'rgba(0, 0, 0, 0.7)',  // Lighter color for text (semi-transparent black)
                        background: 'none',  // Make background transparent (optional)
                    },
                    hidden: false,
                }
            })
        );

        const edges = new DataSet(
            edgesData.map(edge => ({
                id: edge.id,
                from: edge.src_node_id,
                to: edge.dst_node_id,
                label: edge.name || '', // Ensure edges have a label
                arrows: edge.category === 'related' ? 'to,from' : 'to', // Set arrow direction
                width: 0.8,  // Adjust the width of the edge to make arrows smaller
                font: {
                    size: 8,  // Reduced font size
                    color: 'rgba(0, 0, 0, 0.3)',  // Lighter color for text (semi-transparent black)
                },
                // length: getVisProperties(nodesData.find(n => n.id === edge.dst_node_id).category).edge.length
            }))
        );

        const container = networkRef.current;

        // Set network options (for zoom and pan behaviors, etc.)
        const options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            physics: {
                enabled: isInteractive,
                solver: 'barnesHut',
                barnesHut: {
                    gravitationalConstant: -500,
                    centralGravity: 0.3,
                    springLength: 50,
                    springConstant: 0.05,
                    damping: 0.1,
                    avoidOverlap: 0.3,
                },
                timestep: 0.5,
                stabilization: {
                    iterations: 10,
                    updateInterval: 0.01,
                },
            },
            interaction: {
                dragNodes: isInteractive,
                zoomView: isInteractive,
            },
            edges: {
                color: '#ccc',
                width: 2,
                arrows: {
                    to: { scaleFactor: 0.5, type: 'arrow' },
                },
                // smooth: false
            },
            layout: {
                // randomSeed: 2,
                improvedLayout: true,
                // hierarchical: {
                //     enabled: false,
                // },
            },
            nodes: {
                shape: 'dot',
                font: {
                    size: 10,
                    color: 'rgba(0, 0, 0, 0.5)',
                },
            },

            manipulation: {
                enabled: isInteractive,
                initiallyActive: true,
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

        // Initialize the network
        const network = new Network(container, { nodes, edges }, options);

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
            network.destroy(); // Destroy the network instance
        };

    }, [nodesData, edgesData, isInteractive]);


    // Function to toggle between static and interactive mode
    const toggleMode = () => {
        setIsInteractive(!isInteractive);
    };

    return (
        <div>
            <div ref={networkRef} style={{ height: '100vh', width: '100%' }}></div>
            <button onClick={toggleMode}>
                Switch to {isInteractive ? 'Static' : 'Interactive'} Mode
            </button>
        </div>
    );
};

export default VisNetworkGraph;
