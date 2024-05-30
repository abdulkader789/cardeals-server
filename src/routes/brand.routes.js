import { Router } from 'express';
import { 
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
} from '../controllers/brand.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Route to create a new brand (Admin only)
router.post('/create-brand', verifyJWT, isAdmin, upload.single('image'), createBrand);

// Route to get all brands
router.get('/get-all-brands', getAllBrands);

// Route to get a single brand by ID
router.get('/get-single-brand/:id', getBrandById);

// Route to update a brand (Admin only)
router.put('/update-brand/:id', verifyJWT, isAdmin, updateBrand);

// Route to delete a brand (Admin only)
router.delete('/delete-brand/:id', verifyJWT, isAdmin, deleteBrand);

export default router;
