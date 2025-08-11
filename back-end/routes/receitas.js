// routes/receitas.js
const express = require("express");
const axios = require("axios");
const { apiBaseUrl, apiKey } = require("../config/api");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await axios.get(`${apiBaseUrl}/receitas`, {
            headers: {
                "api-key": apiKey,
            },
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Erro ao buscar receitas:", error.response?.data || error.message);
        res.status(500).json({ error: "Erro ao buscar receitas" });
    }
});

module.exports = router;
