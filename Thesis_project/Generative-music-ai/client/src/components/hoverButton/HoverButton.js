import React from "react";
import "./HoverButton.css";
import { Button } from "monday-ui-react-core";

const HoverButton = React.forwardRef(({ width, height, text, color, onclick, disabled }, ref) => {
  return (
    <div>
      <Button
        ref={ref}
        className="c-button c-button--gooey"
        onClick={onclick}
        disabled={disabled}
        style={{
          width: width,
          height: height,
          color: color,
          borderColor: color,
          backgroundColor: "white",
        }}
      >
        {text}
        <div className="c-button__blobs">
          <div style={{ backgroundColor: color }}></div>
          <div style={{ backgroundColor: color }}></div>
          <div style={{ backgroundColor: color }}></div>
        </div>
      </Button>
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ height: 0, width: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur"></feGaussianBlur>
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo"></feColorMatrix>
            <feBlend in="SourceGraphic" in2="goo"></feBlend>
          </filter>
        </defs>
      </svg>
    </div>
  );
});

export default HoverButton;
