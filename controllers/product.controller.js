const Product = require('../models/productModel');
const formidable = require('formidable');
const fs = require('fs');
const { default: slugify } = require('slugify');

const createProductController = async (req, res) => {
    try {
        const { name, description, category, price, quantity, shipping } = req.fields;
        const { photo, url } = req.files;
        console.log('Description:', description);


        // Validation
        // if (!name || !description || !category || !price || !quantity || !shipping || !photo || !url) {
        //     return res.status(400).json({ error: 'All fields are required' });
        // }
        // Parse the description JSON
        const parsedDescription = JSON.parse(description);

        // Ensure nested structure for the description
        const productDescription = {
            overview: parsedDescription.overview || '',
            features: parsedDescription.features || [],
            specifications: parsedDescription.specifications || {},
            safetyFeatures: parsedDescription.safetyFeatures || [],
            interior: parsedDescription.interior || '',
            exterior: parsedDescription.exterior || '',
            multimedia: parsedDescription.multimedia || '',
            additionalInfo: parsedDescription.additionalInfo || '',
        };

        const product = new Product({
            name,
            description: parsedDescription,
            category,
            price,
            quantity,
            shipping,
            slug: slugify(name),
            popularity: req.fields.popularity || 'Medium',
            trending: req.fields.trending || false,
            newArrivals: req.fields.newArrivals || false,
            url,

        });

        // Photo Handling
        if (photo) {
            if (photo.size > 1000000) {
                return res.status(400).json({ error: 'Image size should be less than 1MB' });
            }
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.status(201).json({ success: true, message: 'Product Created Successfully', product });
    } catch (error) {
        res.status(500).json({ error: 'Error creating product', details: error.message });
    }
};

const updateProductController = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
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
                return res.status(400).json({ error: 'Image size should be less than 1MB' });
            }
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.status(200).json({ success: true, message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ error: 'Error updating product', details: error.message });
    }
};






const deleteProductController = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await product.remove();
        res.status(200).json({ success: true, message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting product', details: error.message });
    }
};

const getSingleProductController = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(500).json({ error: 'Error getting product', details: error.message });
    }
};
const getAllProductsController = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(500).json({ error: 'Error getting products', details: error.message });
    }
};

module.exports = {
    createProductController,
    getAllProductsController,
    updateProductController,
    deleteProductController,
    getSingleProductController,
};
