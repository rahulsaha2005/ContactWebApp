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
import { Loader2, Mail, Lock } from "lucide-react";

export default function Login() {
  const [input, setInput] = useState({ email: "", password: "" });
  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    let res;
    try {
      dispatch(setLoading(true));
      res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      return;
    } finally {
      dispatch(setLoading(false));
    }

    if (res.data.success) {
      dispatch(setAuthUser(res.data.user));
      navigate("/");
      toast.success(res.data.message);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] p-4 flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 overflow-hidden">
      <form
        onSubmit={submitHandler}
        className="relative w-full max-w-md rounded-2xl bg-white/85 backdrop-blur-xl shadow-2xl border border-white/30 p-8 sm:p-10"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Welcome Back
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1 mb-8">
          Login to your account
        </p>

        <div className="mb-5">
          <Label className="text-sm font-medium text-gray-700">
            Email address
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="you@example.com"
              className="pl-10 h-11 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-700">Password</Label>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="••••••••"
              className="pl-10 h-11 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 text-sm">
          <label className="flex items-center gap-2 text-gray-600">
            <input type="checkbox" className="accent-indigo-600" />
            Remember me
          </label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] transition-all duration-200 text-white font-medium shadow-lg disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-indigo-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
