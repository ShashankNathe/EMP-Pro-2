import React from "react";
import { TooltipProvider } from "../ui/tooltip";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigation,
  Outlet,
  useNavigate,
} from "react-router-dom";
import {
  CircleUser,
  Home,
  Menu,
  Package,
  Package2,
  ShoppingCart,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import Dynamicbreadcrumbs from "../Dynamicbreadcrumbs";
import SidebarLinks from "../SidebarLinks";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import { useAuth } from "../../../src/context/AuthContext";
import { useToast } from "../ui/use-toast";
import "./print.css";
function Layout() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const navigate = useNavigate();
  const logoutHandler = async () => {
    try {
      await logout();
      toast({
        title: "Logged out successfully.",
      });
      navigate("/login");
    } catch (err) {}
  };
  return (
    <div className="">
      <TooltipProvider>
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
          <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <div className="flex items-center gap-2 font-semibold">
                  <Package2 className="h-6 w-6" />
                  <span className="">EMP PRO</span>
                </div>
              </div>
              <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                  <SidebarLinks classes="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary" />
                </nav>
              </div>
              <div className="mt-auto p-4">
                <Card x-chunk="dashboard-02-chunk-0" className="py-3">
                  <CardContent className="p-2 md:p-4">
                    <Link to="/profile">
                      <Button
                        size="sm"
                        className="w-full mb-3"
                        variant="outline"
                      >
                        Settings
                      </Button>
                    </Link>

                    <Button
                      size="sm"
                      className="w-full"
                      onClick={logoutHandler}
                    >
                      Logout
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 md:hidden"
                  >
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle navigation menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <nav className="grid gap-2 text-lg font-medium">
                    <Link
                      to="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                    >
                      <Package2 className="h-6 w-6" />
                      <span className="sr-only">Acme Inc</span>
                    </Link>
                    <Separator />
                    <SidebarLinks classes="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground" />
                  </nav>
                  <div className="mt-auto">
                    <div x-chunk="dashboard-02-chunk-0" className="py-3">
                      <CardContent className="p-2 md:p-4">
                        <Link to="/profile">
                          <Button
                            size="sm"
                            className="w-full mb-3"
                            variant="outline"
                          >
                            Settings
                          </Button>
                        </Link>

                        <Button
                          size="sm"
                          className="w-full"
                          onClick={logoutHandler}
                        >
                          Logout
                        </Button>
                      </CardContent>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <div className="w-full flex-1">
                <Dynamicbreadcrumbs />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="rounded-full"
                  >
                    <CircleUser className="h-5 w-5" />
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link to="/profile">
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutHandler}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3 my-5">
              <Outlet />
            </main>
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
}

export default Layout;
