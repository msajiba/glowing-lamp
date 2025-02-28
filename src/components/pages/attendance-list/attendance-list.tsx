"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import helpers from "@/utils/helpers";
import type { AttendanceListType } from "../home/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttendanceList() {
  const [attendanceListData, setAttendanceListData] = useState<
    AttendanceListType | undefined
  >(undefined);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<"today" | "week" | "month">(
    "today"
  );

  useEffect(() => {
    const fetchAttendanceList = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();
        const today = new Date();
        const formatDate = (date: Date) => date.toISOString().split("T")[0];

        switch (dateRange) {
          case "today":
            params.set("from", formatDate(today));
            break;
          case "week":
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            params.set("from", formatDate(weekAgo));
            params.set("to", formatDate(today));
            break;
          case "month":
            const monthAgo = new Date(today);
            monthAgo.setMonth(today.getMonth() - 1);
            params.set("from", formatDate(monthAgo));
            params.set("to", formatDate(today));
            break;
        }

        const { data } = await axios.get(`/api/v1/attendance/list?${params}`);
        setAttendanceListData(data);
      } catch (error) {
        console.error("Error fetching attendance list:", error);
        setError("Failed to load attendance data.");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchAttendanceList();
  }, [dateRange]);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          Records ({dateRange === "today" && "Today"}
          {dateRange === "week" && "Last 7 Days"}
          {dateRange === "month" && "Last 30 Days"})
        </h2>
        <div className="flex space-x-2">
          <Button
            onClick={() => setDateRange("today")}
            variant={dateRange === "today" ? "default" : "outline"}
            size="sm"
          >
            Today
          </Button>
          <Button
            onClick={() => setDateRange("week")}
            variant={dateRange === "week" ? "default" : "outline"}
            size="sm"
          >
            Week
          </Button>
          <Button
            onClick={() => setDateRange("month")}
            variant={dateRange === "month" ? "default" : "outline"}
            size="sm"
          >
            Month
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>
            {loading
              ? "Loading attendance records..."
              : attendanceListData?.data.length
              ? `Showing ${attendanceListData.data.length} attendance records`
              : "No attendance records found for the selected period"}
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Check In</TableHead>
              <TableHead>Check Out</TableHead>
              <TableHead className="text-right"> Action </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              // Loading skeleton rows
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {Array(7)
                      .fill(0)
                      .map((_, cellIndex) => (
                        <TableCell key={`cell-${index}-${cellIndex}`}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                  </TableRow>
                ))
            ) : attendanceListData?.data.length ? (
              attendanceListData.data.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.user.id}</TableCell>
                  <TableCell className="font-medium">
                    {record.user.name}
                  </TableCell>
                  <TableCell>{record.user.email}</TableCell>
                  <TableCell>
                    {helpers.formateDate(new Date(record.date))}
                  </TableCell>
                  <TableCell>
                    {record.clockIn
                      ? helpers.formatTime(new Date(record.clockIn))
                      : "—"}
                  </TableCell>
                  <TableCell>
                    {record.clockOut
                      ? helpers.formatTime(new Date(record.clockOut))
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/attendance/${record.user.id}`}
                      target="_blank"
                      className="text-blue-500 hover:text-blue-700 font-medium"
                    >
                      Attendance Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  No attendance records found for this period
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
