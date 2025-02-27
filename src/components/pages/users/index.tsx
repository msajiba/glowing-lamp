import React from "react";
import UsersList from "./users-list";
import { fetchUsers } from "@/fetcher";
import { UsersListType } from "../home/types";

const UserIndex = async () => {
  const usersData = await fetchUsers();

  return (
    <div>
      <UsersList usersData={usersData as UsersListType} />
    </div>
  );
};

export default UserIndex;
