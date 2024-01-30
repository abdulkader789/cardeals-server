const Product = require('../models/productModel');
const formidable = require('formidable');
const fs = require('fs');
const { default: slugify } = require('slugify');

const createProductController = async (req, res) => {
    try {
        // Extract fields and files from the request
        const { name, model, description, category, price, quantity, url, seatingCapacity, engine, transmission, brand, fuelEfficiency, color, range, acceleration, chargingTime, popular, trending, availability } = req.fields;
        const { photo } = req.files;

        // Create slug from the product name
        const slug = slugify(name);

        // Check if the request has files (form data)
        let productData = {
            name,
            model,
            brand,
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


const getProductPhotoController = async (req, res) => {
    try {
        const { productId } = req.params; // Extract the photo ID from request parameters

        // Find the photo by ID in MongoDB and select specific fields
        const product = await Product.findById(productId).select('photo'); // Example: Selecting title and imageUrl fields
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType)
            return res.status(200).send(product.photo.data);
        } else {
            return res.status(404).send({ message: 'Photo not found' });
        }

    } catch (error) {
        console.error('Error fetching photo:', error);
        res.status(500).send({ message: 'Server error' });
    }
};


const filterProductsController = async (req, res) => {
    try {
        // Extract filters from req.body
        const { checked, radio } = req.body;

        // Build query based on received filters
        const query = {};

        // Add checked categories to query
        if (checked.length > 0) {
            query.category = checked;
        }

        // Add price range filter to query
        if (radio.length === 2) {
            query.price = { $gte: radio[0], $lte: radio[1] };
        }

        // Execute the query to find products based on filters
        const products = await Product.find(query);

        // Return the filtered products as a response
        res.status(200).send({ success: true, products });
    } catch (error) {
        console.error('Error applying filters:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const searchProductController = async (req, res) => {
    try {
        const { name, model } = req.body;

        // Build query based on received search criteria
        const query = {};

        // Add search criteria for product name
        if (name) {
            query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
        }

        // Add search criteria for product model
        if (model) {
            query.model = { $regex: model, $options: 'i' }; // Case-insensitive search
        }

        // Find products based on search criteria
        const products = await Product.find(query);

        // Return the found products as a response
        res.status(200).send({ success: true, products });
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).send({ message: 'Server error' });
    }
};


// const filterProductsController = async (req, res) => {
//     try {
//         // Extract filters from req.body
//         const { checkedFilters, radioFilter } = req.body;

//         // Build query based on received filters
//         const query = {};

//         // Add checkedFilters to query
//         if (checkedFilters && Array.isArray(checkedFilters) && checkedFilters.length > 0) {
//             query['category'] = { $in: checkedFilters }; // Assuming category is the field to filter by
//         }

//         // Add radioFilter to query
//         if (radioFilter) {
//             query['priceRange'] = radioFilter; // Assuming priceRange is the field to filter by
//         }

//         // Execute the query to find products based on filters
//         const products = await Product.find(query);

//         // Return the filtered products as a response
//         res.json(products);
//     } catch (error) {
//         console.error('Error applying filters:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


const updateProductController = async (req, res) => {
    const productId = req.params.productId;

    try {
        const { name, description, category, price, quantity, shipping, url, seatingCapacity, engine, transmission, fuelEfficiency, color, range, acceleration, chargingTime, popularity, trending, newArrivals, brand } = req.fields;
        const updateFields = {};

        if (name) updateFields.name = name;
        if (description) updateFields.description = description;
        if (category) updateFields.category = category;
        if (price) updateFields.price = price;
        if (quantity) updateFields.quantity = quantity;
        if (shipping) updateFields.shipping = shipping;
        if (popularity) updateFields.popularity = popularity; // Update based on req.fields
        if (trending) updateFields.trending = trending; // Update based on req.fields
        if (newArrivals) updateFields.newArrivals = newArrivals; // Update based on req.fields
        if (url) updateFields.url = url;
        if (seatingCapacity) updateFields.seatingCapacity = seatingCapacity; // Update based on req.fields
        if (engine) updateFields.engine = engine; // Update based on req.fields
        if (transmission) updateFields.transmission = transmission; // Update based on req.fields
        if (fuelEfficiency) updateFields.fuelEfficiency = fuelEfficiency; // Update based on req.fields
        if (color) updateFields.color = color; // Update based on req.fields
        if (range) updateFields.range = range; // Update based on req.fields
        if (acceleration) updateFields.acceleration = acceleration; // Update based on req.fields
        if (chargingTime) updateFields.chargingTime = chargingTime; // Update based on req.fields
        if (brand) updateFields.brand = brand; // Update based on req.fields


        // Update photo if provided
        if (req.files && req.files.photo) {
            const { photo } = req.files;
            if (photo.size > 1000000) {
                return res.status(400).send({ error: 'Image size should be less than 1MB' });
            }
            updateFields.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type
            };
        }

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });

        if (!updatedProduct) {
            return res.status(404).send({ error: 'Product not found' });
        }

        res.status(200).send({ success: true, message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).send({ error: 'Error updating product', details: error.message });
    }
};





const deleteProductController = async (req, res) => {
    const productId = req.params.productId;

    try {
        const product = await Product.findOneAndDelete({ _id: productId });

        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

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

        res.status(200).send({ success: true, product: product });
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

const getAllCategoryProductsController = async (req, res) => {
    const categoryId = req.params.categoryId; // Extract categoryId from request params
    try {
        const products = await Product.find({ category: categoryId }); // Find all products with the specified categoryId
        res.status(200).send({ success: true, products });
    } catch (error) {
        res.status(500).send({ error: 'Error getting category products', details: error.message });
    }
};



module.exports = {
    createProductController,
    getAllProductsController,
    updateProductController,
    deleteProductController,
    getSingleProductController,
    getProductPhotoController,
    filterProductsController,
    searchProductController,
    getAllCategoryProductsController
};
