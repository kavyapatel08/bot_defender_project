import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Shield, AlertCircle, CheckCircle2, User, Building, Phone } from 'lucide-react';
import '../App.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

const validateForm = () => {
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!email || !email.includes('@') || !email.includes('.')) {
      setErrorMsg('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return false;
    }
    
    // 🛑 NEW: Strict Sign-Up Validation
    if (!isLogin) {
      if (!firstName || !lastName || !organization || !phoneNumber) {
        setErrorMsg('Please fill out all profile fields.');
        return false;
      }
      
      // Regex to ensure exactly 10 digits
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(phoneNumber)) {
        setErrorMsg('Phone number must be exactly 10 digits (no spaces or dashes).');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; 

    setLoading(true);

    if (isLogin) {
      // --- LOGIN LOGIC ---
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMsg(error.message);
      } else {
        navigate('/dashboard');
      }
    } else {
      // --- SIGN UP LOGIC ---
      // 1. Create the Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      
      if (authError) {
        setErrorMsg(authError.message);
      } else if (authData.user) {
        // 2. Insert the extra details into our new admin_profiles table
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .insert([
            { 
              id: authData.user.id, // Links this profile directly to the secure Auth user
              first_name: firstName, 
              last_name: lastName, 
              organization: organization,
              phone_number: phoneNumber 
            }
          ]);

        if (profileError) {
          setErrorMsg("Account created, but failed to save profile details.");
        } else {
          setSuccessMsg('Admin Account created successfully! You can now log in.');
          setIsLogin(true);
          setPassword('');
        }
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <Shield size={40} color="#00ff88" strokeWidth={2} />
          <h2>{isLogin ? 'Welcome Back' : 'Create Admin Account'}</h2>
          <p>{isLogin ? 'Enter your credentials to access the firewall.' : 'Register to deploy Bot Defender for your organization.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          
          {/* 🛑 CONDITIONAL RENDER: Only show these if signing up */}
          {!isLogin && (
            <>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="input-group" style={{ flex: 1 }}>
                  <User className="input-icon" size={18} />
                  <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="input-group" style={{ flex: 1 }}>
                  <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} style={{ paddingLeft: '15px' }}/>
                </div>
              </div>

              <div className="input-group">
                <Building className="input-icon" size={18} />
                <input type="text" placeholder="Organization" value={organization} onChange={(e) => setOrganization(e.target.value)} />
              </div>
              <div className="input-group">
                <Phone className="input-icon" size={18} />
                <input 
                  type="tel" 
                  placeholder="Phone Number (10 digits)" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  maxLength="10"
                />
              </div>
            </>
          )}

          {/* Email Input */}
          <div className="input-group">
            <Mail className="input-icon" size={18} />
            <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          {/* Password Input */}
          <div className="input-group">
            <Lock className="input-icon" size={18} />
            <input type="password" placeholder="Password (min. 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {errorMsg && <div className="auth-alert error"><AlertCircle size={16} /> <span>{errorMsg}</span></div>}
          {successMsg && <div className="auth-alert success"><CheckCircle2 size={16} /> <span>{successMsg}</span></div>}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : (isLogin ? 'Secure Login' : 'Create Account')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span className="toggle-link" onClick={() => { setIsLogin(!isLogin); setErrorMsg(''); setSuccessMsg(''); }}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;