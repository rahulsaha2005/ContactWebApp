import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog.jsx";
import { Button } from "./ui/button.jsx";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { FRIEND_API_END_POINT } from "../utils/constant.js";
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice.js";

export default function DeleteFriend({ open, setOpen, friend }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const res = await axios.delete(`${FRIEND_API_END_POINT}/delete`, {
        data: {
          friendEmail: friend.friendEmail,
          friendPhone: friend.friendPhone,
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setAuthUser({ friends: res.data.friends }));
        toast.success(res.data.message);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={!loading ? setOpen : () => {}}>
      <DialogContent className="sm:max-w-sm w-full rounded-lg p-6 bg-white dark:bg-zinc-900 shadow-lg">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg font-semibold">
            Delete Friend
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500 mt-1">
            Are you sure you want to delete{" "}
            <strong>{friend?.friendName}</strong>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
