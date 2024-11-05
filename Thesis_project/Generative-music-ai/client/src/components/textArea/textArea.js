import React from "react";
import "./textArea.css";
import { TexT } from "monday-ui-react-core";

const TextArea = ({ label, onChange }) => {
	// Determine the class for the text area based on the size prop

	return (
		<div className="brutalist-container" style={{ justifyContent: "center", display: "flex", flexDirection: "column", width: "600px" }}>
			<label className="brutalist-label" style={{ paddingLeft: "5px", paddingRight: "2px" }}>
				{label}
			</label>
			<textarea className="brutalist-input smooth-type" placeholder="TYPE WHAT'S ON YOUR MIND" onChange={onChange} style={{ height: "180px", width: "550px" }} spellCheck={false} />
		</div>
	);
};

export default TextArea;
