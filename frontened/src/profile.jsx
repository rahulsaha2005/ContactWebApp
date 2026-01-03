import React, { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import { Contact2, Mail, Pen } from "lucide-react";
import { Label } from "@radix-ui/react-label";
import { Badge } from "./ui/badge";
// import UpdateProfileDialog from "./UpdateProfileDialog";
import { useSelector } from "react-redux";

export default function Profile() {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <div>
      <div className="mx-3 sm:mx-auto max-w-5xl my-4 rounded-2xl border bg-white shadow-sm dark:bg-zinc-900 p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          {/* Profile Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5 text-center sm:text-left">
            <Avatar className="w-24 h-24 sm:w-28 sm:h-28 ring-2 ring-gray-200 dark:ring-zinc-700">
              <AvatarImage
                src={user?.profile || "https://github.com/shadcn.png"}
              />
              <AvatarFallback>
                {user?.fullname
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase() || "NA"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
                {user?.fullname || "NA"}
              </h2>

              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 max-w-md leading-relaxed">
                {/* Bio is not present in backend, so show NA */}
                NA
              </p>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            variant="outline"
            size="icon"
            className="self-center sm:self-start"
            onClick={() => setOpen(true)}
          >
            <Pen className="w-4 h-4" />
          </Button>
        </div>

        {/* Divider */}
        <div className="my-5 h-px bg-gray-200 dark:bg-zinc-700" />

        {/* Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="break-all text-gray-700 dark:text-gray-300">
                {user?.email || "NA"}
              </span>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Contact2 className="w-4 h-4 text-muted-foreground" />
              <span className="text-gray-700 dark:text-gray-300">
                {user?.phoneNumber || "NA"}
              </span>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">
              Skills
            </h3>

            <div className="flex flex-wrap gap-2">
              <span>NA</span>
            </div>
          </div>

          {/* Resume */}
          <div className="space-y-2 sm:col-span-2">
            <Label className="text-sm font-semibold text-muted-foreground">
              Resume
            </Label>
            <span className="text-sm text-gray-500">Not Available</span>
          </div>
        </div>
      </div>

      {/* Update Profile Dialog */}
      {/* <UpdateProfileDialog open={open} setOpen={setOpen} /> */}
    </div>
  );
}
