import React, { useEffect, useState } from "react";
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
import { useDispatch } from "react-redux";
import { FRIEND_API_END_POINT } from "../utils/constant.js";
import axios from "axios";
import { toast } from "sonner";
import { setAuthUser } from "../redux/authSlice.js";

export default function AddFriend({ open, setOpen }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    friendName: "",
    friendEmail: "",
    friendPhone: "",
    Message: "",
  });

  useEffect(() => {
    if (open)
      setInput({
        friendName: "",
        friendEmail: "",
        friendPhone: "",
        Message: "",
      });
  }, [open]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isValidPhone = (phone) => /^\d{10,15}$/.test(phone.replace(/\D/g, ""));

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.friendName.trim()) return toast.error("Friend name is required");
    if (!isValidEmail(input.friendEmail))
      return toast.error("Invalid email address");
    if (!isValidPhone(input.friendPhone))
      return toast.error("Invalid phone number (10-15 digits)");

    try {
      setLoading(true);
      const res = await axios.post(`${FRIEND_API_END_POINT}/add`, input, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setAuthUser(res.data.user)); 
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add friend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!loading ? setOpen : () => {}}>
      <DialogContent className="sm:max-w-sm w-full rounded-lg p-6 bg-white dark:bg-zinc-900 shadow-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle>Add Friend</DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-4 mt-3">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="friendName"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Name
            </Label>
            <Input
              id="friendName"
              name="friendName"
              value={input.friendName}
              onChange={changeEventHandler}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="friendEmail"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Email
            </Label>
            <Input
              id="friendEmail"
              name="friendEmail"
              value={input.friendEmail}
              onChange={changeEventHandler}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="friendPhone"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Phone
            </Label>
            <Input
              id="friendPhone"
              name="friendPhone"
              value={input.friendPhone}
              onChange={changeEventHandler}
              placeholder="+91 9876543210"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-start gap-2">
            <Label
              htmlFor="Message"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Message
            </Label>
            <textarea
              id="Message"
              name="Message"
              value={input.Message}
              onChange={changeEventHandler}
              placeholder="Add a note (optional)"
              className="flex-1 h-20 p-2 rounded-lg border border-gray-300 dark:border-zinc-700 resize-none"
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              className="w-full bg-[#4f39f6] text-white flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              Add Friend
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
