import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./OrderConfirmation.css";
const OrderConfirmation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);

  // Sample data for demonstration
  const sampleOrderData = {
    orderNumber: "ORD-1734095123456",
    orderTotal: 89.97,
    estimatedDelivery: new Date(
      Date.now() + 5 * 24 * 60 * 60 * 1000
    ).toISOString(),
    customerInfo: {
      email: "customer@example.com",
    },
    items: [
      { name: "Wireless Bluetooth Headphones", quantity: 1, price: 59.99 },
      { name: "Phone Case - Clear", quantity: 2, price: 14.99 },
    ],
  };
  const location = useLocation();
  const data = location.state || {};
  console.log(data);
  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setIsLoading(false);
      setOrderData(data || sampleOrderData);
    }, 1500);

    return () => clearTimeout(timer);
  }, [data]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatPrice = (price) => {
    return typeof price === "number"
      ? price.toFixed(2)
      : parseFloat(price || 0).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="confirmation-container">
        <div className="loading-wrapper">
          <div
            className="loading-spinner"
            aria-label="Processing your order"
          ></div>
          <h2 className="loading-text">Processing your order...</h2>
          <p className="loading-subtext">
            Please wait while we confirm your purchase
          </p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="confirmation-container">
        <div className="error-card">
          <h2>Order information not found</h2>
          <p>Please check your email for order confirmation details.</p>
        </div>
      </div>
    );
  }

  const {
    orderNumber,
    orderTotal,
    estimatedDelivery,
    items = [],
    customerInfo = {},
  } = orderData;

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon" aria-label="Order confirmed">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="20,6 9,17 4,12"></polyline>
            </svg>
          </div>
          <h1 className="success-title">Order Confirmed!</h1>
          <p className="success-subtitle">
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </div>

        {/* Order Details */}
        <div className="order-details">
          <div className="detail-row">
            <span className="detail-label">Order Number:</span>
            <span className="detail-value order-number">{orderNumber}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Order Total:</span>
            <span className="detail-value total-amount">
              ${formatPrice(orderTotal)}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Estimated Delivery:</span>
            <span className="detail-value delivery-date">
              {formatDate(estimatedDelivery)}
            </span>
          </div>
        </div>

        {/* Customer Information */}
        {customerInfo.email && (
          <div className="info-section">
            <h3 className="section-title">Confirmation Details</h3>
            <p className="confirmation-text">
              A confirmation email has been sent to{" "}
              <strong>{customerInfo.email}</strong>
            </p>
          </div>
        )}

        {/* Product Summary */}
        {items && items.length > 0 && (
          <div className="products-section">
            <h3 className="section-title">Order Summary</h3>
            <div className="products-list">
              {items.map((item, index) => (
                <div key={index} className="product-item">
                  <div className="product-info">
                    <h4 className="product-name">{item.name}</h4>
                    <p className="product-details">Quantity: {item.quantity}</p>
                  </div>
                  <div className="product-price">
                    <span className="price-amount">
                      ${formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            className="btn btn-primary"
            onClick={() => window.print()}
            aria-label="Print order confirmation"
          >
            Print Order
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => (window.location.href = "/")}
            aria-label="Continue shopping"
          >
            Continue Shopping
          </button>
        </div>

        {/* Additional Info */}
        <div className="additional-info">
          <p className="info-text">
            <strong>Need help?</strong> Contact our customer service team at
            support@example.com
          </p>
        </div>
      </div>

      <style>{`
        .confirmation-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
            sans-serif;
        }

        .confirmation-card,
        .error-card {
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 600px;
          width: 100%;
          padding: 40px;
          margin: 20px;
          animation: slideUp 0.6s ease-out;
        }

        .loading-wrapper {
          text-align: center;
          padding: 60px 40px;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 20px;
        }

        .loading-text {
          color: #333;
          font-size: 24px;
          font-weight: 600;
          margin: 0 0 10px 0;
        }

        .loading-subtext {
          color: #666;
          font-size: 16px;
          margin: 0;
        }

        .success-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .success-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #4caf50, #45a049);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          color: white;
          animation: pulse 2s ease-in-out infinite;
        }

        .success-title {
          font-size: 32px;
          font-weight: 700;
          color: #333;
          margin: 0 0 10px 0;
        }

        .success-subtitle {
          font-size: 18px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        .order-details {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 30px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .detail-row:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          font-size: 16px;
          color: #666;
          font-weight: 500;
        }

        .detail-value {
          font-size: 16px;
          font-weight: 600;
          color: #333;
        }

        .order-number {
          font-family: monospace;
          background: #e3f2fd;
          padding: 4px 8px;
          border-radius: 6px;
          color: #1976d2;
        }

        .total-amount {
          font-size: 20px;
          color: #4caf50;
        }

        .delivery-date {
          color: #ff6b35;
        }

        .info-section,
        .products-section {
          margin-bottom: 30px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #333;
          margin: 0 0 16px 0;
          border-bottom: 2px solid #667eea;
          padding-bottom: 8px;
        }

        .confirmation-text {
          font-size: 16px;
          color: #666;
          line-height: 1.5;
          margin: 0;
        }

        .products-list {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
        }

        .product-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .product-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .product-info {
          flex: 1;
        }

        .product-name {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 4px 0;
        }

        .product-details {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .product-price {
          text-align: right;
        }

        .price-amount {
          font-size: 18px;
          font-weight: 600;
          color: #4caf50;
        }

        .action-buttons {
          display: flex;
          gap: 16px;
          margin-bottom: 30px;
        }

        .btn {
          flex: 1;
          padding: 14px 24px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #333;
          border: 2px solid #e0e0e0;
        }

        .btn-secondary:hover {
          background: #e9ecef;
          border-color: #667eea;
          transform: translateY(-2px);
        }

        .additional-info {
          text-align: center;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
        }

        .info-text {
          font-size: 14px;
          color: #666;
          margin: 0;
          line-height: 1.5;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .confirmation-container {
            padding: 10px;
            align-items: flex-start;
            padding-top: 40px;
          }

          .confirmation-card,
          .error-card {
            padding: 24px;
            margin: 10px;
          }

          .success-title {
            font-size: 26px;
          }

          .success-subtitle {
            font-size: 16px;
          }

          .detail-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }

          .detail-value {
            align-self: flex-end;
          }

          .action-buttons {
            flex-direction: column;
          }

          .product-item {
            flex-direction: column;
            gap: 8px;
          }

          .product-price {
            text-align: left;
          }
        }

        @media (max-width: 480px) {
          .confirmation-card,
          .error-card {
            padding: 20px;
          }

          .success-title {
            font-size: 22px;
          }

          .order-details,
          .products-list {
            padding: 16px;
          }
        }

        /* Print Styles */
        @media print {
          .confirmation-container {
            background: white;
            padding: 0;
          }

          .confirmation-card {
            box-shadow: none;
            margin: 0;
            padding: 20px;
          }

          .action-buttons {
            display: none;
          }

          .success-icon {
            background: #4caf50 !important;
            -webkit-print-color-adjust: exact;
          }
        }

        /* High Contrast Mode */
        @media (prefers-contrast: high) {
          .confirmation-card {
            border: 2px solid #000;
          }

          .detail-value,
          .product-name {
            color: #000;
          }

          .btn-primary {
            background: #000;
            border: 2px solid #000;
          }
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          .confirmation-card,
          .success-icon,
          .loading-spinner {
            animation: none;
          }

          .btn {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default OrderConfirmation;
