export interface User {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber?:string;
  dateOfBirth?: string;
  address?: string;
  profileImage?: string; 
  position?: string;
  createdAt?: string;
  skills?: string[];
  education?: string;
  workExperience?: string;
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  role: 
  | 'hr'
  | 'md'
  | 'teamlead'
  | 'employee'
  | 'admin';
  biometryId?: string;
  department: string;
  experience?: string;
  companyId: string; // flattened from mongoose ObjectId
  status: 'active' | 'inactive' | 'terminated';
  token: string,
  hireDate?: string;
  salary?: number;
  sendInvite: false
}

// The wrapper interface that contains the user property
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


export interface  Verify2fa  {
  user?: User;
  // token: string | null;
  // refreshToken?: string | null;
};

export interface PasswordConfig {
  minLength?: number;
  requireUppercase?: boolean;
  requireNumber?: boolean;
  requireSpecialChar?: boolean;
}

export interface AuthContextType {
  user: User | null;
  // token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  profilesIsLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  resetPassword: (email: string) => Promise<boolean>;
  verify2fa: (email: string,code: string) => Promise<boolean>;
  resend2fa: (email: string) => Promise<boolean>;
  reqestNewPassword: (email: string) => Promise<boolean>;
  resendInvite: (email: string) => Promise<boolean>;
  setNewPassword: (newPassword: string, passwordConfig:PasswordConfig, temporaryPassword: string, token:string) => Promise<boolean>;
  logout: () => void;
  inviteUser: (userData: Partial<User>) => Promise<boolean>;
  bulkInviteUsers: (formData: FormData) => Promise<boolean>;  
  hasRole: (roles: string[]) => boolean;
  clearError: () => void;
}