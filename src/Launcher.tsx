import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faS, faGrip } from "@fortawesome/free-solid-svg-icons";
import { createRoot } from "react-dom/client";
import App from "./App";
const Launcher: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);
  const offsetY = useRef(0);

  const onGripMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offsetY.current =
      e.clientY - (ref.current?.getBoundingClientRect().top || 0);
    document.body.style.userSelect = "none";
    e.stopPropagation();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging || !ref.current) return;
    const newY = e.clientY - offsetY.current;
    ref.current.style.top = `${Math.max(
      0,
      Math.min(window.innerHeight - ref.current.offsetHeight, newY)
    )}px`;
  };

  const onMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);
  const handleClick = () => {
  const existing = document.getElementById("skynet-panel-container");
  if (existing) {
    existing.classList.remove("skynet-slide-in");
    existing.classList.add("skynet-slide-out");
    document.body.style.marginRight = ""; // reset margin
    document.body.style.transition = "margin 0.3s ease";
    setTimeout(() => existing.remove(), 300); // Wait for animation
    return;
  }

   const container = document.createElement("div");
  container.id = "skynet-panel-container";
  container.className = "skynet-slide-in";
  const initialWidth = 400;

  Object.assign(container.style, {
    position: "fixed",
    top: "0",
    right: "0",
    width: `${initialWidth}px`,
    height: "100vh",
    zIndex: "999999",
    borderLeft: "1px solid #444",
    backgroundColor: "#000000",
    transition: "transform 0.3s ease",
    display: "flex",
    flexDirection: "row",
  });
  // Adjust page content margin
  document.body.style.marginRight = `${initialWidth}px`;
  document.body.style.transition = "margin 0.3s ease";

    // Create resizer
  const resizer = document.createElement("div");
  Object.assign(resizer.style, {
    width: "5px",
    cursor: "ew-resize",
    backgroundColor: "#333",
    height: "100%",
    position: "relative",
  });


  resizer.addEventListener("mousedown", initResize);

    function initResize(e: MouseEvent) {
    e.preventDefault();
    document.addEventListener("mousemove", resize);
    document.addEventListener("mouseup", stopResize);
  }
    function resize(e: MouseEvent) {
    const newWidth = Math.max(300, window.innerWidth - e.clientX);
    container.style.width = `${newWidth}px`;
    document.body.style.marginRight = `${newWidth}px`;
  }
    function stopResize() {
    document.removeEventListener("mousemove", resize);
    document.removeEventListener("mouseup", stopResize);
  }


    container.appendChild(resizer);
  document.body.appendChild(container);

  const panelContent = document.createElement("div");
  panelContent.style.flex = "1";
  panelContent.style.height = "100%";

  container.appendChild(panelContent);
  const root = createRoot(panelContent);
  root.render(<App />);
};

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        top: "40%",
        right: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "5px 0 0 5px",
        background: "#000000",
        width: "40px",
        height: "60px",
        padding: "4px 0",
        cursor: "default",
        zIndex: 999999,
        boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
        gap: "4px",
      }}
    >
      {/* Clickable logo */}
      <div
        onClick={handleClick}
        style={{
  cursor: "pointer",
  padding: "4px",
  borderRadius: "6px",
}}

      >
        {" "}
        <img
          src={chrome.runtime.getURL("icons/logo.png")}
          alt="Skynet logo"
          style={{
            width: "38px",
            height: "38px",
            objectFit: "contain",
            filter: "brightness(0) invert(1)",
            opacity: hoverLogo ? 1 : 0.8,
            transition: "opacity 0.2s ease",
          }}
        />
      </div>

      <div
        onMouseDown={onGripMouseDown}
        style={{
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "ns-resize",
          marginTop: "-12px", // shifts it slightly up
        }}
      >
        <FontAwesomeIcon
          icon={faGrip}
          style={{ color: "#fcfcfc", fontSize: "14px", opacity: 0.7 }}
        />
      </div>
    </div>
  );
};

export default Launcher;