import React, { useState, useEffect } from "react";
import { Button, BreadcrumbItem, BreadcrumbsBar } from "monday-ui-react-core";
import { generateDescription, logUserInteraction } from "../../services/Api";
import { motion } from "framer-motion";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import TextArea from "../textArea/textArea.js";
import HoverButton from "../hoverButton/HoverButton.js";
import Loader from "../loader/Loader.js";

const Chat = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [text, setText] = useState("");
	const navigate = useNavigate();

	const handleClickWithText = async () => {
		setIsLoading(true);
		try {
			const description = await generateDescription(text, navigate);
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
				url: window.location.href
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
	
		// Użyj MutationObserver do wykrywania zmian w URL
		const observer = new MutationObserver(() => {
			handleNavigation();
		});
	
		observer.observe(document.body, { childList: true, subtree: true });
	
		// Wywołaj handleNavigation na początku, aby zarejestrować początkowy URL
		handleNavigation();
	
		return () => {
			document.removeEventListener("click", handleClick);
			window.removeEventListener("popstate", handleNavigation);
			observer.disconnect();
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
				<BreadcrumbItem icon={Form} text="Chat" />
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", marginTop: "120px" }}>
				<div style={{ marginBottom: "50px" }}>
					<TextArea label="How are you feeling today?" onChange={(e) => setText(e.target.value)} />
				</div>
				{isLoading ? <Loader style={{ height: "100px" }} /> : <HoverButton text="Generate Your Mood" onclick={handleClickWithText} color="#4682b4" width="350px" height="100px" />}
			</div>
		</motion.div>
	);
};

export default Chat;
