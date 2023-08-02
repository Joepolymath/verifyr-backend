const express = require('express');
const authMiddleware = require('../middlewares/auth');
const paymentControllers = require('../controllers/payments.controllers');

const router = express.Router();

router.post(
  '/initiate',
  authMiddleware.authenticate,
  paymentControllers.initiatePayment
);
router.post('/webhook', paymentControllers.paystackWebhook);

module.exports = router;
