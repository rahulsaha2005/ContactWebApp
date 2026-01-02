import React, { useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../../utils/constant";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setAuthUser } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";

export default function login() {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    // console.log(input);
    let res;
    try {
      dispatch(setLoading(true));
      res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Something went wrong");
      return;
    } finally {
      dispatch(setLoading(false));
    }

    if (res.data.success) {
      dispatch(setAuthUser(res.data.user));
      console.log(res.data.user);
      navigate("/");
      console.log(input);
      toast.success(res.data.message);
    }
    // Handle login logic here
  };

  return (
    <div>
      <div className=" relative bg-linear-to-r from-purple-600 to-blue-500 min-h-screen w-full overflow-hidden flex items-center justify-center px-4">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>

        <form
          onSubmit={submitHandler}
          className="bg-white m-4 text-black w-full max-w-md md:max-w-lg border border-gray-200 rounded-md p-6 z-10"
        >
          <h1 className="font-bold text-xl mb-5 text-center">Login</h1>

          <div className="my-2">
            <Label htmlFor="email">Email</Label>
            <Input
              type="text"
              value={input.email}
              name="email"
              id="email"
              onChange={changeEventHandler}
              placeholder="Enter Your Email"
            />
          </div>

          <div className="my-2">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              id="password"
              onChange={changeEventHandler}
              placeholder="Enter Your Password"
            />
          </div>

          {loading ? (
            <Button className="w-full my-4 bg-[#4f39f6]">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4 bg-[#4f39f6]">
              Login
            </Button>
          )}

          <p className="text-xs text-gray-500 text-center">
            Don't have an account?{" "}
            <Link to="/signup" replace className="text-red-600 text-sm">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
