import React from "react";
import { ListGroup } from "react-bootstrap";
import { FiEdit2 } from "react-icons/fi";
import { FaThumbtack, FaFolder, FaFolderOpen, FaTrash } from "react-icons/fa";
import { Droppable, Draggable } from 'react-beautiful-dnd';

const ComponentsList = ({
     components,
     folderExpanded,
     selectedComponent,
     handleToggleFolder,
     handleOpenDeleteModal,
    handlePinComponent,
    setSelectedComponent,
    handleEditFolderClick,
    handleEditComponentClick,
    setShowAddModal,
    isDragging
}) => {
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
                                        className={
                                            snapshot.isDragging ? "grabbing-item" : ""
                                        }
                                    >
                                        <ListGroup.Item
                                            key={folder.id}
                                            className="d-flex justify-content-between align-items-center"
                                            style={{ backgroundColor: "#f0f0f0", cursor: "pointer" }}
                                            onClick={() => handleToggleFolder(folder.id)}
                                        >
                                            <div className="d-flex align-items-center">
                                                {folderExpanded[folder.id] ?
                                                    <FaFolderOpen size={20} style={{ marginRight: "5px" }} />
                                                    :
                                                    <FaFolder size={20} style={{ marginRight: "5px" }} />
                                                }
                                                <span  >{folder.name}</span>
                                                  <FiEdit2
                                                      size={18}
                                                      style={{ cursor: "pointer", marginLeft: "5px" }}
                                                        onClick={(e) => handleEditFolderClick(e, folder)}
                                                  />
                                            </div>
                                            <FaTrash
                                                size={18}
                                                style={{ cursor: "pointer", marginLeft: "5px" }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleOpenDeleteModal("folder", folder.id);
                                                }}
                                            />
                                        </ListGroup.Item>
                                        {folderExpanded[folder.id] &&
                                            <Droppable droppableId={folder.id} type="component">
                                                {(provided) => (
                                                    <div ref={provided.innerRef} {...provided.droppableProps}>
                                                        {folder.components.map((component, index) => (
                                                            <Draggable key={component.name} draggableId={component.name} index={index}>
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
                                                                            className="d-flex justify-content-between align-items-center"
                                                                            onClick={() => setSelectedComponent(component)}
                                                                        >
                                                                            <span style={{ marginLeft: "20px" }}>{component.name}</span>
                                                                            <div className="d-flex align-items-center">
                                                                                 <FiEdit2
                                                                                    size={18}
                                                                                    style={{ cursor: "pointer", marginLeft: "5px" }}
                                                                                     onClick={(e) => handleEditComponentClick(e, component)}
                                                                                 />
                                                                                <FaThumbtack
                                                                                    size={18}
                                                                                    style={{
                                                                                        cursor: "pointer",
                                                                                        color: component.pinned ? "blue" : "black",
                                                                                    }}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handlePinComponent(component.name, folder.id);
                                                                                    }}
                                                                                />
                                                                                <FaTrash
                                                                                    size={18}
                                                                                    style={{ cursor: "pointer", marginLeft: "5px" }}
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation();
                                                                                        handleOpenDeleteModal("component", component.name, folder.id);
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
                                                            onClick={() => { setShowAddModal(true); setSelectedComponent(folder) }}
                                                        >
                                                            <strong style={{ marginLeft: "20px" }}>+</strong> Add Component
                                                        </ListGroup.Item>
                                                    </div>
                                                )}
                                            </Droppable>
                                        }
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
                onClick={() => setShowAddModal(true)}
            >
                <strong>+</strong> Add Folder
            </ListGroup.Item>
        </ListGroup>

    );
};

export default ComponentsList;