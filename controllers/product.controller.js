const Product = require('../models/productModel');
const formidable = require('formidable');
const fs = require('fs');
const { default: slugify } = require('slugify');

const createProductController = async (req, res) => {
    try {
        // Extract fields and files from the request
        const { name, model, description, category, price, quantity, url, seatingCapacity, engine, transmission, fuelEfficiency, color, range, acceleration, chargingTime, popular, trending, availability } = req.fields;
        const { photo } = req.files;

        // Create slug from the product name
        const slug = slugify(name);

        // Check if the request has files (form data)
        let productData = {
            name,
            model,
            description,
            category,
            price,
            quantity,
            url,
            seatingCapacity,
            engine,
            transmission,
            fuelEfficiency,
            color,
            range,
            acceleration,
            chargingTime,
            popular,
            trending,
            availability,
            slug,
        };

        const existingProduct = await Product.findOne({ name, model });

        if (existingProduct) {
            // Product already exists, return a response
            return res.status(400).send({ error: 'Product with the same name and model already exists' });
        }

        // Photo Handling
        if (photo) {
            if (photo.size > 1000000) {
                return res.status(400).send({ error: 'Image size should be less than 1MB' });
            }
            productData.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type,
            };
        }

        // Create a new Product instance
        const product = new Product(productData);

        // Save the product to the database
        await product.save();

        // Send a success response
        res.status(201).send({ success: true, message: 'Product Created Successfully', product });
    } catch (error) {
        // Handle errors and send an error response
        res.status(500).send({ error: 'Error creating product', details: error.message });
    }
};




const updateProductController = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        const { name, description, category, price, quantity, shipping, url } = req.fields;

        // Update fields if provided
        if (name) product.name = name;
        if (description) product.description = description;
        if (category) product.category = category;
        if (price) product.price = price;
        if (quantity) product.quantity = quantity;
        if (shipping) product.shipping = shipping;
        if (req.fields.popularity) product.popularity = req.fields.popularity;
        if (req.fields.trending) product.trending = req.fields.trending;
        if (req.fields.newArrivals) product.newArrivals = req.fields.newArrivals;
        if (url) product.url = url

        // Update photo if provided
        if (req.files && req.files.photo) {
            const { photo } = req.files;
            if (photo.size > 1000000) {
                return res.status(400).send({ error: 'Image size should be less than 1MB' });
            }
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.status(200).send({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).send({ error: 'Error updating product', details: error.message });
    }
};






const deleteProductController = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        await product.remove();
        res.status(200).send({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'Error deleting product', details: error.message });
    }
};

const getSingleProductController = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send({ success: true, product });
    } catch (error) {
        res.status(500).send({ error: 'Error getting product', details: error.message });
    }
};
const getAllProductsController = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).send({ success: true, products });
    } catch (error) {
        res.status(500).send({ error: 'Error getting products', details: error.message });
    }
};

module.exports = {
    createProductController,
    getAllProductsController,
    updateProductController,
    deleteProductController,
    getSingleProductController,
};
