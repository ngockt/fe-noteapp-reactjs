// src/components/contents/LanguageModal.js
import React, { useState } from 'react';

function LanguageModal({
    show,
    onClose,
    currentLanguages,
    allLanguages,
    onSelect,
    onAddLanguage,
    isEditing = false, // Add isEditing prop with default value false
}) {
    // 1) Partition the global languages into:
    //    - currentLangObjs = languages that the active version already has
    //    - availableLangObjs = the rest
    const currentLangObjs = allLanguages.filter((lang) =>
        currentLanguages.includes(lang.id)
    );
    const availableLangObjs = allLanguages.filter(
        (lang) => !currentLanguages.includes(lang.id)
    );

    // 2) Two separate search terms, one for each section
    const [searchTermCurrent, setSearchTermCurrent] = useState('');
    const [searchTermAdd, setSearchTermAdd] = useState('');

    // 3) Filter the current languages list
    const filteredCurrentLangs = currentLangObjs.filter((lang) => {
        const term = searchTermCurrent.toLowerCase();
        return (
            lang.code.toLowerCase().includes(term) ||
            (lang.name || '').toLowerCase().includes(term)
        );
    });

    // 4) Filter the available (to-add) languages list
    const filteredAvailableLangs = availableLangObjs.filter((lang) => {
        const term = searchTermAdd.toLowerCase();
        return (
            lang.code.toLowerCase().includes(term) ||
            (lang.name || '').toLowerCase().includes(term)
        );
    });

    if (!show) return null;

    return (
        <div
            className="modal fade show"
            style={{
                display: 'block',
                backgroundColor: 'rgba(0,0,0,0.5)',
            }}
            role="dialog"
        >
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    {/* Header */}
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {isEditing ? 'Select or Add Language' : 'Select Language'}
                        </h5>
                        <button type="button" className="btn-close" onClick={onClose} />
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* SECTION A: Current Languages (in active version) */}
                        <h6 className="mb-2">Switch Language</h6>

                        {/* Search bar for current languages */}
                        <div className="mb-2">
                            <input
                                type="text"
                                className="form-control form-control-sm"
                                placeholder="Search current languages..."
                                value={searchTermCurrent}
                                onChange={(e) => setSearchTermCurrent(e.target.value)}
                            />
                        </div>

                        {/* Scrollable container for current languages */}
                        <div
                            style={{ maxHeight: '150px', overflowY: 'auto' }}
                            className="mb-4"
                        >
                            {filteredCurrentLangs.length > 0 ? (
                                <ul className="list-group">
                                    {filteredCurrentLangs.map((lang) => (
                                        <li
                                            key={lang.id}
                                            className="list-group-item list-group-item-action"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                // user selects an existing language
                                                onSelect(lang.id);
                                                onClose(); // optional auto-close
                                            }}
                                        >
                                            {lang.code.toUpperCase()}
                                            {lang.name ? ` (${lang.name})` : ''}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-muted">
                                    <em>No matching languages in the current version.</em>
                                </p>
                            )}
                        </div>

                        {/* Conditionally render the "Add New Language" section */}
                        {isEditing && (
                            <>
                                <hr />

                                {/* SECTION B: Add New Language (available for adding) */}
                                <h6 className="mb-2">Add New Language</h6>

                                {/* Search bar for adding new languages */}
                                <div className="mb-2">
                                    <input
                                        type="text"
                                        className="form-control form-control-sm"
                                        placeholder="Search available languages..."
                                        value={searchTermAdd}
                                        onChange={(e) => setSearchTermAdd(e.target.value)}
                                    />
                                </div>

                                {/* Scrollable container for available languages */}
                                <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                    {filteredAvailableLangs.length > 0 ? (
                                        <ul className="list-group">
                                            {filteredAvailableLangs.map((lang) => (
                                                <li
                                                    key={lang.id}
                                                    className="list-group-item list-group-item-action"
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        onAddLanguage(lang.id);
                                                        // optional: also set it as active
                                                        // onSelect(lang.id);
                                                        onClose(); // optional auto-close
                                                    }}
                                                >
                                                    {lang.code.toUpperCase()}
                                                    {lang.name ? ` (${lang.name})` : ''}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-muted">
                                            <em>No matching languages available to add.</em>
                                        </p>
                                    )}
                                </div>
                            </>
                        )}
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

export default LanguageModal;