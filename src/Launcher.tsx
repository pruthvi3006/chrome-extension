import React, { useRef, useEffect, useState } from 'react';

const Launcher: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const offsetY = useRef(0);

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    offsetY.current = e.clientY - (ref.current?.getBoundingClientRect().top || 0);
    document.body.style.userSelect = 'none';
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!dragging || !ref.current) return;
    const newY = e.clientY - offsetY.current;
    ref.current.style.top = `${Math.max(0, Math.min(window.innerHeight - 64, newY))}px`;
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

  return (
    <div
      id="gemini-vertical-launcher"
      ref={ref}
      style={{ top: '40%', position: 'fixed', right: 0 }}
      onMouseDown={onMouseDown}
    >
      📎
    </div>
  );
};

export default Launcher;
