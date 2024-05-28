import slugify from 'slugify';
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/category.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

// Create a new category
const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    const slug = slugify(name, { lower: true });

    const existingCategory = await Category.findOne({ slug });

    if (existingCategory) {
        throw new ApiError(409, "Category with this name already exists");
    }

    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Avatar file is required")

    }
    const imageURL = await uploadOnCloudinary(imageLocalPath);


    const category = await Category.create({
        name,
        slug,
        imageURL:imageURL.url,
    });

    return res.status(201).json(new ApiResponse(201, category, "Category created successfully"));
})




// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();

    return res.status(200).json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// Get a single category by ID
const getCategoryById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(new ApiResponse(200, category, "Category fetched successfully"));
});

// Update a category
const updateCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name?.trim()) {
        throw new ApiError(400, "Category name is required");
    }

    const category = await Category.findByIdAndUpdate(
        id,
        { name },
        { new: true, runValidators: true }
    );

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(new ApiResponse(200, category, "Category updated successfully"));
});

// Delete a category
const deleteCategory = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Category deleted successfully"));
});

export {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
