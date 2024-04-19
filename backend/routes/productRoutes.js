import express from 'express';
import { 
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addstockHistory,
    editStockHistory,
    deleteStockHistory
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();
router.use(protect);
router.route('/')
    .get(getProducts)
    .post(createProduct);

router.route('/:id')
    .get(getProductById)
    .patch(updateProduct)
    .delete(deleteProduct);

router.route('/:id/stockhistory')
    .post(addstockHistory)
    .patch(editStockHistory)
    .delete(deleteStockHistory);

export default router;