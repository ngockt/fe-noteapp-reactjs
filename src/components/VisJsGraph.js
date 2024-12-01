import React, { useEffect, useRef, useState } from 'react';
import { DataSet, Network } from 'vis-network/standalone';

const VisNetworkGraph = ({ data }) => {
  const networkRef = useRef(null);
  const [nodesData, setNodesData] = useState(data ? data.nodes : []); // State to manage nodes
  const [edgesData, setEdgesData] = useState(data ? data.links : []); // State to manage edges

  useEffect(() => {
    if (!data) return; // Wait until data is available

    // Create the DataSet for nodes, adding size and color based on node type
    const nodes = new DataSet(
      nodesData.map(d => ({
        id: d.id,
        color: getNodeColor(d.type), // Set color based on type
        size: getNodeSize(d.type),  // Set size based on type
        label: d.label || `Node ${d.id}`, // Ensure nodes have a label
      }))
    );

    const edges = new DataSet(
      edgesData.map(link => ({
        id: link.id,
        from: link.src_node_id,
        to: link.dst_node_id,
        label: link.label || '', // Ensure edges have a label
        arrows: link.bidirectional ? 'to,from' : 'to',
      }))
    );

    const container = networkRef.current;

    // Set network options (for zoom and pan behaviors, etc.)
    const options = {
      autoResize: true,
      height: '100%',
      width: '100%',
      physics: {
        enabled: true,
        solver: 'barnesHut',
        barnesHut: {
          gravitationalConstant: -1000,
          centralGravity: 0.2,
          springLength: 100,
          springConstant: 0.04,
          damping: 0.1,
          avoidOverlap: 0.2,
        },
        timestep: 0.5,
        stabilization: {
          iterations: 1000,  // Stabilization iterations for more uniform distribution
          updateInterval: 25,
        },
      },
      interaction: {
        dragNodes: true,   // Enable node dragging
        zoomView: true,    // Enable zooming
      },
      edges: {
        color: '#ccc',
        width: 2,
      },
      layout: {
        randomSeed: 2, // This forces a "random" initial layout which can help nodes spread out
        improvedLayout: true, // Tries to improve the layout (more balanced spread)
        hierarchical: {
          enabled: false,  // Disable hierarchical layout (useful when nodes should spread in 2D space)
        },
      },
      nodes: {
        shape: 'dot', // Ensure nodes are displayed as circles (or you can change to another shape)
        font: {
          size: 14, // Set a default font size for node labels if applicable
        },
      },
      manipulation: {
        enabled: true, // Enable manipulation
        initiallyActive: true, // The toolbox is initially active
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
            src_node_id: data.from,
            dst_node_id: data.to,
            label: data.label || '',
            bidirectional: false, // Default to unidirectional
          };
          setEdgesData([...edgesData, newEdge]);
          callback(newEdge);
        },
        deleteEdge: (data) => {
          const newEdgesData = edgesData.filter(edge => !(edge.src_node_id === data.edges[0].src_node_id && edge.dst_node_id === data.edges[0].dst_node_id));
          setEdgesData(newEdgesData);
        },
        editNode: (data, callback) => {
          const updatedNodesData = nodesData.map(node =>
            node.id === data.id ? { ...node, label: data.label || node.label } : node
          );
          setNodesData(updatedNodesData);
          callback(data);
        },
        editEdge: (data, callback) => {
          const updatedEdgesData = edgesData.map(edge =>
            edge.src_node_id === data.src_node_id && edge.dst_node_id === data.dst_node_id
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

    // Handle double-click event to edit node and edge labels
    network.on('doubleClick', (event) => {
      const { nodes, edges } = event;
      console.log(nodes)
      console.log(edges)
      if (nodes.length > 0) {
        // Edit node label
        const nodeId = nodes[0];
        const node = nodesData.find(n => n.id === nodeId);
        if (node) {
          const newLabel = prompt('Edit node label:', node.label || '');
          if (newLabel !== null) {
            const updatedNodesData = nodesData.map(n =>
              n.id === nodeId ? { ...n, label: newLabel } : n
            );
            setNodesData(updatedNodesData);
          }
        }
      } else if (edges.length > 0) {
        // Edit edge label (double-clicked edge)
        const edgeId = edges[0];
        const edge = edgesData.find(e => e.id === edgeId);
        if (edge) {
          const newLabel = prompt('Edit edge label:', edge.label || '');
          if (newLabel !== null) {
            const updatedEdgesData = edgesData.map(e =>
              e.src_node_id === edgeId.src_node_id && e.dst_node_id === edgeId.dst_node_id
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
  }, [nodesData, edgesData, data]);

  // Function to determine the node size based on type
  const getNodeSize = (type) => {
    switch (type) {
      case 'subject':
        return 30; // Largest size for subject
      case 'general-topic':
        return 25; // Slightly smaller for general topic
      case 'topic':
        return 20; // Smaller for topic
      case 'concept':
        return 15; // Smallest size for concept
      default:
        return 10; // Default size if type is not recognized
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

  return (
    <div>
      <div ref={networkRef} style={{ height: '100vh', width: '100%' }}></div>
    </div>
  );
};

export default VisNetworkGraph;
