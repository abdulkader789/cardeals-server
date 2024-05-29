import { Router } from 'express';
import { 
    createModel,
    getAllModels,
    getModelById,
    updateModel,
    deleteModel,
} from '../controllers/model.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';
import isAdmin from '../middlewares/isAdmin.middleware.js';

const router = Router();

// Route to create a new model (Admin only)
router.post('/create-model', verifyJWT, isAdmin, createModel);

// Route to get all models
router.get('/get-all-models', getAllModels);

// Route to get a single model by ID
router.get('/get-single-model/:id', getModelById);

// Route to update a model (Admin only)
router.put('/update-model/:id', verifyJWT, isAdmin, updateModel);

// Route to delete a model (Admin only)
router.delete('/delete-model/:id', verifyJWT, isAdmin, deleteModel);

export default router;
