import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const REGIONS = [
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
  const [error, setError] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const analyze = async () => {
    if (!headline.trim()) return;
    setLoading(true);
    setResult(null);
    setError('');
    try {
      const res = await fetch(`${API}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.analysis);
        showToast('Analysis complete');
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch (e) {
      setError('Cannot reach server. Make sure backend is running.');
    }
    setLoading(false);
  };

  const loadFeed = async () => {
    setFeedLoading(true);
    try {
      const res = await fetch(`${API}/analyze-feed`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setFeed(data.results);
        showToast('Live feed updated');
      }
    } catch (e) {
      showToast('Could not load feed');
    }
    setFeedLoading(false);
  };

  const getSeverityColor = (s) => {
    if (s === 'high') return '#EF4444';
    if (s === 'medium') return '#F59E0B';
    return '#10B981';
  };

  return (
    <div>
      <div className="page-header">
        <h2>Supply Chain Intelligence</h2>
        <p>Real-time disruption monitoring for India's essential commodities</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card danger">
          <div className="label">Active Threats</div>
          <div className="value">{feed.filter(f => f.analysis?.severity === 'high').length || 2}</div>
          <div className="change" style={{color:'#EF4444'}}>High severity</div>
        </div>
        <div className="stat-card warning">
          <div className="label">Watch Zones</div>
          <div className="value">{feed.filter(f => f.analysis?.severity === 'medium').length || 3}</div>
          <div className="change" style={{color:'#F59E0B'}}>Medium severity</div>
        </div>
        <div className="stat-card safe">
          <div className="label">Regions Protected</div>
          <div className="value">6</div>
          <div className="change">Monitoring active</div>
        </div>
        <div className="stat-card">
          <div className="label">Warning Window</div>
          <div className="value">5-6w</div>
          <div className="change">Before street impact</div>
        </div>
      </div>

      <div className="card analyze-section">
        <div className="card-header">
          <div>
            <div className="card-title">Analyze Headline</div>
            <div className="card-subtitle">Paste any global news headline for instant supply chain risk analysis</div>
          </div>
        </div>
        <div className="input-group">
          <input
            value={headline}
            onChange={e => setHeadline(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && analyze()}
            placeholder="e.g. Iran threatens to close Strait of Hormuz..."
          />
          <button className="btn btn-primary" onClick={analyze} disabled={loading || !headline.trim()}>
            {loading ? <span className="loading-spinner" /> : 'Analyze'}
          </button>
        </div>

        {error && (
          <div style={{marginTop:'12px', padding:'12px', background:'#3D1515', borderRadius:'8px', color:'#EF4444', fontSize:'13px'}}>
            {error}
          </div>
        )}

        {result && (
          <div className="result-card">
            <h4>Analysis Result</h4>
            <div className="result-grid">
              <div className="result-item">
                <div className="rlabel">Commodity</div>
                <div className="rvalue">{result.commodity}</div>
              </div>
              <div className="result-item">
                <div className="rlabel">Severity</div>
                <div className="rvalue" style={{color: getSeverityColor(result.severity)}}>
                  {result.severity?.toUpperCase()}
                </div>
              </div>
              <div className="result-item">
                <div className="rlabel">Timeline</div>
                <div className="rvalue">{result.timeline}</div>
              </div>
              <div className="result-item">
                <div className="rlabel">Confidence</div>
                <div className="rvalue">{result.confidence > 1 ? result.confidence : Math.round(result.confidence * 100)}%</div>
              </div>
              <div className="result-item" style={{gridColumn:'2 / -1'}}>
                <div className="rlabel">Recommended Action</div>
                <div className="rvalue" style={{fontSize:'13px', color:'#94A3B8'}}>{result.recommendedAction}</div>
              </div>
            </div>
            <div className="confidence-bar">
              <div className="confidence-fill" style={{width:`${result.confidence}%`}} />
            </div>
            <div style={{marginTop:'12px', fontSize:'13px', color:'#64748B'}}>{result.reason}</div>
            {result.affectedRegions && (
              <div className="regions-list">
                {result.affectedRegions.map(r => <span key={r} className="region-tag">{r}</span>)}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Live Disruption Feed</div>
              <div className="card-subtitle">AI-analyzed global headlines</div>
            </div>
            <button className="btn btn-secondary" onClick={loadFeed} disabled={feedLoading}>
              {feedLoading ? <span className="loading-spinner" /> : 'Refresh'}
            </button>
          </div>
          {feed.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📡</div>
              <p>Click Refresh to load live analysis</p>
            </div>
          ) : (
            feed.map((item, i) => (
              <div key={i} className={`disruption-item ${item.analysis?.severity}`}>
                <div className="disruption-headline">{item.headline}</div>
                <div className="disruption-meta">
                  <span className={`badge badge-${item.analysis?.severity}`}>{item.analysis?.severity}</span>
                  <span className="meta-tag">{item.analysis?.commodity}</span>
                  <span className="meta-tag">{item.analysis?.timeline}</span>
                  <span className="meta-tag">{item.analysis?.confidence}% confidence</span>
                </div>
                <div className="confidence-bar" style={{marginTop:'8px'}}>
                  <div className="confidence-fill" style={{width:`${item.analysis?.confidence}%`}} />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Regional Status</div>
          </div>
          <div className="map-container" style={{marginBottom:'16px'}}>
            <div className="map-placeholder">
              <div className="map-icon">🗺️</div>
              <p>India Supply Chain Map</p>
              <p style={{fontSize:'11px', marginTop:'4px', color:'#374151'}}>Google Maps integration on deployment</p>
            </div>
          </div>
          <div className="region-indicators">
            {REGIONS.map(r => (
              <div key={r.name} className="region-row">
                <span className="region-name">{r.name}</span>
                <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                  <span style={{fontSize:'11px', color: r.status==='high'?'#EF4444':r.status==='medium'?'#F59E0B':'#10B981'}}>
                    {r.status}
                  </span>
                  <div className={`status-dot ${r.status}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
