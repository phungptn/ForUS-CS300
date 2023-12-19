import { instance } from "./config";

const infoUser = async () => {
  try {
    const response = await instance.get("/users/info");
    return response;
  } catch (error) {
    console.error(error);
  }

  return null;
};

const logout = async () => {
  try {
    const response = await instance.post("/users/logout");
    return response;
  } catch (error) {
    console.error(error);
  }
};

const updateProfile = async (data) => {
  try {
    const response = await instance.put("/users/update-profile", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const forgotPassword = async (data) => {
  try {
    const response = await instance.post("/users/forgot-password", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const resetPassword = async (data) => {
  try {
    const response = await instance.put("/users/reset-password", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const updatePassword = async (data) => {
    try {
        const response = await instance.put("/users/update-password", data);
        return response;
    } catch (error) {
        console.error(error);
    }
};
export { logout, infoUser, updateProfile, forgotPassword, resetPassword, updatePassword };
