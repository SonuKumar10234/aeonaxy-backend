const express = require('express');
const { createUser, checkUsername, createProfile, optionSelected, sendEmail, verifyAccount } = require('../controllers/UserController');
const upload = require('../middlewares/multer.middleware');
const router = express.Router();


// /auth is already added in base path of router in index.js
router.post('/signup',createUser)
      .post('/username', checkUsername)
      .post('/profile', upload.single('image'), createProfile)
      .post('/selectoption', optionSelected)
      .post('/verify', sendEmail)
      .post('/verifyAccount', verifyAccount);

exports.router = router;