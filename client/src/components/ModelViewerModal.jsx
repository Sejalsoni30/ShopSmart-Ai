import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './ModelViewerModal.css';

export default function ModelViewerModal({ isOpen, onClose, product }) {
  if (!isOpen || !product) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onClose}>
        <motion.div 
          className="modal-content"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3 className="modal-title">Interactive 3D View: {product.name}</h3>
            <button className="btn-icon" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
          
          <div className="modal-body">
            <model-viewer
              src={product.modelUrl}
              alt={`A 3D model of ${product.name}`}
              auto-rotate
              camera-controls
              shadow-intensity="1"
              environment-image="neutral"
              exposure="1"
              style={{ width: '100%', height: '500px', backgroundColor: 'var(--bg-card)' }}
            >
              <div className="progress-bar hide" slot="progress-bar">
                  <div className="update-bar"></div>
              </div>
            </model-viewer>
          </div>
          
          <div className="modal-footer">
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Drag to rotate. Scroll to zoom. High-fidelity 3D rendering.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
