import React, { useEffect } from "react";
import { useToast } from "./ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import axios from "axios";

const UpdateAttendance = ({
  employees,
  setEmployeeAttendance,
  disableBtn,
  employeesAttendance,
  groupEmployeesByStatus,
  setDisableBtn,
  isAttendanceOpen,
  setIsAttendanceOpen,
}) => {
  const { toast } = useToast();
  const baseUrl = process.env.REACT_APP_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (!employeesAttendance && groupEmployeesByStatus["Active"]) {
      const activeEmployees = groupEmployeesByStatus["Active"];
      const isTodayAttendanceRecorded = activeEmployees.some((e) => {
        return (
          e.attendance &&
          e.attendance.length > 0 &&
          new Date(
            e.attendance[e.attendance.length - 1].date
          ).toLocaleDateString("en-GB") ===
            new Date().toLocaleDateString("en-GB")
        );
      });

      if (isTodayAttendanceRecorded) {
        setEmployeeAttendance(true);
      }
    }
  }, [employeesAttendance, groupEmployeesByStatus]);
  const updateEmployeeAttendance = (e) => {
    e.preventDefault();
    setDisableBtn(true);
    const attendance = [];
    employees.forEach((emp) => {
      if (emp.status == "Active") {
        attendance.push({ id: emp._id, status: e.target[emp._id].value });
      }
    });
    axios
      .post(
        `${baseUrl}/api/employee/attendance`,
        {
          attendance,
        },
        { withCredentials: true }
      )
      .then((res) => {
        setDisableBtn(false);
        setEmployeeAttendance(true);
        toast({
          title: "Attendance updated successfully",
        });
        setIsAttendanceOpen(false);
      })
      .catch((error) => {
        setDisableBtn(false);
        toast({
          variant: "destructive",
          title: "Error updating attendance.",
          description: error.response.data.message,
        });
      });
  };

  return (
    <Dialog
      open={isAttendanceOpen}
      onOpenChange={(open) => setIsAttendanceOpen(open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Employee Attendance</DialogTitle>
          <DialogDescription>
            Select everyone's attendance. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={updateEmployeeAttendance}
          className="h-full flex flex-col"
        >
          <div className="grid-col-2">
            <div className="grid gap-2 mt-5 mb-3 sm:grid-cols-2">
              {groupEmployeesByStatus["Active"] &&
                groupEmployeesByStatus["Active"].map((e) => {
                  // if (!employeesAttendance && e.attendance && e.attendance.length > 0 && new Date(e.attendance[e.attendance.length - 1].date).toLocaleDateString('en-GB') == new Date().toLocaleDateString('en-GB')) {
                  //     setEmployeeAttendance(true)
                  // }
                  return (
                    <div key={e._id}>
                      <Label htmlFor={e._id}>{e.name}</Label>
                      <select
                        id={e._id}
                        defaultValue="Present"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        <option value="">Select</option>
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                        <option value="Late">Late</option>
                        <option value="Half Day">Half Day</option>
                        <option value="On Leave">On Leave</option>
                      </select>
                    </div>
                  );
                })}
            </div>
          </div>
          <div className="mt-auto">
            <Button
              type="submit"
              className="w-full"
              disabled={disableBtn || employeesAttendance}
            >
              {disableBtn
                ? employeesAttendance
                  ? "Attendance updated"
                  : "Updating..."
                : employeesAttendance
                ? "Attendance Updated"
                : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAttendance;
