import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Badge } from "@/components/ui/badge"; // Shadcn UI Badge
import { LeaveActivityFeedItem } from "@/types/leave";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface LeaveCalendarProps {
  request: LeaveActivityFeedItem;
}

export function LeaveCalendar({ request }: LeaveCalendarProps) {
  const { startDate, endDate, employeeName, relievers = [] } = request;

  // Calendar event
  const events: Event[] = [
    { title: employeeName, start: new Date(startDate), end: new Date(endDate), allDay: true },
  ];

  return (
    <div className="bg-white border rounded-lg shadow-md p-4 w-full max-w-md mx-auto">
      {/* Leave Info */}
      <div className="mb-4 space-y-2">
        <p className="font-semibold text-lg truncate">{employeeName}'s Leave</p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Duration:</span>{" "}
          {format(new Date(startDate), "PPP")} - {format(new Date(endDate), "PPP")}
        </p>

        {/* Relievers */}
        {relievers.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="font-medium text-sm">Relievers:</span>
            {relievers.map((r) => (
              <Badge
                key={r.user}
                variant={r.status === "approved" ? "default" : "secondary"}
                className="text-xs"
              >
                {r.firstName} {r.lastName} ({r.status})
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Calendar */}
      <div className="h-[300px] w-full">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          defaultView="month"
          style={{ height: "100%" }}
          eventPropGetter={() => ({
            style: {
              backgroundColor: "rgba(34,197,94,0.85)", // Tailwind green
              color: "white",
              borderRadius: "0.5rem",
              padding: "0.25rem 0.5rem",
              fontWeight: 600,
              fontSize: "0.875rem",
              textAlign: "center",
            },
          })}
        />
      </div>
    </div>
  );
}
