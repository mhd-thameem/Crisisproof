import React, { useState } from 'react';

export default function Dashboard() {
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState([]);
  const [systemPulse, setSystemPulse] = useState('online');

  const RENDER_URL = 'https://crisisproof.onrender.com'; 

  const analyze = async () => {
    if (!headline.trim()) return;
    setLoading(true);
    setSystemPulse('processing');
    try {
      const res = await fetch(`${RENDER_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline }),
      });
      const data = await res.json();
      if (data.success) {
        // Automatically prepend to the list with a high-entry animation
        setFeed(prev => [{ headline, analysis: data.analysis }, ...prev]);
        setSystemPulse('online');
      }
    } catch (e) {
      setSystemPulse('error');
    } finally {
      setLoading(false);
    }
  };

  const loadFeed = async () => {
    setLoading(true);
    setSystemPulse('scanning');
    try {
      const res = await fetch(`${RENDER_URL}/analyze-feed`);
      const data = await res.json();
      if (data.success) {
        setFeed(data.data);
        setSystemPulse('online');
      }
    } catch (e) {
      setSystemPulse('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-premium">
        <div className="header-logic">
          <h2>Strategic Intelligence Terminal</h2>
          <div className="system-status">
            <span className={`status-dot ${systemPulse}`}></span>
            <span className="status-label">SYS_STATUS: {systemPulse.toUpperCase()}</span>
          </div>
        </div>
        <div className="header-meta">
          <span className="model-badge">GEMINI 3.1 FLASH LITE</span>
        </div>
      </div>

      <div className="analysis-input-vault">
        <input
          className="cyber-input"
          value={headline}
          onChange={e => setHeadline(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="INPUT GLOBAL SIGNAL (E.G. GEOPOLITICAL FRICTION, PORT STRIKE)..."
        />
        <button className="cyber-btn-primary" onClick={analyze} disabled={loading}>
          {loading ? 'ANALYZING...' : 'DECRYPT SIGNAL'}
        </button>
      </div>

      <div className="feed-container-premium">
        <div className="feed-header">
          <h3><span className="icon">🛰️</span> GLOBAL RISK STREAM</h3>
          <button className="cyber-btn-secondary" onClick={loadFeed} disabled={loading}>
            {loading ? 'SYNCING...' : 'REFRESH FEED'}
          </button>
        </div>

        <div className="feed-grid">
          {feed.length === 0 ? (
            <div className="empty-terminal">
              <p>NO ACTIVE THREATS DETECTED</p>
              <span>INJECT SIGNAL OR REFRESH SATELLITE FEED</span>
            </div>
          ) : (
            feed.map((item, i) => {
              const severity = item.analysis?.severity?.toUpperCase() || 'LOW';
              const confidence = item.analysis?.confidence ? Math.round(item.analysis.confidence * 100) : 95;
              
              return (
                <div key={i} className={`premium-risk-card border-${severity}`}>
                  <div className="card-top">
                    <span className="commodity-badge">{item.analysis?.commodity || 'GENERAL'}</span>
                    <span className={`risk-tag ${severity}`}>{severity} RISK</span>
                  </div>
                  
                  <h4 className="headline-text">{item.headline}</h4>
                  <p className="logic-description">{item.analysis?.logic || item.analysis?.primaryImpact}</p>
                  
                  <div className="card-bottom">
                    <div className="confidence-metrics">
                      <div className="metric-label">INTEL CONFIDENCE: {confidence}%</div>
                      <div className="progress-bg">
                        <div className="progress-fill" style={{ width: `${confidence}%`, backgroundColor: getSeverityColor(severity) }}></div>
                      </div>
                    </div>
                    <div className="verification-stamp">
                      <span className="check-icon">✓</span> AI VERIFIED
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function getSeverityColor(severity) {
  if (severity === 'HIGH') return '#ff4d4d';
  if (severity === 'MEDIUM') return '#ff9f43';
  return '#00d2d3';
}
