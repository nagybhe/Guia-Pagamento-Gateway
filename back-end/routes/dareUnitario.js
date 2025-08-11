const express = require("express");
const axios = require("axios");
const { apiBaseUrl, apiKey } = require("../config/api");

const router = express.Router();

const dareUnitarioCache = []; // array para armazenar DAREs emitidos

router.post("/emitir", async (req, res) => {
    try {
        const payload = req.body;

        const response = await axios.post(`${apiBaseUrl}/dare-unitario/emitir`, payload, {
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
        });

        // Armazena a resposta no cache
        dareUnitarioCache.push(response.data);

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Erro ao emitir DARE unitário:", error.response?.data || error.message);
        res.status(500).json({
            error: "Erro ao emitir DARE unitário",
            detail: error.response?.data || error.message,
        });
    }
});

// Rota GET para listar todos os DAREs unitários emitidos
router.get("/emitir", (req, res) => {
    res.status(200).json(dareUnitarioCache);
});

module.exports = router;
