import React, { useState } from 'react';
import './index.css';
import Dashboard from './components/Dashboard';
import Community from './components/Community';
import Whistleblower from './components/Whistleblower';
import PreOrder from './components/PreOrder';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📡' },
    { id: 'community', label: 'Community Intel', icon: '🌐' },
    { id: 'whistleblower', label: 'Whistleblower', icon: '🔒' },
    { id: 'preorder', label: 'Pre-Order Hub', icon: '📦' },
  ];

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'community': return <Community />;
      case 'whistleblower': return <Whistleblower />;
      case 'preorder': return <PreOrder />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>CrisisProof</h1>
          <p>Supply Chain Intelligence</p>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`nav-item ${activePage === item.id ? 'active' : ''}`}
              onClick={() => setActivePage(item.id)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <p>AscendX © 2026</p>
          <p>GDG Solution Challenge</p>
        </div>
      </aside>
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}
