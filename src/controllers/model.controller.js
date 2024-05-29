import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Model } from "../models/model.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Create a new model
const createModel = asyncHandler(async (req, res) => {
    const { name, category, brand } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Model name is required");
    }

    const existingModel = await Model.findOne({ name });

    if (existingModel) {
        throw new ApiError(409, "Model with this name already exists");
    }

    const model = await Model.create({
        name,
        category,
        brand,
    });

    return res.status(201).json(new ApiResponse(201, model, "Model created successfully"));
});

// Get all models
const getAllModels = asyncHandler(async (req, res) => {
    const models = await Model.find().populate('category').populate('brand');

    return res.status(200).json(new ApiResponse(200, models, "Models fetched successfully"));
});

// Get a single model by ID
const getModelById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const model = await Model.findById(id).populate('category').populate('brand');

    if (!model) {
        throw new ApiError(404, "Model not found");
    }

    return res.status(200).json(new ApiResponse(200, model, "Model fetched successfully"));
});

// Update a model
const updateModel = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, status, category, brand } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Model name is required");
    }

    const model = await Model.findByIdAndUpdate(
        id,
        { name, status, category, brand },
        { new: true, runValidators: true }
    );

    if (!model) {
        throw new ApiError(404, "Model not found");
    }

    return res.status(200).json(new ApiResponse(200, model, "Model updated successfully"));
});

// Delete a model
const deleteModel = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const model = await Model.findByIdAndDelete(id);

    if (!model) {
        throw new ApiError(404, "Model not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Model deleted successfully"));
});

export {
    createModel,
    getAllModels,
    getModelById,
    updateModel,
    deleteModel,
};

