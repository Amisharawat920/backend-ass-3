const express = require('express');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    getLowStockProducts,
    getCategorySummary
} = require('../controllers/productController');

// Special routes (Hamesha /:id ke upar rakhein)
router.get('/low-stock', getLowStockProducts);
router.get('/category-summary', getCategorySummary);

// Standard CRUD routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);

module.exports = router;