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
import { Button } from "./ui/button.jsx";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { FRIEND_API_END_POINT } from "../utils/constant.js";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice.js";

export default function EditFriend({ open, setOpen, friend }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    friendName: "",
    newEmail: "",
    newPhone: "",
    Message: "",
  });

  useEffect(() => {
    if (friend) {
      setInput({
        friendName: friend.friendName || "",
        newEmail: friend.friendEmail || "",
        newPhone: friend.friendPhone || "",
        Message: friend.Message || "",
      });
    }
  }, [friend]);

  const changeEventHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const res = await axios.put(
        `${FRIEND_API_END_POINT}/update`,
        {
          friendEmail: friend.friendEmail,
          friendPhone: friend.friendPhone,
          ...input,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setAuthUser(res.data.user));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!loading ? setOpen : () => {}}>
      <DialogContent className="sm:max-w-sm w-full rounded-lg p-6 bg-white dark:bg-zinc-900 shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle>Edit Friend</DialogTitle>
          <DialogDescription>Update friend details</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-3">
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
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="newEmail"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Email
            </Label>
            <Input
              id="newEmail"
              name="newEmail"
              value={input.newEmail}
              onChange={changeEventHandler}
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <Label
              htmlFor="newPhone"
              className="w-full sm:w-28 text-sm sm:text-right"
            >
              Phone
            </Label>
            <Input
              id="newPhone"
              name="newPhone"
              value={input.newPhone}
              onChange={changeEventHandler}
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
              className="flex-1 h-20 p-2 rounded-lg border border-gray-300 dark:border-zinc-700 resize-none"
            />
          </div>

          <DialogFooter className="mt-4 flex justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "Update"
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
