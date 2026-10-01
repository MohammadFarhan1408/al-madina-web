import { apiGet, apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { AuthResult, User } from "@/types/commerce";

export const authService = {
  signUp: (input: { fullName: string; email: string; password: string }) =>
    apiPost<AuthResult>(endpoints.auth.signUp, input),

  signIn: (input: { email: string; password: string }) =>
    apiPost<AuthResult>(endpoints.auth.signIn, input),

  // The proxy supplies the refresh token from its httpOnly cookie.
  signOut: () => apiPost<null>(endpoints.auth.signOut),

  me: () => apiGet<User>(endpoints.auth.me),

  forgotPassword: (email: string) =>
    apiPost<null>(endpoints.auth.forgotPassword, { email }),

  resetPassword: (input: { token: string; password: string }) =>
    apiPost<null>(endpoints.auth.resetPassword, input),
};
