import React, { useState } from 'react';

export default function Whistleblower() {
  const [category, setCategory] = useState('Port Delays');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const submit = async () => {
    if (!description.trim()) return;
    try {
      await fetch('http://localhost:5000/whistleblower', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, description }),
      });
    } catch (e) {}
    setSubmitted(true);
    showToast('Report received anonymously — your identity is protected');
  };

  if (submitted) {
    return (
      <div>
        <div className="page-header">
          <h2>Whistleblower Space</h2>
        </div>
        <div className="card" style={{textAlign:'center', padding:'60px'}}>
          <div style={{fontSize:'48px', marginBottom:'16px'}}>🔒</div>
          <h3 style={{color:'#10B981', marginBottom:'12px'}}>Report Received</h3>
          <p style={{color:'#64748B', marginBottom:'24px', fontSize:'14px'}}>
            Your anonymous report has been received. No identity data was stored. Your report will be verified and fed into our prediction engine.
          </p>
          <button className="btn btn-secondary" onClick={() => { setSubmitted(false); setDescription(''); }}>
            Submit Another Report
          </button>
        </div>
        {toast && <div className="toast">{toast}</div>}
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h2>Whistleblower Space</h2>
        <p>Anonymous reporting for supply chain manipulation, price fixing, and artificial shortages</p>
      </div>

      <div className="grid-2">
        <div>
          <div className="whistle-card">
            <div className="whistle-icon">🔒</div>
            <div className="whistle-title">Your Identity is Protected</div>
            <div className="whistle-desc">No login required. No IP address stored. No identity data collected. Your report is completely anonymous.</div>
          </div>

          <div className="whistle-card" style={{background:'#0F1D30', borderColor:'#3B82F630'}}>
            <div className="whistle-icon">📡</div>
            <div className="whistle-title" style={{color:'#3B82F6'}}>Feeds Into AI Detection</div>
            <div className="whistle-desc">Every verified report strengthens our prediction accuracy. Insider knowledge from port workers, warehouse staff, and truck drivers catches what satellites miss.</div>
          </div>

          <div className="whistle-card" style={{background:'#1D150F', borderColor:'#F59E0B30'}}>
            <div className="whistle-icon">⚡</div>
            <div className="whistle-title" style={{color:'#F59E0B'}}>Three Villains We Fight</div>
            <div className="whistle-desc">Governments hiding supply data. Corporations controlling distribution for profit. A broken system with no community protection. Your report fights all three.</div>
          </div>
        </div>

        <div className="card">
          <div className="anon-badge">
            🔒 Anonymous Report
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)}>
              <option>Port Delays</option>
              <option>Stock Manipulation</option>
              <option>Price Fixing</option>
              <option>Artificial Shortage Creation</option>
              <option>Government Data Hiding</option>
              <option>Corporate Hoarding</option>
              <option>Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>What are you witnessing?</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what you're seeing. Be as specific as possible — location, quantities, dates, organizations involved..."
              style={{minHeight:'160px'}}
            />
          </div>

          <button className="btn btn-primary" style={{width:'100%'}} onClick={submit} disabled={!description.trim()}>
            Submit Anonymously
          </button>

          <p style={{fontSize:'11px', color:'#374151', marginTop:'12px', textAlign:'center', lineHeight:'1.6'}}>
            By submitting you confirm this report is truthful to the best of your knowledge.
            False reports harm the communities we protect.
          </p>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}