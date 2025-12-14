import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Edit,
  Save,
  X,
  HandCoins,
} from "lucide-react";
import ProfilePictureUpload from "./ProfilePictureUpload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setFormData, setIsEditing } from "@/store/slices/profile/profileSlice";
import { useCombinedContext } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const EmployeeProfile: React.FC = () => {
  const { profile } = useCombinedContext();
  const user = profile.profile;
  const dispatch = useAppDispatch();
  const { formData, isEditing } = useAppSelector((state) => state.profile);

  const handleSave = () => {
    // Save profile logic here
    dispatch(setIsEditing(false));
  };

  // const getInitials = (name: string) => {
  //   return name
  //     .split(" ")
  //     .map((n) => n[0])
  //     .join("")
  //     .toUpperCase();
  // };

  const handleSubmit = () => {
    dispatch(setFormData({ ...formData, message: "" }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Edit / Save Button */}
          <Button
            onClick={() =>
              isEditing ? handleSave() : dispatch(setIsEditing(true))
            }
            className="flex items-center gap-2"
          >
            {isEditing ? (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>

          {/* Participate in Cooperative */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <HandCoins className="h-4 w-4" />
                Participate in Cooperative
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Request to Join Cooperative</DialogTitle>
                <p className="text-sm text-gray-500">
                  Notify HR that you want to participate in the cooperative
                  scheme.
                </p>
              </DialogHeader>

              <div>
                <Label htmlFor="message">Message Hr </Label>
                <Input
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    dispatch(
                      setFormData({ ...formData, message: e.target.value })
                    )
                  }
                />
              </div>

              <DialogFooter>
                <Button onClick={handleSubmit}>Submit Request</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <ProfilePictureUpload
            userName={`${user?.firstName} ${user?.lastName}`}
            hasUploadedBefore={!!user?.profileImage}
          />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {user?.title} {user?.firstName} {user?.middleName}{" "}
                  {user?.lastName}
                </h3>
                <Badge variant="outline" className="mt-2">
                  {user?.role?.toUpperCase()}
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
                  <span>
                    Joined:{" "}
                    {user?.employmentDate
                      ? new Date(user.employmentDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="professional">Professional</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="emergency">Emergency</TabsTrigger>
            </TabsList>

            {/* Personal Info */}
            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="staffId">Staff ID</Label>
                      <Input id="staffId" value={formData.staffId} disabled />
                    </div>
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          dispatch(
                            setFormData({ ...formData, title: e.target.value })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              firstName: e.target.value,
                            })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        value={formData.middleName}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              middleName: e.target.value,
                            })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        dispatch(
                          setFormData({ ...formData, lastName: e.target.value })
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Input
                        id="gender"
                        value={formData.gender}
                        onChange={(e) =>
                          dispatch(
                            setFormData({ ...formData, gender: e.target.value })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="dateOfBirth">Date of Birth</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={
                          formData.dateOfBirth
                            ? formData.dateOfBirth.split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              dateOfBirth: e.target.value,
                            })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="stateOfOrigin">State of Origin</Label>
                      <Input
                        id="stateOfOrigin"
                        value={formData.stateOfOrigin}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              stateOfOrigin: e.target.value,
                            })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) =>
                          dispatch(
                            setFormData({ ...formData, city: e.target.value })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        dispatch(
                          setFormData({ ...formData, address: e.target.value })
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Phone Number</Label>
                    <Input
                      id="mobile"
                      value={formData.mobile}
                      onChange={(e) =>
                        dispatch(
                          setFormData({ ...formData, mobile: e.target.value })
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Professional Info */}
            <TabsContent value="professional">
              <Card>
                <CardHeader>
                  <CardTitle>Professional Information</CardTitle>
                  <CardDescription>Your work-related details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        disabled
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={formData.position}
                        disabled={!isEditing}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              position: e.target.value,
                            })
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="officeBranch">Office Branch</Label>
                      <Input
                        id="officeBranch"
                        value={formData.officeBranch}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              officeBranch: e.target.value,
                            })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="employmentDate">Employment Date</Label>
                      <Input
                        id="employmentDate"
                        type="date"
                        value={formData.employmentDate}
                        disabled={!isEditing}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              employmentDate: e.target.value,
                            })
                          )
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Account Info */}
            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    Financial and payroll details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="classLevel">Class Level</Label>
                      <Input
                        id="classLevel"
                        value={formData.accountInfo.classLevel}
                        disabled={!isEditing}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              accountInfo: {
                                ...formData.accountInfo,
                                classLevel: e.target.value,
                              },
                            })
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="basicPay">Basic Pay</Label>
                      <Input
                        id="basicPay"
                        type="number"
                        value={formData.accountInfo.basicPay}
                        disabled={!isEditing}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              accountInfo: {
                                ...formData.accountInfo,
                                basicPay: Number(e.target.value),
                              },
                            })
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bank">Bank</Label>
                      <Input
                        id="bank"
                        value={formData.accountInfo.bankName}
                        disabled={!isEditing}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              accountInfo: {
                                ...formData.accountInfo,
                                bank: e.target.value,
                              },
                            })
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        value={formData.accountInfo.bankAccountNumber}
                        disabled={!isEditing}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              accountInfo: {
                                ...formData.accountInfo,
                                accountNumber: e.target.value,
                              },
                            })
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pensionFundAdministrator">
                        Pension Administrator
                      </Label>
                      <Input
                        id="pensionFundAdministrator"
                        value={formData.accountInfo.pensionCompany}
                        disabled={!isEditing}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              accountInfo: {
                                ...formData.accountInfo,
                                pensionFundAdministrator: e.target.value,
                              },
                            })
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="pensionAccountNumber">
                        Pension Account Number
                      </Label>
                      <Input
                        id="pensionAccountNumber"
                        value={formData.accountInfo.pensionNumber}
                        disabled={!isEditing}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              accountInfo: {
                                ...formData.accountInfo,
                                pensionAccountNumber: e.target.value,
                              },
                            })
                          )
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="taxNumber">Tax Number</Label>
                    <Input
                      id="taxNumber"
                      value={formData.accountInfo.taxNumber}
                      disabled={!isEditing}
                      onChange={(e) =>
                        dispatch(
                          setFormData({
                            ...formData,
                            accountInfo: {
                              ...formData.accountInfo,
                              taxNumber: e.target.value,
                            },
                          })
                        )
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="allowances">Allowances</Label>
                    <Textarea
                      id="allowances"
                      value={formData.accountInfo.allowances}
                      disabled={!isEditing}
                      onChange={(e) =>
                        dispatch(
                          setFormData({
                            ...formData,
                            accountInfo: {
                              ...formData.accountInfo,
                              allowances: e.target.value.split(","),
                            },
                          })
                        )
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emergency Info */}
            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>
                    Contact information for emergencies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nextOfKinName">Name</Label>
                      <Input
                        id="nextOfKinName"
                        value={formData.nextOfKin.name}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              nextOfKin: {
                                ...formData.nextOfKin,
                                name: e.target.value,
                              },
                            })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nextOfKinPhone">Phone</Label>
                      <Input
                        id="nextOfKinPhone"
                        value={formData.nextOfKin.phone}
                        onChange={(e) =>
                          dispatch(
                            setFormData({
                              ...formData,
                              nextOfKin: {
                                ...formData.nextOfKin,
                                phone: e.target.value,
                              },
                            })
                          )
                        }
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="nextOfKinEmail">Email</Label>
                    <Input
                      id="nextOfKinEmail"
                      value={formData.nextOfKin.email}
                      onChange={(e) =>
                        dispatch(
                          setFormData({
                            ...formData,
                            nextOfKin: {
                              ...formData.nextOfKin,
                              email: e.target.value,
                            },
                          })
                        )
                      }
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextOfKinRelationship">Relationship</Label>
                    <Input
                      id="nextOfKinRelationship"
                      value={formData.nextOfKin.relationship}
                      onChange={(e) =>
                        dispatch(
                          setFormData({
                            ...formData,
                            nextOfKin: {
                              ...formData.nextOfKin,
                              relationship: e.target.value,
                            },
                          })
                        )
                      }
                      disabled={!isEditing}
                    />
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

export default EmployeeProfile;
