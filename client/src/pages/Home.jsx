import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ShoppingCart, Apple, Milk, Sandwich, Droplets, Baby, Heart, Zap, Home as HomeIcon, ChevronRight, Star, ShieldCheck, ArrowRight, TrendingUp, HelpCircle, CheckCircle, Wallet, Brain, Cpu, MessageSquare, Package, Truck, Clock, CreditCard, Percent, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';
import './Home.css';

const categories = [
  { name: 'Groceries & Staples', icon: Package, color: '#f59e0b', emoji: '🌾' },
  { name: 'Snacks & Packaged Food', icon: Sandwich, color: '#ef4444', emoji: '🍿' },
  { name: 'Beverages', icon: Droplets, color: '#3b82f6', emoji: '☕' },
  { name: 'Dairy & Frozen', icon: Milk, color: '#06b6d4', emoji: '🥛' },
  { name: 'Fruits & Vegetables', icon: Apple, color: '#22c55e', emoji: '🥬' },
  { name: 'Personal Care', icon: Heart, color: '#ec4899', emoji: '🧴' },
  { name: 'Cleaning & Household', icon: HomeIcon, color: '#8b5cf6', emoji: '🧹' },
  { name: 'Home & Kitchen', icon: HomeIcon, color: '#f97316', emoji: '🍳' },
  { name: 'Baby Care', icon: Baby, color: '#14b8a6', emoji: '👶' },
  { name: 'Electronics', icon: Zap, color: '#6366f1', emoji: '📱' },
  { name: 'Bakery', icon: Sandwich, color: '#d97706', emoji: '🍞' },
  { name: 'Health & Wellness', icon: Heart, color: '#10b981', emoji: '💊' },
];

