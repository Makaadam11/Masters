import React, { useState, useEffect } from "react";
import { ReactMic } from "react-mic";
import { Button, BreadcrumbsBar, BreadcrumbItem } from "monday-ui-react-core";
import { Form, Sound, Workspace } from "monday-ui-react-core/icons";
import { useNavigate } from "react-router-dom";
import { handleClick, uploadFileAndGenerate, logUserInteraction } from "../../services/Api.js";
import { motion } from "framer-motion";
import HoverButton from "../hoverButton/HoverButton.js";
import WaveCard from "../waveCard/WaveCard.js";
import { useLocation } from "react-router-dom";
import Loader from "../loader/Loader.js";

const ComposeMelody = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const [blobURL, setBlobURL] = useState("");
	const navigate = useNavigate();

	const location = useLocation();
	let description = location.state?.description;

	console.log("location.state:", location.state);
	console.log("description:", description);

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
			<BreadcrumbsBar type={BreadcrumbsBar.types.NAVIGATION} style={{ position: "absolute", top: 0, left: 0 }}>
				<BreadcrumbItem icon={Workspace} text="Home" onClick={() => navigate("/home")} />
				<BreadcrumbItem icon={Form} text="Type" onClick={() => navigate("/composetext")} />
				<BreadcrumbItem icon={Sound} text="Record" />
			</BreadcrumbsBar>
			<div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "78vh" }}>
				<WaveCard text={"Click Start to begin recording and stop to end it"} infoStyle={{ marginTop: "-40px" }} cardStyle={{ width: "700px", height: "300px", margin: "10px auto" }} waveStyle={{ width: "950px", height: "900px", marginLeft: "-18%", marginTop: "-25%" }} colors={["#44b9c9", "#74d3cb"]} />

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

export default ComposeMelody;
