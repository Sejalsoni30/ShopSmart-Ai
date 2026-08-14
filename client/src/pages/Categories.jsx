import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import './Categories.css';

export default function Categories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('filter') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [activeCategory, setActiveCategory] = useState(initialCategory === 'All Electronics' ? '' : initialCategory);
  const [sort, setSort] = useState('');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  // Compare state
  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [activeCategory, sort, priceRange]);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (activeCategory) filters.category = activeCategory;
      if (sort) filters.sort = sort;
      if (priceRange.min) filters.minPrice = priceRange.min;
      if (priceRange.max) filters.maxPrice = priceRange.max;

      const data = await getProducts(filters);
      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompare = (product) => {
    if (compareList.some(p => p.id === product.id)) {
      setCompareList(compareList.filter(p => p.id !== product.id));
    } else {
      if (compareList.length >= 4) {
        alert('You can compare a maximum of 4 products.');
        return;
      }
      setCompareList([...compareList, product]);
    }
  };

  return (
    <div className="container page-container">
      <div className="layout-grid">
        <motion.aside 
          className="sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card filter-card">
            <h3>Filters</h3>
            
            <div className="filter-group">
              <label>Category</label>
              <select 
                className="input-field" 
                value={activeCategory} 
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By</label>
              <select 
                className="input-field" 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Price Range (₹)</label>
              <div className="price-inputs">
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="Min" 
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <span>-</span>
                <input 
                  type="number" 
                  className="input-field" 
                  placeholder="Max" 
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>
          </div>

          {compareList.length > 0 && (
            <div className="card compare-card">
              <h3>Compare List ({compareList.length}/4)</h3>
              <ul>
                {compareList.map(p => (
                  <li key={p.id}>
                    <span>{p.name}</span>
                    <button className="btn-remove" onClick={() => toggleCompare(p)}>×</button>
                  </li>
                ))}
              </ul>
              <button 
                className="btn btn-primary w-100"
                onClick={() => window.location.href = `/compare?ids=${compareList.map(p => p.id).join(',')}`}
              >
                Go to Compare
              </button>
            </div>
          )}
        </motion.aside>

        <motion.main 
          className="product-list"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="list-header">
            <h2>{activeCategory || 'All Products'}</h2>
            <span className="text-muted">{products.length} results</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="skeleton" style={{ height: '400px' }}></div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-3">
              {products.map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onCompareToggle={toggleCompare}
                  isCompared={compareList.some(p => p.id === product.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state card">
              <h3>No products found</h3>
              <p className="text-muted">Try adjusting your filters or search criteria.</p>
              <button className="btn btn-secondary mt-4" onClick={() => {
                setActiveCategory('');
                setSort('');
                setPriceRange({min: '', max: ''});
              }}>
                Clear Filters
              </button>
            </div>
          )}
        </motion.main>
      </div>
    </div>
  );
}
