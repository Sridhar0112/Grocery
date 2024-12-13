import React, { useState, useEffect } from "react";
import axios from "axios"; // Ensure you have axios installed for making API requests
import "./Home.css";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSort, setSelectedSort] = useState("name"); // Default sorting by name
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  var navigation = useNavigate();
  useEffect(() => {
    // Fetch categories and items from the server
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try{
        const response = await axios.get("http://10.80.32.120:5000/products"); 
        const groupedCategories = response.data.reduce((acc, item) => {
          if (!acc[item.category]) {
            acc[item.category] = [];
          }
          acc[item.category].push(item);
          return acc;
      }, {});

        setCategories(Object.keys(groupedCategories).map(key => ({
          category: key,
          items: groupedCategories[key]
        })));
      }
      catch (error) {
        setError("Failed to load categories. Please try again later.");
        console.error("Error fetching categories:", error);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);
 

  const handleshopnow=()=>{
    
    navigation("/products")
  }

  const handleCategoryClick = (category) => {
    const selectedItems = categories.find(cat => cat.category === category).items;
    setSelectedCategory({ name: category, items: selectedItems });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

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
      <div className="hero-banner">
        <h1>Welcome to Fresh Grocery</h1>
        <p>Get your fresh groceries delivered at your door!</p>
        <button onClick={handleshopnow}>Shop Now</button>
      </div>

      <div className="categories">
        <h2>Shop by Categories</h2>
        <div className="category-list">
          {categories.map((category) => (
            <div
              key={category.category}
              className="category"
              onClick={() => handleCategoryClick(category.category)}
            >
              {category.category}
            </div>
          ))}
        </div>
      </div>

      {selectedCategory && (
        <div className="items-list">
          <h3>{selectedCategory.name} Items</h3>
          <div className="search-sort">
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <select value={selectedSort} onChange={handleSortChange}>
              <option value="name">Sort by Name</option>
              <option value="price">Sort by Price</option>
            </select>
          </div>

          {/* Display Loading Spinner */}
          {loading && <div className="loading-spinner">Loading...</div>}

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Item Grid */}
          <div className="items-grid">
            {sortedItems.length > 0 ? (
              sortedItems.map((item) => (
                <div key={item._id} className="item">
                  <img src={item.image} alt={item.name} />
                  <h4>{item.name}</h4>
                  <p>Price: ${item.price}</p>
                  <button className="add-to-cart">Add to Cart</button>
                </div>
              ))
            ) : (
              <p>No items found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
