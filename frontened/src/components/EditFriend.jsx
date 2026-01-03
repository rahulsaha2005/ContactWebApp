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

export default function EditFriend({ open, setOpen, friend }) {
  const [input, setInput] = useState({
    friendName: "",
    friendEmail: "",
    friendPhone: "",
    Message: "",
  });

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && friend) {
      setInput({
        friendName: friend.friendName || "",
        friendEmail: friend.friendEmail || "",
        friendPhone: friend.friendPhone || "",
        Message: friend.Message || "",
      });
    }
  }, [open, friend]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.friendName.trim()) {
      toast.error("Friend name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${FRIEND_API_END_POINT}/update`,
        {
          friendEmail: friend.friendEmail,
          friendPhone: friend.friendPhone,
          friendName: input.friendName,
          newEmail: input.friendEmail,
          newPhone: input.friendPhone,
          Message: input.Message,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setAuthUser({ ...res.data.user, friends: res.data.friends }));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
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
            Edit Friend
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-4 mt-3">
          {["friendName", "friendEmail", "friendPhone", "Message"].map(
            (field) => (
              <div
                key={field}
                className="flex flex-col sm:flex-row sm:items-center gap-2"
              >
                <Label
                  htmlFor={field}
                  className="w-full sm:w-28 text-sm sm:text-right capitalize"
                >
                  {field.replace(/friend|Message/, (match) =>
                    match === "Message" ? "Message" : "Name"
                  )}
                </Label>
                <Input
                  id={field}
                  name={field}
                  type={
                    field === "Message"
                      ? "text"
                      : field.includes("Email")
                      ? "email"
                      : "text"
                  }
                  value={input[field]}
                  onChange={changeEventHandler}
                  placeholder={
                    field === "friendEmail"
                      ? "john@example.com"
                      : field === "friendPhone"
                      ? "+91 9876543210"
                      : "Enter " + field
                  }
                  className="flex-1"
                  required={field !== "Message"}
                />
              </div>
            )
          )}

          <DialogFooter className="mt-2">
            <Button
              type="submit"
              className="w-full bg-[#4f39f6] text-white font-semibold rounded-lg shadow-md hover:bg-[#3727c7] transition-all duration-200 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>

          <DialogDescription className="text-xs text-center text-gray-500 mt-1">
            Update your friend's details.
          </DialogDescription>
        </form>
      </DialogContent>
    </Dialog>
  );
}
