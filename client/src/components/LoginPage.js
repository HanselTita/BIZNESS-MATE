import React, { useState } from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // State for the checkbox
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRememberMeChange = (event) => {
    setRememberMe(event.target.checked);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
        const response = await fetch('http://localhost:5000/api/login', { // Use the correct port
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });
      const data = await response.json();

      // Inside your LoginPage.js handleSubmit function (on successful login)
if (response.ok && data.token && data.user) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('username', data.user.username); // Store username on login as well
   
        if (rememberMe) {
          // Store user identifier or token in local storage for persistent login
          localStorage.setItem('rememberMe', true);
          localStorage.setItem('rememberedUser', username); // Or a more robust identifier
          // You might store an encrypted version or a specific remember-me token
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('rememberedUser');
        }

        navigate('/dashboard'); // Redirect to dashboard or your main page
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Failed to connect to the server');
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group remember-me">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={handleRememberMeChange} // Attach the event handler
          />
          <label htmlFor="rememberMe">Remember me</label>
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <button type="button" className="forgot-password-button">
          Forgot Password
        </button>
      </form>
      <p className="signup-link">
        Don't have an account? <Link to="/signup">Sign up</Link>
      </p>
    </div>
  );
}

export default LoginPage;