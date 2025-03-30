import React, { useEffect } from 'react';
import API from '../api';

const GoogleLoginButton = ({ onLogin }) => {
  useEffect(() => {
    
    /* global google */
    if (!window.google) return;

    google.accounts.id.initialize({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("googleSignInDiv"),
      { theme: "outline", size: "large" }
    );
  });

  const handleCredentialResponse = async (response) => {
    try {
      const res = await API.post('/auth/google', {
        credential: response.credential
      });

      localStorage.setItem('token', res.data.token);
      onLogin(res.data.token);
    } catch (err) {
      console.error('Google login failed', err);
    }
  };

  return <div id="googleSignInDiv" style={{ marginTop: '1rem' }}></div>;
};

export default GoogleLoginButton;