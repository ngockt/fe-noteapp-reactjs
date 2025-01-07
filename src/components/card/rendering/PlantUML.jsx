// src/components/contents/rendering/PlantUML.jsx
import React, { useEffect, useState } from "react";
import plantumlEncoder from "plantuml-encoder";

const PlantUML = ({ content }) => {
    const [plantUMLText, setPlantUMLText] = useState('');
    useEffect(() => {
        if (content) {
            setPlantUMLText(content || []);
        }
    }, [content]);
    // Encode the PlantUML text
    const encodedDiagram = plantumlEncoder.encode(plantUMLText);

    // Generate the PlantUML diagram URL
    const plantUMLUrl = `https://www.plantuml.com/plantuml/svg/${encodedDiagram}`;

    return (
        <div style={{ marginTop: "20px" }}>
            <img src={plantUMLUrl} alt="PlantUML Diagram" />
        </div>
    );
};

export default PlantUML;
