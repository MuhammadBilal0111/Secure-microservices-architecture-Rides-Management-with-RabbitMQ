// utils/axiosInstance.js
const axios = require("axios");

const axiosInstance = axios.create({
  baseURL: `${process.env.BASE_URL}`,
});

module.exports = axiosInstance;
