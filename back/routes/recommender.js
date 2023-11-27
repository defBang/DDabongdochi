const express = require('express');
const router = express.Router();

const { isLoggedIn } = require('../middlewares/checkLogin');
const { rateUp, rateDown } = require('../controllers/recommender');

// 추천 버튼
// PUT /recommender/rateUp
router.put('/rateUp', isLoggedIn, rateUp);

// 비추천 버튼
// PUT /recommender/rateDown
router.put('/rateDown', isLoggedIn, rateDown);

module.exports = router;