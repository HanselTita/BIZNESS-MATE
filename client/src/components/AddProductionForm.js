import React, { useState } from 'react';
import './AddProductionForm.css'; // Create CSS for this form

function AddProductionForm() {
  const [productName, setProductName] = useState('');
  const [costPrice, setCostPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/production-costs', { // Your backend API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Include auth token
        },
        body: JSON.stringify({
          product_name: productName,
          cost_price: parseFloat(costPrice),
          selling_price: parseFloat(sellingPrice),
          // You might want to include 'recorded_at' and 'quantity' if needed
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Product saved successfully!');
        setProductName('');
        setCostPrice('');
        setSellingPrice('');
      } else {
        setMessage(data.message || 'Failed to save product.');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <div className="add-production-form">
      <h2>Add New Product/Production</h2>
      {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product/Production Name:</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            placeholder="e.g., Tomatoes, Batch #1"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="costPrice">Cost of Production/Cost Price:</label>
          <input
            type="number"
            id="costPrice"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
            placeholder="e.g., 2.50"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sellingPrice">Selling Price per Unit:</label>
          <input
            type="number"
            id="sellingPrice"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder="e.g., 4.99"
            required
          />
        </div>
        <button type="submit" className="save-button">
          Save New Product
        </button>
      </form>
    </div>
  );
}

export default AddProductionForm;