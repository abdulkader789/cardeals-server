const express = require('express');
const router = express.Router();
const {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getAllCategoriesController,
    getSingleCategoryController
} = require('../controllers/category.controller');
const { requireSignIn, isAdmin } = require('../middleware/authMiddleware');

// Create Category
router.route('/create-category').post(requireSignIn, isAdmin, createCategoryController);

// Update Category
router.route('/update-category/:categoryId').put(requireSignIn, isAdmin, updateCategoryController);

// Delete Category
router.route('/delete-category/:categoryId').delete(requireSignIn, isAdmin, deleteCategoryController);

// Get All Categories
router.route('/get-all-categories').get(getAllCategoriesController);
router.route('/get-single-category/:id').get(getSingleCategoryController)

module.exports = router;
