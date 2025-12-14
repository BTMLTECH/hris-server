import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { departmentMap, reverseDepartmentMap } from "@/types/report";

export interface LeaveListCardProps {
  title: string;
  description?: string;
  leaves: any[]; 
  userRole: string; // role of the currently logged-in user
}

export const LeaveListCard: React.FC<LeaveListCardProps> = ({ title, description, leaves, userRole }) => {
  const isHRorAdmin = ["admin", "hr"].includes(userRole.toLowerCase());
 
  

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {leaves.length === 0 ? (
          <p className="text-sm text-muted-foreground">No leaves</p>
        ) : (
          <table className="min-w-[800px] divide-y divide-gray-200 table-auto">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isHRorAdmin && (
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.map((leave) => {
                const user = leave.user;               

                return (
                  <tr key={leave._id} className="hover:bg-gray-50">
                    {/* Staff Column */}
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        {user.profileImage ? (
                          <AvatarImage
                            src={user.profileImage}
                            alt={user.firstName}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <AvatarFallback className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center text-gray-500">
                            {user.firstName?.[0] || ""}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <span>
                        {user.staffId} - {user.firstName} {user.lastName}
                      </span>
                    </td>

                    {/* Department */}
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                    {reverseDepartmentMap[user.department] || user.department}
                    </td>

                    {/* Leave Type */}
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{leave.type}</td>

                    {/* Days */}
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{leave.days}</td>

                    {/* Start Date */}
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>

                    {/* End Date */}
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2 whitespace-nowrap">
                      <Badge
                        variant={
                          leave.status.toLowerCase() === "approved"
                            ? "success"
                            : leave.status.toLowerCase() === "pending"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {leave.status.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Document */}
                    {isHRorAdmin && (
                      <td className="px-4 py-2 whitespace-nowrap">
                        {leave.url ? (
                          <a
                            href={leave.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 text-sm font-medium hover:underline"
                          >
                            View PDF
                          </a>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
};
