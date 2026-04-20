import React, { useState } from 'react';

const SUPPLIERS = [
  { name: 'Indian Oil Corporation', commodity: 'LPG', region: 'Pan India', reliability: 94, price: 'Market rate' },
  { name: 'Bharat Petroleum', commodity: 'LPG', region: 'South India', reliability: 91, price: 'Market rate' },
  { name: 'Hindustan Petroleum', commodity: 'LPG', region: 'West India', reliability: 89, price: 'Market rate' },
  { name: 'Adani Gas', commodity: 'LPG', region: 'Gujarat', reliability: 87, price: '-3% below market' },
];

export default function PreOrder() {
  const [quantity, setQuantity] = useState(100);
  const [region, setRegion] = useState('Karnataka');
  const [ordered, setOrdered] = useState({});
  const [toast, setToast] = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const placeOrder = (supplier) => {
    setOrdered({ ...ordered, [supplier.name]: true });
    showToast(`Pre-order request sent to ${supplier.name}`);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Pre-Order Hub</h2>
        <p>Lock in commodity orders before shortage hits your region</p>
      </div>

      <div className="card" style={{marginBottom:'24px', background:'#0F1D1F', border:'1px solid #10B98130'}}>
        <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
          <div style={{fontSize:'32px'}}>⚠️</div>
          <div>
            <div style={{color:'#F59E0B', fontWeight:'600', marginBottom:'4px'}}>Active Shortage Alert — LPG</div>
            <div style={{color:'#64748B', fontSize:'13px'}}>Hormuz tension detected. Predicted impact in 3-4 weeks. Pre-order now to secure supply at current prices.</div>
          </div>
          <div style={{marginLeft:'auto', textAlign:'right'}}>
            <div style={{color:'#EF4444', fontSize:'24px', fontWeight:'700'}}>85%</div>
            <div style={{color:'#64748B', fontSize:'11px'}}>Confidence</div>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{marginBottom:'24px'}}>
        <div className="card">
          <div className="card-title" style={{marginBottom:'16px'}}>Configure Pre-Order</div>
          <div className="form-group">
            <label>Your Region</label>
            <select value={region} onChange={e => setRegion(e.target.value)}>
              <option>Karnataka</option>
              <option>Maharashtra</option>
              <option>Gujarat</option>
              <option>Tamil Nadu</option>
              <option>Rajasthan</option>
              <option>Punjab</option>
            </select>
          </div>
          <div className="form-group">
            <label>Quantity (cylinders)</label>
            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="10" max="10000" />
          </div>
          <div style={{background:'#0F1D30', borderRadius:'10px', padding:'14px', marginTop:'8px'}}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
              <span style={{color:'#64748B', fontSize:'13px'}}>Estimated savings vs shortage price</span>
              <span style={{color:'#10B981', fontWeight:'600'}}>~₹{(quantity * 47).toLocaleString()}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between'}}>
              <span style={{color:'#64748B', fontSize:'13px'}}>Protection window</span>
              <span style={{color:'#3B82F6', fontWeight:'600'}}>45 days</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title" style={{marginBottom:'16px'}}>Why Pre-Order Now?</div>
          {[
            { icon: '🔒', title: 'Lock current prices', desc: 'Shortage typically causes 30-40% price spike' },
            { icon: '⏰', title: '5-6 week advantage', desc: 'Act before street-level shortage hits' },
            { icon: '🤝', title: 'Verified suppliers only', desc: 'All suppliers are PSU authorized distributors' },
            { icon: '❌', title: 'Cancel anytime', desc: 'Pre-order is not binding until confirmed' },
          ].map(item => (
            <div key={item.title} style={{display:'flex', gap:'12px', marginBottom:'14px', alignItems:'flex-start'}}>
              <span style={{fontSize:'20px'}}>{item.icon}</span>
              <div>
                <div style={{fontSize:'13px', fontWeight:'600', color:'#F1F5F9', marginBottom:'2px'}}>{item.title}</div>
                <div style={{fontSize:'12px', color:'#64748B'}}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Available Suppliers</div>
          <span className="badge badge-blue">AI Matched for {region}</span>
        </div>
        {SUPPLIERS.map(supplier => (
          <div key={supplier.name} style={{background:'#0F1D30', borderRadius:'12px', padding:'16px', marginBottom:'12px', display:'flex', alignItems:'center', gap:'16px'}}>
            <div style={{flex:1}}>
              <div style={{fontWeight:'600', color:'#F1F5F9', marginBottom:'4px'}}>{supplier.name}</div>
              <div style={{display:'flex', gap:'8px', flexWrap:'wrap'}}>
                <span className="meta-tag">{supplier.region}</span>
                <span className="meta-tag">{supplier.price}</span>
                <span style={{fontSize:'11px', color:'#10B981'}}>⭐ {supplier.reliability}% reliability</span>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:'12px', color:'#64748B', marginBottom:'8px'}}>{quantity} cylinders</div>
              {ordered[supplier.name] ? (
                <span className="badge badge-low">✓ Requested</span>
              ) : (
                <button className="btn btn-primary" style={{padding:'8px 16px', fontSize:'13px'}} onClick={() => placeOrder(supplier)}>
                  Pre-Order
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}
