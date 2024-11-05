import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import HomePage from "./components/homePage/HomePage";
import StartSession from "./components/startSession/startSession";
import Chat from "./components/chat/Chat";
import Express from "./components/express/Express";
import Talk from "./components/talk/Talk";
import ColorWheel from "./components/colorWheel/ColorWheel";
import SongDescription from "./components/song/SongDescription";
import Song from "./components/song/Song";
import Yellow from "./components/colorWheel/shades/Yellow";
import White from "./components/colorWheel/shades/White";
import Orange from "./components/colorWheel/shades/Orange";
import Green from "./components/colorWheel/shades/Green";
import Purple from "./components/colorWheel/shades/Purple";
import Brown from "./components/colorWheel/shades/Brown";
import Blue from "./components/colorWheel/shades/Blue";
import Black from "./components/colorWheel/shades/Black";
import Red from "./components/colorWheel/shades/Red";
import Melody from "./components/melody/Melody";
import ComposeText from "./components/compose/ComposeText";
import ComposeMelody from "./components/compose/ComposeMelody";

function App() {
	return (
		<Router>
			<div className="container"></div>
			<div className="App">
				<div class="card">MUSIC GENERATIVE AI</div>
				<Routes>
					<Route path="/" element={<StartSession/>} />
					<Route path="/home" element={<HomePage />} />
					<Route path="/chat" element={<Chat />} />
					<Route path="/express" element={<Express />} />
					<Route path="/talk" element={<Talk />} />
					<Route path="/color" element={<ColorWheel />} />
					<Route path="/songdescription" element={<SongDescription />} />
					<Route path="/song" element={<Song />} />
					<Route path="/melody" element={<Melody />} />
					<Route path="/composetext" element={<ComposeText />} />
					<Route path="/composemelody" element={<ComposeMelody />} />
					<Route path="/shades/yellow" element={<Yellow />} />
					<Route path="/shades/orange" element={<Orange />} />
					<Route path="/shades/green" element={<Green />} />
					<Route path="/shades/purple" element={<Purple />} />
					<Route path="/shades/brown" element={<Brown />} />
					<Route path="/shades/blue" element={<Blue />} />
					<Route path="/shades/black" element={<Black />} />
					<Route path="/shades/white" element={<White />} />
					<Route path="/shades/red" element={<Red />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;
