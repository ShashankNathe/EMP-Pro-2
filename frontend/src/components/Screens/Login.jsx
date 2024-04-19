import axios from "axios";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import { useState, useEffect } from "react";
import { useAuth } from "../../../src/context/AuthContext";

function Login() {
  const { user, setUserContext, removeUserContext } = useAuth();
  const [disableBtn, setDisableBtn] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [navigate, user]);

  async function authUser(e) {
    e.preventDefault();
    try {
      setDisableBtn(true);
      axios
        .post(
          `${baseUrl}/api/users/auth`,
          {
            email: e.target.email.value,
            password: e.target.password.value,
          },
          { withCredentials: true }
        )
        .then((res) => {
          setUserContext(res.data);
          navigate("/");
        })
        .catch((error) => {
          removeUserContext();
          setDisableBtn(false);
          toast({
            variant: "destructive",
            title: "Error authenticating user.",
            description: "Invalid username or password.",
          });
        });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: error.message ? error.message : "Please try again later.",
      });
    }
  }
  return (
    <div className="h-screen flex items-center py-2">
      <Card className="mx-auto max-w-sm w-full md:min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
          </CardDescription>
        </CardHeader>
        <form onSubmit={authUser}>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full" disabled={disableBtn}>
              {disableBtn ? "Signing in ..." : "Sign in"}
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link to="/register" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Login;
