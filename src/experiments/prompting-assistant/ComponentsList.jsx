import React, { useState, useRef, useEffect } from "react";
import { ListGroup, Form } from "react-bootstrap";
import { FiEdit2 } from "react-icons/fi";
import { FaThumbtack, FaFolder, FaFolderOpen, FaTrash } from "react-icons/fa";
import { Droppable, Draggable } from "@hello-pangea/dnd";

const ComponentsList = ({
    components,
    folderExpanded,
    selectedComponent,
    handleToggleFolder,
    handleOpenDeleteModal,
    handlePinComponent,
    setSelectedComponent,
    isDragging,
    setComponents,
}) => {
    const [editingItem, setEditingItem] = useState({ type: null, id: null });
    const [editValue, setEditValue] = useState("");
    const inputRef = useRef(null);


    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingItem])

    const handleStartEdit = (e, type, id, name) => {
        e.stopPropagation();
        setEditingItem({ type, id });
        setEditValue(name)

    };


    const handleSaveEdit = (e, type, id, folderId) => {
        e.stopPropagation();
        setEditingItem({ type: null, id: null });
        setComponents((prevComponents) => {
            return prevComponents.map((folder) => {
                if (type === "folder" && folder.id === id) {
                    return { ...folder, name: editValue }
                } else if (type === 'component' && folder.id === folderId) {
                    const updatedComponents = folder.components.map((component) => {
                        if (component.name === id) {
                            return { ...component, name: editValue }
                        }
                        return component;
                    })
                    return { ...folder, components: updatedComponents }
                }
                return folder;
            });
        });

    };

    const handleCancelEdit = (e) => {
        e.stopPropagation();
        setEditingItem({ type: null, id: null });
    };

    return (
        <ListGroup style={{ maxHeight: "80vh", overflowY: "auto" }}>
            <Droppable droppableId="sidebar-folders" type="folder">
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        {components.map((folder, index) => (
                            <Draggable key={folder.id} draggableId={folder.id} index={index}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={snapshot.isDragging ? "grabbing-item" : ""}
                                    >
                                        <ListGroup.Item
                                            key={folder.id}
                                            className="d-flex justify-content-between align-items-center component-list-item"
                                            style={{ backgroundColor: "#f0f0f0", cursor: "pointer" }}
                                            onClick={() => handleToggleFolder(folder.id)}
                                        >
                                            <div className="d-flex align-items-center flex-grow-1">
                                                {folderExpanded[folder.id] ? (
                                                    <FaFolderOpen size={20} style={{ marginRight: "5px" }} />
                                                ) : (
                                                    <FaFolder size={20} style={{ marginRight: "5px" }} />
                                                )}
                                                {(editingItem.type !== "folder" || (editingItem.id !== folder.id)) ? (
                                                    <span className="flex-grow-1" >{folder.name}</span>
                                                ) : (
                                                    <Form.Control
                                                        type="text"
                                                        value={editValue}
                                                        ref={inputRef}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        onBlur={(e) => handleSaveEdit(e, "folder", folder.id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                handleSaveEdit(e, "folder", folder.id);
                                                            }
                                                            if (e.key === 'Escape') {
                                                                handleCancelEdit(e);
                                                            }
                                                        }}

                                                    />
                                                )}
                                            </div>
                                            <div className="d-flex align-items-center">
                                                {(editingItem.type !== "folder" || (editingItem.id !== folder.id)) && (
                                                    <FiEdit2
                                                        size={18}
                                                        style={{ cursor: "pointer", marginRight: "5px" }}
                                                        onClick={(e) => handleStartEdit(e, "folder", folder.id, folder.name)}
                                                    />
                                                )}
                                                <FaTrash
                                                    size={18}
                                                    style={{ cursor: "pointer", marginLeft: "5px" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleOpenDeleteModal("folder", folder.id);
                                                    }}
                                                />
                                            </div>
                                        </ListGroup.Item>
                                        {folderExpanded[folder.id] && (
                                            <Droppable droppableId={folder.id} type="component">
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                                        {folder.components.map((component, index) => (
                                                            <Draggable
                                                                key={component.name}
                                                                draggableId={component.name}
                                                                index={index}
                                                            >
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        className={
                                                                            snapshot.isDragging ? "grabbing-item" : ""
                                                                        }
                                                                    >
                                                                        <ListGroup.Item
                                                                            key={index}
                                                                            className="d-flex justify-content-between align-items-center  component-list-item"
                                                                            onClick={() => setSelectedComponent(component)}
                                                                        >
                                                                            <div className="d-flex align-items-center flex-grow-1">
                                                                                {(editingItem.type !== "component" || (editingItem.id !== component.name)) ? (
                                                                                    <span style={{ marginLeft: "20px" }} className="flex-grow-1">
                                                                                        {component.name}
                                                                                    </span>
                                                                                ) : (
                                                                                    <Form.Control
                                                                                        type="text"
                                                                                        value={editValue}
                                                                                        ref={inputRef}
                                                                                        onChange={(e) => setEditValue(e.target.value)}
                                                                                        onBlur={(e) => handleSaveEdit(e, "component", component.name, folder.id)}
                                                                                        onKeyDown={(e) => {
                                                                                            if (e.key === "Enter") {
                                                                                                handleSaveEdit(e, "component", component.name, folder.id);
                                                                                            }
                                                                                            if (e.key === 'Escape') {
                                                                                                handleCancelEdit(e);
                                                                                            }
                                                                                        }}

                                                                                    />
                                                                                )}
                                                                            </div>
                                                                            <div className="d-flex align-items-center">
                                                                                {(editingItem.type !== "component" || (editingItem.id !== component.name)) && (
                                                                                    <FiEdit2
                                                                                        size={18}
                                                                                        style={{ cursor: "pointer", marginRight: "5px" }}
                                                                                        onClick={(e) => handleStartEdit(e, "component", component.name, component.name)}
                                                                                    />
                                                                                )}
                                                                                <FaThumbtack
                                                                                    size={18}
                                                                                    style={{
                                                                                        cursor: "pointer",
                                                                                        color: component.pinned ? "blue" : "black",
                                                                                    }}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handlePinComponent(
                                                                                            component.name,
                                                                                            folder.id
                                                                                        );
                                                                                    }}
                                                                                />
                                                                                <FaTrash
                                                                                    size={18}
                                                                                    style={{ cursor: "pointer", marginLeft: "5px" }}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleOpenDeleteModal(
                                                                                            "component",
                                                                                            component.name,
                                                                                            folder.id
                                                                                        );
                                                                                    }}
                                                                                />
                                                                            </div>
                                                                        </ListGroup.Item>
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}
                                                        {provided.placeholder}
                                                        <ListGroup.Item
                                                            role="button"
                                                            className="text-center"
                                                            onClick={() => {
                                                                setSelectedComponent(folder);
                                                            }}
                                                        >
                                                            <strong style={{ marginLeft: "20px" }}>+</strong> Add Component
                                                        </ListGroup.Item>
                                                    </div>
                                                )}
                                            </Droppable>
                                        )}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
            <ListGroup.Item
                role="button"
                className="text-center"
                onClick={() => console.log("add new folder")}
            >
                <strong>+</strong> Add Folder
            </ListGroup.Item>
        </ListGroup>
    );
};

export default ComponentsList;