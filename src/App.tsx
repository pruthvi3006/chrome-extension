import React from 'react';

const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem', background: '#1a1a1a', color: '#fff', height: '100vh' }}>
      <h1>🧠 Skynet AI Control Panel</h1>
      <p>This is a full React app rendered inside the side panel.</p>
      <button onClick={() => window.parent.postMessage({ type: 'CLOSE_PANEL' }, '*')}>
        Close Panel
      </button>
    </div>
  );
};

export default App;
