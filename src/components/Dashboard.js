import React, { useState } from 'react';

export default function Dashboard() {
  const [headline, setHeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [feed, setFeed] = useState([]);
  const [systemPulse, setSystemPulse] = useState('online');

  // THE KEY FIX: This must match the URL where you saw the JSON success!
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
      console.log("🛰️ Requesting: ", `${RENDER_URL}/analyze-feed`);
      const res = await fetch(`${RENDER_URL}/analyze-feed`);
      const data = await res.json();
      
      if (data.success) {
        console.log("✅ Data Received:", data.data);
        setFeed(data.data);
        setSystemPulse('online');
      }
    } catch (e) {
      console.error("❌ Link Broken:", e);
      setSystemPulse('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="page-header">
        <h2>Supply Chain Intelligence</h2>
        <p>Status: <span className={`pulse-text ${systemPulse}`}>{systemPulse.toUpperCase()}</span></p>
      </div>

      <div className="card analyze-section main-glow">
        <div className="input-group">
          <input
            className="intel-input"
            value={headline}
            onChange={e => setHeadline(e.target.value)}
            placeholder="Scan global signal..."
          />
          <button className="btn btn-primary" onClick={analyze} disabled={loading}>
            {loading ? '...' : 'DECRYPT'}
          </button>
        </div>
      </div>

      <div className="card glass-card">
        <div className="card-header">
          <h3>Global Intel Feed</h3>
          <button className="btn btn-secondary" onClick={loadFeed} disabled={loading}>
            {loading ? 'SCANNING (20s)...' : 'REFRESH FEED'}
          </button>
        </div>
        <div className="feed-scroll">
          {feed.length === 0 ? (
            <div className="empty-state">📡 No active signals. Click Refresh.</div>
          ) : (
            feed.map((item, i) => (
              <div key={i} className={`disruption-item border-${item.analysis?.severity}`}>
                <strong>{item.headline}</strong>
                <div className="meta">
                   {item.analysis?.commodity} | {item.analysis?.severity?.toUpperCase()} | {Math.round(item.analysis?.confidence * 100)}% Confidence
                </div>
                <p style={{fontSize: '12px', marginTop: '5px'}}>{item.analysis?.logic}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
