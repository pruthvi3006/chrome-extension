import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGrip } from "@fortawesome/free-solid-svg-icons";
import { createRoot } from "react-dom/client";
import App from "./App";
import './style.css';

const Launcher: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);
  const offsetY = useRef(0);

  const onGripMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offsetY.current = e.clientY - (ref.current?.getBoundingClientRect().top || 0);
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
      document.body.style.marginRight = "";
      document.body.style.transition = "margin 0.3s ease";
      setTimeout(() => existing.remove(), 300);
      return;
    }

    const container = document.createElement("div");
    container.id = "skynet-panel-container";
    container.className = "skynet-panel";
    document.body.appendChild(container);

    // Create root and render App
    const root = createRoot(container);
    root.render(<App />);

    // Animate panel
    requestAnimationFrame(() => {
      container.classList.add("skynet-slide-in");
      document.body.style.marginRight = "400px";
    });
  };

  return (
    <div
      ref={ref}
      className="skynet-launcher"
      onMouseEnter={() => setHoverLogo(true)}
      onMouseLeave={() => setHoverLogo(false)}
    >
      <img
        src={chrome.runtime.getURL("icons/logo.png")}
        alt="SkyStudio"
        onClick={handleClick}
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "8px",
          cursor: "pointer",
          transition: "transform 0.3s ease",
          transform: hoverLogo ? "scale(1.1)" : "scale(1)",
        }}
      />
      <div className="skynet-grip" onMouseDown={onGripMouseDown}>
        <FontAwesomeIcon icon={faGrip} color="#666" />
      </div>
    </div>
  );
};

export default Launcher;
