import { loginUser, logoutUserAPI } from './api';

export const login = async (email, password) => {
  try {
    const result = await loginUser(email, password);
    if (result && result.success && result.data) {
      return {
        token: result.data.token,
        user: result.data.user,
        refresh_token: result.data.refresh_token
      };
    }
    throw new Error(result?.message || "Invalid credentials");
  } catch (err) {
    throw new Error(err?.message || "Invalid email or password");
  }
};

export const logoutAPI = async () => {
  try {
    return await logoutUserAPI();
  } catch (err) {
    return { success: true };
  }
};
