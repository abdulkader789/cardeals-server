// productRoutes.js
const express = require('express');
const router = express.Router();
const {
    createProductController,
    getAllProductsController,
    updateProductController,
    deleteProductController,
    getSingleProductController,
    getProductPhotoController,
    filterProductsController,
    searchProductController,
    getAllCategoryProductsController,
} = require('../controllers/product.controller');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware');
const formidable = require('express-formidable');

// Create Product
router.route('/create-product').post(requireSignIn, isAdmin, formidable(), createProductController);

// Get All Products
router.route('/get-all-products').get(getAllProductsController);

// Get Single Product by ID
router.route('/get-single-product/:productId').get(getSingleProductController);
router.route('/get-all-category-products/:categoryId').get(getAllCategoryProductsController);

router.route('/get-product-photo/:productId').get(getProductPhotoController);
router.route('/filter-products').post(filterProductsController);
router.route('/search-product').post(searchProductController);

// Update Product by ID
router.route('/update-product/:productId').put(requireSignIn, isAdmin, formidable(), updateProductController);

// Delete Product by ID
router.route('/delete-product/:productId').delete(requireSignIn, isAdmin, deleteProductController,);

module.exports = router;
