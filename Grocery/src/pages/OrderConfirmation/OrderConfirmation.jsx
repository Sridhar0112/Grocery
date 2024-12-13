import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use useNavigate for navigation
  const orderData = location.state || {}; // Get the order data passed from Checkout

  // Handling case when orderData is missing
  if (!orderData.name) {
    return <p>Order details not found. Please go back and try again.</p>;
  }

  return (
    <div className="order-confirmation">
      <h2 className="confirmation-title">Order Confirmation</h2>

      {/* Confirmation Message with a Thank You Note */}
      <div className="thank-you-message">
        <p>Thank you for your order, <strong>{orderData.name}</strong>!</p>
        <p>Your order has been successfully placed. We will process it soon.</p>
      </div>

      {/* Order Summary Section */}
      <div className="order-summary">
        <h3>Order Summary</h3>
        <div className="summary-detail">
          <p><strong>Email:</strong> {orderData.email}</p>
          <p><strong>Address:</strong> {orderData.address}</p>
          <p><strong>City:</strong> {orderData.city}</p>
          <p><strong>State:</strong> {orderData.state}</p>
          <p><strong>ZIP Code:</strong> {orderData.zip}</p>
          <p><strong>Payment Method:</strong> {orderData.paymentMethod}</p>
        </div>

        {/* Order ID (simulated for now) */}
        <div className="order-id">
          <p><strong>Order ID:</strong> #{Math.floor(Math.random() * 1000000)}</p>
        </div>
      </div>

      {/* Navigation Button to Go Back to Home */}
      <div className="home-button">
        <button onClick={() => navigate("/")} className="btn-home">Go to Home</button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
