const Product = require("../models/Products");

// 1. GET ALL PRODUCTS
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ id: 1 });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 2. GET PRODUCT BY ID
exports.getProductById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid Product ID' });
        }

        const product = await Product.findOne({ id: id });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. POST - CREATE NEW PRODUCT
exports.createProduct = async (req, res) => {
    try {
        let newId = req.body.id;
        if (!newId) {
            const lastProduct = await Product.findOne().sort({ id: -1 });
            newId = lastProduct ? lastProduct.id + 1 : 1;
        }

        const product = await Product.create({ ...req.body, id: newId });
        res.status(201).json({
            success: true,
            message: 'Product added successfully',
            data: product
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 4. PUT - UPDATE PRODUCT BY ID
exports.updateProduct = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ success: false, message: 'Invalid Product ID' });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { id: id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: updatedProduct
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// 5. LOW-STOCK PRODUCTS (stock <= low_stock)
exports.getLowStockProducts = async (req, res) => {
    try {
        const lowStockItems = await Product.find({
            $expr: { $lte: ["$stock", "$low_stock"] }
        }).sort({ stock: 1 });

        res.status(200).json({
            success: true,
            count: lowStockItems.length,
            data: lowStockItems
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 6. CATEGORY SUMMARY
// 6. CATEGORY SUMMARY
exports.getCategorySummary = async (req, res) => {
    try {
        const summary = await Product.aggregate([
            {
                $group: {
                    _id: "$category",
                    total_products: { $sum: 1 },
                    total_stock: { $sum: "$stock" },
                    avg_price: { $avg: "$price" },
                    min_price: { $min: "$price" },
                    max_price: { $max: "$price" }
                }
            },
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    total_products: 1,
                    total_stock: 1,
                    avg_price: { $round: ["$avg_price", 2] },
                    min_price: 1,
                    max_price: 1
                }
            },
            { $sort: { category: 1 } }
        ]);

        res.status(200).json({
            success: true,
            count: summary.length,
            data: summary
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};