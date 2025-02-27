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

import { UserAttendanceList } from "../home/types";
import helpers from "@/utils/helpers";

type Props = {
  attendanceData: UserAttendanceList;
};

export default function AttendanceList({ attendanceData }: Props) {
  return (
    <div className="container mx-auto py-10">
      <div>
        <h1 className="text-lg font-bold mb-5">
          {" "}
          {attendanceData.user.email} ({attendanceData.user.id}){" "}
        </h1>
      </div>

      <Table>
        <TableCaption>A list of your recent attendance records.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Check In</TableHead>
            <TableHead>Check Out</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendanceData.data.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                {helpers.formateDate(new Date(record.date))}
              </TableCell>
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
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            />
          </PaginationItem>
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                onClick={() => setCurrentPage(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination> */}
    </div>
  );
}
