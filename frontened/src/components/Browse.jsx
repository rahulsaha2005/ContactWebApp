import React, { useState } from "react";
import { Button } from "./ui/button.jsx";
import AddFriend from "./addFriend.jsx";
import EditFriend from "./EditFriend.jsx";
import FriendsTable from "./FriendsTable.jsx";
import DeleteFriend from "./DeleteFriend.jsx";

export default function Browse() {
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleEdit = (friend) => {
    setSelectedFriend(friend);
    setEditOpen(true);
  };

  const handleDelete = (friend) => {
    setSelectedFriend(friend);
    setDeleteOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-6 sm:p-10">
      <div className="max-w-7xl mx-auto mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          My Friends
        </h1>

        <Button
          className="w-full sm:w-auto bg-linear-to-r from-indigo-600 via-purple-600 to-pink-500
            text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center
            justify-center gap-2 px-5 py-3"
          onClick={() => setAddOpen(true)}
        >
          + Add Friend
        </Button>
      </div>

      <AddFriend open={addOpen} setOpen={setAddOpen} />

      {selectedFriend && (
        <EditFriend
          open={editOpen}
          setOpen={setEditOpen}
          friend={selectedFriend}
        />
      )}

      {selectedFriend && (
        <DeleteFriend
          open={deleteOpen}
          setOpen={setDeleteOpen}
          friend={selectedFriend}
        />
      )}

      <div className="max-w-7xl mx-auto bg-white dark:bg-zinc-800 rounded-2xl shadow-lg p-6 sm:p-8">
        <FriendsTable onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}
