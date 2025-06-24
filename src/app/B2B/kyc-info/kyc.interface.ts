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

export interface Mapper {
  id: number;
  created_at: string;
  modified_at: string;
  field_name: string;
  field_type: string;
  required: boolean;
  active: boolean;
  country: number;
}

export interface submittedKycs {
  id: number;
  mapper: Mapper;
  merchant: Merchant;
  created_at: string;
  modified_at: string;
  text_value: string | null;
  file_value: string | null;
  approved: boolean;
}

export interface DataResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: submittedKycs[];
}
