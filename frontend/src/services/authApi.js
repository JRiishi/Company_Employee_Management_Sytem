import { loginUser, logoutUserAPI } from './api';

export const login = async (email, password) => {
  const result = await loginUser(email, password);
  // 'result' is the standard {success, message, data} payload.
  if (result.success && result.data) {
    // Return data for the AuthContext
    return {
      token: result.data.token,
      user: result.data.user,
      refresh_token: result.data.refresh_token
    };
  }
  throw new Error(result.message || "Invalid credentials");
};

export const logoutAPI = async () => {
  try {
    return await logoutUserAPI();
  } catch (err) {
    return { success: true }; // Fail silently to force clear front end state
  }
};
