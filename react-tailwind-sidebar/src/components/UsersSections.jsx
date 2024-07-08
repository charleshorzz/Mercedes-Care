import React, { useState } from "react";
import {
  useGetUsersQuery,
  useLazyGetUserByNameQuery,
} from "../slices/usersApiSlice";
import UserModal from "./UserModal";

const UsersSections = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: users, isLoading, isError } = useGetUsersQuery();
  const [
    getUserByName,
    { data: searchedUsers, isLoading: isSearching, isError: isSearchError },
  ] = useLazyGetUserByNameQuery();

  const [selectedUser, setSelectedUser] = useState(null);

  const handleSearch = () => {
    getUserByName(searchQuery);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const closeModal = () => {
    setSelectedUser(null);
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search a user"
          className="border p-2 rounded-l-lg"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white p-2 rounded-r-lg"
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading || isSearching ? (
          <p>Loading...</p>
        ) : isError || isSearchError ? (
          <p>Error loading users</p>
        ) : (
          <>
            {searchedUsers
              ? searchedUsers.map((u) => (
                  <div
                    key={u._id}
                    className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => handleUserClick(u)}
                  >
                    <h2 className="text-xl font-bold mb-2">{u.name}</h2>
                    <p>{u.email}</p>
                  </div>
                ))
              : users?.map((u) => (
                  <div
                    key={u._id}
                    className="border p-4 rounded-lg cursor-pointer hover:bg-gray-100"
                    onClick={() => handleUserClick(u)}
                  >
                    <h2 className="text-xl font-bold mb-2">{u.name}</h2>
                    <p>{u.email}</p>
                  </div>
                ))}
          </>
        )}
      </div>

      {selectedUser && <UserModal user={selectedUser} onClose={closeModal} />}
    </div>
  );
};

export default UsersSections;
