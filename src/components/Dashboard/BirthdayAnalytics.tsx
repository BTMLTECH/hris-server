import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Cake } from "lucide-react";

import { format, parseISO } from "date-fns";
import { IBirthdayAnalytics } from "@/types/user";

interface BirthdayAnalyticsProps {
  birthdays: IBirthdayAnalytics[];
}

const BirthdayAnalytics: React.FC<BirthdayAnalyticsProps> = ({ birthdays }) => {
  const currentMonthShort = new Date().toLocaleString("default", {
    month: "short",
  }); // e.g., "Sep"

  const currentMonthCelebrants =
    birthdays.find(
      (b) => b.month.toLowerCase() === currentMonthShort.toLowerCase()
    )?.celebrants || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Cake className="h-5 w-5 text-pink-500" />
          <span>Birthdays This Month</span>
        </CardTitle>
        <CardDescription>Celebrate your teammates 🎉</CardDescription>
      </CardHeader>
      <CardContent>
        {currentMonthCelebrants.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No birthdays this month.
          </p>
        ) : (
          <div className="space-y-4">
            {currentMonthCelebrants.map((person) => {
              const dob =
                typeof person.dateOfBirth === "string"
                  ? parseISO(person.dateOfBirth)
                  : new Date(person.dateOfBirth);

              return (
                <div
                  key={person.staffId}
                  className="flex items-center space-x-4"
                >
                  <Avatar className="h-10 w-10">
                    {person.profileImage ? (
                      <AvatarImage
                        src={person.profileImage}
                        alt={`${person.firstName} ${person.lastName}`}
                      />
                    ) : (
                      <AvatarFallback>
                        {person.firstName.charAt(0)}
                        {person.lastName.charAt(0)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {person.firstName} {person.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(dob, "MMMM d")}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-700">
                    🎂
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BirthdayAnalytics;
