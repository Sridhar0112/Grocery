import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    paymentMethod: "credit",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    phone: "",
    country: "US",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formTouched, setFormTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [estimatedDelivery, setEstimatedDelivery] = useState("");
  const [orderTotal, setOrderTotal] = useState(299.99);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [showTooltip, setShowTooltip] = useState({});

  const navigate = useNavigate();
  const formRef = useRef(null);
  const firstErrorRef = useRef(null);

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("checkoutFormData");
    const rememberMeStatus = localStorage.getItem("rememberMe") === "true";

    if (savedData && rememberMeStatus) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData);
        setRememberMe(true);
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    }

    // Calculate estimated delivery date
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    setEstimatedDelivery(deliveryDate.toLocaleDateString());
  }, []);

  // Auto-save form data
  useEffect(() => {
    if (rememberMe) {
      localStorage.setItem("checkoutFormData", JSON.stringify(formData));
      localStorage.setItem("rememberMe", "true");
    } else {
      localStorage.removeItem("checkoutFormData");
      localStorage.removeItem("rememberMe");
    }
  }, [formData, rememberMe]);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // Auto-capitalization for city and state
    if (name === "city" || name === "state") {
      processedValue = capitalizeFirstLetter(value);
    }

    // Format card number
    if (name === "cardNumber") {
      processedValue = formatCardNumber(value);
    }

    // Format expiry date
    if (name === "expiryDate") {
      processedValue = formatExpiryDate(value);
    }

    // Limit CVV to 4 digits
    if (name === "cvv") {
      processedValue = value.replace(/\D/g, "").substring(0, 4);
    }

    // Format phone number
    if (name === "phone") {
      const phoneNumber = value.replace(/[^\d]/g, "");
      if (phoneNumber.length <= 10) {
        if (phoneNumber.length <= 3) {
          processedValue = phoneNumber;
        } else if (phoneNumber.length <= 6) {
          processedValue = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
            3
          )}`;
        } else {
          processedValue = `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
            3,
            6
          )}-${phoneNumber.slice(6)}`;
        }
      } else {
        processedValue = formData.phone; // Don't update if too long
      }
    }

    setFormData({ ...formData, [name]: processedValue });

    // Mark field as touched
    setFormTouched({ ...formTouched, [name]: true });

    // Real-time validation
    validateField(name, processedValue);
  };

  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case "name":
        if (!value.trim()) {
          newErrors.name = "Name is required";
        } else if (value.trim().length < 2) {
          newErrors.name = "Name must be at least 2 characters";
        } else {
          delete newErrors.name;
        }
        break;
      case "email":
        if (!value) {
          newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = "Please enter a valid email address";
        } else {
          delete newErrors.email;
        }
        break;
      case "address":
        if (!value.trim()) {
          newErrors.address = "Address is required";
        } else if (value.trim().length < 5) {
          newErrors.address = "Please enter a complete address";
        } else {
          delete newErrors.address;
        }
        break;
      case "city":
        if (!value.trim()) {
          newErrors.city = "City is required";
        } else {
          delete newErrors.city;
        }
        break;
      case "state":
        if (!value.trim()) {
          newErrors.state = "State is required";
        } else {
          delete newErrors.state;
        }
        break;
      case "zip":
        if (!value) {
          newErrors.zip = "ZIP code is required";
        } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
          newErrors.zip = "Please enter a valid ZIP code (12345 or 12345-6789)";
        } else {
          delete newErrors.zip;
        }
        break;
      case "phone":
        if (!value) {
          newErrors.phone = "Phone number is required";
        } else if (value.replace(/[^\d]/g, "").length !== 10) {
          newErrors.phone = "Please enter a valid 10-digit phone number";
        } else {
          delete newErrors.phone;
        }
        break;
      case "cardNumber":
        if (formData.paymentMethod !== "paypal") {
          if (!value) {
            newErrors.cardNumber = "Card number is required";
          } else if (value.replace(/\s/g, "").length < 13) {
            newErrors.cardNumber = "Please enter a valid card number";
          } else {
            delete newErrors.cardNumber;
          }
        } else {
          delete newErrors.cardNumber;
        }
        break;
      case "expiryDate":
        if (formData.paymentMethod !== "paypal") {
          if (!value) {
            newErrors.expiryDate = "Expiry date is required";
          } else if (!/^\d{2}\/\d{2}$/.test(value)) {
            newErrors.expiryDate = "Please enter MM/YY format";
          } else {
            const [month, year] = value.split("/");
            const currentDate = new Date();
            const currentYear = currentDate.getFullYear() % 100;
            const currentMonth = currentDate.getMonth() + 1;

            if (parseInt(month) < 1 || parseInt(month) > 12) {
              newErrors.expiryDate = "Invalid month";
            } else if (
              parseInt(year) < currentYear ||
              (parseInt(year) === currentYear && parseInt(month) < currentMonth)
            ) {
              newErrors.expiryDate = "Card has expired";
            } else {
              delete newErrors.expiryDate;
            }
          }
        } else {
          delete newErrors.expiryDate;
        }
        break;
      case "cvv":
        if (formData.paymentMethod !== "paypal") {
          if (!value) {
            newErrors.cvv = "CVV is required";
          } else if (value.length < 3) {
            newErrors.cvv = "CVV must be 3-4 digits";
          } else {
            delete newErrors.cvv;
          }
        } else {
          delete newErrors.cvv;
        }
        break;
    }

    setErrors(newErrors);
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate all fields
    Object.keys(formData).forEach((field) => {
      validateField(field, formData[field]);
    });

    // Additional validations
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Valid email is required";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zip || !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
      newErrors.zip = "Valid ZIP code is required";
    }
    if (!formData.phone || formData.phone.replace(/[^\d]/g, "").length !== 10) {
      newErrors.phone = "Valid phone number is required";
    }

    // Payment method specific validation
    if (formData.paymentMethod !== "paypal") {
      if (
        !formData.cardNumber ||
        formData.cardNumber.replace(/\s/g, "").length < 13
      ) {
        newErrors.cardNumber = "Valid card number is required";
      }
      if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Valid expiry date is required";
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.cvv = "Valid CVV is required";
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const scrollToFirstError = (errorFields) => {
    const firstErrorField = Object.keys(errorFields)[0];
    const element = document.querySelector(`[name="${firstErrorField}"]`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.focus();
    }
  };

  const applyPromoCode = () => {
    const validCodes = {
      SAVE10: 10,
      WELCOME20: 20,
      FIRST15: 15,
    };

    if (validCodes[promoCode.toUpperCase()]) {
      setDiscount(validCodes[promoCode.toUpperCase()]);
    } else {
      alert("Invalid promo code");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setIsSubmitting(false);
      scrollToFirstError(validationErrors);
      return;
    }

    setShowConfirmDialog(true);
    setIsSubmitting(false);
  };

  const confirmOrder = async () => {
    setShowConfirmDialog(false);
    setIsSubmitting(true);

    // Simulate API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Clear form data if not remembering
      if (!rememberMe) {
        localStorage.removeItem("checkoutFormData");
        localStorage.removeItem("rememberMe");
      }

      navigate("/confirmation", {
        state: {
          ...formData,
          orderTotal: (orderTotal - discount).toFixed(2),
          orderNumber: `ORD-${Date.now()}`,
          estimatedDelivery,
        },
      });
    } catch (error) {
      console.error("Order submission failed:", error);
      alert("Order submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      name: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      paymentMethod: "credit",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      phone: "",
      country: "US",
    });
    setErrors({});
    setFormTouched({});
    setPromoCode("");
    setDiscount(0);
    localStorage.removeItem("checkoutFormData");
  };

  const showTooltipHandler = (field) => {
    setShowTooltip({ ...showTooltip, [field]: true });
  };

  const hideTooltipHandler = (field) => {
    setShowTooltip({ ...showTooltip, [field]: false });
  };

  const styles = {
    checkout: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f9f9f9",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    header: {
      textAlign: "center",
      color: "#333",
      marginBottom: "30px",
      fontSize: "2.5rem",
      background: "linear-gradient(45deg, #667eea 0%, #764ba2 100%)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      backgroundClip: "text",
    },
    orderSummary: {
      backgroundColor: "#fff",
      padding: "20px",
      borderRadius: "8px",
      marginBottom: "20px",
      border: "1px solid #e0e0e0",
    },
    form: {
      backgroundColor: "#fff",
      padding: "30px",
      borderRadius: "8px",
      border: "1px solid #e0e0e0",
    },
    row: {
      display: "flex",
      gap: "15px",
      marginBottom: "20px",
    },
    formGroup: {
      marginBottom: "20px",
      flex: "1",
      position: "relative",
    },
    label: {
      display: "block",
      marginBottom: "5px",
      fontWeight: "bold",
      color: "#555",
      fontSize: "14px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "2px solid #ddd",
      borderRadius: "6px",
      fontSize: "16px",
      transition: "all 0.3s ease",
      boxSizing: "border-box",
    },
    inputFocused: {
      borderColor: "#667eea",
      outline: "none",
      boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
    },
    inputError: {
      borderColor: "#e74c3c",
      backgroundColor: "#fdf2f2",
    },
    inputValid: {
      borderColor: "#27ae60",
      backgroundColor: "#f8fff8",
    },
    textarea: {
      width: "100%",
      padding: "12px",
      border: "2px solid #ddd",
      borderRadius: "6px",
      fontSize: "16px",
      minHeight: "80px",
      resize: "vertical",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "12px",
      border: "2px solid #ddd",
      borderRadius: "6px",
      fontSize: "16px",
      backgroundColor: "white",
      boxSizing: "border-box",
    },
    error: {
      color: "#e74c3c",
      fontSize: "12px",
      marginTop: "5px",
      display: "flex",
      alignItems: "center",
      gap: "5px",
    },
    button: {
      backgroundColor: "#667eea",
      color: "white",
      padding: "15px 30px",
      border: "none",
      borderRadius: "6px",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      transition: "all 0.3s ease",
      width: "100%",
      marginTop: "20px",
    },
    buttonHover: {
      backgroundColor: "#5a67d8",
      transform: "translateY(-2px)",
      boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
    },
    buttonDisabled: {
      backgroundColor: "#a0a0a0",
      cursor: "not-allowed",
      transform: "none",
      boxShadow: "none",
    },
    secondaryButton: {
      backgroundColor: "transparent",
      color: "#667eea",
      border: "2px solid #667eea",
      padding: "12px 24px",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      transition: "all 0.3s ease",
      marginRight: "10px",
    },
    spinner: {
      display: "inline-block",
      width: "20px",
      height: "20px",
      border: "3px solid #f3f3f3",
      borderTop: "3px solid #667eea",
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
      marginRight: "10px",
    },
    modal: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: "1000",
    },
    modalContent: {
      backgroundColor: "white",
      padding: "30px",
      borderRadius: "10px",
      maxWidth: "500px",
      width: "90%",
      textAlign: "center",
    },
    checkbox: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginTop: "15px",
    },
    promoSection: {
      display: "flex",
      gap: "10px",
      alignItems: "center",
      marginTop: "15px",
    },
    promoInput: {
      flex: "1",
      padding: "10px",
      border: "2px solid #ddd",
      borderRadius: "6px",
    },
    tooltip: {
      position: "absolute",
      top: "-40px",
      left: "0",
      backgroundColor: "#333",
      color: "white",
      padding: "8px 12px",
      borderRadius: "4px",
      fontSize: "12px",
      whiteSpace: "nowrap",
      zIndex: "100",
      opacity: "0.9",
    },
    progressBar: {
      width: "100%",
      height: "4px",
      backgroundColor: "#e0e0e0",
      borderRadius: "2px",
      marginBottom: "20px",
      overflow: "hidden",
    },
    progressFill: {
      height: "100%",
      backgroundColor: "#667eea",
      transition: "width 0.3s ease",
      borderRadius: "2px",
    },
    deliveryInfo: {
      backgroundColor: "#e8f4fd",
      padding: "15px",
      borderRadius: "6px",
      marginBottom: "20px",
      border: "1px solid #bee5eb",
    },
  };

  // Calculate form completion percentage
  const totalFields = Object.keys(formData).length;
  const filledFields = Object.values(formData).filter(
    (value) => value.toString().trim() !== ""
  ).length;
  const completionPercentage = (filledFields / totalFields) * 100;

  return (
    <>
      <div style={styles.checkout}>
        <style>
          {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .form-input:focus {
            border-color: #667eea !important;
            outline: none;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          }
          
          .shake {
            animation: shake 0.5s;
          }
          
          @keyframes shake {
            0%, 20%, 40%, 60%, 80% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          }
        `}
        </style>

        <h2 style={styles.header}>🛍️ Secure Checkout</h2>

        {/* Progress Bar */}
        <div style={styles.progressBar}>
          <div
            style={{
              ...styles.progressFill,
              width: `${completionPercentage}%`,
            }}
          ></div>
        </div>
        <p style={{ textAlign: "center", color: "#666", marginBottom: "20px" }}>
          Form {Math.round(completionPercentage)}% complete
        </p>

        {/* Order Summary */}
        <div style={styles.orderSummary}>
          <h3>📋 Order Summary</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <span>Subtotal:</span>
            <span>${orderTotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
                color: "#27ae60",
              }}
            >
              <span>Discount:</span>
              <span>-${discount.toFixed(2)}</span>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
              fontSize: "18px",
              borderTop: "1px solid #ddd",
              paddingTop: "10px",
            }}
          >
            <span>Total:</span>
            <span>${(orderTotal - discount).toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Information */}
        <div style={styles.deliveryInfo}>
          <h4>🚚 Delivery Information</h4>
          <p>
            Estimated delivery: <strong>{estimatedDelivery}</strong>
          </p>
          <p>Free shipping on orders over $25</p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} style={styles.form}>
          <h3>👤 Personal Information</h3>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                style={{
                  ...styles.input,
                  ...(errors.name
                    ? styles.inputError
                    : formTouched.name && !errors.name
                    ? styles.inputValid
                    : {}),
                }}
                placeholder="Enter your full name"
              />
              {errors.name && <div style={styles.error}>❌ {errors.name}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                style={{
                  ...styles.input,
                  ...(errors.email
                    ? styles.inputError
                    : formTouched.email && !errors.email
                    ? styles.inputValid
                    : {}),
                }}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <div style={styles.error}>❌ {errors.email}</div>
              )}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="form-input"
              style={{
                ...styles.input,
                ...(errors.phone
                  ? styles.inputError
                  : formTouched.phone && !errors.phone
                  ? styles.inputValid
                  : {}),
              }}
              placeholder="(123) 456-7890"
            />
            {errors.phone && <div style={styles.error}>❌ {errors.phone}</div>}
          </div>

          <h3 style={{ marginTop: "30px" }}>🏠 Shipping Address</h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>Street Address *</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              style={{
                ...styles.textarea,
                ...(errors.address
                  ? styles.inputError
                  : formTouched.address && !errors.address
                  ? styles.inputValid
                  : {}),
              }}
              placeholder="Enter your complete address"
            />
            {errors.address && (
              <div style={styles.error}>❌ {errors.address}</div>
            )}
          </div>

          <div style={styles.row}>
            <div style={styles.formGroup}>
              <label style={styles.label}>City *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="form-input"
                style={{
                  ...styles.input,
                  ...(errors.city
                    ? styles.inputError
                    : formTouched.city && !errors.city
                    ? styles.inputValid
                    : {}),
                }}
                placeholder="City name"
              />
              {errors.city && <div style={styles.error}>❌ {errors.city}</div>}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>State *</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="form-input"
                style={{
                  ...styles.input,
                  ...(errors.state
                    ? styles.inputError
                    : formTouched.state && !errors.state
                    ? styles.inputValid
                    : {}),
                }}
                placeholder="State"
              />
              {errors.state && (
                <div style={styles.error}>❌ {errors.state}</div>
              )}
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>ZIP Code *</label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleInputChange}
                className="form-input"
                style={{
                  ...styles.input,
                  ...(errors.zip
                    ? styles.inputError
                    : formTouched.zip && !errors.zip
                    ? styles.inputValid
                    : {}),
                }}
                placeholder="12345"
              />
              {errors.zip && <div style={styles.error}>❌ {errors.zip}</div>}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="MX">Mexico</option>
            </select>
          </div>

          <h3 style={{ marginTop: "30px" }}>💳 Payment Information</h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              style={styles.select}
            >
              <option value="credit">💳 Credit Card</option>
              <option value="debit">💳 Debit Card</option>
              <option value="paypal">📱 PayPal</option>
            </select>
          </div>

          {formData.paymentMethod !== "paypal" && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Card Number *</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{
                    ...styles.input,
                    ...(errors.cardNumber
                      ? styles.inputError
                      : formTouched.cardNumber && !errors.cardNumber
                      ? styles.inputValid
                      : {}),
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                />
                {errors.cardNumber && (
                  <div style={styles.error}>❌ {errors.cardNumber}</div>
                )}
              </div>

              <div style={styles.row}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Expiry Date *</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{
                      ...styles.input,
                      ...(errors.expiryDate
                        ? styles.inputError
                        : formTouched.expiryDate && !errors.expiryDate
                        ? styles.inputValid
                        : {}),
                    }}
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                  {errors.expiryDate && (
                    <div style={styles.error}>❌ {errors.expiryDate}</div>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    CVV *
                    <span
                      style={{ cursor: "pointer", marginLeft: "5px" }}
                      onMouseEnter={() => showTooltipHandler("cvv")}
                      onMouseLeave={() => hideTooltipHandler("cvv")}
                    >
                      ℹ️
                    </span>
                    {showTooltip.cvv && (
                      <div style={styles.tooltip}>
                        3-4 digit code on back of card
                      </div>
                    )}
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    className="form-input"
                    style={{
                      ...styles.input,
                      ...(errors.cvv
                        ? styles.inputError
                        : formTouched.cvv && !errors.cvv
                        ? styles.inputValid
                        : {}),
                    }}
                    placeholder="123"
                    maxLength="4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "35px",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "16px",
                    }}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                  {errors.cvv && (
                    <div style={styles.error}>❌ {errors.cvv}</div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Promo Code Section */}
          <div style={styles.formGroup}>
            <label style={styles.label}>🎟️ Promo Code (Optional)</label>
            <div style={styles.promoSection}>
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                style={styles.promoInput}
                placeholder="Enter promo code"
              />
              <button
                type="button"
                onClick={applyPromoCode}
                style={styles.secondaryButton}
              >
                Apply
              </button>
            </div>
            <small style={{ color: "#666", fontSize: "12px" }}>
              Try: SAVE10, WELCOME20, or FIRST15
            </small>
          </div>

          {/* Remember Me Checkbox */}
          <div style={styles.checkbox}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label
              htmlFor="rememberMe"
              style={{ margin: 0, fontWeight: "normal" }}
            >
              💾 Remember my information for future orders
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
            <button
              type="button"
              onClick={clearForm}
              style={styles.secondaryButton}
            >
              🗑️ Clear Form
            </button>

            <button
              type="submit"
              disabled={isSubmitting || Object.keys(errors).length > 0}
              style={{
                ...styles.button,
                ...(isSubmitting || Object.keys(errors).length > 0
                  ? styles.buttonDisabled
                  : {}),
                flex: 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <span style={styles.spinner}></span>
                  Processing Order...
                </>
              ) : (
                <>🛒 Place Order - ${(orderTotal - discount).toFixed(2)}</>
              )}
            </button>
          </div>

          {/* Form Status */}
          <div style={{ marginTop: "20px", textAlign: "center" }}>
            {Object.keys(errors).length > 0 && (
              <p style={{ color: "#e74c3c", fontSize: "14px" }}>
                ⚠️ Please fix {Object.keys(errors).length} error(s) before
                submitting
              </p>
            )}
            {Object.keys(errors).length === 0 &&
              completionPercentage === 100 && (
                <p style={{ color: "#27ae60", fontSize: "14px" }}>
                  ✅ Form is ready to submit!
                </p>
              )}
          </div>
        </form>

        {/* Confirmation Dialog */}
        {showConfirmDialog && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>🔐 Confirm Your Order</h3>
              <p>
                You're about to place an order for{" "}
                <strong>${(orderTotal - discount).toFixed(2)}</strong>
              </p>
              <p>
                Delivery to:{" "}
                <strong>
                  {formData.address}, {formData.city}, {formData.state}{" "}
                  {formData.zip}
                </strong>
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                This action cannot be undone. Please review your information
                before proceeding.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  style={styles.secondaryButton}
                >
                  ❌ Cancel
                </button>
                <button
                  onClick={confirmOrder}
                  style={{
                    ...styles.button,
                    width: "auto",
                    margin: 0,
                    padding: "12px 24px",
                  }}
                >
                  ✅ Confirm Order
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Badge */}
        <div
          style={{
            textAlign: "center",
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f0f8ff",
            borderRadius: "6px",
            border: "1px solid #bee5eb",
          }}
        >
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            🔒 Your payment information is secure and encrypted
          </p>
          <p style={{ margin: "5px 0 0 0", fontSize: "12px", color: "#888" }}>
            256-bit SSL encryption • PCI DSS compliant • Your data is protected
          </p>
        </div>

        {/* Additional Features Footer */}
      </div>
    </>
  );
};
export default Checkout;
