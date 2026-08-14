const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');

router.post('/orders', async (req, res) => {
  try {
    const { amount: requestAmount, currency = 'INR' } = req.body;
    
    // Check if Razorpay keys are provided
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return res.status(200).json({ 
        mock: true, 
        message: 'Razorpay keys not configured. Falling back to mock checkout.',
        amount: requestAmount
      });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: requestAmount * 100, // amount in the smallest currency unit
      currency,
      receipt: `receipt_order_${Math.floor(Math.random() * 10000)}`,
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ error: 'Failed to create Razorpay order' });
    }

    res.json({ mock: false, order, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/verify', (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    
    // If we're mocking or there's no secret configured, approve it.
    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.json({ success: true, message: 'Mock Verification Successful' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      return res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid signature sent!' });
    }
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
