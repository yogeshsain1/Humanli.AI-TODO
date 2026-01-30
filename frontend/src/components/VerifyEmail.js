import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Auth.css';

const VerifyEmail = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser, resendVerification, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if email is already verified
    if (currentUser?.emailVerified) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const handleResend = async () => {
    try {
      setLoading(true);
      setMessage('');
      await resendVerification();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      console.error('Resend error:', error);
      setMessage('Failed to resend verification email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        <p className="auth-subtitle">
          We've sent a verification email to <strong>{currentUser?.email}</strong>
        </p>
        
        <div className="info-message">
          Please check your inbox and click the verification link to activate your account.
        </div>

        {message && <div className="success-message">{message}</div>}

        <div className="button-group">
          <button 
            onClick={handleRefresh} 
            className="btn btn-primary"
          >
            I've Verified - Refresh
          </button>

          <button 
            onClick={handleResend} 
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>

          <button 
            onClick={handleLogout} 
            className="btn btn-text"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
