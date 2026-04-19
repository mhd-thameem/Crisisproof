import React, { useState } from 'react';

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

  const BASE_URL = 'https://crisisproof.onrender.com';

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // 1. Single Headline Analysis (POST)
  const analyze = async () => {
    if (!headline.trim()) return;
    setLoading(true);
    setSystemPulse('processing');
    try {
      const res = await fetch(`${BASE_URL}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.analysis);
        setFeed(prev => [{ headline, analysis: data.analysis }, ...prev]);
        showToast('Gemini Intelligence Synced');
        setSystemPulse('online');
      }
    } catch (e) {
      showToast('Neural Link Error');
      setSystemPulse('error');
    } finally {
      setLoading(false);
    }
  };

  // 2. Global Feed Scan (GET)
  const loadFeed = async () => {
    setFeedLoading(true);
    showToast('Staggered Scan Initiated (20s)...');
    try {
      // Changed to GET and /analyze-feed to match the backend logic
      const res = await fetch(`${BASE_URL}/analyze-feed`);
      const data = await res.json();
      if (data.success) {
        setFeed(data.data); // Mapping 'data' array from backend
        showToast('Global Feed Decrypted');
      }
    } catch (e) {
      showToast('Satellite Feed Offline');
    } finally {
      setFeedLoading(false);
    }
  };

  const getSeverityColor = (s) => {
    const colors = { high: '#EF4444', medium: '#F59E0B', low: '#10B981' };
    return colors[s] || '#64748B';
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Supply Chain Intelligence</h2>
            <p>Real-time disruption monitoring | <span className={`pulse-text ${systemPulse}`}>{systemPulse.toUpperCase()}</span></p>
          </div>
          <div className="live-indicator">
            <span className="dot"></span> LIVE DATA STREAM
          </div>
        </div>
      </div>

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
              ? Math.round(feed.reduce((acc, curr) => acc + (curr.analysis?.confidence || 0), 0) / feed.length * 100) 
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
                <div className="rlabel">LOGIC ENGINE</div>
                <div className="rvalue" style={{ fontSize: '13px', lineHeight: '1.4' }}>{result.logic || result.primaryImpact}</div>
              </div>
            </div>
            
            <div className="confidence-zone">
              <div className="rlabel">AI CONFIDENCE SCORE: {Math.round(result.confidence * 100)}%</div>
              <div className="confidence-bar-container">
                <div className="confidence-fill-glow" style={{ width: `${result.confidence * 100}%`, backgroundColor: getSeverityColor(result.severity) }} />
              </div>
            </div>
          </div>
        )}
      </div>

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
                    <span className="meta-tag-alt">{Math.round(item.analysis?.confidence * 100)}% Match</span>
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
        </div>
      </div>

      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  );
}
