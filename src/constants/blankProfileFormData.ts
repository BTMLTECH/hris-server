import { ProfileFormData } from "@/types/user";



export const blankProfileFormData: ProfileFormData = {
  _id: '',
  staffId: '',
  title: '',
  firstName: '',
  middleName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  stateOfOrigin: '',
  address: '',
  city: '',
  mobile: '',
  email: '',
  department: '',
  departments: [
    {
      name: '',
      supervisor: '',
      sopDocument: '',
      company: '',
      _id: ''
    }
  ],
  biometryId: '',
  profileImage: '',
  position: '',
  officeBranch: '',
  employmentDate: '',
  accountInfo: {
    classLevel: '',
    basicPay: 0,
    allowances: 0,
    bankAccountNumber: '',
    bankName: '',
    taxNumber: '',
    pensionCompany: '',
    pensionNumber: ''
  },
  role: 'employee',
  company: {
    name: '',
    description: '',
    roles: '',
    department: '',
    status: '',
    branding: {
      displayName: '',
      logoUrl: '',
      primaryColor: '',
    }
  },
  status: 'active',
  terminationDate: '',
  isActive: false,
  failedLoginAttempts: 0,
  lockUntil: '',
  resetRequested: false,
  resetRequestedAt: '',
  twoFactorEnabled: false,
  twoFactorCode: '',
  twoFactorExpiry: '',
  resetToken: '',
  resetTokenExpiry: '',
  cooperative: {
    monthlyContribution: 0,
    totalContributed: 0,
    lastContributionDate: ''
  },
  createdAt: '',
  nextOfKin: {
    name: '',
    phone: '',
    email: '',
    relationship: ''
  },
  sendInvite: false,
  departmentName: '',
  requirements: [],
  selectedDepartment: "",
  classlevels: []
};

