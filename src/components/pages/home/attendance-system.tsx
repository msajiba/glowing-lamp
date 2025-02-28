"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Clock, LogIn, LogOut } from "lucide-react";
import axios from "axios";
import helpers from "@/utils/helpers";
import toast from "react-hot-toast";
import { UserAttendance } from "./types";
import { useRouter } from "next/navigation";

type Props = {
  userAttendance: UserAttendance;
};

export default function AttendanceSystem({ userAttendance }: Props) {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [isClockInDisabled, setIsClockInDisabled] = useState(false);
  const [isClockOutDisabled, setIsClockOutDisabled] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [clockInTime, setClockInTime] = useState("");
  const [clockOutTime, setClockOutTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [actionType, setActionType] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  // Handle initial state setup based on userAttendance
  useEffect(() => {
    // First set our component as mounted
    setIsMounted(true);

    const isClockIn = !!userAttendance?.data?.clockIn;
    const isClockOut = !!userAttendance?.data?.clockOut;

    setClockInTime(
      isClockIn ? helpers.formatTime(new Date(userAttendance.data.clockIn)) : ""
    );
    setClockOutTime(
      isClockOut
        ? helpers.formatTime(new Date(userAttendance.data.clockOut))
        : ""
    );

    setIsClockInDisabled(isClockIn);
    setIsClockOutDisabled(isClockOut);
    setButtonDisabled(isClockIn && isClockOut);
  }, [userAttendance]);

  // Handle current time updates
  useEffect(() => {
    // Only run this effect on the client
    if (isMounted) {
      // Set initial time
      setCurrentTime(helpers.formatTime(new Date()));

      // Set up interval to update time
      const timer = setInterval(() => {
        setCurrentTime(helpers.formatTime(new Date()));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isMounted]);

  const handleOpenModal = (type: string) => {
    setActionType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDescription("");
  };

  const handleConfirm = async () => {
    try {
      const bodyData = {
        userId: userAttendance?.user?.id ?? "",
        description,
      };

      const { data } =
        actionType === "in"
          ? await axios.post("/api/v1/attendance", bodyData)
          : await axios.patch("/api/v1/attendance", {
              id: userAttendance?.data?.id ?? "",
              description,
            });

      if (data) {
        if (actionType === "in") {
          setClockInTime(helpers.formatTime(new Date(data.data.clockIn)));
          setIsClockInDisabled(true);
        } else {
          setClockOutTime(helpers.formatTime(new Date(data.data.clockOut)));
          setIsClockOutDisabled(true);
          setButtonDisabled(true);
        }
      }
      router.refresh();
      toast.success(data.message);
    } catch (error) {
      console.error("Error calling API:", error);
      toast.error("Error calling API");
    }

    handleCloseModal();
  };

  // Early return during SSR or before client-side hydration is complete
  if (!isMounted) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background p-4">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
          <h1 className="mb-6 text-center text-2xl font-bold">
            {userAttendance.user.name.toLocaleUpperCase()}
          </h1>
          <div className="mb-6 flex items-center justify-center gap-2 text-xl">
            <Clock className="h-5 w-5" />
            <span>Loading...</span>
          </div>
          {/* Render disabled buttons during loading */}
          <div className="flex gap-4">
            <Button
              disabled={true}
              className="flex-1"
              size="lg"
              variant="default"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Check In
            </Button>
            <Button
              disabled={true}
              className="flex-1"
              size="lg"
              variant="destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Check Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">
          {userAttendance.user.name.toLocaleUpperCase()}
        </h1>

        <div className="mb-6 flex items-center justify-center gap-2 text-xl">
          <Clock className="h-5 w-5" />
          <span>{currentTime}</span>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => handleOpenModal("in")}
            disabled={isClockInDisabled || buttonDisabled}
            className="flex-1"
            size="lg"
            variant="default"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Check In
          </Button>

          <Button
            onClick={() => handleOpenModal("out")}
            disabled={
              isClockOutDisabled || buttonDisabled || !isClockInDisabled
            }
            className="flex-1"
            size="lg"
            variant="destructive"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Check Out
          </Button>
        </div>

        <div className="mt-6 space-y-2 text-center text-sm">
          {clockInTime && (
            <p>
              <span className="font-medium">Check In:</span> {clockInTime}
            </p>
          )}
          {clockOutTime && (
            <p>
              <span className="font-medium">Check Out:</span> {clockOutTime}
            </p>
          )}
          {isClockInDisabled && !isClockOutDisabled ? (
            <p className="text-green-500 font-medium">
              You are currently checked in
            </p>
          ) : (
            clockOutTime && (
              <p className="text-amber-500 font-medium">
                You are currently checked out
              </p>
            )
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "in" ? "Clock In" : "Clock Out"} Confirmation
            </DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter description (optional)"
            value={description}
            aria-describedby="description"
            onChange={(e) => setDescription(e.target.value)}
            className="mt-4"
          />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleCloseModal}>
              No
            </Button>
            <Button onClick={handleConfirm}>Yes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
