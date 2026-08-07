export interface LoginVendorDto {
  email: string;
  password: string;
}

export interface RegisterVendorDto {
  email: string;
  password: string;
  name: string;
  accountNumber: string;
  creditRating: number;
  preferredVendorStatus?: boolean;
  activeFlag?: boolean;
  purchasingWebServiceUrl?: string;
}

export interface VendorSafe {
  businessEntityId: number;
  email: string;
  [key: string]: unknown; // Changed from any to unknown
}

export interface AuthResponse {
  accessToken: string;
  vendor: VendorSafe;
}