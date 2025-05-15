import React, { useState, useEffect } from 'react';
import './DeleteInvestmentForm.css'; // Create CSS for this form

function DeleteInvestmentForm() {
  const [selectedInvestment, setSelectedInvestment] = useState('');
  const [investments, setInvestments] = useState([]); // To store the list of investments
  const [message, setMessage] = useState('');

  const fetchInvestments = async () => {
    try {
      const response = await fetch('/api/investments', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setInvestments(data); // Assuming the response is an array of investment objects
      } else {
        setMessage(data.message || 'Failed to fetch investments.');
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
      setMessage('Failed to connect to the server.');
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleDelete = async () => {
    if (!selectedInvestment) {
      setMessage('Please select an investment to delete.');
      return;
    }

    setMessage('');

    try {
      const response = await fetch(`/api/investments/${selectedInvestment}`, { // Your backend API endpoint for deleting
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        setMessage('Investment deleted successfully!');
        // Refresh the list of investments after deletion
        fetchInvestments(); // Call the fetchInvestments function
        setSelectedInvestment('');
      } else {
        const data = await response.json();
        setMessage(data.message || 'Failed to delete investment.');
      }
    } catch (error) {
      console.error('Error deleting investment:', error);
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <div className="delete-investment-form">
      <h2>Delete Investment</h2>
      {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
      <div className="form-group">
        <label htmlFor="investmentName">Select Investment to Delete:</label>
        <select
          id="investmentName"
          value={selectedInvestment}
          onChange={(e) => setSelectedInvestment(e.target.value)}
          required
        >
          <option value="">Select an Investment</option>
          {investments.map((investment) => (
            <option key={investment.id} value={investment.id}>
              {investment.description}
            </option>
          ))}
        </select>
      </div>
      <button type="button" className="delete-button" onClick={handleDelete}>
        Delete Investment
      </button>
    </div>
  );
}

export default DeleteInvestmentForm;