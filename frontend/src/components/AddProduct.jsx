import React from "react";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { PlusCircle } from "lucide-react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import { Textarea } from "./ui/textarea";
const AddProduct = ({ disableBtn, setDisableBtn, setProducts }) => {
  const { toast } = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  const addProduct = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    axios
      .post(
        `${baseUrl}/api/product`,
        {
          name: e.target.name.value,
          HSN: e.target.HSN.value,
          unit_price: e.target.unit_price.value,
          gst: e.target.gst.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setProducts((prevProducts) => [...prevProducts, res.data]);
        setDisableBtn(false);
        toast({
          title: "Product added successfully",
        });
        e.target.name.value = "";
        e.target.HSN.value = "";
        e.target.unit_price.value = "";
        e.target.gst.value = "";
      })
      .catch((error) => {
        setDisableBtn(false);
        toast({
          variant: "destructive",
          title: "Error adding Product.",
          description: error.response.data.message,
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 h-8 gap-1">
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Product
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={addProduct} className="h-full flex flex-col">
          <div className="grid gap-2 mt-5 mb-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Chair" required />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="HSN">HSN/SAC No</Label>
            <Input id="HSN" type="text" placeholder="xxxxxxxx" required />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="unit_price">Unit Price</Label>
            <Input id="unit_price" type="number" placeholder="1200" required />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="gst">GST %</Label>
            <Input id="gst" type="number" placeholder="5" required />
          </div>
          <div className="mt-auto">
            <Button type="submit" className="w-full" disabled={disableBtn}>
              {disableBtn ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProduct;
