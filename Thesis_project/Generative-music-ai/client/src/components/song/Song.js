import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { BreadcrumbsBar, BreadcrumbItem, Button } from "monday-ui-react-core";
import { Workspace } from "monday-ui-react-core/icons";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import HoverButton from "../hoverButton/HoverButton.js";
import { logUserInteraction } from "../../services/Api";

const Song = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const songUrl = location.state?.song;

	useEffect(() => {
		const handleClick = (event) => {
			const interaction = {
				type: "click",
				element: event.target.tagName,
				timestamp: new Date().toISOString(),
			};
			logUserInteraction(interaction);
		};

		const handleBeforeUnload = (event) => {
			const interaction = {
				type: "navigation",
				url: window.location.href,
				timestamp: new Date().toISOString(),
			};
			logUserInteraction(interaction);
		};

		document.addEventListener("click", handleClick);
		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			document.removeEventListener("click", handleClick);
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	useEffect(() => {
		// Optionally, play the audio automatically when the component mounts
		const audioPlayer = document.getElementById("audioPlayer");
		if (audioPlayer) {
			audioPlayer.play().catch((error) => console.error("Error playing the audio:", error));
		}
	}, []);

	if (!songUrl) {
		return <div>No song URL provided.</div>;
	}

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<BreadcrumbsBar type={BreadcrumbsBar.types.NAVIGATION} style={{ position: "absolute", top: 0, left: 0 }}>
				<BreadcrumbItem icon={Workspace} text="Composure" Composure />
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "70vh" }}>
				<div style={{ display: "flex", justifyContent: "space-between", width: "40%" }}>
					<div style={{ backgroundColor: "#f0f0f0", border: "15px solid #000", borderRadius: "10px", width: "100%", height: "70%", marginTop: "2%", marginBottom: "30px", position: "relative", overflow: "hidden", transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)", boxShadow: "5px 5px 0 #000, 10px 10px 0 #FFB6C1" }}>
						<audio style={{ backgroundColor: "#f0f0f0", borderRadius: "10px", boxShadow: "0px 0px 10px rgba(0,0,0,0.1)", width: "100%", height: "100%" }} id="audioPlayer" controls src={songUrl}>
							Your browser does not support the audio element.
						</audio>
					</div>
				</div>
				<div style={{ marginTop: "50px" }}>
					<HoverButton text="Start Over" onclick={() => navigate("/home")} color="#FFB6C1" width="250px" height="100px" />
				</div>
			</div>
		</motion.div>
	);
};

export default Song;
