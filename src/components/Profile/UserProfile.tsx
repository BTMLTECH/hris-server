import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useCombinedContext } from "@/contexts/AuthContext";
import { Mail, Calendar, Briefcase, Settings, Umbrella } from "lucide-react";
import ProfilePictureUpload from "./ProfilePictureUpload";

import { useAppSelector } from "@/store/hooks";

import { formatDateTime } from "@/utils/date";
import { getRoleColor, getRoleIcon } from "@/utils/getEditableFields";

import { Switch } from "../ui/switch";
import { reverseDepartmentMap } from "@/types/report";

const UserProfile: React.FC = () => {
  const { profile: userProfile } = useCombinedContext();
  const { profile: user } = userProfile;
  const { formData } = useAppSelector((state) => state.profile);
  

  const RoleIcon = getRoleIcon(user?.role || "");
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture and Basic Info */}
        <div className="lg:col-span-1 space-y-6">
          <ProfilePictureUpload
            userName={`${user?.firstName} ${user?.lastName}`}
            hasUploadedBefore={false}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RoleIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {user?.firstName} {user?.lastName}
                </h3>
                <Badge className={`mt-2 ${getRoleColor(user?.role || "")}`}>
                  {user?.role?.toUpperCase().replace("_", " ")}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>{user?.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Briefcase className="h-4 w-4 text-gray-500" />
                  <span>{user?.department || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>Joined: {formatDateTime(user.createdAt)} </span>
                </div>
                {(user?.role === "admin" || user?.role === "hr") && (
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>{user?.position}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Information */}
        <div className="lg:col-span-2 w-full min-h-screen p-4 sm:p-6 lg:p-8">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="leavebalance">Leave Balance</TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Personal details and contact information.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.middleName || ""}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={formData.lastName} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input id="title" value={formData.title} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Input id="gender" value={formData.gender} disabled />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={
                          formData.dateOfBirth
                            ? formData.dateOfBirth.split("T")[0]
                            : ""
                        }
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        value={formData.mobile}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stateOfOrigin">State of Origin</Label>
                      <Input
                        id="stateOfOrigin"
                        value={formData.stateOfOrigin}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" value={formData.city} disabled />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea id="address" value={formData.address} disabled />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="staffId">Staff ID</Label>
                      <Input value={formData.staffId} disabled />
                    </div>
                    <div className="space-y-2 flex items-center pt-8">
                      <Switch checked={formData.isActive} disabled />
                      <Label className="ml-2">Is Active</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Information Tab */}
            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>
                    Work-related details and qualifications.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={
                          reverseDepartmentMap[formData.department] ||
                          formData.department
                        }
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" value={formData.position} disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employmentDate">Employment Date</Label>
                      <Input
                        id="employmentDate"
                        type="date"
                        value={
                          formData.employmentDate
                            ? formData.employmentDate.split("T")[0]
                            : ""
                        }
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="officeBranch">Office Branch</Label>
                      <Input
                        id="officeBranch"
                        value={formData.officeBranch}
                        disabled
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Financial Information Tab */}
            <TabsContent value="financial">
              <Card>
                <CardHeader>
                  <CardTitle>Financial & Emergency Information</CardTitle>
                  <CardDescription>
                    Payroll and emergency contact details.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4 rounded-md border p-4">
                    <h3 className="text-lg font-medium">Account & Payroll</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">Bank Name</Label>
                        <Input
                          id="bankName"
                          value={formData.accountInfo?.bankName}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bankAccountNumber">
                          Bank Account Number
                        </Label>
                        <Input
                          id="bankAccountNumber"
                          value={formData.accountInfo?.bankAccountNumber}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="basicPay">Basic Pay (NGN)</Label>
                        <Input
                          id="basicPay"
                          type="number"
                          value={formData.accountInfo?.basicPay}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="allowances">Allowances (NGN)</Label>
                        <Input
                          id="allowances"
                          type="number"
                          value={formData.accountInfo?.allowances}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxNumber">Tax Number</Label>
                        <Input
                          id="taxNumber"
                          value={formData.accountInfo?.taxNumber || ""}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pensionCompany">Pension Company</Label>
                        <Input
                          id="pensionCompany"
                          value={formData.accountInfo?.pensionCompany || ""}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pensionNumber">Pension Number</Label>
                      <Input
                        id="pensionNumber"
                        value={formData.accountInfo?.pensionNumber || ""}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-4 rounded-md border p-4">
                    <h3 className="text-lg font-medium">Cooperative</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="monthlyContribution">
                          Monthly Contribution (NGN)
                        </Label>
                        <Input
                          id="monthlyContribution"
                          type="number"
                          value={
                            formData.cooperative?.monthlyContribution || ""
                          }
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalContributed">
                          Total Contributed (NGN)
                        </Label>
                        <Input
                          id="totalContributed"
                          type="number"
                          value={formData.cooperative?.totalContributed || ""}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastContributionDate">
                        Last Contribution Date
                      </Label>
                      <Input
                        id="lastContributionDate"
                        type="date"
                        value={formData.cooperative?.lastContributionDate || ""}
                        disabled
                      />
                    </div>
                  </div>
                  <div className="space-y-4 rounded-md border p-4">
                    <h3 className="text-lg font-medium">Next of Kin</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nextOfKinName">Name</Label>
                        <Input
                          id="nextOfKinName"
                          value={formData.nextOfKin?.name}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nextOfKinPhone">Phone</Label>
                        <Input
                          id="nextOfKinPhone"
                          type="tel"
                          value={formData.nextOfKin?.phone}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nextOfKinEmail">Email</Label>
                        <Input
                          id="nextOfKinEmail"
                          type="email"
                          value={formData.nextOfKin?.email}
                          disabled
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nextOfKinRelationship">
                          Relationship
                        </Label>
                        <Input
                          id="nextOfKinRelationship"
                          value={formData.nextOfKin?.relationship}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="leavebalance">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Umbrella className="h-5 w-5 text-gray-600" />
                    Leave Balance ({formData?.leaveBalance?.year ?? "0"})
                  </CardTitle>
                </CardHeader>

                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                  <div>
                    <span className="font-medium text-gray-500">Annual:</span>
                    <p>
                      {formData?.leaveBalance?.balances?.annual ?? "0"} days
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Compassionate:
                    </span>
                    <p>
                      {formData?.leaveBalance?.balances?.compassionate ?? "0"}{" "}
                      days
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">
                      Maternity:
                    </span>
                    <p>
                      {formData?.leaveBalance?.balances?.maternity ?? "0"} days
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
