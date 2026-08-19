import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('Overview');

  const stats = [
    { label: 'Active Users', value: '1,245', change: '+12%' },
    { label: 'AI Queries', value: '8,432', change: '+24%' },
    { label: 'Server Status', value: 'Online', change: '99.9%' },
  ];

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <div className="logo">
          <h2>Genie Admin</h2>
        </div>
        <nav className="nav-menu">
          {['Overview', 'Analytics', 'Settings', 'Logs'].map(tab => (
            <button 
              key={tab}
              className={`nav-item ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </aside>
      
      <main className="main-content">
        <header className="top-header">
          <h1>{activeTab} Dashboard</h1>
          <div className="user-profile">Admin Profile</div>
        </header>
        
        <section className="stats-grid">
          {stats.map((stat, i) => (
            <div key={i} className="stat-card">
              <h3>{stat.label}</h3>
              <p className="stat-value">{stat.value}</p>
              <span className="stat-change">{stat.change}</span>
            </div>
          ))}
        </section>

        <section className="content-area">
          <div className="card full-width">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <span className="time">10:45 AM</span>
                <span className="event">User completed First Aid flow.</span>
              </div>
              <div className="activity-item">
                <span className="time">10:30 AM</span>
                <span className="event">System health check passed. AI providers online.</span>
              </div>
              <div className="activity-item">
                <span className="time">09:15 AM</span>
                <span className="event">New user registration.</span>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
