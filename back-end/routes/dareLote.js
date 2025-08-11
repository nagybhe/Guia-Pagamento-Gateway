// routes/dareLote.js
const express = require("express");
const axios = require("axios");
const { apiBaseUrl, apiKey } = require("../config/api");

const router = express.Router();

const dareLoteCache = []; // array para armazenar DAREs emitidos em lote

router.post("/emitir", async (req, res) => {
    try {
        const payload = req.body;

        const response = await axios.post(`${apiBaseUrl}/dare-lote/emitir`, payload, {
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
        });

        // Armazena a resposta no cache
        dareLoteCache.push(response.data);

        res.status(200).json(response.data);
    } catch (error) {
        console.error("Erro ao emitir DARE em lote:", error.response?.data || error.message);
        res.status(500).json({
            error: "Erro ao emitir DARE em lote",
            detail: error.response?.data || error.message,
        });
    }
});

// Rota GET para listar todos os DAREs emitidos em lote
router.get("/emitir", (req, res) => {
    res.status(200).json(dareLoteCache);
});

module.exports = router;
