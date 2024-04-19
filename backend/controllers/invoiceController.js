import asyncHandler from 'express-async-handler';
import Invoice from '../models/invoiceModel.js';

const createInvoice = asyncHandler(async (req, res) => {
    try {
        const { invoice_date, customer_name, customer_phone, customer_address, items, total_amount } = req.body;
        const invoice = await Invoice.create({ invoice_date, customer_name,customer_phone, customer_address, items, total_amount, owner_id: req.user._id});
        res.status(201).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const getInvoices = asyncHandler(async (req, res) => {
    try {
        let query = {owner_id: req.user._id };
        // if (req.query.lastTwoWeeks === 'true') {
        //     const twoWeeksAgo = new Date();
        //     twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        //     // query = { createdAt: { $gte: twoWeeksAgo } };
        //     query.createtAt = { $gte: twoWeeksAgo };
        // }
        const invoices = await Invoice.find(query);
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const getInvoiceById = asyncHandler(async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            res.status(200).json(invoice);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const updateInvoice = asyncHandler(async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            invoice.invoice_no = req.body.invoice_no || invoice.invoice_no;
            invoice.date = req.body.date || invoice.date;
            invoice.customer_name = req.body.customer_name || invoice.customer_name;
            invoice.customer_address = req.body.customer_address || invoice.customer_address;
            invoice.items = req.body.items || invoice.items;
            invoice.total_amount = req.body.total_amount || invoice.total_amount;
            const updatedInvoice = await invoice.save();
            res.status(200).json(updatedInvoice);
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const deleteInvoice = asyncHandler(async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (invoice) {
            await invoice.deleteOne();
            res.status(200).json({ message: 'Invoice removed' });
        } else {
            res.status(404).json({ message: 'Invoice not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

export {
    createInvoice,
    getInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
};
