import React from 'react';
import { Globe, Server, Cpu, Database, ArrowRight } from 'lucide-react';
import '../App.css';

const HowItWorks = () => {
  return (
    <div className="how-container">
      <div className="how-header">
        <h2>The Defense Pipeline</h2>
        <p>How our Machine Learning model analyzes and intercepts traffic in milliseconds.</p>
      </div>

      <div className="flowchart-container">
        {/* Step 1 */}
        <div className="flow-step">
          <div className="flow-icon"><Globe size={32} /></div>
          <h4>1. Incoming Traffic</h4>
          <p>Users and Bots attempt to access your API.</p>
        </div>

        <ArrowRight className="flow-arrow" size={32} />

        {/* Step 2 */}
        <div className="flow-step">
          <div className="flow-icon"><Server size={32} /></div>
          <h4>2. FastAPI Gateway</h4>
          <p>Intercepts headers, packet size, and connection rates.</p>
        </div>

        <ArrowRight className="flow-arrow" size={32} />

        {/* Step 3 */}
        <div className="flow-step ml-step">
          <div className="flow-icon"><Cpu size={32} color="#0f172a" /></div>
          <h4>3. ML Brain</h4>
          <p>Scikit-Learn model classifies traffic as Human or Bot.</p>
        </div>

        <ArrowRight className="flow-arrow" size={32} />

        {/* Step 4 */}
        <div className="flow-step">
          <div className="flow-icon"><Database size={32} /></div>
          <h4>4. Supabase Log</h4>
          <p>Traffic is allowed/blocked and permanently logged.</p>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;