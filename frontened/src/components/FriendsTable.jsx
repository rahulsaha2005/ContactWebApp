import React from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Pen, Trash2 } from "lucide-react";

export default function FriendsTable({ onEdit, onDelete }) {
  const user = useSelector((state) => state.auth.user);
  const friends = user?.friends || [];

  if (!friends.length) {
    return (
      <p className="text-center text-gray-500 mt-4">No friends added yet.</p>
    );
  }

  return (
    <div className="overflow-x-auto w-full mt-4">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700 bg-white dark:bg-zinc-900 rounded-lg shadow">
        <thead className="bg-gray-100 dark:bg-zinc-800">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Email
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Message
            </th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
          {friends.map((friend, index) => (
            <tr key={index} className="hover:bg-gray-50 dark:hover:bg-zinc-800">
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                {friend.friendName}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                {friend.friendEmail}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                {friend.friendPhone}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-200">
                {friend.Message || "-"}
              </td>
              <td className="px-4 py-2 whitespace-nowrap text-center flex justify-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex items-center gap-1"
                  onClick={() => onEdit(friend, index)}
                >
                  <Pen className="h-4 w-4" /> Edit
                </Button>

                <Button
                  size="sm"
                  variant="destructive"
                  className="flex items-center gap-1"
                  onClick={() => onDelete(friend, index)}
                >
                  <Trash2 className="h-4 w-4" /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
