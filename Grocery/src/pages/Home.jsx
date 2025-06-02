import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
const Home = () => {
  // State management
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("name");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [email, setEmail] = useState("");
  const [subscriptionStatus, setSubscriptionStatus] = useState("");

  // Refs for carousels
  const categoryCarouselRef = useRef(null);
  const productCarouselRef = useRef(null);

  const navigate = useNavigate();

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      text: "Amazing fresh produce! The delivery is always on time and the quality is exceptional. I've been shopping here for 2 years now.",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b776?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 2,
      name: "Mike Chen",
      rating: 5,
      text: "Best grocery delivery service in town. The app is easy to use and the customer service is outstanding. Highly recommended!",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    },
    {
      id: 3,
      name: "Emily Davis",
      rating: 5,
      text: "Love the variety and freshness of products. The organic section is particularly impressive. Great value for money!",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face",
    },
  ];

  // Fetch categories and products
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulated API call - replace with actual axios call
        // const response = await axios.get("http://localhost:5000/products");

        // Mock data for demonstration
        const mockData = [
          {
            _id: "1",
            name: "Fresh Apples",
            category: "Fruits",
            price: 3.99,
            image:
              "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=300&h=200&fit=crop",
          },
          {
            _id: "2",
            name: "Organic Bananas",
            category: "Fruits",
            price: 2.49,
            image:
              "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=200&fit=crop",
          },
          {
            _id: "3",
            name: "Fresh Spinach",
            category: "Vegetables",
            price: 1.99,
            image:
              "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&h=200&fit=crop",
          },
          {
            _id: "4",
            name: "Organic Carrots",
            category: "Vegetables",
            price: 2.29,
            image:
              "https://images.unsplash.com/photo-1445282768818-728615cc910a?w=300&h=200&fit=crop",
          },
          {
            _id: "5",
            name: "Whole Milk",
            category: "Dairy",
            price: 4.29,
            image:
              "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=300&h=200&fit=crop",
          },
          {
            _id: "6",
            name: "Greek Yogurt",
            category: "Dairy",
            price: 5.99,
            image:
              "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=300&h=200&fit=crop",
          },
        ];

        const groupedCategories = mockData.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
        }, {});

        setCategories(
          Object.keys(groupedCategories).map((key) => ({
            category: key,
            items: groupedCategories[key],
            icon: getCategoryIcon(key),
          }))
        );
      } catch (error) {
        setError("Failed to load categories. Please try again later.");
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Scroll event listener for scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Testimonial carousel auto-rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Helper function to get category icons
  const getCategoryIcon = (category) => {
    const icons = {
      Fruits: "🍎",
      Vegetables: "🥕",
      Dairy: "🥛",
      Meat: "🥩",
      Bakery: "🍞",
      Seafood: "🐟",
    };
    return icons[category] || "🛒";
  };

  // Event handlers
  const handleShopNow = () => {
    navigate("/products");
  };

  const handleCategoryClick = (category) => {
    const selectedItems = categories.find(
      (cat) => cat.category === category
    ).items;
    setSelectedCategory({ name: category, items: selectedItems });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (email) {
      setSubscriptionStatus("Thank you for subscribing!");
      setEmail("");
      setTimeout(() => setSubscriptionStatus(""), 3000);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollCarousel = (ref, direction) => {
    const scrollAmount = 300;
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Filter and sort logic
  const filteredItems = selectedCategory
    ? selectedCategory.items.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const sortedItems = filteredItems.sort((a, b) => {
    if (selectedSort === "price") {
      return a.price - b.price;
    } else if (selectedSort === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Fresh Groceries Delivered Daily</h1>
            <p>Premium quality produce delivered straight to your doorstep</p>
            <button className="cta-button" onClick={handleShopNow}>
              Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2>Shop by Categories</h2>
          <div className="carousel-container">
            <button
              className="carousel-btn left"
              onClick={() => scrollCarousel(categoryCarouselRef, "left")}
            >
              &#8249;
            </button>
            <div className="category-carousel" ref={categoryCarouselRef}>
              {categories.map((category) => (
                <div
                  key={category.category}
                  className="category-card"
                  onClick={() => handleCategoryClick(category.category)}
                >
                  <div className="category-icon">{category.icon}</div>
                  <h3>{category.category}</h3>
                  <p>{category.items.length} items</p>
                </div>
              ))}
            </div>
            <button
              className="carousel-btn right"
              onClick={() => scrollCarousel(categoryCarouselRef, "right")}
            >
              &#8250;
            </button>
          </div>
        </div>
      </section>

      {/* Selected Category Products */}
      {selectedCategory && (
        <section className="products-section">
          <div className="container">
            <h3>{selectedCategory.name} Collection</h3>

            {/* Search and Sort Controls */}
            <div className="controls">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="search-input"
                />
              </div>
              <select
                value={selectedSort}
                onChange={handleSortChange}
                className="sort-select"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
              </select>
            </div>

            {/* Loading and Error States */}
            {loading && <div className="loading-spinner">Loading...</div>}
            {error && <div className="error-message">{error}</div>}

            {/* Products Carousel */}
            <div className="carousel-container">
              <button
                className="carousel-btn left"
                onClick={() => scrollCarousel(productCarouselRef, "left")}
              >
                &#8249;
              </button>
              <div className="product-carousel" ref={productCarouselRef}>
                {sortedItems.length > 0 ? (
                  sortedItems.map((item) => (
                    <div key={item._id} className="product-card">
                      <div className="product-image">
                        <img src={item.image} alt={item.name} loading="lazy" />
                        <div className="product-overlay">
                          <button className="quick-view">Quick View</button>
                        </div>
                      </div>
                      <div className="product-info">
                        <h4>{item.name}</h4>
                        <p className="price">${item.price}</p>
                        <button className="add-to-cart-btn">Add to Cart</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-items">No items found</p>
                )}
              </div>
              <button
                className="carousel-btn right"
                onClick={() => scrollCarousel(productCarouselRef, "right")}
              >
                &#8250;
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2>What Our Customers Say</h2>
          <div className="testimonial-carousel">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <div className="stars">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <span key={i}>⭐</span>
                    )
                  )}
                </div>
                <p>{testimonials[currentTestimonial].text}</p>
                <div className="testimonial-author">
                  <img
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                  />
                  <span>{testimonials[currentTestimonial].name}</span>
                </div>
              </div>
            </div>
            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${
                    index === currentTestimonial ? "active" : ""
                  }`}
                  onClick={() => setCurrentTestimonial(index)}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <h2>Stay Updated</h2>
          <p>Get the latest deals and fresh arrivals delivered to your inbox</p>
          <form onSubmit={handleEmailSubmit} className="newsletter-form">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit">Subscribe</button>
          </form>
          {subscriptionStatus && (
            <p className="subscription-status">{subscriptionStatus}</p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>Fresh Grocery</h3>
              <p>
                Your trusted partner for fresh, quality groceries delivered
                daily.
              </p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li>
                  <a href="/">Home</a>
                </li>
                <li>
                  <a href="/products">Products</a>
                </li>
                <li>
                  <a href="/cart">Cart</a>
                </li>
                <li>
                  <a href="/checkout">Checkout</a>
                </li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact Info</h4>
              <p>📞 (555) 123-4567</p>
              <p>📧 info@freshgrocery.com</p>
              <p>📍 123 Fresh Street, City, State 12345</p>
            </div>
            <div className="footer-section">
              <h4>Follow Us</h4>
              <div className="social-icons">
                <a href="#" aria-label="Facebook">
                  📘
                </a>
                <a href="#" aria-label="Twitter">
                  🐦
                </a>
                <a href="#" aria-label="Instagram">
                  📷
                </a>
                <a href="#" aria-label="LinkedIn">
                  💼
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Fresh Grocery. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button className="scroll-to-top" onClick={scrollToTop}>
          ↑
        </button>
      )}
    </div>
  );
};

export default Home;
