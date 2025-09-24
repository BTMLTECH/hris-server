import React, { createContext, useContext } from "react";
import { AuthContextType } from "@/types/auth";

import { useReduxAuth } from "@/hooks/auth/useReduxAuth";
import { useReduxProfile } from "@/hooks/user/useReduxProfile";
import { ProfileContextType } from "@/types/user";
import { useReduxAttendance } from "@/hooks/attendance/useReduxAttendance";
import { AttendanceContextType } from "@/types/attendance";
import { useReduxLeave } from "@/hooks/leave/useReduxLeave";
import { UseReduxLeaveReturnType } from "@/types/leave";
import { HandoverContextType } from "@/types/handover";
import { useReduxHandover } from "@/hooks/handover/useReduxHandover";
import { useReduxAppraisal } from "@/hooks/appraisal/useReduxAppraisal";
import { UseReduxAppraisalReturnType } from "@/types/appraisal";
import { PayrollContextType } from "@/types/payroll";
import { useReduxPayroll } from "@/hooks/payroll/useReduxPayroll";
import { useReduxNotificationContext } from "@/hooks/notification/useReduxNotification";
import { NotificationContextType } from "@/types/notification";
import { useReduxReportContext } from "@/hooks/report/useReduxReport";
import { ReportContextType } from "@/types/report";
import { ClassContextType } from "@/types/class";
import { useReduxClass } from "@/hooks/class/useReduxClass";
import { TrainingContextType } from "@/types/training";
import { useReduxTraining } from "@/hooks/training/useReduxTraining";
import { useReduxContribution } from "@/hooks/cooperative/useReduxCooperative";
import { ContributionContextType } from "@/types/cooperation";

const CombinedContext = createContext<
  | {
      user: AuthContextType;
      profile: ProfileContextType;
      attendance: AttendanceContextType;
      leave: UseReduxLeaveReturnType;
      handover: HandoverContextType;
      appraisal: UseReduxAppraisalReturnType;
      payroll: PayrollContextType;
      notification: NotificationContextType;
      report: ReportContextType;
      classlevel: ClassContextType;
      training: TrainingContextType;
      cooperative: ContributionContextType;
    }
  | undefined
>(undefined);

export const CombinedProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const user = useReduxAuth();
  const profile = useReduxProfile();
  const attendance = useReduxAttendance();
  const leave = useReduxLeave();
  const handover = useReduxHandover();
  const appraisal = useReduxAppraisal();
  const payroll = useReduxPayroll();
  const notification = useReduxNotificationContext();
  const report = useReduxReportContext();
  const classlevel = useReduxClass();
  const training = useReduxTraining();
  const cooperative = useReduxContribution();

  if (
    !user ||
    !profile ||
    !attendance ||
    !leave ||
    !handover ||
    !appraisal ||
    !payroll ||
    !notification ||
    !report ||
    !classlevel ||
    !training ||
    !cooperative
  ) {
    return <div>Loading...</div>;
  }

  return (
    <CombinedContext.Provider
      value={{
        user,
        profile,
        attendance,
        leave,
        handover,
        appraisal,
        payroll,
        notification,
        report,
        classlevel,
        training,
        cooperative,
      }}
    >
      {children}
    </CombinedContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCombinedContext = () => {
  const context = useContext(CombinedContext);
  if (!context) {
    throw new Error("useCombinedContext must be used within CombinedProvider");
  }
  return context;
};
