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
const AddEmployee = ({ disableBtn, setDisableBtn, setEmployees }) => {
  const { toast } = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  const addEmployee = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    axios
      .post(
        `${baseUrl}/api/employee`,
        {
          name: e.target.name.value,
          position: e.target.position.value,
          salary: e.target.salary.value,
          mobile_no: e.target.mobile_no.value,
          address: e.target.address.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setEmployees((prevEmployees) => [...prevEmployees, res.data]);
        setDisableBtn(false);
        toast({
          title: "Employee added successfully",
        });
        e.target.name.value = "";
        e.target.position.value = "";
        e.target.salary.value = "";
        e.target.mobile_no.value = "";
        e.target.address.value = "";
      })
      .catch((error) => {
        setDisableBtn(false);
        toast({
          variant: "destructive",
          title: "Error adding Employee.",
          description: error.response.data.message,
        });
      });
  };

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 h-8 gap-1">
        <PlusCircle className="h-3.5 w-3.5" />
        <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
          Add Employee
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new employee</DialogTitle>
        </DialogHeader>

        <form onSubmit={addEmployee} className="h-full flex flex-col">
          <div className="grid gap-2 mt-5 mb-3">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="position">Position</Label>
            <Input id="position" type="text" placeholder="Manager" required />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="salary">Salary</Label>
            <Input id="salary" type="number" placeholder="35000" required />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="mobile_no">Mobile No</Label>
            <Input
              id="mobile_no"
              type="number"
              placeholder="9999999999"
              required
            />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="address">Address</Label>
            <Textarea id="address" placeholder="Enter Address" required />
          </div>
          <div className="mt-auto">
            <Button type="submit" className="w-full" disabled={disableBtn}>
              {disableBtn ? "Adding..." : "Add Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEmployee;
