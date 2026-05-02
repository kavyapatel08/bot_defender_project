import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Zap, Activity } from 'lucide-react';
import '../App.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <header className="hero-section">
        <h1>Machine Learning API <br/><span className="text-highlight">Security & Defense</span></h1>
        <p className="hero-subtext">
          Bot Defender's comprehensive AI testing helps you discover and eliminate malicious traffic before it impacts your servers. Rapid scanning and automatic IP blacklisting give you the tools to secure your APIs without slowing down productivity.
        </p>
        <Link to="/login" className="btn-primary hero-btn">Request a Demo</Link>
      </header>

      {/* 3-Column Features Section */}
      <section className="features-section">
        <h2 className="section-title">Fix API Vulnerabilities Before They Become a Risk</h2>
        
        <div className="features-grid">
          <div className="feature-card-home">
            <ShieldAlert size={40} color="#00ff88" />
            <h3>Real-Time ML Analysis</h3>
            <p>Comprehensive API protection using Random Forest algorithms to analyze packet size, byte variance, and traffic patterns with near-zero false positives.</p>
          </div>
          
          <div className="feature-card-home">
            <Zap size={40} color="#00ff88" />
            <h3>Security Without Friction</h3>
            <p>Run rapid scans and block DDoS attackers automatically without disrupting your release cadences or slowing down legitimate user traffic.</p>
          </div>
          
          <div className="feature-card-home">
            <Activity size={40} color="#00ff88" />
            <h3>Visibility & Logging</h3>
            <p>Generates detailed vulnerability reports stored securely in PostgreSQL. Gain immediate visibility into allowed and blocked traffic on your dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;