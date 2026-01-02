import React, { useEffect, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router-dom";
import { USER_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { setLoading } from "../../redux/authSlice";
import { Loader2 } from "lucide-react";

export default function Signup() {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "student",
    file: null,
  });

  const [errors, setErrors] = useState({
    email: "",
    phoneNumber: "",
    password: "",
  });

  const [preview, setPreview] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  // Regex for validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/; // 10 digits
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/; // Min 6 chars, at least one number

  // Handle text input change
  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    // Inline validation
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: emailRegex.test(value) ? "" : "Invalid email format",
      }));
    }
    if (name === "phoneNumber") {
      setErrors((prev) => ({
        ...prev,
        phoneNumber: phoneRegex.test(value) ? "" : "Phone must be 10 digits",
      }));
    }
    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: passwordRegex.test(value)
          ? ""
          : "Password must be 6+ chars and include a number",
      }));
    }
  };

  // Handle file input change
  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInput({ ...input, file });
    setPreview(URL.createObjectURL(file));
  };

  // Submit form
  const submitHandler = async (e) => {
    e.preventDefault();

    // Front-end validation
    if (!input.fullname || !input.email || !input.phoneNumber || !input.password) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (errors.email || errors.phoneNumber || errors.password) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      formData.append("fullname", input.fullname);
      formData.append("email", input.email);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("password", input.password);
      if (input.file) formData.append("file", input.file);

      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  // Revoke preview URL on unmount
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="relative bg-gradient-to-r from-purple-600 to-blue-500 min-h-screen w-full overflow-hidden flex items-center justify-center px-4">
      {/* Background circles */}
      <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-400 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>

      <form
        onSubmit={submitHandler}
        className="bg-white m-4 text-black w-full max-w-md md:max-w-lg border border-gray-200 rounded-md p-6 z-10 shadow-lg"
      >
        <h1 className="font-bold text-2xl mb-6 text-center">Sign Up</h1>

        {/* Full Name */}
        <div className="my-3">
          <Label htmlFor="fullname">Full Name</Label>
          <Input
            type="text"
            name="fullname"
            id="fullname"
            value={input.fullname}
            onChange={changeEventHandler}
            placeholder="Enter Your Name"
            required
          />
        </div>

        {/* Email */}
        <div className="my-3">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            name="email"
            id="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="Enter Your Email"
            required
            className={errors.email ? "border-red-500" : ""}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        {/* Phone Number */}
        <div className="my-3">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            value={input.phoneNumber}
            onChange={changeEventHandler}
            placeholder="Enter Your Phone Number"
            required
            className={errors.phoneNumber ? "border-red-500" : ""}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
          )}
        </div>

        {/* Password */}
        <div className="my-3">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            id="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="Enter Your Password"
            required
            className={errors.password ? "border-red-500" : ""}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Profile Image */}
        <div className="flex flex-col gap-2 my-4">
          <Label>Profile Image (optional)</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={changeFileHandler}
            className="cursor-pointer"
          />
          {preview && (
            <img
              src={preview}
              alt="preview"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true);
              }}
              className="w-16 h-16 object-cover cursor-pointer border rounded"
            />
          )}
          {open && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
              onClick={() => setOpen(false)}
            >
              <img
                src={preview}
                alt="full"
                className="max-w-[90%] max-h-[90%]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full my-4 bg-indigo-600 hover:bg-indigo-700">
          {loading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Sign Up"}
        </Button>

        {/* Login Link */}
        <p className="text-xs text-gray-500 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
