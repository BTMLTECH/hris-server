/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Umbrella,
  Loader2,
} from "lucide-react";
import RoleBadge, { RoleBadgeProps } from "@/components/RoleBadge";
import { ProfileFormData } from "@/types/user";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import AccountInfoSection from "./AccountInfoSection";
import BasicInfoSection from "./BasicInfoSection";
import NextOfKinSection from "./NextOfKinSection";
import OfficeInfoSection from "./OfficeInfoSection";
import RequirementsSection from "./RequirementsSection";
import { Dispatch } from "@reduxjs/toolkit";

interface EmployeeDetailViewProps {
  employee: ProfileFormData;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: ProfileFormData;
  setFormData: (data: ProfileFormData) => void;
  isEditMode: boolean;
  isLocalLoading: (id: string, action: string) => boolean;
  dispatch: Dispatch<any>;
  nextStaffId: string;
}

const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({
  employee,
  onBack,
  onSubmit,
  formData,
  setFormData,
  isEditMode,
  isLocalLoading,
  dispatch,
  nextStaffId,
}) => {
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };



  return (
    <form className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2">
          {" "}
          <Button
            variant="outline"
            onClick={onBack}
            type="button"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Employee List{" "}
          </Button>
        </div>
        <div>
          <h1 className="text-3xl font-bold">
            {employee.firstName} {employee.middleName || ""} {employee.lastName}
          </h1>
          <p className="text-gray-600">
            Detailed profile and employment information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center space-y-2">
            <Avatar className="w-28 h-28 mx-auto">
              <AvatarImage src={employee.profileImage} />
              <AvatarFallback className="bg-primary-100 text-primary-700 text-xl">
                {getInitials(employee.firstName)}
              </AvatarFallback>
            </Avatar>
            <RoleBadge role={employee.role as RoleBadgeProps["role"]} />
          </CardHeader>

          <CardContent className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{employee.email || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{employee.mobile || "-"}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">Hire Date</div>
                <div>
                  {employee.employmentDate
                    ? new Date(employee.employmentDate).toLocaleDateString()
                    : "-"}
                </div>
              </div>
            </div>
            {employee.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div>
                  {employee.address}, {employee.city}, {employee.stateOfOrigin}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="basic">
            <TabsList className="mb-4 w-full flex justify-between">
              <TabsTrigger value="basic" className="flex-1 text-center">
                Basic Info
              </TabsTrigger>
              <TabsTrigger value="kin" className="flex-1 text-center">
                Next of Kin
              </TabsTrigger>
              <TabsTrigger value="office" className="flex-1 text-center">
                Office
              </TabsTrigger>
              <TabsTrigger value="account" className="flex-1 text-center">
                Account
              </TabsTrigger>
              <TabsTrigger value="requirements" className="flex-1 text-center">
                Requirements
              </TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <BasicInfoSection
                formData={formData}
                dispatch={dispatch}
                nextStaffId={nextStaffId}
                isEditMode={isEditMode}
              />
            </TabsContent>
            <TabsContent value="kin">
              <NextOfKinSection formData={formData} dispatch={dispatch} />
            </TabsContent>
            <TabsContent value="office">
              <OfficeInfoSection formData={formData} dispatch={dispatch} />
            </TabsContent>
            <TabsContent value="account">
              <AccountInfoSection formData={formData} dispatch={dispatch} />
            </TabsContent>
            <TabsContent value="requirements">
              <RequirementsSection formData={formData} dispatch={dispatch} />
            </TabsContent>
          </Tabs>

          {/* Cooperative Info */}
          {employee.cooperative && (
            <Card>
              <CardHeader>
                <CardTitle>Cooperative Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-gray-500">
                    Monthly Contribution:
                  </span>
                  <p>
                    ₦
                    {employee.cooperative?.monthlyContribution?.toLocaleString() ||
                      "0"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">
                    Total Contributed:
                  </span>
                  <p>
                    ₦
                    {employee.cooperative?.totalContributed?.toLocaleString() ||
                      "0"}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">
                    Last Contribution:
                  </span>
                  <p>
                    {employee.cooperative?.lastContributionDate
                      ? new Date(
                          employee.cooperative.lastContributionDate
                        ).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leave Balance */}
          {employee.leaveBalance && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Umbrella className="h-5 w-5 text-gray-600" />
                  Leave Balance ({employee.leaveBalance.year})
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-gray-500">Annual:</span>
                  <p>{employee.leaveBalance.balances.annual} days</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">
                    Compassionate:
                  </span>
                  <p>{employee.leaveBalance.balances.compassionate} days</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Maternity:</span>
                  <p>{employee.leaveBalance.balances.maternity} days</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Save/Update Button */}
          {isEditMode && (
            <div className="flex justify-end mt-4">
              <Button
                type="submit"
                className="px-6"
                onClick={onSubmit}
                disabled={isLocalLoading("editemployee", "editemployee")}
              >
                {isLocalLoading("editemployee", "editemployee") ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin text-white" />
                    Saving...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </form>
  );
};

export default EmployeeDetailView;
