import mongoose from 'mongoose';

const invoiceSchema = mongoose.Schema({
    customer_name: {
      type: String,
      required: true,
    },
    customer_phone: String,
    customer_address: String,
    invoice_number: {
        type: String,
        unique: true
    },
    invoice_date: {
        type: Date,
        required: true
    },
    items: [{
      product_name: String,
      hsn: String,
      gst: Number,
      tax: Number,
      quantity: Number,
      unit_price: Number,
      total_price: Number
    }],
    owner_id: String,
    total_amount: {
        type: Number,
        required: true
    },
},{
    timestamps: true
})

invoiceSchema.pre('save', function(next) {
    if (this.isNew) {
      const currentDate = new Date();
      const formattedDate = currentDate.getFullYear().toString().slice(-2) + 
                            ('0' + (currentDate.getMonth() + 1)).slice(-2) + 
                            ('0' + currentDate.getDate()).slice(-2);
      const invoiceNumber = "INV" + formattedDate + this._id.toString().slice(-4);
      this.invoice_number = invoiceNumber;
    }
    next();
  });

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;