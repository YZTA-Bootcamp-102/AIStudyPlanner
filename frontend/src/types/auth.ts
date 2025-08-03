export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: 'bearer';
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetForm {
  reset_code: string;
  new_password: string;
}
