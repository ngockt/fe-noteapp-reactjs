import React, { useState, useRef, useEffect } from "react";
import { Col, Form, Button } from "react-bootstrap";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

const MainContent = ({
  selectedComponent,
  inputText,
  setInputText,
  handleCopyToClipboard,
  handleClearInput,
  handleInstructionDoubleClick
}) => {
  const [instructionExpanded, setInstructionExpanded] = useState(false);
  const [isEditingInstruction, setIsEditingInstruction] = useState(false);
  const [editInstruction, setEditInstruction] = useState("");
  const textAreaRef = useRef(null)


  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isEditingInstruction]);

  const toggleInstruction = (e) => {
    e.stopPropagation();
    setInstructionExpanded(!instructionExpanded);
  };


  const handleStartInstructionEdit = (e) => {
    e.stopPropagation();
    setIsEditingInstruction(true);
    setEditInstruction(selectedComponent.instruction);
  };

  const handleSaveInstructionEdit = (e) => {
    e.stopPropagation();
    setIsEditingInstruction(false);

    // update instruction in the main state
    // we need to set component and update the instruction
    handleInstructionDoubleClick({ ...selectedComponent, instruction: editInstruction });
  };

  const handleCancelInstructionEdit = (e) => {
    e.stopPropagation();
    setIsEditingInstruction(false);
  };

  return (
    <Col md={9} className="p-4">
      {selectedComponent ? (
        <div>
          <h4>{selectedComponent.name}</h4>
          <div
            className={`instruction-container ${instructionExpanded ? "expanded" : ""
              }`}
            onClick={!isEditingInstruction ? handleStartInstructionEdit : () => { }}
          >
            {isEditingInstruction ? (
              <Form.Control
                as="textarea"
                rows={4}
                value={editInstruction}
                ref={textAreaRef}
                onChange={(e) => setEditInstruction(e.target.value)}
                onBlur={(e) => handleSaveInstructionEdit(e)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSaveInstructionEdit(e);
                  }
                  if (e.key === 'Escape') {
                    handleCancelInstructionEdit(e);
                  }
                }}
              />
            ) : (
              <div className="content">
                {selectedComponent.instruction}
              </div>
            )}
            <button className="toggle-button" onClick={toggleInstruction}>
              {instructionExpanded ? <AiOutlineUp /> : <AiOutlineDown />}
            </button>
          </div>
          <Form>
            <Form.Group controlId="inputText">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter additional input text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            </Form.Group>
            <div className="d-flex mt-3">
              <Button
                variant="success"
                onClick={handleCopyToClipboard}
                className="me-2"
                disabled={!inputText.trim()}
              >
                Copy Combined Text
              </Button>
              <Button variant="danger" onClick={handleClearInput}>
                Clear Text
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <p className="text-muted">Please select a component from the sidebar.</p>
      )}
    </Col>
  );
};

export default MainContent;