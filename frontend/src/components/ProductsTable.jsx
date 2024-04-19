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
import { Link } from 'react-router-dom'

const ProductsTable = ({ data, setOpen, setSelectedProduct, setIsOpen }) => {
    return (<>
        <Table className='text-center'>
            <TableHeader className='text-center'>
                <TableRow>
                    <TableHead className='text-center'>Name</TableHead>
                    <TableHead className='text-center'>Unit Price</TableHead>
                    <TableHead className="hidden md:table-cell text-center">HSN/SAC</TableHead>
                    <TableHead className="hidden md:table-cell text-center">Created at</TableHead>
                    <TableHead className='text-center'><span className="sr-only">Actions</span></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {
                    data && data.map((product) => {
                        return (
                            <TableRow key={product._id}>
                                <TableCell className="font-medium">{product.name}</TableCell>
                                <TableCell>{product.unit_price}</TableCell>
                                <TableCell className="hidden md:table-cell">{product.HSN}</TableCell>
                                <TableCell className="hidden md:table-cell">{(new Date(product.createdAt)).toLocaleDateString('en-GB')}</TableCell>
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
                                            <Link to={`/products/${product._id}`}>
                                                <DropdownMenuItem className='w-full'>View</DropdownMenuItem>
                                            </Link>
                                            <DropdownMenuItem onClick={() => {
                                                setSelectedProduct(product)
                                                setIsOpen(true)
                                            }}>
                                                Edit
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => {
                                                setSelectedProduct(product)
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

export default ProductsTable