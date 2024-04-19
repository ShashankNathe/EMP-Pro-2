import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  Users,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  ListFilter,
  MoreVertical,
  PanelLeft,
  Settings,
  Truck,
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
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "../ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "../ui/pagination";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Progress } from "../ui/progress";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Link } from "react-router-dom";
import { set } from "mongoose";
import { useToast } from "../ui/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";
import { ScrollArea } from "../ui/scroll-area";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "../../context/AuthContext";

export function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [loading, setLoading] = useState(true);
  const [totalRevenueLast7Days, setTotalRevenueLast7Days] = useState(0);
  const [totalInvoicesLast7Days, setTotalInvoicesLast7Days] = useState(0);
  const [revenueDifferencePercentage, setRevenueDifferencePercentage] =
    useState("");
  const [invoicesDifferencePercentage, setInvoicesDifferencePercentage] =
    useState("");
  const [invoicesLast7Days, setInvoicesLast7Days] = useState([]);
  const [invoicesPrevious7Days, setInvoicesPrevious7Days] = useState([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";
  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${baseUrl}/api/invoice/?lastTwoWeeks=true`,
          {
            withCredentials: true,
          }
        );
        setInvoices(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Could not fetch data",
          description: "Something went wrong",
          duration: 5000,
        });
      }
    };
    fetchInvoices();
  }, []);
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoadingEmployees(true);
      try {
        const { data } = await axios.get(`${baseUrl}/api/employee`, {
          withCredentials: true,
        });
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0
        );
        const filteredAttendance = data
          .filter((employee) => employee.status === "Active")
          .map((employee) => {
            const daysPresent = employee.attendance.filter((entry) => {
              const entryDate = new Date(entry.date);
              return (
                entryDate >= startOfMonth &&
                (entry.status === "Present" ||
                  entry.status === "Half Day" ||
                  entry.status === "Late")
              );
            }).length;

            const daysAbsent = employee.attendance.filter((entry) => {
              const entryDate = new Date(entry.date);
              return (
                entryDate >= startOfMonth &&
                (entry.status === "Absent" || entry.status === "On Leave")
              );
            }).length;
            return {
              name: employee.name,
              "Days Present": daysPresent,
              "Days Absent": -daysAbsent,
            };
          });
        setAttendance(filteredAttendance);
        setLoadingEmployees(false);
      } catch (error) {
        setLoadingEmployees(false);
        toast({
          variant: "destructive",
          title: "Could not fetch data",
          description: "Something went wrong",
          duration: 5000,
        });
      }
    };
    fetchEmployees();
  }, []);

  useEffect(() => {
    const today = new Date();

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    const invoicesLast7Days = invoices.filter(
      (invoice) =>
        new Date(invoice.invoice_date) >= sevenDaysAgo &&
        new Date(invoice.invoice_date) <= today
    );
    const invoicesPrevious7Days = invoices.filter(
      (invoice) =>
        new Date(invoice.invoice_date) >= fourteenDaysAgo &&
        new Date(invoice.invoice_date) < sevenDaysAgo
    );

    const totalRevenueLast7Days = invoicesLast7Days.reduce(
      (acc, invoice) => acc + invoice.total_amount,
      0
    );
    const totalRevenuePrevious7Days = invoicesPrevious7Days.reduce(
      (acc, invoice) => acc + invoice.total_amount,
      0
    );

    const totalInvoicesLast7Days = invoicesLast7Days.length;
    const totalInvoicesPrevious7Days = invoicesPrevious7Days.length;

    let revenueDifferencePercentage;
    if (totalRevenuePrevious7Days === 0) {
      revenueDifferencePercentage = "+100%";
    } else {
      const revenueDifference =
        ((totalRevenueLast7Days - totalRevenuePrevious7Days) /
          totalRevenuePrevious7Days) *
        100;
      revenueDifferencePercentage = `${
        revenueDifference > 0 ? "+" : ""
      }${revenueDifference.toFixed(2)}%`;
    }

    let invoicesDifferencePercentage;
    if (totalInvoicesPrevious7Days === 0) {
      invoicesDifferencePercentage = "+100%";
    } else {
      const invoicesDifference =
        ((totalInvoicesLast7Days - totalInvoicesPrevious7Days) /
          totalInvoicesPrevious7Days) *
        100;
      invoicesDifferencePercentage = `${
        invoicesDifference > 0 ? "+" : ""
      }${invoicesDifference.toFixed(2)}%`;
    }

    setTotalRevenueLast7Days(totalRevenueLast7Days);
    setTotalInvoicesLast7Days(totalInvoicesLast7Days);
    setRevenueDifferencePercentage(revenueDifferencePercentage);
    setInvoicesDifferencePercentage(invoicesDifferencePercentage);
    setInvoicesPrevious7Days(invoicesPrevious7Days);
    setInvoicesLast7Days(invoicesLast7Days);
  }, [invoices]);

  return (
    <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
        <Card className="sm:col-span-2" x-chunk="dashboard-05-chunk-0">
          <CardHeader className="pb-3">
            <CardTitle>Welcome {user.name}</CardTitle>
            <CardDescription className="max-w-lg text-balance leading-relaxed">
              {new Date().toLocaleString("en", { weekday: "short" })}{" "}
              {new Date().getDate()}{" "}
              {new Date().toLocaleString("en", { month: "long" })}{" "}
              {new Date().getFullYear()}
            </CardDescription>
            <div className="flex justify-end">
              <Link to="/invoices/new">
                <Button>Create New Invoice</Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
        <Card x-chunk="dashboard-05-chunk-1">
          <CardHeader className="pb-2">
            <CardDescription>Invoices This Week</CardDescription>
            <CardTitle className="text-4xl">{totalInvoicesLast7Days}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-xs text-muted-foreground`}>
              <span
                className={`font-bold ${
                  invoicesDifferencePercentage.includes("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {invoicesDifferencePercentage}
              </span>{" "}
              from last week
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-05-chunk-2">
          <CardHeader className="pb-2">
            <CardDescription>Revenue This Week</CardDescription>
            <CardTitle className="text-4xl">{totalRevenueLast7Days}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <span
                className={`font-bold ${
                  revenueDifferencePercentage.includes("+")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {revenueDifferencePercentage}
              </span>{" "}
              from last week
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 grid-cols-6">
        <div className="col-span-6 lg:col-span-4">
          <Card x-chunk="dashboard-05-chunk-3">
            <CardHeader className="px-7">
              <CardTitle>Employee Attendance</CardTitle>
              <CardDescription>
                Attendance of employees in the past month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingEmployees ? (
                <p>Loading...</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={attendance}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <ReferenceLine y={0} stroke="#000" />
                      <Bar dataKey="Days Present" fill="#16a34a" barSize={20} />
                      <Bar dataKey="Days Absent" fill="#0f172a" barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <Tabs defaultValue="week" className="col-span-6 lg:col-span-2">
          <div className="flex items-center">
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="lastWeek">Last Week</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="week">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Invoices</CardTitle>
                <CardDescription>
                  Recent invoices from your store.
                </CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-auto m-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!loading && invoicesLast7Days.length > 0 ? (
                      invoicesLast7Days.map((invoice) => (
                        <TableRow key={invoice._id}>
                          <TableCell>
                            <div className="font-medium">
                              {invoice.customer_name}
                            </div>
                            <div className="hidden text-sm text-muted-foreground md:inline">
                              {invoice.customer_phone}
                            </div>
                          </TableCell>
                          <TableCell>₹ {invoice.total_amount}</TableCell>
                          <TableCell>
                            {new Date(invoice.invoice_date).toLocaleDateString(
                              "en-GB"
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : loading ? (
                      <TableRow>
                        <TableCell>Loading...</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell>No Invoices found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="lastWeek">
            <Card x-chunk="dashboard-05-chunk-4">
              <CardHeader className="px-7">
                <CardTitle>Invoices</CardTitle>
                <CardDescription>Invoices in the past week.</CardDescription>
              </CardHeader>
              <CardContent className="max-h-[500px] overflow-auto m-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Name</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading && (
                      <TableRow>
                        <TableCell>Loading...</TableCell>
                      </TableRow>
                    )}
                    {!loading && invoicesPrevious7Days.length > 0 ? (
                      invoicesPrevious7Days.map((invoice) => (
                        <TableRow key={invoice._id}>
                          <TableCell>{invoice.customer_name}</TableCell>
                          <TableCell>{invoice.total_amount}</TableCell>
                          <TableCell>
                            {new Date(invoice.invoice_date).toLocaleDateString(
                              "en-GB"
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : loading ? (
                      <TableRow>
                        <TableCell>Loading...</TableCell>
                      </TableRow>
                    ) : (
                      <TableRow>
                        <TableCell>No Invoices found</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
