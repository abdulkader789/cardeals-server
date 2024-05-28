import { Router } from 'express';
import { 
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
} from '../controllers/category.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Route to create a new category (Admin only)
router.post('/create-category', verifyJWT, isAdmin, upload.single('imageURL'), createCategory);

// Route to get all categories
router.get('/get-all-categories', getAllCategories);

// Route to get a single category by ID
router.get('/get-single-category/:id', getCategoryById);

// Route to update a category (Admin only)
router.put('/update-category/:id', verifyJWT, isAdmin, updateCategory);

// Route to delete a category (Admin only)
router.delete('/delete-category/:id', verifyJWT, isAdmin, deleteCategory);

export default router;
