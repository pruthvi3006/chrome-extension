import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBolt, faCheckCircle, faChartLine, faPlay } from '@fortawesome/free-solid-svg-icons';

const agents = [
  {
    title: 'Fact Check',
    description: 'Verify online claims with confidence',
    color: '#22c55e', // green
    icon: faCheckCircle,
  },
  {
    title: 'TL;DR',
    description: 'Instant article & document summarizer',
    color: '#ef4444', // red
    icon: faBolt,
  },
  {
    title: 'Executive Summary',
    description: 'Transform complex content into clear summaries',
    color: '#facc15', // yellow
    icon: faChartLine,
  },
  {
    title: 'YT ➔ Executive...',
    description: 'Generates summaries of YouTube video transcripts',
    color: '#f59e0b', // amber
    icon: faChartLine,
  }
];

const App: React.FC = () => {

  const handleClick=()=>{
    const container=document.getElementById('skynet-panel-container');
    if(container)
      document.body.removeChild(container);
  }

  return (
    <div style={{
      width: '100%',
      height: '100%',
      backgroundColor: '#1a1a1a',
      color: 'white',
      fontFamily: 'sans-serif',
      overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderBottom: '1px solid #3f3f46'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: 'white' }}></div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>MindStudio</span>
        </div>
        <div style={{ fontSize: '14px', color: '#a1a1aa' }}>Browse Agents</div>
      </div>

      <button style={{height:"10px",width:"30px"}} onClick={handleClick}>BACK</button>

      {/* Agent Section */}
      <div style={{ padding: '16px' }}>
        {/* Top Agent */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#27272a',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              backgroundColor: '#22c55e',
              color: 'white'
            }}>
              <FontAwesomeIcon icon={faCheckCircle} />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: '14px' }}>Fact Check</div>
              <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Verify online claims with confidence</div>
            </div>
          </div>
          <button style={{
            backgroundColor: '#3f3f46',
            color: 'white',
            fontSize: '12px',
            padding: '4px 12px',
            borderRadius: '9999px',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <FontAwesomeIcon icon={faPlay} /> Run
          </button>
        </div>

        {/* Analyze Content */}
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>Analyze Content</h3>
          <p style={{ fontSize: '12px', color: '#a1a1aa', marginBottom: '12px' }}>Summarize or transform the content of sites.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {agents.slice(1).map((agent, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: '#27272a',
                padding: '12px',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    backgroundColor: agent.color,
                    color: 'white'
                  }}>
                    <FontAwesomeIcon icon={agent.icon} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>{agent.title}</div>
                    <div style={{ fontSize: '12px', color: '#a1a1aa', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{agent.description}</div>
                  </div>
                </div>
                <button style={{
                  backgroundColor: '#3f3f46',
                  color: 'white',
                  fontSize: '12px',
                  padding: '4px 12px',
                  borderRadius: '9999px',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <FontAwesomeIcon icon={faPlay} /> Run
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
