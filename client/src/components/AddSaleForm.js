import React, { useState, useEffect } from 'react';
import './AddSaleForm.css'; // Create CSS for this form

function AddSaleForm() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantitySold, setQuantitySold] = useState('');
  const [sellingPricePerUnit, setSellingPricePerUnit] = useState('');
  const [products, setProducts] = useState([]); // To store the list of products from the backend
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch the list of existing products from your backend
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/production-costs', { // Assuming your product list is here
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setProducts(data); // Assuming the response is an array of product objects
        } else {
          setMessage(data.message || 'Failed to fetch products.');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setMessage('Failed to connect to the server.');
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/sales', { // Your backend API endpoint for sales
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          product_name: selectedProduct,
          quantity: parseInt(quantitySold),
          unit_price: parseFloat(sellingPricePerUnit),
          sale_date: new Date().toISOString().slice(0, 10), // Current date
          // You might need to add customer information or other details
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Sale recorded successfully!');
        setSelectedProduct('');
        setQuantitySold('');
        setSellingPricePerUnit('');
      } else {
        setMessage(data.message || 'Failed to record sale.');
      }
    } catch (error) {
      console.error('Error recording sale:', error);
      setMessage('Failed to connect to the server.');
    }
  };

  return (
    <div className="add-sale-form">
      <h2>Record New Sale</h2>
      {message && <p className={message.includes('success') ? 'success-message' : 'error-message'}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Sold:</label>
          <select
            id="productName"
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            required
          >
            <option value="">Select a Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.product_name}>
                {product.product_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="quantitySold">Quantity Sold:</label>
          <input
            type="number"
            id="quantitySold"
            value={quantitySold}
            onChange={(e) => setQuantitySold(e.target.value)}
            placeholder="e.g., 10"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sellingPricePerUnit">Selling Price per Unit:</label>
          <input
            type="number"
            id="sellingPricePerUnit"
            value={sellingPricePerUnit}
            onChange={(e) => setSellingPricePerUnit(e.target.value)}
            placeholder="e.g., 4.99"
            required
          />
        </div>
        <button type="submit" className="save-button">
          Record Sale
        </button>
      </form>
    </div>
  );
}

export default AddSaleForm;