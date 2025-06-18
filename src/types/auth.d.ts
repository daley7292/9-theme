interface AuthResponse<Response> {
  data: Response;
}
interface LoginResponse {
  auth_data: string;
  is_admin: 0 | 1 | null;
  token: string;
}
