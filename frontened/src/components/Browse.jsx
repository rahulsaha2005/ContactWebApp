import React, { useState } from "react";
import { Button } from "./ui/button.jsx";
import AddFriend from "./addFriend.jsx";

export default function Browse() {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-red-400 min-h-screen  p-4">
      <Button
        className="w-full bg-[#4f39f6] text-white
         font-semibold rounded-lg shadow-md hover:bg-[#3727c7] 
         hover:shadow-lg transition-all duration-200 flex items-center
       justify-center gap-2"
        onClick={() => setOpen(true)}
      >
        + Add Friend
      </Button>

      <AddFriend open={open} setOpen={setOpen}/>
    </div>
  );
}
