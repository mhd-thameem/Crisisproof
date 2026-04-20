import React, { useState } from 'react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const SAMPLE_POSTS = [
  { id: 1, author: 'Distributor_Mangalore', region: 'Karnataka', commodity: 'LPG', content: 'Stock levels at our depot are 40% below normal for the past 2 weeks. Deliveries from Udupi bottling plant delayed by 5 days consistently.', upvotes: 24, time: '2h ago', verified: true },
  { id: 2, author: 'Retailer_Pune', region: 'Maharashtra', commodity: 'Edible Oil', content: 'Sunflower oil prices jumped 18% this week at wholesale market. Suppliers citing international shortage. Passing cost to consumers from Monday.', upvotes: 18, time: '4h ago', verified: true },
  { id: 3, author: 'Cooperative_Chennai', region: 'Tamil Nadu', commodity: 'LPG', content: 'Our cooperative received only 60% of expected cylinders this month. Customers waiting 12-14 days instead of usual 3-4 days.', upvotes: 31, time: '6h ago', verified: false },
  { id: 4, author: 'Wholesaler_Ahmedabad', region: 'Gujarat', commodity: 'Fertilizer', content: 'Urea prices have gone up 25% in last month. Farmers in our district will be hit hard next planting season if this continues.', upvotes: 12, time: '1d ago', verified: false },
];

export default function Community() {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [report, setReport] = useState('');
  const [region, setRegion] = useState('');
  const [commodity, setCommodity] = useState('LPG');
  const [toast, setToast] = useState('');
  const [upvoted, setUpvoted] = useState({});

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const submitReport = async () => {
    if (!report.trim() || !region.trim()) return;
    const newPost = {
      id: Date.now(),
      author: 'Anonymous_Retailer',
      region, commodity,
      content: report,
      upvotes: 0,
      time: 'just now',
      verified: false,
    };
    setPosts([newPost, ...posts]);
    setReport(''); setRegion('');
    showToast('Report submitted — thank you for protecting your community');
  };

  const handleUpvote = (id) => {
    if (upvoted[id]) return;
    setPosts(posts.map(p => p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p));
    setUpvoted({ ...upvoted, [id]: true });
  };

  return (
    <div>
      <div className="page-header">
        <h2>Community Intel</h2>
        <p>Ground-level reports from retailers, distributors and cooperatives across India</p>
      </div>

      <div className="grid-2">
        <div>
          {posts.map(post => (
            <div key={post.id} className="forum-post">
              <div className="post-header">
                <div>
                  <div className="post-author">
                    {post.author} {post.verified && <span style={{color:'#3B82F6', fontSize:'11px'}}>✓ verified</span>}
                  </div>
                  <div style={{display:'flex', gap:'6px', marginTop:'4px'}}>
                    <span className="badge badge-blue">{post.commodity}</span>
                    <span className="meta-tag">{post.region}</span>
                  </div>
                </div>
                <span className="post-time">{post.time}</span>
              </div>
              <div className="post-content">{post.content}</div>
              <div className="post-actions">
                <button
                  className={`vote-btn ${upvoted[post.id] ? 'upvoted' : ''}`}
                  onClick={() => handleUpvote(post.id)}
                >
                  ▲ {post.upvotes}
                </button>
                <span className="meta-tag">Feeds into AI detection</span>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{height:'fit-content', position:'sticky', top:'0'}}>
          <div className="card-header">
            <div className="card-title">Submit Ground Report</div>
          </div>
          <div className="form-group">
            <label>Your Region</label>
            <input value={region} onChange={e => setRegion(e.target.value)} placeholder="e.g. Mangalore, Karnataka" />
          </div>
          <div className="form-group">
            <label>Commodity Affected</label>
            <select value={commodity} onChange={e => setCommodity(e.target.value)}>
              <option>LPG</option>
              <option>Edible Oil</option>
              <option>Fertilizer</option>
              <option>Fuel</option>
              <option>Medicine</option>
            </select>
          </div>
          <div className="form-group">
            <label>What are you seeing on the ground?</label>
            <textarea value={report} onChange={e => setReport(e.target.value)} placeholder="Describe supply levels, price changes, delivery delays..." />
          </div>
          <button className="btn btn-primary" style={{width:'100%'}} onClick={submitReport}>
            Submit Report
          </button>
          <p style={{fontSize:'11px', color:'#374151', marginTop:'12px', textAlign:'center'}}>
            Your report feeds directly into our AI prediction engine
          </p>
        </div>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
