import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Pen, Trash2, Search } from "lucide-react";

export default function FriendsTable({ onEdit, onDelete }) {
  const user = useSelector((state) => state.auth.user);
  const friends = user?.friends || [];

  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const filteredAndSortedFriends = useMemo(() => {
    let data = [...friends];

    if (search.trim()) {
      const query = search.toLowerCase();
      data = data.filter((friend) =>
        Object.values(friend).some((value) =>
          value?.toString().toLowerCase().includes(query)
        )
      );
    }

    if (sortKey) {
      data.sort((a, b) => {
        const aVal = a[sortKey] ?? "";
        const bVal = b[sortKey] ?? "";

        return sortOrder === "asc"
          ? aVal.toString().localeCompare(bVal.toString())
          : bVal.toString().localeCompare(aVal.toString());
      });
    }

    return data;
  }, [friends, search, sortKey, sortOrder]);

  if (!friends.length) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No friends added yet.
      </p>
    );
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search anything..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border rounded-md text-sm
                       dark:bg-zinc-900 dark:border-zinc-700"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm
                       dark:bg-zinc-900 dark:border-zinc-700"
          >
            <option value="">Sort By</option>
            <option value="friendName">Name</option>
            <option value="friendEmail">Email</option>
            <option value="friendPhone">Phone</option>
          </select>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setSortOrder((prev) =>
                prev === "asc" ? "desc" : "asc"
              )
            }
          >
            {sortOrder === "asc" ? "Asc ↑" : "Desc ↓"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-700
                           bg-white dark:bg-zinc-900 rounded-lg shadow">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Name
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Email
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Message
              </th>
              <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
            {filteredAndSortedFriends.map((friend, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {friend.friendName}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {friend.friendEmail}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {friend.friendPhone}
                </td>
                <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                  {friend.Message || "-"}
                </td>
                <td className="px-4 py-2 flex justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEdit(friend, index)}
                  >
                    <Pen className="w-4 h-4 mr-1" />
                    Edit
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(friend, index)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!filteredAndSortedFriends.length && (
          <p className="text-center text-gray-500 py-6">
            No matching results found.
          </p>
        )}
      </div>
    </>
  );
}
