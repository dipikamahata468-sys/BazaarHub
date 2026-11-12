import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const loadFromStorage = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const seedProducts = [
  { id: 1, name: "Wireless Headphones", price: 1499, category: "Electronics", image: "photo-1505740420928-5e560c06d30e", description: "Premium wireless headphones with clear sound and comfortable design." },
  { id: 2, name: "Smart Watch", price: 2499, category: "Electronics", image: "photo-1523275335684-37898b6baf30", description: "Modern smartwatch with stylish design and smart features." },
  { id: 3, name: "Casual Backpack", price: 999, category: "Fashion", image: "photo-1553062407-98eeb64c6a62", description: "Comfortable backpack for everyday use." },
  { id: 4, name: "Running Shoes", price: 1999, category: "Fashion", image: "photo-1542291026-7eec264c27ff", description: "Lightweight running shoes for daily activities." },
  { id: 5, name: "Sunglasses", price: 799, category: "Fashion", image: "photo-1511499767150-a48a237f0083", description: "Stylish sunglasses for everyday fashion." },
  { id: 6, name: "Classic Watch", price: 1799, category: "Fashion", image: "photo-1524592094714-0f0654e20314", description: "Elegant watch with a timeless design." },
  { id: 7, name: "Camera", price: 15999, category: "Electronics", image: "photo-1516035069371-29a1b244cc32", description: "Capture beautiful moments with this camera." },
  { id: 8, name: "Bluetooth Speaker", price: 1299, category: "Electronics", image: "photo-1608043152269-423dbba4e7e1", description: "Portable speaker with powerful sound." },
  { id: 9, name: "Laptop", price: 45999, category: "Electronics", image: "photo-1496181133206-80ce9b88a853", description: "Powerful laptop for work and entertainment." },
  { id: 10, name: "Gaming Mouse", price: 899, category: "Electronics", image: "photo-1527814050087-3793815479db", description: "Comfortable gaming mouse with precise control." },
  { id: 11, name: "Desk Lamp", price: 699, category: "Home", image: "photo-1507473885765-e6ed057f782c", description: "Modern lamp for your workspace." },
  { id: 12, name: "Coffee Mug", price: 299, category: "Home", image: "photo-1514228742587-6b1558fcca3d", description: "Beautiful ceramic coffee mug." },
  { id: 13, name: "Wall Clock", price: 899, category: "Home", image: "photo-1563861826100-9cb868fdbe1c", description: "Elegant wall clock for your home." },
  { id: 14, name: "Plant Pot", price: 499, category: "Home", image: "photo-1485955900006-10f4d324d411", description: "Decorative plant pot for your room." },
  { id: 15, name: "Cushion", price: 399, category: "Home", image: "photo-1584100936595-c0654b55a2e2", description: "Soft decorative cushion." },
  { id: 16, name: "Handbag", price: 1499, category: "Fashion", image: "photo-1584917865442-de89df76afd3", description: "Stylish handbag for everyday use." },
  { id: 17, name: "Sneakers", price: 2199, category: "Fashion", image: "photo-1600185365483-26d7a4cc7519", description: "Comfortable and fashionable sneakers." },
  { id: 18, name: "Perfume", price: 1199, category: "Beauty", image: "photo-1541643600914-78b084683601", description: "Refreshing fragrance for daily use." },
  { id: 19, name: "Skincare Kit", price: 999, category: "Beauty", image: "photo-1556229010-6c3f2c9ca5f8", description: "A skincare kit for your daily routine." },
  { id: 20, name: "Makeup Kit", price: 1499, category: "Beauty", image: "photo-1596462502278-27bfdc403348", description: "Essential makeup products in one box." },
  { id: 21, name: "Face Cream", price: 499, category: "Beauty", image: "photo-1608248543803-ba4f8c70ae0b", description: "Daily skincare cream." },
  { id: 22, name: "Water Bottle", price: 399, category: "Home", image: "photo-1602143407151-7111542de6e8", description: "Reusable water bottle for everyday use." },
  { id: 23, name: "Sofa Decor", price: 1299, category: "Home", image: "photo-1555041469-a586c61ea9bc", description: "Beautiful decor for your living room." },
  { id: 24, name: "Keyboard", price: 1199, category: "Electronics", image: "photo-1587829741301-dc798b83add3", description: "Comfortable keyboard for everyday typing." },
  { id: 25, name: "Mobile Phone", price: 18999, category: "Electronics", image: "photo-1511707171634-5f897ff02aa9", description: "Modern smartphone with a stylish design." },
  { id: 26, name: "T-Shirt", price: 599, category: "Fashion", image: "photo-1521572163474-6864f9cf17ab", description: "Comfortable casual cotton T-shirt." },
  { id: 27, name: "Denim Jacket", price: 1799, category: "Fashion", image: "photo-1543076447-215ad9ba6923", description: "Classic denim jacket." },
  { id: 28, name: "Lipstick", price: 399, category: "Beauty", image: "photo-1586495777744-4413f21062fa", description: "Beautiful lipstick for everyday looks." },
  { id: 29, name: "Hair Dryer", price: 1299, category: "Beauty", image: "photo-1522338242992-e1a54906a8da", description: "Easy-to-use hair styling dryer." },
  { id: 30, name: "Table Decor", price: 799, category: "Home", image: "photo-1490312278390-ab64016e0aa9", description: "Modern decorative item for your home." }
];

const imageUrl = (image) => {
  if (!image) return "https://placehold.co/700x500/fff0f6/d63384?text=BazaarHub";
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return `https://images.unsplash.com/${image}?auto=format&fit=crop&w=700&q=85`;
};

