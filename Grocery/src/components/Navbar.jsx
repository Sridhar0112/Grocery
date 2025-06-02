import { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  MapPin,
  Heart,
  Clock,
  HelpCircle,
} from "lucide-react";
import "./Navbar.css";
export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(3);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [showPromoBanner, setShowPromoBanner] = useState(true);

  const profileDropdownRef = useRef(null);
  const categoriesDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
      if (
        categoriesDropdownRef.current &&
        !categoriesDropdownRef.current.contains(event.target)
      ) {
        setIsCategoriesDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest(".mobile-menu-trigger")
      ) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Apply dark mode to body
  useEffect(() => {
    document.body.className = isDarkMode ? "dark-mode" : "light-mode";
  }, [isDarkMode]);

  const categories = [
    {
      name: "Fruits & Vegetables",
      icon: "🥕",
      subcategories: [
        "Fresh Fruits",
        "Fresh Vegetables",
        "Herbs",
        "Organic Produce",
      ],
    },
    {
      name: "Dairy & Eggs",
      icon: "🥛",
      subcategories: ["Milk", "Cheese", "Yogurt", "Eggs"],
    },
    {
      name: "Meat & Seafood",
      icon: "🥩",
      subcategories: ["Chicken", "Mutton", "Fish", "Prawns"],
    },
    {
      name: "Pantry Staples",
      icon: "🌾",
      subcategories: ["Rice", "Dal", "Oil", "Spices"],
    },
    {
      name: "Snacks & Beverages",
      icon: "🥤",
      subcategories: ["Chips", "Cookies", "Soft Drinks", "Juices"],
    },
    {
      name: "Personal Care",
      icon: "🧴",
      subcategories: ["Skincare", "Haircare", "Oral Care", "Bath & Body"],
    },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className={`navbar-container ${isDarkMode ? "dark" : "light"}`}>
      {/* Promo Banner */}
      {showPromoBanner && (
        <div className="promo-banner">
          <div className="promo-content">
            <Bell size={16} />
            <span>Free delivery on orders over ₹500 | Use code: FRESH50</span>
            <button
              className="promo-close"
              onClick={() => setShowPromoBanner(false)}
              aria-label="Close promo banner"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        className={`navbar ${isScrolled ? "scrolled" : ""}`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-brand">
            <a href="/" className="logo" aria-label="Fresh Grocery Home">
              <span className="logo-icon">🛒</span>
              <span className="logo-text">Fresh Grocery</span>
            </a>
          </div>

          {/* Location Selector */}
          <div className="location-selector">
            <MapPin size={16} />
            <span>Deliver to</span>
            <strong>Mumbai 400001</strong>
          </div>

          {/* Search Bar */}
          <form
            className="search-container"
            onSubmit={handleSearch}
            role="search"
          >
            <input
              type="search"
              placeholder="Search for products, brands, and more..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              aria-label="Search products"
            />
            <button type="submit" className="search-button" aria-label="Search">
              <Search size={20} />
            </button>
          </form>

          {/* Desktop Navigation Links */}
          <ul className="nav-links desktop-only" role="menubar">
            <li role="none">
              <a href="/" className="nav-link" role="menuitem">
                Home
              </a>
            </li>

            {/* Categories Dropdown */}
            <li
              className="dropdown-container"
              ref={categoriesDropdownRef}
              role="none"
            >
              <button
                className={`nav-link dropdown-trigger ${
                  isCategoriesDropdownOpen ? "active" : ""
                }`}
                onClick={() =>
                  setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)
                }
                aria-expanded={isCategoriesDropdownOpen}
                aria-haspopup="menu"
                role="menuitem"
              >
                Categories
                <ChevronDown
                  size={16}
                  className={`chevron ${
                    isCategoriesDropdownOpen ? "rotated" : ""
                  }`}
                />
              </button>

              {isCategoriesDropdownOpen && (
                <div className="mega-menu" role="menu">
                  <div className="mega-menu-content">
                    {categories.map((category, index) => (
                      <div key={index} className="category-section">
                        <div className="category-header">
                          <span className="category-icon">{category.icon}</span>
                          <h4>{category.name}</h4>
                        </div>
                        <ul className="subcategory-list">
                          {category.subcategories.map((sub, subIndex) => (
                            <li key={subIndex}>
                              <a
                                href={`/category/${sub
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")}`}
                                role="menuitem"
                              >
                                {sub}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </li>

            <li role="none">
              <a
                href="/offers"
                className="nav-link offers-link"
                role="menuitem"
              >
                <span className="offers-badge">🔥</span>
                Offers
              </a>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="navbar-actions">
            {/* Theme Toggle */}
            <button
              className="theme-toggle"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Wishlist */}
            <a href="/wishlist" className="action-button" aria-label="Wishlist">
              <Heart size={20} />
              <span className="desktop-only">Wishlist</span>
            </a>

            {/* Cart */}
            <a
              href="/cart"
              className="cart-button"
              aria-label={`Cart with ${cartCount} items`}
            >
              <div className="cart-icon-container">
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span
                    className="cart-badge"
                    aria-label={`${cartCount} items in cart`}
                  >
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </div>
              <span className="desktop-only">Cart</span>
            </a>

            {/* Profile */}
            {isAuthenticated ? (
              <div className="dropdown-container" ref={profileDropdownRef}>
                <button
                  className={`profile-button ${
                    isProfileDropdownOpen ? "active" : ""
                  }`}
                  onClick={() =>
                    setIsProfileDropdownOpen(!isProfileDropdownOpen)
                  }
                  aria-expanded={isProfileDropdownOpen}
                  aria-haspopup="menu"
                  aria-label="User account menu"
                >
                  <div className="profile-avatar">
                    <img
                      src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
                      alt="User avatar"
                      width="32"
                      height="32"
                    />
                  </div>
                  <span className="desktop-only">John</span>
                  <ChevronDown
                    size={14}
                    className={`chevron ${
                      isProfileDropdownOpen ? "rotated" : ""
                    }`}
                  />
                </button>

                {isProfileDropdownOpen && (
                  <div className="profile-dropdown" role="menu">
                    <div className="profile-header">
                      <div className="profile-avatar large">
                        <img
                          src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=face"
                          alt="User avatar"
                          width="48"
                          height="48"
                        />
                      </div>
                      <div>
                        <div className="profile-name">John Doe</div>
                        <div className="profile-email">john@example.com</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <a
                      href="/profile"
                      className="dropdown-item"
                      role="menuitem"
                    >
                      <User size={16} />
                      My Profile
                    </a>
                    <a href="/orders" className="dropdown-item" role="menuitem">
                      <Clock size={16} />
                      Order History
                    </a>
                    <a href="/help" className="dropdown-item" role="menuitem">
                      <HelpCircle size={16} />
                      Help & Support
                    </a>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout" role="menuitem">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons desktop-only">
                <button className="auth-button login">Login</button>
                <button className="auth-button signup">Sign Up</button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-trigger mobile-only"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mobile-menu" ref={mobileMenuRef} role="menu">
            <div className="mobile-menu-content">
              {!isAuthenticated && (
                <div className="mobile-auth">
                  <button className="auth-button login">Login</button>
                  <button className="auth-button signup">Sign Up</button>
                </div>
              )}

              <div className="mobile-nav-links">
                <a href="/" className="mobile-nav-link" role="menuitem">
                  Home
                </a>
                <a
                  href="/categories"
                  className="mobile-nav-link"
                  role="menuitem"
                >
                  All Categories
                </a>
                <a href="/offers" className="mobile-nav-link" role="menuitem">
                  Offers & Deals
                </a>
                <a href="/orders" className="mobile-nav-link" role="menuitem">
                  My Orders
                </a>
                <a href="/wishlist" className="mobile-nav-link" role="menuitem">
                  Wishlist
                </a>
                <a href="/help" className="mobile-nav-link" role="menuitem">
                  Help & Support
                </a>
              </div>

              {isAuthenticated && (
                <div className="mobile-user-section">
                  <div className="mobile-user-info">
                    <div className="profile-avatar">
                      <img
                        src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                        alt="User avatar"
                        width="40"
                        height="40"
                      />
                    </div>
                    <div>
                      <div className="profile-name">John Doe</div>
                      <div className="profile-email">john@example.com</div>
                    </div>
                  </div>
                  <button className="mobile-logout">Logout</button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};
