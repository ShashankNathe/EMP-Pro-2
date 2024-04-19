import React, { useEffect, useState } from "react";
import { File } from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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

import axios from "axios";
import { useToast } from "../ui/use-toast";
import EmployeeTable from "../EmployeeTable";
import AddProduct from "../AddProduct";
import EditEmployee from "../EditEmployee";
import UpdateAttendance from "../UpdateAttendance";
import ProductDetails from "./ProductDetails";
import ProductsTable from "../ProductsTable";
import EditProduct from "../EditProduct";
const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState({});
  const [disableBtn, setDisableBtn] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);
  const { toast } = useToast();

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

  const deleteProduct = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    axios
      .delete(`${baseUrl}/api/product/${selectedProduct._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const deletedProductIndex = products.findIndex(
          (emp) => emp._id === selectedProduct._id
        );
        const updatedEmployees = [...products];
        updatedEmployees.splice(deletedProductIndex, 1);
        setProducts(updatedEmployees);
        setSelectedProduct({});
        setDisableBtn(false);
        setOpen(false);
        toast({
          title: "Product deleted successfully",
        });
      })
      .catch((error) => {
        setDisableBtn(false);
        toast({
          variant: "destructive",
          title: "Error deleting Product.",
          description: error.response.data.message,
        });
      });
  };

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 col-span-3">
      <EditProduct
        asChild
        products={products}
        setProducts={setProducts}
        selectedProduct={selectedProduct}
        disableBtn={disableBtn}
        setDisableBtn={setDisableBtn}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedProduct({});
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteProduct} disabled={disableBtn}>
              {disableBtn ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Tabs defaultValue="active">
        <div className="flex items-center">
          <div className="ml-auto flex items-center gap-2">
            <AddProduct
              setDisableBtn={setDisableBtn}
              setProducts={setProducts}
              disableBtn={disableBtn}
            />
          </div>
        </div>
        <TabsContent value="active">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Manage your products.</CardDescription>
            </CardHeader>
            <CardContent>
              {fetchComplete && products && products.length > 0 ? (
                <ProductsTable
                  setIsOpen={setIsOpen}
                  data={products}
                  setOpen={setOpen}
                  setSelectedProduct={setSelectedProduct}
                />
              ) : !fetchComplete ? (
                <p className="text-center">Loading...</p>
              ) : (
                <p className="text-center">No products added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Products;
