import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { BreadcrumbsBar, BreadcrumbItem, Button } from "monday-ui-react-core";
import { Workspace, Placeholder, Sun } from "monday-ui-react-core/icons";
import ReactSlider from "react-slider";
import styled from "styled-components";
import WaveCard from "../../waveCard/WaveCard.js";
import HoverButton from "../../hoverButton/HoverButton.js";
import { generateDescription, logUserInteraction } from "../../../services/Api";
import Loader from "../../loader/Loader.js";

const Blue = () => {
	const navigate = useNavigate();
	const [emotionPercentage, setEmotionPercentage] = useState(50);
	const PositiveEmotions = ["Calmness, refreshing, peace, relaxing, reliability, stability, compassion, confidence, peace, trust, and security"];
	const NegativeEmotions = ["Sadness, coldness, unfriendliness, lack of emotion, unreliability, and depression"];

	const emotionSentence = `This person feels like ${emotionPercentage}% of ${NegativeEmotions} and ${100 - emotionPercentage}% of ${PositiveEmotions}.`;

	const getColorShade = (percentage) => {
		const blue = 350 - percentage * 2.55; // Convert percentage to a scale of 0-255
		return `rgb( 40, 80, ${blue})`; // Use the red value for the red channel, and 0 for green and blue
	};

	const StyledSlider = styled(ReactSlider)`
	width: 100%;
	height: 80px;
	background-color: rgba(255, 255, 255, 0.1);
	border-radius: 40px;
	box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(255, 255, 255, 0.1);
	background: ${(props) => {
			const startColor = getColorShade(0);
			const midColor = getColorShade(50);
			const endColor = getColorShade(100);
			return `linear-gradient(to right, 
		${startColor} 0%, 
		${midColor} 50%,
		${endColor} 100%
	)`;
	}};
	margin: 20px 0;
	box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
	`;

	const StyledThumb = styled.div`
	height: 100px;
	width: 100px;
	margin: -13px 0;
	background-color: ${(props) => getColorShade(props.value)};
	border-radius: 50%;
	cursor: grab;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 255, 255, 0.1);
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
	font-color: black
	color: rgba(255, 255, 255, 0.8);
	&:hover {
		transform: scale(1.05);
	}

	&:active {
		cursor: grabbing;
	}
	`;

		const StyledTrack = styled.div`
	top: 0;
	bottom: 0;
	border-radius: 999px;
	`;

	const Thumb = (props, state) => (
		<StyledThumb {...props} value={state.valueNow}>
			{state.valueNow}%
		</StyledThumb>
	);

	const Track = (props, state) => <StyledTrack {...props} value={state.valueNow} />;

	const [isLoading, setIsLoading] = useState(false);

	const onClick = async () => {
		setIsLoading(true);
		try {
			const description = await generateDescription(emotionSentence, navigate);
			if (description) {
			} else {
				setIsLoading(false);
			}
		} catch (error) {
			console.error("Error in onStop:", error);
			setIsLoading(false);
		}
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
				<BreadcrumbItem icon={Placeholder} text="Colour" onClick={() => navigate("/color")} />
				<BreadcrumbItem icon={Sun} text="Shade" />
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "70vh" }}>
				<WaveCard
					text={"Pick a colour of your choice..."}
					cardStyle={{ width: "700px", height: "150px", margin: "10px auto", marginBottom: "40px", marginTop: "-15px" }}
					infoStyle={{
						position: "relative",
						top: "40px",
						color: "#017663",
					}}
					waveStyle={{ width: "900px", height: "800px", marginLeft: "-20%", marginTop: "-25%" }}
					colors={["#44b9c9", "#b2dfdb"]}
				/>

				<div style={{ display: "flex", justifyContent: "space-between", width: "70%" }}>
					<StyledSlider value={emotionPercentage} onChange={(value) => setEmotionPercentage(value)} min={0} max={100} renderThumb={Thumb} renderTrack={Track} />{" "}
				</div>
				<div style={{ marginTop: "2%" }}> {isLoading ? <Loader style={{ height: "100px" }} /> : <HoverButton onclick={() => onClick()} text="Generate" color="#0000CD" width="220px" height="100px" style={{ margin: "10px" }} />}</div>
			</div>
		</motion.div>
	);
};

export default Blue;
