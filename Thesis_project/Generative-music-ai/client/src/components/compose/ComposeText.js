import React, { useState, useEffect } from "react";
import { Button, BreadcrumbItem, BreadcrumbsBar } from "monday-ui-react-core";
import { motion } from "framer-motion";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import TextArea from "../textArea/textArea.js";
import HoverButton from "../hoverButton/HoverButton.js";
import { generateDescription, logUserInteraction } from "../../services/Api.js";
import Loader from "../loader/Loader.js";

const ComposeText = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState("");
	const navigate = useNavigate();

	const handleClick = async () => {
		try {
			setIsLoading(true);
			const songDescription = await generateDescription(text);
			if (songDescription) {
				navigate("/composemelody", { state: { description: songDescription } });
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
				<BreadcrumbItem icon={Form} text="Type" />
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "120px" }}>
				<div style={{ marginBottom: "50px" }}>
					<TextArea label="Describe your song here!" onChange={(e) => setText(e.target.value)} />
				</div>
				{isLoading ? <Loader style={{ height: "100px" }} /> : <HoverButton text="Compose Song Description" onclick={() => handleClick()} color="#868387 " width="450px" height="100px" />}
			</div>
		</motion.div>
	);
};

export default ComposeText;
