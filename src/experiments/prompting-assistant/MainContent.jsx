import React from "react";
import { Col, Form, Button } from "react-bootstrap";

const MainContent = ({
    selectedComponent,
    inputText,
    setInputText,
    handleCopyToClipboard,
    handleClearInput,
    handleInstructionDoubleClick
}) => {
    return (
        <Col md={9} className="p-4">
            {selectedComponent ? (
                <div>
                    <h4>{selectedComponent.name}</h4>
                    <div
                        className="border p-3 mb-3"
                        style={{
                            maxHeight: "150px",
                            overflowY: "auto",
                            whiteSpace: "pre-wrap",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                        onDoubleClick={() => handleInstructionDoubleClick(selectedComponent)}
                    >
                        {selectedComponent.instruction}
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