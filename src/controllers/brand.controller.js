// controllers/brand.controller.js
import Brand from "../models/brand.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new brand
const createBrand = asyncHandler(async (req, res) => {
    const { name,  status, category } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Brand name is required");
    }

    const existingBrand = await Brand.findOne({ name });

    if (existingBrand) {
        throw new ApiError(409, "Brand with this name already exists");
    }
   

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Avatar file is required")

    }
    const image = await uploadOnCloudinary(imageLocalPath);

    const brand = await Brand.create({
        name,
        image:image.url,
        status,
        category,
    });

    return res.status(201).json(new ApiResponse(201, brand, "Brand created successfully"));
});

// Get all brands
const getAllBrands = asyncHandler(async (req, res) => {
    // const brands = await Brand.find().populate('categories');
    const brands = await Brand.find();


    return res.status(200).json(new ApiResponse(200, brands, "Brands fetched successfully"));
});

// Get a single brand by ID
const getBrandById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const brand = await Brand.findById(id).populate('categories');

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json(new ApiResponse(200, brand, "Brand fetched successfully"));
});

// Update a brand
const updateBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, image, status, categories } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Brand name is required");
    }

    const brand = await Brand.findByIdAndUpdate(
        id,
        { name, image, status, categories },
        { new: true, runValidators: true }
    ).populate('categories');

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json(new ApiResponse(200, brand, "Brand updated successfully"));
});

// Delete a brand
const deleteBrand = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const brand = await Brand.findByIdAndDelete(id);

    if (!brand) {
        throw new ApiError(404, "Brand not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Brand deleted successfully"));
});

export { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand };
