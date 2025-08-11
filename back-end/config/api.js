// config/api.js
require("dotenv").config();

const baseURL =
    process.env.API_ENV === "homologacao"
        ? process.env.API_BASE_HOMOLOG
        : "";

module.exports = {
    apiBaseUrl: baseURL,
    apiKey: process.env.API_KEY,
};
