import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { Link, useNavigate } from 'react-router-dom';
import AddInvestmentForm from './AddInvestmentForm';
import AddProductionForm from './AddProductionForm';
import AddExpenditureForm from './AddExpenditureForm';
import AddSaleForm from './AddSaleForm';
import DeleteInvestmentForm from './DeleteInvestmentForm'; // Import the new form

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

  const handleInvestmentClick = () => {
    setActiveTab('add-investment');
  };

  const handleProductionClick = () => {
    setActiveTab('add-production');
  };

  const handleExpenditureClick = () => {
    setActiveTab('add-expenditure');
  };

  const handleSalesClick = () => {
    setActiveTab('add-sale');
  };

  const handleDeleteInvestmentClick = () => {
    setActiveTab('delete-investment');
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
      <div className="dashboard-header-sidebar">
        <div className="user-info">
          <h2>Welcome, {username}!</h2>
          <button className="logout-button" onClick={handleLogout}>
            Log Out
          </button>
        </div>
        <div className="navigation">
          <ul>
            
            <li className={activeTab === 'add-investment' ? 'active-sidebar-item' : ''}>
              <Link to="#" onClick={handleInvestmentClick}>Investment</Link>
            </li>
            <li className={activeTab === 'add-production' ? 'active-sidebar-item' : ''}>
              <Link to="#" onClick={handleProductionClick}>Production</Link>
            </li>
          
            <li className={activeTab === 'add-expenditure' ? 'active-sidebar-item' : ''}>
              <Link to="#" onClick={handleExpenditureClick}>Expenditure</Link>
            </li>
            <li className={activeTab === 'add-sale' ? 'active-sidebar-item' : ''}>
              <Link to="#" onClick={handleSalesClick}>Sales</Link>
            </li>
            <li className={activeTab === 'delete-investment' ? 'active-sidebar-item' : ''}>
              <Link to="#" onClick={handleDeleteInvestmentClick}>Delete Investment</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="dashboard-content">
        <div className="ad-placeholder">
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
          {activeTab === 'add-investment' && <AddInvestmentForm />}
          {activeTab === 'add-production' && <AddProductionForm />}
          {activeTab === 'add-expenditure' && <AddExpenditureForm />}
          {activeTab === 'add-sale' && <AddSaleForm />}
          {activeTab === 'delete-investment' && <DeleteInvestmentForm />}
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