// register-form.interface.ts
export interface UserRegistration {
  fullname: string;
  email: string;
  phone_number: string;
  password: string;
  verificationCode?: string; // Optional for verification step
  context: "Verification"

}

export interface otpVerificationData {
  code?: string,
  password?: string,
  username?: string,
  context: "Verification"
}

// register-form.interface.ts
export interface UserLoginData {
  username: string;
  password: string;

}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthenticatedUser {
  id: number;
  username: string;
  email: string;
  email_verified: boolean;
  phone_number: string;
  phone_number_verified: boolean;
  is_verified: boolean;
  fullname: string;
  is_active: boolean;
  is_staff: boolean;
}

export interface AuthResponse {
  tokens: AuthTokens;
  user: AuthenticatedUser;
}


export interface loginResponse {
  tokens: {
    access_token: string,
    refresh_token: string
  },
  user: {
    id: number,
    username: string,
    email: string,
    email_verified: boolean,
    phone_number: string,
    phone_number_verified: boolean,
    is_verified: boolean
    fullname: string,
    is_active: boolean,
    is_staff: boolean,
  },
  is_machant: boolean
}



