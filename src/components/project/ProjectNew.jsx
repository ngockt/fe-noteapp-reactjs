import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import FetchData from 'components/apis/FetchData';
import AxiosInstance from 'AxiosInstance'; // Import AxiosInstance

const NewProject = ({ onClose, onRefreshData }) => {
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
            const newStudySet = { title, node_id: selectedNode };
            try {
                console.log('Saving new study set:', newStudySet);
                await AxiosInstance.post('/projects', newStudySet);
                await onRefreshData(); // Refresh data after saving
                onClose(); // Close the modal after successful save
            } catch (error) {
                console.error('Error saving study set:', error);
                alert('Failed to save the study set. Please try again.');
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

export default NewProject;