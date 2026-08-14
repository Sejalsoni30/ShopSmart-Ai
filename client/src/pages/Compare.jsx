import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { compareProducts } from '../services/api';
import { Check, X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import './Compare.css';

export default function Compare() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idsParam = searchParams.get('ids');
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (idsParam) {
      const ids = idsParam.split(',').filter(Boolean);
      if (ids.length > 0) {
        fetchComparison(ids);
      } else {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, [idsParam]);

  const fetchComparison = async (ids) => {
    setLoading(true);
    try {
      const data = await compareProducts(ids);
      setProducts(data);
    } catch (err) {
      setError('Failed to load comparison data');
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = (id) => {
    const newIds = products.filter(p => p.id !== id).map(p => p.id);
    if (newIds.length > 0) {
      navigate(`/compare?ids=${newIds.join(',')}`);
    } else {
      navigate('/compare');
    }
  };

  if (loading) {
    return (
      <div className="container compare-container text-center">
        <h2>Loading comparison...</h2>
      </div>
    );
  }

  if (!idsParam || products.length === 0) {
    return (
      <div className="container compare-container">
        <div className="card empty-state">
          <h2>Compare Products</h2>
          <p className="text-muted mb-4">Select up to 4 products from the categories page to compare them side-by-side.</p>
          <button className="btn btn-primary" onClick={() => navigate('/categories')}>
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Get all unique spec keys across all products
  const allSpecKeys = Array.from(
    new Set(products.flatMap(p => Object.keys(p.specs)))
  );

  return (
    <div className="container compare-container">
      <div className="compare-header">
        <button className="btn btn-secondary" onClick={() => navigate('/categories')}>
          <ArrowLeft size={16} /> Back to Products
        </button>
        <h2>Product Comparison</h2>
      </div>

      <motion.div 
        className="compare-table-wrapper card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <table className="compare-table">
          <thead>
            <tr>
              <th className="feature-col">Features</th>
              {products.map(p => (
                <th key={p.id} className="product-col">
                  <div className="compare-product-header">
                    <button className="btn-remove-compare" onClick={() => removeProduct(p.id)}>
                      <X size={16} />
                    </button>
                    <img src={p.image} alt={p.name} className="compare-img" />
                    <h3>{p.name}</h3>
                    <p className="compare-price">₹{p.price.toLocaleString('en-IN')}</p>
                    <div className="compare-rating">⭐ {p.rating} ({p.reviews})</div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="section-row">
              <td colSpan={products.length + 1}>Specifications</td>
            </tr>
            {allSpecKeys.map(key => (
              <tr key={key}>
                <td className="feature-name">{key}</td>
                {products.map(p => (
                  <td key={p.id}>{p.specs[key] || '-'}</td>
                ))}
              </tr>
            ))}

            <tr className="section-row">
              <td colSpan={products.length + 1}>Highlights</td>
            </tr>
            <tr>
              <td className="feature-name">Key Features</td>
              {products.map(p => (
                <td key={p.id}>
                  <ul className="compare-list">
                    {p.features.map((f, i) => <li key={i}><Check size={12} className="text-success" /> {f}</li>)}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-name">Pros</td>
              {products.map(p => (
                <td key={p.id}>
                  <ul className="compare-list">
                    {p.pros.map((f, i) => <li key={i} className="text-success">+ {f}</li>)}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-name">Cons</td>
              {products.map(p => (
                <td key={p.id}>
                  <ul className="compare-list">
                    {p.cons.map((f, i) => <li key={i} className="text-error">- {f}</li>)}
                  </ul>
                </td>
              ))}
            </tr>
            <tr>
              <td className="feature-name">Best For</td>
              {products.map(p => (
                <td key={p.id}><strong>{p.bestFor}</strong></td>
              ))}
            </tr>
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
