// TODO:  2. fix generating song with first call

export const handleClick = async (songDescription, navigate = null, audioFileURL = null, blobName = null) => {
	try {
		let song_url = "";

		if (songDescription && !audioFileURL) {
			console.log("song description in generateFromDescription:", { description: songDescription });
			song_url = await generateFromDescription(songDescription);
			// console.log("song_url z handleClick:", song_url);
		} else if (songDescription && navigate && audioFileURL && blobName) {
			console.log("song description and audio file URL in generateDescriptionAndAudio:", { description: songDescription, audioFileURL: audioFileURL });
			song_url = await generateDescriptionAndAudio(songDescription, audioFileURL, blobName);
			navigate("/songdescription", { state: { description: songDescription, song: song_url } });
			// navigate("/song", { state: { song: song_url } });
		} else if (!songDescription && navigate && audioFileURL && blobName) {
			console.log("audio file URL only in generateFromAudio:", { audioFileURL: audioFileURL });
			song_url = await generateFromAudio(audioFileURL, blobName);
			navigate("/song", { state: { song: song_url } });
		} else {
			throw new Error("No description or audio file URL provided");
		}

		if (!song_url) {
			throw new Error("No song URL returned from server");
		}
		return song_url;
	} catch (error) {
		console.error("Error in handleClick:", error);
		return { song_url: null, status: 500 };
	}
};

export async function generateDescription(text, navigate) {
	let songDescription = "";
	console.log("description from generateDescription:", text);

	try {
		const response = await fetch("http://127.0.0.1:5000/api/generate_text", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ text: text }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		if (!response) {
			throw new Error("No response from generateSongWithDescription");
		}

		const contentType = response.headers.get("content-type");

		if (contentType && contentType.includes("application/json")) {
			const responseData = await response.json();
			songDescription = responseData.response;
		} else {
			console.error("Expected JSON response but got:", contentType);
		}

		if (typeof songDescription === "string") {
			songDescription = songDescription.replace(/"$/g, "");
		}

		console.log("song description from client side:", songDescription);

		if (songDescription && navigate) {
			await navigate("/songdescription", { state: { description: songDescription, faceExpression: null } });
		}

		return songDescription;
	} catch (error) {
		console.error("Error in generateSongWithDescription:", error);
		throw error;
	}
}

async function generateFromDescription(description) {
	try {
		const response = await fetch("http://127.0.0.1:5000/api/generate_with_description", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ description: description }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const responseData = await response.json();
		const songUrl = responseData.songUrl;

		if (!songUrl) {
			throw new Error("No song URL returned from server");
		}

		return songUrl;
	} catch (error) {
		console.error("Error in generateFromDescription:", error);
		throw error;
	}
}

export async function uploadFileAndGenerate(audioBlob) {
	const formData = new FormData();
	formData.append("file", audioBlob, "audio.wav");

	try {
		const uploadResponse = await fetch("http://127.0.0.1:5000/api/upload", {
			method: "POST",
			body: formData,
		});

		if (!uploadResponse.ok) {
			throw new Error(`HTTP error! status: ${uploadResponse.status}`);
		}

		const uploadData = await uploadResponse.json();
		const fileUrl = uploadData.file_url;
		const blobName = uploadData.blob_name;
		console.log("File URL from uploadFileAndGenerate:", fileUrl);

		return { fileUrl, blobName };
	} catch (error) {
		console.error("Error in uploadFileAndGenerate:", error);
		throw error;
	}
}

export async function generateFromAudio(audioFileLink, blobName) {
	try {
		const response = await fetch("http://127.0.0.1:5000/api/generate_with_audio", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ audioLink: audioFileLink, blobName: blobName }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const responseData = await response.json();
		const songUrl = responseData.songUrl;

		if (!songUrl) {
			throw new Error("No song URL returned from server");
		}

		return songUrl;
	} catch (error) {
		console.error("Error in generateFromAudio:", error);
	}
}

export async function generateDescriptionAndAudio(description, audioFileURL, blobName) {
	const data = {
		description: description,
		audioLink: audioFileURL,
		blobName: blobName,
	};
	console.log("audio file in generateDescriptionAndAudio:", audioFileURL);
	console.log("description in generateDescriptionAndAudio:", description);

	try {
		const response = await fetch("http://127.0.0.1:5000/api/generate_with_multi", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const responseData = await response.json();
		const songUrl = responseData.songUrl;

		if (!songUrl) {
			throw new Error("No song URL returned from server");
		}

		console.log("songUrl from generateDescriptionAndAudio: " + songUrl);
		return songUrl;
	} catch (error) {
		console.error("Error in generateDescriptionAndAudio:", error);
	}
}

export const analyzeFace = async function (image) {
	try {
		const response = await fetch("http://localhost:5000/api/analyze_face", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ image: image }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const faceAnalysis = await response.json();
		console.log(faceAnalysis);

		const emotionData = faceAnalysis.response[0].emotion;
		return Object.entries(emotionData)
			.map(([emotion, value]) => `${emotion}: ${value.toFixed(2)}`)
			.join(", ");
	} catch (error) {
		console.error("Error in analyzeFace:", error);
	}
};

export const transcribeSpeech = async function (audio, navigate) {
	try {
		const formData = new FormData();
		formData.append("audio", audio);

		const response = await fetch("http://localhost:5000/api/transcribe_speech", {
			method: "POST",
			mode: "cors",
			body: formData,
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
		}

		const responseBody = await response.text();
		let transcription = "";

		if (response.headers.get("content-type").includes("application/json")) {
			const speechAnalysis = JSON.parse(responseBody);
			transcription = speechAnalysis.transcription;
		} else {
			console.error("Expected JSON response but got:", response.headers.get("content-type"));
		}

		console.log("Transcription text:", transcription);

		await generateDescription(transcription, navigate);
		return 200;
	} catch (error) {
		console.error(`Failed to transcribe speech. Status code: ${error.status}, Message: ${error.message}`);
	}
};

export const logUserInteraction = async function (interaction) {
	try {
		const response = await fetch("http://localhost:5000/api/log_interaction", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ interaction: interaction }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} catch (error) {
		console.error("Error in logUserInteraction:", error);
	}
};

export const startScreenRecording = async function (interval = 1) {
	try {
		const response = await fetch("http://localhost:5000/api/start_screen_recording", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ interval: interval }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} catch (error) {
		console.error("Error in startScreenRecording:", error);
	}
};

export const stopScreenRecording = async function () {
	try {
		const response = await fetch("http://localhost:5000/api/stop_screen_recording", {
			method: "POST",
			mode: "cors",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
	} catch (error) {
		console.error("Error in stopScreenRecording:", error);
	}
};

export async function setDuration(newDuration) {
	try {
		const response = await fetch("http://127.0.0.1:5000/api/set_duration", {
			mode: "cors",
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ duration: newDuration }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const responseData = await response.json();
		console.log("Duration set response:", responseData);
		return responseData;
	} catch (error) {
		console.error("Error setting duration:", error);
		throw error;
	}
}

export const startCapturing = async () => {
	try {
		const response = await fetch("http://127.0.0.1:5000/api/start_capturing", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data.message);
	} catch (error) {
		console.error("Error in startCapturing:", error);
	}
};

export const stopCapturing = async () => {
	try {
		const response = await fetch("http://127.0.0.1:5000/api/stop_capturing", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
		});
		const data = await response.json();
		console.log(data.message);
	} catch (error) {
		console.error("Error in stopCapturing:", error);
	}
};
