import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import { Button, BreadcrumbsBar, BreadcrumbItem } from "monday-ui-react-core";
import { Form, Quote, Emoji, Placeholder, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import { handleClick, logUserInteraction, uploadFileAndGenerate } from "../../services/Api.js";
import { motion } from "framer-motion";
import HoverButton from "../hoverButton/HoverButton.js";
import WaveCard from "../waveCard/WaveCard.js";
import Loader from "../loader/Loader.js";

const Melody = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [blobURL, setBlobURL] = useState("");
	const navigate = useNavigate();

	const startRecording = () => {
		setIsRecording(true);
	};

	const stopRecording = () => {
		setIsRecording(false);
		setIsLoading(true);
	};

	const onData = (recordedBlob) => {
		console.log("chunk of real-time data is: ", recordedBlob);
	};

	const onStop = async (recordedBlob) => {
		setBlobURL(recordedBlob.blobURL);
		try {
			const { fileUrl, blobName } = await uploadFileAndGenerate(recordedBlob.blob);
			const song_url = await handleClick("", navigate, fileUrl, blobName);
			if (song_url) {
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

		return () => {
			document.removeEventListener("click", handleClick);
			window.removeEventListener("popstate", handleNavigation);
			observer.disconnect();
		};
	}, []);

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
			<BreadcrumbsBar type={BreadcrumbsBar.types.NAVIGATION} style={{ position: "absolute", top: 0, left: 0 }}>
				<BreadcrumbItem icon={Workspace} text="Home" onClick={() => navigate("/home")} />
				<BreadcrumbItem icon={Quote} text="Melody" />
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "78vh" }}>
				<WaveCard text={"Click Start to begin recording and stop to end it"} infoStyle={{ marginTop: "-50px" }} cardStyle={{ width: "700px", height: "300px", margin: "10px auto" }} waveStyle={{ width: "950px", height: "900px", marginLeft: "-18%", marginTop: "-25%" }} colors={["#44b9c9", "#b2dfdb"]} />
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						justifyContent: "center",
						alignItems: "center",
						marginTop: "20px",
					}}>
					<ReactMic className="sound-wave" record={isRecording} onStop={onStop} onData={onData} backgroundColor="#FF6B6B" />
				</div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						flexDirection: "row",
						marginTop: "15px",
						justifyContent: "space-between",
					}}>
					{isLoading ? (
						<Loader style={{ height: "100px" }} />
					) : (
						<>
							<div>
								<HoverButton onclick={startRecording} disabled={isRecording} text="Start" color="#4682B4" width="220px" height="100px" />
							</div>
							<div style={{ marginLeft: "10px" }}>
								<HoverButton onclick={stopRecording} disabled={!isRecording} text="Stop" color="#FF6B6B" width="220px" height="100px" />
							</div>
						</>
					)}
				</div>
			</div>
		</motion.div>
	);
};

export default Melody;
