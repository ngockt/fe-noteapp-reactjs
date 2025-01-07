import React from 'react';
import './DocsPage.css';

const DocsPage = () => {
    const terms = [
        {
            term: "Domain",
            definition: "A broad area of knowledge or expertise encompassing multiple disciplines and fields.",
            scope: "Very broad and overarching.",
            example: "Science, Arts, Technology.",
            exercise: "Researching a major domain like Science and identifying its fields."
        },
        {
            term: "Field",
            definition: "A specific area within a domain, focusing on a particular set of principles and knowledge.",
            scope: "Broad but more specific.",
            example: "Physics (within Science), Literature (within Arts).",
            exercise: "Categorizing examples of different fields like Physics or Biology."
        },
        {
            term: "Branch",
            definition: "A subdivision of a field, concentrating on specialized topics or applications.",
            scope: "Narrower subset of a field.",
            example: "Astrophysics (within Physics), Poetry (within Literature).",
            exercise: "Listing various branches within Physics (e.g., Mechanics, Optics)."
        },
        {
            term: "Subject",
            definition: "A specific area of study within a branch, often taught or researched independently.",
            scope: "Practical and teachable unit.",
            example: "Thermodynamics (within Astrophysics), Romantic Poetry (within Poetry).",
            exercise: "Solving problems related to Thermodynamics or analyzing a Romantic poem."
        },
        {
            term: "Topic",
            definition: "A focused area of discussion or study within a subject, usually part of a larger framework.",
            scope: "More focused and specific.",
            example: "Laws of Thermodynamics (in Thermodynamics), Themes in Romantic Poetry.",
            exercise: "Writing a short essay on a topic like 'Second Law of Thermodynamics.'"
        },
        {
            term: "Concept",
            definition: "A fundamental idea, principle, or abstraction within a topic that forms the basis of understanding.",
            scope: "Most focused and foundational.",
            example: "Entropy (in Thermodynamics), 'Sublime' (in Romantic Poetry).",
            exercise: "Explaining a concept like Entropy in your own words."
        },
        {
            term: "Note",
            definition: "A brief record of facts, topics, or thoughts, written down as an aid to memory, often used to supplement understanding or learning within any level of the knowledge hierarchy.",
            scope: "Can be broad or specific, depending on the context.",
            example: "Jotting down key points from a lecture on the Laws of Thermodynamics or writing a summary of the concept of Entropy.",
            exercise: "Creating concise notes summarizing the main ideas of a chapter on thermodynamic processes."
        },
        {
            term: "Example",
            definition: "A specific instance or illustration used to explain a concept or idea within any of the above levels.",
            scope: "Practical demonstration.",
            example: "Demonstrating the First Law of Thermodynamics with a real-world example.",
            exercise: "Observing a teacher’s solved problem on thermodynamic energy conservation."
        },
        {
            term: "Exercise",
            definition: "A task or problem designed for practice or testing skills within any of the above levels.",
            scope: "Requires active application.",
            example: "Calculating energy efficiency of a system using thermodynamic principles.",
            exercise: "Solving new problems based on the examples provided earlier."
        },
        {
            term: "Quiz",
            definition: "A set of questions designed to assess a person's knowledge on a particular subject, topic, or concept. It can be used at any level of the knowledge hierarchy to test understanding and retention.",
            scope: "Varies; can be used across all levels for assessment.",
            example: "A multiple-choice quiz on different types of thermodynamic systems or a quiz assessing understanding of the concept of 'Sublime' in Romantic Poetry.",
            exercise: "Taking a quiz to test knowledge of various thermodynamic principles or answering questions about key themes in Romantic Poetry."
        },
        {
            term: "Node",
            definition: "A structural element representing an entity or concept, used to model hierarchical or relational data.",
            scope: "Represents domains, fields, branches, subjects, topics, or concepts.",
            example: "A 'Physics' node representing a field within the domain of Science.",
            exercise: "Creating nodes for domains, fields, and branches in a diagram."
        },
        {
            term: "Edge",
            definition: "A connection between two nodes that defines their relationship within a structured model.",
            scope: "Represents relationships like 'contains', 'next to', or 'prerequisite to'.",
            example: "An edge labeled 'contains' linking a 'Physics' node to an 'Astrophysics' node.",
            exercise: "Modeling relationships between nodes like 'prerequisite to' for subject dependencies."
        }
    ];

    return (
        <div className="docs-page">
            <h1>Term & Definition</h1>
            <table>
                <thead>
                    <tr>
                        <th>Term</th>
                        <th>Definition</th>
                        <th>Scope</th>
                        <th>Example</th>
                        <th>Exercise</th>
                    </tr>
                </thead>
                <tbody>
                    {terms.map((termData) => (
                        <tr key={termData.term}>
                            <td>{termData.term}</td>
                            <td>{termData.definition}</td>
                            <td>{termData.scope}</td>
                            <td>{termData.example}</td>
                            <td>{termData.exercise}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocsPage;
