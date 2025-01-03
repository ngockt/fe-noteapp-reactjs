//src/experiments/prompting-assistant/PromptingAssistantPage.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { DragDropContext } from "@hello-pangea/dnd";
import ComponentsList from "./ComponentsList";
import MainContent from "./MainContent";
import Modals from "./Modals";
import { v4 as uuidv4 } from "uuid";
import "./styles.css"; // Import the styles
import { getRequest } from 'apis/services';
import ENDPOINTS from 'apis/endpoints';

const PromptingAssistantPage = () => {
  // ---------- NEW: Track the selected folder separately ----------
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  // ----------------------------------------------------------------

  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [inputText, setInputText] = useState("");
  const [editComponent, setEditComponent] = useState({ name: "", instruction: "", pinned: false });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddFolderModal, setShowAddFolderModal] = useState(false);
  const [showEditFolderModal, setShowEditFolderModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const [editFolder, setEditFolder] = useState({ id: "", name: "" });
  const [itemToDelete, setItemToDelete] = useState({ type: null, id: null, folderId: null });
  const [isDragging, setIsDragging] = useState(false);
  const [folderExpanded, setFolderExpanded] = useState({});

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getRequest(ENDPOINTS.EXPERIMENTS.PROMPTS);
        if (response && response.length > 0) {
          setComponents(response);

          // Initialize all folders to expanded
          const initialExpandedState = response.reduce((acc, folder) => {
            acc[folder.id] = true;
            return acc;
          }, {});
          setFolderExpanded(initialExpandedState);

          // Set the first folder as selected, and first component in that folder
          setSelectedFolderId(response[0].id);
          if (response[0].components && response[0].components.length > 0) {
            setSelectedComponent(response[0].components[0]);
          }
        }
      } catch (error) {
        console.log("Error fetching prompts:", error);
      }
    };
    fetchData();
  }, []);

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

  // ---------- UPDATED: handleAddComponent uses selectedFolderId ----------
  const handleAddComponent = (newComponent) => {
    const newComponentWithId = {
      ...newComponent,
      id: generateId(),
      pinned: false
    };

    setComponents((prevComponents) => {
      // If we have a folder selected, add the component to that folder
      if (selectedFolderId) {
        return prevComponents.map((folder) => {
          if (folder.id === selectedFolderId) {
            const updatedComponents = [...folder.components, newComponentWithId];
            return {
              ...folder,
              components: updatedComponents,
            };
          }
          return folder;
        });
      } else {
        // If no folder is selected:
        // 1. If we have at least one folder, add to the first folder
        if (prevComponents && prevComponents.length > 0) {
          const firstFolderId = prevComponents[0].id;
          return prevComponents.map((folder) => {
            if (folder.id === firstFolderId) {
              const updatedComponents = [...folder.components, newComponentWithId];
              return { ...folder, components: updatedComponents };
            }
            return folder;
          });
        } else {
          // 2. If no folders exist, create a new one and add the component
          const newFolder = {
            id: generateId(),
            name: "New Folder",
            components: [newComponentWithId],
          };
          setFolderExpanded({ [newFolder.id]: true });
          // Also set that folder as selected
          setSelectedFolderId(newFolder.id);
          return [newFolder];
        }
      }
    });

    // Optionally set the newly created component as selected
    setSelectedComponent(newComponentWithId);

    // Hide the modal
    setShowAddModal(false);
  };
  // ------------------------------------------------------------------------

  // ---------- UPDATED: handleAddFolder sets the folder as selected ----------
  const handleAddFolder = (folderName) => {
    const newFolder = {
      id: generateId(),
      name: folderName,
      components: [],
    };
    setComponents((prevComponents) => [...prevComponents, newFolder]);
    setFolderExpanded((prev) => ({ ...prev, [newFolder.id]: true }));

    // Make this newly created folder the selected folder
    setSelectedFolderId(newFolder.id);

    setShowAddFolderModal(false);
  };
  // --------------------------------------------------------------------------

  const handleEditFolder = () => {
    setComponents((prevComponents) => {
      return prevComponents.map((folder) => {
        if (folder.id === editFolder.id) {
          return { ...folder, name: editFolder.name };
        }
        return folder;
      });
    });
    setShowEditFolderModal(false);
  };

  // Pin component
  const handlePinComponent = (componentName, folderId) => {
    setComponents((prevComponents) => {
      return prevComponents.map((folder) => {
        if (folder.id === folderId) {
          const updatedComponents = folder.components.map((component) =>
            component.name === componentName ? { ...component, pinned: !component.pinned } : component
          );

          const pinnedComponents = updatedComponents.filter((component) => component.pinned);
          const unpinnedComponents = updatedComponents.filter((component) => !component.pinned);
          return { ...folder, components: [...pinnedComponents, ...unpinnedComponents] };
        }
        return folder;
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

      // If we're deleting the folder that was selected, clear it out
      if (selectedFolderId === itemToDelete.id) {
        setSelectedFolderId(null);
        setSelectedComponent(null);
      }
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

      // If the deleted component was currently selected, clear it
      if (selectedComponent?.name === itemToDelete.id) {
        setSelectedComponent(null);
      }
    }
    setShowDeleteConfirmationModal(false);
  };

  const handleOpenDeleteModal = (type, id, folderId) => {
    setItemToDelete({ type, id, folderId });
    setShowDeleteConfirmationModal(true);
  };

  const onDragStart = (start) => {
    setIsDragging(true);
  };

  const onDragEnd = (result) => {
    setIsDragging(false);
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Reordering folders
    if (type === "folder") {
      const newFolders = Array.from(components);
      const [removed] = newFolders.splice(source.index, 1);
      newFolders.splice(destination.index, 0, removed);
      setComponents(newFolders);
      return;
    }

    // Reordering components
    if (type === "component") {
      let movedComponent;
      setComponents((prevComponents) => {
        const updatedComponents = prevComponents.map((folder) => {
          if (folder.id === source.droppableId) {
            const [removed] = folder.components.splice(source.index, 1);
            movedComponent = removed;
            return { ...folder, components: folder.components };
          }
          return folder;
        });
        return updatedComponents.map((folder) => {
          if (folder.id === destination.droppableId) {
            folder.components.splice(destination.index, 0, movedComponent);
            return { ...folder, components: folder.components };
          }
          return folder;
        });
      });
    }
  };

  const handleToggleFolder = (folderId) => {
    setFolderExpanded((prevState) => ({
      ...prevState,
      [folderId]: !prevState[folderId],
    }));
  };

  // When user double-clicks to edit instruction inline
  const handleInstructionDoubleClick = (component) => {
    setComponents((prevComponents) => {
      return prevComponents.map((folder) => {
        const updatedComps = folder.components.map((c) => {
          if (c.id === component.id) {
            return { ...c, instruction: component.instruction };
          }
          return c;
        });
        return { ...folder, components: updatedComps };
      });
    });
    // Keep the updated component as selected
    setSelectedComponent(component);
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
              // We pass the selectedFolderId and setter so that
              // ComponentsList can call them as needed:
              selectedFolderId={selectedFolderId}
              setSelectedFolderId={setSelectedFolderId}

              handleToggleFolder={handleToggleFolder}
              handleOpenDeleteModal={handleOpenDeleteModal}
              handlePinComponent={handlePinComponent}
              setSelectedComponent={setSelectedComponent}
              isDragging={isDragging}
              setComponents={setComponents}
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
        showEditModal={false}
        setShowEditModal={() => {}}
        editComponent={editComponent}
        setEditComponent={() => {}}
        handleEditComponent={() => {}}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        handleAddComponent={handleAddComponent}
        showAddFolderModal={showAddFolderModal}
        setShowAddFolderModal={setShowAddFolderModal}
        handleAddFolder={handleAddFolder}
        showEditFolderModal={showEditFolderModal}
        setShowEditFolderModal={setShowEditFolderModal}
        editFolder={editFolder}
        setEditFolder={() => {}}
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
