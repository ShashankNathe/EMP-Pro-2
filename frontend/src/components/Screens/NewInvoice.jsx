import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Delete, Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { set } from "mongoose";
import { useNavigate } from "react-router-dom";

const NewInvoice = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [invoiceItems, setInvoiceItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [currentProduct, setCurrentProduct] = useState({});
  const [fetchComplete, setFetchComplete] = useState(false);
  const [hsn, setHsn] = useState("");
  const [unitPrice, setUnitPrice] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [gstText, setGstText] = useState("");
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [grandTotal, setgrandTotal] = useState(0);
  const [addingInvoice, setAddingInvoice] = useState(false);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!fetchComplete) {
      axios
        .get(`${baseUrl}/api/product`, { withCredentials: true })
        .then((res) => {
          setProducts(res.data);
          setFetchComplete(true);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Could not fetch products.",
            description: "An error occurred while fetching products.",
          });
          setFetchComplete(true);
        });
    }
  }, [fetchComplete]);

  useEffect(() => {
    let product = products.find((product) => product._id === selectedProduct);
    if (product) {
      let { gstAmountPerUnit, baseAmount } = calculateGSTAndBaseAmount(
        product.unit_price,
        product.gst
      );
      setHsn(product.HSN);
      setUnitPrice(product.unit_price);
      setTotalPrice(product.unit_price);
      setGstText(`(${product.gst}%) - ${(gstAmountPerUnit * 1).toFixed(2)}`);
      product.gst_per_unit = gstAmountPerUnit;
      setCurrentProduct(product);
    } else {
      setHsn("");
      setUnitPrice(0);
      setTotalPrice(0);
      setGstText("");
    }
  }, [selectedProduct]);

  function calculateGSTAndBaseAmount(taxInclusivePrice, gstRate) {
    gstRate = parseFloat(gstRate);
    const gstAmountPerUnit = (taxInclusivePrice * gstRate) / (100 + gstRate);
    const baseAmount = taxInclusivePrice - gstAmountPerUnit;

    return { gstAmountPerUnit, baseAmount };
  }
  function addItem(e) {
    e.preventDefault();
    if (!selectedProduct) {
      toast({
        variant: "destructive",
        title: "Please select a product",
      });
      return;
    }
    if (!quantity || quantity <= 0) {
      toast({
        variant: "destructive",
        title: "Please enter quantity",
      });
      return;
    }

    if (!totalPrice) {
      toast({
        variant: "destructive",
        title: "Please enter total price",
      });
      return;
    }
    let item = {
      product_name: currentProduct.name,
      quantity: quantity,
      hsn: hsn,
      unit_price: currentProduct.unit_price,
      gst: currentProduct.gst,
      tax: (currentProduct.gst_per_unit * quantity).toFixed(2),
      total_price: totalPrice,
    };
    let updatedItems = [...invoiceItems, item];
    setInvoiceItems(updatedItems);
    let tempTotalQty = 0;
    let tempGrandTotal = 0;
    let tempTotaltax = 0;
    updatedItems.forEach((i) => {
      tempTotalQty += parseInt(i.quantity);
      tempGrandTotal += parseFloat(i.total_price);
      tempTotaltax += parseFloat(i.tax);
    });
    setTotalQuantity(tempTotalQty);
    setgrandTotal(tempGrandTotal.toFixed(2));
    setTotalTax(tempTotaltax.toFixed(2));
    setSelectedProduct("");
    setHsn("");
    setUnitPrice(0);
    setQuantity(1);
    setTotalPrice(0);
    setGstText(0);
    document.getElementById("product_name").focus();
  }

  function deleteItem(index) {
    let item = invoiceItems[index];
    let updatedItems = invoiceItems.filter((item, i) => i !== index);
    setInvoiceItems(updatedItems);
    let tempTotalQty = 0;
    let tempGrandTotal = 0;
    let tempTotaltax = 0;
    updatedItems.forEach((i) => {
      tempTotalQty += parseInt(i.quantity);
      tempGrandTotal += parseFloat(i.total_price);
      tempTotaltax += parseFloat(i.tax);
    });
    setTotalQuantity(tempTotalQty);
    setgrandTotal(tempGrandTotal.toFixed(2));
    setTotalTax(tempTotaltax.toFixed(2));
  }

  function saveInvoice(e) {
    e.preventDefault();
    if (!invoiceItems.length) {
      toast({
        variant: "destructive",
        title: "Please add items to the invoice",
      });
      return;
    }
    setAddingInvoice(true);
    let data = {
      customer_name: document.getElementById("customer_name").value,
      customer_phone: document.getElementById("customer_phone").value,
      customer_address: document.getElementById("customer_address").value,
      invoice_date: document.getElementById("invoice_date").value,
      items: invoiceItems,
      total_amount: grandTotal,
    };
    axios
      .post(`${baseUrl}/api/invoice`, data, {
        withCredentials: true,
      })
      .then((res) => {
        // toast({
        //   variant: "success",
        //   title: "Invoice saved successfully",
        // });
        setAddingInvoice(false);
        navigate(`/invoices/${res.data._id}?printInvoice=true`);
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Could not save invoice",
          description: "An error occurred while saving the invoice",
        });
        setAddingInvoice(false);
      });
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <h2 className="text-2xl mb-2">New Invoice</h2>
        <Separator className="" />
      </CardHeader>
      <CardContent>
        <form>
          <div>
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 md:col-span-1">
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  type="text"
                  name="customer_name"
                  id="customer_name"
                  autoComplete="given-name"
                  className="mt-2"
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <Label htmlFor="invoice_date">Invoice Date</Label>
                <Input
                  type="date"
                  name="invoice_date"
                  id="invoice_date"
                  className="mt-2"
                />
              </div>
              <div className="col-span-3 md:col-span-1">
                <Label htmlFor="customer_phone">Customer Phone</Label>
                <Input
                  type="tel"
                  name="customer_phone"
                  id="customer_phone"
                  autoComplete="tel"
                  className="mt-2"
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="customer_address">Customer Address</Label>
                <Textarea
                  name="customer_address"
                  id="customer_address"
                  className="mt-2"
                />
              </div>
            </div>
            <Card className="mt-3">
              <CardHeader className="text-xl">Add Invoice Items</CardHeader>
              <CardContent>
                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 md:col-span-6 lg:col-span-3">
                    <Label htmlFor="product_name">Product Name</Label>
                    <select
                      id="product_name"
                      value={selectedProduct}
                      onChange={(e) => {
                        setSelectedProduct(e.target.value);
                      }}
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 mt-2"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => {
                        return (
                          <option key={product._id} value={product._id}>
                            {product.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-span-12 md:col-span-3 lg:col-span-2">
                    <Label htmlFor="hsn">HSN</Label>
                    <Input
                      type="text"
                      name="hsn"
                      id="hsn"
                      autoComplete="hsn"
                      className="mt-2"
                      value={hsn || ""}
                      onChange={(e) => setHsn(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="col-span-6 md:col-span-3 lg:col-span-1">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      type="number"
                      name="quantity"
                      id="quantity"
                      autoComplete="quantity"
                      className="mt-2"
                      min="1"
                      value={quantity || 1}
                      onChange={(e) => {
                        if (e.target.value >= 1) {
                          setQuantity(e.target.value);
                          setTotalPrice(e.target.value * unitPrice);
                          setGstText(
                            `(${currentProduct.gst}%) - ${(
                              currentProduct.gst_per_unit * e.target.value
                            ).toFixed(2)}`
                          );
                        } else {
                          setQuantity(1);
                          setTotalPrice(1 * unitPrice);
                          setGstText(
                            `(${currentProduct.gst}%) - ${(
                              currentProduct.gst_per_unit * 1
                            ).toFixed(2)}`
                          );
                        }
                      }}
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4 lg:col-span-2">
                    <Label htmlFor="unit_price">Unit Price</Label>
                    <Input
                      type="number"
                      name="unit_price"
                      id="unit_price"
                      autoComplete="unit-price"
                      className="mt-2"
                      value={unitPrice.toFixed(2) || 0}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4 lg:col-span-2">
                    <Label htmlFor="gst">Tax</Label>
                    <Input
                      type="text"
                      name="gst"
                      id="gst"
                      autoComplete="gst"
                      className="mt-2"
                      value={gstText || 0}
                      onChange={(e) => setGstText(e.target.value)}
                      disabled
                    />
                  </div>
                  <div className="col-span-6 md:col-span-4 lg:col-span-2">
                    <Label htmlFor="total_price">Total Price</Label>
                    <Input
                      type="number"
                      name="total_price"
                      id="total_price"
                      autoComplete="total-price"
                      className="mt-2"
                      value={totalPrice.toFixed(2) || 0}
                      onChange={(e) => setTotalPrice(e.target.value)}
                      disabled
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Button onClick={addItem}>Add Item</Button>
                </div>

                <div className="mt-4">
                  {invoiceItems.length > 0 && (
                    <>
                      <Table className="text-center">
                        <TableHeader className="text-center">
                          <TableRow>
                            <TableHead className="text-center">
                              Product Name
                            </TableHead>
                            <TableHead className="text-center">HSN</TableHead>
                            <TableHead className="text-center">
                              Quantity
                            </TableHead>
                            <TableHead className="text-center">
                              Unit Price
                            </TableHead>
                            <TableHead className="text-center">GST</TableHead>
                            <TableHead className="text-center">Total</TableHead>
                            <TableHead className="text-center">
                              <span className="sr-only">Actions</span>
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoiceItems.map((item, index) => {
                            return (
                              <TableRow key={index}>
                                <TableCell>{item.product_name}</TableCell>
                                <TableCell>{item.hsn}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{`₹ ${item.unit_price.toFixed(
                                  2
                                )}`}</TableCell>
                                <TableCell>{`₹ ${item.tax} (${item.gst}%)`}</TableCell>
                                <TableCell>{`₹ ${item.total_price.toFixed(
                                  2
                                )}`}</TableCell>
                                <TableCell>
                                  <Trash
                                    className="text-red-400 cursor-pointer"
                                    onClick={() => deleteItem(index)}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                          <TableRow className="font-bold">
                            <TableCell>Total</TableCell>
                            <TableCell></TableCell>
                            <TableCell>{totalQuantity}</TableCell>
                            <TableCell></TableCell>
                            <TableCell>{`₹ ${parseFloat(totalTax).toFixed(
                              2
                            )}`}</TableCell>
                            <TableCell>{`₹ ${grandTotal}`}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="mt-4 flex justify-end ">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500"
              onClick={saveInvoice}
              disabled={addingInvoice}
            >
              {addingInvoice ? "Saving..." : "Save & Print"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewInvoice;
