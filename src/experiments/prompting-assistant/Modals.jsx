import React from "react";
import { Modal, Form, Button } from "react-bootstrap";

const Modals = ({
    showEditModal,
    setShowEditModal,
    editComponent,
    setEditComponent,
    handleEditComponent,
    showAddModal,
    setShowAddModal,
    handleAddComponent,
    showAddFolderModal,
    setShowAddFolderModal,
    handleAddFolder,
    showEditFolderModal,
    setShowEditFolderModal,
    editFolder,
    setEditFolder,
    handleEditFolder,
    showDeleteConfirmationModal,
    setShowDeleteConfirmationModal,
    handleDeleteItem,
    itemToDelete
}) => {
    return (
        <>
            {/* Edit Component Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Component</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleEditComponent();
                        }}
                    >
                        <Form.Group controlId="editComponentName">
                            <Form.Label>Component Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editComponent.name}
                                onChange={(e) =>
                                    setEditComponent({ ...editComponent, name: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Form.Group controlId="editComponentInstruction" className="mt-3">
                            <Form.Label>Instruction</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                value={editComponent.instruction}
                                onChange={(e) =>
                                    setEditComponent({ ...editComponent, instruction: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="mt-3">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Add Folder Modal */}
            <Modal show={showAddFolderModal} onHide={() => setShowAddFolderModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleAddFolder(e.target.folderName.value);
                        }}
                    >
                        <Form.Group controlId="addFolderName">
                            <Form.Label>Folder Name</Form.Label>
                            <Form.Control type="text" name="folderName" />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="mt-3">
                            Add Folder
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Edit Folder Modal */}
            <Modal show={showEditFolderModal} onHide={() => setShowEditFolderModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Folder</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleEditFolder();
                        }}
                    >
                        <Form.Group controlId="editFolderName">
                            <Form.Label>Folder Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={editFolder.name}
                                onChange={(e) =>
                                    setEditFolder({ ...editFolder, name: e.target.value })
                                }
                            />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="mt-3">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={showDeleteConfirmationModal} onHide={() => setShowDeleteConfirmationModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this {itemToDelete.type}?</p>
                    <Button variant="danger" onClick={handleDeleteItem} className="me-2">
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={() => setShowDeleteConfirmationModal(false)}>
                        Cancel
                    </Button>
                </Modal.Body>
            </Modal>

            {/* Add Component Modal */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Component</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const newComponent = {
                                name: e.target.componentName.value,
                                instruction: e.target.componentInstruction.value,
                            };
                            handleAddComponent(newComponent);
                        }}
                    >
                        <Form.Group controlId="addComponentName">
                            <Form.Label>Component Name</Form.Label>
                            <Form.Control type="text" name="componentName" />
                        </Form.Group>
                        <Form.Group controlId="addComponentInstruction" className="mt-3">
                            <Form.Label>Instruction</Form.Label>
                            <Form.Control as="textarea" rows={4} name="componentInstruction" />
                        </Form.Group>
                        <Button type="submit" variant="primary" className="mt-3">
                            Add Component
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Modals;