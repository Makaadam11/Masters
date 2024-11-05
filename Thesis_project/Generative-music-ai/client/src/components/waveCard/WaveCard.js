import React from "react";
import "./WaveCard.css";

const WaveCard = ({ colors, text, waveStyle, cardStyle, infoStyle }) => {
  const gradient = `linear-gradient(744deg, ${colors.join(", ")})`;
  const fontColor = colors[0] === "white" ? "black" : "white";

  return (
    <div className="e-card playing" style={{ ...cardStyle }}>
      <div className="image"></div>
      {/* Apply both the dynamic background and any additional styles passed via waveStyle */}
      <div className="wave" style={{ background: gradient, ...waveStyle }}></div>
      <div className="wave" style={{ background: gradient, ...waveStyle }}></div>
      <div className="wave" style={{ background: gradient, ...waveStyle }}></div>

      <div className="infotop" style={{ color: fontColor, ...infoStyle }}>
        <br />
        {text}
        {/* <div style={{ fontSize: "24px", marginTop: "10px", color: fontColor }}>made by Adam Maka</div> */}
      </div>
    </div>
  );
};

export default WaveCard;
