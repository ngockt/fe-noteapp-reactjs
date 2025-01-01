// VersionModal.jsx

import React, { useState } from 'react';

function VersionModal({ show, onClose, versions, onSelect, onAddVersion }) {
    /**
     * versions: array of version objects, e.g. [{ version: "1.0.0", contents: [...] }, ...]
     * onSelect: function(selectedVersionString)
     * onAddVersion: function(newVersionString)
     */

    const [searchTerm, setSearchTerm] = useState('');
    const [newVersion, setNewVersion] = useState('');

    // Filter versions by the searchTerm, matching the `vObj.version` string
    const filteredVersions = versions.filter((vObj) =>
        vObj.version.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!show) return null;

    // Handler for adding a new version
    const handleAddVersionClick = () => {
        if (!newVersion.trim()) return; // Don’t add if empty
        // Call the parent’s callback
        onAddVersion(newVersion.trim());
        // Clear the input and close the modal if desired
        setNewVersion('');
        // Optionally, you can keep the modal open or close it automatically
        // onClose(); // If you prefer to close the modal right after creating
    };

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
                        <h5 className="modal-title">Select Version</h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* Search bar */}
                        <div className="mb-3">
                            <label className="form-label">Search Versions:</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="e.g. 1.0.0"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Scrollable list of versions */}
                        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                            <ul className="list-group">
                                {filteredVersions.map((vObj, idx) => (
                                    <li
                                        key={idx}
                                        className="list-group-item list-group-item-action"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            onSelect(vObj.version);
                                        }}
                                    >
                                        {vObj.version}
                                    </li>
                                ))}

                                {filteredVersions.length === 0 && (
                                    <li className="list-group-item">
                                        <em>No matching versions</em>
                                    </li>
                                )}
                            </ul>
                        </div>

                        {/* Divider */}
                        <hr />

                        {/* Add New Version */}
                        <div className="mb-3">
                            <label className="form-label fw-bold">Create New Version:</label>
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Enter new version (e.g. 2.0.0)"
                                value={newVersion}
                                onChange={(e) => setNewVersion(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-sm btn-primary"
                            onClick={handleAddVersionClick}
                        >
                            Add Version
                        </button>
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

export default VersionModal;
