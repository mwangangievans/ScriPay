export interface Pagination<T = any> {
  count: number;
  next: string | null;
  previous: string | null;
  results?: T[];
}

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

export interface Countries {
  id: number;
  created_at: string;
  modified_at: string;
  name: string;
  code: number;
  currency: string;
  logo: string;
  timezone: string;
  active: boolean;
}

export interface onbordingRequiremnetByCountry {
  id: number;
  created_at: string;
  modified_at: string;
  field_name: string;
  field_type: number;
  required: boolean
  active: boolean;
  country: number;
}


