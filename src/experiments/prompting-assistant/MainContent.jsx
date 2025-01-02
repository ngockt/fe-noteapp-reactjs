import React, { useState } from "react";
import { Col, Form, Button } from "react-bootstrap";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

const MainContent = ({
  selectedComponent,
  inputText,
  setInputText,
  handleCopyToClipboard,
  handleClearInput,
  handleInstructionDoubleClick,
}) => {
  const [instructionExpanded, setInstructionExpanded] = useState(false);

  const toggleInstruction = (e) => {
    e.stopPropagation();
    setInstructionExpanded(!instructionExpanded);
  };
  return (
    <Col md={9} className="p-4">
      {selectedComponent ? (
        <div>
          <h4>{selectedComponent.name}</h4>
          <div
            className={`instruction-container ${
              instructionExpanded ? "expanded" : ""
            }`}
             onClick={handleInstructionDoubleClick}
          >
              <div className="content" >
                {selectedComponent.instruction}
            </div>
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