import React, { useState, useEffect } from 'react';
import { faBolt, faPlay, faChevronLeft, faFeather, faFileAlt, faSearch, faXmark, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Web3Auth } from "@web3auth/modal";

interface Agent {
  subnet_name: string;
  description: string;
  subnet_url: string;
}

const App = () => {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [searchText, setSearchText] = useState('');
  const [results, setResults] = useState<Record<string, string>>({});
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);

  useEffect(() => {
    const initWeb3Auth = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: "BDvSVO5JxE88zTsACm_02A6SzTpcSMKUFtflalmoyoua7pYyXD83L-z4QJZa_lgneZbSjPIfNMtxaARAmjg4-JY", // Example client ID - replace with yours
          web3AuthNetwork: "sapphire_devnet",
          uiConfig: {
            theme:{primary:"#000"},
            loginMethodsOrder: ["google", "facebook"]
          }
        });

        await web3auth.init();
        setWeb3auth(web3auth);
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      }
    };

    initWeb3Auth();
  }, []);
  const logoSrc = typeof chrome !== "undefined" && chrome.runtime?.getURL
  ? chrome.runtime.getURL("icons/logo.png")
  : "icons/logo.png";
  useEffect(() => {
  const fetchAgents = async () => {
    setIsLoading('Fetching agents...');
    try {
      const response = await fetch('http://localhost:3000/');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAgents(data.map((agent: any) => ({
        subnet_name: agent.subnet_name,
        description: agent.description,
        subnet_url: agent.subnet_url
      })));
    } catch (error) {
      console.error('Error fetching agents:', error);
      setAgents([]);
    } finally {
      setIsLoading(null);
    }
  };

  fetchAgents();
}, []); 

      

  const handleLogin = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }
    try {
      await web3auth.connect();
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const handleLogout = async () => {
    if (!web3auth) {
      console.error("Web3Auth not initialized");
      return;
    }
    try {
      await web3auth.logout();
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const handleRunAgent = async (agentName: string, promptFn: (text: string) => string) => {
    if (!isLoggedIn) {
      alert("Please login to use the agents");
      return;
    }
    const content = document.body.innerHTML;
    console.log(content);
    setIsLoading(agentName);
    setResults(prev => ({ ...prev, [agentName]: 'Processing...' }));
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

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'sans-serif', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #3f3f46' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logoSrc} alt="SkyStudio Logo" style={{ width: '24px', height: '24px', borderRadius: '4px' }} />
          <span style={{ fontSize: '14px', fontWeight: 600 }}>SkyAgents Hub</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ fontSize: '14px', color: '#a1a1aa' }}>Browse Agents</div>
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              style={{
                background: '#ef4444',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={handleLogin}
              style={{
                background: '#22c55e',
                border: 'none',
                color: '#ffffff',
                fontSize: '12px',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: 'pointer'
              }}
            >
              Login
            </button>
          )}
        </div>
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
                    <FontAwesomeIcon icon={faFeather} size="lg" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{agent.subnet_name}</div>
                    <div style={{ fontSize: '12px', color: '#a1a1aa' }}>{agent.description}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleRunAgent(agent.subnet_name, () => "")}
                  disabled={!isLoggedIn}
                  style={{
                    background: isLoggedIn ? '#3f3f46' : '#27272a',
                    border: '1px solid #3f3f46',
                    color: isLoggedIn ? '#ffffff' : '#6b7280',
                    fontSize: '12px',
                    borderRadius: '4px',
                    padding: '6px 12px',
                    cursor: isLoggedIn ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FontAwesomeIcon icon={faCirclePlay} />
                  {isLoggedIn ? 'Run' : 'Login Required'}
                </button>
              </div>
              {results[agent.subnet_name] && (
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#1a1a1a', borderRadius: '4px', fontSize: '12px' }}>
                  {results[agent.subnet_name]}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ padding: '16px', textAlign: 'center', color: '#a1a1aa', fontSize: '14px' }}>
          No agents found
        </div>
      )}
    </div>
  );
};

export default App;