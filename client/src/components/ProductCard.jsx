import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, CheckCircle, PlusCircle, ShoppingCart, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ModelViewerModal from './ModelViewerModal';
import './ProductCard.css';

export default function ProductCard({ product, onCompareToggle, isCompared }) {
  const [isHovered, setIsHovered] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <motion.div 
      className="product-card card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        {product.modelUrl && (
          <button 
            className="btn-3d-view"
            onClick={(e) => { e.stopPropagation(); setIs3DModalOpen(true); }}
            title="View in 3D"
          >
            <Box size={20} />
          </button>
        )}
      </div>
      
      <div className="product-content">
        <div className="product-header">
          <h3 className="product-title">{product.name}</h3>
          <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
        </div>
        
        <div className="product-rating">
          <Star size={16} fill="var(--warning)" color="var(--warning)" />
          <span>{product.rating}</span>
          <span className="text-muted">({product.reviews} reviews)</span>
        </div>
        
        <p className="product-best-for">
          <strong>Best for:</strong> {product.bestFor}
        </p>
        
        <div className="product-specs">
          {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
            <div key={key} className="spec-item">
              <span className="spec-key">{key}:</span>
              <span className="spec-value">{value}</span>
            </div>
          ))}
        </div>

        <div className={`product-actions ${isHovered ? 'visible' : ''}`}>
          <button 
            className="btn btn-primary btn-compare"
            onClick={() => navigate(`/checkout?product=${product.id}`)}
          >
            <ShoppingCart size={16} /> Buy Now
          </button>
          
          {onCompareToggle && (
            <button 
              className={`btn ${isCompared ? 'btn-primary' : 'btn-secondary'} btn-compare`}
              onClick={() => onCompareToggle(product)}
              title={isCompared ? 'Added to Compare' : 'Compare'}
            >
              {isCompared ? <CheckCircle size={16} /> : <PlusCircle size={16} />}
            </button>
          )}
        </div>
      </div>
      
      {product.modelUrl && (
        <ModelViewerModal 
          isOpen={is3DModalOpen} 
          onClose={() => setIs3DModalOpen(false)} 
          product={product} 
        />
      )}
    </motion.div>
  );
}
