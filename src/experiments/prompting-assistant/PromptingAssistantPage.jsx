import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DragDropContext } from '@hello-pangea/dnd';
import ComponentsList from "./ComponentsList";
import MainContent from "./MainContent";
import Modals from "./Modals";
import { v4 as uuidv4 } from 'uuid';
import './styles.css'; // Import the styles

const PromptingAssistantPage = () => {
    const [components, setComponents] = useState([
        {
            id: 'folder-1',
            name: "Default Folder",
            components: [
                {
                    name: "Text Editor",
                    instruction: "Write a creative story using the text editor.",
                    pinned: false,
                },
                {
                    name: "Markdown Preview",
                    instruction: "Preview your Markdown content in real-time.",
                    pinned: false,
                },
            ]
        },
    ]);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [inputText, setInputText] = useState("");
    const [editComponent, setEditComponent] = useState({ name: "", instruction: "", pinned: false });
    const [showEditModal, setShowEditModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAddFolderModal, setShowAddFolderModal] = useState(false);
    const [showEditFolderModal, setShowEditFolderModal] = useState(false);
    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const [editFolder, setEditFolder] = useState({ id: "", name: "" });
    const [itemToDelete, setItemToDelete] = useState({ type: null, id: null, folderId: null });
    const [isDragging, setIsDragging] = useState(false);
    const [draggedItemId, setDraggedItemId] = useState(null);
    const [folderExpanded, setFolderExpanded] = useState({}); // Track expanded state of each folder

    // Default select the first component
    useEffect(() => {
        if (components.length > 0 && components[0].components.length > 0) {
            setSelectedComponent(components[0].components[0]);
        }
        // Initialize all folders to expanded
        const initialExpandedState = components.reduce((acc, folder) => {
            acc[folder.id] = true;
            return acc;
        }, {});
        setFolderExpanded(initialExpandedState);
    }, [components]);

    // generate a new id
    const generateId = () => uuidv4();

    // Copy to clipboard
    const handleCopyToClipboard = () => {
        if (selectedComponent) {
            const combinedText = `${selectedComponent.instruction}\n\n${inputText}`;
            navigator.clipboard.writeText(combinedText);
            alert("Copied to clipboard: " + combinedText);
        } else {
            alert("Please select a component first.");
        }
    };

    // Clear input text
    const handleClearInput = () => {
        setInputText("");
    };

    // Edit component
    const handleEditComponent = () => {
        setComponents(prevComponents => {
            return prevComponents.map(folder => {
                const updatedComponents = folder.components.map(component =>
                    component.name === editComponent.name
                        ? { ...editComponent }
                        : component
                );
                return { ...folder, components: updatedComponents };
            })
        });
        setSelectedComponent(editComponent);
        setShowEditModal(false);
    };

    const handleAddComponent = (newComponent) => {
        setComponents((prevComponents) =>
            prevComponents.map(folder => {
                if (selectedComponent && folder.id === selectedComponent.id) {
                    return { ...folder, components: [...folder.components, { ...newComponent, pinned: false }] }
                }
                return folder;
            })
        );
        setShowAddModal(false);
    };

    const handleAddFolder = (folderName) => {
        const newFolder = {
            id: generateId(),
            name: folderName,
            components: [],
        }
        setComponents([...components, newFolder]);
        setFolderExpanded({ ...folderExpanded, [newFolder.id]: true })
        setShowAddFolderModal(false);
    }

    const handleEditFolder = () => {
        setComponents(prevComponents => {
            return prevComponents.map(folder => {
                if (folder.id === editFolder.id) {
                    return { ...folder, name: editFolder.name }
                }
                return folder;
            })
        })
        setShowEditFolderModal(false);
    }
    // Pin component
    const handlePinComponent = (componentName, folderId) => {
        setComponents((prevComponents) => {
            return prevComponents.map((folder) => {
                if (folder.id === folderId) {
                    const updatedComponents = folder.components.map((component) =>
                        component.name === componentName
                            ? { ...component, pinned: !component.pinned }
                            : component
                    );

                    const pinnedComponents = updatedComponents.filter((component) => component.pinned);
                    const unpinnedComponents = updatedComponents.filter((component) => !component.pinned);
                    return { ...folder, components: [...pinnedComponents, ...unpinnedComponents] };
                }
                return folder
            });
        });
    };

    const handleDeleteItem = () => {
        if (itemToDelete.type === "folder") {
            setComponents((prevComponents) =>
                prevComponents.filter((folder) => folder.id !== itemToDelete.id)
            );
            const { [itemToDelete.id]: deletedFolder, ...restExpanded } = folderExpanded;
            setFolderExpanded(restExpanded);
        } else if (itemToDelete.type === "component") {
            setComponents((prevComponents) =>
                prevComponents.map((folder) => {
                    if (folder.id === itemToDelete.folderId) {
                        return {
                            ...folder,
                            components: folder.components.filter(
                                (component) => component.name !== itemToDelete.id
                            ),
                        };
                    }
                    return folder;
                })
            );
            if (selectedComponent.name === itemToDelete.id) {
                setSelectedComponent(null);
            }
        }
        setShowDeleteConfirmationModal(false);
    };

    const handleOpenDeleteModal = (type, id, folderId) => {
        setItemToDelete({ type, id, folderId });
        setShowDeleteConfirmationModal(true);
    };

    const handleInstructionDoubleClick = (component) => {
        setEditComponent(component);
        setShowEditModal(true);
    };
    const onDragStart = (start) => {
        setIsDragging(true);
        setDraggedItemId(start.draggableId);
    };

    const onDragEnd = (result) => {
        setIsDragging(false);
        setDraggedItemId(null);
        const { destination, source, draggableId, type } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }
        if (type === "folder") {
            const newFolders = Array.from(components);
            const [removed] = newFolders.splice(source.index, 1);
            newFolders.splice(destination.index, 0, removed);
            setComponents(newFolders);
            return;
        }
        if (type === 'component') {
            let sourceFolder, destinationFolder, movedComponent;
            setComponents((prevComponents) => {
                const updatedComponents = prevComponents.map((folder) => {
                    if (folder.id === source.droppableId) {
                        sourceFolder = folder;
                        const [removed] = folder.components.splice(source.index, 1);
                        movedComponent = removed;
                        return { ...folder, components: folder.components }
                    }
                    return folder;
                });
                const updateDestination = updatedComponents.map(folder => {
                    if (folder.id === destination.droppableId) {
                        destinationFolder = folder;
                        folder.components.splice(destination.index, 0, movedComponent);
                        return { ...folder, components: folder.components }
                    }
                    return folder;
                })
                return updateDestination
            });
        }
    };
    const handleToggleFolder = (folderId) => {
        setFolderExpanded((prevState) => ({
            ...prevState,
            [folderId]: !prevState[folderId]
        }))
    };

    const handleEditFolderClick = (e, folder) => {
        e.stopPropagation();
        setEditFolder(folder);
        setShowEditFolderModal(true);
    }
    const handleEditComponentClick = (e, component) => {
        e.stopPropagation();
        setEditComponent(component);
        setShowEditModal(true);
    };


    return (
        <Container fluid>
            <DragDropContext onDragEnd={onDragEnd} onDragStart={onDragStart}>
                <Row>
                    {/* Sidebar */}
                    <Col md={3} className="bg-light vh-100 p-3" style={{ overflowY: "auto" }}>
                        <h5>Components</h5>
                        <ComponentsList
                            components={components}
                            folderExpanded={folderExpanded}
                            selectedComponent={selectedComponent}
                            handleToggleFolder={handleToggleFolder}
                            handleOpenDeleteModal={handleOpenDeleteModal}
                            handlePinComponent={handlePinComponent}
                            setSelectedComponent={setSelectedComponent}
                            handleEditFolderClick={handleEditFolderClick}
                            handleEditComponentClick={handleEditComponentClick}
                            setShowAddModal={setShowAddModal}
                            isDragging={isDragging}
                        />
                    </Col>
                    {/* Main Content */}
                    <MainContent
                        selectedComponent={selectedComponent}
                        inputText={inputText}
                        setInputText={setInputText}
                        handleCopyToClipboard={handleCopyToClipboard}
                        handleClearInput={handleClearInput}
                        handleInstructionDoubleClick={handleInstructionDoubleClick}
                    />
                </Row>
            </DragDropContext>
            <Modals
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                editComponent={editComponent}
                setEditComponent={setEditComponent}
                handleEditComponent={handleEditComponent}
                showAddModal={showAddModal}
                setShowAddModal={setShowAddModal}
                handleAddComponent={handleAddComponent}
                showAddFolderModal={showAddFolderModal}
                setShowAddFolderModal={setShowAddFolderModal}
                handleAddFolder={handleAddFolder}
                showEditFolderModal={showEditFolderModal}
                setShowEditFolderModal={setShowEditFolderModal}
                editFolder={editFolder}
                setEditFolder={setEditFolder}
                handleEditFolder={handleEditFolder}
                showDeleteConfirmationModal={showDeleteConfirmationModal}
                setShowDeleteConfirmationModal={setShowDeleteConfirmationModal}
                handleDeleteItem={handleDeleteItem}
                itemToDelete={itemToDelete}
            />
        </Container>
    );
};

export default PromptingAssistantPage;