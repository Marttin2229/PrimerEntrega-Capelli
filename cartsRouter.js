const express = require('express');
const router = express.Router();
const cartController = require('./cartController');

router.post('/', cartController.createCart);
router.get('/:cid', cartController.getCartById);
router.post('/:cid/product/:pid', cartController.addProductToCart);

module.exports = router;
