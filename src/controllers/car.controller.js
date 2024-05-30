import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Car } from "../models/car.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createCar = asyncHandler(async (req, res) => {
    const {
        name, category, brand, model, description,
        price, quantity, seatingCapacity, engine,
        transmission, fuelEfficiency, color, range,
        acceleration, chargingTime, popular, trending, availability
    } = req.body;

    if (!name || !category || !brand || !model || !price || !quantity) {
        throw new ApiError(400, "All required fields must be filled");
    }
    const imageLocalPath = req.file?.path;

    if (!imageLocalPath) {
        throw new ApiError(400, "Avatar file is required")

    }
    const image = await uploadOnCloudinary(imageLocalPath);

    const car = await Car.create({
        name, category, brand, model, description, price,
        quantity, image: image.url, seatingCapacity, engine,
        transmission, fuelEfficiency, color, range, acceleration,
        chargingTime, popular, trending, availability
    });

    return res.status(201).json(new ApiResponse(201, car, "Car created successfully"));
});

const getAllCars = asyncHandler(async (req, res) => {
    const cars = await Car.find();
    return res.status(200).json(new ApiResponse(200, cars, "Cars fetched successfully"));
});

const getCarById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const car = await Car.findById(id).populate('category brand model');

    if (!car) {
        throw new ApiError(404, "Car not found");
    }

    return res.status(200).json(new ApiResponse(200, car, "Car fetched successfully"));
});

const updateCar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    const image = req.files?.image ? await uploadOnCloudinary(req.files.image[0].path) : null;
    if (image) {
        updates.image = image.url;
    }

    const car = await Car.findByIdAndUpdate(id, updates, { new: true });

    if (!car) {
        throw new ApiError(404, "Car not found");
    }

    return res.status(200).json(new ApiResponse(200, car, "Car updated successfully"));
});

const deleteCar = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const car = await Car.findByIdAndDelete(id);

    if (!car) {
        throw new ApiError(404, "Car not found");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Car deleted successfully"));
});

export { createCar, getAllCars, getCarById, updateCar, deleteCar };
