import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from './assets/logo.png';
import { faS, faGrip } from '@fortawesome/free-solid-svg-icons';
import { createRoot } from 'react-dom/client';
import App from './App';
const Launcher: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [hoverLogo, setHoverLogo] = useState(false);
  const offsetY = useRef(0);

  const onGripMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offsetY.current = e.clientY - (ref.current?.getBoundingClientRect().top || 0);
    document.body.style.userSelect = 'none';
    e.stopPropagation();
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging || !ref.current) return;
    const newY = e.clientY - offsetY.current;
    ref.current.style.top = `${Math.max(0, Math.min(window.innerHeight - ref.current.offsetHeight, newY))}px`;
  };

  const onMouseUp = () => {
    setDragging(false);
    document.body.style.userSelect = '';
  };

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [dragging]);
  const handleClick = () => {
  const existing = document.getElementById('skynet-panel-container');
  if (existing) {
    existing.classList.remove('skynet-slide-in');
    existing.classList.add('skynet-slide-out');
    setTimeout(() => existing.remove(), 300); // Wait for animation
    return;
  }

  // Create container
  const container = document.createElement('div');
  container.id = 'skynet-panel-container';
  container.className = 'skynet-slide-in';
  Object.assign(container.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    width: '400px',
    height: '100vh',
    zIndex: '999999',
    borderLeft: '1px solid #444',
    backgroundColor: '#000000',
    transition: 'transform 0.3s ease',
    display: 'flex',
    flexDirection: 'row'
  });

  // Create resizer
  const resizer = document.createElement('div');
  Object.assign(resizer.style, {
    width: '5px',
    cursor: 'ew-resize',
    backgroundColor: '#333',
    height: '100%',
    position: 'relative'
  });

  resizer.addEventListener('mousedown', initResize);

  function initResize(e:any) {
    e.preventDefault();
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
  }

  function resize(e:any) {
    const newWidth = window.innerWidth - e.clientX;
    container.style.width = `${Math.max(300, newWidth)}px`;
  }

  function stopResize() {
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', stopResize);
  }

  container.appendChild(resizer);
  document.body.appendChild(container);

  const panelContent = document.createElement('div');
  panelContent.style.flex = '1';
  panelContent.style.height = '100%';

  container.appendChild(panelContent);
  const root = createRoot(panelContent);
  root.render(<App />);
};

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: '40%',
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '5px 0 0 5px',
        background: '#000000',
        width: '40px',
        height: '60px',
        padding: '4px 0',
        cursor: 'default',
        zIndex: 999999,
        boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
        gap: '4px',
      }}
    >
      {/* Clickable logo */}
     <div
  onClick={handleClick}
  onMouseEnter={() => setHoverLogo(true)}
  onMouseLeave={() => setHoverLogo(false)}
  style={{
    cursor: 'pointer',
    background: hoverLogo ? '#000' : 'transparent',
    padding: '4px',
    borderRadius: '6px',
    transition: 'background 0.2s ease',
  }}
>
  <img
    src={logo}
    alt="Skynet logo"
    style={{
      width: '20px',
      height: '20px',
      objectFit: 'contain',
      filter: 'drop-shadow(0 0 2px rgba(255,255,255,0.2))'
    }}
  />
</div>


      {/* Draggable grip */}
      <div
        onMouseDown={onGripMouseDown}
        style={{
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'ns-resize',
        }}
      >
        <FontAwesomeIcon icon={faGrip} style={{ color: '#fcfcfc', fontSize: '14px', opacity: 0.7 }} />
      </div>
    </div>
  );
};

export default Launcher;
