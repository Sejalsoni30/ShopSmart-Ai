import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getProductById, API_URL } from '../services/api';
import { ShieldCheck, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const productId = searchParams.get('product');
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      navigate('/');
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const data = await getProductById(productId);
      setProduct(data);
    } catch (error) {
      console.error(error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Create order on backend
      const response = await fetch(`${API_URL}/payment/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: product.price })
      });
      const data = await response.json();

      // 2. Check if running in mock mode
      if (data.mock) {
        setTimeout(() => {
          setSuccess(true);
          setIsProcessing(false);
        }, 1500);
        return;
      }

      // 3. Load script and open real Razorpay widget
      const res = await loadRazorpayScript();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      const options = {
        key: data.key,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'ShopSmart AI',
        description: `Purchase of ${product.name}`,
        image: 'https://ui-avatars.com/api/?name=SS&background=7c3aed&color=fff',
        order_id: data.order.id,
        handler: async function (response) {
          // Success callback - now we verify securely on the backend
          try {
            const verifyRes = await fetch(`${API_URL}/payment/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = await verifyRes.json();
            
            if (verifyData.success) {
              setSuccess(true);
            } else {
              setErrorMsg('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            setErrorMsg('Network error during payment verification.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: 'Demo User',
          email: 'demo@shopsmart.ai',
          contact: '9999999999'
        },
        theme: {
          color: '#7c3aed'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error('Payment Error:', error);
      alert('Something went wrong during checkout.');
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="container text-center py-5">Loading Checkout...</div>;
  }

  if (success) {
    return (
      <motion.div 
        className="container" 
        style={{ maxWidth: '600px', marginTop: '4rem' }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="card text-center" style={{ padding: '4rem 2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', color: 'var(--success)' }}>
            <CheckCircle size={64} />
          </div>
          <h2 className="mb-4">Payment Successful!</h2>
          <p className="text-muted mb-4">Your order for <strong>{product.name}</strong> has been securely confirmed and verified.</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Return Home</button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="container" 
      style={{ maxWidth: '800px', marginTop: '3rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="mb-4">Secure Checkout</h1>
      
      {errorMsg && (
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid #ef4444', color: '#ef4444', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} />
          <span>{errorMsg}</span>
        </div>
      )}
      
      <motion.div 
        className="grid grid-cols-2" 
        style={{ gap: '2rem' }}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        <motion.div className="card" variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}>
          <h3 className="mb-4">Order Summary</h3>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <img src={product.image} alt={product.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
            <div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>{product.name}</h4>
              <p className="text-muted" style={{ margin: 0, fontSize: '0.9rem' }}>Qty: 1</p>
            </div>
          </div>
          
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span className="text-muted">Subtotal</span>
              <span>₹{product.price.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span className="text-muted">Shipping</span>
              <span style={{ color: 'var(--success)' }}>Free</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-color)', paddingTop: '1rem', fontSize: '1.25rem', fontWeight: '700' }}>
              <span>Total</span>
              <span>₹{product.price.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }} variants={{ hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0 } }}>
          <h3>Payment Method</h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--primary)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--primary-light)' }}>
            <CreditCard className="text-primary" />
            <div>
              <p style={{ margin: 0, fontWeight: '600' }}>Razorpay</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cards, UPI, NetBanking</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <ShieldCheck size={16} />
            <span>Payments are secure and encrypted.</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: 'auto' }}
            onClick={handlePayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : `Pay ₹${product.price.toLocaleString('en-IN')}`}
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
