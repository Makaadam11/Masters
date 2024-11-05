import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { Button, BreadcrumbsBar, BreadcrumbItem } from "monday-ui-react-core";
import { analyzeFace, logUserInteraction, startCapturing, stopCapturing, startScreenRecording } from "../../services/Api.js";
import { motion } from "framer-motion";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import HoverButton from "../hoverButton/HoverButton.js";
import Loader from "../loader/Loader.js";

const Express = () => {
	const [isLoading, setIsLoading] = useState(false);
	const webcamRef = useRef(null);
	const navigate = useNavigate();

	const capture = async () => {
		try {
			setIsLoading(true);
			const imageSrc = webcamRef.current.getScreenshot();
			const faceExpression = await analyzeFace(imageSrc, navigate);
			if (faceExpression) {
				navigate("/songdescription", { state: { faceExpression: faceExpression } });
			} else {
				setIsLoading(false);
			}
			await stopCapturing();
		} catch (error) {
			console.error("Error in onStop:", error);
			setIsLoading(false);
			await stopCapturing();
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

		// Użyj MutationObserver do wykrywania zmian w URL
		const observer = new MutationObserver(() => {
			handleNavigation();
		});

		observer.observe(document.body, { childList: true, subtree: true });

		// Wywołaj handleNavigation na początku, aby zarejestrować początkowy URL
		handleNavigation();
		startCapturing();

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
					{
						icon: Emoji,
						text: "Express",
					},
				]}>
				<BreadcrumbItem icon={Workspace} text="Home" onClick={() => navigate("/home")} />
				<BreadcrumbItem icon={Emoji} text="Express" />
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
				<Webcam
					audio={false}
					ref={webcamRef}
					screenshotFormat="image/jpeg"
					style={{
						border: "15px solid #000",
						borderRadius: "10px",
						width: "33%",
						height: "33%",
						marginTop: "-1%",
						marginBottom: "20px",
						position: "relative",
						overflow: "hidden",
						transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
						boxShadow: "5px 5px 0 #000, 10px 10px 0 #FFA07A",
					}}
				/>{" "}
				{isLoading ? <Loader style={{ height: "100px" }} /> : <HoverButton text="Capture" onclick={capture} color="#FFA07A" width="200px" height="100px" />}
			</div>
		</motion.div>
	);
};

export default Express;
