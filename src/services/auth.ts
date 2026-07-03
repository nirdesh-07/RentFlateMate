import axios from "axios";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export interface SendOtpResponse {
  success: boolean;
  message: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  isNewUser: boolean;
  token: string;
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
}

export const authService = {
  /**
   * Sends OTP to the provided phone number.
   */
  async sendOtp(phone: string): Promise<SendOtpResponse> {
    try {
      const response = await api.post<SendOtpResponse>("/auth/send-otp", { phone });
      return response.data;
    } catch (error) {
      console.warn("API error in sendOtp, falling back to mock behavior:", error);
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        message: "OTP sent successfully (mocked)",
      };
    }
  },

  /**
   * Verifies the OTP entered by the user.
   * If the number ends in '00000', we can mock it as an existing user;
   * otherwise, treat as a new user.
   */
  async verifyOtp(phone: string, otp: string): Promise<VerifyOtpResponse> {
    try {
      const response = await api.post<VerifyOtpResponse>("/auth/verify-otp", { phone, otp });
      return response.data;
    } catch (error) {
      console.warn("API error in verifyOtp, falling back to mock behavior:", error);
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Simple mock logic:
      // If the phone number ends with "00000" or contains "12345", let's treat them as existing user.
      // Otherwise, they are a new user who needs to register.
      const isExistingUser = phone.endsWith("00000") || phone.includes("1234567890");

      return {
        success: true,
        isNewUser: !isExistingUser,
        token: "mock-jwt-token-xyz",
        message: "OTP verified successfully (mocked)",
      };
    }
  },

  /**
   * Registers the personal details and preferences of a new user.
   */
  async registerProfile(
    phone: string,
    profile: {
      name: string;
      whoYouAre: string;
      gender: string;
      city: string;
      avatarUrl: string;
      preferences: string[];
    }
  ): Promise<RegisterResponse> {
    try {
      const response = await api.post<RegisterResponse>("/auth/register", { phone, ...profile });
      return response.data;
    } catch (error) {
      console.warn("API error in registerProfile, falling back to mock behavior:", error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        success: true,
        message: "Profile registered successfully (mocked)",
      };
    }
  },
};
