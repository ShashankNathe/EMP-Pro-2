import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const InvoiceTable = ({ data, setOpen, setSelectedInvoice }) => {
  return (
    <>
      <Table className="text-center">
        <TableHeader className="text-center">
          <TableRow>
            <TableHead className="text-center">Customer Name</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Invoice No
            </TableHead>
            <TableHead className="hidden md:table-cell text-center">
              Created At
            </TableHead>
            <TableHead className="text-center">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data &&
            data.map((invoice) => {
              return (
                <TableRow
                  key={invoice._id}
                  onClick={() => setSelectedInvoice(invoice)}
                >
                  <TableCell className="font-medium">
                    {invoice.customer_name}
                  </TableCell>
                  <TableCell>₹ {invoice.total_amount}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    {invoice.invoice_number}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {new Date(invoice.createdAt).toLocaleDateString("en-GB")}
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
                        <Link to={`/invoices/${invoice._id}`}>
                          <DropdownMenuItem className="w-full">
                            View
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setOpen(true);
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  );
};

export default InvoiceTable;
