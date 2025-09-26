/* eslint-disable @typescript-eslint/no-explicit-any */
import { CreateCompanyDTO, ProfileFormData } from "./user";

export interface EmergencyContact {
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

export interface AccountInfo {
  classLevel: string;
  basicPay: number;
  allowances: number;
  bankAccountNumber: string;
  bankName: string;
  taxNumber?: string;
  pensionCompany?: string;
  pensionNumber?: string;
}

export interface CooperativeInfo {
  monthlyContribution: number;
  totalContributed: number;
  lastContributionDate?: string;
}

export interface IOnboardingTask {
  name: string;
  category: "training" | "services" | "device";
  completed: boolean;
  completedAt?: string;
}

export interface IOnboardingRequirement {
  _id?: string;
  employee: string;
  department: string;
  tasks: IOnboardingTask[];
  createdAt: string;
}

export interface ICompany {
  name: string;
  description?: string;
  roles: string;
  department: string;
  status: string;
  createdAt?: Date;
  branding?: {
    displayName?: string;
    logoUrl?: string;
    primaryColor?: string;
  };
}

export interface User {
  _id: string;
  staffId: string;
  title: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  stateOfOrigin?: string;
  address?: string;
  city?: string;
  mobile?: string;
  email: string;
  password?: string;
  department: string;
  biometryId?: string;
  profileImage?: string;
  position: string;
  officeBranch?: string;
  employmentDate?: string;
  accountInfo: AccountInfo;
  role: "md" | "teamlead" | "employee" | "admin" | "hr";
  company: ICompany;
  status: "active" | "inactive" | "terminated";
  terminationDate?: string;
  isActive: boolean;
  failedLoginAttempts: number;
  lockUntil?: string;
  resetRequested: boolean;
  resetRequestedAt?: string;
  twoFactorEnabled: boolean;
  twoFactorCode?: string;
  twoFactorExpiry?: string;
  resetToken?: string;
  resetTokenExpiry?: string;
  cooperative?: CooperativeInfo;
  createdAt: string;
  nextOfKin: EmergencyContact;
  sendInvite?: boolean;
  token?: string;
  onboardingRequirements?: IOnboardingRequirement[];
  basicSalary: number;
  totalAllowance: number;
}

export interface UserState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  code: string | null;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
  };
}

export interface Verify2fa {
  user?: User;
  // token: string | null;
  // refreshToken?: string | null;
}

export interface PasswordConfig {
  minLength?: number;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
}

export interface AuthContextType {
  user: User | null;
  profileRecord: User | null;
  profileError: any;
  cachedEmployees: ProfileFormData[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  profilesIsLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  verify2fa: (email: string, code: string) => Promise<boolean>;
  resend2fa: (email: string) => Promise<boolean>;
  reqestNewPassword: (email: string) => Promise<boolean>;
  resendInvite: (email: string) => Promise<boolean>;
  setNewPassword: (
    newPassword: string,
    passwordConfig: PasswordConfig,
    temporaryPassword: string,
    token: string
  ) => Promise<boolean>;
  logout: () => void;
  inviteUser: (userData: Partial<User>) => Promise<boolean>;
  bulkInviteUsers: (formData: FormData) => Promise<boolean>;
  createCompanyWithAdim: (data: CreateCompanyDTO) => Promise<boolean>;
  hasRole: (roles: string[]) => boolean;
  clearError: () => void;
}
