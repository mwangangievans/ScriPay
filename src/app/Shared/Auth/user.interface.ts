export interface UserObject {
  tokens: {
    access_token: string;
    refresh_token: string;
  };
  user: {
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
  };
  merchant: {
    id: number;
    created_at: string;
    modified_at: string;
    name: string;
    email: string;
    location: string;
    address: string;
    logo: string;
    active: boolean;
  };
  is_merchant: boolean;
}
