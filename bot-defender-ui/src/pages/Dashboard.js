import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldAlert, Activity, Database, Crosshair, Trash2, FileDown, Server, ChevronDown, ChevronRight } from 'lucide-react';
import '../App.css';

const API_URL = "https://bot-defender-project-2.onrender.com/api/v1";

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, allowed: 0 });
  const [health, setHealth] = useState({ status: '...', cpu: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  // State to track which mobile rows are expanded
  const [expandedRows, setExpandedRows] = useState(new Set());

  const fetchLogs = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/logs`);
      setLogs(res.data);
      const blockedCount = res.data.filter(l => l.prediction === 'BLOCKED').length;
      setStats({
        total: res.data.length,
        blocked: blockedCount,
        allowed: res.data.length - blockedCount
      });
    } catch (e) {
      console.error("API Fetch Error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/health`);
      setHealth(res.data);
    } catch {
      setHealth({ status: 'OFFLINE', cpu: 0 });
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    fetchHealth();
    const interval = setInterval(() => {
      fetchLogs();
      fetchHealth();
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchLogs, fetchHealth]);

  const simulate = async (type) => {
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.1.1`;
    const rand = (min, max) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

    let features = type === 'BOT' ? 
      { "Average Packet Size": rand(2800, 4500), "Bwd Packet Length Mean": rand(3000, 5000), "Packet Length Variance": rand(3500000, 5500000) } : 
      { "Average Packet Size": rand(40, 120), "Bwd Packet Length Mean": rand(20, 80), "Packet Length Variance": rand(100, 500) };

    try {
      await axios.post(`${API_URL}/analyze-traffic`, { ip_address: ip, features });
      fetchLogs();
    } catch (e) {
      alert("Traffic Blocked: This IP is currently blacklisted by the system bouncer.");
    }
  };

  const downloadReport = () => {
    window.open(`${API_URL}/export-report`, '_blank');
  };

  const clearDatabase = async () => {
    if (window.confirm("Clear all logs and reset the firewall?")) {
      setIsLoading(true);
      await axios.delete(`${API_URL}/cleanup`);
      await fetchLogs();
    }
  };

  // Toggle row expansion for mobile
  const toggleRow = (id) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <div className="health-badge" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#0f172a', padding: '10px 20px', borderRadius: '30px', border: '1px solid #334155' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: health.status === 'SAFE' ? '#00ff88' : '#ef4444', boxShadow: `0 0 10px ${health.status === 'SAFE' ? '#00ff88' : '#ef4444'}` }}></div>
          <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>API: <strong style={{ color: '#fff' }}>{health.status}</strong> | CPU: <strong style={{ color: '#fff' }}>{health.cpu}%</strong></span>
        </div>
      </header>

      {/* LOADING STATE */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#00ff88' }}>
          <Server size={40} className="spin-animation" style={{ marginBottom: '20px' }}/>
          <h2>Establishing Secure Connection...</h2>
        </div>
      ) : logs.length === 0 ? (
        
        /* EMPTY STATE */
        <div className="dashboard-panel" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '800px', margin: '40px auto' }}>
          <ShieldAlert size={64} color="#00ff88" style={{ marginBottom: '20px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Firewall is Active. Awaiting Traffic.</h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
            Your Bot Defender endpoint is successfully connected to the database, but no network traffic has been logged yet. Run a simulation below to test the Machine Learning algorithms.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => simulate('HUMAN')} style={{ padding: '12px 24px', fontSize: '1rem' }}>+ Simulate Human Traffic</button>
            <button className="btn-outline-danger" onClick={() => simulate('BOT')} style={{ background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', padding: '12px 24px', borderRadius: '8px', cursor: 'pointer' }}>⚠️ Launch Test Bot Attack</button>
          </div>
        </div>

      ) : (

        /* ACTIVE DASHBOARD STATE */
        <>
          {/* METRICS */}
          <section className="metric-grid">
            <div className="metric-card" style={{ borderLeft: '4px solid #3b82f6' }}>
              <div style={{ color: '#3b82f6', marginBottom: '10px' }}><Activity size={24} /></div>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Total Traffic</span>
              <h2 style={{ margin: '10px 0 0 0', fontSize: '2rem' }}>{stats.total}</h2>
            </div>
            <div className="metric-card" style={{ borderLeft: '4px solid #ef4444' }}>
              <div style={{ color: '#ef4444', marginBottom: '10px' }}><ShieldAlert size={24} /></div>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Threats Blocked</span>
              <h2 style={{ margin: '10px 0 0 0', fontSize: '2rem', color: '#ef4444' }}>{stats.blocked}</h2>
            </div>
            <div className="metric-card" style={{ borderLeft: '4px solid #00ff88' }}>
              <div style={{ color: '#00ff88', marginBottom: '10px' }}><Database size={24} /></div>
              <span style={{ color: '#94a3b8', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Clean Traffic</span>
              <h2 style={{ margin: '10px 0 0 0', fontSize: '2rem' }}>{stats.allowed}</h2>
            </div>
          </section>

          {/* CONTROL CENTER */}
          <section className="dashboard-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '20px' }}>
            <div className="info">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 5px 0' }}><Crosshair size={18} color="#00ff88" /> Active Protection System</h3>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>Real-time ML analysis and IP blacklisting enabled.</p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => simulate('HUMAN')}>+ Human</button>
              <button style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }} onClick={() => simulate('BOT')}>⚠️ Bot</button>
              <button style={{ display: 'flex', alignItems: 'center', gap: '5px', background: '#0f172a', color: '#00ff88', border: '1px solid #00ff88', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }} onClick={downloadReport}><FileDown size={16} /> Export</button>
              <button style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }} onClick={clearDatabase}><Trash2 size={16} /></button>
            </div>
          </section>

         {/* CHARTS AND TABLES (Side-by-Side on Desktop) */}
          <main className="content-grid">
            
            {/* 1. CHART CONTAINER (Left Side - 40%) */}
            <div className="dashboard-panel">
              <h3 style={{ marginBottom: '20px' }}>Confidence Probability %</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={logs.slice().reverse()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2d334a" vertical={false} />
                    <XAxis dataKey="id" hide />
                    <YAxis stroke="#64748b" domain={[0, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }} />
                    <Line type="monotone" dataKey="confidence" stroke="#00ff88" strokeWidth={3} dot={{ r: 4, fill: '#00ff88' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* 2. TABLE CONTAINER (Right Side - 60% with Scrollbar) */}
            <div className="dashboard-panel">
              <h3 style={{ marginBottom: '20px' }}>Network Activity Log</h3>
              
              {/* 🛑 ADDED: maxHeight and overflowY for the vertical scrollbar! */}
              <div className="table-responsive" style={{ maxHeight: '340px', overflowY: 'auto', paddingRight: '5px' }}>
                <table className="dashboard-table" style={{ width: '100%', textAlign: 'left', minWidth: '400px' }}>
                  <thead style={{ position: 'sticky', top: 0, background: '#1e293b', zIndex: 1 }}>
                    <tr style={{ borderBottom: '1px solid #334155', color: '#94a3b8' }}>
                      <th className="mobile-expand-btn" style={{ padding: '12px 8px', width: '30px' }}></th>
                      <th style={{ padding: '12px 8px' }}>Timestamp</th>
                      <th style={{ padding: '12px 8px' }}>Source IP</th>
                      <th style={{ padding: '12px 8px' }}>Status</th>
                      <th style={{ padding: '12px 8px' }}>Conf.</th>
                      <th className="hide-on-mobile" style={{ padding: '12px 8px' }}>Features</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => {
                      const isExpanded = expandedRows.has(log.id);
                      let featuresObj = {};
                      try {
                        featuresObj = JSON.parse(log.feature_summary || "{}");
                      } catch (e) {}

                      return (
                        <React.Fragment key={log.id}>
                          <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid #1e293b' }}>
                            {/* Mobile Expand Button */}
                            <td className="mobile-expand-btn" style={{ padding: '12px 8px', cursor: 'pointer' }} onClick={() => toggleRow(log.id)}>
                              {isExpanded ? <ChevronDown size={18} color="#94a3b8"/> : <ChevronRight size={18} color="#94a3b8"/>}
                            </td>
                            
                            <td style={{ padding: '12px 8px', fontSize: '0.85rem', color: '#94a3b8' }}>
                              {new Date(log.timestamp + 'Z').toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </td>
                            <td style={{ padding: '12px 8px', fontFamily: 'monospace' }}>{log.ip_address}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{ background: log.prediction === 'BLOCKED' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(0, 255, 136, 0.1)', color: log.prediction === 'BLOCKED' ? '#ef4444' : '#00ff88', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                {log.prediction}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', color: '#00ff88' }}>{log.confidence}%</td>
                            
                            {/* Desktop Features Column */}
                            <td className="hide-on-mobile" style={{ padding: '12px 8px' }}>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                                {Object.entries(featuresObj).map(([k, v]) => (
                                  <span key={k} className="feature-tag">{k.split(' ').pop()}: {v}</span>
                                ))}
                              </div>
                            </td>
                          </tr>

                          {/* Expanded Mobile Row */}
                          {isExpanded && (
                            <tr className="expanded-features-row mobile-expand-btn">
                              <td colSpan="6" style={{ padding: '12px 16px 16px 16px' }}>
                                <div style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '8px' }}>Packet Features:</div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {Object.entries(featuresObj).map(([k, v]) => (
                                    <span key={k} className="feature-tag">{k}: {v}</span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </main>
        </>
      )}
    </div>
  );
}

export default Dashboard;