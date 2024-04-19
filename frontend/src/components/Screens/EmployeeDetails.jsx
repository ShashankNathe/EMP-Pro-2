import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft,
  Home,
  LineChart,
  Package,
  Package2,
  PanelLeft,
  PlusCircle,
  Search,
  Settings,
  ShoppingCart,
  Upload,
  Users2,
} from "lucide-react";
import { Badge } from "../ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useToast } from "../ui/use-toast";
import { Textarea } from "../ui/textarea";
import GitHubCalendar from "react-github-contribution-calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronsUpDown, Plus, X } from "lucide-react";

// import '../../../node_modules/react-github-contribution-calendar/default.css'

const EmployeeDetails = () => {
  const [employee, setEmployee] = useState({});
  const [fetchComplete, setFetchComplete] = useState(false);
  const [attendance, setAttendance] = useState([]);
  const [todaysAttendance, setTodaysAttendance] = useState("");
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);
  const [updatingAttendance, setUpdatingAttendance] = useState(false);
  const params = useParams();
  const { toast } = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!fetchComplete) {
      axios
        .get(`${baseUrl}/api/employee/${params.id}`, { withCredentials: true })
        .then((res) => {
          setEmployee(res.data);
          setFetchComplete(true);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            title: "Could not fetch employee.",
            description: "An error occurred while fetching employee.",
          });
          setFetchComplete(true);
        });
    }
  }, [fetchComplete]);

  function updateEmployee(e) {
    e.preventDefault();
    setUpdating(true);
    axios
      .patch(
        `${baseUrl}/api/employee/${params.id}`,
        {
          name: e.target.name.value,
          position: e.target.position.value,
          salary: e.target.salary.value,
          status: e.target.status.value,
          mobile_no: e.target.mobile_no.value,
          address: e.target.address.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setEmployee(res.data);
        toast({
          title: "Employee data edited successfully",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error editing Employee.",
          description: error.response.data.message,
        });
      })
      .finally(() => {
        setUpdating(false);
      });
  }

  function updateAttendance(e) {
    e.preventDefault();
    setUpdatingAttendance(true);
    axios
      .patch(
        `${baseUrl}/api/employee/${params.id}/attendance`,
        {
          date: new Date().toISOString(),
          status: e.target.attendance.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setEmployee(res.data);
        toast({
          title: "Attendance updated successfully",
        });
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          title: "Error updating attendance.",
          description: error.response.data.message,
        });
      })
      .finally(() => {
        setUpdatingAttendance(false);
      });
  }

  useEffect(() => {
    if (employee.attendance) {
      let curAttendance = employee.attendance[employee.attendance.length - 1];

      if (
        curAttendance &&
        new Date(curAttendance.date).toLocaleDateString() ===
          new Date().toLocaleDateString()
      ) {
        setTodaysAttendance(curAttendance.status);
      }
      setAttendance(employee.attendance);
      setStatus(employee.status);
    }
  }, [employee]);

  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 col-span-3">
      <div className="mx-auto grid w-full max-w-[59rem] flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Link to="/employees">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Employee Details
          </h1>
        </div>
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 md:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <form onSubmit={updateEmployee}>
                <CardContent className="pt-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        required
                        defaultValue={employee.name}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        type="text"
                        className="w-full"
                        required
                        defaultValue={employee.position}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="col-span-1">
                        <Label htmlFor="salary">Salary</Label>
                        <Input
                          id="salary"
                          type="number"
                          defaultValue={employee.salary}
                          required
                        />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="status">Status</Label>
                        <select
                          id="status"
                          value={status}
                          onChange={(e) => {
                            setStatus(e.target.value);
                          }}
                          required
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        >
                          <option value="">Select Status</option>
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="mobile_no">Mobile No</Label>
                      <Input
                        id="mobile_no"
                        type="number"
                        defaultValue={employee.mobile_no}
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="address">Address</Label>
                      <Textarea
                        id="address"
                        placeholder="Enter Address"
                        value={employee.address}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button size="sm" disabled={updating}>
                    {updating ? "Updating..." : "Update Employee"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
            <Card x-chunk="dashboard-07-chunk-2">
              <CardHeader>
                <CardTitle>Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <DaysGrid attendance={attendance} employee={employee} />
              </CardContent>
            </Card>
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 w-full">
            <Card x-chunk="dashboard-07-chunk-3">
              <CardHeader>
                <CardTitle>Todays Attendance</CardTitle>
              </CardHeader>
              <form onSubmit={updateAttendance}>
                <CardContent>
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="attendance">Status</Label>
                      <select
                        id="attendance"
                        value={todaysAttendance}
                        onChange={(e) => {
                          setTodaysAttendance(e.target.value);
                        }}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Half Day">Half Day</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button type="submit" size="sm" disabled={updatingAttendance}>
                    {updatingAttendance ? "Updating..." : "Update"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;

const DaysGrid = ({ attendance, employee }) => {
  const [tempAttendance, setTempAttendance] = useState([]);
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    const formattedAttendance = attendance.map((item) => ({
      date: formatDate(new Date(item.date)),
      status: item.status,
    }));

    setTempAttendance(formattedAttendance);
  }, [attendance, employee]);

  const values = tempAttendance.reduce((acc, cur) => {
    acc[cur.date] =
      cur.status === "Present"
        ? 1
        : cur.status === "Absent"
        ? 2
        : cur.status === "Late"
        ? 3
        : cur.status === "Half Day"
        ? 4
        : 5;
    return acc;
  }, {});

  const panelColors = [
    "#EEEEEE", // Default color
    "#15803d", // Present
    "#dc2626", // Absent
    "#FFA500", // Late
    "#ca8a04", // Half Day
    "#fca5a5", // On Leave
  ];
  const weekNames = ["Sun", "M", "T", "W", "T", "F", "S"];
  return (
    <>
      <GitHubCalendar
        values={values}
        panelColors={panelColors}
        weekNames={weekNames}
        until={formatDate(new Date())}
      />
    </>
  );
};
