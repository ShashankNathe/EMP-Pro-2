import express from 'express'
import {
    addEmployee,
    editEmployee,
    getEmployees,
    getEmployeeById,
    deleteEmployee,
    addAttendance,
    editAttendance,
    deleteAttendance,
    addBulkAttendance
} from '../controllers/employeeController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()
router.use(protect)
router.route('/')
    .get(getEmployees)
    .post(addEmployee);
router.route('/:id')
    .get(getEmployeeById)
    .patch(editEmployee)
    .delete(deleteEmployee);

router.post('/attendance', addBulkAttendance);
router.post('/:id/attendance', addAttendance);
router.patch('/:id/attendance', editAttendance);
router.delete('/:id/attendance', deleteAttendance);

export default router