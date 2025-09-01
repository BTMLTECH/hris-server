// import { useAppSelector } from "@/store/hooks";
// import { IPayroll } from "@/types/payroll";
// import { useMemo } from "react";

// interface UseFilteredPayrollRecordsProps {
//   user: { _id: string; role: string };
//   cachedPayrolls: IPayroll[];
//   payrollRecords: { data: IPayroll[] };
//   sortDirection: "asc" | "desc";
//   searchTerm?: string;
// }

// export const useFilteredPayrollRecords = ({
//   user,
//   cachedPayrolls,
//   payrollRecords,
//   sortDirection,
//   searchTerm = "",
// }: UseFilteredPayrollRecordsProps) => {
//   const {
//     selectedMonth,
//     selectedYear,
//     filtersApplied,
//   } = useAppSelector((state) => state.payroll);

//   const canManagePayroll = user?.role === "admin" || user?.role === "hr";

//   const records = useMemo(() => {
//     let data = cachedPayrolls.length
//       ? cachedPayrolls
//       : payrollRecords?.data || [];

//     // Role-based filtering
//     if (!canManagePayroll) {
//       data = data.filter((r) => r.employee?._id === user._id);
//     }

//     // Month/year filtering
//     if (filtersApplied) {
//       if (selectedMonth) {
//         data = data.filter((r) => r.month === selectedMonth);
//       }
//       if (selectedYear) {
//         data = data.filter((r) => r.year === selectedYear);
//       }
//     }

//     // Optional: search by employee name/email
//     if (searchTerm) {
//       const term = searchTerm.toLowerCase();
//       data = data.filter((r) => {
//         const fullName =
//           `${r.employee?.firstName ?? ""} ${r.employee?.lastName ?? ""}`.toLowerCase();
//         return (
//           fullName.includes(term) ||
//           r.email?.toLowerCase().includes(term)
//         );
//       });
//     }

//     // Sort
//     const monthIndex = (month: string) => month.indexOf(month);
//     return [...data].sort((a, b) => {
//       const aDate = new Date(Number(a.year), monthIndex(a.month));
//       const bDate = new Date(Number(b.year), monthIndex(b.month));
//       return sortDirection === "asc"
//         ? aDate.getTime() - bDate.getTime()
//         : bDate.getTime() - aDate.getTime();
//     });
//   }, [
//     cachedPayrolls,
//     payrollRecords,
//     user,
//     canManagePayroll,
//     selectedMonth,
//     selectedYear,
//     filtersApplied,
//     sortDirection,
//     searchTerm,
//   ]);

//   return records;
// };
