import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProductListing.css";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [AddtoCart, setAddtoCart] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [action, setAction] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newProduct, setNewProduct] = useState({ name: "", price: "", image: "" });
  const [updateProduct, setUpdateProduct] = useState({ id: "", name: "", price: "", image: "" });
  const [deleteProductId, setDeleteProductId] = useState("");

  const Units = {
    Beverages: "ml",
    Fruits: "Kg",
    Vegetables: "Kg",
    Dairy: "Ltrs",
    Snacks: "",
    Chocolates: "Piece",
  };

  const handleAddToCart = async (product, quantity1) => {
    if (AddtoCart) {
      await handleRemove(product.name);
    } else {
      try {
        const response = await axios.post("http://10.80.32.120:5000/cart", {
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          Quantity: quantity1,
        });
        console.log("Product added to cart:", response.data);
      } catch (error) {
        console.error("There was an error adding the product to the cart!", error);
      }
    }
    setAddtoCart(!AddtoCart);  // Toggle the AddtoCart state
  };
  

  const handleRemove = (name) => {
    axios
      .delete("http://10.80.32.120:5000/cart", { data: { name } })
      .catch((error) => console.error("Error removing item:", error));
  };

  const fetchProducts = () => {
    axios
      .get("http://10.80.32.120:5000/products")
      .then((response) => setProducts(response.data))
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      const categoryToUse = newCategory ? newCategory : category;
      const response = await axios.post("http://10.80.32.120:5000/products", {
        ...newProduct,
        category: categoryToUse,
      });
      console.log("Product added:", response.data);
      fetchProducts();
      setShowActionPopup(false);
      setNewProduct({ name: "", price: "", image: "" });
      setNewCategory("");
      setAction("");
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleUpdateProduct = async () => {
  try {
    const { id, name, price, image, category } = updateProduct;

    // Ensure all fields are present
    if (!id || !name || !price || !image || !category) {
      console.error("All fields are required");
      return;
    }

    console.log("Updating product with the following data:", {
      id, name, price, image, category
    });

    const response = await axios.put("http://10.80.32.120:5000/products", {
      id,
      name,
      price,
      image,
      category,
    });
    console.log("Product updated:", response.data);
    fetchProducts();
    setShowActionPopup(false);
    setUpdateProduct({ id: "", name: "", price: "", image: "" });
    setAction("");
  } catch (error) {
    console.error("Error updating product:", error);
  }
};

  

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(`http://10.80.32.120:5000/products`,{data:{id}});
      console.log("Product deleted:", response.data);
      fetchProducts();
      setShowActionPopup(false);
      setDeleteProductId("");
      setAction("");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category ? product.category === category : true)
  );

  return (
    <div className="product-listing">
      <h2>All Products</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-bar"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="category-filter"
        >
          <option value="">All Categories</option>
          <option value="Fruits">Fruits</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Dairy">Dairy</option>
          <option value="Chocolates">Chocolates</option>
          <option value="Beverages">Beverages</option>
          <option value="Snacks">Snacks</option>
          <option value="Personal Care">Personal Care</option>
        </select>
        <button style={{ width: "15%" }} onClick={() => setShowActionPopup(true)} className="add-product-button">
          Manage Products
        </button>
      </div>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p>${product.price}</p>
              <button onClick={() => setSelectedProduct(product)}>View Details</button>
             
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {selectedProduct && (
        <div className="modal">
          <div className="modal-content">
            <span
              className="close-button"
              onClick={() => {
                setSelectedProduct(null);
                setQuantity(0);
              }}
            >
              &times;
            </span>
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.image} alt={selectedProduct.name} />
            <p>Category: {selectedProduct.category}</p>
            <label>
              Quantity:
              <input
                type="number"
                pattern="[0-9]*"
                style={{ width: "20%", marginLeft: "10px" }}
                min="1"
                max="100"
                onChange={(e) => setQuantity(e.target.value)}
              />
              {Units[selectedProduct.category]}
            </label>
            <p>Price: {quantity === 0 ? `$ ${selectedProduct.price}` : ` $${selectedProduct.price * quantity}`}</p>
            <div style={{display:"flex",alignItems:"center",gap:"10px",flexDirection:"column"}}>
            <button className={AddtoCart && "cart-btn"} style={{width:"40%"}} onClick={() => handleAddToCart(selectedProduct, quantity)}>
              <img
                style={{ width: "25px", height: "25px", marginTop: "-2px" }}
                src="https://static-00.iconduck.com/assets.00/cart-icon-250x256-xgkwtkpu.png"
                alt="cart icon"
              />
              <span style={{ position: "relative", top: "-5px", left: "10px" }}>
                {AddtoCart ? "Added to Cart" : " Add to Cart"}
              </span>
            </button>
            <button style={{width:"40%"}}>Buy</button>
          </div>
        </div>
        </div>
      )}

      {showActionPopup && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setShowActionPopup(false)}>
              &times;
            </span>
            <h2>Manage Products</h2>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px", alignItems: "center" }}>
              <button style={{background:"green",width:"27%"}} onClick={() => setAction("add")}>Add Product</button>
              <button onClick={() => setAction("update")} style={{background:"yellow", width:"32%",color:"black"}}>Update Product</button>
              <button style={{width:"31%",background:"red"}} onClick={() => setAction("delete")}>Delete Product</button>
            </div>

            {action === "add" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
                <label>
                  Category:
                  <select
                    value={newCategory || category}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="category-select"
                  >
                    <option value="">Select or Add Category</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Chocolates">Chocolates</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Snacks">Snacks</option>
                    <option value="Personal Care">Personal Care</option>
                    <option value="New">Add New Category -></option>
                  </select>
                  {newCategory  && (
                    <>
                  <input
                      type="text"
                      placeholder="Enter New Category"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    /></>
                  )}
                </label>
                <label>
                  Name:
                  <input
                    type="text"
                    placeholder="Product Name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} />
                </label>
                <label>
                  Price:
                  <input
                    type="number"
                    placeholder="Product Price"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </label>
                <label>
                  Image URL:
                  <input
                    type="text"
                    placeholder="Product Image URL"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                  />
                </label>
                <button style={{ width: "27%",background:"green" }}  onClick={handleAddProduct}>Add Product</button>
              </div>
            )}
           {action === "update" && (
  <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
    <label style={{marginTop:"15px"}}>
      Select Product:
      <select
        value={updateProduct.id}
        onChange={(e) => {
          const selectedProduct = products.find((prod) => prod._id === e.target.value);
          setUpdateProduct({
            id: selectedProduct?._id || "",
            name: selectedProduct?.name || "",
            price: selectedProduct?.price || "",
            image: selectedProduct?.image || "",
            category: selectedProduct?.category || "",
          });
        }}
      >
        <option value="">Select a Product to Update</option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name}
          </option>
        ))}
      </select>
    </label>
    <label>
      Name:
      <input
        type="text"
        placeholder="Updated Product Name"
        value={updateProduct.name}
        onChange={(e) => setUpdateProduct({ ...updateProduct, name: e.target.value })}
      />
    </label>
    <label>
      Price:
      <input
        type="number"
        placeholder="Updated Product Price"
        value={updateProduct.price}
        onChange={(e) => setUpdateProduct({ ...updateProduct, price: e.target.value })}
      />
    </label>
    <label>
      Image URL:
      <input
        type="text"
        placeholder="Updated Product Image URL"
        value={updateProduct.image}
        onChange={(e) => setUpdateProduct({ ...updateProduct, image: e.target.value })}
      />
    </label>
    <button style={{ width: "32%",background:"yellow",color:"black" }} onClick={handleUpdateProduct}>
      Update Product
    </button>
  </div>
)}

{action === "delete" && (
  <div style={{ display: "flex", flexDirection: "column", gap: "20px", alignItems: "center" }}>
    <label style={{marginTop:"90px"}}>
      Select Product to Delete:
      <select
        value={deleteProductId}
        onChange={(e) => setDeleteProductId(e.target.value)}
        style={{marginLeft:"10px",padding:"5px"}}
      >
        <option style={{padding:"10px"}}  value="">Select a Product</option>
        {products.map((product) => (
          <option key={product._id} value={product._id}>
            {product.name}
          </option>
        ))}
      </select>
    </label>
    <button style={{ marginTop:"50px", width: "32%",background:"red" }} onClick={()=>handleDeleteProduct(deleteProductId)}>
      Delete Product
    </button>
  </div>
)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
