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
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const [updating, setUpdating] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  function updateProfile(e) {
    e.preventDefault();
    setUpdating(true);
    const name = e.target.name.value;
    const company_name = e.target.position.value;
    const company_address = e.target.company_address.value;
    const company_description = e.target.company_description.value;
    const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

    axios
      .put(
        `${baseUrl}/api/users/profile`,
        { name, company_name, company_address, company_description },
        { withCredentials: true }
      )
      .then((res) => {
        setUpdating(false);
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
      })
      .catch((err) => {
        setUpdating(false);
        toast({
          title: "Profile Update Failed",
          description: "An error occurred while updating your profile",
          variant: "destructive",
        });
      });
  }
  return (
    <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 col-span-3">
      <div className="mx-auto grid w-full max-w-[59rem] flex-1 gap-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            Edit Account Details
          </h1>
        </div>
        <div className="grid gap-4 lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 md:gap-8">
            <Card x-chunk="dashboard-07-chunk-0">
              <form onSubmit={updateProfile}>
                <CardContent className="pt-6">
                  <div className="grid gap-6">
                    <div className="grid gap-3">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        type="text"
                        className="w-full"
                        required
                        defaultValue={user.name}
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="position">Company Name</Label>
                      <Input
                        id="position"
                        type="text"
                        className="w-full"
                        required
                        defaultValue={user.company_name || ""}
                      />
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="col-span-1">
                        <Label htmlFor="company_address">Company Address</Label>
                        <Textarea
                          id="company_address"
                          placeholder="Enter Address"
                          defaultValue={user.company_address || ""}
                        />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="company_description">
                          Company Description
                        </Label>
                        <Textarea
                          id="company_description"
                          placeholder="Enter Address"
                          defaultValue={user.company_description || ""}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end">
                  <Button size="sm" disabled={updating}>
                    {updating ? "Updating..." : "Update Profile"}
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

export default Profile;
