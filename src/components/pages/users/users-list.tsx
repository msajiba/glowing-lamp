"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { UsersListType } from "../home/types";
import Link from "next/link";

type Props = {
  usersData: UsersListType;
};

export default function UsersList({ usersData }: Props) {
  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-lg font-bold mb-5">Employee List</h1>
      </div>

      <Table>
        <TableCaption>A list of out employees .</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead> ID </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersData.data.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.id}</TableCell>
              <TableCell>{record.name}</TableCell>
              <TableCell>{record.email}</TableCell>
              <TableCell>
                <Link
                  href={`/attendance/${record.id}`}
                  className="text-blue-500"
                >
                  View Attendance
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
