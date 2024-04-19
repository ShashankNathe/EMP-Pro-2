import mongoose from 'mongoose';

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    HSN: {
        type: String,
        required: true,
    },
    unit_price: {
        type: Number,
        required: true,
    },
    owner_id: String,
    // quantity: {
    //     type: Number,
    //     required: true,
    // },
    gst: {
        type: Number,
        required: true,
    },
    stock_records: [{
        date: Date,
        quantity: Number,
        type: String
    }],
}, {
    timestamps: true
})


const Product = mongoose.model('Product', productSchema)

export default Product