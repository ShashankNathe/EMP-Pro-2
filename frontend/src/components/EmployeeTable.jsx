import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
    MoreHorizontal,
} from "lucide-react"
import { SheetTrigger } from "./ui/sheet"
import { Link } from 'react-router-dom'

const EmployeeTable = ({ data, setOpen, setSelectedEmployee, setIsOpen}) => {
    return (<>
        <Table className='text-center'>
            <TableHeader className='text-center'>
                <TableRow>
                    <TableHead className='text-center'>Name</TableHead>
                    <TableHead className='text-center'>Status</TableHead>
                    <TableHead className="hidden md:table-cell text-center">
                        Salary
                    </TableHead>
                    <TableHead className="hidden md:table-cell text-center">
                        Created at
                    </TableHead>
                    <TableHead className='text-center'>
                        <span className="sr-only">Actions</span>
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data && data.map((employee) => {
                        return (
                            <TableRow key={employee._id}>
                                <TableCell className="font-medium">
                                    {employee.name}
                                </TableCell>
                                <TableCell>
                                    <Badge variant={employee.status == 'Active' ? 'default' : 'secondary'} className={employee.status == 'Active' ? 'bg-sky-400' : ''}>{employee.status}</Badge>

                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {employee.salary}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                    {(new Date(employee.createdAt)).toLocaleDateString('en-GB')}
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                aria-haspopup="true"
                                                size="icon"
                                                variant="ghost"
                                                >
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <Link to={`/employees/${employee._id}`}>
                                                <DropdownMenuItem className='w-full'>View</DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem onClick={()=>{
                                                setSelectedEmployee(employee)
                                                setIsOpen(true)
                                            }}>
                                                Edit
                                            </DropdownMenuItem>
                                            {/* <EditEmployee asChild employees={employees} setEmployees={setEmployees} selectedEmployee={setSelectedEmployee} disableBtn={disableBtn} setDisableBtn={setDisableBtn} onClick={() => setSelectedEmployee(employee)}> */}
                                                {/* <DropdownMenuItem asChild className='w-full'>Edit</DropdownMenuItem> */}
                                            {/* </EditEmployee> */}
                                            <DropdownMenuItem onClick={() => {
                                                setSelectedEmployee(employee)
                                                setOpen(true)
                                            }}>Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
        </>
    )
}

export default EmployeeTable