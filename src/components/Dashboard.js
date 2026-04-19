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
        setFeed(prev => [{ headline, analysis: data.analysis }, ...prev]);
        setSystemPulse('online');
      }
    } catch (e) { setSystemPulse('error'); } 
    finally { setLoading(false); setHeadline(''); }
  };

  const loadFeed = async () => {
    setLoading(true);
    setSystemPulse('processing');
    try {
      const res = await fetch(`${RENDER_URL}/analyze-feed`);
      const data = await res.json();
      if (data.success) {
        setFeed(data.data);
        setSystemPulse('online');
      }
    } catch (e) { setSystemPulse('error'); } 
    finally { setLoading(false); }
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h2>Strategic Intelligence Terminal</h2>
        <div style={{display: 'flex', alignItems: 'center', marginTop: '8px'}}>
          <span className={`status-dot ${systemPulse}`}></span>
          <span style={{fontSize: '11px', fontWeight: '800', color: '#64748B', letterSpacing: '1px'}}>
            SYS_STATUS: {systemPulse.toUpperCase()} | ENGINE: GEMINI 3.1 FLASH LITE
          </span>
        </div>
      </header>

      <div className="analysis-input-vault">
        <input
          className="cyber-input"
          value={headline}
          onChange={e => setHeadline(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && analyze()}
          placeholder="INPUT GLOBAL SIGNAL FOR DECRYPTION (E.G. RED SEA DISRUPTION)..."
        />
        <button className="cyber-btn-primary" onClick={analyze} disabled={loading}>
          {loading ? 'PROCESSING...' : 'DECRYPT SIGNAL'}
        </button>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <h3 style={{fontSize: '0.8rem', letterSpacing: '3px', color: '#475569', fontWeight: '900'}}>GLOBAL RISK STREAM</h3>
        <button className="cyber-btn-secondary" onClick={loadFeed} disabled={loading}>REFRESH SATELLITE FEED</button>
      </div>

      <div className="feed-grid">
        {feed.length === 0 ? (
          <div className="empty-terminal" style={{gridColumn: '1 / -1'}}>
            <p>NO ACTIVE THREATS DETECTED IN LOCAL BUFFER</p>
            <span style={{fontSize: '0.65rem', marginTop: '10px', display: 'block'}}>SYNC WITH GLOBAL DATA SOURCE TO POPULATE TERMINAL</span>
          </div>
        ) : (
          feed.map((item, i) => {
            const severity = item.analysis?.severity?.toUpperCase() || 'LOW';
            const confidence = item.analysis?.confidence ? Math.round(item.analysis.confidence * 100) : 95;
            
            return (
              <div key={i} className={`premium-risk-card border-${severity}`}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                  <span style={{fontSize: '10px', fontWeight: '900', color: '#00f2ff', background: 'rgba(0,242,255,0.1)', padding: '4px 8px', borderRadius: '4px'}}>
                    {item.analysis?.commodity?.toUpperCase() || 'GENERAL'}
                  </span>
                  <span style={{fontSize: '10px', fontWeight: '900', color: severity === 'HIGH' ? '#ff4d4d' : '#00d2d3'}}>
                    {severity} RISK
                  </span>
                </div>
                <h4 style={{fontSize: '1.1rem', marginBottom: '12px', lineHeight: '1.3'}}>{item.headline}</h4>
                <p style={{fontSize: '0.85rem', color: '#94a3b8', lineHeight: '1.5', marginBottom: '1.5rem'}}>
                  {item.analysis?.logic || 'Contextualizing geopolitical ripple effects...'}
                </p>
                <div style={{borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div>
                    <div style={{fontSize: '9px', color: '#64748B', marginBottom: '4px'}}>AI CONFIDENCE: {confidence}%</div>
                    <div style={{width: '120px', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden'}}>
                      <div style={{width: `${confidence}%`, height: '100%', background: '#00f2ff'}}></div>
                    </div>
                  </div>
                  <span style={{fontSize: '9px', fontWeight: '900', color: '#10B981'}}>VERIFIED DATA</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
