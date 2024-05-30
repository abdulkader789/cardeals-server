import { Router } from 'express';
import { 
    createCar,
    getAllCars,
    getCarById,
    updateCar,
    deleteCar
} from '../controllers/car.controller.js';
import { upload } from '../middlewares/multer.middleware.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

// Route to create a new car (Admin only)
router.post('/create-car', verifyJWT, isAdmin, upload.single('image'), createCar);

// Route to get all cars
router.get('/get-all-cars', getAllCars);

// Route to get a single car by ID
router.get('/get-single-car/:id', getCarById);

// Route to update a car (Admin only)
router.put('/update-car/:id', verifyJWT, isAdmin, upload.single('image'), updateCar);

// Route to delete a car (Admin only)
router.delete('/delete-car/:id', verifyJWT, isAdmin, deleteCar);

export default router;
