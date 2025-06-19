import React, { useState, useEffect } from 'react';
import { faBolt, faPlay, faChevronLeft, faFeather, faFileAlt, faSearch, faXmark, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useWeb3 } from "./Web3ContextProvider";

interface Agent {
  subnet_name: string;
  description: string;
  subnet_url: string;
}

export default function ExtensionPanel() {
  const { login, logout, isAuthenticated, address } = useWeb3();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    fetch('http://localhost:3000/')
      .then(response => response.json())
      .then(data => {
        setAgents(data.map((agent: any) => ({
          subnet_name: agent.subnet_name,
          description: agent.description,
          subnet_url: agent.subnet_url
        })));
      })
      .catch(error => console.error('Error fetching agents:', error));
  }, []);

  const handleRunAgent = async (agentName: string, promptFn: (text: string) => string) => {
    const content = document.body.innerText;
    setIsLoading(agentName);
    setResults(prev => ({ ...prev, [agentName]: 'Processing...' }));

    setTimeout(() => {
      setResults(prev => ({
        ...prev,
        [agentName]: `Result for ${agentName}:\n\n${promptFn(content)}`
      }));
      setIsLoading(null);
    }, 1500);
  };

  const handleBack = () => {
    const container = document.getElementById('skynet-panel-container');
    if (container) document.body.removeChild(container);
    document.body.style.marginRight = '';
    document.body.style.width = '';
  };

  const filteredAgents = agents.filter(agent =>
    agent.subnet_name.toLowerCase().includes(searchText.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 16 }}>
        <h3>Login Required</h3>
        <button onClick={login}>Login with Web3Auth</button>
      </div>
    );
  }

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
                  <div style={{ backgroundColor: '#ef4444', borderRadius: '12px', padding: '10px' }}>
                    <FontAwesomeIcon icon={faFeather} size="lg" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{agent.subnet_name}</div>
                    <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{agent.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleRunAgent(agent.subnet_name, (text) => `Calling ${agent.subnet_url}\n\nWith Content:\n${text}`)}
                  disabled={isLoading === agent.subnet_name}
                  style={{
                    backgroundColor: isLoading === agent.subnet_name ? '#5a5a5a' : '#3f3f46',
                    color: 'white',
                    fontSize: '12px',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    border: 'none',
                    cursor: isLoading === agent.subnet_name ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                  {isLoading === agent.subnet_name ? 'Running...' : <><FontAwesomeIcon icon={faPlay} size="xs" /> Run</>}
                </button>
              </div>
              {results[agent.subnet_name] && (
                <div style={{ marginTop: '12px', backgroundColor: '#1f1f1f', padding: '8px', borderRadius: '6px', fontSize: '12px', color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
                  {results[agent.subnet_name]}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '0 16px', fontSize: '13px', color: '#a1a1aa' }}>No agents found.</div>
      )}

      <div style={{ padding: '16px', textAlign: 'center' }}>
        <button onClick={logout} style={{ backgroundColor: '#444', color: 'white', padding: '6px 12px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
    </div>
  );
}