const quickDeals = [
  { label: '🔥 Flash Sale', desc: 'Up to 60% off', gradient: 'linear-gradient(135deg, #ff6b35, #f7c948)' },
  { label: '🥦 Fresh Produce', desc: 'Starting ₹20/kg', gradient: 'linear-gradient(135deg, #56ab2f, #a8e063)' },
  { label: '🧴 Personal Care', desc: 'Buy 2 Get 1 Free', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
  { label: '🍼 Baby Essentials', desc: 'Flat 30% Off', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
];

const budgetRanges = [
  { label: 'Under ₹50', value: 50 },
  { label: 'Under ₹100', value: 100 },
  { label: 'Under ₹200', value: 200 },
  { label: 'Under ₹500', value: 500 },
  { label: 'Under ₹1,000', value: 1000 },
  { label: 'Under ₹5,000', value: 5000 },
];

const useCases = [
  { name: 'Weekly Groceries', query: 'Essential groceries for weekly shopping under ₹2000' },
  { name: 'Party Snacks', query: 'Best snacks and beverages for a house party' },
  { name: 'Baby Essentials', query: 'Must-have baby care products for new parents' },
  { name: 'Kitchen Setup', query: 'Essential kitchen items for new home' },
  { name: 'Healthy Living', query: 'Best health and wellness products for daily routine' },
  { name: 'Cleaning Supplies', query: 'Complete home cleaning kit with all essentials' }
];

const faqs = [
  { q: 'How does ShopSmart AI work?', a: 'ShopSmart AI uses advanced natural language processing to understand your requirements, budget, and use-case, and then searches our product catalog to recommend the best matches — just like having a personal shopping assistant!' },
  { q: 'Is this like DMart online?', a: 'Yes! We offer a wide range of everyday products across Groceries, Personal Care, Snacks, Beverages, Dairy, Home & Kitchen, and more — all at competitive prices.' },
  { q: 'Can I compare products?', a: 'Yes! Click "Compare" on any product card to see a side-by-side comparison of specs, prices, pros and cons of up to 4 products.' },
  { q: 'Are the prices real?', a: 'Currently this is a demo catalog with representative pricing. In production, prices would be updated in real-time from retailer APIs.' }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [dealProducts, setDealProducts] = useState([]);
  const [activeFaq, setActiveFaq] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const data = await getProducts();
        const sorted = data.sort((a, b) => b.rating - a.rating).slice(0, 8);
        setTrendingProducts(sorted);
        // Get some low-price deal products
        const deals = data.sort((a, b) => a.price - b.price).slice(0, 4);
        setDealProducts(deals);
      } catch (err) {
        console.error("Failed to fetch trending products", err);
      }
    };
    fetchTrending();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate('/assistant', { state: { initialQuery: searchQuery } });
    }
  };

  const handlePromptClick = (prompt) => {
    navigate(`/assistant?q=${encodeURIComponent(prompt)}`);
  };

  return (
    <div className="home-page">
      {/* 1. Hero Section - DMart Style */}
      <section className="hero-section">
        <div className="hero-bg-shapes">
          <div className="hero-shape hero-shape-1"></div>
          <div className="hero-shape hero-shape-2"></div>
          <div className="hero-shape hero-shape-3"></div>
        </div>
        
        <div className="container hero-container">
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="hero-badge">
              <Sparkles size={14} />
              <span>AI-Powered Shopping</span>
            </div>
            <h1 className="hero-title">
              Your <span className="text-gradient">Smart Grocery</span> Store
            </h1>
            <p className="hero-subtitle">
              From daily groceries to electronics — shop everything at unbeatable prices. Let AI find exactly what you need.
            </p>
            
            <form onSubmit={handleSearch} className="hero-search">
              <div className="search-input-wrapper">
                <Search size={20} className="search-icon" />
                <input 
                  type="text"
                  placeholder='Try "weekly groceries under ₹500" or "best shampoo for dandruff"'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <button type="submit" className="btn-search">
                <Sparkles size={18} />
                Ask AI
              </button>
            </form>

            <div className="hero-stats">
              <div className="hero-stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Products</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="stat-number">12</span>
                <span className="stat-label">Categories</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="stat-number">AI</span>
                <span className="stat-label">Powered</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Quick Deals Banner */}
      <section className="deals-section">
        <div className="container">
          <div className="deals-grid">
            {quickDeals.map((deal, i) => (
              <motion.div 
                key={i}
                className="deal-card"
                style={{ background: deal.gradient }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.03, y: -3 }}
                onClick={() => navigate('/categories')}
              >
                <span className="deal-label">{deal.label}</span>
                <span className="deal-desc">{deal.desc}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Shop by Category */}
      <motion.section 
        className="categories-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Shop by Category</h2>
            <Link to="/categories" className="view-all-link">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <motion.div 
                key={cat.name} 
                className="category-card"
                onClick={() => navigate(`/categories?filter=${cat.name}`)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -6, borderColor: cat.color }}
              >
                <div className="category-emoji">{cat.emoji}</div>
                <h3>{cat.name}</h3>
                <div className="category-arrow">
                  <ChevronRight size={18} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 4. Trending Products */}
      <motion.section 
        className="trending-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <div className="container">
          <div className="section-header">
            <h2 className="section-title"><TrendingUp className="section-icon" /> Best Sellers</h2>
            <Link to="/categories" className="view-all-link">View all <ArrowRight size={16} /></Link>
          </div>
          <div className="products-grid">
            {trendingProducts.slice(0, 4).map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 5. Value Propositions */}
      <section className="value-props-section">
        <div className="container">
          <div className="value-props-grid">
            {[
              { icon: Truck, title: "Fast Delivery", desc: "Get your order within 24 hours", color: "#3b82f6" },
              { icon: Percent, title: "Best Prices", desc: "Wholesale prices for everyone", color: "#22c55e" },
              { icon: ShieldCheck, title: "100% Genuine", desc: "All products are verified", color: "#8b5cf6" },
              { icon: CreditCard, title: "Secure Payment", desc: "Multiple payment options", color: "#f59e0b" },
            ].map((prop, i) => (
              <motion.div 
                key={i} 
                className="value-prop-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="value-prop-icon" style={{ backgroundColor: prop.color + '15', color: prop.color }}>
                  <prop.icon size={28} />
                </div>
                <h4>{prop.title}</h4>
                <p className="text-muted">{prop.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Budget & Use Cases */}
      <section className="explore-section">
        <div className="container">
          <div className="grid grid-cols-2 explore-grid">
            <motion.div 
              className="budget-shopping"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title"><Wallet className="section-icon" /> Shop by Budget</h2>
              <p className="text-muted mb-4">Find products within your price range.</p>
              <div className="budget-grid">
                {budgetRanges.map((budget, i) => (
                  <motion.button 
                    key={i}
                    className="btn btn-outline budget-btn"
                    onClick={() => navigate(`/categories?maxPrice=${budget.value}`)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {budget.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="usecase-shopping"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title"><Cpu className="section-icon" /> Ask AI for</h2>
              <p className="text-muted mb-4">Let AI recommend the best products for your needs.</p>
              <div className="usecase-grid">
                {useCases.map((useCase, i) => (
                  <motion.button 
                    key={i}
                    className="btn btn-outline usecase-btn"
                    onClick={() => handlePromptClick(useCase.query)}
                    whileHover={{ scale: 1.05, backgroundColor: 'var(--primary-light)', borderColor: 'var(--primary)' }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {useCase.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7. More Products */}
      {trendingProducts.length > 4 && (
        <motion.section 
          className="trending-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="container">
            <div className="section-header">
              <h2 className="section-title"><Gift className="section-icon" /> More Products You'll Love</h2>
            </div>
            <div className="products-grid">
              {trendingProducts.slice(4, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* 8. How it Works */}
      <motion.section 
        className="how-it-works-section"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <h2 className="section-title text-center mb-5">How ShopSmart AI Works</h2>
          <div className="steps-grid">
            {[
              { icon: MessageSquare, title: "1. Tell us what you need", desc: "Type in natural language — 'weekly groceries under ₹500'" },
              { icon: Brain, title: "2. AI understands", desc: "Our AI analyzes your requirements, budget, and preferences" },
              { icon: Search, title: "3. Smart matches", desc: "We find the best products from our catalog" },
              { icon: CheckCircle, title: "4. Compare & buy", desc: "Compare options side-by-side and checkout securely" },
            ].map((step, i) => (
              <motion.div 
                key={i} 
                className="step-card"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="step-number">{i + 1}</div>
                <div className="step-icon"><step.icon size={24} /></div>
                <h4>{step.title}</h4>
                <p className="text-muted text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 9. Testimonials */}
      <motion.section 
        className="testimonials-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <h2 className="section-title text-center mb-5">What Our Customers Say</h2>
          <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
            {[
              { name: "Priya S.", role: "Homemaker", text: "ShopSmart AI helped me plan my weekly groceries perfectly. I asked for essentials under ₹1500 and it gave me a complete list with the best brands!" },
              { name: "Rahul M.", role: "Working Professional", text: "Love the AI assistant! I just told it I need party snacks for 20 people and it recommended everything from chips to beverages. Saved me so much time." },
              { name: "Anita K.", role: "New Mom", text: "The baby care section has everything I need. The price comparison feature helped me save ₹500 on diapers alone. Highly recommend!" }
            ].map((t, i) => (
              <motion.div 
                key={i} 
                className="card testimonial-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div style={{ display: 'flex', color: 'var(--warning)', marginBottom: '1rem' }}>
                  <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
                </div>
                <p className="mb-4">"{t.text}"</p>
                <div>
                  <h4 style={{ margin: 0 }}>{t.name}</h4>
                  <p className="text-muted text-sm" style={{ margin: 0 }}>{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 10. FAQ Section */}
      <motion.section 
        className="faq-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <h2 className="section-title text-center mb-5"><HelpCircle className="inline section-icon" /> Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`faq-item card ${activeFaq === index ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="faq-question">
                  <h4>{faq.q}</h4>
                  <ChevronRight className={`faq-icon ${activeFaq === index ? 'rotated' : ''}`} />
                </div>
                <AnimatePresence>
                  {activeFaq === index && (
                    <motion.div 
                      className="faq-answer text-muted"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                    >
                      <p className="pt-3 border-t mt-3 border-color-soft">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 11. Final CTA */}
      <motion.section 
        className="cta-section"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="cta-card">
            <h2>Start Shopping Smarter Today</h2>
            <p className="text-muted mb-5">Let AI help you find the best products at the best prices. From ₹28 salt to ₹1,99,900 MacBook.</p>
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/assistant')}>
              Ask AI Assistant <ArrowRight className="ml-2 inline" size={20} />
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
