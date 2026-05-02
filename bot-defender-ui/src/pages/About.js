import React from 'react';
import { Mail } from 'lucide-react'; // We keep Mail from Lucide
import { FaLinkedin, FaGithub } from 'react-icons/fa'; // We get brand logos from react-icons
import '../App.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h2>About the Developer</h2>
        <p>The Architect behind the Bot Defender ML Firewall.</p>
      </div>

      <div className="about-card">
        <div className="about-content">
          <h3>Hello, I'm the Creator of Bot Defender</h3>
          <p>
            I built this platform to bridge the gap between Machine Learning and Web Security. 
            My goal was to create a system that doesn't just block IPs, but intelligently understands 
            traffic patterns to prevent zero-day bot attacks with near-zero false positives.
          </p>
          
          <div className="contact-links">
            <a href="mailto:kavyapatel.2010.work@gmail.com" className="contact-btn">
              <Mail size="{20}"/> Email
            </a>
            <a href="https://www.linkedin.com/in/kavya-200o/" target="_blank" rel="noreferrer" className="contact-btn">
              <FaLinkedin size="{20}"/> LinkedIn
            </a>
            <a href="https://github.com/kavyapatel08" target="_blank" rel="noreferrer" className="contact-btn">
              <FaGithub size="{20}"/> GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;