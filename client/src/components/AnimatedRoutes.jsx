import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from '../pages/Home';
import Assistant from '../pages/Assistant';
import Categories from '../pages/Categories';
import Compare from '../pages/Compare';
import About from '../pages/About';
import Login from '../pages/Login';
import Checkout from '../pages/Checkout';
import LegalPage from '../pages/LegalPage';
import Pricing from '../pages/Pricing';
import PageTransition from './PageTransition';

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/assistant" element={<PageTransition><Assistant /></PageTransition>} />
        <Route path="/categories" element={<PageTransition><Categories /></PageTransition>} />
        <Route path="/compare" element={<PageTransition><Compare /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><LegalPage type="privacy" /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><LegalPage type="terms" /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><LegalPage type="contact" /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
