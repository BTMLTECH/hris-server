import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Mail, Phone, Calendar, Briefcase, MapPin } from 'lucide-react';
import RoleBadge from '@/components/RoleBadge';
import { ProfileFormData } from '@/types/user';

interface EmployeeDetailViewProps {
  employee: ProfileFormData;
  onBack: () => void;
}

const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({ employee, onBack }) => {
  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Employee List
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{employee.firstName} {employee.middleName || ''} {employee.lastName}</h1>
          <p className="text-gray-600">Detailed profile and employment information</p>
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
            <RoleBadge role={employee.role} />
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{employee.email || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{employee.mobile || '-'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">{employee.department || '-'}</div>
                <div>{employee.position || '-'}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <div className="font-medium">Hire Date</div>
                <div>{employee.createdAt ? new Date(employee.createdAt).toLocaleDateString() : '-'}</div>
              </div>
            </div>
            {employee.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                <div>{employee.address}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Employment & Payroll Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employment Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium text-gray-500">Employee ID:</span>
                <p>{employee.staffId}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Department:</span>
                <p>{employee.department || '-'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Position:</span>
                <p>{employee.position || '-'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Office Branch:</span>
                <p>{employee.officeBranch || '-'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Class Level:</span>
                <p>{employee.accountInfo.classLevel || '-'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Bank Name:</span>
                <p>{employee.accountInfo.bankName || '-'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Bank Account:</span>
                <p>{employee.accountInfo.bankAccountNumber || '-'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Basic Pay:</span>
                <p>₦{employee.accountInfo.basicPay?.toLocaleString() || '0'}</p>
              </div>
            </CardContent>
          </Card>

          {employee.cooperative && (
            <Card>
              <CardHeader>
                <CardTitle>Cooperative Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium text-gray-500">Monthly Contribution:</span>
                  <p>₦{employee.cooperative.monthlyContribution.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Total Contributed:</span>
                  <p>₦{employee.cooperative.totalContributed.toLocaleString()}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Last Contribution:</span>
                  <p>{employee.cooperative.lastContributionDate ? new Date(employee.cooperative.lastContributionDate).toLocaleDateString() : '-'}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetailView;
