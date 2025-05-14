import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('production');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    } else {
      setUsername('Guest');
    }
  }, []);

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('rememberMe');
    localStorage.removeItem('rememberedUser');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header-sidebar"> {/* Will act as the left sidebar */}
        <div className="user-info">
          <h2>Welcome, {username}!</h2>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
        <div className="navigation">

          <ul>
            <li><Link to="/investments">Investment</Link></li>
            <li><Link to="/production-costs">Production</Link></li>
            <li><Link to="/expenditures">Expenditure</Link></li>
            <li><Link to="/sales">Sales</Link></li>
            <li><Link to="/delete-investments">Delete Investment</Link></li>
          </ul>
        </div>
      </div>
      <div className="dashboard-content"> {/* Right column for tabs and content */}
      <div className="ad-placeholder"> {/* Placeholder div for the ad */}
          {/* You might include your Google AdSense code here */}
        </div>
        <div className="table-header-row">
          <button
            className={activeTab === 'production' ? 'active' : ''}
            onClick={() => handleTabClick('production')}
          >
            Cost of Production
          </button>
          <button
            className={activeTab === 'expenditure' ? 'active' : ''}
            onClick={() => handleTabClick('expenditure')}
          >
            Total Expenditure
          </button>
          <button
            className={activeTab === 'sales' ? 'active' : ''}
            onClick={() => handleTabClick('sales')}
          >
            Total Sales
          </button>
          <button
            className={activeTab === 'rundown' ? 'active' : ''}
            onClick={() => handleTabClick('rundown')}
          >
            Rundown
          </button>
        </div>
        <div className="table-data-row">
          {activeTab === 'production' && <div>Data for Cost of Production</div>}
          {activeTab === 'expenditure' && <div>Data for Total Expenditure</div>}
          {activeTab === 'sales' && <div>Data for Total Sales</div>}
          {activeTab === 'rundown' && <div>Data for Rundown</div>}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;