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
import { Loader2, Mail, User, Phone, Lock, Image } from "lucide-react";

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

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });

    if (name === "email")
      setErrors((p) => ({
        ...p,
        email: emailRegex.test(value) ? "" : "Invalid email format",
      }));

    if (name === "phoneNumber")
      setErrors((p) => ({
        ...p,
        phoneNumber: phoneRegex.test(value) ? "" : "Phone must be 10 digits",
      }));

    if (name === "password")
      setErrors((p) => ({
        ...p,
        password: passwordRegex.test(value)
          ? ""
          : "Password must include a number",
      }));
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setInput({ ...input, file });
    setPreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (
      !input.fullname ||
      !input.email ||
      !input.phoneNumber ||
      !input.password
    )
      return toast.error("Please fill all required fields");

    if (errors.email || errors.phoneNumber || errors.password)
      return toast.error("Fix validation errors");

    try {
      dispatch(setLoading(true));
      const formData = new FormData();
      Object.entries(input).forEach(
        ([key, val]) => val && formData.append(key, val)
      );

      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    return () => preview && URL.revokeObjectURL(preview);
  }, [preview]);

  return (
    <div className="relative min-h-[calc(100vh-64px)] p-4 flex items-center justify-center bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 px-4 overflow-hidden">
      <form
        onSubmit={submitHandler}
        className="relative w-full max-w-lg bg-white/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 p-8 sm:p-10"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Create Account ✨
        </h1>
        <p className="text-sm text-center text-gray-500 mt-1 mb-8">
          Join us and get started
        </p>

        {/* Inputs */}
        {[
          { label: "Full Name", name: "fullname", icon: User },
          { label: "Email", name: "email", icon: Mail },
          { label: "Phone Number", name: "phoneNumber", icon: Phone },
          { label: "Password", name: "password", icon: Lock, type: "password" },
        ].map(({ label, name, icon: Icon, type = "text" }) => (
          <div key={name} className="mb-4">
            <Label className="text-sm font-medium text-gray-700">{label}</Label>
            <div className="relative mt-1">
              <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type={type}
                name={name}
                value={input[name]}
                onChange={changeEventHandler}
                className={`pl-10 h-11 rounded-lg ${
                  errors[name] ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors[name] && (
              <p className="text-xs text-red-500 mt-1">{errors[name]}</p>
            )}
          </div>
        ))}

        {/* Image Upload */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700">
            Profile Image (optional)
          </Label>
          <div className="flex items-center gap-4 mt-2">
            <label className="flex items-center gap-2 cursor-pointer text-indigo-600">
              <Image size={18} />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={changeFileHandler}
              />
            </label>
            {preview && (
              <img
                src={preview}
                alt="preview"
                className="w-14 h-14 rounded-full object-cover border cursor-pointer"
                onClick={() => setOpen(true)}
              />
            )}
          </div>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg transition"
        >
          {loading ? (
            <Loader2 className="animate-spin h-5 w-5 mx-auto" />
          ) : (
            "Create Account"
          )}
        </Button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>

      {/* Image Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <img
            src={preview}
            alt="full"
            className="max-w-[90%] max-h-[90%] rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
