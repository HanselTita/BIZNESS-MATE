import React, { useState } from 'react';
import './AddExpenditureForm.css'; // Create CSS for this form

function AddExpenditureForm() {
  const [nature, setNature] = useState('');
  const [cost, setCost] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/expenditures', { // Your backend API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include auth token
        },
        body: JSON.stringify({ description: nature, amount: parseFloat(cost) }), // Adjust payload as needed
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Expenditure saved successfully!');
        setNature('');
        setCost('');
      } else {
        setMessage(data.message || 'Failed to save expenditure.');
      }
    } catch (error) {
      console.error('Error saving expenditure:', error);
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <div className="add-expenditure-form">
      <h2>Add New Expenditure</h2>
      {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nature">Nature of Expenditure:</label>
          <input
            type="text"
            id="nature"
            value={nature}
            onChange={(e) => setNature(e.target.value)}
            placeholder="e.g., Office Rent, Supplies"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="cost">Cost Incurred:</label>
          <input
            type="number"
            id="cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            placeholder="e.g., 500.00"
            required
          />
        </div>
        <button type="submit" className="save-button">
          Save Expenditure
        </button>
      </form>
    </div>
  );
}

export default AddExpenditureForm;