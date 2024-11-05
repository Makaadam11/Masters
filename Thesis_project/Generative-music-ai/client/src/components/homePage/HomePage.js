import React, { useState, useEffect } from "react";
import { Button, BreadcrumbItem, BreadcrumbsBar } from "monday-ui-react-core";
import { useNavigate } from "react-router-dom";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { motion } from "framer-motion";
import { CSSTransition } from "react-transition-group";
import "./HomePage.css";
import HoverButton from "../hoverButton/HoverButton.js";
import WaveCard from "../waveCard/WaveCard.js";
import { useHover } from "@uidotdev/usehooks";
import { stopScreenRecording, logUserInteraction, setDuration } from "../../services/Api.js";

const HomePage = () => {
	const navigate = useNavigate();
	const [waveCardProps, setWaveCardProps] = useState({ text: "", colors: ["#fff"] });
	const [selectedDuration, setSelectedDuration] = useState(30);

	const [hoverRef, isHovering] = useHover();
	const [hoverRef1, isHovering1] = useHover();
	const [hoverRef2, isHovering2] = useHover();
	const [hoverRef3, isHovering3] = useHover();
	const [hoverRef4, isHovering4] = useHover();
	const [hoverRef5, isHovering5] = useHover();

	const generateShade = (color, darkenPercentage = 20) => {
		if (!color.startsWith("#")) {
			console.error("Color must be in hexadecimal format");
			return color;
		}

		// Extract the red, green, and blue components from the color
		let r = parseInt(color.slice(1, 3), 16);
		let g = parseInt(color.slice(3, 5), 16);
		let b = parseInt(color.slice(5, 7), 16);

		// Darken each component by the darkenPercentage
		r = parseInt((r * (100 - darkenPercentage)) / 100);
		g = parseInt((g * (100 - darkenPercentage)) / 100);
		b = parseInt((b * (100 - darkenPercentage)) / 100);

		// Convert each component back to a two-digit hexadecimal number and return the combined color
		return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
	};

	React.useEffect(() => {
		let backgroundColor;
		let text;
		if (isHovering) {
			backgroundColor = "#FFB6C1"; // Light Pink
			text = "Record melody of your voice here!";
		} else if (isHovering1) {
			backgroundColor = "#4682B4"; // Steel Blue
			text = "Chat with the AI here!";
		} else if (isHovering2) {
			backgroundColor = "#868387  "; // Tan
			text = "Compose music here!";
		} else if (isHovering3) {
			backgroundColor = "#FF6B6B"; // Soft Red
			text = "Talk to the AI here!";
		} else if (isHovering4) {
			backgroundColor = "#FFA07A"; // Light Salmon
			text = "Express your feelings here!";
		} else if (isHovering5) {
			backgroundColor = "#8FBC8F"; // Dark Sea Green
			text = "Colour your mood here!";
		} else {
			backgroundColor = "#F0F8FF"; // Alice Blue (default color when not hovering)
		}

		if (backgroundColor !== "#F0F8FF") {
			setWaveCardProps({ text: text, colors: [backgroundColor, generateShade(backgroundColor)] });
		} else {
			setWaveCardProps({
				text: "Welcome to the Music Generative AI!\nDiscover six unique ways to create your own song.\nUnleash your creativity and start your musical journey now!",
				colors: ["#44b9c9", "#73ddd4"],
			});
		}
	}, [isHovering, isHovering1, isHovering2, isHovering3, isHovering4, isHovering5]);

	const handleSetDuration = async (newDuration) => {
		try {
			const response = await setDuration(newDuration);
			console.log("Duration set response:", response);
		} catch (error) {
			console.error("Error setting duration:", error);
		}
	};

	useEffect(() => {
		const handleClick = (event) => {
			const interaction = {
				type: "click",
				element: event.target.tagName,
				url: window.location.href,
			};
			logUserInteraction(interaction);
		};

		const handleNavigation = () => {
			const interaction = {
				type: "navigation",
				url: window.location.href,
			};
			logUserInteraction(interaction);
		};

		document.addEventListener("click", handleClick);
		window.addEventListener("popstate", handleNavigation);

		const observer = new MutationObserver(() => {
			handleNavigation();
		});

		observer.observe(document.body, { childList: true, subtree: true });

		handleNavigation();

		return () => {
			document.removeEventListener("click", handleClick);
			window.removeEventListener("popstate", handleNavigation);
			observer.disconnect();
		};
	}, []);

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<CSSTransition in={true} appear={true} timeout={500} classNames="fade">
				<div>
					<BreadcrumbsBar
						style={{ display: "flex", alignItems: "center", padding: "10px", backgroundColor: "#f0f0f0" }}
						items={[
							{
								icon: Workspace,
								text: "Home",
							},
						]}>
						<BreadcrumbItem icon={Workspace} text="Home" />
						<div style={{ marginLeft: "auto", display: "flex", alignItems: "center", backgroundColor: "#73ddd4", marginRight: "1vw", height: "3vh", borderRadius: "10px", padding: "5px" }}>
							{/* <label htmlFor="duration-select" style={{ color: "white", marginRight: "10px", marginLeft: "1vw" }}>
								Song duration:
							</label> */}
							<select id="duration-select" value={selectedDuration} onChange={(e) => setSelectedDuration(parseInt(e.target.value))} style={{ marginRight: "0.5vw", marginLeft: "1vw" }}>
								<option value={30} disabled hidden>
									Song duration
								</option>
								<option value={30}>30 seconds</option>
								<option value={60}>1 minute</option>
								<option value={120}>2 minutes</option>
								<option value={180}>3 minutes</option>
							</select>
							<Button onClick={() => handleSetDuration(selectedDuration)} style={{ backgroundColor: "#44b9c9", marginRight: "0.5vw", height: "3vh" }}>
								Set time
							</Button>
							<Button onClick={stopScreenRecording} style={{ backgroundColor: "#44b9c9", marginRight: "1vw", height: "3vh" }}>
								End session
							</Button>
						</div>
					</BreadcrumbsBar>
					<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "1%" }}>
						<div style={{ display: "flex", justifyContent: "space-between", width: "82%" }}>
							<HoverButton text="Melody" ref={hoverRef} onclick={() => navigate("/melody")} color="#FFB6C1" width="165px" height="200px" />
							<HoverButton text="Chat" ref={hoverRef1} onclick={() => navigate("/chat")} color="#4682B4" width="165px" height="200px"></HoverButton>
							<HoverButton text="Compose" ref={hoverRef2} onclick={() => navigate("/composetext")} color="#868387" width="165px" height="200px"></HoverButton>
							<HoverButton text="Talk" ref={hoverRef3} onclick={() => navigate("/talk")} color="#FF6B6B" width="165px" height="200px"></HoverButton>
							<HoverButton text="Express" ref={hoverRef4} onclick={() => navigate("/express")} color="#FFA07A" width="165px" height="200px"></HoverButton>
							<HoverButton text="Colour" ref={hoverRef5} onclick={() => navigate("/color")} color="#8FBC8F" width="165px" height="200px"></HoverButton>
						</div>
						<WaveCard
							text={waveCardProps.text}
							infoStyle={{ color: "white", fontSize: "40px", marginLeft: "20px", marginRight: "20px", marginTop: "-10vh" }}
							cardStyle={{
								width: "92vw", // 80% of the viewport width
								height: "65vh", // 40% of the viewport height
								margin: "calc(-22vh) auto", // Adjust margin to be relative to viewport height
								transform: "perspective(40vw) rotateX(35deg)", // Adjust perspective to be relative to viewport width
							}}
							waveStyle={{ width: "1800px", height: "1900px", marginLeft: "-20%", marginTop: "-20%" }}
							colors={waveCardProps.colors}
						/>
					</div>
				</div>
			</CSSTransition>
		</motion.div>
	);
};

export default HomePage;
