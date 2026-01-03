import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog.jsx";
import { Input } from "./ui/input.jsx";
import { Label } from "@radix-ui/react-label";
import { Loader2 } from "lucide-react";
import { Button } from "./ui/button.jsx";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "../utils/constant.js";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "../redux/authSlice.js";

export default function UpdateProfileDialog({ open, setOpen }) {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    fullname: "",
    username: "",
    email: "",
    phoneNumber: "",
    file: null,
  });
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (user) {
      setInput({
        fullname: user.fullname || "",
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        file: null,
      });
      setPreview(user.profile || "");
    }
  }, [user, open]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Profile must be an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Profile image must be under 2MB");
      return;
    }
    setInput((prev) => ({ ...prev, file }));

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPhone = (phone) => /^\d{10,15}$/.test(phone.replace(/\s+/g, ""));

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.fullname.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!input.username.trim()) {
      toast.error("Username is required");
      return;
    }

    if (!isValidEmail(input.email)) {
      toast.error("Invalid email address");
      return;
    }

    if (!isValidPhone(input.phoneNumber)) {
      toast.error("Invalid phone number (10-15 digits)");
      return;
    }

    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("username", input.username);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    if (input.file) formData.append("file", input.file);

    try {
      setLoading(true);
      const res = await axios.put(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Profile update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!loading ? setOpen : () => {}}>
      <DialogContent
        className="sm:max-w-sm w-full rounded-lg p-4 sm:p-6 bg-white dark:bg-zinc-900 shadow-lg max-h-[90vh] overflow-y-auto"
        onInteractOutside={() => !loading && setOpen(false)}
      >
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold">
            Update Profile
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-4 mt-3">
          <div className="flex justify-center mb-2">
            {preview ? (
              <img
                src={preview}
                alt="Profile Preview"
                className="w-20 h-20 rounded-full object-cover border border-gray-300 dark:border-zinc-700"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-zinc-700 flex items-center justify-center border border-gray-300 dark:border-zinc-700 text-gray-400 text-sm">
                No Image
              </div>
            )}
          </div>

          {/* File Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="file"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Profile Image
            </Label>
            <Input
              id="file"
              name="file"
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
              className="flex-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="fullname"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Full Name
            </Label>
            <Input
              id="fullname"
              name="fullname"
              type="text"
              value={input.fullname}
              onChange={changeEventHandler}
              className="flex-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="username"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Username
            </Label>
            <Input
              id="username"
              name="username"
              type="text"
              value={input.username}
              onChange={changeEventHandler}
              placeholder="letters, numbers, underscores"
              className="flex-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="email"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={input.email}
              onChange={changeEventHandler}
              className="flex-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="phoneNumber"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Phone
            </Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              className="flex-1"
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
              ) : (
                "Update Profile"
              )}
            </Button>
          </DialogFooter>

          <DialogDescription className="text-xs text-center text-gray-500 mt-1">
            Update your profile image, username, email, and phone number.
          </DialogDescription>
        </form>
      </DialogContent>
    </Dialog>
  );
}
