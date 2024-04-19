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
import AddEmployee from "../AddEmployee";
import EditEmployee from "../EditEmployee";
import UpdateAttendance from "../UpdateAttendance";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [employeesAttendance, setEmployeeAttendance] = useState(false);
  const [open, setOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState({});
  const [groupEmployeesByStatus, setGroupEmployeesByStatus] = useState([]);
  const [disableBtn, setDisableBtn] = useState(false);
  const [fetchComplete, setFetchComplete] = useState(false);
  const { toast } = useToast();

  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!fetchComplete) {
      axios
        .get(`${baseUrl}/api/employee`, { withCredentials: true })
        .then((res) => {
          setEmployees(res.data);
          setFetchComplete(true);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Could not fetch employees.",
            description: "An error occurred while fetching employees.",
          });
          setFetchComplete(true);
        });
    }
  }, [fetchComplete]);

  const deleteEmployee = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    axios
      .delete(`${baseUrl}/api/employee/${selectedEmployee._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        const deletedEmployeeIndex = employees.findIndex(
          (emp) => emp._id === selectedEmployee._id
        );
        const updatedEmployees = [...employees];
        updatedEmployees.splice(deletedEmployeeIndex, 1);
        setEmployees(updatedEmployees);
        setSelectedEmployee({});
        setDisableBtn(false);
        setOpen(false);
        toast({
          title: "Employee deleted successfully",
        });
      })
      .catch((error) => {
        setDisableBtn(false);
        toast({
          variant: "destructive",
          title: "Error deleting Employee.",
          description: error.response.data.message,
        });
      });
  };

  useEffect(() => {
    const grpEmp = (employees) => {
      return employees.reduce((grouped, employee) => {
        const status = employee.status;
        if (!grouped[status]) {
          grouped[status] = [];
        }
        grouped[status].push(employee);
        return grouped;
      }, {});
    };
    setGroupEmployeesByStatus(grpEmp(employees));
  }, [employees]);
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 col-span-3">
      <EditEmployee
        asChild
        employees={employees}
        setEmployees={setEmployees}
        selectedEmployee={selectedEmployee}
        disableBtn={disableBtn}
        setDisableBtn={setDisableBtn}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <UpdateAttendance
        asChild
        employees={employees}
        setEmployeeAttendance={setEmployeeAttendance}
        employeesAttendance={employeesAttendance}
        groupEmployeesByStatus={groupEmployeesByStatus}
        disableBtn={disableBtn}
        setDisableBtn={setDisableBtn}
        isAttendanceOpen={isAttendanceOpen}
        setIsAttendanceOpen={setIsAttendanceOpen}
      />
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              employee and remove the data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setSelectedEmployee({});
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={deleteEmployee} disabled={disableBtn}>
              {disableBtn ? "Deleting..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Tabs defaultValue="active">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="inactive" className="hidden sm:flex">
              Inactive
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1"
              onClick={() => {
                setIsAttendanceOpen(true);
              }}
            >
              <File className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Attendance
              </span>
            </Button>
            <AddEmployee
              setDisableBtn={setDisableBtn}
              setEmployees={setEmployees}
              disableBtn={disableBtn}
            />
          </div>
        </div>
        <TabsContent value="active">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Active Employees</CardTitle>
              <CardDescription>
                Manage your current employees and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fetchComplete &&
              groupEmployeesByStatus["Active"] &&
              groupEmployeesByStatus["Active"].length > 0 ? (
                <EmployeeTable
                  setIsOpen={setIsOpen}
                  data={groupEmployeesByStatus["Active"]}
                  setOpen={setOpen}
                  setSelectedEmployee={setSelectedEmployee}
                />
              ) : !fetchComplete ? (
                <p className="text-center">Loading...</p>
              ) : (
                <p className="text-center">No active employees found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>All Employees</CardTitle>
              <CardDescription>
                Manage your employees and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {fetchComplete && employees && employees.length > 0 ? (
                <EmployeeTable
                  setIsOpen={setIsOpen}
                  data={employees}
                  setOpen={setOpen}
                  setSelectedEmployee={setSelectedEmployee}
                />
              ) : !fetchComplete ? (
                <p className="text-center">Loading...</p>
              ) : (
                <p className="text-center">No employees added yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inactive">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Inactive Employees</CardTitle>
              <CardDescription>Manage your inactive employees.</CardDescription>
            </CardHeader>
            <CardContent>
              {fetchComplete &&
              groupEmployeesByStatus["Inactive"] &&
              groupEmployeesByStatus["Inactive"].length > 0 ? (
                <EmployeeTable
                  setIsOpen={setIsOpen}
                  setDisableBtn={setDisableBtn}
                  employees={employees}
                  setEmployees={setEmployees}
                  disableBtn={disableBtn}
                  data={groupEmployeesByStatus["Inactive"]}
                  setOpen={setOpen}
                  setSelectedEmployee={setSelectedEmployee}
                  selectedEmployee={selectedEmployee}
                />
              ) : !fetchComplete ? (
                <p className="text-center">Loading...</p>
              ) : (
                <p className="text-center">No inactive employees found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Employees;
