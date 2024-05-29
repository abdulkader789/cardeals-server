import slugify from 'slugify';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Brand } from "../models/brand.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new brand
const createBrand = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Brand name is required");
    }

    const slug = slugify(name, { lower: true });

    const existingBrand = await Brand.findOne({ slug });

    if (existingBrand) {
        throw new ApiError(409, "Brand with this name already exists");
    }

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Image file is required");
    }

    const imageURL = await uploadOnCloudinary(imageLocalPath);

    const brand = await Brand.create({
        name,
        slug,
        imageURL: imageURL.url,
    });

    return res.status(201).json(new ApiResponse(201, brand, "Brand created successfully"));
});

// Get all brands
const getAllBrands = asyncHandler(async (req, res) => {
    const brands = await Brand.find().populate('categories');

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
    const { name, status, categories } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Brand name is required");
    }

    const slug = slugify(name, { lower: true });

    const brand = await Brand.findByIdAndUpdate(
        id,
        { name, slug, status, categories },
        { new: true, runValidators: true }
    );

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

export {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
};
