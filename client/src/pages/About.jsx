import { Shield, Sparkles, Database, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import './About.css';

export default function About() {
  return (
    <div className="container about-container">
      <motion.div 
        className="about-header text-center"
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h1 className="hero-title">About <span className="text-gradient">ShopSmart AI</span></h1>
        <p className="hero-subtitle">Your intelligent shopping companion.</p>
      </motion.div>

      <motion.div 
        className="about-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { transition: { staggerChildren: 0.1 } }
        }}
      >
        <motion.div className="card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <div className="about-icon-wrapper text-primary">
            <Sparkles size={32} />
          </div>
          <h3>How it Works</h3>
          <p className="text-muted">
            ShopSmart AI uses advanced natural language processing to understand your shopping requirements, budget, and intent. Instead of manually filtering through hundreds of products, you can just tell the AI what you need.
          </p>
        </motion.div>

        <motion.div className="card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <div className="about-icon-wrapper text-secondary">
            <Database size={32} />
          </div>
          <h3>Demo Data vs Verified Data</h3>
          <p className="text-muted">
            Currently, this application runs using a <strong>fictional Demo Catalog</strong> for UI testing purposes. The prices, ratings, and specifications shown are not real. Real verified data would display a green "Verified" badge.
          </p>
        </motion.div>

        <motion.div className="card" variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
          <div className="about-icon-wrapper text-success">
            <Shield size={32} />
          </div>
          <h3>Privacy & Security</h3>
          <p className="text-muted">
            Your conversations are processed securely. The Gemini AI API key is stored safely on the server side and is never exposed to the client. We do not store your chat history permanently.
          </p>
        </motion.div>
      </motion.div>

      <motion.div 
        className="card disclaimer-card"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="disclaimer-header">
          <Info className="text-warning" />
          <h3>Accuracy Disclaimer</h3>
        </div>
        <p>
          The AI strives to be as accurate as possible based on the provided catalog data. However, it should not be solely relied upon for critical purchasing decisions. Always verify product specifications, current pricing, and availability directly on the retailer's official website before making a purchase. The AI will never invent external links.
        </p>
      </motion.div>
    </div>
  );
}
