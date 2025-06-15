// App.tsx
import React, { useState } from 'react';
import { faBolt, faPlay, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const GEMINI_API_KEY = 'AIzaSyChH-baRHdB8HHq7NipOcCqWJ8ENXjN1sU';

const App = () => {
  const [summaryResult, setSummaryResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleBack = () => {
    
      const container = document.getElementById('skynet-panel-container');
      if (container) document.body.removeChild(container);
  };
  const handleSummarize = async () => {
    setSummaryResult('Summarizing page...');
    setIsLoading(true);    try {
      // Get the text directly since we're in the content script context
      const pageText = window.getSelection()?.toString() || document.body.innerText.slice(0, 3000);

      if (!pageText) {
        setSummaryResult('No text found on the page. Try selecting some text or ensure the page has readable content.');
        setIsLoading(false);
        return;
      }      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-goog-api-key': GEMINI_API_KEY
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `Summarize this web content briefly and clearly:\n\n${pageText}` },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();      if (!res.ok) {
        const errMsg = data?.error?.message || res.statusText;
        throw new Error(errMsg);
      }

      if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('No summary generated. The API response was empty.');
      }

      setSummaryResult(data.candidates[0].content.parts[0].text.trim());
    } catch (error) {
      console.error('Error during summarization:', error);
      setSummaryResult(`An error occurred: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'sans-serif', overflowY: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderBottom: '1px solid #3f3f46' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '24px', height: '24px', borderRadius: '4px', backgroundColor: 'white' }}></div>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>SkyStudio</span>
        </div>
        <div style={{ fontSize: '14px', color: '#a1a1aa' }}>Summarize Page</div>
      </div>

      <button
        onClick={handleBack}
        style={{ margin: '16px', background: 'transparent', border: '1px solid #3f3f46', color: '#ffffff', fontSize: '12px', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>
        <FontAwesomeIcon icon={faChevronLeft} size="xs" /> BACK
      </button>

      <div style={{ padding: '16px' }}>
        <div style={{ backgroundColor: '#27272a', padding: '12px', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ backgroundColor: '#ef4444', borderRadius: '12px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FontAwesomeIcon icon={faBolt} size="lg" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px' }}>Summarize Page</div>
                <div style={{ fontSize: '12px', color: '#a1a1aa' }}>Get a concise summary of this page</div>
              </div>
            </div>
            <button
              onClick={handleSummarize}
              disabled={isLoading}
              style={{ backgroundColor: isLoading ? '#5a5a5a' : '#3f3f46', color: 'white', fontSize: '12px', padding: '6px 12px', borderRadius: '9999px', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {isLoading ? 'Summarizing...' : <><FontAwesomeIcon icon={faPlay} size="xs" /> Run</>}
            </button>
          </div>
          {summaryResult && (
            <div style={{ marginTop: '12px', backgroundColor: '#1f1f1f', padding: '8px', borderRadius: '6px', fontSize: '12px', color: '#e0e0e0', whiteSpace: 'pre-wrap' }}>
              {summaryResult}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
