import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import './Pricing.css';

export default function Pricing() {
  const tiers = [
    {
      name: "Free",
      price: "0",
      buttonText: "TRY FOR FREE →",
      featured: false,
      features: [
        { text: "1 seat", active: true },
        { text: "10,000 credits - trial", active: true },
        { text: "Up to 10 3D twins", active: true },
        { text: "3D Hotspots", active: true },
        { text: "AR Place-in-Space (beta)", active: true },
        { text: "Free Shopify integration", active: true },
        { text: "Customer Support", active: true },
        { text: "Hosting & Viewer", active: true, extra: "(2x annual allowance)" },
        { text: "API Access", active: false }
      ]
    },
    {
      name: "Pro",
      price: "999",
      buttonText: "TRY FOR FREE →",
      featured: true,
      features: [
        { text: "1 seat", active: true },
        { text: "5,000 credits / month", active: true },
        { text: "Up to 5 3D twins / month", active: true },
        { text: "3D Hotspots", active: true },
        { text: "AR Place-in-Space (beta)", active: true },
        { text: "Free Shopify integration", active: true },
        { text: "Customer Support", active: true },
        { text: "Hosting & Viewer", active: true },
        { text: "API Access", active: false }
      ]
    },
    {
      name: "Business",
      price: "4,999",
      buttonText: "TRY FOR FREE →",
      featured: false,
      features: [
        { text: "3 seats", active: true },
        { text: "35,000 credits / month", active: true },
        { text: "Up to 35 HD 3D twins / month", active: true },
        { text: "3D Hotspots", active: true },
        { text: "AR Place-in-Space (beta)", active: true },
        { text: "Free Shopify integration", active: true },
        { text: "Customer Support", active: true },
        { text: "Hosting & Viewer", active: true },
        { text: "API Access", active: false }
      ]
    },
    {
      name: "Enterprise",
      price: "14,999",
      buttonText: "BOOK A DEMO",
      featured: false,
      features: [
        { text: "5 seats", active: true },
        { text: "110,000 credits / month", active: true },
        { text: "Up to 110 HD 3D twins / month", active: true },
        { text: "3D Hotspots", active: true },
        { text: "AR Place-in-Space (beta)", active: true },
        { text: "Free Shopify integration", active: true },
        { text: "Bespoke SLA", active: true },
        { text: "API Access", active: true },
        { text: "Contact team for custom integrations", active: true }
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="pricing-page">
      <motion.div 
        className="pricing-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1>Pricing</h1>
        <p>Simple, transparent pricing for teams of all sizes.</p>
      </motion.div>

      <motion.div 
        className="pricing-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {tiers.map((tier, index) => (
          <motion.div 
            key={index} 
            className={`pricing-card ${tier.featured ? 'featured' : ''}`}
            variants={itemVariants}
          >
            <div className="pricing-price">
              <span className="pricing-currency">₹</span>
              {tier.price}
              <span className="pricing-period">/ month</span>
            </div>
            
            <button className={`pricing-btn ${tier.featured ? 'btn-accent' : ''}`}>
              {tier.buttonText}
            </button>

            <ul className="pricing-features">
              {tier.features.map((feature, idx) => (
                <li key={idx} className={`pricing-feature ${!feature.active ? 'disabled' : ''}`}>
                  <span className={`feature-icon ${feature.active ? 'check' : 'cross'}`}>
                    {feature.active ? <Check size={16} strokeWidth={3} /> : <Minus size={16} strokeWidth={2} />}
                  </span>
                  <span>
                    {feature.text}
                    {feature.extra && <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '2px' }}>{feature.extra}</div>}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
