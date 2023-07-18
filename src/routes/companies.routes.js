const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companies.controllers');
const authMiddleware = require('../middlewares/auth');

// I defined the routes and associated them with controller functions here

router.post('/create-account', companyController.createAccount);

router.post(
  '/create-admin',
  authMiddleware.authenticate,
  companyController.createAdmin
);
router.post(
  '/create-staff',
  authMiddleware.authenticate,
  companyController.createStaff
);
router.post('/login', companyController.login);
router.get('/', companyController.getAllCompanies);
router.post('/forgot-password', companyController.forgotPassword);
router.post('/reset-password', companyController.resetPassword);

module.exports = router;
