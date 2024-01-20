const Product = require('../models/productModel');
const formidable = require('formidable');
const fs = require('fs');
const { default: slugify } = require('slugify');

const createProductController = async (req, res) => {
    const { name, description, category, price, quantity, shipping } = req.fields;
    const { photo } = req.files;

    if (!name || !description || !category || !price || !quantity || !shipping || !photo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const product = new Product({
        name,
        description,
        category,
        price,
        quantity,
        shipping,
        slug: slugify(name),
        popularity: req.fields.popularity || 'Medium',
        trending: req.fields.trending || false,
        newArrivals: req.fields.newArrivals || false,
    });

    if (photo) {
        if (photo.size > 1000000) {
            return res.status(400).json({ error: 'Image size should be less than 1MB' });
        }
        product.photo.data = fs.readFileSync(photo.path);
        product.photo.contentType = photo.type;
    }

    try {
        await product.save();
        res.status(201).json({ success: true, message: 'Product Created Successfully', product });
    } catch (error) {
        res.status(500).json({ error: 'Error creating product', details: error.message });
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

const updateProductController = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const { name, description, category, price, quantity, shipping } = req.fields;

        if (name) product.name = name;
        if (description) product.description = description;
        if (category) product.category = category;
        if (price) product.price = price;
        if (quantity) product.quantity = quantity;
        if (shipping) product.shipping = shipping;
        if (req.fields.popularity) product.popularity = req.fields.popularity;
        if (req.fields.trending) product.trending = req.fields.trending;
        if (req.fields.newArrivals) product.newArrivals = req.fields.newArrivals;

        if (req.files && req.files.photo) {
            const { photo } = req.files;
            if (photo.size > 1000000) {
                return res.status(400).json({ error: 'Image size should be less than 1MB' });
            }
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.status(200).json({ success: true, product });
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

module.exports = {
    createProductController,
    getAllProductsController,
    updateProductController,
    deleteProductController,
    getSingleProductController,
};
