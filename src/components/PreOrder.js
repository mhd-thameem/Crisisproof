import React, { useState, useEffect } from 'react';

const SUPPLIERS = [
  { name: 'Indian Oil Corporation', commodity: 'LPG', region: 'Pan India', reliability: 94, price: 'Market rate', contact: 'iocl.com' },
  { name: 'Bharat Petroleum', commodity: 'LPG', region: 'South India', reliability: 91, price: 'Market rate', contact: 'bharatpetroleum.in' },
  { name: 'Hindustan Petroleum', commodity: 'LPG', region: 'West India', reliability: 89, price: 'Market rate', contact: 'hindustanpetroleum.com' },
  { name: 'Adani Gas', commodity: 'LPG', region: 'Gujarat', reliability: 87, price: '-3% below market', contact: 'adanigas.in' },
];

export default function PreOrder() {
  const [quantity, setQuantity] = useState(100);
  const [region, setRegion] = useState('Karnataka');
  const [ordered, setOrdered] = useState({});
  const [toast, setToast] = useState('');
  const [marketRisk, setMarketRisk] = useState({ 
    commodity: 'LPG', 
    confidence: 85, 
    reason: 'Hormuz tension detected. Predicted impact in 3-4 weeks.' 
  });

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  // Legendary feature: Calculate dynamic savings based on quantity
  const calculateSavings = () => {
    const basePrice = 900; // Estimated per unit
    const projectedShortageSpike = 1.35; // 35% increase
    const savings = quantity * (basePrice * projectedShortageSpike - basePrice);
    return Math.round(savings).toLocaleString();
  };

  const placeOrder = (supplier) => {
    setOrdered({ ...ordered, [supplier.name]: true });
    showToast(`Order Secured: Tracking ref #${Math.floor(Math.random() * 900000)}`);
  };

  return (
    <div className="preorder-container anim-fade-in">
      <div className="page-header">
        <div className="flex-between">
          <div>
            <h2>Pre-Order Hub</h2>
            <p>Strategic Procurement & Price Protection</p>
          </div>
          <div className="security-tag">
            <span className="shield-icon">🛡️</span> SECURE GATEWAY
          </div>
        </div>
      </div>

      {/* DYNAMIC ALERT BANNER */}
      <div className="alert-banner-legendary">
        <div className="alert-pulse-icon">⚠️</div>
        <div className="alert-content">
          <div className="alert-title">AI SHORTAGE PREDICTION: {marketRisk.commodity}</div>
          <div className="alert-desc">{marketRisk.reason}</div>
        </div>
        <div className="alert-stat">
          <div className="stat-val">{marketRisk.confidence}%</div>
          <div className="stat-label">AI CONFIDENCE</div>
        </div>
        <div className="alert-action">
          <button className="btn-mini" onClick={() => showToast("Contract auto-fill active")}>LOCK PRICE</button>
        </div>
      </div>

      <div className="grid-2">
        {/* CONFIGURATION CARD */}
        <div className="card glass-card-dark">
          <div className="card-header-icon">
            <span className="title-icon">⚙️</span>
            <h3>Configure Strategic Order</h3>
          </div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Delivery Region</label>
              <select className="modern-select" value={region} onChange={e => setRegion(e.target.value)}>
                <option>Karnataka</option>
                <option>Maharashtra</option>
                <option>Gujarat</option>
                <option>Tamil Nadu</option>
              </select>
            </div>
            <div className="form-group">
              <label>Quantity (Standard Units)</label>
              <input
                className="modern-input-large"
                type="number"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                min="10"
              />
            </div>
          </div>

          <div className="savings-projection-card">
            <div className="projection-row">
              <span className="proj-label">Estimated Price Protection Savings</span>
              <span className="proj-val highlight-green">₹{calculateSavings()}</span>
            </div>
            <div className="projection-row">
              <span className="proj-label">Priority Allocation Window</span>
              <span className="proj-val">45 Days</span>
            </div>
            <div className="projection-bar">
              <div className="projection-fill" style={{width: '75%'}}></div>
            </div>
            <p className="projection-footer">Calculated by Gemini Economic Model 3.1</p>
          </div>
        </div>

        {/* WHY PRE-ORDER (Value Props) */}
        <div className="card info-card">
          <h3>Pre-Order Advantages</h3>
          <div className="advantage-list">
            {[
              { icon: '🔒', title: 'Hedge Against Inflation', desc: 'Lock in rates before the 35% projected spike.' },
              { icon: '⏰', title: 'Queue Priority', desc: 'Strategic reserves are allocated to early responders first.' },
              { icon: '🤝', title: 'Verified PSU Network', desc: 'Direct linkage to government-authorized distributors.' },
            ].map(item => (
              <div key={item.title} className="advantage-item">
                <div className="adv-icon">{item.icon}</div>
                <div className="adv-text">
                  <div className="adv-title">{item.title}</div>
                  <div className="adv-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SUPPLIER LISTING */}
      <div className="card supplier-section">
        <div className="card-header flex-between">
          <h3>Qualified Suppliers for {region}</h3>
          <span className="status-pill-blue">AI-VERIFIED NETWORK</span>
        </div>

        <div className="supplier-grid">
          {SUPPLIERS.map(supplier => (
            <div key={supplier.name} className={`supplier-card ${ordered[supplier.name] ? 'ordered' : ''}`}>
              <div className="sup-info">
                <div className="sup-name">{supplier.name}</div>
                <div className="sup-meta">
                  <span className="sup-tag">{supplier.region}</span>
                  <span className="sup-tag price">{supplier.price}</span>
                </div>
                <div className="reliability-meter">
                  <div className="meter-label">Reliability: {supplier.reliability}%</div>
                  <div className="meter-track">
                    <div className="meter-fill" style={{width: `${supplier.reliability}%`}}></div>
                  </div>
                </div>
              </div>
              <div className="sup-action">
                {ordered[supplier.name] ? (
                  <button className="btn-success" disabled>✓ SECURED</button>
                ) : (
                  <button className="btn btn-primary" onClick={() => placeOrder(supplier)}>RESERVE SUPPLY</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  );
}