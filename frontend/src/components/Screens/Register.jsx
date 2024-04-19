import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { useAuth } from "../../../src/context/AuthContext";

function Register() {
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

  function registerUser(e) {
    e.preventDefault();
    setDisableBtn(true);
    axios
      .post(
        `${baseUrl}/api/users`,
        {
          name: e.target.name.value,
          email: e.target.email.value,
          password: e.target.password.value,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setUserContext(res.data);
        toast({
          title: "Registered Successfully",
        });
      })
      .catch((error) => {
        setDisableBtn(false);
        removeUserContext();
        toast({
          variant: "destructive",
          title: "Error authenticating user.",
          description: error.response.data.message,
        });
      });
  }

  return (
    <div className="h-screen flex items-center py-2">
      <Card className="mx-auto max-w-sm w-full md:min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={registerUser}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Max" required />
                </div>
              </div>
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
                <Input id="password" type="password" />
              </div>
              <Button type="submit" className="w-full" disabled={disableBtn}>
                {disableBtn ? "Creating account ..." : "Create an account"}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