const money = (amount) => `₹${Number(amount || 0).toLocaleString("en-IN")}`;

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [cart, setCart] = useState(() => loadFromStorage("bazaarhub_cart", []));
  const [orders, setOrders] = useState(() => loadFromStorage("bazaarhub_orders", []));
  const [reviews, setReviews] = useState(() => loadFromStorage("bazaarhub_reviews", []));
  const [wishlist, setWishlist] = useState(() => loadFromStorage("bazaarhub_wishlist", []));
  const [sellerProducts, setSellerProducts] = useState(() => loadFromStorage("bazaarhub_seller_products", []));
  const [sellerAccounts, setSellerAccounts] = useState(() => loadFromStorage("bazaarhub_seller_accounts", []));
  const [currentSeller, setCurrentSeller] = useState(() => loadFromStorage("bazaarhub_current_seller", null));

  const [hiddenSeedProducts, setHiddenSeedProducts] = useState(() => loadFromStorage("bazaarhub_hidden_products", []));

  const [isAdmin, setIsAdmin] = useState(() => loadFromStorage("bazaarhub_admin_logged_in", false));
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthError, setAdminAuthError] = useState("");
  const [adminTab, setAdminTab] = useState("overview");

  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [payment, setPayment] = useState("COD");
  const [page, setPage] = useState("shop");

  const [showSellerAuth, setShowSellerAuth] = useState(false);
  const [sellerAuthMode, setSellerAuthMode] = useState("login");
  const [sellerEmail, setSellerEmail] = useState("");
  const [sellerPassword, setSellerPassword] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerBusiness, setSellerBusiness] = useState("");
  const [sellerAuthError, setSellerAuthError] = useState("");

  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: "",
    category: "Electronics",
    image: "",
    description: "",
    stock: "10"
  });

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: ""
  });

  const allProducts = useMemo(() => {
    const visibleSeedProducts = seedProducts.filter(
      (product) => !hiddenSeedProducts.includes(product.id)
    );

    const activeSellerProducts = sellerProducts.filter((product) => {
      const seller = sellerAccounts.find((account) => account.id === product.sellerId);
      return !seller || seller.status !== "Suspended";
    });

    return [...visibleSeedProducts, ...activeSellerProducts];
  }, [sellerProducts, sellerAccounts, hiddenSeedProducts]);

  const filteredProducts = allProducts.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => localStorage.setItem("bazaarhub_cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("bazaarhub_orders", JSON.stringify(orders)), [orders]);
  useEffect(() => localStorage.setItem("bazaarhub_reviews", JSON.stringify(reviews)), [reviews]);
  useEffect(() => localStorage.setItem("bazaarhub_wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("bazaarhub_seller_products", JSON.stringify(sellerProducts)), [sellerProducts]);
  useEffect(() => localStorage.setItem("bazaarhub_seller_accounts", JSON.stringify(sellerAccounts)), [sellerAccounts]);
  useEffect(() => localStorage.setItem("bazaarhub_current_seller", JSON.stringify(currentSeller)), [currentSeller]);
  useEffect(() => localStorage.setItem("bazaarhub_hidden_products", JSON.stringify(hiddenSeedProducts)), [hiddenSeedProducts]);
  useEffect(() => localStorage.setItem("bazaarhub_admin_logged_in", JSON.stringify(isAdmin)), [isAdmin]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlist.length;
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal === 0 || subtotal >= 999 ? 0 : 49;
  const total = subtotal + delivery;

  const productReviews = (productId) => reviews.filter((review) => review.productId === productId);

  const averageRating = (productId) => {
    const list = productReviews(productId);
    return list.length
      ? (list.reduce((sum, review) => sum + review.rating, 0) / list.length).toFixed(1)
      : null;
  };

  const renderStars = (rating) => (
    <span className="rating-stars">
      {"★".repeat(Math.round(rating))}
      {"☆".repeat(5 - Math.round(rating))}
    </span>
  );

  const submitReview = (e) => {
    e.preventDefault();
    if (!selectedProduct || !reviewName.trim() || !reviewText.trim()) return;

    setReviews((old) => [{
      id: Date.now(),
      productId: selectedProduct.id,
      name: reviewName.trim(),
      rating: reviewRating,
      text: reviewText.trim(),
      date: new Date().toLocaleDateString()
    }, ...old]);

    setReviewName("");
    setReviewText("");
    setReviewRating(5);
  };

  const isWishlisted = (id) => wishlist.some((item) => item.id === id);

  const toggleWishlist = (product) => setWishlist((old) =>
    old.some((item) => item.id === product.id)
      ? old.filter((item) => item.id !== product.id)
      : [...old, product]
  );

  const removeFromWishlist = (id) => setWishlist((old) =>
    old.filter((item) => item.id !== id)
  );

  const addToCart = (product) => setCart((old) => {
    const found = old.find((item) => item.id === product.id);

    return found
      ? old.map((item) => item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item)
      : [...old, { ...product, quantity: 1 }];
  });

  const updateQuantity = (id, amount) => setCart((old) =>
    old.map((item) => item.id === id
      ? { ...item, quantity: item.quantity + amount }
      : item
    ).filter((item) => item.quantity > 0)
  );

  const removeFromCart = (id) => setCart((old) =>
    old.filter((item) => item.id !== id)
  );

  const buyNow = (product) => {
    addToCart(product);
    setSelectedProduct(null);
    setShowCart(true);
  };

  const moveWishlistToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
  };

  const startCheckout = () => {
    if (!cart.length) return;
    setShowCart(false);
    setShowCheckout(true);
  };

  const placeOrder = (e) => {
    e.preventDefault();
    if (!cart.length) return;

    const newOrder = {
      id: Date.now(),
      customer: { ...customer },
      items: [...cart],
      total,
      payment,
      date: new Date().toLocaleString(),
      status: "Confirmed"
    };

    setOrders((old) => [newOrder, ...old]);
    setCart([]);
    setShowCheckout(false);
    setOrderPlaced(true);

    setCustomer({
      name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      pincode: ""
    });

    setPayment("COD");
  };

  const updateCustomer = (e) => {
    setCustomer((old) => ({
      ...old,
      [e.target.name]: e.target.value
    }));
  };

  // SELLER AUTHENTICATION

  const openSellerLogin = () => {
    setSellerAuthMode("login");
    setSellerAuthError("");
    setShowSellerAuth(true);
  };

  const handleSellerAuth = (e) => {
    e.preventDefault();

    const email = sellerEmail.trim().toLowerCase();

    if (sellerAuthMode === "register") {
      if (sellerAccounts.some((account) => account.email === email)) {
        setSellerAuthError("An account with this email already exists.");
        return;
      }

      const account = {
        id: `seller_${Date.now()}`,
        name: sellerName.trim(),
        business: sellerBusiness.trim(),
        email,
        password: sellerPassword,
        status: "Active",
        joinedAt: new Date().toLocaleDateString()
      };

      setSellerAccounts((old) => [...old, account]);

      setCurrentSeller({
        id: account.id,
        name: account.name,
        business: account.business,
        email: account.email
      });

      setShowSellerAuth(false);
      setPage("seller");
      setSellerPassword("");
      return;
    }

    const account = sellerAccounts.find(
      (item) => item.email === email && item.password === sellerPassword
    );

    if (!account) {
      setSellerAuthError("Invalid email or password. Please check your details.");
      return;
    }

    if (account.status === "Suspended") {
      setSellerAuthError("Your seller account is suspended. Please contact admin.");
      return;
    }

    setCurrentSeller({
      id: account.id,
      name: account.name,
      business: account.business,
      email: account.email
    });

    setShowSellerAuth(false);
    setPage("seller");
    setSellerPassword("");
  };

  const sellerLogout = () => {
    setCurrentSeller(null);
    setPage("shop");
  };

  // SELLER PRODUCT MANAGEMENT

  const resetProductForm = () => {
    setProductForm({
      name: "",
      price: "",
      category: "Electronics",
      image: "",
      description: "",
      stock: "10"
    });

    setEditingProductId(null);
    setProductFormOpen(false);
  };

  const startEditProduct = (product) => {
    setProductForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      image: product.image,
      description: product.description,
      stock: String(product.stock ?? 0)
    });

    setEditingProductId(product.id);
    setProductFormOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const saveSellerProduct = (e) => {
    e.preventDefault();
    if (!currentSeller) return;

    const image = productForm.image.trim();

    const productData = {
      id: editingProductId || `seller_product_${Date.now()}`,
      name: productForm.name.trim(),
      price: Number(productForm.price),
      category: productForm.category,
      image,
      description: productForm.description.trim(),
      stock: Math.max(0, Number(productForm.stock)),
      sellerId: currentSeller.id,
      sellerName: currentSeller.business || currentSeller.name
    };

    if (editingProductId) {
      setSellerProducts((old) => old.map((item) =>
        item.id === editingProductId && item.sellerId === currentSeller.id
          ? productData
          : item
      ));
    } else {
      setSellerProducts((old) => [productData, ...old]);
    }

    resetProductForm();
  };

  const deleteSellerProduct = (id) => {
    if (window.confirm("Delete this product from your store?")) {
      setSellerProducts((old) =>
        old.filter((item) => item.id !== id || item.sellerId !== currentSeller?.id)
      );

      setWishlist((old) => old.filter((item) => item.id !== id));
      setCart((old) => old.filter((item) => item.id !== id));
    }
  };

  const updateStock = (id, amount) => setSellerProducts((old) =>
    old.map((item) =>
      item.id === id && item.sellerId === currentSeller?.id
        ? { ...item, stock: Math.max(0, Number(item.stock || 0) + amount) }
        : item
    )
  );

  const myProducts = sellerProducts.filter(
    (item) => item.sellerId === currentSeller?.id
  );

  const myProductIds = myProducts.map((item) => item.id);

  const myOrderEntries = orders.flatMap((order) => {
    const matchingItems = order.items.filter(
      (item) => myProductIds.includes(item.id)
    );

    return matchingItems.length
      ? [{ ...order, sellerItems: matchingItems }]
      : [];
  });

  const sellerRevenue = myOrderEntries.reduce((sum, order) =>
    sum + order.sellerItems.reduce(
      (sub, item) => sub + item.price * item.quantity,
      0
    ), 0
  );

  const sellerUnits = myOrderEntries.reduce((sum, order) =>
    sum + order.sellerItems.reduce(
      (sub, item) => sub + item.quantity,
      0
    ), 0
  );

  // ADMIN AUTHENTICATION

  const openAdminLogin = () => {
    setAdminEmail("");
    setAdminPassword("");
    setAdminAuthError("");
    setShowAdminAuth(true);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();

    if (
      adminEmail.trim().toLowerCase() === "admin@bazaarhub.com" &&
      adminPassword === "admin123"
    ) {
      setIsAdmin(true);
      setShowAdminAuth(false);
      setPage("admin");
      setAdminTab("overview");
      setAdminAuthError("");
      return;
    }

    setAdminAuthError("Incorrect admin email or password.");
  };

  const adminLogout = () => {
    setIsAdmin(false);
    setPage("shop");
    setAdminTab("overview");
  };

  // ADMIN STATISTICS

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalUnitsSold = orders.reduce(
    (sum, order) => sum + order.items.reduce(
      (itemSum, item) => itemSum + Number(item.quantity || 0),
      0
    ),
    0
  );

  const adminProducts = [
    ...seedProducts.filter((product) => !hiddenSeedProducts.includes(product.id)),
    ...sellerProducts
  ];

  const activeSellers = sellerAccounts.filter(
    (seller) => seller.status !== "Suspended"
  );

  const suspendedSellers = sellerAccounts.filter(
    (seller) => seller.status === "Suspended"
  );

  const categorySales = ["Electronics", "Fashion", "Home", "Beauty"].map((cat) => {
    const amount = orders.reduce((sum, order) =>
      sum + order.items.reduce((itemSum, item) =>
        itemSum + (
          item.category === cat
            ? Number(item.price || 0) * Number(item.quantity || 0)
            : 0
        ), 0
      ), 0
    );

    return { category: cat, amount };
  });

  const highestCategory = [...categorySales].sort(
    (a, b) => b.amount - a.amount
  )[0];

  // ADMIN SELLER ACTIONS

  const toggleSellerStatus = (sellerId) => {
    const seller = sellerAccounts.find((item) => item.id === sellerId);
    if (!seller) return;

    const nextStatus = seller.status === "Suspended" ? "Active" : "Suspended";

    if (
      nextStatus === "Suspended" &&
      !window.confirm(`Suspend ${seller.business || seller.name}?`)
    ) return;

    setSellerAccounts((old) => old.map((item) =>
      item.id === sellerId
        ? { ...item, status: nextStatus }
        : item
    ));

    if (currentSeller?.id === sellerId && nextStatus === "Suspended") {
      setCurrentSeller(null);
      setPage("shop");
    }
  };

  const deleteSellerAccount = (sellerId) => {
    const seller = sellerAccounts.find((item) => item.id === sellerId);
    if (!seller) return;

    if (!window.confirm(`Permanently delete seller "${seller.business || seller.name}" and their listed products?`)) {
      return;
    }

    const sellerProductIds = sellerProducts
      .filter((product) => product.sellerId === sellerId)
      .map((product) => product.id);

    setSellerAccounts((old) => old.filter((item) => item.id !== sellerId));
    setSellerProducts((old) => old.filter((item) => item.sellerId !== sellerId));
    setCart((old) => old.filter((item) => !sellerProductIds.includes(item.id)));
    setWishlist((old) => old.filter((item) => !sellerProductIds.includes(item.id)));

    if (currentSeller?.id === sellerId) {
      setCurrentSeller(null);
      setPage("shop");
    }
  };

  // ADMIN PRODUCT ACTIONS

  const adminDeleteProduct = (product) => {
    if (!window.confirm(`Remove "${product.name}" from BazaarHub?`)) return;

    if (product.sellerId) {
      setSellerProducts((old) =>
        old.filter((item) => item.id !== product.id)
      );
    } else {
      setHiddenSeedProducts((old) =>
        old.includes(product.id) ? old : [...old, product.id]
      );
    }

    setCart((old) => old.filter((item) => item.id !== product.id));
    setWishlist((old) => old.filter((item) => item.id !== product.id));
  };

  const restoreSeedProducts = () => {
    if (!hiddenSeedProducts.length) return;

    if (window.confirm("Restore all removed demo products?")) {
      setHiddenSeedProducts([]);
    }
  };

  // ADMIN ORDER ACTIONS

  const updateOrderStatus = (orderId, status) => {
    setOrders((old) => old.map((order) =>
      order.id === orderId
        ? { ...order, status }
        : order
    ));
  };

  // RECENT ACTIVITY

  const recentOrders = [...orders].slice(0, 5);
  const recentSellers = [...sellerAccounts].slice(-5).reverse();

  return (
    <div className="app">
      <nav className="navbar">
        <button
          className="logo logo-button"
          onClick={() => {
            setPage("shop");
            setShowAdminAuth(false);
          }}
        >
          Bazaar<span>Hub</span>
        </button>

        {page === "shop" ? (
          <>
            <div className="nav-links">
              <a href="#home">Home</a>
              <a href="#products">Products</a>
              <a href="#footer">Contact</a>
            </div>

            <div className="nav-actions">
              <button
                className="wishlist-nav-button"
                onClick={() => setShowWishlist(true)}
              >
                ♡ Wishlist ({wishlistCount})
              </button>

              <button
                className="my-orders-button"
                onClick={() => setShowOrders(true)}
              >
                My Orders
              </button>

              <button
                className="cart-button"
                onClick={() => setShowCart(true)}
              >
                🛒 Cart ({cartCount})
              </button>

              <button
                className="seller-login-button"
                onClick={currentSeller ? () => setPage("seller") : openSellerLogin}
              >
                <span>♙</span>
                {currentSeller ? "Seller Dashboard" : "Seller Login"}
              </button>

              <button
                className="admin-nav-button"
                onClick={openAdminLogin}
              >
                Admin
              </button>
            </div>
          </>
        ) : page === "seller" ? (
          <div className="nav-actions seller-nav-actions">
            <span className="seller-welcome">Hi, {currentSeller?.name}</span>
            <button className="my-orders-button" onClick={() => setPage("shop")}>
              View Store
            </button>
            <button className="seller-login-button" onClick={sellerLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="nav-actions seller-nav-actions">
            <span className="seller-welcome">Administrator</span>
            <button className="my-orders-button" onClick={() => setPage("shop")}>
              View Store
            </button>
            <button className="seller-login-button" onClick={adminLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* STOREFRONT */}

      {page === "shop" && (
        <>
          <section className="hero" id="home">
            <div className="hero-content">
              <span className="small-heading">WELCOME TO BAZAARHUB</span>
              <h1>Shopping Made <span>Beautiful</span></h1>
              <p>
                Discover amazing products, enjoy great prices and experience
                a better way to shop.
              </p>
              <button
                onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}
              >
                Explore Products →
              </button>
            </div>
            <div className="hero-decoration">🛍️</div>
          </section>

          <section className="section" id="products">
            <div className="section-heading">
              <span className="small-heading">OUR COLLECTION</span>
              <h2>Explore Our <span>Products</span></h2>
              <p>Find something special for yourself.</p>
            </div>

            <div className="search-container">
              <input
                placeholder="Search your favourite products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="category-filter">
              {["All", "Electronics", "Fashion", "Home", "Beauty"].map((item) => (
                <button
                  key={item}
                  className={category === item ? "active" : ""}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="product-grid">
              {filteredProducts.length ? filteredProducts.map((product) => (
                <div className="product-card" key={product.id}>
                  <div
                    className="product-image"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img src={imageUrl(product.image)} alt={product.name} />
                    <span className="product-category">{product.category}</span>

                    <button
                      className={`wishlist-heart ${isWishlisted(product.id) ? "wishlisted" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                    >
                      {isWishlisted(product.id) ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="product-info">
                    <h3>{product.name}</h3>

                    <div className="product-rating">
                      {averageRating(product.id) ? (
                        <>
                          {renderStars(Number(averageRating(product.id)))}
                          <span className="rating-count">
                            {averageRating(product.id)} ({productReviews(product.id).length})
                          </span>
                        </>
                      ) : (
                        <span className="rating-count">No reviews yet</span>
                      )}
                    </div>

                    <p>{product.description}</p>
                    <div className="product-price">{money(product.price)}</div>

                    <div className="product-buttons">
                      <button className="add-cart-btn" onClick={() => addToCart(product)}>
                        + Add to Cart
                      </button>
                      <button className="buy-now-btn" onClick={() => setSelectedProduct(product)}>
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="no-products">No products found.</div>
              )}
            </div>
          </section>

          <footer className="footer" id="footer">
            <h2>BazaarHub</h2>
            <p>Shopping made beautiful. Discover, explore and shop your favourites.</p>
            <div className="footer-bottom">
              © 2026 BazaarHub. All Rights Reserved.
            </div>
          </footer>
        </>
      )}

      {/* SELLER DASHBOARD */}

      {page === "seller" && currentSeller && (
        <main className="seller-dashboard">
          <div className="seller-dashboard-heading">
            <div>
              <span className="small-heading">SELLER WORKSPACE</span>
              <h1>Seller <span>Dashboard</span></h1>
              <p>Manage your products, inventory and customer orders in one place.</p>
            </div>

            <button
              className="seller-primary-button"
              onClick={() => {
                resetProductForm();
                setProductFormOpen(true);
              }}
            >
              ＋ Add New Product
            </button>
          </div>

          <div className="seller-profile-strip">
            <div className="seller-avatar">
              {(currentSeller?.name || "S").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{currentSeller?.business || currentSeller?.name}</strong>
              <p>{currentSeller?.email} · Seller account</p>
            </div>

            <span className="seller-account-status">● Active Seller</span>
          </div>

          <div className="seller-stats-grid">
            <div className="seller-stat-card">
              <span className="stat-icon">▣</span>
              <p>Total Products</p>
              <strong>{myProducts.length}</strong>
              <small>Products in your store</small>
            </div>

            <div className="seller-stat-card">
              <span className="stat-icon">▤</span>
              <p>Orders Received</p>
              <strong>{myOrderEntries.length}</strong>
              <small>{sellerUnits} item(s) ordered</small>
            </div>

            <div className="seller-stat-card">
              <span className="stat-icon">₹</span>
              <p>Total Revenue</p>
              <strong>{money(sellerRevenue)}</strong>
              <small>Based on demo orders</small>
            </div>

            <div className="seller-stat-card">
              <span className="stat-icon">▦</span>
              <p>Units in Stock</p>
              <strong>{myProducts.reduce((sum, item) => sum + Number(item.stock || 0), 0)}</strong>
              <small>Across your products</small>
            </div>
          </div>

          {productFormOpen && (
            <section className="seller-panel seller-form-panel">
              <div className="seller-panel-heading">
                <div>
                  <span className="small-heading">
                    {editingProductId ? "UPDATE LISTING" : "NEW LISTING"}
                  </span>
                  <h2>{editingProductId ? "Edit Product" : "Add a Product"}</h2>
                </div>
                <button className="seller-close-button" onClick={resetProductForm}>×</button>
              </div>

              <form className="seller-product-form" onSubmit={saveSellerProduct}>
                <label>
                  Product Name
                  <input
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Premium Backpack"
                    required
                  />
                </label>

                <div className="seller-form-row">
                  <label>
                    Price (₹)
                    <input
                      type="number"
                      min="1"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="Enter price"
                      required
                    />
                  </label>

                  <label>
                    Category
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      <option>Electronics</option>
                      <option>Fashion</option>
                      <option>Home</option>
                      <option>Beauty</option>
                    </select>
                  </label>

                  <label>
                    Opening Stock
                    <input
                      type="number"
                      min="0"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      required
                    />
                  </label>
                </div>

                <label>
                  Product Image URL or Unsplash Photo ID
                  <input
                    value={productForm.image}
                    onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                    placeholder="Paste image URL or photo ID"
                    required
                  />
                </label>

                <label>
                  Product Description
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe your product..."
                    required
                  />
                </label>

                {productForm.image && (
                  <div className="seller-image-preview">
                    <img src={imageUrl(productForm.image)} alt="Product preview" />
                    <span>Image preview</span>
                  </div>
                )}

                <div className="seller-form-actions">
                  <button type="button" className="seller-secondary-button" onClick={resetProductForm}>
                    Cancel
                  </button>
                  <button type="submit" className="seller-primary-button">
                    {editingProductId ? "Save Changes" : "Publish Product"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="seller-panel">
            <div className="seller-panel-heading">
              <div>
                <span className="small-heading">YOUR CATALOG</span>
                <h2>Product Management</h2>
                <p>Only you can edit or remove products listed from this seller account.</p>
              </div>

              <button
                className="seller-secondary-button"
                onClick={() => {
                  resetProductForm();
                  setProductFormOpen(true);
                }}
              >
                ＋ Add Product
              </button>
            </div>

            {myProducts.length === 0 ? (
              <div className="seller-empty-state">
                <div>▣</div>
                <h3>Your store is waiting for its first product</h3>
                <p>Add a product to make it visible on the BazaarHub homepage.</p>
                <button className="seller-primary-button" onClick={() => setProductFormOpen(true)}>
                  Add Your First Product
                </button>
              </div>
            ) : (
              <div className="seller-table-wrap">
                <table className="seller-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Listing</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {myProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div className="seller-product-cell">
                            <img src={imageUrl(product.image)} alt={product.name} />
                            <div>
                              <strong>{product.name}</strong>
                              <small>{product.category}</small>
                            </div>
                          </div>
                        </td>

                        <td>{money(product.price)}</td>

                        <td>
                          <div className="stock-control">
                            <button onClick={() => updateStock(product.id, -1)} disabled={!product.stock}>−</button>
                            <strong>{product.stock ?? 0}</strong>
                            <button onClick={() => updateStock(product.id, 1)}>＋</button>
                          </div>
                        </td>

                        <td>
                          <span className={(product.stock ?? 0) > 0 ? "stock-badge in-stock" : "stock-badge out-stock"}>
                            {(product.stock ?? 0) > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>

                        <td>
                          <div className="seller-row-actions">
                            <button onClick={() => startEditProduct(product)}>Edit</button>
                            <button onClick={() => deleteSellerProduct(product.id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="seller-panel">
            <div className="seller-panel-heading">
              <div>
                <span className="small-heading">CUSTOMER ACTIVITY</span>
                <h2>Recent Orders</h2>
                <p>Orders containing products from your store.</p>
              </div>
              <span className="seller-order-count">{myOrderEntries.length} orders</span>
            </div>

            {myOrderEntries.length === 0 ? (
              <div className="seller-empty-state compact">
                <div>▤</div>
                <h3>No orders received yet</h3>
                <p>When customers buy your products, order details will appear here.</p>
              </div>
            ) : myOrderEntries.map((order) => (
              <div className="seller-order-card" key={`${order.id}-${currentSeller.id}`}>
                <div className="seller-order-top">
                  <div>
                    <strong>Order #{String(order.id).slice(-6)}</strong>
                    <small>{order.date}</small>
                  </div>
                  <span className="order-status">{order.status || "Confirmed"}</span>
                </div>

                <div className="seller-order-customer">
                  <strong>{order.customer.name}</strong>
                  <span>{order.customer.phone} · {order.customer.city}</span>
                  <small>{order.customer.address}, {order.customer.pincode}</small>
                </div>

                <div className="seller-order-items">
                  {order.sellerItems.map((item) => (
                    <div key={item.id}>
                      <span>{item.name} × {item.quantity}</span>
                      <strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>

                <div className="seller-order-total">
                  <span>Payment: {order.payment}</span>
                  <strong>
                    {money(order.sellerItems.reduce(
                      (sum, item) => sum + item.price * item.quantity, 0
                    ))}
                  </strong>
                </div>
              </div>
            ))}
          </section>

          <p className="seller-demo-note">
            Demo dashboard: data is saved in this browser using Local Storage.
            Login, orders and payments are not connected to a real server or payment gateway.
          </p>
        </main>
      )}

      {/* ADMIN DASHBOARD */}

      {page === "admin" && isAdmin && (
        <main className="admin-dashboard">
          <div className="admin-heading">
            <div>
              <span className="small-heading">BAZAARHUB CONTROL CENTER</span>
              <h1>Admin <span>Dashboard</span></h1>
              <p>Monitor your marketplace, sellers, products and customer orders.</p>
            </div>
            <div className="admin-heading-label">● Admin Access</div>
          </div>

          <div className="admin-tabs">
            <button className={adminTab === "overview" ? "active" : ""} onClick={() => setAdminTab("overview")}>Overview</button>
            <button className={adminTab === "sellers" ? "active" : ""} onClick={() => setAdminTab("sellers")}>Sellers ({sellerAccounts.length})</button>
            <button className={adminTab === "products" ? "active" : ""} onClick={() => setAdminTab("products")}>Products ({adminProducts.length})</button>
            <button className={adminTab === "orders" ? "active" : ""} onClick={() => setAdminTab("orders")}>Orders ({orders.length})</button>
            <button className={adminTab === "analytics" ? "active" : ""} onClick={() => setAdminTab("analytics")}>Analytics</button>
          </div>

          {adminTab === "overview" && (
            <>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-top"><span>Total Sellers</span><span className="admin-stat-icon">♙</span></div>
                  <strong>{sellerAccounts.length}</strong>
                  <small>{activeSellers.length} active · {suspendedSellers.length} suspended</small>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top"><span>Total Products</span><span className="admin-stat-icon">▣</span></div>
                  <strong>{adminProducts.length}</strong>
                  <small>Across the marketplace</small>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top"><span>Total Orders</span><span className="admin-stat-icon">▤</span></div>
                  <strong>{orders.length}</strong>
                  <small>{totalUnitsSold} units sold</small>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top"><span>Total Revenue</span><span className="admin-stat-icon">₹</span></div>
                  <strong>{money(totalRevenue)}</strong>
                  <small>Gross demo order value</small>
                </div>
              </div>

              <div className="admin-overview-grid">
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span className="small-heading">MARKETPLACE HEALTH</span>
                      <h2>Platform Overview</h2>
                    </div>
                  </div>

                  <div className="admin-overview-row">
                    <span>Active Sellers</span>
                    <strong>{activeSellers.length}</strong>
                  </div>
                  <div className="admin-progress">
                    <span style={{ width: `${sellerAccounts.length ? (activeSellers.length / sellerAccounts.length) * 100 : 0}%` }} />
                  </div>

                  <div className="admin-overview-row">
                    <span>Suspended Sellers</span>
                    <strong>{suspendedSellers.length}</strong>
                  </div>
                  <div className="admin-progress suspended-progress">
                    <span style={{ width: `${sellerAccounts.length ? (suspendedSellers.length / sellerAccounts.length) * 100 : 0}%` }} />
                  </div>

                  <div className="admin-overview-row">
                    <span>Average Order Value</span>
                    <strong>{money(orders.length ? totalRevenue / orders.length : 0)}</strong>
                  </div>

                  <div className="admin-overview-row">
                    <span>Units Sold</span>
                    <strong>{totalUnitsSold}</strong>
                  </div>
                </section>

                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span className="small-heading">TOP CATEGORY</span>
                      <h2>Category Performance</h2>
                    </div>
                  </div>

                  {categorySales.map((item) => (
                    <div className="admin-category-row" key={item.category}>
                      <div>
                        <span>{item.category}</span>
                        <strong>{money(item.amount)}</strong>
                      </div>
                      <div className="admin-progress">
                        <span style={{
                          width: `${totalRevenue ? (item.amount / totalRevenue) * 100 : 0}%`
                        }} />
                      </div>
                    </div>
                  ))}

                  <div className="admin-top-category">
                    <span>Best performing category</span>
                    <strong>{highestCategory?.amount > 0 ? highestCategory.category : "No sales yet"}</strong>
                  </div>
                </section>
              </div>

              <div className="admin-overview-grid">
                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span className="small-heading">LATEST ACTIVITY</span>
                      <h2>Recent Orders</h2>
                    </div>
                    <button className="admin-text-button" onClick={() => setAdminTab("orders")}>View all →</button>
                  </div>

                  {recentOrders.length === 0 ? (
                    <div className="admin-empty">No orders have been placed yet.</div>
                  ) : recentOrders.map((order) => (
                    <div className="admin-activity-item" key={order.id}>
                      <div className="admin-activity-icon">▤</div>
                      <div>
                        <strong>Order #{String(order.id).slice(-6)}</strong>
                        <p>{order.customer?.name || "Customer"} · {order.date}</p>
                      </div>
                      <strong className="admin-activity-amount">{money(order.total)}</strong>
                    </div>
                  ))}
                </section>

                <section className="admin-panel">
                  <div className="admin-panel-heading">
                    <div>
                      <span className="small-heading">PARTNER ACTIVITY</span>
                      <h2>New Sellers</h2>
                    </div>
                    <button className="admin-text-button" onClick={() => setAdminTab("sellers")}>View all →</button>
                  </div>

                  {recentSellers.length === 0 ? (
                    <div className="admin-empty">No seller registrations yet.</div>
                  ) : recentSellers.map((seller) => (
                    <div className="admin-activity-item" key={seller.id}>
                      <div className="admin-activity-icon">♙</div>
                      <div>
                        <strong>{seller.business || seller.name}</strong>
                        <p>{seller.email}</p>
                      </div>
                      <span className={`admin-status ${seller.status === "Suspended" ? "status-suspended" : "status-active"}`}>
                        {seller.status || "Active"}
                      </span>
                    </div>
                  ))}
                </section>
              </div>
            </>
          )}

          {adminTab === "sellers" && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="small-heading">PARTNER MANAGEMENT</span>
                  <h2>All Sellers</h2>
                  <p>Manage registered sellers and their account status.</p>
                </div>
                <span className="admin-count-badge">{sellerAccounts.length} sellers</span>
              </div>

              {sellerAccounts.length === 0 ? (
                <div className="admin-empty">No sellers have registered yet.</div>
              ) : (
                <div className="seller-table-wrap">
                  <table className="seller-table admin-table">
                    <thead>
                      <tr>
                        <th>Seller</th>
                        <th>Business</th>
                        <th>Email</th>
                        <th>Products</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {sellerAccounts.map((seller) => {
                        const sellerProductCount = sellerProducts.filter(
                          (product) => product.sellerId === seller.id
                        ).length;

                        const status = seller.status || "Active";

                        return (
                          <tr key={seller.id}>
                            <td>
                              <div className="admin-seller-name">
                                <div className="admin-avatar">
                                  {(seller.name || "S").charAt(0).toUpperCase()}
                                </div>
                                <strong>{seller.name}</strong>
                              </div>
                            </td>
                            <td>{seller.business || "—"}</td>
                            <td>{seller.email}</td>
                            <td>{sellerProductCount}</td>
                            <td>
                              <span className={`admin-status ${status === "Suspended" ? "status-suspended" : "status-active"}`}>
                                {status}
                              </span>
                            </td>
                            <td>
                              <div className="admin-action-buttons">
                                <button
                                  className="admin-action-toggle"
                                  onClick={() => toggleSellerStatus(seller.id)}
                                >
                                  {status === "Suspended" ? "Activate" : "Suspend"}
                                </button>
                                <button
                                  className="admin-action-delete"
                                  onClick={() => deleteSellerAccount(seller.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          )}

          {adminTab === "products" && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="small-heading">CATALOG CONTROL</span>
                  <h2>All Marketplace Products</h2>
                  <p>Review products listed by BazaarHub and registered sellers.</p>
                </div>
                <div className="admin-product-heading-actions">
                  <span className="admin-count-badge">{adminProducts.length} products</span>
                  {hiddenSeedProducts.length > 0 && (
                    <button className="admin-restore-button" onClick={restoreSeedProducts}>
                      Restore Demo Products
                    </button>
                  )}
                </div>
              </div>

              {adminProducts.length === 0 ? (
                <div className="admin-empty">No products available.</div>
              ) : (
                <div className="seller-table-wrap">
                  <table className="seller-table admin-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Seller</th>
                        <th>Stock</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {adminProducts.map((product) => (
                        <tr key={product.id}>
                          <td>
                            <div className="seller-product-cell">
                              <img src={imageUrl(product.image)} alt={product.name} />
                              <div><strong>{product.name}</strong></div>
                            </div>
                          </td>
                          <td>{product.category}</td>
                          <td>{money(product.price)}</td>
                          <td>{product.sellerName || "BazaarHub Demo"}</td>
                          <td>{product.stock ?? "—"}</td>
                          <td>
                            <button
                              className="admin-action-delete"
                              onClick={() => adminDeleteProduct(product)}
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="admin-note">
                Removing a demo product hides it from the storefront. You can restore
                removed demo products using the Restore button.
              </p>
            </section>
          )}

          {adminTab === "orders" && (
            <section className="admin-panel">
              <div className="admin-panel-heading">
                <div>
                  <span className="small-heading">TRANSACTION MANAGEMENT</span>
                  <h2>All Customer Orders</h2>
                  <p>Review orders and update their delivery status.</p>
                </div>
                <span className="admin-count-badge">{orders.length} orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="admin-empty">No customer orders yet.</div>
              ) : (
                <div className="admin-orders-list">
                  {orders.map((order) => (
                    <div className="admin-order-card" key={order.id}>
                      <div className="admin-order-header">
                        <div>
                          <strong>Order #{String(order.id).slice(-6)}</strong>
                          <p>{order.date}</p>
                        </div>

                        <select
                          value={order.status || "Confirmed"}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="admin-order-status-select"
                        >
                          <option>Confirmed</option>
                          <option>Processing</option>
                          <option>Packed</option>
                          <option>Shipped</option>
                          <option>Delivered</option>
                          <option>Cancelled</option>
                        </select>
                      </div>

                      <div className="admin-order-customer">
                        <div>
                          <span>Customer</span>
                          <strong>{order.customer?.name || "—"}</strong>
                        </div>
                        <div>
                          <span>Phone</span>
                          <strong>{order.customer?.phone || "—"}</strong>
                        </div>
                        <div>
                          <span>Payment</span>
                          <strong>{order.payment || "—"}</strong>
                        </div>
                        <div>
                          <span>Order Total</span>
                          <strong className="admin-order-total">{money(order.total)}</strong>
                        </div>
                      </div>

                      <div className="admin-order-items">
                        {order.items.map((item, index) => (
                          <div key={`${item.id}-${index}`}>
                            <span>{item.name} × {item.quantity}</span>
                            <strong>{money(item.price * item.quantity)}</strong>
                          </div>
                        ))}
                      </div>

                      <div className="admin-order-address">
                        <strong>Delivery Address:</strong>
                        {" "}{order.customer?.address || "—"}, {order.customer?.city || "—"} - {order.customer?.pincode || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {adminTab === "analytics" && (
            <>
              <div className="admin-stats-grid">
                <div className="admin-stat-card">
                  <div className="admin-stat-top"><span>Gross Revenue</span><span className="admin-stat-icon">₹</span></div>
                  <strong>{money(totalRevenue)}</strong>
                  <small>Total value of placed orders</small>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top"><span>Total Orders</span><span className="admin-stat-icon">▤</span></div>
                  <strong>{orders.length}</strong>
                  <small>All recorded orders</small>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top"><span>Units Sold</span><span className="admin-stat-icon">▣</span></div>
                  <strong>{totalUnitsSold}</strong>
                  <small>Total quantity ordered</small>
                </div>

                <div className="admin-stat-card">
                  <div className="admin-stat-top"><span>Average Order</span><span className="admin-stat-icon">↗</span></div>
                  <strong>{money(orders.length ? totalRevenue / orders.length : 0)}</strong>
                  <small>Average order value</small>
                </div>
              </div>

              <section className="admin-panel">
                <div className="admin-panel-heading">
                  <div>
                    <span className="small-heading">REVENUE BREAKDOWN</span>
                    <h2>Category-wise Sales</h2>
                    <p>Revenue calculated from items in customer orders.</p>
                  </div>
                </div>

                {categorySales.map((item) => (
                  <div className="admin-analytics-row" key={item.category}>
                    <div className="admin-analytics-label">
                      <strong>{item.category}</strong>
                      <span>{money(item.amount)}</span>
                    </div>
                    <div className="admin-progress admin-analytics-progress">
                      <span style={{
                        width: `${totalRevenue ? (item.amount / totalRevenue) * 100 : 0}%`
                      }} />
                    </div>
                    <small>
                      {totalRevenue ? ((item.amount / totalRevenue) * 100).toFixed(1) : "0.0"}% of revenue
                    </small>
                  </div>
                ))}
              </section>

              <div className="admin-panel admin-insight-panel">
                <span className="small-heading">BUSINESS INSIGHT</span>
                <h2>Marketplace Summary</h2>
                <p>
                  {orders.length
                    ? `BazaarHub has recorded ${orders.length} orders and generated ${money(totalRevenue)} in gross demo order value.`
                    : "Your marketplace is ready. Customer orders and sales data will appear here after the first purchase."}
                </p>
                <p>
                  The current best performing category is{" "}
                  <strong>{highestCategory?.amount > 0 ? highestCategory.category : "not available yet"}</strong>.
                </p>
              </div>
            </>
          )}

          <p className="admin-demo-note">
            Admin demo mode: all information is stored in this browser's Local Storage.
            Revenue is gross order value, not profit. This project does not use a real
            backend, payment gateway or production-level authentication.
          </p>
        </main>
      )}

      {/* PRODUCT DETAILS MODAL */}

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setSelectedProduct(null)}>×</button>

            <div className="modal-image-section">
              <div className="modal-main-image">
                <img src={imageUrl(selectedProduct.image)} alt={selectedProduct.name} />
              </div>
              <div className="modal-thumbnails">
                <img src={imageUrl(selectedProduct.image)} alt="Product view" />
              </div>
            </div>

            <div className="modal-details">
              <span className="small-heading">{selectedProduct.category}</span>
              <h2>{selectedProduct.name}</h2>
              <p>{selectedProduct.description}</p>

              <div className="product-rating">
                {averageRating(selectedProduct.id) ? (
                  <>
                    {renderStars(Number(averageRating(selectedProduct.id)))}
                    <strong>{averageRating(selectedProduct.id)} / 5</strong>
                    <span>({productReviews(selectedProduct.id).length} reviews)</span>
                  </>
                ) : (
                  <span className="rating-count">No ratings yet</span>
                )}
              </div>

              <div className="product-price">{money(selectedProduct.price)}</div>

              {selectedProduct.sellerId && (
                <p className="seller-byline">Sold by {selectedProduct.sellerName}</p>
              )}

              <button
                className={`modal-wishlist-button ${isWishlisted(selectedProduct.id) ? "wishlisted" : ""}`}
                onClick={() => toggleWishlist(selectedProduct)}
              >
                {isWishlisted(selectedProduct.id) ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
              </button>

              <button className="add-cart-btn modal-action-button" onClick={() => addToCart(selectedProduct)}>
                Add to Cart
              </button>

              <button className="modal-buy-button" onClick={() => buyNow(selectedProduct)}>
                Buy Now
              </button>
            </div>

            <div className="review-section">
              <div className="review-section-heading">
                <span className="small-heading">CUSTOMER FEEDBACK</span>
                <h3>Ratings & Reviews</h3>
              </div>

              <form className="review-form" onSubmit={submitReview}>
                <label>Your Rating</label>
                <div className="rating-picker">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                    type="button"
                    key={star}
                    className={star <= reviewRating?  "selected-star" : ""}
                    onClick={() => setReviewRating(star)}
                    >
                      *
                    </button>
                  ))}
                      <span>{reviewRating} out of 5</span>
                </div>

                <label htmlFor="review-name">Your Name</label>
                <input
                  id="review-name"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />

                <label htmlFor="review-text">Your Review</label>
                <textarea
                  id="review-text"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your experience..."
                  required
                />

                <button type="submit" className="submit-review-button">
                  Submit Review
                </button>
              </form>

              <div className="review-list">
                {productReviews(selectedProduct.id).length === 0 ? (
                  <div className="empty-reviews">
                    No reviews yet. Be the first to review this product!
                  </div>
                ) : productReviews(selectedProduct.id).map((review) => (
                  <div className="review-card" key={review.id}>
                    <div className="review-card-top">
                      <strong>{review.name}</strong>
                      <span>{review.date}</span>
                    </div>
                    {renderStars(review.rating)}
                    <p>{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WISHLIST */}

      {showWishlist && (
        <div className="wishlist-overlay" onClick={() => setShowWishlist(false)}>
          <div className="wishlist-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="wishlist-header">
              <div>
                <span className="small-heading">YOUR FAVOURITES</span>
                <h2>My Wishlist ({wishlistCount})</h2>
              </div>
              <button onClick={() => setShowWishlist(false)}>×</button>
            </div>

            {wishlist.length === 0 ? (
              <div className="wishlist-empty">
                <div className="wishlist-empty-icon">♡</div>
                <h3>Your wishlist is empty</h3>
                <p>Save your favourite products here for later.</p>
                <button onClick={() => setShowWishlist(false)}>Explore Products</button>
              </div>
            ) : (
              <div className="wishlist-items">
                {wishlist.map((item) => (
                  <div className="wishlist-item" key={item.id}>
                    <img src={imageUrl(item.image)} alt={item.name} />

                    <div className="wishlist-item-info">
                      <h4>{item.name}</h4>
                      <span>{item.category}</span>
                      <strong>{money(item.price)}</strong>
                      <button className="wishlist-add-cart" onClick={() => moveWishlistToCart(item)}>
                        + Add to Cart
                      </button>
                    </div>

                    <button className="wishlist-remove" onClick={() => removeFromWishlist(item.id)}>
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* CART */}

      {showCart && (
        <div className="cart-overlay" onClick={() => setShowCart(false)}>
          <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="cart-header">
              <div>
                <span className="small-heading">YOUR SHOPPING BAG</span>
                <h2>My Cart ({cartCount})</h2>
              </div>
              <button onClick={() => setShowCart(false)}>×</button>
            </div>

            {!cart.length ? (
              <div className="empty-cart">
                <div className="empty-icon">🛍️</div>
                <h3>Your cart is empty</h3>
                <p>Add some lovely products to get started.</p>
                <button onClick={() => setShowCart(false)}>Continue Shopping</button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <img src={imageUrl(item.image)} alt={item.name} />

                      <div className="cart-item-info">
                        <h4>{item.name}</h4>
                        <p>{money(item.price)}</p>

                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.id, -1)}>−</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
                        </div>

                        <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                          Remove
                        </button>
                      </div>

                      <strong>{money(item.price * item.quantity)}</strong>
                    </div>
                  ))}
                </div>

                <div className="cart-summary">
                  <div className="cart-summary-row">
                    <span>Subtotal</span>
                    <span>{money(subtotal)}</span>
                  </div>

                  <div className="cart-summary-row">
                    <span>Delivery</span>
                    <span>{delivery === 0 ? "FREE" : money(delivery)}</span>
                  </div>

                  <div className="cart-summary-row cart-total">
                    <span>Total</span>
                    <span>{money(total)}</span>
                  </div>

                  <p className="delivery-note">🎉 Free delivery on orders above ₹999</p>
                </div>

                <button className="checkout-button" onClick={startCheckout}>
                  Proceed to Checkout →
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT */}

      {showCheckout && (
        <div className="checkout-overlay" onClick={() => setShowCheckout(false)}>
          <div className="checkout-box" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowCheckout(false)}>×</button>

            <div className="checkout-heading">
              <span className="checkout-icon">♡</span>
              <span className="small-heading">ALMOST THERE</span>
              <h2>Complete Your <span>Order</span></h2>
              <p>Please enter your details for a smooth delivery experience.</p>
            </div>

            <div className="checkout-content">
              <form className="checkout-form" onSubmit={placeOrder}>
                <h3>Customer Details</h3>

                <label>
                  Full Name
                  <input name="name" value={customer.name} onChange={updateCustomer} placeholder="Enter your full name" required />
                </label>

                <label>
                  Email Address
                  <input name="email" type="email" value={customer.email} onChange={updateCustomer} placeholder="Enter your email" required />
                </label>

                <label>
                  Phone Number
                  <input name="phone" type="tel" pattern="[0-9]{10}" title="Enter a valid 10-digit phone number" value={customer.phone} onChange={updateCustomer} placeholder="Enter your phone number" required />
                </label>

                <label>
                  Full Address
                  <textarea name="address" value={customer.address} onChange={updateCustomer} placeholder="House no, street, area..." required />
                </label>

                <div className="form-row">
                  <label>
                    City
                    <input name="city" value={customer.city} onChange={updateCustomer} placeholder="Your city" required />
                  </label>

                  <label>
                    PIN Code
                    <input name="pincode" pattern="[0-9]{6}" title="Enter a valid 6-digit PIN code" value={customer.pincode} onChange={updateCustomer} placeholder="PIN code" required />
                  </label>
                </div>

                <h3 className="payment-title">Payment Method</h3>

                <div className="payment-options">
                  <label className={`payment-option ${payment === "COD" ? "selected" : ""}`}>
                    <input type="radio" name="payment" checked={payment === "COD"} onChange={() => setPayment("COD")} />
                    <span>💵</span>
                    <strong>Cash on Delivery</strong>
                  </label>

                  <label className={`payment-option ${payment === "UPI Demo" ? "selected" : ""}`}>
                    <input type="radio" name="payment" checked={payment === "UPI Demo"} onChange={() => setPayment("UPI Demo")} />
                    <span>📱</span>
                    <strong>UPI Demo</strong>
                  </label>
                </div>

                <div className="checkout-final-total">
                  <span>Order Total</span>
                  <strong>{money(total)}</strong>
                </div>

                <button type="submit" className="place-order-button">
                  Place Order • {money(total)}
                </button>

                <p className="secure-note">♡ Thank you for shopping with BazaarHub</p>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS */}

      {orderPlaced && (
        <div className="checkout-overlay">
          <div className="checkout-box success-container">
            <div className="success-icon">✓</div>
            <span className="small-heading">ORDER CONFIRMED</span>
            <h2>Thank You!</h2>
            <p>Your order has been placed successfully.</p>
            <p>We appreciate your shopping with BazaarHub.</p>
            <button onClick={() => setOrderPlaced(false)}>Continue Shopping</button>
          </div>
        </div>
      )}

      {/* CUSTOMER ORDERS */}

      {showOrders && (
        <div className="orders-overlay" onClick={() => setShowOrders(false)}>
          <div className="orders-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="orders-header">
              <div>
                <span className="small-heading">YOUR PURCHASES</span>
                <h2>My Orders</h2>
              </div>
              <button onClick={() => setShowOrders(false)}>×</button>
            </div>

            {!orders.length ? (
              <div className="no-orders">
                <div className="empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Your placed orders will appear here.</p>
              </div>
            ) : orders.map((order) => (
              <div className="order-card" key={order.id}>
                <div className="order-card-top">
                  <h3>Order #{String(order.id).slice(-6)}</h3>
                  <span className="order-status">{order.status || "Confirmed"}</span>
                </div>

                <p><strong>Date:</strong> {order.date}</p>
                <p><strong>Customer:</strong> {order.customer.name}</p>
                <p><strong>Payment:</strong> {order.payment}</p>

                <div className="order-products">
                  {order.items.map((item) => (
                    <div key={item.id}>{item.name} × {item.quantity}</div>
                  ))}
                </div>

                <div className="order-total">Total: {money(order.total)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SELLER LOGIN / REGISTER */}

      {showSellerAuth && (
        <div className="modal-overlay seller-auth-overlay" onClick={() => setShowSellerAuth(false)}>
          <div className="seller-auth-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowSellerAuth(false)}>×</button>

            <div className="seller-auth-icon">♙</div>
            <span className="small-heading">BAZAARHUB PARTNER</span>

            <h2>{sellerAuthMode === "login" ? "Seller Login" : "Create Seller Account"}</h2>

            <p className="seller-auth-subtitle">
              {sellerAuthMode === "login"
                ? "Sign in to manage your store and orders."
                : "Register your store to start listing products."}
            </p>

            <form className="seller-auth-form" onSubmit={handleSellerAuth}>
              {sellerAuthMode === "register" && (
                <>
                  <label>
                    Your Name
                    <input value={sellerName} onChange={(e) => setSellerName(e.target.value)} placeholder="Enter your full name" required />
                  </label>

                  <label>
                    Business / Store Name
                    <input value={sellerBusiness} onChange={(e) => setSellerBusiness(e.target.value)} placeholder="Enter your store name" required />
                  </label>
                </>
              )}

              <label>
                Email Address
                <input type="email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} placeholder="seller@example.com" required />
              </label>

              <label>
                Password
                <input type="password" minLength="6" value={sellerPassword} onChange={(e) => setSellerPassword(e.target.value)} placeholder="Minimum 6 characters" required />
              </label>

              {sellerAuthError && <p className="seller-auth-error">{sellerAuthError}</p>}

              <button className="seller-primary-button auth-submit" type="submit">
                {sellerAuthMode === "login" ? "Login to Dashboard →" : "Create Seller Account →"}
              </button>
            </form>

            <p className="seller-auth-switch">
              {sellerAuthMode === "login" ? "New to BazaarHub? " : "Already have an account? "}
              <button onClick={() => {
                setSellerAuthMode(sellerAuthMode === "login" ? "register" : "login");
                setSellerAuthError("");
              }}>
                {sellerAuthMode === "login" ? "Register as Seller" : "Login here"}
              </button>
            </p>

            <div className="seller-demo-credentials">
              <strong>Demo tip</strong>
              <span>Register with your own email and password, then login using the same details. Your demo account is saved in this browser.</span>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN LOGIN */}

      {showAdminAuth && (
        <div className="modal-overlay admin-auth-overlay" onClick={() => setShowAdminAuth(false)}>
          <div className="admin-auth-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={() => setShowAdminAuth(false)}>×</button>

            <div className="admin-auth-icon">♙</div>
            <span className="small-heading">BAZAARHUB CONTROL CENTER</span>
            <h2>Admin Login</h2>
            <p>Sign in to manage the BazaarHub marketplace.</p>

            <form className="seller-auth-form" onSubmit={handleAdminLogin}>
              <label>
                Admin Email
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter admin email"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </label>

              {adminAuthError && <p className="seller-auth-error">{adminAuthError}</p>}

              <button className="seller-primary-button auth-submit" type="submit">
                Login to Admin Dashboard →
              </button>
            </form>

            <div className="seller-demo-credentials">
              <strong>Demo Admin Credentials</strong>
              <span>Email: admin@bazaarhub.com</span>
              <span>Password: admin123</span>
            </div>

            <p className="admin-security-note">
              Demo login only. Do not use these credentials for a real website.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;