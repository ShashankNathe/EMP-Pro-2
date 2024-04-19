import asyncHandler from 'express-async-handler'
import Employee from '../models/employeeModel.js'

const addEmployee = asyncHandler(async (req, res) => {
    const { name, position, salary, address, mobile_no } = req.body

    const employee = await Employee.create({
        name,
        position,
        salary,
        mobile_no,
        address,
        owner_id: req.user._id
    })

    res.status(201).json({
        _id: employee._id,
        name: employee.name,
        position: employee.position,
        salary: employee.salary,
        status: employee.status,
        address: employee.address,
        mobile_no: employee.mobile_no,
        createdAt: employee.createdAt,
    })
})

const editEmployee = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    const { name, position, salary, status, address, mobile_no } = req.body;
    try {

        const employee = await Employee.findById(employeeId)
        if (!employee) {
            return res.status(400).json({
                message: 'Could not find user!'
            })
        }

        employee.name = name || employee.name;
        employee.position = position || employee.position;
        employee.salary = salary || employee.salary
        employee.status = status || employee.status
        employee.address = address || employee.address
        employee.mobile_no = mobile_no || employee.mobile_no

        const updatedEmployee = await employee.save()
        res.status(200).json({
            _id: updatedEmployee._id,
            name: updatedEmployee.name,
            position: updatedEmployee.position,
            salary: updatedEmployee.salary,
            status: updatedEmployee.status,
            address: updatedEmployee.address,
            mobile_no: updatedEmployee.mobile_no,
            attendance: employee.attendance
        })
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const getEmployees = asyncHandler(async (req, res) => {
    try {
        const employees = await Employee.find({owner_id: req.user._id });
        res.status(200).json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const getEmployeeById = asyncHandler(async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const deleteEmployee = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;

    try {
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        await employee.deleteOne();

        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const addBulkAttendance = asyncHandler(async (req, res) => {
    const {attendance} = req.body;
    const date = new Date();
    console.log(attendance)
    try {
        const bulkOperations = attendance.map(data => ({
            updateOne: {
                filter: { _id: data.id },
                update: {
                    $addToSet: {
                        attendance: { date: date, status: data.status }
                    }
                },
                upsert: true
            }
        }));
        await Employee.bulkWrite(bulkOperations);

        res.status(201).json({ message: 'Attendance records added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const addAttendance = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    const { status } = req.body;
    const date = new Date();

    try {
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const existingAttendance = employee.attendance.find(att => att.date.toDateString() === date.toDateString());
        if (existingAttendance) {
            return res.status(400).json({ message: 'Attendance record for today already exists' });
        }

        employee.attendance.push({ date, status });
        const updatedEmployee = await employee.save();

        res.status(201).json({ 
            _id: updatedEmployee._id,
            name: updatedEmployee.name,
            position: updatedEmployee.position,
            salary: updatedEmployee.salary,
            status: updatedEmployee.status,
            address: updatedEmployee.address,
            mobile_no: updatedEmployee.mobile_no,
            attendance: updatedEmployee.attendance
         });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
})

const editAttendance = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    const { date, status } = req.body;

    try {
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        let existingAttendance = employee.attendance.find(att => att.date && new Date(att.date) && new Date(att.date).toDateString() === new Date(date).toDateString());
        if (!existingAttendance) {
            // return res.status(404).json({ message: 'Attendance record not found for the specified date' });
            addAttendance(req, res);
            // existingAttendance = employee.attendance.find(att => att.date && new Date(att.date) && new Date(att.date).toDateString() === new Date(date).toDateString());
        }else{
            existingAttendance.status = status;
            const updatedEmployee = await employee.save();
            res.status(200).json({  
                 _id: updatedEmployee._id,
                name: updatedEmployee.name,
                position: updatedEmployee.position,
                salary: updatedEmployee.salary,
                status: updatedEmployee.status,
                address: updatedEmployee.address,
                mobile_no: updatedEmployee.mobile_no,
                attendance: updatedEmployee.attendance });
        }
       
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

const deleteAttendance = asyncHandler(async (req, res) => {
    const employeeId = req.params.id;
    const { date } = req.body;

    try {
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        const existingAttendanceIndex = employee.attendance.findIndex(att => att.date.toDateString() === new Date(date).toDateString());
        if (existingAttendanceIndex === -1) {
            return res.status(404).json({ message: 'Attendance record not found for the specified date' });
        }

        employee.attendance.splice(existingAttendanceIndex, 1);
        await employee.save();

        res.status(200).json({ message: 'Attendance record deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export {
    addEmployee,
    editEmployee,
    getEmployees,
    getEmployeeById,
    deleteEmployee,
    addAttendance,
    editAttendance,
    deleteAttendance,
    addBulkAttendance
};