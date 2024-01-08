import { instance } from "./config";
const signup = async (data) => {
  try {
    const response = await instance.post("/users/register", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const sendNotificationToUsers = async (data) => {
  try {
    const response = await instance.post("management/sendsome", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

const sendNotificationToAllUsers = async (data) => {
  try {
    const response = await instance.post("management/sendall", data);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export { signup, sendNotificationToAllUsers, sendNotificationToUsers };
