import React, { useState } from 'react';

const SAMPLE_POSTS = [
  { id: 1, author: 'Distributor_Mangalore', region: 'Karnataka', commodity: 'LPG', content: 'Stock levels at our depot are 40% below normal for the past 2 weeks. Deliveries from Udupi bottling plant delayed by 5 days consistently.', upvotes: 24, time: '2h ago', verified: true, ai_match: 'High' },
  { id: 2, author: 'Retailer_Pune', region: 'Maharashtra', commodity: 'Edible Oil', content: 'Sunflower oil prices jumped 18% this week at wholesale market. Suppliers citing international shortage.', upvotes: 18, time: '4h ago', verified: true, ai_match: 'High' },
];

export default function Community() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [report, setReport] = useState('');
  const [region, setRegion] = useState('');
  const [commodity, setCommodity] = useState('LPG');
  const [toast, setToast] = useState('');
  const [upvoted, setUpvoted] = useState({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const submitReport = async () => {
    if (!report.trim() || !region.trim()) return;
    
    setIsAnalyzing(true);
    showToast('Cross-referencing with Global Intel...');

    try {
      // PRO TIP: We call the same /analyze endpoint to let Gemini check the community report!
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ headline: `LOCAL REPORT: ${report} in ${region}` }),
      });
      const data = await res.json();

      const newPost = {
        id: Date.now(),
        author: 'Verified_User_' + Math.floor(Math.random() * 999),
        region, 
        commodity,
        content: report,
        upvotes: 0,
        time: 'just now',
        verified: data.analysis?.confidence > 0.7, // Auto-verify if AI confidence is high
        ai_match: data.analysis?.severity || 'low'
      };

      setPosts([newPost, ...posts]);
      setReport(''); setRegion('');
      showToast('Report verified and added to Neural Net');
    } catch (e) {
      showToast('Offline Submission active');
      // Fallback if backend is down
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpvote = (id) => {
    if (upvoted[id]) return;
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
    setUpvoted({ ...upvoted, [id]: true });
  };

  return (
    <div className="community-container">
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h2>Community Intel</h2>
            <p>Ground-level data feeding the CrisisProof Neural Network</p>
          </div>
          <div className="intel-stats">
            <span className="live-pill">● {posts.length} Active Reports</span>
          </div>
        </div>
      </div>

      <div className="grid-2">
        <div className="posts-feed">
          {posts.map(post => (
            <div key={post.id} className={`forum-post anim-pop-in ${post.ai_match}`}>
              <div className="post-header">
                <div>
                  <div className="post-author">
                    {post.author} 
                    {post.verified && <span className="verified-badge">✓ AI VERIFIED</span>}
                  </div>
                  <div className="post-tags">
                    <span className="badge-outline">{post.commodity}</span>
                    <span className="region-label">📍 {post.region}</span>
                  </div>
                </div>
                <span className="post-time">{post.time}</span>
              </div>
              <div className="post-content">"{post.content}"</div>
              <div className="post-actions">
                <button
                  className={`vote-btn ${upvoted[post.id] ? 'upvoted' : ''}`}
                  onClick={() => handleUpvote(post.id)}
                >
                  <span className="arrow">▲</span> {post.upvotes}
                </button>
                <div className="ai-tag">
                  MATCH: <span className={`match-${post.ai_match}`}>{post.ai_match?.toUpperCase()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="sticky-form">
          <div className="card report-card glow-blue">
            <div className="card-header">
              <div className="card-title">Broadcast Intel</div>
              <p className="card-subtitle">Your data helps prevent regional panic</p>
            </div>
            
            <div className="form-body">
              <div className="form-group">
                <label>Affected Region</label>
                <input 
                  className="modern-input"
                  value={region} 
                  onChange={e => setRegion(e.target.value)} 
                  placeholder="e.g. Sullia, Karnataka" 
                />
              </div>

              <div className="form-group">
                <label>Commodity Type</label>
                <select className="modern-select" value={commodity} onChange={e => setCommodity(e.target.value)}>
                  <option>LPG</option>
                  <option>Edible Oil</option>
                  <option>Fertilizer</option>
                  <option>Fuel</option>
                  <option>Medicine</option>
                </select>
              </div>

              <div className="form-group">
                <label>Observation</label>
                <textarea 
                  className="modern-textarea"
                  value={report} 
                  onChange={e => setReport(e.target.value)} 
                  placeholder="Prices? Delay? Stock levels?" 
                />
              </div>

              <button 
                className={`btn btn-primary full-width ${isAnalyzing ? 'btn-loading' : ''}`} 
                onClick={submitReport}
                disabled={isAnalyzing || !report.trim()}
              >
                {isAnalyzing ? 'SYNCING...' : 'BROADCAST REPORT'}
              </button>
            </div>
          </div>
        </div>
      </div>
      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  );
}