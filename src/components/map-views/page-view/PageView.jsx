import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const PageView = ({ data }) => {
  const [hierarchy, setHierarchy] = useState([]);

  useEffect(() => {
    if (data) {
      const { nodes, edges } = data;
      const builtHierarchy = buildHierarchy(nodes, edges);
      setHierarchy(builtHierarchy);
    }
  }, [data]);

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

  const renderTree = (items) => (
    <ul className="list-group list-group-flush">
      {items.map(item => (
        <li key={item.id} className="list-group-item">
          <details>
            <summary>
              <strong>{item.name}</strong> <span className="text-muted">({item.category})</span>
            </summary>
            {item.children && item.children.length > 0 && renderTree(item.children)}
          </details>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="container mt-4">
      {hierarchy.length > 0 ? (
        renderTree(hierarchy)
      ) : (
        <div className="alert alert-info">No data available</div>
      )}
    </div>
  );
};

export default PageView;
