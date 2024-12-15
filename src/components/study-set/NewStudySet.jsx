import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FetchData from 'components/apis/FetchData';

const NewStudySet = ({ onClose }) => {
    const [nodes, setNodes] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedNode, setSelectedNode] = useState('');

    useEffect(() => {
        const fetchNodes = async () => {
            const data = await FetchData('/maps/list');
            setNodes(data);
        };
        fetchNodes();
    }, []);

    const handleSave = async () => {
        if (title && selectedNode) {
            const newStudySet = { title, nodeId: selectedNode };
            // await FetchData('/study-sets', 'POST', newStudySet);
            onClose(); // Close the modal after saving
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Add New Study Set</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label htmlFor="title" className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="node" className="form-label">Node</label>
                            <select
                                className="form-select"
                                id="node"
                                value={selectedNode}
                                onChange={(e) => setSelectedNode(e.target.value)}
                            >
                                <option value="">Select a node</option>
                                {nodes.map((node) => (
                                    <option key={node.id} value={node.id}>
                                        {node.name} - {node.category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={handleSave}>
                            Save
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewStudySet;
