import React from "react";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
const EditProduct = ({
  products,
  setProducts,
  selectedProduct,
  disableBtn,
  setDisableBtn,
  isOpen,
  setIsOpen,
}) => {
  const { toast } = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  const editProduct = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    axios
      .patch(
        `${baseUrl}/api/product/${selectedProduct._id}`,
        {
          name: e.target.name.value,
          HSN: e.target.HSN.value,
          unit_price: e.target.unit_price.value,
          gst: e.target.gst.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        const editedProductIndex = products.findIndex(
          (emp) => emp._id === selectedProduct._id
        );
        const updatedProducts = [...products];
        updatedProducts[editedProductIndex] = res.data;
        setProducts(updatedProducts);
        setDisableBtn(false);
        toast({
          title: "Product data edited successfully",
        });
        setIsOpen(false);
      })
      .catch((error) => {
        setDisableBtn(false);
        toast({
          variant: "destructive",
          title: "Error editing Product.",
          description: error.response.data.message,
        });
      });
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit product</DialogTitle>
          <DialogDescription>
            Make changes in the product. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={editProduct} className="h-full flex flex-col">
          <div className="grid gap-2 mt-5 mb-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="chair"
              defaultValue={selectedProduct.name}
              required
            />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="HSN">HSN/SAC No</Label>
            <Input
              id="HSN"
              type="text"
              placeholder="xxxxxxx"
              defaultValue={selectedProduct.HSN}
              required
            />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="unit_price">Unit Price</Label>
            <Input
              id="unit_price"
              type="number"
              placeholder="1200"
              defaultValue={selectedProduct.unit_price}
              required
            />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="gst">GST %</Label>
            <Input
              id="gst"
              type="number"
              placeholder="5"
              defaultValue={selectedProduct.gst}
              required
            />
          </div>
          <div className="mt-auto">
            <Button type="submit" className="w-full" disabled={disableBtn}>
              {disableBtn ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProduct;
