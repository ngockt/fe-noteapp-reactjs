import React from "react";

const DocsPage = () => {
    return (
        <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
            <h1 style={{ textAlign: "center", color: "#4CAF50" }}>Knowledge Hierarchy</h1>
            <table
                style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "20px 0",
                    fontSize: "16px",
                    textAlign: "left",
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Term</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Definition</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Scope</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Example</th>
                        <th style={{ border: "1px solid #ddd", padding: "8px" }}>Exercise</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Domain</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            A broad area of knowledge or expertise encompassing multiple disciplines and fields.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Very broad and overarching.</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Science, Arts, Technology.</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Researching a major domain like Science and identifying its fields.
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Field</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            A specific area within a domain, focusing on a particular set of principles and knowledge.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Broad but more specific.</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Physics (within Science), Literature (within Arts).
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Categorizing examples of different fields like Physics or Biology.
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Branch</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            A subdivision of a field, concentrating on specialized topics or applications.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Narrower subset of a field.</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Astrophysics (within Physics), Poetry (within Literature).
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Listing various branches within Physics (e.g., Mechanics, Optics).
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Subject</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            A specific area of study within a branch, often taught or researched independently.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Practical and teachable unit.</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Thermodynamics (within Astrophysics), Romantic Poetry (within Poetry).
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Solving problems related to Thermodynamics or analyzing a Romantic poem.
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Topic</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            A focused area of discussion or study within a subject, usually part of a larger framework.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>More focused and specific.</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Laws of Thermodynamics (in Thermodynamics), Themes in Romantic Poetry.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Writing a short essay on a topic like "Second Law of Thermodynamics."
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Concept</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            A fundamental idea, principle, or abstraction within a topic that forms the basis of understanding.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Most focused and foundational.</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Entropy (in Thermodynamics), "Sublime" (in Romantic Poetry).
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Explaining a concept like Entropy in your own words.
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Example</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            A specific instance or illustration used to explain a concept or idea within any of the above levels.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Practical demonstration.</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Demonstrating the First Law of Thermodynamics with a real-world example.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Observing a teacher’s solved problem on thermodynamic energy conservation.
                        </td>
                    </tr>
                    <tr>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Exercise</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            A task or problem designed for practice or testing skills within any of the above levels.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>Requires active application.</td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Calculating energy efficiency of a system using thermodynamic principles.
                        </td>
                        <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            Solving new problems based on the examples provided earlier.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default DocsPage;
