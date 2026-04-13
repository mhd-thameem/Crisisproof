import React, { useState, useEffect } from 'react';

// Enhanced Mock Regions - We can make these dynamic based on AI results later
const INITIAL_REGIONS = [
  { name: 'Maharashtra', status: 'high' },
  { name: 'Gujarat', status: 'high' },
  { name: 'Karnataka', status: 'medium' },
  { name: 'Tamil Nadu', status: 'medium' },
  { name: 'Rajasthan', status: 'low' },
  { name: 'Punjab', status: 'low' },
];

export default function Dashboard() {
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [feed, setFeed] = useState([]);
  const [feedLoading, setFeedLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [systemPulse, setSystemPulse] = useState('online');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

const analyze = async () => {
    if (!headline.trim()) return;
    setLoading(true);
    setSystemPulse('processing');
    try {
      // FIX: Changed from localhost to your Render link
      const res = await fetch('https://crisisproof.onrender.com/analyze-feed'); 
      const data = await res.json();
      
      if (data.success) {
        // We use the first result from the feed for the "Decrypt" result
        setResult(data.feed[0].analysis); 
        setFeed(data.feed);
        showToast('Gemini Intelligence Synced');
        setSystemPulse('online');
      }
    } catch (e) {
      showToast('Neural Link Error');
      setSystemPulse('error');
    }
    setLoading(false);
  };

 const loadFeed = async () => {
    setFeedLoading(true);
    try {
      // FIX: Corrected URL and changed method to GET to match your backend
      const res = await fetch('https://crisisproof.onrender.com/analyze-feed');
      const data = await res.json();
      
      if (data.success) {
        setFeed(data.feed); // FIX: Changed 'results' to 'feed'
        showToast('Global Feed Decrypted');
        setSystemPulse('online');
      }
    } catch (e) {
      showToast('Satellite Feed Offline');
      setSystemPulse('error');
    }
    setFeedLoading(false);
  };

  const getSeverityColor = (s) => {
    const colors = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };
    return colors[s] || '#64748B';
  };

  return (
    <div className="dashboard-container">
      {/* HEADER SECTION: Added System Status Pulse */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Supply Chain Intelligence</h2>
            <p>Real-time disruption monitoring | <span className={`pulse-text ${systemPulse}`}>{systemPulse.toUpperCase()}</span></p>
          </div>
          {/* Legend addition: Quick action status */}
          <div className="live-indicator">
            <span className="dot"></span> LIVE DATA STREAM
          </div>
        </div>
      </div>

      {/* STATS GRID: Dynamic calculation from feed */}
      <div className="stats-grid">
        <div className={`stat-card ${feed.some(f => f.analysis?.severity === 'high') ? 'danger-glow' : ''}`}>
          <div className="label">Critical Disruptions</div>
          <div className="value">{feed.filter(f => f.analysis?.severity === 'high').length}</div>
          <div className="change" style={{ color: '#EF4444' }}>Immediate Action Req.</div>
        </div>
        <div className="stat-card">
          <div className="label">AI Confidence Avg</div>
          <div className="value">
            {feed.length > 0 
              ? Math.round(feed.reduce((acc, curr) => acc + (curr.analysis?.confidence || 0), 0) / feed.length) 
              : 0}%
          </div>
          <div className="change">Gemini 3.1 Accuracy</div>
        </div>
        <div className="stat-card">
          <div className="label">Active Commodities</div>
          <div className="value">{new Set(feed.map(f => f.analysis?.commodity)).size}</div>
          <div className="change">Monitoring LPG, Fuel, Oil</div>
        </div>
      </div>

      {/* MAIN ANALYSIS AREA */}
      <div className="card analyze-section main-glow">
        <div className="card-header">
          <div>
            <div className="card-title">Deep Analysis Engine</div>
            <div className="card-subtitle">AI processes global geopolitical shifts into local supply risks</div>
          </div>
        </div>
        <div className="input-group">
          <input
            className="intel-input"
            value={headline}
            onChange={e => setHeadline(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder="Scan headline: e.g., 'Port strike in Mundra'..."
          />
          <button className="btn btn-primary btn-glow" onClick={analyze} disabled={loading || !headline.trim()}>
            {loading ? <span className="loading-spinner" /> : 'DECRYPT RISK'}
          </button>
        </div>

        {result && (
          <div className={`result-card result-anim ${result.severity}`}>
            <div className="result-grid">
              <div className="result-item">
                <div className="rlabel">TARGET COMMODITY</div>
                <div className="rvalue highlight">{result.commodity}</div>
              </div>
              <div className="result-item">
                <div className="rlabel">RISK LEVEL</div>
                <div className="rvalue" style={{ color: getSeverityColor(result.severity), fontWeight: '800' }}>
                  {result.severity?.toUpperCase()}
                </div>
              </div>
              <div className="result-item">
                <div className="rlabel">IMPACT WINDOW</div>
                <div className="rvalue">{result.timeline}</div>
              </div>
              <div className="result-item">
                <div className="rlabel">THREAT REASON</div>
                <div className="rvalue" style={{ fontSize: '13px', lineHeight: '1.4' }}>{result.reason}</div>
              </div>
            </div>
            
            <div className="confidence-zone">
              <div className="rlabel">AI CONFIDENCE SCORE: {result.confidence}%</div>
              <div className="confidence-bar-container">
                <div className="confidence-fill-glow" style={{ width: `${result.confidence}%`, backgroundColor: getSeverityColor(result.severity) }} />
              </div>
            </div>

            {result.affectedRegions && (
              <div className="regions-container">
                <div className="rlabel">PREDICTED IMPACT ZONES:</div>
                <div className="regions-list">
                  {result.affectedRegions.map(r => <span key={r} className={`region-tag tag-${result.severity}`}>{r}</span>)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FEED AND MAP SECTION */}
      <div className="grid-2">
        <div className="card glass-card">
          <div className="card-header">
            <div>
              <div className="card-title">Global Intel Feed</div>
              <div className="card-subtitle">Satellite & News Aggregation</div>
            </div>
            <button className="btn btn-secondary" onClick={loadFeed} disabled={feedLoading}>
              {feedLoading ? <span className="loading-spinner" /> : 'SCAN SKY'}
            </button>
          </div>
          <div className="feed-scroll">
            {feed.length === 0 ? (
              <div className="empty-state">📡 Waiting for signal...</div>
            ) : (
              feed.map((item, i) => (
                <div key={i} className={`disruption-item border-${item.analysis?.severity}`}>
                  <div className="disruption-headline">{item.headline}</div>
                  <div className="disruption-meta">
                    <span className={`mini-badge ${item.analysis?.severity}`}>{item.analysis?.severity}</span>
                    <span className="meta-tag">{item.analysis?.commodity}</span>
                    <span className="meta-tag-alt">{item.analysis?.confidence}% Match</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Regional Risk Map</div>
          </div>
          <div className="map-viz">
            {/* Visual enhancement: India Map with pulse dots */}
            <div className="map-placeholder-legendary">
                <div className="map-overlay">
                    {INITIAL_REGIONS.filter(r => r.status === 'high').map(r => (
                        <div key={r.name} className="map-pulse-dot" />
                    ))}
                </div>
              <div className="map-icon">🇮🇳</div>
              <p>Supply Chain Heatmap</p>
            </div>
          </div>
          <div className="region-indicators">
            {INITIAL_REGIONS.map(r => (
              <div key={r.name} className="region-row">
                <span className="region-name">{r.name}</span>
                <div className="status-group">
                  <span className={`status-label ${r.status}`}>{r.status}</span>
                  <div className={`status-dot-inner ${r.status}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  );
}
