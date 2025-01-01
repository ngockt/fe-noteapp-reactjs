// NodeModal.jsx

import React, { useState } from 'react';

function NodeModal({ show, onClose, nodes, onSelect, currentNode }) {
    /**
     * nodes: full array of node objects from the graph, e.g. { id, name, tag, category }
     * onSelect: function(nodeObj)
     * currentNode: the currently selected node object (or null)
     */

    const [searchTerm, setSearchTerm] = useState('');

    // Filter nodes by searchTerm (case-insensitive) in name, tag, or category
    const filteredNodes = nodes.filter((node) => {
        const term = searchTerm.toLowerCase();
        return (
            node.name.toLowerCase().includes(term) ||
            node.tag.toLowerCase().includes(term) ||
            node.category.toLowerCase().includes(term)
        );
    });

    if (!show) return null;

    return (
        <div
            className="modal fade show"
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
            role="dialog"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">Select Node</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* SECTION A: Current Node */}
                        <h6>Selected Node:</h6>
                        {currentNode ? (
                            <div className="mb-3">

                                {currentNode.name}
                                <span className="badge  text-dark ms-1">
                                    {currentNode.category}
                                </span>

                            </div>
                        ) : (
                            <div className="mb-3 text-muted">
                                <em>No node currently selected</em>
                            </div>
                        )}

                        {/* SECTION B: Search box */}
                        <label className="form-label">Search Nodes:</label>
                        <input
                            type="text"
                            className="form-control form-control-sm mb-3"
                            placeholder="Type to filter nodes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        {/* Scrollable list of filtered nodes */}
                        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            <ul className="list-group">
                                {filteredNodes.map((node, idx) => (
                                    <li
                                        key={idx}
                                        className="list-group-item list-group-item-action"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            onSelect(node);
                                        }}
                                    >
                                        {node.name}
                                        <span className="badge  text-dark ms-1">
                                            {node.category}
                                        </span>
                                    </li>
                                ))}

                                {filteredNodes.length === 0 && (
                                    <li className="list-group-item">
                                        <em>No matching nodes</em>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-sm btn-secondary"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NodeModal;
