import React, { useEffect, useState } from "react";
import {
  File,
  PlusCircle,
  Copy,
  Truck,
  MoreVertical,
  CreditCard,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Separator } from "../ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import axios from "axios";
import { useToast } from "../ui/use-toast";
import { Link } from "react-router-dom";
import InvoiceTable from "../InvoiceTable";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);
  const { toast } = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!fetchComplete) {
      axios
        .get(`${baseUrl}/api/invoice`, { withCredentials: true })
        .then((res) => {
          setInvoices(res.data);
          if (res.data.length > 0) {
            setSelectedInvoice(res.data[0]);
          }
          setFetchComplete(true);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Could not fetch invoices.",
            description: "An error occurred while fetching invoices.",
          });
          setFetchComplete(true);
        });
    }
  }, [fetchComplete]);

  const deleteInvoice = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    axios
      .delete(`${baseUrl}/api/invoice/${selectedInvoice._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const deletedInvoiceIndex = invoices.findIndex(
          (emp) => emp._id === selectedInvoice._id
        );
        const updatedInvoices = [...invoices];
        updatedInvoices.splice(deletedInvoiceIndex, 1);
        setInvoices(updatedInvoices);
        setSelectedInvoice(updatedInvoices[0] || {});
        setDisableBtn(false);
        setOpen(false);
        toast({
          title: "Invoice deleted successfully",
        });
      })
      .catch((error) => {
        setDisableBtn(false);
        toast({
          variant: "destructive",
          title: "Error deleting Invoice.",
          description: error.response.data.message,
        });
      });
  };

  return (
    <>
      {/* <div className="grid gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 md:grid-cols-2 xl:grid-cols-3"> */}
      <div className="col-span-3 xl:col-span-2">
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                invoice and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  // setSelectedInvoice({});
                }}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={deleteInvoice} disabled={disableBtn}>
                {disableBtn ? "Deleting..." : "Continue"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Tabs defaultValue="active">
          <div className="flex items-center">
            <div className="ml-auto flex items-center gap-2">
              <Link to="/invoices/new">
                <Button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    New Invoice
                  </span>
                </Button>
              </Link>
            </div>
          </div>
          <TabsContent value="active">
            <Card x-chunk="dashboard-06-chunk-0">
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Manage your invoices.</CardDescription>
              </CardHeader>
              <CardContent>
                {fetchComplete && invoices.length > 0 ? (
                  <InvoiceTable
                    setOpen={setOpen}
                    data={invoices}
                    setSelectedInvoice={setSelectedInvoice}
                  />
                ) : !fetchComplete ? (
                  <p className="text-center">Loading...</p>
                ) : (
                  <p className="text-center">No invoices generated yet</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <div className="col-span-3 md:col-span-3 xl:col-span-1">
        <Card
          className="overflow-hidden min-h-[190px]"
          x-chunk="dashboard-05-chunk-4"
        >
          {selectedInvoice && Object.keys(selectedInvoice).length > 0 ? (
            <>
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Invoice No: {selectedInvoice.invoice_number}
                  </CardTitle>
                  <CardDescription>
                    Date:{" "}
                    {selectedInvoice.invoice_date &&
                      new Date(selectedInvoice.invoice_date).toLocaleDateString(
                        "en-GB"
                      )}
                  </CardDescription>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link
                        to={`/invoices/${selectedInvoice._id}?printInvoice=true`}
                      >
                        <DropdownMenuItem>Print</DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setOpen(true)}>
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Order Details</div>
                  <ul className="grid gap-3">
                    {selectedInvoice.items.map((item, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-muted-foreground">
                          {item.product_name} x <span>{item.quantity}</span>
                        </span>
                        <span>₹ {item.total_price}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between font-semibold">
                      <span className="text-muted-foreground">Total</span>
                      <span>₹ {selectedInvoice.total_amount}</span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Customer Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Customer</dt>
                      <dd>{selectedInvoice.customer_name}</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Address</dt>
                      <dd>
                        <address>{selectedInvoice.customer_address}</address>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">{selectedInvoice.customer_phone}</a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
            </>
          ) : !fetchComplete ? (
            <div className="flex items-center justify-center h-[180px]">
              Loading...
            </div>
          ) : (
            <div className="flex items-center justify-center h-[180px]">
              No Invoices
            </div>
          )}
        </Card>
      </div>
      {/* </div> */}
    </>
  );
};

export default Invoices;
