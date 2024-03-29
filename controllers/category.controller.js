const { default: slugify } = require('slugify');
const dotenv = require('dotenv');
dotenv.config();
const JWT = require('jsonwebtoken')
const categoryModel = require('../models/categoryModel');

const asyncWrapper = require('../middleware/asyncWrapper')


const getSingleCategoryController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Category id is required' });
        }

        const category = await categoryModel.findOne({ _id: id });

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Get Single Category Successfully',
            category,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: 'Error getting category',
        });
    }
};




const getAllCategoriesController = async (req, res) => {
    try {
        const categories = await categoryModel.find();

        res.status(200).send({
            success: true,
            categories,
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: 'Error getting categories',
        });
    }
};

const createCategoryController = async (req, res) => {
    try {
        const { name, status } = req.body
        if (!name) {
            return res.status(401).send({ message: 'Name is required' })
        }
        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: 'Category Already Exist'
            })
        }
        const category = await new categoryModel({ name, status, slug: slugify(name) }).save()
        res.status(200).send({
            success: true,
            message: 'new cateogry created',
            category
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: 'Error in Category'
        })
    }
}

const updateCategoryController = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { name, status } = req.body;

        // Validate required fields
        if (!categoryId || !name) {
            return res.status(400).json({ success: false, message: 'Category ID and Name are required' });
        }

        // Update category document
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            categoryId,
            {
                name,
                status,
                slug: slugify(name), // Assuming you have a function to generate slug
            },
            { new: true } // Return the updated document
        );

        // Check if category was found and updated
        if (!updatedCategory) {
            return res.status(404).json({ success: false, message: 'Category not found' });
        }

        // Return success response with updated category
        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            updatedCategory,
        });

    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({
            success: false,
            error,
            message: 'Error updating category',
        });
    }
};


const deleteCategoryController = async (req, res) => {
    try {

        const { categoryId } = req.params;

        if (!categoryId) {
            return res.status(400).json({ message: 'Category ID is required' });
        }

        const deletedCategory = await categoryModel.findOneAndDelete({ _id: categoryId });

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        res.status(204).json({
            success: true,
            message: 'Category deleted successfully',
            category: deletedCategory,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error,
            message: 'Error deleting category',
        });
    }
};


module.exports = {
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
    getAllCategoriesController,
    getSingleCategoryController
};
