import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getRequest, postRequest } from 'apis/services';
import ENDPOINTS from 'apis/endpoints';

const ProjectNew = ({ onClose, onRefreshData }) => {
    const [nodes, setNodes] = useState([]);
    const [title, setTitle] = useState('');
    const [selectedNode, setSelectedNode] = useState('');
    const [visibility, setVisibility] = useState('private'); // Default to 'private'

    useEffect(() => {
        const fetchNodes = async () => {
            const data = await getRequest(ENDPOINTS.NODES);
            setNodes(data);
        };
        fetchNodes();
    }, []);

    const handleSave = async () => {
        if (title && selectedNode && visibility) {
            const newProject = { title, node_id: selectedNode, visibility };
            try {
                console.log('Saving new project:', newProject);
                await postRequest(ENDPOINTS.PROJECTS.NONE, newProject);
                await onRefreshData(); // Refresh data after saving
                onClose(); // Close the modal after successful save
            } catch (error) {
                console.error('Error saving project:', error);
                alert('Failed to save the project. Please try again.');
            }
        } else {
            alert('Please fill in all fields');
        }
    };

    return (
        <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">New Project</h5>
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
                        <div className="mb-3">
                            <label htmlFor="visibility" className="form-label">Visibility</label>
                            <select
                                className="form-select"
                                id="visibility"
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value)}
                            >
                                <option value="private">Private</option>
                                <option value="public">Public</option>
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

export default ProjectNew;
