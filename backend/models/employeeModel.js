import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import e from "express";

const employeeSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        owner_id: String,
        position: {
            type: String,
        },
        salary: {
            type: Number,
            required: true,
        },
        attendance: [{
            date: {
                type: Date,
            },
            status: {
                type: String,
                enum: ['Present', 'Absent', 'Late', 'Half Day', 'On Leave']
            }
        }],
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
        address: {
            type: String,
        },
        mobile_no: {
            type: Number,
        },
    }, {
    timestamps: true
}
)

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;