import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';
import axiosInstance from '../../Hooks/axiosInstance'; // Adjust the import path accordingly

const VisNetworkGraph = () => {
    const networkRef = useRef(null);

    // State to hold the fetched data
    const [data, setData] = useState(null);

    // State to manage nodes and edges
    const [nodesData, setNodesData] = useState([]);
    const [edgesData, setEdgesData] = useState([]);

    // State to toggle between static and interactive mode
    const [isInteractive, setIsInteractive] = useState(true);

    // Fetch data from the API when the component mounts
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/graph'); // API endpoint
                setData(response.data); // Set the data in the state
            } catch (error) {
                console.error('Error fetching graph data:', error);
            }
        };

        fetchData();
    }, []);

    // Update nodesData and edgesData when data is fetched
    useEffect(() => {
        if (data) {
            setNodesData(data.nodes || []);
            setEdgesData(data.links || []);
        }
    }, [data]);

    useEffect(() => {
        if (nodesData.length === 0 && edgesData.length === 0) return; // Wait until data is available

        // Create the DataSet for nodes, adding size and color based on node type
        const nodes = new DataSet(
            nodesData.map(d => ({
                id: d.id,
                color: getNodeColor(d.type), // Set color based on type
                size: getNodeSize(d.type),  // Set size based on type
                label: d.label || `Node ${d.id}`, // Ensure nodes have a label
                font: {
                    size: 10,  // Reduced font size
                    color: 'rgba(0, 0, 0, 0.5)',  // Lighter color for text (semi-transparent black)
                    background: 'none',  // Make background transparent (optional)
                },
                hidden: d.type === 'concept',
            }))
        );

        const edges = new DataSet(
            edgesData.map(link => ({
                id: link.id,
                from: link.src_node_id,
                to: link.dst_node_id,
                label: link.label || '', // Ensure edges have a label
                arrows: link.bidirectional ? 'to,from' : 'to', // Set arrow direction
                width: 1,  // Adjust the width of the edge to make arrows smaller
                font: {
                    size: 8,  // Reduced font size
                    color: 'rgba(0, 0, 0, 0.5)',  // Lighter color for text (semi-transparent black)
                },
            }))
        );

        const container = networkRef.current;

        // Set network options (for zoom and pan behaviors, etc.)
        const options = {
            autoResize: true,
            height: '100%',
            width: '100%',
            layout: {
                enabled: true,
                direction: "LR",
                sortMethod: 'hubsize'
            },
            physics: {
                enabled: isInteractive,
                solver: 'barnesHut',
                barnesHut: {
                    gravitationalConstant: -500,
                    centralGravity: 0.2,
                    springLength: 50,
                    springConstant: 0.05,
                    damping: 0.1,
                    avoidOverlap: 0.2,
                },
                timestep: 0.5,
                stabilization: {
                    iterations: 100,
                    updateInterval: 10,
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
            },
            layout: {
                randomSeed: 2,
                improvedLayout: true,
                hierarchical: {
                    enabled: false,
                },
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

    // Function to determine the node size based on type
    const getNodeSize = (type) => {
        switch (type) {
            case 'subject':
                return 30; // Largest size for subject
            case 'general-topic':
                return 20; // Slightly smaller for general topic
            case 'topic':
                return 10; // Smaller for topic
            case 'concept':
                return 5; // Smallest size for concept
            default:
                return 5; // Default size if type is not recognized
        }
    };

    // Function to determine the node color based on type
    const getNodeColor = (type) => {
        switch (type) {
            case 'subject':
                return '#0077cc'; // Blue for 'subject'
            case 'general topic':
                return '#ff5722'; // Orange for 'general topic'
            case 'topic':
                return '#8bc34a'; // Green for 'topic'
            case 'concept':
                return '#9c27b0'; // Purple for 'concept'
            default:
                return '#9e9e9e'; // Gray for any unrecognized type
        }
    };

    // Function to toggle between static and interactive mode
    const toggleMode = () => {
        setIsInteractive(!isInteractive);
    };

    return (
        <div>
            <button onClick={toggleMode}>
                Switch to {isInteractive ? 'Static' : 'Interactive'} Mode
            </button>
            <div ref={networkRef} style={{ height: '100vh', width: '100%' }}></div>
        </div>
    );
};

export default VisNetworkGraph;
