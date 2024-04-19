import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import "./print.css";
import { useToast } from "../ui/use-toast";
import { numberToWords } from "number-to-words";
import { useAuth } from "../../context/AuthContext";

const InvoiceDetails = () => {
  const { user } = useAuth();
  const [invoice, setInvoice] = useState({});
  const [fetchComplete, setFetchComplete] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [groupedItems, setGroupedItems] = useState({});
  const params = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const { toast } = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!fetchComplete) {
      axios
        .get(`${baseUrl}/api/invoice/${params.id}`, {
          withCredentials: true,
        })
        .then((res) => {
          setInvoice(res.data);
          setFetchComplete(true);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Could not fetch invoice.",
            description: "An error occurred while fetching invoice.",
          });
          setFetchComplete(true);
        });
    }
  }, [fetchComplete]);

  const printInvoice = () => {
    window.print();
  };

  useEffect(() => {
    if (invoice && invoice.items) {
      const totalQuantity = invoice.items.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
      const totalAmount = invoice.items.reduce(
        (acc, item) => acc + item.total_price,
        0
      );
      const totalTax = invoice.items.reduce((acc, item) => acc + item.tax, 0);
      setTotalQuantity(totalQuantity);
      setTotalAmount(totalAmount);
      setTotalTax(totalTax);

      const groupedItems = invoice.items.reduce((acc, item) => {
        if (!acc[item.gst]) {
          acc[item.gst] = [];
        }
        acc[item.gst].push(item);
        return acc;
      }, {});
      setGroupedItems(groupedItems);
    }
    if (fetchComplete) {
      const paramValue = searchParams.get("printInvoice");
      if (paramValue) {
        printInvoice();
      }
    }
  }, [fetchComplete]);

  return (
    <>
      <div className="col-span-3 flex justify-end me-2">
        <Button onClick={printInvoice}>Print</Button>
      </div>
      <Card
        className="m-2 mt-0 col-span-3 print min-w-[500px] overflow-auto"
        id="invoice"
      >
        <CardHeader className="text-center">
          <CardTitle>{user.company_name}</CardTitle>
          <CardDescription className="pb-3">
            {user.company_address}
            <br />
            {user.company_description}
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6">
            <div className="grid gap-2 col-span-4 items-start">
              <div className="font-semibold">Customer Information</div>
              <dl className="grid gap-2">
                <div className="flex items-center justify-start gap-2">
                  <dt className="text-muted-foreground">Name:</dt>
                  <dd>{invoice.customer_name}</dd>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <dt className="text-muted-foreground">Address:</dt>
                  <dd>
                    <address>{invoice.customer_address}</address>
                  </dd>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <dt className="text-muted-foreground">Phone: </dt>
                  <dd>
                    <a href="tel:">{invoice.customer_phone}</a>
                  </dd>
                </div>
              </dl>
            </div>
            <div className="grid gap-2 col-span-2 items-start">
              <dl className="grid gap-2">
                <div className="flex items-center justify-start gap-2">
                  <dt className="text-muted-foreground">Invoice No:</dt>
                  <dd>{invoice.invoice_number}</dd>
                </div>
                <div className="flex items-center justify-start gap-2">
                  <dt className="text-muted-foreground">Invoice Date:</dt>
                  <dd>
                    {invoice.invoice_date &&
                      new Date(invoice.invoice_date).toLocaleDateString(
                        "en-GB"
                      )}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <h3 className="text-center mb-3">Tax Invoice</h3>
          <Table className="text-center text-xs">
            <TableHeader className="text-center font-bold bg-slate-100 p-0">
              <TableRow className="p-0">
                <TableHead className="text-center p-0 h-9 font-bold">
                  #
                </TableHead>
                <TableHead className="text-center p-0 h-9 font-bold">
                  Product Name
                </TableHead>
                <TableHead className="text-center p-0 h-9 font-bold">
                  HSN
                </TableHead>
                <TableHead className="text-center p-0 h-9 font-bold">
                  Quantity
                </TableHead>
                <TableHead className="text-center p-0 h-9 font-bold">
                  Unit Price
                </TableHead>
                <TableHead className="text-center p-0 h-9 font-bold">
                  GST
                </TableHead>
                <TableHead className="text-center p-0 h-9 font-bold">
                  Total
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!fetchComplete && (
                <TableRow>
                  <TableCell className="text-center p-0 py-2" colSpan="7">
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {fetchComplete && invoice.items && invoice.items.length === 0 && (
                <TableRow>
                  <TableCell className="text-center p-0 py-2" colSpan="7">
                    No items in this invoice.
                  </TableCell>
                </TableRow>
              )}
              {invoice.items &&
                invoice.items.length > 0 &&
                invoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="text-center p-0 py-2">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center p-0 py-2">
                      {item.product_name}
                    </TableCell>
                    <TableCell className="text-center p-0 py-2">
                      {item.hsn}
                    </TableCell>
                    <TableCell className="text-center p-0 py-2">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-center p-0 py-2">
                      ₹ {item.unit_price && item.unit_price.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-center p-0 py-2">
                      ₹{item.tax && item.tax.toFixed(2)} ({item.gst}%)
                    </TableCell>
                    <TableCell className="text-center p-0 py-2">
                      ₹{item.total_price && item.total_price.toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              <TableRow className="font-bold bg-slate-50 text-muted-foreground ">
                <TableCell className="text-center p-0 py-2"></TableCell>
                <TableCell className="text-center p-0 py-2">Total</TableCell>
                <TableCell className="text-center p-0 py-2"></TableCell>
                <TableCell className="text-center p-0 py-2">
                  {totalQuantity}
                </TableCell>
                <TableCell className="text-center p-0 py-2"></TableCell>
                <TableCell className="text-center p-0 py-2">
                  ₹{totalTax && totalTax.toFixed(2)}
                </TableCell>
                <TableCell className="text-center p-0 py-2">
                  ₹{invoice.total_amount && invoice.total_amount.toFixed(2)}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <div className="grid gap-3 grid-cols-6 my-2 justify-between mt-4">
            <div className="grid gap-3 col-span-3 items-start border rounded p-2">
              <Table className="text-xs text-center">
                <TableHeader>
                  <TableRow className="text-center p-0 h-9">
                    <TableHead className="text-center p-0 h-9">
                      Tax Type
                    </TableHead>
                    <TableHead className="text-center p-0 h-9">
                      Taxable Amount
                    </TableHead>
                    <TableHead className="text-center p-0 h-9">Rate</TableHead>
                    <TableHead className="text-center p-0 h-9">
                      Tax Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="p-0 text-center">
                  {Object.keys(groupedItems).map((key, index) => {
                    const items = groupedItems[key];
                    const totalTax = items.reduce(
                      (acc, item) => acc + item.tax,
                      0
                    );
                    const totalAmount = items.reduce(
                      (acc, item) => acc + item.total_price,
                      0
                    );
                    return (
                      <React.Fragment key={key + "" + index}>
                        <TableRow className="p-0">
                          <TableCell className="p-0 py-2">CGST</TableCell>
                          <TableCell className="p-0 py-2">
                            {totalAmount}
                          </TableCell>
                          <TableCell className="p-0 py-2">{key / 2}%</TableCell>
                          <TableCell className="p-0 py-2">
                            {totalTax / 2}
                          </TableCell>
                        </TableRow>
                        <TableRow className="p-0">
                          <TableCell className="p-0 py-2">SGST</TableCell>
                          <TableCell className="p-0 py-2">
                            {totalAmount}
                          </TableCell>
                          <TableCell className="p-0 py-2">{key / 2}%</TableCell>
                          <TableCell className="p-0 py-2">
                            {totalTax / 2}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="col-span-3 items-start justify-start p-2 pt-0 text-muted-foreground text-xs font-bold">
              <dl className="mt-4 mb-2 pb-[5px]">
                <div className="flex items-center justify-start gap-3">
                  <dt className="text-muted-foreground text-xs font-semibold">
                    Grand Total:
                  </dt>
                  <dd>
                    ₹{invoice.total_amount && invoice.total_amount.toFixed(2)}
                  </dd>
                </div>
              </dl>
              <Separator />
              <dl className="my-3">
                <div className="flex items-center justify-start gap-3">
                  <dt className="text-muted-foreground text-xs font-semibold">
                    Amount In Words:
                  </dt>
                  <dd className="capitalize">
                    {invoice.total_amount &&
                      `${numberToWords.toWords(
                        invoice.total_amount.toFixed(2)
                      )} Rupees only`}
                  </dd>
                </div>
              </dl>
              <Separator />
            </div>
          </div>
          <div className="flex justify-end">
            <div className="mt-3 text-center">
              <h3 className="mb-20">{user.company_name}</h3>
              <p>Authorized Signatory</p>
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </>
  );
};

export default InvoiceDetails;
