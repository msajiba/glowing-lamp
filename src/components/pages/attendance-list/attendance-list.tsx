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

import { AttendanceListType } from "../home/types";
import Link from "next/link";
import helpers from "@/utils/helpers";

type Props = {
  attendanceListData: AttendanceListType;
};

export default function AttendanceList({ attendanceListData }: Props) {
  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-lg font-bold mb-5">
          {new Date().toLocaleDateString()} Attendance List
        </h1>
      </div>

      <Table>
        <TableCaption>A list of today attendance list .</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceListData.data.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.user.name}</TableCell>
              <TableCell>{record.user.email}</TableCell>
              <TableCell>
                {record.clockIn
                  ? helpers.formatTime(new Date(record.clockIn))
                  : "N/A"}
              </TableCell>
              <TableCell>
                {record.clockOut
                  ? helpers.formatTime(new Date(record.clockOut))
                  : "N/A"}
              </TableCell>
              <TableCell>
                <Link
                  href={`/attendance/${record.user.id}`}
                  target="_blank"
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
