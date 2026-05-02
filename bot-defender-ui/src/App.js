import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard'; 
import HowItWorks from './pages/HowItWorks';
import About from './pages/About';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <Routes>
          {/* Main Landing Page (Stacked & Scrollable) */}
          <Route path="/" element={
            <>
              <div id="home"><Home /></div>
              <div id="how-it-works"><HowItWorks /></div>
              <div id="about"><About /></div>
            </>
          } />
          
          {/* Separate Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;