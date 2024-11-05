import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import HoverButton from "../hoverButton/HoverButton.js";
import { startScreenRecording } from "../../services/Api.js";

const StartSession = () => {
	const navigate = useNavigate();
	const onClick = () => {
		startScreenRecording();
		navigate("/home");
	};

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "78vh" }}>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						flexDirection: "row",
						marginTop: "15px",
						justifyContent: "space-between",
					}}>
					<div style={{ marginLeft: "10px" }}>
						<HoverButton onclick={onClick} text="Start Session" color="#FF6B6B" width="300px" height="100px" />
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default StartSession;
