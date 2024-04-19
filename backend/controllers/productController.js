import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

const createProduct = asyncHandler(async (req, res) => {
    try {
        const { name, HSN, unit_price, gst } = req.body;
        const product = await Product.create({ name, HSN, unit_price, gst, owner_id: req.user._id});
        res.status(201).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const getProducts =asyncHandler(async (req, res) => {
    try {
        const products = await Product.find({owner_id: req.user._id});
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const updateProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = req.body.name || product.name;
            product.HSN = req.body.HSN || product.HSN;
            product.unit_price = req.body.unit_price || product.unit_price;
            // product.quantity = req.body.quantity || product.quantity;
            product.gst = req.body.gst || product.gst;
            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const deleteProduct = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.status(200).json({ message: 'Product removed' });
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const addstockHistory = asyncHandler(async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
   
        const date = new Date();
        const existingRecord = product.stock_records.find(p => p.date.toDateString() === date.toDateString());
        if (existingRecord) {
            return res.status(400).json({ message: 'Product stock record for today already exists' });
        }

        const { quantity, type } = req.body;
        product.stock_records.push({ date, quantity, type });
        await product.save();
        res.status(200).json({ message: 'Stock history added' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const editStockHistory = asyncHandler(async (req, res) => {
    const { date, status } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const date = new Date();
        const existingRecord = product.stock_records.find(p => p.date.toDateString() === date.toDateString());
        if (existingRecord) {
            return res.status(400).json({ message: 'Product stock record for today already exists' });
        }

        const { quantity, type } = req.body;
        product.stock_records.push({ date, quantity, type });

        res.status(200).json({ message: 'Product record updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const deleteStockHistory = asyncHandler(async (req, res) => {
    
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        const { date } = req.body;
        const existingRecord = product.stock_records.findIndex(p => p.date.toDateString() === new Date(date).toDateString());
        if (existingRecord === -1) {
            return res.status(404).json({ message: 'Product stock record not found for the specified date' });
        }

        product.stock_record.splice(existingRecord, 1);
        await product.save();

        res.status(200).json({ message: 'Product record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


export {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addstockHistory,
    editStockHistory,
    deleteStockHistory
}


