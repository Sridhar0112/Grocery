import React, { useEffect, useState } from "react";
import "./Cart.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  var navigation = useNavigate();
  const Navigation = () => {
    navigation("/checkout");
  };
  // Fetch cart items from API
  useEffect(() => {
    axios
      .get("http://localhost:5000/cart")
      .then((response) => setCartItems(response.data))
      .catch((error) => console.error("Error fetching cart items:", error));
  }, []);

  // Calculate total price dynamically
  const calculateTotal = () =>
    cartItems.reduce((acc, item) => acc + item.price * (item.Quantity || 1), 0);

  const handleRemove = (name) => {
    setCartItems(cartItems.filter((item) => item.name !== name));
    axios
      .delete("http://localhost:5000/cart", { data: { name } })
      .catch((error) => console.error("Error removing item:", error));
  };

  return (
    <div className="cart">
      <h2 className="cart-title">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart-message">Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.image} alt={item.name} className="item-image" />
                <h4 className="item-name">{item.name}</h4>
                <p className="item-price">
                  Price: ${item.price * (item.Quantity || 1)}
                </p>
                <p className="item-quantity">
                  Quantity: {item.Quantity || 1}kg
                </p>
                <button
                  onClick={() => handleRemove(item.name)}
                  className="remove-button"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <h3 style={{ textAlign: "center" }} className="total-price">
            Total: ${calculateTotal()}
          </h3>
          <button onClick={() => Navigation()} className="checkout-button">
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default Cart;
