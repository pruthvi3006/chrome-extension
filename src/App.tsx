import React, { useState, useEffect } from 'react';
import { faBolt, faPlay, faChevronLeft, faFeather, faFileAlt, faSearch, faXmark, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GEMINI_API_KEY = 'AIzaSyChH-baRHdB8HHq7NipOcCqWJ8ENXjN1sU';

const App = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});

  const agents = [
    {
      name: 'Tweet Generator',
      icon: faFeather,
      subtitle: 'Generate a tweet based on this page',
      prompt: (text: string) => `Write a short tweet (max 280 chars) about this content:

${text}`
    },
    {
      name: 'Blog Writer',
      icon: faFileAlt,
      subtitle: 'Write a blog intro from this page',
      prompt: (text: string) => `Write a compelling blog introduction based on this content:

${text}`
    },
    {
      name: 'Fact Checker',
      icon: faSearch,
      subtitle: 'Check facts mentioned in the content',
      prompt: (text: string) => `Fact check the following content and summarize any inaccuracies or confirmations:

${text}`
    },
    {
      name: 'YouTube Summarizer',
      icon: faCirclePlay,
      subtitle: 'Summarize YouTube video content',
      prompt: (text: string) => `Summarize this YouTube video transcript or description:

${text}`
    },
    {
      name: 'Summarize Page',
      icon: faBolt,
      subtitle: 'Get a concise summary of this page',
      prompt: (text: string) => `Summarize this web content:

${text}`
    }
  ];

  const handleRunAgent = async (agentName: string, promptFn: (text: string) => string) => {
    setIsLoading(agentName);
    setResults(prev => ({ ...prev, [agentName]: 'Processing...' }));
    try {
      const pageText = window.getSelection()?.toString() || document.body.innerText.slice(0, 3000);
      if (!pageText) {
        setResults(prev => ({ ...prev, [agentName]: 'No content found to analyze.' }));
        setIsLoading(null);
        return;
      }
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptFn(pageText) }] }],
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || res.statusText);
      const output = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No result generated.';
      setResults(prev => ({ ...prev, [agentName]: output.trim() }));
    } catch (error) {
      setResults(prev => ({ ...prev, [agentName]: `Error: ${error instanceof Error ? error.message : String(error)}` }));
    } finally {
      setIsLoading(null);
    }
  };

  const handleBack = () => {
    const container = document.getElementById('skynet-panel-container');
    if (container) document.body.removeChild(container);
    document.body.style.marginRight = '';
    document.body.style.width = '';
  };

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'sans-serif', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #3f3f46' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={chrome.runtime.getURL("icons/logo.png")} alt="SkyStudio Logo" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>SkyAgents Hub</span>
        </div>
        <div style={{ fontSize: '14px', color: '#a1a1aa' }}>Browse Agents</div>
      </div>

      <button onClick={handleBack} style={{ margin: '16px', background: 'transparent', border: '1px solid #3f3f46', color: '#ffffff', fontSize: '12px', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faChevronLeft} size="xs" /> BACK
      </button>

      <div style={{ padding: '0 16px' }}>
        <input
          type="text"
          placeholder="Search agents..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #3f3f46',
            backgroundColor: '#27272a',
            color: 'white',
            fontSize: '12px',
            marginBottom: '12px',
          }}
        />
      </div>

      {filteredAgents.length > 0 ? (
        <div style={{ padding: '0 16px' }}>
          {filteredAgents.map((agent, index) => (
            <div key={index} style={{ backgroundColor: '#27272a', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ backgroundColor: '#ef4444', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesomeIcon icon={agent.icon} size="lg" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{agent.name}</div>
                    <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{agent.subtitle}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleRunAgent(agent.name, agent.prompt)}
                  disabled={isLoading === agent.name}
                  style={{
                    backgroundColor: isLoading === agent.name ? '#5a5a5a' : '#3f3f46',
                    color: 'white',
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: isLoading === agent.name ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                  {isLoading === agent.name ? 'Running...' : <><FontAwesomeIcon icon={faPlay} size="xs" /> Run</>}
                </button>
              </div>
              {results[agent.name] && (
                <div style={{ marginTop: '12px', backgroundColor: '#1f1f1f', padding: '8px', borderRadius: '6px', fontSize: '12px', color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
                  {results[agent.name]}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '0 16px', fontSize: '13px', color: '#a1a1aa' }}>
          No agents found.
        </div>
      )}
    </div>
  );
};

export default App;
