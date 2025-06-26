// Token structure
export interface Tokens {
  access_token: string;
  refresh_token: string;
}

// User information
export interface User {
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

// Merchant information
export interface Merchant {
  id: number;
  created_at: string;
  modified_at: string;
  name: string;
  email: string;
  location: string;
  address: string;
  logo: string;
  active: boolean;
}

// Full login response interface
export interface LoginResponse {
  tokens: Tokens;
  user: User;
  merchant?: Merchant;
  is_merchant?: boolean;
}
export interface CarouselSlide {
  id: number
  title: string
  subtitle: string
  stats: { [key: string]: string }
  imageSrc: string
  imageAlt: string
  badgeIcon: string
  badgeColor: string
  badgePosition: string
}
