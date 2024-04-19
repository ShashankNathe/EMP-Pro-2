import express from 'express';
import {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
} from '../controllers/invoiceController.js';
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router();
router.use(protect);
router.route('/')
    .get(getInvoices)
    .post(createInvoice);

router.route('/:id')
    .get(getInvoiceById)
    .patch(updateInvoice)
    .delete(deleteInvoice);

export default router;