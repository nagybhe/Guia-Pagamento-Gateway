const express = require("express");
const axios = require("axios");
const { apiBaseUrl, apiKey } = require("../config/api");

const router = express.Router();

function convertToBase64(field) {
    if (!field) return field;
    if (Buffer.isBuffer(field)) return field.toString("base64");
    if (typeof field === "string") return field; // assume já base64
    return Buffer.from(field).toString("base64");
}

function convertDocumentos(data) {
    if (Array.isArray(data)) {
        return data.map(item => {
            if (item.documentoImpressao) item.documentoImpressao = convertToBase64(item.documentoImpressao);
            if (item.zipDownload) item.zipDownload = convertToBase64(item.zipDownload);
            return item;
        });
    }
    if (typeof data === "object" && data !== null) {
        if (data.documentoImpressao) data.documentoImpressao = convertToBase64(data.documentoImpressao);
        if (data.zipDownload) data.zipDownload = convertToBase64(data.zipDownload);
    }
    return data;
}

async function emitirDARE(req, res, tipo) {
    try {
        const payload = req.body;
        const url = `${apiBaseUrl}/dare-${tipo}/emitir`;

        const response = await axios.post(url, payload, {
            headers: {
                "Content-Type": "application/json",
                "api-key": apiKey,
            },
            responseType: "json",
        });

        let data = response.data;

        if (data.itensParaGeracao) {
            data.itensParaGeracao = convertDocumentos(data.itensParaGeracao);
        } else {
            data = convertDocumentos(data);
        }

        res.status(200).json(data);
    } catch (error) {
        console.error(`Erro ao emitir DARE ${tipo}:`, error.response?.data || error.message);
        res.status(500).json({
            error: `Erro ao emitir DARE ${tipo}`,
            detail: error.response?.data || error.message,
        });
    }
}

router.post("/dare-unitario/emitir", (req, res) => emitirDARE(req, res, "unitario"));
router.post("/dare-lote/emitir", (req, res) => emitirDARE(req, res, "lote"));

module.exports = router;
