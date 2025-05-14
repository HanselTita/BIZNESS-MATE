// App.js or your root component
import React, { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'; // Import necessary routing components
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import Dashboard from './components/Dashboard'; // Your main application page

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const storedToken = localStorage.getItem('authToken');

    if (remembered && storedToken) {
      // You might want to verify the token with your backend here
      setIsAuthenticated(true);
      navigate('/dashboard'); // Redirect if remembered and authenticated
    }
  }, [navigate]);

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add the Dashboard route */}
        {isAuthenticated ? (
          <>
            <Route path="/investments" element={<div>Investments Content</div>} />
            <Route path="/production" element={<div>Production Content</div>} />
            <Route path="/expenditures" element={<div>Expenditures Content</div>} />
            <Route path="/sales" element={<div>Sales Content</div>} />
            <Route path="/delete-investments" element={<div>Delete Investments Content</div>} />
          </>
        ) : (
          <Route path="/dashboard" element={<Navigate to="/login" />} />
        )}
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
}

export default App;