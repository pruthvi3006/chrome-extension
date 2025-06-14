import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faS, faGrip } from '@fortawesome/free-solid-svg-icons';

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
      existing.remove();
      return;
    }

    const container = document.createElement('div');
    container.id = 'skynet-panel-container';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.right = '0';
    container.style.width = '400px';
    container.style.height = '100vh';
    container.style.zIndex = '999999';
    container.style.borderLeft = '1px solid #444';
    container.style.backgroundColor = '#1a1a1a';

    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL('iframe.html');
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';

    container.appendChild(iframe);
    document.body.appendChild(container);
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
        borderRadius: '16px 0 0 16px',
        background: '#2a2a2a',
        width: '48px',
        height: '64px',
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
        <FontAwesomeIcon icon={faS} style={{ color: '#f0f0f0', fontSize: '18px' }} />
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
