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
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import axios from "axios";
import { Textarea } from "./ui/textarea";
const EditEmployee = ({
  employees,
  setEmployees,
  selectedEmployee,
  disableBtn,
  setDisableBtn,
  isOpen,
  setIsOpen,
}) => {
  const { toast } = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  const editEmployee = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    axios
      .patch(
        `${baseUrl}/api/employee/${selectedEmployee._id}`,
        {
          name: e.target.name.value,
          position: e.target.position.value,
          salary: e.target.salary.value,
          status: e.target.status.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        const editedEmployeeIndex = employees.findIndex(
          (emp) => emp._id === selectedEmployee._id
        );
        const updatedEmployees = [...employees];
        updatedEmployees[editedEmployeeIndex] = res.data;
        setEmployees(updatedEmployees);
        setDisableBtn(false);
        toast({
          title: "Employee data edited successfully",
        });
        setIsOpen(false);
      })
      .catch((error) => {
        setDisableBtn(false);
        toast({
          variant: "destructive",
          title: "Error editing Employee.",
          description: error.response.data.message,
        });
      });
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit employee</DialogTitle>
          <DialogDescription>
            Make changes in the profile. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={editEmployee} className="h-full flex flex-col">
          <div className="grid gap-2 mt-5 mb-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              defaultValue={selectedEmployee.name}
              required
            />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="position">Position</Label>
            <Input
              id="position"
              type="text"
              placeholder="Manager"
              defaultValue={selectedEmployee.position}
              required
            />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              type="number"
              placeholder="35000"
              defaultValue={selectedEmployee.salary}
              required
            />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="mobile_no">Mobile No</Label>
            <Input
              id="mobile_no"
              type="number"
              placeholder="9999999999"
              defaultValue={selectedEmployee.mobile_no}
              required
            />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              placeholder="Enter Address"
              defaultValue={selectedEmployee.address}
            />
          </div>
          <div className="grid gap-2 mb-3">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              defaultValue={selectedEmployee.status}
              required
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            >
              <option value="">Select Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="mt-auto">
            <Button type="submit" className="w-full" disabled={disableBtn}>
              {disableBtn ? "Updating..." : "Update Employee"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEmployee;
