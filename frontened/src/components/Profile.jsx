import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact2, Mail, Pen } from "lucide-react";
import { Badge } from "./ui/badge";
import { useSelector } from "react-redux";
import UpdateProfileDialog from "./UpdateProfileDialog";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  // Format joinedAt for user-friendly display
  const joinedDate = user?.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "N/A";

  return (
    <div className="mx-3 sm:mx-auto max-w-4xl my-6 p-6 rounded-3xl bg-white shadow-lg dark:bg-zinc-900 transition-all duration-300">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <Avatar className="w-28 h-28 ring-4 ring-gray-200 dark:ring-zinc-700 shadow-md transition-all hover:scale-105">
          <AvatarImage src={user?.profile || "https://github.com/shadcn.png"} />
          <AvatarFallback>
            {user?.fullname
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase() || "NA"}
          </AvatarFallback>
        </Avatar>

        {/* User Info */}
        <div className="flex-1 flex flex-col gap-2 sm:gap-3 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {user?.fullname || "NA"}
            </h2>
            <Badge variant="secondary" className="text-sm">
              {user?.role || "User"}
            </Badge>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-2 text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="break-all">{user?.email || "NA"}</span>
            </div>

            <div className="flex items-center gap-2 text-sm bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all">
              <Contact2 className="w-4 h-4 text-muted-foreground" />
              <span>{user?.phoneNumber || "NA"}</span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Button
          variant="outline"
          size="icon"
          className="self-center sm:self-start transition-all hover:bg-gray-100 dark:hover:bg-zinc-800"
          onClick={() => setOpen(true)}
        >
          {/* Pen icon for sm+ screens */}
          <span className="hidden sm:inline-flex">
            <Pen className="w-5 h-5" />
          </span>

          {/* Text "Edit" for mobile */}
          <span className="inline-flex sm:hidden text-sm font-medium px-2 py-1">
            Edit
          </span>
        </Button>
      </div>

      {/* Divider */}
      <hr className="my-6 border-gray-200 dark:border-zinc-700" />

      {/* Extra Info Section */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">Joined</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {joinedDate}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm text-gray-500 dark:text-gray-400">Username</span>
          <span className="font-medium text-gray-900 dark:text-white">
            @{user?.username || "NA"}
          </span>
        </div>
      </div>

      {/* Update Profile Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  );
}
