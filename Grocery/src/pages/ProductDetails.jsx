import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showNutrition, setShowNutrition] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState("");
  const [relatedProducts, setRelatedProducts] = useState([]);
  const productRef = useRef(null);

  // Mock data for demonstration
  const mockProduct = {
    id: 1,
    name: "Organic Bananas",
    category: "Fresh Fruits",
    price: 3.99,
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    description:
      "Fresh organic bananas, perfect for snacking or baking. Rich in potassium and natural sugars.",
    rating: 4.5,
    reviews: 127,
    nutrition: {
      calories: "89 per 100g",
      carbs: "23g",
      fiber: "2.6g",
      potassium: "358mg",
      ingredients: ["Organic Bananas"],
    },
    inStock: true,
  };

  const mockRelatedProducts = [
    {
      id: 2,
      name: "Organic Apples",
      price: 4.99,
      image:
        "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop",
    },
    {
      id: 3,
      name: "Fresh Oranges",
      price: 5.49,
      image:
        "https://images.unsplash.com/photo-1547514701-42782101795e?w=200&h=200&fit=crop",
    },
    {
      id: 4,
      name: "Organic Grapes",
      price: 6.99,
      image:
        "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=200&h=200&fit=crop",
    },
    {
      id: 5,
      name: "Fresh Strawberries",
      price: 4.49,
      image:
        "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=200&h=200&fit=crop",
    },
    {
      id: 6,
      name: "Organic Blueberries",
      price: 7.99,
      image:
        "https://images.unsplash.com/photo-1498557850523-fd3d118b962e?w=200&h=200&fit=crop",
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct);
      setRelatedProducts(mockRelatedProducts);
    }, 500);

    const handleScroll = () => {
      if (productRef.current) {
        const rect = productRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [id]);

  const handleQuantityChange = (change) => {
    setQuantity((prev) => Math.max(1, prev + change));
  };

  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleRatingClick = (rating) => {
    setUserRating(rating);
  };

  const handleSubmitReview = () => {
    if (userRating > 0 && reviewText.trim()) {
      alert(`Review submitted: ${userRating} stars - "${reviewText}"`);
      setUserRating(0);
      setReviewText("");
    }
  };

  const handlePincodeCheck = () => {
    if (pincode.length === 6) {
      const days = Math.floor(Math.random() * 3) + 1;
      setDeliveryInfo(
        `Estimated delivery in ${days}-${days + 1} business days`
      );
    } else {
      setDeliveryInfo("Please enter a valid 6-digit pincode");
    }
  };

  const StarRating = ({
    rating,
    interactive = false,
    onRatingClick = null,
  }) => {
    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? "filled" : ""} ${
              interactive ? "interactive" : ""
            }`}
            onClick={() => interactive && onRatingClick && onRatingClick(star)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!product) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="product-details-container">
      {/* Back to Shop Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => window.history.back()}>
          ← Back to Shop
        </button>
      </div>

      <div className="product-details" ref={productRef}>
        <div className="product-main">
          <div className="product-image-section">
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />
          </div>

          <div className="product-info-section">
            <div className="product-header">
              <h1 className="product-name">{product.name}</h1>
              <button
                className={`wishlist-button ${
                  isWishlisted ? "wishlisted" : ""
                }`}
                onClick={handleWishlistToggle}
                aria-label="Add to wishlist"
              >
                {isWishlisted ? "❤️" : "🤍"}
              </button>
            </div>

            <p className="product-category">{product.category}</p>

            <div className="rating-section">
              <StarRating rating={product.rating} />
              <span className="rating-text">({product.reviews} reviews)</span>
            </div>

            <div className="price-section">
              <h2 className="product-price">${product.price}</h2>
              <span className="stock-status">
                {product.inStock ? "✅ In Stock" : "❌ Out of Stock"}
              </span>
            </div>

            <p className="product-description">{product.description}</p>

            {/* Quantity Selector */}
            <div className="quantity-section">
              <label className="quantity-label">Quantity:</label>
              <div className="quantity-selector">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <button className="add-to-cart-btn" disabled={!product.inStock}>
              Add to Cart - ${(product.price * quantity).toFixed(2)}
            </button>

            {/* Delivery Estimator */}
            <div className="delivery-section">
              <h3>Check Delivery</h3>
              <div className="pincode-input">
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="pincode-field"
                />
                <button onClick={handlePincodeCheck} className="check-btn">
                  Check
                </button>
              </div>
              {deliveryInfo && <p className="delivery-info">{deliveryInfo}</p>}
            </div>
          </div>
        </div>

        {/* Nutritional Info Section */}
        <div className="nutrition-section">
          <button
            className="nutrition-toggle"
            onClick={() => setShowNutrition(!showNutrition)}
          >
            Nutritional Information {showNutrition ? "▲" : "▼"}
          </button>
          {showNutrition && (
            <div className="nutrition-content">
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <strong>Calories:</strong> {product.nutrition.calories}
                </div>
                <div className="nutrition-item">
                  <strong>Carbohydrates:</strong> {product.nutrition.carbs}
                </div>
                <div className="nutrition-item">
                  <strong>Fiber:</strong> {product.nutrition.fiber}
                </div>
                <div className="nutrition-item">
                  <strong>Potassium:</strong> {product.nutrition.potassium}
                </div>
              </div>
              <div className="ingredients">
                <strong>Ingredients:</strong>{" "}
                {product.nutrition.ingredients.join(", ")}
              </div>
            </div>
          )}
        </div>

        {/* Reviews Section */}
        <div className="reviews-section">
          <h3>Reviews & Ratings</h3>

          <div className="add-review">
            <h4>Write a Review</h4>
            <div className="review-rating">
              <span>Your Rating:</span>
              <StarRating
                rating={userRating}
                interactive={true}
                onRatingClick={handleRatingClick}
              />
            </div>
            <textarea
              className="review-text"
              placeholder="Share your experience with this product..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
            />
            <button
              className="submit-review-btn"
              onClick={handleSubmitReview}
              disabled={userRating === 0 || !reviewText.trim()}
            >
              Submit Review
            </button>
          </div>
        </div>

        {/* Related Products Carousel */}
        <div className="related-products-section">
          <h3>Related Products</h3>
          <div className="related-products-carousel">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="related-product-card">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="related-product-image"
                />
                <h4 className="related-product-name">{relatedProduct.name}</h4>
                <p className="related-product-price">${relatedProduct.price}</p>
                <button className="related-product-btn">Quick Add</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Add to Cart Bar */}
      {showStickyBar && (
        <div className="sticky-cart-bar">
          <div className="sticky-cart-content">
            <div className="sticky-product-info">
              <img
                src={product.image}
                alt={product.name}
                className="sticky-product-image"
              />
              <div>
                <h4 className="sticky-product-name">{product.name}</h4>
                <p className="sticky-product-price">
                  ${(product.price * quantity).toFixed(2)}
                </p>
              </div>
            </div>
            <button className="sticky-add-to-cart" disabled={!product.inStock}>
              Add to Cart
            </button>
          </div>
        </div>
      )}

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .product-details-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #f3f3f3;
          border-top: 4px solid #2196F3;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .back-button-container {
          margin-bottom: 30px;
        }

        .back-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .back-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .product-main {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .product-image-section {
          display: flex;
          justify-content: center;
        }

        .product-image {
          width: 100%;
          max-width: 500px;
          height: auto;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }

        .product-info-section {
          padding: 20px 0;
        }

        .product-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 15px;
        }

        .product-name {
          font-size: 2.5rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 0;
        }

        .wishlist-button {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .wishlist-button:hover {
          transform: scale(1.1);
        }

        .wishlist-button.wishlisted {
          animation: heartBeat 0.5s ease;
        }

        @keyframes heartBeat {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }

        .product-category {
          color: #7f8c8d;
          font-size: 1.1rem;
          margin-bottom: 15px;
        }

        .rating-section {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .star-rating {
          display: flex;
          gap: 2px;
        }

        .star {
          font-size: 1.5rem;
          cursor: default;
          color: #ddd;
        }

        .star.filled {
          color: #ffd700;
        }

        .star.interactive {
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .star.interactive:hover {
          color: #ffd700;
        }

        .rating-text {
          color: #7f8c8d;
          font-size: 0.9rem;
        }

        .price-section {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 20px;
        }

        .product-price {
          font-size: 2rem;
          font-weight: bold;
          color: #27ae60;
        }

        .stock-status {
          font-size: 0.9rem;
          padding: 5px 10px;
          border-radius: 15px;
          background: #d4edda;
          color: #155724;
        }

        .product-description {
          color: #555;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 30px;
        }

        .quantity-section {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 30px;
        }

        .quantity-label {
          font-weight: 600;
          font-size: 1.1rem;
        }

        .quantity-selector {
          display: flex;
          align-items: center;
          border: 2px solid #e0e0e0;
          border-radius: 25px;
          overflow: hidden;
        }

        .quantity-btn {
          background: #f8f9fa;
          border: none;
          width: 40px;
          height: 40px;
          font-size: 1.5rem;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .quantity-btn:hover:not(:disabled) {
          background: #e9ecef;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .quantity-display {
          padding: 0 20px;
          font-weight: 600;
          font-size: 1.1rem;
        }

        .add-to-cart-btn {
          width: 100%;
          background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
          color: white;
          border: none;
          padding: 15px 30px;
          font-size: 1.2rem;
          font-weight: 600;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 30px;
        }

        .add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
        }

        .add-to-cart-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
          transform: none;
        }

        .delivery-section {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 15px;
          margin-bottom: 40px;
        }

        .delivery-section h3 {
          margin-bottom: 15px;
          color: #495057;
        }

        .pincode-input {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
        }

        .pincode-field {
          flex: 1;
          padding: 10px 15px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 1rem;
        }

        .pincode-field:focus {
          outline: none;
          border-color: #2196F3;
        }

        .check-btn {
          background: #2196F3;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
        }

        .check-btn:hover {
          background: #1976D2;
        }

        .delivery-info {
          color: #28a745;
          font-weight: 600;
          margin-top: 10px;
        }

        .nutrition-section {
          background: #fff;
          border: 2px solid #e0e0e0;
          border-radius: 15px;
          margin-bottom: 40px;
          overflow: hidden;
        }

        .nutrition-toggle {
          width: 100%;
          background: #f8f9fa;
          border: none;
          padding: 20px;
          font-size: 1.1rem;
          font-weight: 600;
          text-align: left;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .nutrition-toggle:hover {
          background: #e9ecef;
        }

        .nutrition-content {
          padding: 20px;
          background: white;
        }

        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
        }

        .nutrition-item {
          padding: 10px;
          background: #f8f9fa;
          border-radius: 8px;
        }

        .ingredients {
          padding: 15px;
          background: #e8f5e8;
          border-radius: 8px;
          border-left: 4px solid #28a745;
        }

        .reviews-section {
          background: #fff;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          margin-bottom: 40px;
        }

        .reviews-section h3 {
          margin-bottom: 25px;
          color: #2c3e50;
        }

        .add-review {
          border: 2px solid #e0e0e0;
          border-radius: 12px;
          padding: 20px;
          background: #fafafa;
        }

        .add-review h4 {
          margin-bottom: 15px;
          color: #495057;
        }

        .review-rating {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 15px;
        }

        .review-text {
          width: 100%;
          padding: 12px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          resize: vertical;
          font-family: inherit;
          font-size: 1rem;
          margin-bottom: 15px;
        }

        .review-text:focus {
          outline: none;
          border-color: #2196F3;
        }

        .submit-review-btn {
          background: #17a2b8;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .submit-review-btn:hover:not(:disabled) {
          background: #138496;
        }

        .submit-review-btn:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        .related-products-section {
          margin-bottom: 40px;
        }

        .related-products-section h3 {
          margin-bottom: 25px;
          color: #2c3e50;
          font-size: 1.8rem;
        }

        .related-products-carousel {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 10px 0 20px 0;
          scroll-behavior: smooth;
        }

        .related-products-carousel::-webkit-scrollbar {
          height: 8px;
        }

        .related-products-carousel::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }

        .related-products-carousel::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 10px;
        }

        .related-product-card {
          flex: 0 0 200px;
          background: white;
          border-radius: 12px;
          padding: 15px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s ease;
        }

        .related-product-card:hover {
          transform: translateY(-5px);
        }

        .related-product-image {
          width: 100%;
          height: 150px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .related-product-name {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: #2c3e50;
        }

        .related-product-price {
          font-size: 1.1rem;
          font-weight: bold;
          color: #27ae60;
          margin-bottom: 12px;
        }

        .related-product-btn {
          width: 100%;
          background: #007bff;
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .related-product-btn:hover {
          background: #0056b3;
        }

        .sticky-cart-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: white;
          border-top: 2px solid #e0e0e0;
          padding: 15px 20px;
          box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }

        .sticky-cart-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sticky-product-info {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .sticky-product-image {
          width: 50px;
          height: 50px;
          object-fit: cover;
          border-radius: 8px;
        }

        .sticky-product-name {
          font-size: 1rem;
          font-weight: 600;
          color: #2c3e50;
          margin: 0;
        }

        .sticky-product-price {
          font-size: 1.1rem;
          font-weight: bold;
          color: #27ae60;
          margin: 0;
        }

        .sticky-add-to-cart {
          background: #28a745;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
        }

        .sticky-add-to-cart:hover:not(:disabled) {
          background: #218838;
        }

        .sticky-add-to-cart:disabled {
          background: #6c757d;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .product-details-container {
            padding: 15px;
          }
          
          .product-main {
            grid-template-columns: 1fr;
            gap: 20px;
          }
          
          .product-name {
            font-size: 2rem;
          }
          
          .nutrition-grid {
            grid-template-columns: 1fr;
          }
          
          .related-product-card {
            flex: 0 0 160px;
          }
          
          .sticky-cart-content {
            flex-direction: column;
            gap: 10px;
          }
          
          .sticky-add-to-cart {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetails;
