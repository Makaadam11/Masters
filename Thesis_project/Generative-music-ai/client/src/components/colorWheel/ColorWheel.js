// src/components/ColorWheel.js

import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import styled from "styled-components";
import { motion } from "framer-motion";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsBar, BreadcrumbItem } from "monday-ui-react-core";
import WaveCard from "../waveCard/WaveCard.js";
import { useHover } from "@uidotdev/usehooks";
import { logUserInteraction } from "../../services/Api";

const DetailsContainer = styled.div`
  margin-top: 20px;
`;

const colours = {
	Yellow: "Joy, Optimism, Warmth",
	Red: "Anger, Passion, Love",
	Orange: "Energy, Enthusiasm, Happiness",
	Green: "Calm, Balance, Peace",
	Blue: "Sadness, Tranquility, Trust",
	Purple: "Creativity, Mystery, Spirituality",
	Brown: "Energy, Enthusiasm, Happiness",
	Black: "Grief, Power, Elegance",
	White: "Purity, Innocence, Cleanliness",
};

const generateShades = (color) => {
	const shades = [];
	for (let i = 0; i < 5; i++) {
		shades.push(
			d3
				.rgb(color)
				.darker(i * 0.2)
				.toString()
		);
	}
	return shades;
};

const ColorWheel = () => {
	const wheelRef = useRef(null);
	const tooltipRef = useRef(null);
	const [selectedColor, setSelectedColor] = useState(null);
	const [shades, setShades] = useState([]);
	const navigate = useNavigate();

	const [waveCardProps, setWaveCardProps] = useState({ text: "", colors: ["#fff"] }); // Default state

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
		const colors = Object.keys(colours);
		const numColors = colors.length;

		const arc = d3.arc().innerRadius(30).outerRadius(150); // Decrease the innerRadius and outerRadius values

		const pie = d3.pie().value(1).sort(null);

		const svg = d3.select(wheelRef.current).attr("width", 600).attr("height", 400).append("g").attr("transform", "translate(300,200)"); // Decrease the width, height and translate values

		const arcs = svg.selectAll(".arc").data(pie(colors)).enter().append("g").attr("class", "arc");

		arcs.append("path")
			.attr("d", arc)
			.attr("fill", (d) => d.data.toLowerCase())
			.on("mouseover", function (event, d) {
				const [x, y] = d3.pointer(event);
				d3.select(tooltipRef.current)
					.style("left", `${x + 150}px`)
					.style("top", `${y + 150}px`)
					.style("opacity", 1)
					.html(`${d.data}: ${colours[d.data]}`);
			})
			.on("mouseout", () => {
				d3.select(tooltipRef.current).style("opacity", 0);
			})
			.on("click", (event, d) => {
				setSelectedColor(d.data);
				setShades(generateShades(d.data));
				if (d.data.toLowerCase() === "blue") {
					navigate("/shades/blue");
				}
				if (d.data.toLowerCase() === "red") {
					navigate("/shades/red");
				}
				if (d.data.toLowerCase() === "yellow") {
					navigate("/shades/yellow");
				}
				if (d.data.toLowerCase() === "green") {
					navigate("/shades/green");
				}
				if (d.data.toLowerCase() === "orange") {
					navigate("/shades/orange");
				}
				if (d.data.toLowerCase() === "purple") {
					navigate("/shades/purple");
				}
				if (d.data.toLowerCase() === "brown") {
					navigate("/shades/brown");
				}
				if (d.data.toLowerCase() === "black") {
					navigate("/shades/black");
				}
				if (d.data.toLowerCase() === "white") {
					navigate("/shades/white");
				}
			});
	}, []);

	React.useEffect(() => {
		let backgroundColor;
		let text;
		if (isHovering) {
			backgroundColor = "pink"; // Replace with actual color
			text = "Record melody of your voice here!";
		} else if (isHovering1) {
			backgroundColor = "blue";
			text = "Chat with the AI here!";
		} else if (isHovering2) {
			backgroundColor = "brown"; // Replace with actual color
			text = "Compose music here!";
		} else if (isHovering3) {
			backgroundColor = "red"; // Replace with actual color
			text = "Talk to the AI here!";
		} else if (isHovering4) {
			backgroundColor = "orange"; // Replace with actual color
			text = "Express your feelings here!";
		} else if (isHovering5) {
			backgroundColor = "green"; // Replace with actual color
			text = "Colour your mood here!";
		} else {
			backgroundColor = "white"; // Default color when not hovering
		}

		// Now, use this dynamically determined backgroundColor to set the wave card props
		if (backgroundColor !== "white") {
			// If any hover state is active
			setWaveCardProps({ text: text, colors: [backgroundColor, generateShade(backgroundColor)] });
		} else {
			setWaveCardProps({ text: "This is music generative AI", colors: ["purple", "rgb(90, 23, 255)", "darkblue"] }); // Reset to default when not hovering
		}
	}, [isHovering, isHovering1, isHovering2, isHovering3, isHovering4, isHovering5]);

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<BreadcrumbsBar
				type={BreadcrumbsBar.types.NAVIGATION}
				style={{ position: "absolute", top: 0, left: 0 }}
				items={[
					{
						icon: Workspace,
						text: "Home",
					},
				]}>
				<BreadcrumbItem icon={Workspace} text="Home" onClick={() => navigate("/home")} />
				<BreadcrumbItem icon={Placeholder} text="Colour" />
			</BreadcrumbsBar>
			<WaveCard
				text={"Pick a colour of your choice..."}
				cardStyle={{ width: "700px", height: "135px", margin: "10px auto", marginBottom: "-20px", marginTop: "-8px" }}
				infoStyle={{
					position: "relative",
					top: "10px",
				}}
				waveStyle={{ width: "900px", height: "800px", marginLeft: "-20%", marginTop: "-25%" }}
				colors={["#44b9c9", "#b2dfdb"]}
			/>
			<svg ref={wheelRef}></svg>
			{selectedColor && (
				<DetailsContainer>
					<h2>{selectedColor}</h2>
					<p>{colours[selectedColor]}</p>
					<h3>Shades</h3>
					<ul>
						{shades.map((shade, index) => (
							<li key={index} style={{ backgroundColor: shade, padding: "100px", marginTop: "-500px" }}>
								{shade}
							</li>
						))}
					</ul>
				</DetailsContainer>
			)}
		</motion.div>
	);
};

export default ColorWheel;
