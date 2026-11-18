const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    brand: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    colour: { type: String, required: true },
    size: { type: Number, required: true },
    material: { type: String, required: true },
    stock: { type: Number, required: true },
    low_stock: { type: Number, required: true }
}, {
    versionKey: false
});

module.exports = mongoose.model('Product', productSchema);