const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Log a sign-in or sign-out event
router.post('/log', authController.logEvent);

// Retrieve all auth history logs
router.get('/history', authController.getAuthHistory);

// Google Auth
router.post('/google-login', authController.googleLogin);

module.exports = router;
