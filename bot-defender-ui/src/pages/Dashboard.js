import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Shield, ShieldAlert, Activity, Database, Crosshair, Trash2, FileDown } from 'lucide-react';
import '../App.css';

const API_URL = "https://bot-defender-project-2.onrender.com/api/v1";

function App() {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ total: 0, blocked: 0, allowed: 0 });
  const [health, setHealth] = useState({ status: '...', cpu: 0 });

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
      await axios.delete(`${API_URL}/cleanup`);
      fetchLogs();
    }
  };

  return (
    <div className="dashboard-container">
      <header className="main-header">
        <div className="brand">
          <Shield size={36} color="#00ff88" strokeWidth={2.5} />
          <h1>Bot Defender <span className="v-tag">Pro v4.0</span></h1>
        </div>
        <div className="health-badge">
          <div className={`led ${health.status === 'SAFE' ? 'led-green' : 'led-red'}`}></div>
          <span>API: {health.status} | CPU: {health.cpu}%</span>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue"><Activity size={20} /></div>
          <div className="stat-content">
            <span className="label">Total Traffic</span>
            <span className="value">{stats.total}</span>
          </div>
        </div>
        <div className="stat-card danger">
          <div className="stat-icon red"><ShieldAlert size={20} /></div>
          <div className="stat-content">
            <span className="label">Threats Blocked</span>
            <span className="value">{stats.blocked}</span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon green"><Database size={20} /></div>
          <div className="stat-content">
            <span className="label">Clean Traffic</span>
            <span className="value">{stats.allowed}</span>
          </div>
        </div>
      </section>

      <section className="control-center">
        <div className="info">
          <h3><Crosshair size={18} /> Active Protection System</h3>
          <p>Real-time ML analysis and IP blacklisting enabled.</p>
        </div>
        <div className="button-group">
          <button className="btn btn-primary" onClick={() => simulate('HUMAN')}>+ Human Entry</button>
          <button className="btn btn-outline-danger" onClick={() => simulate('BOT')}>⚠️ Launch DDoS</button>
          <button className="btn btn-outline-success" onClick={downloadReport}><FileDown size={16} /> Export Report</button>
          <button className="btn btn-icon" onClick={clearDatabase}><Trash2 size={18} /></button>
        </div>
      </section>

      <main className="dashboard-layout">
        <div className="viz-container">
          <h3>Confidence Probability %</h3>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={logs.slice().reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d334a" vertical={false} />
                <XAxis dataKey="id" hide />
                <YAxis stroke="#64748b" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="confidence" stroke="#00ff88" strokeWidth={3} dot={{ r: 4, fill: '#00ff88' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="table-container">
          <h3>Network Activity Log</h3>
          <div className="scroll-area">
            <table className="activity-table">
              <thead>
                <tr>
                  <th>Timestamp (IST)</th>
                  <th>Source IP</th>
                  <th>Status</th>
                  <th>AI Conf.</th>
                  <th>Features</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className="time-col">{new Date(log.timestamp + 'Z').toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                    <td className="ip-col">{log.ip_address}</td>
                    <td><span className={`status-pill ${log.prediction === 'BLOCKED' ? 'red' : 'green'}`}>{log.prediction}</span></td>
                    <td className="font-mono">{log.confidence}%</td>
                    <td>
                      <div className="feature-tags">
                        {Object.entries(JSON.parse(log.feature_summary || "{}")).map(([k, v]) => (
                          <span key={k} className="tag">{k.split(' ').pop()}: {v}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;