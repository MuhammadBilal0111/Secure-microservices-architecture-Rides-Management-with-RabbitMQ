const axiosInstance = require("./../utils/axiosInstance")
exports.getUserProfile = async (token) => {
  try {
    const res = await axiosInstance.get("/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "Axios Error (getUserProfile):",
      error.response?.data || error.message
    );
    throw error;
  }
};
exports.getCaptainProfile = async (token) => {
  try {
    const res = await axiosInstance.get("/captain/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "Axios Error (getUserProfile):",
      error.response?.data || error.message
    );
    throw error;
  }
};
