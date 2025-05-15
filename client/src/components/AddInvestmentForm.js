import React, { useState } from 'react';
import './AddInvestmentForm.css'; // Create CSS for this form

function AddInvestmentForm() {
  const [name, setName] = useState('');
  const [capital, setCapital] = useState('');
  const [currency, setCurrency] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/investments', { // Your backend API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include auth token
        },
        body: JSON.stringify({ description: name, capital: parseFloat(capital), currency }), // Adjust payload as needed
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Investment saved successfully!');
        setName('');
        setCapital('');
        setCurrency('');
      } else {
        setMessage(data.message || 'Failed to save investment.');
      }
    } catch (error) {
      console.error('Error saving investment:', error);
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <div className="add-investment-form">
      <h2>Add New Investment</h2>
      {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Investment Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., New Warehouse"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="capital">Capital Invested:</label>
          <input
            type="number"
            id="capital"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
            placeholder="e.g., 100000"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="currency">Currency:</label>
          <input
            type="text"
            id="currency"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="e.g., USD, EUR, THB"
            required
          />
        </div>
        <button type="submit" className="save-button">
          Save Investment
        </button>
      </form>
    </div>
  );
}

export default AddInvestmentForm;