// // Nigerian Public Holidays
// export const nigerianPublicHolidays2025 = [
//   { name: "New Year's Day", date: "2025-01-01" },
//   { name: "Eid al‑Fitr", date: "2025-03-31" },
//   { name: "Eid al‑Fitr Holiday", date: "2025-04-01" },
//   { name: "Good Friday", date: "2025-04-18" },
//   { name: "Easter Monday", date: "2025-04-21" },
//   { name: "Workers' Day", date: "2025-05-01" },
//   { name: "Children's Day", date: "2025-05-27" },
//   { name: "Eid al‑Adha", date: "2025-06-07" },
//   { name: "Eid al‑Adha Holiday", date: "2025-06-08" },
//   { name: "Democracy Day", date: "2025-06-12" },
//   { name: "Eid al‑Maulud", date: "2025-09-05" },
//   { name: "Independence Day", date: "2025-10-01" },
//   { name: "Christmas Day", date: "2025-12-25" },
//   { name: "Boxing Day", date: "2025-12-26" },
// ];

// export const isPublicHoliday = (date: Date): boolean => {
//   const dateString = date.toISOString().split('T')[0];
//   return nigerianPublicHolidays2025.some(holiday => holiday.date === dateString);
// };

// export const calculateWorkingDays = (
//   startDate: string,
//   endDate: string
// ): { workingDays: number; totalDays: number } => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   let totalDays = 0;
//   let workingDays = 0;

//   for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
//     totalDays++;
//     if (!isPublicHoliday(date)) {
//       workingDays++;
//     }
//   }

//   return { totalDays, workingDays };
// };

// export const getHolidaysInRange = (
//   startDate: string,
//   endDate: string
// ): { date: string; name: string; type: string }[] => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   const holidays: { date: string; name: string; type: string }[] = [];

//   for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
//     if (isPublicHoliday(date)) {
//       const dateStr = date.toISOString().split('T')[0];
//       const holiday = nigerianPublicHolidays2025.find(h => h.date === dateStr);
//       holidays.push({
//         date: dateStr,
//         name: holiday?.name || "Public Holiday",
//         type: "public",
//       });
//     }
//   }

//   return holidays;
// };

// Nigerian Public Holidays
export const nigerianPublicHolidays2025 = [
  { name: "New Year's Day", date: "2025-01-01" },
  { name: "Eid al-Fitr", date: "2025-03-31" },
  { name: "Eid al-Fitr Holiday", date: "2025-04-01" },
  { name: "Good Friday", date: "2025-04-18" },
  { name: "Easter Monday", date: "2025-04-21" },
  { name: "Workers' Day", date: "2025-05-01" },
  { name: "Children's Day", date: "2025-05-27" },
  { name: "Eid al-Adha", date: "2025-06-07" },
  { name: "Eid al-Adha Holiday", date: "2025-06-08" },
  { name: "Democracy Day", date: "2025-06-12" },
  { name: "Eid al-Maulud", date: "2025-09-05" },
  { name: "Independence Day", date: "2025-10-01" },
  { name: "Christmas Day", date: "2025-12-25" },
  { name: "Boxing Day", date: "2025-12-26" },
];

export const isPublicHoliday = (date: Date): boolean => {
  const dateString = date.toISOString().split("T")[0];
  return nigerianPublicHolidays2025.some(
    (holiday) => holiday.date === dateString
  );
};

export const calculateWorkingDays = (
  startDate: string,
  endDate: string
): { workingDays: number; totalDays: number } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  let totalDays = 0;
  let workingDays = 0;

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    totalDays++;

    const day = date.getDay(); // 0 = Sunday, 6 = Saturday

    // Skip weekends
    if (day === 0 || day === 6) continue;

    // Skip public holidays
    if (!isPublicHoliday(date)) {
      workingDays++;
    }
  }

  return { totalDays, workingDays };
};

export const getHolidaysInRange = (
  startDate: string,
  endDate: string
): { date: string; name: string; type: string }[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const holidays: { date: string; name: string; type: string }[] = [];

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    if (isPublicHoliday(date)) {
      const dateStr = date.toISOString().split("T")[0];
      const holiday = nigerianPublicHolidays2025.find(
        (h) => h.date === dateStr
      );
      holidays.push({
        date: dateStr,
        name: holiday?.name || "Public Holiday",
        type: "public",
      });
    }
  }

  return holidays;
};
