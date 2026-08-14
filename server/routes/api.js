const express = require('express');
const router = express.Router();
const demoCatalog = require('../data/demoCatalog');
const geminiService = require('../services/geminiService');

// Get all products (with optional filtering)
router.get('/products', (req, res) => {
  let results = [...demoCatalog];
  
  const { category, search, minPrice, maxPrice, sort } = req.query;

  if (category) {
    results = results.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.features.some(f => f.toLowerCase().includes(q)) ||
      p.bestFor.toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    results = results.filter(p => p.price >= parseInt(minPrice));
  }

  if (maxPrice) {
    results = results.filter(p => p.price <= parseInt(maxPrice));
  }

  if (sort) {
    if (sort === 'price-low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-high') {
      results.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      results.sort((a, b) => b.rating - a.rating);
    }
  }

  res.json(results);
});

// Get a single product
router.get('/products/:id', (req, res) => {
  const product = demoCatalog.find(p => p.id === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }
  res.json(product);
});

// Get all categories
router.get('/categories', (req, res) => {
  const categories = [...new Set(demoCatalog.map(p => p.category))];
  res.json(categories);
});

// Compare multiple products
router.post('/compare', (req, res) => {
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of product IDs to compare' });
  }

  if (ids.length > 4) {
    return res.status(400).json({ error: 'You can compare a maximum of 4 products' });
  }

  const products = demoCatalog.filter(p => ids.includes(p.id));
  res.json(products);
});

// Chat endpoint for Gemini
router.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  try {
    const aiResponse = await geminiService.generateChatResponse(message, history, demoCatalog);
    res.json(aiResponse);
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate response. Please try again.',
      details: error.message 
    });
  }
});

module.exports = router;
